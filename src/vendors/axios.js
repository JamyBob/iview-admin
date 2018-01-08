//import iView from 'iview';
import axios from 'axios'
import router from '../router/index'
//import qs from 'qs'
// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = 'http://localhost:8181/';
axios.defaults.withCredentials = true ;

// axios request 拦截器
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    console.log("axios  request 拦截");
    // if(config.method  === 'post'){
    //   config.data = qs.stringify(config.data);
    // }
    // if(config.method  === 'put'){
    //   config.data = qs.stringify(config.data);
    // }
    return config;
  }, function (error) {
    // Do something with request error
    console.log("axios  request 拦截");
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
    console.log("axios  response 拦截");
    console.log(error);

    //统一处理服务端返回的异常
    if (error.response) {
      switch(error.response.status){
        case 400:;  break; //请求出错
        case 401:;  break; //未授权
        case 403: //禁止访问
          //that.$store.commit('logout', that);
          //that.$store.commit('clearOpenedSubmenu');
          // router.push({
          //     name: 'login'
          // });
          //iView.$Message.info('This is a info tip');
          break;
        case 404:;  break; //资源未找到
        case 405:;  break; //请求方法不允许
        case 408:;  break; //请求超时
        case 500:;  break; //服务器内部错误
        default: ;  break; //其它错误
      }
    }
    return Promise.reject(error);
  });

export default axios