import '@/assets/main.scss'

import Vue from 'vue'
import App from '@/views/AppView.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
