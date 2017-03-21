
import api from '../api'
import * as types from './mutation-types'

export default {
  getUserLogin ( {commit}, opts){
    opts = opts || "";
    return new Promise((resolve, reject) => {
      api.getUserLogin(opts).then(function (res) {
        if (res.body.state) {
          commit(types.USER_LOGIN, res.body)
          commit(types.LOGIN_JUDGE, true)
          resolve();
        }else {
          commit(types.LOGIN_JUDGE, false)
          reject(res.body.msg)
        }
      }).catch(function(e){
         commit(types.LOGIN_JUDGE, false)
         reject(e.body.msg)
      })
    })
  },
  userLogin ({ commit }, opts) {
    api.userLogin(opts).then(function (res) {
      commit(types.SHOW_MSG, res.body)
      if (res.body.state) {
        // cookies.set('token', res.body.token, { expires: 7 })
        //登录状态更新
        commit(types.LOGIN_JUDGE, true)
        //登录控件显示关闭
        commit(types.POP_LOGIN, false)
        //用户登录信息更新
        commit(types.USER_LOGIN, res.body)
        //存储token
        sessionStorage.token = res.body.token;
      } else {
        commit(types.LOGIN_JUDGE, false)
        commit(types.POP_LOGIN, true)
      }
    })
  },
  userRegister ({commit}, opts) {
    api.userRegister(opts).then(function (res) {
      commit(types.SHOW_MSG, res.body)
      if (res.body.state) {
        commit(types.LOGIN_JUDGE, true)
        commit(types.POP_LOGIN, false)
        commit(types.USER_LOGIN, res.body)
        //存储token
        sessionStorage.token = res.body.token;
      } else {
        commit(types.LOGIN_JUDGE, false)
        commit(types.POP_LOGIN, true)
      }

    }).catch(function(e){
      console.log(e);
    })
  },
  createArticle ({commit}, opts) {
    api.createArticle(opts).then(function (res) {
      commit(types.SHOW_MSG, res.body)
      setTimeout(function(){
        location.href = "/#/index";
      },800)
    }).catch(function(e){
      console.log(e);
    })
  },
  editArticle ({commit}, opts) {
    api.editArticle(opts).then(function (res) {
      commit(types.SHOW_MSG, res.body)
    }).then(function (){
      setTimeout(function(){
        location.href = "/#/index";
      },800)
    }).catch(function(e){
      console.log(e);
    })
  },
  deleteArticle ({commit}, id) {
    return new Promise((resolve, reject) => {
      api.deleteArticle(id).then(function (res) {
        commit(types.SHOW_MSG, res.body)
        resolve();
      }).catch(function(e){
        resolve(e);
      })
    })
  },
  getALLArticle({ commit }, opts) {
  	api.getALLArticle(opts).then(function (res) {
      commit(types.GET_ARTICLES, res.body.articles)
  	})
  },
  getArticleById({ commit }, id) {
    return new Promise((resolve, reject) => {
      api.getArticleById(id).then(function (res) {
        if (res.body.state) {
          commit(types.GET_ARTICLE, res.body.article)
          resolve();
        }else {
          reject(res)
        }
      }).catch(function(e){
         reject(e.body.msg)
      })
    })
  },
  getArticlesByUser({ commit }, id) {
    api.getArticlesByUser(id).then(function (res) {
      if (res.body.state) {
        if (res.body.article.length !== 0) {
          commit(types.GET_USER_ARTICLES, res.body.article)
        }else {
          commit(types.GET_USER_ARTICLES, [{
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
                userImg : "",
              }
            }]
          )
        }
      }else {
        commit(types.SHOW_MSG, res.body)
        setTimeout(function(){
          location.href = "/#/index";
        },800)
      }
    })
  },
  deleteAll({commit}, opts){
    api.deleteAll().then(function (res) {
      console.log("done");
    })
  }
};


