import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

window.axios = require('axios');
window.moment = require('moment');
Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter({
    routers : [
        { path : '/' },
        { path : '/article' },
    ]
})

const store = new Vuex.Store({
    state : {
        nowPageArticle : {}
    },
    getters : {
        timeFormat : (state) => (activity,type) => {
            return moment(activity[type]).format('YYYY/M/DD');
        }
    }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
