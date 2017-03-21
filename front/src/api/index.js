import Vue from 'vue'
import VueResource from 'vue-resource'
import store from '../store'

Vue.use(VueResource)
const API_ROOT = 'http://192.168.2.63:3030/'
const indexResource = Vue.resource(API_ROOT + 'index{/id}')
const usersGetResource = Vue.resource(API_ROOT + 'users{/id}');
//formdata上传数据必须搭上emulateJSON参数
const usersResource = Vue.resource(API_ROOT + 'users{/id}', { emulateJSON: true });
const articlePostResource = Vue.resource(API_ROOT + 'article{/id}', { emulateJSON: true });
const articleGetResource = Vue.resource(API_ROOT + 'article{/id}');

//vue-resource拦截器
Vue.http.interceptors.push((request, next) => {
  Vue.http.headers.common['token'] = sessionStorage.token || '';
  next((response) => {
    //在响应之后传给then之前对response进行修改和逻辑判断
    if (response.status == 401) {
      console.log("401 : " + JSON.stringify(response.body))
      store.state.loginJudge = false;
      sessionStorage.removeItem('token');
      //文章创建token判断弹窗提示
      if (response.url.indexOf('article') > -1) {
        store.commit('SHOW_MSG', {state : false,  msg: "请重新登录"})
      }
    }
  })
})

export default {
  getArticleById (id) {
    return articleGetResource.get({id : id})
  },
  getArticlesByUser (id) {
    return articleGetResource.get({id: 'user', 'userId': id})
  },
  getALLArticle (opts) {
    return articleGetResource.get({id : 'getAll'})
  },
  getUserLogin (opts){
    return usersGetResource.get({id: 'checkOut'})
  },
  userLogin (opts) {
    return usersResource.save({id: 'login'}, opts)
  },
  userRegister (opts) {
    return usersResource.save({id: 'register'},opts)
  },
  createArticle (opts) {
    return articlePostResource.save({id: 'create'},opts)
  },
  editArticle (opts) {
    return articlePostResource.save({id: 'edit'},opts)
  },
  deleteArticle (id) {
    return articleGetResource.get({id: 'delete', 'deleteId': id})
  },
  deleteAll (opts){
    // return articleGetResource.save({id : "removeAll"}, opts)
    return usersGetResource.save({id : "removeAll"}, opts)
  }
}
