//用来封装发ajax请求的函数

import axios from 'axios'


//请求拦截器
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    console.log(config);
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

export default axios;