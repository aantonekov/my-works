const jwt = require('jsonwebtoken');
const getPrivKey = require('../../controllers/getPrivKey');

module.exports = function (req,res,rext) {
    if( req.method === 'OPTIONS') {
        next()
    }

    try{
        const token = req.headers.authorization.splin("")[1];
        if(!token) {
           return res.status(403).json({message:"Пользователь не авторизован"})
        }
        const privKey = getPrivKey();
        const decodedData = jwt.verify(token, privKey);
        req.user = decodedData;
        next();
    }catch(err){
        console.log("errors: ",err);
        return res.status(403).json({message:"Пользователь не авторизован"})
    }
}