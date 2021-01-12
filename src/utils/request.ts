/*
用于实现axios的请求拦截器
*/
// 添加请求拦截器
import axios from 'axios';
import store from './store'
import router from '../router/index'

const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 2000,
  auth: {
    username: '',
    password: ''
  },
});

api.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
api.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  // 401 删除vuex中的和localstorage中的token，跳转到login页面
  if (error.response) {
    switch (error.response.status) {
      case 401:
        store.commit('delToken')
        // 这里的router是从index引入的router
        router.push({
          path: '/login'
        })
        break;
    }
  }
  return Promise.reject(error.response.data);
});


export default api;