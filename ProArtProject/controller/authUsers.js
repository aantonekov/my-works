require('../bin/runners/db/db');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const uniqid = require('uniqid');

const getPrivatekey = require('./getPrivatekey');
const getPublickey = require('./getPublicKey');

const userModel = require('../models/userModel');
const refreshTokenModel = require('../models/refreshTokenModel');

const createUser = async (userProfile) => {
    const doc = await userModel.create(userProfile);
    return doc;
};

const findUserByToken = async (accessToken) => {

    if(!accessToken) {
        return ({ status: 'not user'});
    };

    const { id } = await checkTokenAndDecode(accessToken);
    const doc = await userModel.findOne({ _id: id });
    return doc;
};

const updateUserInfo = async (profile) => {

    const doc = await userModel.findOneAndUpdate(
        { _id: profile.id },
        {
            id: profile.id,
            firstName: profile.firstName,
            secondName: profile.secondName,
            birthday: profile.birthday,
            age: profile.age,
            email: profile.email,
            phone: profile.phone,
            userPhoto: profile.userPhoto
        }
    );
    return doc;
};

const updateUserPwd = async (data) => {
    console.log(data);

    const doc = await userModel.findOne({ _id: data.id });
    console.log('doc.hashPwd', doc.hashPwd)

    const check = await doc.checkPwd(data.pwdUser);
    if(!check) {
        return { status: 'Failed checking passwords' };
    };

    doc.pwdUser = data.newPwd[0];
    const newDoc = await doc.save();

    console.log('newDoc: ', newDoc.hashPwd);

    return {status: 'success'}    
};

const createAccessToken = async (payload) => {
    const privateKey = await getPrivatekey();
    
    {
        const now = moment();

        if (payload.exp && moment(payload.exp) < now) {
            delete (payload.exp);
        }

        if (!payload.exp) {
            const exp = Number(now.add(1, 'mm')); 
            payload.exp = exp;
        }
    }
    
    const token = jwt.sign(
        payload,
        privateKey,
        { algorithm: 'RS256'}
    );

    return token;
};

const checkTokenAndDecode = async (token) => {
    const publicKey = await getPublickey();
    const result = await jwt.verify(token, publicKey);

    if(!result) {
        return { status: 'invalid token' };
    }
    return result;
};

const createRefreshToken = async (accessT) => {
    const refreshToken = uniqid();
    const { id } = await checkTokenAndDecode(accessT);
    await refreshTokenModel.create({ tokenID: refreshToken, userId: id });
    return refreshToken;
};

const signNewUser = async (userProfile) => {
    const doc = await userModel.findOne({ 'login': userProfile.login });
    if(!doc) {
        const newUser = await createUser(userProfile)
        return {status: `New user ${newUser.login} added`};
    };

    const check = doc.checkPwd(userProfile.pwdUser);
    if(!check) {
        return { status: 'Failed checking passwords' };
    };

    const accessToken = await createAccessToken({id: doc.id, login: doc.login, role: doc.role });
    const refreshToken = await createRefreshToken( accessToken );

    return { status: 'ok', payload: { doc, accessToken, refreshToken }};
};

const enteringUser = async (data) => {
    const doc = await userModel.findOne({ 'login': data.login });
    
    if(!doc) {
        return {status: 'client not declare'};
    };

    const check = await doc.checkPwd(data.pwdUser);
    if(!check) {
        return { status: 'Failed checking passwords' };
    };

    const accessToken = await createAccessToken({id: doc.id, login: doc.login, role: doc.role });
    const refreshToken = await createRefreshToken( accessToken );

    return { status: 'ok', payload: { doc, accessToken, refreshToken }};
};

const updateTokens = async (accessT, refreshT) => {

    const result = await checkTokenAndDecode(accessT);

    if (!result) {
        return { status: 'invalid acsecctoken' };
    }
    delete(result.exp);

    const doc = await refreshTokenModel.findOne({
        'tokenID': refreshT,
        'userId': result.id
    });
    doc.remove();

    if(!doc) {
        return { status: 'refreshToken non declare' };
    };

    const profile = {
        status: 'ok',
        id: result.id,
        login: result.login,
        role: result.role
    };

    const accessToken = await createAccessToken({ id: profile.id, login: profile.login, role: profile.role  });
    const refreshToken = await createRefreshToken( accessToken );

    return { status: 'ok', payload: { profile, accessToken, refreshToken }};
};

module.exports = {
    createUser,
    findUserByToken,
    updateUserInfo,
    signNewUser,
    checkTokenAndDecode,
    enteringUser,
    updateTokens,
    updateUserPwd
};
