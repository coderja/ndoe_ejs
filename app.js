var createError = require('http-errors');
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var apis=require('require-all')(__dirname + '/api') //加载/api文件夹下面的所有内容
var bodyParser = require('body-parser') //拿到post请求体里面的内容
var cookieParser = require('cookie-parser');
var session = require('express-session');
var shajs = require('sha.js');// 加密
var cookieParser = require('cookie-parser');
var logger = require('morgan'); //日志打印
var moment = require('moment') //日期格式化

console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),'1111111111');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var hahaRouter = require('./routes/haha');

var app = express();


// view engine setup
app.engine("html", ejs.__express); //如果views文件夹里需要渲染.html文件 此项设置需要 否则注释掉
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs'); //如果views文件夹里需要渲染.ejs文件 此项设置需要 否则注释掉
app.set('view engine', 'html');//如果views文件夹里需要渲染.html文件 此项设置需要 否则注释掉

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
//cnpm i supervisor -g 全局安装此模块 使用supervisor 应用名称  每次修改脚本无需重启
//cnpm i pm2 -g 全局安装此模块 使用 pm2 start 应用名称 pm2守护进程启动
module.exports = app;
