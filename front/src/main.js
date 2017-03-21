
import index from './components/index.vue'
import article from './components/article.vue'
import create from './components/create.vue'
import personal from './components/personal.vue'
import query from './components/query.vue'
import store from './store'
// var store = require('./store/index')
import './until/scss/app.scss';

var Vue = require('vue')
var VueRouter = require('vue-router')
var VueResource = require('vue-resource')
var App = require('./app.vue')

Vue.use(VueResource);
Vue.use(VueRouter);

const routes = [
	{
	    path: '/',
	    component: index
	},
	{
	    path: '/index',
	    component:index
	},
	{
	    path: '/article',
	    component: article
	},
	{
	    path: '/query',
	    component: query
	},
	{
	    path: '/personal/:userId',
	    component: personal,
	    name : "personal",
	},
	{
	    path: '/article/:articleId',
	    name : "article",
	    component: article
	},
	{
	    path: '/create',
	    component: create
	},
	{
	    path: '/edit/:articleId',
	    component: create,
	    name : "edit"
	}
]
const router = new VueRouter({
  routes
});

const app = new Vue({
  el: 'app',
  router,
  store,
  render: h => h(App)
})
