var express = require('express');
var router = express.Router();

//1.require mongoose
var mongoose = require('mongoose');

//2.connect
if (mongoose.connect('mongodb+srv://linh796:linh796@cluster0-lbsr0.mongodb.net/bookshop?retryWrites=true&w=majority')){
  console.log('connected to database\n');
}

//3.tạo Schema
var productsSchema = new mongoose.Schema({
  title: String,
  price: Number,
  author: String,
  categoriesID: String,
  publisherID: String,
  info: String,
  img: [String]
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
router.get('/', function (req, res, next) {
  const temp = req.query.search;
  if(req.query.search){
    //escaoe DDOS
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    categories.find()
    .then(function (category) {
      publishers.find()
      .then(function (publisher) {
        products.find({title: regex})
        .then(function (product) {
          var noMatched;
          if(product.length < 1 || categories.length < 1 || publishers.length < 1)
          {
            noMatched = "Rất tiếc chúng tôi không thể tìm thấy \"" + temp + "\" bạn đang tìm!!! :( :( :( ";
          }
          res.render('index', { categories: category, publish: publisher, items: product, noMatched: noMatched});
        });        
      });
    });
  } else{
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
  }
});

router.post('/show-quickly', function(req, res, next){
  products.findById(req.body.idValue, function(err, doc){
    if(err){
      console.log("Can't find with this body\n");
      //return 404
    }else{
      res.render('popup-page', {model: doc, layout: false});
    }
  })
})

//get product-detail
router.get('/product-detail:idProduct', function (req, res, next) {
  products.findById(req.params.idProduct, function (err, doc) {
    if (err) {
      console.log("Can't show item\n");
      //return 404
    } else {
      res.render('product-detail', {item: doc});
      console.log(doc.info);
    }
  })
})


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


//escape DDoS attack
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
