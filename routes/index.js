var express = require('express');
var router = express.Router();

const controllerProduct =require('../controllers/products.controller');

/* GET home page. */
router.get('/', controllerProduct.index);

/* GET search. */
router.get('/search', controllerProduct.search);


/* GET show-quickly. */
router.get('/show-quickly', controllerProduct.show_quickly);

/* GET product-detail. */
router.get('/product-detail', controllerProduct.product_detail);

//POST comment in product-detail
router.post('/product-detail', controllerProduct.post_comment);

router.get('/page-comment', controllerProduct.get_comment);

router.get('/contact',function(req, res, next) {
  res.render('contact');
});

router.get('/order',function(req, res, next) {
  res.render('order');
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
