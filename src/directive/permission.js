import Vue from 'vue';
import Cookies from 'js-cookie';
import Util from '@/libs/util';

Vue.directive('permission', {
    bind: function (el, binding, vnode) {     
       if (!Util.showThisRoute(binding.value,  JSON.parse(Cookies.get("access")))) {
           el.style.display="none";
       }      
    }
  })