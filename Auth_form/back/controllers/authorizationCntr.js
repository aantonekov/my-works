const UserModel = require('../models/user');
const RoleModel = require('../models/role');
const RefreshTModel = require('../models/refreshTModel');

const jwt = require('jsonwebtoken');
const moment = require('moment');
const uniqid = require('uniqid');
const getPrivKey = require('./getPrivKey');
const getPubKey = require('./getPubKey');


const createUser = async ( userLogin,  userName, role, pwd ) => {
    try{
        const candidate = await UserModel.findOne({userLogin});

        if(candidate){
            return {status: 'dublicate_name'};
        }
        const role = await RoleModel.findOne({value:"USER"})
        const create = await UserModel.create({ userLogin, userName, role:[role.value], pwd});

        const { id } = create;
        return { status: 'ok', payload: {id} };
        

    }catch(err){
        
        console.log(err);
    }
};


const createAccessToken = async (payload) => { 
    const privateKey = await getPrivKey();
    
    { 
        const now = moment();   

        if (payload.exp && moment(payload.exp) < now) {    
            delete (payload.exp);           
        }

        if (!payload.exp) {                
            const exp = Number(now.add(30, 'm'));   
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
    const publicKey = await getPubKey();
    const result = await jwt.verify(token, publicKey);

    if(!result) {
        return { status: 'invalid token' };
    }

    return result;
};


const createRefreshToken = async (accessToken) => {
    const refreshToken = uniqid();     
    const { id } = await checkTokenAndDecode(accessToken);
    await RefreshTModel.create({ tokenID: refreshToken, userId: id }); 
    return refreshToken;
};


const login = async (userLogin, pwd) => {
    
    const doc = await UserModel.findOne({ userLogin: userLogin });

    if(!doc) {
        return {status: 'client not declare'};
    }

    const check = doc.checkPwd(pwd);
    if(!check) {
        return { status: 'invalid password' };
    }

    const profile = {
        id:doc._id,
        userLogin:  doc.userLogin,
        userName: doc.userName,
        role:doc.role
    }

    const accessToken = await createAccessToken({id: doc.id, login: doc.login});
    const refreshToken = await createRefreshToken( accessToken );

    console.log('accessToken: ', accessToken);
    console.log('refreshToken: ', refreshToken);
    return { status: 'ok', payload: { profile, accessToken, refreshToken }};
    
};


const updateTokens = async (accessT, refreshT) => {

    const result = await checkTokenAndDecode(accessT);

    if (!result) {
        return { status: 'invalid acsecctoken' };
    }

    delete(result.exp);

    console.log('updateTokens: ', refreshT);

    const doc = await RefreshTModel.findOne({
        'tokenID': refreshT,
        'userId': result.id
    });

    console.log('doc: ', doc);

    doc.remove();

    if(!doc) {
        return { status: 'refreshToken non declare' };
    };

    const profile = {
        status: 'ok',
        id: result.id,
        nameUser: result.name,
    };

    const accessToken = await createAccessToken({ id: profile.id, name: profile.nameUser });
    const refreshToken = await createRefreshToken( accessToken );

    return { status: 'ok', payload: { profile, accessToken, refreshToken }};
};


module.exports = {
    createUser,
    login,
    checkTokenAndDecode,
    updateTokens
}