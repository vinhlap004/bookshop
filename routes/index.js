var express = require('express');
var router = express.Router();

const controllerProduct =require('../controllers/products.controller');

/* GET home page. */
router.get('/', controllerProduct.index);


/* GET search. */
router.get('/search', controllerProduct.search);


/* GET show-quickly. */
router.get('/show-quickly/', controllerProduct.show_quickly);

/* GET product-detail. */
router.get('/product-detail', controllerProduct.product_detail);

router.get('/contact',function(req, res, next) {
  res.render('contact');
});

// router.get('/login',function(req, res, next) {
//   res.render('login');
// });

router.get('/login',function(req, res, next) {
  res.render('login');
});

router.get('/register',function(req, res, next) {
  res.render('register');
});

router.post('/register',(req,res)=> {
    // get username, password, confirmpassword,name,email,phonenumber in register form
    const{username, password, confirmpassword,name,email,phonenumber}=req.body;
    let errors=[];

    // check required fields
    if(!username || !password||!confirmpassword || !name || !email || !phonenumber ){
        errors.push({msg:'Bạn nhập thiếu thông tin!!'});
    }
    
    // check password match
    if(password !== confirmpassword){
      errors.push({msg:'Xác nhận mật khẩu không đúng!!'});
    }

    // check pass length
    if(password.length<6){
      errors.push({msg:'Chiều dài mật khẩu phải lớn hơn 6 kí tự'});
    }
    
    if(errors.length > 0)
    {
      res.render('register',{errors});
    }else{
      res.send('pass');
    }


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
