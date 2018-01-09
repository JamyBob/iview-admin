
import Vue from 'vue';
import Cookies from 'js-cookie';
import Util from '@/libs/util';

Vue.directive('permission', {
    bind: function (el, binding, vnode) {
      let access = JSON.parse(Cookies.get('access'));
       if (!Util.showThisRoute(binding.value, access)) {
           el.style.display="none";
       }      
    }
  })