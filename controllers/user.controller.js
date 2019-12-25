const users = require('../model/user.model');
const bcrypt = require('bcrypt');
const passport = require('passport');

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
          carts.update(req.session.cart, user.id);
          }else{
          //move add from database to session
          req.session.cart = await carts.get(user.id);
          res.locals.session = req.session;
          console.log(req.session.cart);
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
  req.flash('success_msg', 'Bạn đã đăng xuất');
  res.redirect('/login');
}

module.exports.getRegister = function(req, res, next){
  res.render('register', {message: req.flash('message')});
}

module.exports.getLogin = function(req, res, next){
  res.render('login');
}