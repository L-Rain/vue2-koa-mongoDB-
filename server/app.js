var app = require('koa')()
  , koa = require('koa-router')()
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , jwt = require('koa-jwt')
  , cors = require('kcors')
  , static = require('koa-static')
  , onerror = require('koa-onerror');

var users = require('./routes/users');
var article = require('./routes/articles');

var db = require('./config/mongoose')();
db.on('error', console.error.bind(console, 'error: connect error!'))
db.once('open', function () {
  // 一次打开记录
  console.log('connect success!')
})

// global middlewares
app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());
//cors解决跨域问题
app.use(cors());
//static配置静态文件，可直接访问该文件夹下的文件
app.use(static(__dirname + '/public/'));
app.use(jwt({
  secret: 'Blink_1.0',
  passthrough: true
}));


//token验证
app.use(function *(next){
  var ctx = this,
      thisUrl = ctx.request.url;
  console.log(thisUrl)
  // 如果来源路径不是create或checkOut，直接跳过验证
  if (thisUrl.indexOf('create') === -1 && thisUrl.indexOf('checkOut') == -1) {
    return yield next;
  }
  var token = ctx.request.headers.token || '';
  if (token) {
    var profile = jwt.verify(token, 'Blink_1.0');
    if (profile) {
      // 设置过期时间为1天
      if (Date.now() - profile.original_iat  < 12 * 60 * 60 * 1000) {
        yield next;
      } else {
        ctx.status = 401;
        ctx.body = {
          state: false,
          msg: 'token已过期'
        };
      }
    } else {
      ctx.status = 401;
      ctx.body = {
        state: false,
        msg: 'token认证失败'
      }
    }
  } else {
    ctx.status = 401;
    ctx.body = {
      state: false,
      msg: 'token认证失败'
    }
  }
});


app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});


//注册路由，router.routes()返回处理匹配到了请求对应的路由的router中间件
//router.use([path], middleware, [...])  Use given middleware(s) before route callback.
//router.use(),匹配到设置的接口地址后，进入回调中间件，再中间件里设置路由路径匹配对应后的回调函数
koa.use('/users', users.routes(), users.allowedMethods());
koa.use('/article', article.routes(), article.allowedMethods());

app.use(koa.routes());

app.on('error', function(err, ctx){
  logger.error('server error', err, ctx);
});

module.exports = app;
