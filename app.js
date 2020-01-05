var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const localStratery= require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

require('dotenv').config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//2.connect
mongoose.connect(process.env.DB_HOST,{useNewUrlParser:true,useUnifiedTopology: true })
.then(()=>console.log('Connected to database\n'))
.catch(err=>console.log(err));

// passport
require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}))
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});


app.use('/', indexRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
