const LocalTrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
// load user model
const users = require('../model/user.model');
const carts = require('../model/cart.model');

passport.use('login', new LocalTrategy({ usernameField: 'email' }, async (email, password, done) => {
    const user = await users.findEmail(email);
    if (!user)
        return done(null, false, {'message': 'Tài khoản chưa được đăng kí!!'});
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
            return done(null, user);
        } else {
            return done(null, false, {'message': 'Mật khẩu không đúng!!'});
        }
    })
})
);

passport.use('register', new LocalTrategy({
    usernameField: 'email',
    passportField: 'password',
    passReqToCallback: true
}, async function (req, email, password, done) {
    const name = req.body.name;
    const phonenumber = req.body.phonenumber;
    // check required fields
    const user = await users.findEmail(email);
    //user exists
    if (user) {
        return done(null, false, req.flash('message', 'Tên đăng nhập đã tồn tại!!'))
    } else {

        var rand,mailOptions,host,link;          
      
        rand=Math.floor((Math.random() * 20000) + 54);
        rand = rand.toString();

        // tạo mới user 
        const newuser = users.createUser(email, password, name, phonenumber);
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newuser.password, salt, async (err, hash) => {
                if (err) throw err;
                // set password to hash
                newuser.password = hash;
                newuser.resetPasswordToken=rand;
                const users = await newuser.save();

                // gửi mail kích hoạt tài khoản

        var smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "bookshop796@gmail.com",
                pass: "bookshop123123"
            }
        });
          
            host=req.get('host');
            link="http://"+req.get('host')+"/verify?email="+email;
            mailOptions={
                to : email,
                subject : "Verify your account",
                html : "Hello,<br> Please Click on the link and input verify code " + rand +" to verify your account.<br><a href="+link+">Click here to verify</a>"
            }
            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                    console.log(error);
                    return done(null, false, req.flash('message', 'Chúng tôi không thể gửi mail cho bạn. Vui lòng thử lại!!'));
            }else{

                    console.log("Message sent: " + response.message);
                    req.flash('message', 'Tạo tài khoản thành công. Chúng tôi đã gửi đường link để xác nhận tài khoản vào mail bạn. Xin hãy vào mail kiểm tra!!');
                    
                    console.log(user);
                    done(null, false);
                }
            });
            
            });
        });

    }
}
))


passport.serializeUser((users, done) => {
    done(null, users.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        let user = await users.getUserByID(id);
        if (!user) {
            return done(new Error('user not found'));
        }
        done(null, user);
    } catch (e) {
        done(e);
    }
});

