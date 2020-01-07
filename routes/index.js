var express = require('express');
var router = express.Router();

const controllerProduct =require('../controllers/product.controller');
const controllerComment = require('../controllers/comment.controller');
const controllerCart = require('../controllers/cart.controller');
const controllerOrder = require('../controllers/order.controller');
const controllerUser = require('../controllers/user.controller');

/* GET home page. */
router.get('/', controllerProduct.index);

/* GET search. */
router.get('/search', controllerProduct.search);


/* GET show-quickly. */
router.get('/show-quickly', controllerProduct.show_quickly);

/* GET product-detail. */
router.get('/product-detail', controllerProduct.product_detail);

//POST comment in product-detail
router.post('/product-detail', controllerComment.post_comment);

router.get('/page-comment', controllerComment.get_comment);

//add to cart
router.post('/add-to-cart', controllerCart.add_to_cart);

//remove item from cart
router.delete('/remove-product', controllerCart.remove_item);

//increase number item
router.put('/increase-product', controllerCart.increase_item);

router.put('/descrease-product', controllerCart.descrease_item);

router.get('/contact',function(req, res, next) {
  res.render('contact');
});

router.get('/order',function(req, res, next) {
  res.render('order');
});

router.get('/shopping-cart', controllerCart.viewCart);

router.get('/about',function(req, res, next) {
  res.render('about');
});

router.get('/checkout', controllerCart.fillCheckout);

router.post('/checkout', controllerOrder.checkout);
router.post('/update-order-address', controllerUser.updateOrderAddress);

module.exports = router;
