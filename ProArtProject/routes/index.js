const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment');

const upload = require('multer')();
const Ajv = require('ajv');
const ajv = new Ajv();

const authUsersCtrl = require('../controller/authUsers');

router.get('/', (req, res) => {
  res.render('index', { title: 'Login'});
});

router.get('/agreement', (req, res) => {
  res.render('agreement', { title: 'Agreement'});
});

router.post('/userInfo', async (req, res) => {
  const { accessToken } = req.body;
  const info = await authUsersCtrl.findUserByToken(accessToken);

  const profile = {
    id: info.id,
    login: info.login,
    userPhoto: info.userPhoto
  }

  res.json({ status: 'ok', profile });
})



module.exports = router;
