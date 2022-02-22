const express = require('express');
const router = express.Router();
const upload = require('multer')();

const authContr = require('../controllers/authorizationCntr')
const authMW = require('./MW/authMW')
const roleMW = require('./MW/roleMW')
/* GET home page. */
router.get('/apiAuthRouter', function(req, res, next) {
  res.render('index');
});

router.post('/registerUser', upload.none(), async (req,res) => {
 
  const {userLogin, userName, role, pwd } = req.body;

  console.log('req,body',req.body);

  const result = await authContr.createUser( userLogin,  userName, role, pwd ) 

  if (result.status === 'dublicate_name') {
      res.json({ status: 'dublicate_name'});
      return;
  }
  console.log('registerUser rout result:',result);
  // res.cookie('accessT', result.payload.accessT,  ) // названия в кукисах,  то что нужно поместить, секюр {httpOnly: true}
  res.json({ status: 'ok', payload: { id: result.payload.id , name: result.payload.name }})
 

})

router.post('/login', upload.none(),  async (req, res) => {

  const data = req.body;
  
  const result = await authContr.login(data.userLogin, data.pwd);
  
  console.log('enterUser: ',  result);

  if([`client ${data.userLogin} not declare`,  'invalid password' ].includes(result.status)){
    res.json({status: 'Invalid username or password'});
    return;
  }

  // res.cookie('accessT', data.payload  )
  // console.log('rout accessT:' ,authContr.login.payload);

  res.json({status: result.status, user: result})

})

router.post('/checkStorage', upload.none(), async (req, res) => {
  const { accessToken, refreshToken } = await req.body;

  const resultUpdating = await authContr.updateTokens(accessToken, refreshToken);

  res.json({ status: 'ok', result: resultUpdating.payload.profile.nameUser });
});







module.exports = router;
