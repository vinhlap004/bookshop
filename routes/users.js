var express = require('express');
var router = express.Router();
var passport = require('passport');
const controllerUser = require('../controllers/user.controller');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', controllerUser.getLogin); 

//router.post('/login',controllerUser.login);
router.post('/login', controllerUser.login);

router.get('/logout',controllerUser.logout);

router.get('/register',controllerUser.getRegister);


//router.post('/register',controllerUser.register);

router.post('/register', passport.authenticate('register',{
  successRedirect: '/',
  failureRedirect: 'register',
  failureFlash: true
}))
/*
router.post('/register', function(req,res){

  console.log('NAME: ' + req.body.name);
  console.log('PHOEN: ' + req.body.phonenumber);
})*/

module.exports = router;
