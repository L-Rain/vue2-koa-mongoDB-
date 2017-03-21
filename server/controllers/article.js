'use strict'

const Article = require('../models/article')
const article = new Article()

//上传控件
var parse = require('co-busboy');
var fs = require('fs');
var os = require('os');
var path = require('path');

//创建文本
const createArticle = function*(next) {
  const ctx = this;
  var parts = parse(this.request)
  var part;
  //此数组用于存储图片的url
  var fileNames = [],
      subTags = [],
      articleImgs = [],
      opts = {};
  while (part = yield parts){
    //一定要对流进行处理，否则while循环会被卡住
    //input上传文件就是个对象，包含了filename键值
    if (part.filename) {
      var filename = part.filename;
      fileNames.push(filename)
      var homeDir = path.resolve(__dirname, '..')
      var newpath = homeDir + '/public/images/article/'+ filename;
      //生成存储路径，要注意这里的newpath必须是绝对路径，否则Stream报错
      var stream = fs.createWriteStream(newpath);
      //写入文件流
      part.pipe(stream);

    //不是input上传文件则为数组['键'，'值']形式
    }else if(part.length) {
      if (part[0].indexOf("subTags") > -1) {
        subTags.push(part[1]);
        opts["subTags"] = subTags;
      }else {
        opts[part[0]] = part[1];
      }
    }
  };
  var fileLen = fileNames.length;
  if(fileLen > 0){
    //设定第一个即为封面图，其他的均为文本图像
    opts["coverImg"] = 'http://192.168.2.63:3030/images/article/' + fileNames[0];
    for (var i = 1; i < fileLen; i++) {
      articleImgs.push('http://192.168.2.63:3030/images/article/' + fileNames[i]);
    }
    opts["articleImgs"] = articleImgs;
  }
  opts.thisUser = JSON.parse(opts.thisUser);
  yield article.save(opts).then(function (doc) {
    ctx.body = {
      msg: '发布成功',
      data: doc,
      state: true
    }
  }).catch(function (error) {
    ctx.body = {
      msg: '发布失败',
      error: error,
      state: false
    }
  })
}
//修改文本
const editArticle = function*(next) {
  const ctx = this;
  var parts = parse(this.request)
  var part;
  //此数组用于存储图片的url
  var fileNames = [],
      subTags = [],
      articleImgs = [],
      opts = {};
  while (part = yield parts){
    if(part.length) {
      if (part[0].indexOf("subTags") > -1) {
        subTags.push(part[1]);
        opts["subTags"] = subTags;
      }else if(part[0].indexOf("textPic") > -1){
        articleImgs.push(part[1]);
        opts["articleImgs"] = articleImgs;
      }else {
        opts[part[0]] = part[1];
        opts["articleImgs"] = "";
      }
    }
  };
  opts.thisUser = JSON.parse(opts.thisUser);
  console.log(JSON.stringify(opts));
  yield article.remove(opts.thisId).then(function(){
    return article.save(opts);
  }).then(function (doc) {
    ctx.body = {
      msg: '修改成功',
      data: doc,
      state: true
    }
  }).catch(function (error) {
    ctx.body = {
      msg: '修改失败',
      error: error,
      state: false
    }
  })
}

//获取全部文章
const getAllArticle = function*(next) {
  const ctx = this;
  let results = [];
  yield article.query({}).then(function (doc) {
    for (let i = 0; i < doc.length; i++) {
      results.push(doc[i])
    }
    ctx.body = {
      message: '获取成功',
      articles: results
    }
  }).catch(function (error) {
    ctx.body = {
      msg: '获取失败',
      error: error,
      state: false
    }
  })
}

//处理单个文章
const getArticle = function*(next) {
  const ctx = this;
  let hrefs = this.request.href,
      hrefsLoc = hrefs.indexOf('article/') + 8,
      queryByUser = false,
      deleteByUser = false;
  if (hrefs.indexOf("?userId=") > -1) {
    queryByUser = true;
    hrefsLoc = hrefs.indexOf("?userId=") + 8;
  }else if(hrefs.indexOf("?deleteId=") > -1){
    deleteByUser = true;
    hrefsLoc = hrefs.indexOf("?deleteId=") + 10;
  }
  let searchId = hrefs.substr(hrefsLoc, hrefs.length);
  //根据用户id索引
  if (queryByUser) {
    yield article.query({'thisUser._id' : searchId}).then(function (doc) {
      // if (doc[0]) {
        ctx.body = {
          msg: '获取成功',
          article: doc,
          state : true,
        }
      // }else {
      //   ctx.body = {
      //     msg: '非法的id请求',
      //     state : false,
      //   }
      // }
    }).catch(function (error) {
      ctx.body = {
        msg: '获取失败',
        error: error,
        state: false
      }
    })
  }else if(deleteByUser) {
    //删除文章
    yield article.remove(searchId).then(function (doc) {
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
  }else {
    //根据文章id索引
    yield article.query({_id : searchId}).then(function (doc) {
      if (doc[0]) {
        ctx.body = {
          msg: '获取成功',
          article: doc,
          state : true,
        }
      }else {
        ctx.body = {
          msg: '非法的id请求',
          state : false,
        }
      }
    }).catch(function (error) {
      ctx.body = {
        msg: '获取失败',
        error: error,
        state: false
      }
    })
  }
}

const removeAll = function*(next){
  console.log("removeAll");
  yield article.removeAll().then(function (doc) {
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
  getArticle,
  getAllArticle,
  createArticle,
  editArticle,
  removeAll
}
