var express = require('express');
var router = express.Router();

//1.require mongoose
var mongoose = require('mongoose');

//2.connect
if (mongoose.connect('mongodb://localhost/shop')) {
  console.log('connect to database');
};


//3.tạo Schema
var productsSchema = new mongoose.Schema({
  title: String,
  price: Number,
  author: String,
  categoriesID: String,
  publisherID: String,
  info: String,
  img: String
}, { collection: 'products' });

var categoriesSchema = new mongoose.Schema({
  categoriesID: String,
  categories: String
}, { collection: 'categories' });

var publisherSchema = new mongoose.Schema({
  publisherID: String,
  publisher: String
}, { collection: 'publishers' });

//4.tạo model
var products = mongoose.model('products', productsSchema);
var categories = mongoose.model('categories', categoriesSchema);
var publishers = mongoose.model('publishers', publisherSchema);


/* GET home page. */
// router.get('/index', function(req, res, next) {
//   res.render('index');
// });
// router.get('/', function(req, res, next) {
//   res.render('index');
// });


/* GET home page. */
router.get('/', function (req, res, next) {
  categories.find()
    .then(function (category) {
      publishers.find()
        .then(function (publisher) {
          products.find()
            .then(function (product) {
          res.render('index', { categories: category, publish: publisher, items: product});
            });        
        });
    });
});

router.get('/index', function (req, res, next) {
  categories.find()
    .then(function (category) {
      products.find()
        .then(function (product) {
          res.render('index', { categories: category, items: product, publisher: publisher });
        });
    });
});


/* end GET home page. */

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
