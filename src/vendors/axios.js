import axios from 'axios'
import router from '../router/index'
import Bus from  '../libs/bus'

//import qs from 'qs'
// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = 'http://localhost:8181/';
axios.defaults.withCredentials = true ;

// axios request 拦截器
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    MYVUE.$Loading.start();
    // if(config.method  === 'post'){
    //   config.data = qs.stringify(config.data);
    // }
    // if(config.method  === 'put'){
    //   config.data = qs.stringify(config.data);
    // }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
 
// axios response 拦截器
axios.interceptors.response.use(function (response) {
    // Do something with response data
    MYVUE.$Loading.finish();
    //Bus.$emit('relogin')
    return response;
  }, function (error) {
    //统一处理服务端返回的异常
    if (error.response) {
      switch(error.response.status){
        case 400:MYVUE.$Message.error('请求出错'); break; //请求出错
        case 401:MYVUE.$Message.error('未授权访问此资源'); break; //未授权
        case 403: //禁止访问
          MYVUE.$Message.error('未登录或登录超时，请重新登陆');
          Bus.$emit('relogin');
          //MYVUE.$store.commit('logout', MYVUE);
          //MYVUE.$store.commit('clearOpenedSubmenu');
          //MYVUE.$router.push({name: 'login' });
          break;
        case 404:MYVUE.$Message.error('请求的资源未找到'); break; //资源未找到
        case 405:MYVUE.$Message.error('请求的方法不允许'); break; //请求方法不允许
        case 408:MYVUE.$Message.error('请求超时'); break; //请求超时
        case 500:MYVUE.$Message.error('服务器内部错误');  break; //服务器内部错误
        default:MYVUE.$Message.error('未知错误'); //其它错误
      }
    }

    MYVUE.$Loading.error();
    return Promise.reject(error);
  });

export default axios