require('../bin/runners/db/db');
const moment = require('moment');

const orderModel = require('../models/orderModel');

const ordersData = async () => {
    const orders = await orderModel.find({});
    return orders;
}

module.exports = {
    ordersData
}
