const mongoose = require('mongoose')

const mongooseDB = function () {
	//重点在这一句，赋值一个全局的承诺。
	mongoose.Promise = global.Promise
  mongoose.connect('mongodb://127.0.0.1:27017/wecut_blog')
  return mongoose.connection
}

module.exports = mongooseDB
