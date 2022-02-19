const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment');

const upload = require('multer')();
const Ajv = require('ajv');
const ajv = new Ajv();

const authUsersCtrl = require('../controller/authUsers');
const albumCtrl = require('../controller/albumsCtrl');
const orderCtrl = require('../controller/orderCtrl');

router.get('/myOrders', (req, res) => {
    res.render('myOrders');
});

router.post('/myOrders', upload.none(), async (req, res, next) => {
    const { accessToken } = req.body;
  
    if(!accessToken) {
        return res.json({ status: 'not user' });
    }
  
    next();
});

router.get('/myOrders/:id', (req, res) => {
    res.render('myOrders');
});

router.post('/myOrders/ordersData', async (req, res) => {
    const orders = await orderCtrl.ordersData();
    res.json({ status: 'ok', orders });
});




module.exports = router;
