import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import userHead from '../images/logo.png'
import {
  SHOW_MSG,
  LOGIN_JUDGE,
  POPSHOW,
  POPTEXT,
  POP_LOGIN,
  USER_LOGIN,
  GET_ARTICLES,
  GET_ARTICLE,
  GET_USER_ARTICLES
} from './mutation-types'

Vue.use(Vuex)

const state = {
  //登录判断
  loginJudge : false,
  popLogin : false,
  popComment : {
    popText : "",
    popIcon : true,
    popShow : false,
  },
  //登录用户数据存储
  user : {},
  //文章列表获取存储
  articles : [{
    articleTitle: "--",
    articleIntro: "",
    mainTag: "",
    subTags: [],
    sourceArticle: "--",
    markedArticle: "--",
    coverImg: "",
    timeStamp : "",
    articleImgs: [],
    thisUser : {
      _id : "",
      userName : "",
      userNickName : "",
      userImg : userHead,
    }
  }],
  //单个文章依据ID索引存储
  article : {
    articleTitle: "",
    articleIntro: "",
    mainTag: "前端开发",
    subTags: ["Node.js"],
    sourceArticle: "",
    markedArticle: "",
    coverImg: "",
    timeStamp : "",
    articleImgs: [],
    thisUser : {
      _id : "",
      userName : "",
      userNickName : "",
      userImg : userHead,
    }
  },
  //文章列表依据用户ID索引存储
  userArticles : [{
    articleTitle: "",
    articleIntro: "",
    mainTag: "",
    subTags: [],
    sourceArticle: "",
    markedArticle: "",
    coverImg: "",
    timeStamp : "",
    articleImgs: [],
    thisUser : {
      _id : "",
      userName : "",
      userNickName : "",
      userImg : userHead,
    }
  }],
  token : "",
}

const mutations = {
  //登录状态
  [LOGIN_JUDGE]( state, msg ) {
    state.loginJudge = msg;
  },
  //登录状态,token获取
  [USER_LOGIN]( state, opts ) {
    console.log(opts);
    state.user = opts.data;
    state.loginJudge = opts.state;
  },
  //登录注册控件显示
  [POP_LOGIN]( state, msg ) {
    state.popLogin = msg;
  },
  //弹窗提示层
  [SHOW_MSG] (state, opts) {
    state.popComment = {
      popShow : true,
      popIcon : opts.state,
      popText : opts.msg,
    };
  },
  //获取多选文章
  [GET_ARTICLES] (state, data) {
    state.articles = data;
  },
  //获取单个文章
  [GET_ARTICLE] (state, data) {
    state.article = data[0];
  },
  //获取用户文章
  [GET_USER_ARTICLES] (state, data) {
    state.userArticles = data;
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
