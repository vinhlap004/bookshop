var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index');
});
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/login',function(req, res, next) {
  res.render('login');
});
router.get('/register',function(req, res, next) {
  res.render('register');
});
router.get('/contact',function(req, res, next) {
  res.render('contact');
});
router.get('/order',function(req, res, next) {
  res.render('order');
});
router.get('/product-detail',function(req, res, next) {
  res.render('product-detail');
});
router.get('/shoping-cart',function(req, res, next) {
  res.render('shoping-cart');
});
router.get('/about',function(req, res, next) {
  res.render('about');
});
router.get('/forget-password',function(req, res, next) {
  res.render('forget-password');
});



module.exports = router;
