const axios = require('axios');
const crypto = require('crypto');
const configW4P = require('../config/wayForPay');

const { apiKey, url, apiParams} = configW4P;

// В целях подтверждения валидности данных должна быть сгенерирована и
// передана в запросе HMAC_MD5 контрольная подпись с использованием SecretKey торговца.
const createSignature = (strData) => {  // цифровая подпись запроса
    const hmac = crypto.createHmac('md5', apiKey)
        .update(strData)
        .digest('hex');
    
    return hmac;  
};

// создаем новый INVOICE
const createNew = async (orderInfo) => {

    const { orderId, amount, products, recipient } = orderInfo;

    const data = {
        transactionType: 'CREATE_INVOICE',                // default
        merchantAccount: apiParams.merchantAccount,       // config
        merchantDomainName: apiParams.merchantDomainName, // config
        apiVersion: apiParams.apiVersion,                 // config
        language: apiParams.language,                     // config
        orderReference: orderId,    // Уникальный номер invoice в системе торговца
        orderDate: Date.now(),      // only timestamp  -- Дата размещение заказа
        orderTimeOut: 60*60*24*12,  // invoice lifetime -- default 1 hour
        amount: amount.sum,         // Сумма к оплате
        currency: amount.currency,  // Валюта заказа UAH
        productName: products.photoId,   // Массив с наименованием заказанных товаров
        productPrice: products.photoPrice, // Массив с ценами за единицу товара.
        productCount: products.photoCount  // Массив с количеством заказанного товара по каждой позиции.
    }

    // add contacts and name if exist

    if (recipient.firstName) {   // Имя клиента (минимальная длина1 символ)
        data.clientFirstName = recipient.firstName
    }
    if (recipient.secondName) {  // Фамилия клиента (минимальная длина1 символ)
        data.clientlastName = recipient.secondName
    }

    // если email клиента не задан, то уведомление клиенту об invoice не будет отправлено, но в ответе будет отдан invoiceUrl.
    if (recipient.email) {       // Email клиента, на который будет отправлен invoice
        data.clientlastName = recipient.email
    }
    if (recipient.phone) {       // Номер телефона клиента (минимальная длина 9 максимальная 13 цифр)
        data.clientlastName = recipient.phone
    }

    // createSignature()

    // Строка, подлежащая HMAC_MD5, генерируется путем конкатенации парамаетров
    // merchantAccount, merchantDomainName, orderReference, orderDate, amount, currency,
    // productName[0], productName[1]..., productName[n],
    // productCount[0], productCount[1], ..., productCount[n],
    // productPrice[0], productPrice[1],..., productPrice[n]
    // разделенных “;” (точка с запятой) в кодировке UTF-8

    {
        const strData = [
            data.merchantAccount,
            data.merchantDomainName,
            data.orderReference,
            data.orderDate,
            data.amount,
            data.currency,
            data.productName.join(';'),
            data.productPrice.join(';'),
            data.productCount.join(';')
        ].join(';');

        data.merchantSignature = createSignature(strData);
    }

    const response = await axios.post(url, data);
    return response.data;
};

const remove = async (invoiceRef) => {

    const data = {
        transactionType: 'REMOVE_INVOICE',
        apiVersion: apiParams.apiVersion,
        merchantAccount: apiParams.merchantAccount,
        orderReference: invoiceRef
    }

    // create Signature
    {
        const strData = [
            data.merchantAccount,
            data.orderReference
        ].join(';');

        data.merchantSignature = createSignature(strData);
    }

    const response = await axios.post(url, data);
    return response.data;
};

module.exports = {
    createNew,
    remove
};
