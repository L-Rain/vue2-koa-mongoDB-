'use strict'
var mongoose = require('mongoose');

//定义一个schema
var articleSchema = new mongoose.Schema({
  articleTitle: String,
  articleIntro: String,
  mainTag: String,
  subTags: Array,
  sourceArticle: String,
  markedArticle: String,
  coverImg: String,
  articleImgs: Array,
  timeStamp : String,
  thisUser : {
  	_id : String,
  	userName: String,
  	userPassword: String,
  	userImg : String,
    userNickName : String,
  }
});

//将schema发布为model
module.exports = mongoose.model('Article', articleSchema);
