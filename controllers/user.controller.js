const userModel = require('../model/user.model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const nodemailer = require("nodemailer");
const crypto = require('crypto');

const cartModel = require('../model/cart.model');

var handlebars = require('hbs');
handlebars.registerHelper("setVar", function(varName, varValue, options) {
  options.data.root[varName] = varValue;
});


module.exports.login = function(req, res, next) {
    passport.authenticate('login', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.render('login', {message: info.message}); }
      if(user.isActive)
      {
      req.logIn(user, async function(err) {
        if (err) { return next(err); }
        
        if (req.session.cart){
          //replace cart in user's database
          req.session.cart = await cartModel.syncCart(req.session.cart, user.id);
          }else{
          //move add from database to session
          req.session.cart = await cartModel.get(user.id);
          } 
        return res.redirect('/'); 
        
      });
    }
    else{
      return res.render('login',{message: "Vui lòng xác thực tài khoản của bạn trước khi đăng nhập"}); 
    }
    })(req, res, next);
  }
 

// Logout

module.exports.logout = async function(req, res, next) {
  if (!req.user){
    res.render('login');
  }else{
    req.logout();
    req.session.cart = null;
    //res.locals.session.cart = null;
    req.user = null;
    res.send();
  }
  
}

module.exports.getRegister = function(req, res, next){
  res.render('register', {message: req.flash('message')});
}

module.exports.getLogin = function(req, res, next){
  res.render('login');
}

// fogetpassword

module.exports.forgetPassword = async function(req, res, next)
{
    var smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
          user: "bookshop796@gmail.com",
          pass: "bookshop123123"
      }
  });
    var rand,mailOptions,host,link,token;
    console.log("random",crypto.randomBytes(20).toString('hex'));
    const user = await userModel.findEmail(req.body.email);
    if(!user)
    {
      res.render('forget-password',
        {message: "Email này chưa được đăng kí tài khoản tại trang web này. Vui lòng nhập đúng tài khoản email!!"});
    }
    else{

      rand = crypto.randomBytes(20).toString('hex');
      host=req.get('host');
      link="http://"+req.get('host')+"/reset-password?token="+rand+"&email="+req.body.email;
      mailOptions={
          to : req.body.email,
          subject : "Reset your password",
          html : "Hello,<br> Please Click on the link to reset your password.<br><a href="+link+">Click here to verify</a>"
      }
      console.log(mailOptions);
      smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
              console.log(error);
          res.render('forget-password',{message: "Chúng tôi không thể gửi mail cho bạn. Vui lòng thử lại"});
      }else{
        
        if(!user)
        {
          res.render('forget-password',
          {message: "Email này chưa được đăng kí tài khoản tại trang web này. Vui lòng nhập đúng tài khoản email!!"});
        }else{
              console.log("Message sent: " + response.message);
              user.resetPasswordToken = rand;
              user.resetPasswordExpires=Date.now() + 3600000; // ngày hiện tại + 1 giờ
              user.save();
              console.log(user);
              res.render('forget-password',
              {message: "Chúng tôi đã gửi đường link để lấy lại mật khẩu vào mail bạn. Xin hãy vào mail kiểm tra"});
            }
        }
    });
  }

}

// resetpassword
module.exports.resetpassword = async function(req,res,next)
{
    const newpassword = req.body.password;
    const verifynewpassword= req.body.verifypassword;
    console.log(newpassword,verifynewpassword);
    if(!newpassword || !verifynewpassword)
    {
      res.render('reset-password',{message: "Bạn chưa điền đầy đầy đủ thông tin!"});
    }
    else{
      if(newpassword != verifynewpassword)
      {
        res.render('reset-password',{message: "Xác nhận mật khẩu không đúng"});
      }
      else{
        //const user = await userModel.findOne({email: req.query.email,resetPasswordExpires: { $gt: Date.now() } });
        console.log(req.query.email);
        const user = await userModel.findEmail(req.query.email);
        console.log(user);
          if(!user)
          {
              console.log("not user");
              res.render('reset-password',{message: "Lỗi, Xin hãy gửi yêu cầu lấy lại mật khẩu mới cho chúng tôi!"});
          }
          else{
            //console.log("asc",(user.resetPasswordToken == req.query.token && (user.resetPasswordExpires - Date.now()>0)));
            if(user.resetPasswordToken == req.query.token && (user.resetPasswordExpires - Date.now()>0)){
            bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newpassword, salt, async (err, hash) => {
              if (err) throw err;
              user.password = hash;
              user.resetPasswordToken=null;
              user.resetPasswordExpires=null;
              await user.save();
              console.log(user);
            });
          });
          res.render('login',{message: "Đổi mật khẩu thành công đăng nhập ngay!"});
          }
          else
          {
            res.render('reset-password',{message: "Lỗi, Xin hãy gửi yêu cầu lấy lại mật khẩu mới cho chúng tôi!"});
          }
        }
      }
    }
}

//verify
module.exports.verify = function(req,res,next)
{
  console.log(req.query.email);
  res.render('verify');
}

module.exports.postverify = async function(req,res,next)
{
  //const user = await userModel.findOne({email: req.query.email,resetPasswordExpires: { $gt: Date.now() } });
  console.log(req.query.email);
  const user = await userModel.findEmail(req.query.email);
  console.log(user);
    if(!user)
    {
        console.log("not user");
        res.render('verify',{message: "Lỗi, Không tìn thấy tài khoản!"});
    }
    else{
      if(!user.isActive){
      //console.log("asc",(user.resetPasswordToken == req.query.token && (user.resetPasswordExpires - Date.now()>0)));
        if(user.resetPasswordToken == req.body.verify){
        
          user.isActive = true;
          user.resetPasswordToken=null;
          user.save();
      res.render('login',{message: "Kích hoạt tài khoản thành công đăng nhập ngay!"});
      }
      else{
        res.render('verify',{message: "Lỗi, Mã xác thực không đúng!"});
      }
    }
    else{
      res.render('verify',{message: "Tài khoản này đã được kích hoạt. Bạn có thể đăng nhập!"});
    }
  }
}

// profile

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
		  res.render('profile', {err,name, phone,address});
    }
    else{
      const userUpdate = await userModel.getUserByID(currenUser.id);
      userUpdate.name = name;
      userUpdate.phonenumber =phone;
      userUpdate.address=address;
      console.log(!password || !newpassword|| !verifyPassword);
      if(password || newpassword|| verifyPassword){
      if(!password || !newpassword|| !verifyPassword)
      {
        res.render('profile', {message: 'Bạn chưa nhập đầy đủ thông tin để đổi mật khẩu!',name, phone,address});
      }
      else{
        console.log("password!='' && newpassword!='' && verifyPassword!=''");
        if(password != newpassword)
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
                  //err.push({msg:'Mật khẩu không đúng!!'});
                  res.render('profile',{message:"Mật khẩu không đúng!!",name, phone,address});
              }
              else {
                console.log("asdasdasd");
                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(newpassword, salt, async (err, hash) => {
                    if (err) throw err;
                    userUpdate.password = hash;
                    await userUpdate.save();
                    res.render('profile', {message: 'Cập nhật tài khoản thành công!',name, phone,address});
                  });
                });
              }
            });
          }
        }
        else{
          res.render('profile', {message: 'Mật khẩu mới không thể giống mật khẩu cũ!',name, phone,address});
        }
      }
    }
    else{
      userUpdate.save();
      res.render('profile', {message: 'Cập nhật tài khoản thành công!',name, phone,address});
    }
  }
  }else{
    res.render('login');
  }
}
module.exports.updateOrderAddress = async (req, res) => {
  const userID = req.user.id;
  const body = req.body;
  const name = body.name,
        phone = body.phone,
        address = body.address;
  const userUpdated = await userModel.updateOrderAddressByID(userID, name, phone, address);
  res.send(userUpdated.orderAddress);
}