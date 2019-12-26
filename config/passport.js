const LocalTrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');
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
        const newuser = users.createUser(email, password, name, phonenumber);
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newuser.password, salt, async (err, hash) => {
                if (err) throw err;
                // set password to hash
                newuser.password = hash;
                const users = await newuser.save()
                done(null, users);
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

