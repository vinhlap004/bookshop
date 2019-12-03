var express = require('express');
var router = express.Router();
const controllerUser = require('../controllers/user.controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login',function(req, res, next) {
  res.render('login');
});

router.post('/login',controllerUser.login);

router.get('/logout',controllerUser.logout);

router.get('/register',function(req, res, next) {
  res.render('register');
});

router.post('/register',controllerUser.register);

module.exports = router;
