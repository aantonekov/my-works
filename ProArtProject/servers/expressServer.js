const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const engine = require('ejs-locals');

const indexRoute = require('../routes/index');
const authRoute = require('../routes/authRoute');
const editProfileRoute = require('../routes/editProfile');
const albumRoute = require('../routes/albums');
const galleryUserRoute = require('../routes/galleryUser');
const orderRoute = require('../routes/orders');

const expressServer = express();

// use ejs-locals for all ejs templates:
expressServer.engine('ejs', engine);

// view engine setup
expressServer.set('views', path.join(__dirname, '../views'));
expressServer.set('view engine', 'ejs');

expressServer.use(logger('dev'));
expressServer.use(express.json());
expressServer.use(express.urlencoded({ extended: false }));
expressServer.use(cookieParser());
expressServer.use(express.static(path.join(__dirname, '../public')));

expressServer.use(session({
  secret: 'kdfgkjtger87435',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/photoGallery'
  })
}))

expressServer.use('/', indexRoute);
expressServer.use('/auth', authRoute);
expressServer.use('/profile', editProfileRoute);
expressServer.use('/albums', albumRoute);
expressServer.use('/gallery', galleryUserRoute);
expressServer.use('/orders', orderRoute);


// catch 404 and forward to error handler
expressServer.use(function(req, res, next) {
  next(createError(404));
});

// error handler
expressServer.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = expressServer;
