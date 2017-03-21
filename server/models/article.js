'use strict'

//引入定义modle,执行查询更改操作
const ArticleModel = require('../schema/article');

class Article {
  constructor () {
    this.model = ArticleModel;
  }
  save (opts) {
    this.entity = new ArticleModel(opts);
    return this.entity.save(opts);
  }
  query (opts) {
    return this.model.find(opts)
    .sort({ _id: -1 })
    .exec()
  }
  queryAll () {
//query = this.modle.find({}),query下可执行链式操作，每个链式返回query
//如果不提供回调函数，所有这些方法都返回 Query 对象，它们都可以被再次修改（比如增加选项、键等），直到调用 exec 方法。
// query.exec(function (err, docs) {
//   // called when the `query.complete` or `query.error` are called
//   // internally
// });
//sort为排序，-1为降序，1为升序
    return this.model.find({})
    .sort({ _id: -1 })
    .exec()
  }
  queryById (id) {
    console.log(id)
    return this.model.findById(id)
  }
  remove (id, fn) {
    return this.model.findById(id).then(function (doc) {
      if (!doc) return fn(null, false);
      return doc.remove();
    })
  }
  removeAll (fn) {
    return this.model.remove({})
  }
}

module.exports = Article;
