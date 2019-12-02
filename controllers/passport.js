const passport = require('passport');
const LocalTrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt= require('bcrypt');

// load user model
const user= require('../model/user.model');

module.exports = function(passport){
    passport.use(
        new LocalTrategy({usernameField : 'username'},(username,password,done)=>{
            user.findOne({username:username})
            .then(user=>{
                if(!user){
                    return done(null,false, {message : 'Tài khoản chưa được đăng kí!!'});
                }

                //match password
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null,user);
                    }else{
                        return done(null,false,{message :'Mật khẩu không đúng!!'});
                    }                   
                });

            })
            .catch(err=> console.log(err));
        })
    );
    passport.serializeUser((user, done)=> {
        done(null, user.id);
      });
      
    passport.deserializeUser((id, done)=> {
        user.findById(id, function(err, user) {
          done(err, user);
        });
    });
}