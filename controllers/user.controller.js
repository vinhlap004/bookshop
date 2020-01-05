const users = require('../model/user.model');
const bcrypt = require('bcrypt');
const passport = require('passport');
var nodemailer = require("nodemailer");

const carts = require('../model/cart.model');

var handlebars = require('hbs');
handlebars.registerHelper("setVar", function(varName, varValue, options) {
  options.data.root[varName] = varValue;
});


module.exports.login = function(req, res, next) {
    passport.authenticate('login', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.render('login', {message: info.message}); }
      req.logIn(user, async function(err) {
        if (err) { return next(err); }
        
        
        if (req.session.cart){
          //replace cart in user's database
          req.session.cart = await carts.update(req.session.cart, user.id);
          }else{
          //move add from database to session
          req.session.cart = await carts.get(user.id);
          } 
        return res.redirect('/'); 
      });
    })(req, res, next);
  }
 

// Logout

module.exports.logout = async function(req, res, next) {
  req.logout();
  req.session.cart = null;
  res.locals.session.cart = null;
  res.render('login', {message: 'Bạn đã đăng xuất'});
}

module.exports.getRegister = function(req, res, next){
  res.render('register', {message: req.flash('message')});
}

module.exports.getLogin = function(req, res, next){
  res.render('login');
}

// fogetpassword

module.exports.forgetPassword = function(req, res, next)
{
    var smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
          user: "bookshop796@gmail.com",
          pass: "bookshop123123"
      }
  });
    var rand,mailOptions,host,link;

    rand=Math.floor((Math.random() * 20000) + 54);
    host=req.get('host');
    link="http://"+req.get('host')+"/reset-password?id="+rand+"&username="+req.body.email;
    mailOptions={
        to : req.body.email,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
            console.log(error);
        res.end("error");
    }else{
            console.log("Message sent: " + response.message);
        res.end("sent");
        }
  });
}

// resetpassword
module.exports.reserpassword = async function(req,res,next)
{
    console.log("ac",req.query.id,req.query.username);
}

module.exports.getprofile = function(req,res,next)
{
  if(res.locals.user)
  {
    const currenUser=res.locals.user;
    console.log("abc",currenUser.name,currenUser.phonenumber,currenUser.address);
    res.render('profile',{name: currenUser.name, phone: currenUser.phonenumber,address: currenUser.address});
  }
  else{
    res.render('login');
  }
}

//profile
module.exports.profile = async function(req,res,next){
  if(res.locals.user)
  {
    let err=[];
    const currenUser=res.locals.user;
    const {name, phone,address, password, newpassword, verifyPassword}=req.body;
    //check requied fields 
	  if (!name || !phone || !address) {
		  err.push({msg: 'Bạn không thể cập nhật các thông tin về rỗng!'});
	  } 
	  //check phone number
	  else if(parseInt(phone)<=0 || isNaN(parseInt(phone))){
		  err.push({msg: 'Số điện thoại không hợp lệ!'});
	  }
	  if (err.length > 0) {
		  res.render('profile', {err,name, phone,address, password, newpassword, verifyPassword});
    }
    else{
      const userUpdate = await users.getUserByID(currenUser.id);
      userUpdate.name = name;
      userUpdate.phonenumber =phone;
      userUpdate.address=address;

      if(!password || !newpassword|| !verifyPassword)
      {

      }
      else{
        console.log("password!='' && newpassword!=''&& verifyPassword!=''");
        if(password!= newpassword)
        {
          console.log("password!= newpassword");
        if(newpassword != verifyPassword)
          {
            err.push({msg: 'Mật khẩu mới và xác nhận mật khẩu không đúng!'});
            res.render('profile',{err, name, phone, address, password, newpassword, verifyPassword});
          }
          else{
            // Match password
            bcrypt.compare(password, userUpdate.password, (err1, isMatch) => {
              if(err1) throw err1;
              if(!isMatch)
              {
                  err.push({msg:'Mật khẩu không đúng!!'});
                  res.render('profile',{err,name, phone,address, password, newpassword, verifyPassword});
              }
              else {
                console.log("asdasdasd");
                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(newpassword, salt, async (err, hash) => {
                    if (err) throw err;
                    userUpdate.password = hash;
                    await userUpdate.save();
                    res.render('profile', {message: 'Cập nhật tài khoản thành công!'});
                  });
                });
              }
            });
          }
        }
      }
      userUpdate.save();
      res.render('profile', {message: 'Cập nhật tài khoản thành công!',name, phone,address});
    }
  }else{
    res.render('login');
  }
}