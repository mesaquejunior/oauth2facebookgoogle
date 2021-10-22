var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var auth = require('./routes/auth');
var users = require('./routes/users');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://mesaque:<Password>@cluster0.jyhbq.mongodb.net/oauth2facebookgooge?retryWrites=true&w=majority')
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

var app = express();

app.use('/auth', auth);


app.use(session({
  secret: 'Passw0rd',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
