const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment');

const upload = require('multer')();
const Ajv = require('ajv');
const ajv = new Ajv();

const authUsersCtrl = require('../controller/authUsers');
const albumCtrl = require('../controller/albumsCtrl');
const photoalbumCtrl = require('../controller/photoalbumCtrl');
const wayForPay = require('../controller/wayForPay');

router.get('/photoalbum/:login/:name/:id', (req, res) => {
    res.render('photoalbum', { title: 'Photo album'});
});

router.post('/photoalbum/info', upload.none(), async (req, res) => {
    const { albumId, photograph } = req.body;

    const albumData = await photoalbumCtrl.albumInfo(albumId, photograph);

    res.json({ status:'ok', albumData });
});

router.post('/photoalbum/orderInfo', upload.none(), async (req, res) => {
    const orderData = req.body;

    const orderDoc = await photoalbumCtrl.orderCreate(orderData);
    res.json({ status:'ok', orderDoc });
});

router.post('/photoalbum/userOrderInfo', upload.none(), async (req, res) => {
    const data = req.body;

    const orderFull = await photoalbumCtrl.userInfoPushToOrder(data);
    const infoForPay = await wayForPay.createNew(orderFull);
    console.log(infoForPay);

    res.json({
        status:'ok',
        reason: infoForPay.reason,
        url: infoForPay.invoiceUrl 
    });
});

module.exports = router;
