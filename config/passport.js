const passport = require('passport');
const LocalTrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt= require('bcrypt');

// load user model
const users= require('../model/user.model');

module.exports = async function(passport){
    passport.use(
        new LocalTrategy({usernameField : 'email'},async (email,password,done)=>{
            const user = await users.findEmail(email);
            if (!user)
                return done(null,false, {message : 'Tài khoản chưa được đăng kí!!'});
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Mật khẩu không đúng!!' });
                }
            }).catch(err=> console.log(err));
        })
    );
    passport.serializeUser((users, done)=> {
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
}