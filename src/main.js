import App from './App';
import Vue from 'vue';

import VueKonva from 'vue-konva';

Vue.use(VueKonva);

/* eslint-disable no-new */
new Vue({
  render: h => h(App),
  el: '#app',
  template: '<App/>'
});
