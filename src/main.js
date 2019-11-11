import Vue from 'vue'
import App from './App.vue'
import VueShowdown from 'vue-showdown'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/theme/lesser-dark.css'

// Bootstrap stuff
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueShowdown, { options: {emoji: true}})
Vue.use(VueCodemirror,{ })

new Vue({
  render: h => h(App),
}).$mount('#app')
