const users = require('../model/user.model');
const bcrypt = require('bcrypt');
const passport = require('passport');

var handlebars = require('hbs');
handlebars.registerHelper("setVar", function(varName, varValue, options) {
  options.data.root[varName] = varValue;
});

// module to render register or /
module.exports.register = async function(req, res, next) {
    // get username, password, confirmpassword,name,email,phonenumber in register form
    const{username, password, confirmpassword,name,email,phonenumber}=req.body;
    let errors=[];

    console.log(username,password,confirmpassword,name,email,phonenumber);
    // check required fields
    if(!username || !password || !confirmpassword || !name || !email || !phonenumber ){
        errors.push({msg:'Bạn nhập thiếu thông tin!!'});
    }
    
    // check password match
    if(password !== confirmpassword){
      errors.push({msg:'Xác nhận mật khẩu không đúng!!'});
    }

    // check pass length
    if(password.length<6 && !password){
      errors.push({msg:'Chiều dài mật khẩu phải lớn hơn 6 kí tự'});
    }
    
    if(errors.length > 0)
    {
      res.render('register',{errors,username,password,confirmpassword,name,email,phonenumber});
    }
    else{
      users.findOne({username : username})
      .then(users=>{
        if(users){
          //user exists
          errors.push({msg:'Tên đăng nhập đã tồn tại!!'});
          res.render('register',{errors, username,password,confirmpassword,name,email,phonenumber});
        }
        else{
          const newuser = new users ({
            username,
            password,
            name,
            email,
            phonenumber
          });
          //console.log(newuser);
          // Hash password
          bcrypt.genSalt(10,(err,salt)=>
          bcrypt.hash(newuser.password,salt,(err,hash)=>{
            if(err) throw err;
            // set password to hash
            newuser.password= hash;
            //save user
            console.log(newuser);
            newuser.save()
            .then(users => {
              res.redirect('/login');
            })
            .catch(err=>console.log(err));
          }))
          // newuser.save()
          // res.render('login');
        }
      });
    }
}

module.exports.login = async function(req, res, next) {
    passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  })(req, res, next);
}

// Logout

module.exports.logout = async function(req, res, next) {
  req.logout();
  res.redirect('/users/login');
}
