var express = require('express');
var router = express.Router();

const controllerProduct =require('../controllers/products.controller');

/* GET home page. */
router.get('/', controllerProduct.index);

/* GET search by title. */
router.get('/search-title', controllerProduct.search_by_title);

/* GET search by author. */
router.get('/search-author', controllerProduct.search_by_author);

/* GET show-quickly. */
router.get('/show-quickly/', controllerProduct.show_quickly);

/* GET product-detail. */
router.get('/product-detail:id', controllerProduct.product_detail);


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
// router.get('/product-detail', function (req, res, next) {
//   res.render('product-detail');
// });
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
