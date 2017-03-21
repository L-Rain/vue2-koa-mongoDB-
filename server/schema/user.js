'use strict'
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  userName: String,
  userPassword: String,
  userNickName: String,
  userImg : String
});

module.exports = mongoose.model('User', userSchema);
