require('../bin/runners/db/db');
const moment = require('moment');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const userModel = require('../models/userModel');
const albumModel = require('../models/albumModel');
const orderModel = require('../models/orderModel');

const albumInfo = async (id, photograph) => {

    const docUser = await userModel.findOne({ login: photograph });
    const docAlbum = await albumModel.findOne({ _id: id });

    const userProfile = {
        firstName: docUser.firstName,
        secondName: docUser.secondName,
        email: docUser.email,
        userPhoto: docUser.userPhoto
    };

    return { userProfile, docAlbum }
};

const orderCreate = async (data) => {

    let arrlength = data.photoId.length;
    let arrPrice = [];
    let arrCount = [];
    while (arrlength) {
        arrPrice.push('1');
        arrCount.push('1');
        arrlength--;
    };
    
    const orderInfo = {
        orderId: uuidv4(),
        amount: {
            sum: (data.photoCount * data.photoPrice),
            currency: 'UAH'
        },
        products: {
            photoId: data.photoId,
            photoPrice: arrPrice,
            photoCount: arrCount
        }
    };

    const doc = await orderModel.create(orderInfo);
    return doc;
};

const userInfoPushToOrder = async (data) => {

    const filter = { 'orderId': data.orderId };
    const recipient = {
        'recipient': {
            clientFirstName: data.clientFirstName,
            clientLastName: data.clientLastName,
            clientEmail: data.clientEmail,
            clientPhone: data.clientPhone
        }
    };

    const orderDoc = await orderModel.findOneAndUpdate(filter, recipient);
    const doc = orderModel.findOne({ orderId: data.orderId })

    return doc;
};


module.exports = {
    albumInfo,
    orderCreate,
    userInfoPushToOrder,
}