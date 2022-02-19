const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment');

const upload = require('multer')();
const Ajv = require('ajv');
const ajv = new Ajv();

const { uploadsArray } = require('../controller/uploadSingle');
const authUsersCtrl = require('../controller/authUsers');
const albumCtrl = require('../controller/albumsCtrl');

router.get('/myAlbums', (req, res) => {
    res.render('myAlbums');
});

router.post('/myAlbums', upload.none(), async (req, res, next) => {
    const { accessToken } = req.body;
  
    if(!accessToken) {
        return res.json({ status: 'not user' });
    }
  
    next();
});

router.get('/:name/:id', (req, res) => {
    res.render('albumPage');
});

router.post('/createAlbum', uploadsArray, async (req, res) => {
    const data = req.body;
    const fileEl = req.files;
    const fileName = fileEl.map( elem => elem.filename);

    const accessToken = await authUsersCtrl.checkTokenAndDecode(data.accessToken);

    const albumData = {
        name: data.name,
        description: data.description,
        price: data.price,
        userId: accessToken.id,
        userLogin: accessToken.login
    };

    const newAlbum = await albumCtrl.createAlbum(albumData, fileName);
    res.json({ status:'ok', nameAlbum: newAlbum.name });
});

router.post('/albumsInfo', async (req, res) => {
    const { accessToken, refreshToken } = req.body;

    if(!accessToken) {
        return res.json({ status: 'not user' });
    }
    else {
        const albums = await albumCtrl.findAlbumInfo();
        const tokens = await authUsersCtrl.updateTokens( accessToken, refreshToken );
        const tokensData = await authUsersCtrl.checkTokenAndDecode(accessToken);

        const userProfile = {
            userId: tokensData.id,
            login: tokensData.login
        };

        return res.json({
            status:'ok',
            albums,
            userProfile,
            accessToken: tokens.payload.accessToken,
            refreshToken: tokens.payload.refreshToken
        });
    }
});

router.post('/albumDelete', upload.none(), async (req, res) => {
    const data = req.body;
    const deleteAlbum = await albumCtrl.deleteAlbum(data);
    res.json({ status: deleteAlbum });
});

router.post('/imagesInfo', upload.none(), async (req, res) => {
    const data = req.body;
    console.log(data);

    const imagesData = await albumCtrl.imagesFromAlbums(data.id);
    const accessToken = await authUsersCtrl.checkTokenAndDecode(data.accessToken);
    res.json({ status:'ok', imagesData: imagesData, userId: accessToken.id, login: accessToken.login });
});

router.post('/addImagesToAlbum', uploadsArray, async (req, res) => {
    const { id } = req.body;
    const fileEl = req.files;
    const fileName = fileEl.map( elem => elem.filename);

    const imagesPush = await albumCtrl.imagesPushToAlbum(id, fileName);
    console.log(imagesPush)

    if(!imagesPush) {
        return res.json({ status: 'invalid data' });
    }
    else {
        return res.json({ status:'ok', imagesPush });
    };

});

router.post('/imgArr', upload.none(), async (req, res) => {
    const {inputElem, albumId} = req.body;

    const arrToDel = await albumCtrl.getImgArrToDelete(inputElem, albumId);

    res.json({ status:'ok' });
});


module.exports = router;