const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment');

const upload = require('multer')();
const Ajv = require('ajv');
const ajv = new Ajv();

const { uploadsSingle } = require('../controller/uploadSingle');
const authUsersCtrl = require('../controller/authUsers');

const userSignSchema = require('./Schemas/userSignSchema.json');
const userLoginSchema = require('./Schemas/userLoginSchema.json');

router.post('/loginWindow', upload.none(), async (req, res) => {
    const data = req.body;

    const validate = ajv.compile(userLoginSchema);
    const valid = validate(data);
  
    if (!valid) {
        const result = {
          status: 'invalid data',
          payload: { errors: validate.errors }
        };
  
        res.json( result );
        return;
    };

    const loginUser = await authUsersCtrl.enteringUser(data);

    res.json({ status: 'ok', loginUser });
});

router.post('/signWindow', uploadsSingle, async (req, res) => {
    const { filename } = req.file;
    const data = req.body;
    const userPhoto = `/images/avatars/${filename}`;

    const validate = ajv.compile(userSignSchema);
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
        login: data.login,
        firstName: data.firstName,
        secondName: data.secondName,
        birthday: data.birthday,
        age: data.age,
        email: data.email,
        phone: data.phone,
        pwdUser: data.pwdUser,
        userPhoto: userPhoto,
        role: 'photographer',
        status: true,
    };

    const newUser = await authUsersCtrl.createUser(userProfile);

    res.json({ status: 'ok', newUser });
});



module.exports = router;