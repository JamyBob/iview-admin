import axios from 'axios'

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = 'http://localhost:8181/';
axios.defaults.withCredentials = true ;

// axios request 拦截器
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    console.log("axios  request 拦截");
    
    return config;
  }, function (error) {
    // Do something with request error
    console.log(error);
    return Promise.reject(error);
  });
 
// axios response 拦截器
axios.interceptors.response.use(function (response) {
    // Do something with response data
    console.log("axios  response 拦截");

    return response;
  }, function (error) {
    // Do something with response error
    console.log(error);
    return Promise.reject(error);
  });

export default axios