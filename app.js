const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');

//Use helmet to help with security

//I recommend using pino instead of morgan.
const logger = require('morgan');

//Use cookie-session instead
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

//We saw from npm audit that this had vulnerabilities in one of its dependencies (hoek)
const sassMiddleware = require('node-sass-middleware');

const db    = require('./db');
const index = require('./routes/index')(db);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// This should be logged
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler should be logged too
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  //Different behaviour in development vs production
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
