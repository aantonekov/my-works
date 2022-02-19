const apiKey = 'flk3409refn54t54t*FNJRET';
const url = 'https://api.wayforpay.com/api'; // Запрос c необходимыми параметрами формируется на стороне торговца и передается методом POST по протоколу HTTP на URL
const apiParams = {
    merchantAccount: 'test_merch_n1',  // Идентификатор продавца. Данное значение присваивается Вам со стороны WayForPay
    merchantDomainName: 'http://localhost:11000/',  //Доменное имя веб-сайта торговца
    apiVersion: 1,  // Версия протокола. Значение по-умолчанию: 1
    language: 'UA'  // Язык на котором будет выставлен invoice. RU, UA, EN
};

module.exports = {
    apiKey,
    url,
    apiParams
};
