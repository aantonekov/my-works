const jwt = require('jsonwebtoken');
const getPrivKey = require('../../controllers/getPrivKey');

module.exports = function (role) {
    return function (req,res,next) {

        if( req.method === 'OPTIONS') {
            next()
        }
    
        try{
            const token = req.headers.authorization.splin("")[1];
            if(!token) {
               return res.status(403).json({message:"Пользователь не авторизован"})
            }

            const privKey =  getPrivKey()
            const {roles: userRoles} = jwt.verify(token, privKey);

            let hasRole = false;
            userRoles.forEach(element => {
                if(roles.includes(role)){
                    hasRole = true;
                }
            })

            if(!hasRole){
                return res.status(403).json({message: 'У вас нету доступа'})
            }

            
            next();
        } catch(err) {
            console.log("errors: ",err);
            return res.status(403).json({message:"Пользователь не авторизован"})
        }
    }
}

   