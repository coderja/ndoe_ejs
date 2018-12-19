var createError = require('http-errors');
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var apis=require('require-all')(__dirname + '/api') //����/api�ļ����������������
var bodyParser = require('body-parser') //�õ�post���������������
var cookieParser = require('cookie-parser');
var session = require('express-session');
var shajs = require('sha.js');// ����
var cookieParser = require('cookie-parser');
var logger = require('morgan'); //��־��ӡ
var moment = require('moment') //���ڸ�ʽ��

console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),'1111111111');

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
let RedisStore = require('connect-redis')(session);
app.use(session({
  secret: 'catalog-mgt',
  resave: true,
  saveUninitialized: true,
  rolling: true,
  store: new RedisStore({
    client : client,
    ttl: 36000
  }),
  cookie: {
    maxAge: 3600000 * 24,
    secure: false
  }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/haha',hahaRouter)

function recursionController(parentkey,obj){
  for(var key in obj){
    if(typeof obj[key] == 'object'){
      recursionController(parentkey,obj[key])
    }else if(typeof obj[key] == 'function'){
      app.use(parentkey,obj[key])
    }
  }
}
recursionController('/api',apis)

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

app.listen(3000)
//cnpm i supervisor -g ȫ�ְ�װ��ģ�� ʹ��supervisor Ӧ������  ÿ���޸Ľű���������
//cnpm i pm2 -g ȫ�ְ�װ��ģ�� ʹ�� pm2 start Ӧ������ pm2�ػ���������
module.exports = app;
