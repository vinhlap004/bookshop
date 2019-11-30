const users = require('../model/user.model');

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
      users.findOne({email : email})
      .then(users=>{
        if(users){
          //user exists
          errors.push({msg:'Tên đăng nhập đã tồn tại!!'});
          res.render('register',{errors, username,password,confirmpassword,name,email,phonenumber});
        }
      });
    }
      const newuser = new users ({
        username,
        password,
        name,
        email,
        phonenumber
      });
      //console.log(newuser);
      newuser.save()
      res.render('login');
}
