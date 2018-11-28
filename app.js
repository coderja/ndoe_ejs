var createError = require('http-errors');
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var hahaRouter = require('./routes/haha');

var app = express();

// view engine setup
app.engine("html", ejs.__express); //���views�ļ�������Ҫ��Ⱦ.html�ļ� ����������Ҫ ����ע�͵�
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs'); //���views�ļ�������Ҫ��Ⱦ.ejs�ļ� ����������Ҫ ����ע�͵�
app.set('view engine', 'html');//���views�ļ�������Ҫ��Ⱦ.html�ļ� ����������Ҫ ����ע�͵�

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/haha',hahaRouter)

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
