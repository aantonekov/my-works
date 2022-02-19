const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment');

const upload = require('multer')();
const Ajv = require('ajv');
const ajv = new Ajv();

const userUpdateSchema = require('./Schemas/userUpdateSchema.json');

const authUsersCtrl = require('../controller/authUsers');
const { uploadsSingle } = require('../controller/uploadSingle');

router.post('/', upload.none(), async (req, res, next) => {
  const { accessToken } = req.body;

  if(!accessToken) {
      return res.json({ status: 'not user' });
  }

  next();
});

router.get('/editProfile', (req, res) => {
  res.render('editProfile');
});

router.post('/currentProfile', async (req, res) => {
    const { accessToken, refreshToken } = req.body;

    if(!accessToken) {
      return res.json({ status: 'not user' });
    }
    else {
      const info = await authUsersCtrl.findUserByToken(accessToken);
      const birthDate = moment(info.birthday).format('YYYY-MM-DD');
      const profile = {
        id: info.id,
        firstName: info.firstName,
        secondName: info.secondName,
        birthday: birthDate,
        email: info.email,
        phone: info.phone,
        userPhoto: info.userPhoto
      }

      const tokens = await authUsersCtrl.updateTokens( accessToken, refreshToken );
   
      return res.json({
        status: 'ok',
        profile,
        accessToken: tokens.payload.accessToken,
        refreshToken: tokens.payload.refreshToken
      });
    }
});
  
router.post('/editProf', uploadsSingle, async (req, res) => {
    const { filename } = req.file;
    const data = req.body;
    const userPhoto = `/images/avatars/${filename}`;
  
    const validate = ajv.compile(userUpdateSchema);
    const valid = validate(data);
  
    if (!valid) {
        const result = {
          status: 'invalid data',
          payload: { errors: validate.errors }
        };
  
        res.json( result );
        return;
    };
  
    const userProfile = {
      id: data.userId,
      firstName: data.firstName,
      secondName: data.secondName,
      birthday: data.birthday,
      age: data.age,
      email: data.email,
      phone: data.phone,
      userPhoto: userPhoto,
    };
  
    const userInfo = await authUsersCtrl.updateUserInfo(userProfile);
    console.log(userInfo);
  
    res.json({ status: 'ok' });
});

router.post('/editPass', upload.none(), async (req, res) => {
  const data = req.body;

  const userInfoPass = { id: data.userId, pwdUser: data.carrentUserPwd, newPwd: data.newUserPwd };

  const userChangePwd = await authUsersCtrl.updateUserPwd(userInfoPass);
  console.log(userChangePwd);

  res.json({ status: 'ok', userChangePwd})

});
  
  
module.exports = router;
  