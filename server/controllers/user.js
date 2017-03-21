'use strict'
const jwt = require('koa-jwt')
const User = require('../models/user')
const user = new User()

//上传控件
var parse = require('co-busboy');
var fs = require('fs');
var os = require('os');
var path = require('path');

//登录控件
const login = function *(next) {
  const ctx = this;
  const opts = ctx.request.body;
  yield user.query(opts).then(function (doc) {
    const user = doc[0] || ''
    if (user) {
      //签发token
      const token = jwt.sign(JSON.stringify({ userId: user._id, original_iat: Date.now()}), 'Blink_1.0');
      ctx.body = {
        msg: '登录成功',
        data: {
          _id : user._id,
          userName : user.userName,
          userNickName : user.userNickName,
          userImg : user.userImg,
        },
        state: true,
        token: token
      }
    } else {
      ctx.body = {
        msg: '用户名或密码错误',
        data: user,
        state: false
      }
    }
  })
}

//注册，添加用户头像
const register = function *(next) {
  const ctx = this;
  var parts = parse(this.request)
  var part;
  //此数组用于存储图片的url
  var fileNames = [],
      opts = { };
  while (part = yield parts){
    //此时part为返回的流对象
    //循环输出流对流，分别获取formdata中的是三个input值
    if (part.filename) {
      var filename = part.filename;
      fileNames.push(filename)
      var homeDir = path.resolve(__dirname, '..')
      var newpath = homeDir + '/public/images/user/'+ filename;
      //生成存储路径，要注意这里的newpath必须是绝对路径，否则Stream报错
      var stream = fs.createWriteStream(newpath);
      //写入文件流
      part.pipe(stream);
    }else if(part.length) {
     opts[part[0]] = part[1];
    }
  }
  if(fileNames.length > 0){
    opts.userImg = 'http://192.168.2.63:3030/images/user/' + fileNames[0];
  }
  yield user.query({userName: opts.userName}).then(function (doc) {
    if (doc.length > 0) {
        ctx.body = {
         msg: '该账户已存在',
         state: false
       }
    } else {
      return user.save(opts)
    }
  }).then(function (doc) {
    if (doc) {
      const token = jwt.sign(JSON.stringify({ userId: doc._id, original_iat: Date.now()}), 'Blink_1.0');
      ctx.body = {
        msg: '注册成功',
        data: {
          _id : user._id,
          userName : user.userName,
          userNickName : user.userNickName,
          userImg : user.userImg,
        },
        state: true,
        token : token
      }
    }
  })
}

//token验证
const userVerify = function *(next) {
  const ctx = this;
  var token = ctx.request.headers.token;
  var profile = jwt.verify(token, 'Blink_1.0');
  yield user.query({_id: profile.userId}).then(function (doc) {
    ctx.body = {
      msg: 'token验证成功',
      data: doc[0],
      state: true
    }
  })
}

const query = function *(next) {
  const ctx = this;
  yield user.queryAll().then(function (doc) {
    ctx.body = doc
  })
}

const removeAll = function*(next){
  console.log("userRemoveAll");
  yield user.removeAll().then(function (doc) {
    ctx.body = {
      msg: '删除成功',
      state: true
    }
  }).catch(function (error) {
    ctx.body = {
      msg: '删除失败',
      state: false
    }
  })
}

module.exports = {
  login,
  register,
  query,
  userVerify,
  removeAll
}
