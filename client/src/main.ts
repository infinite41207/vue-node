import Vue from 'vue'
import App from './App.vue'
import './axiosConfig'
import './registerServiceWorker'
import router from './router'
import store from './store'

import BootstrapVue from 'bootstrap-vue'
import i18n from '@/lang'
import Vuelidate from 'vuelidate'
import VueExcelEditor from 'vue-excel-editor'
import VueLayers from 'vuelayers'
import VueSelects from 'vue-select'
import Select from '@/components/common/select.vue'
import vco from 'v-click-outside'
import '@/components/_globals'
import CodeDiff from 'v-code-diff'

import dateFilter from '@/filters/date-filter'
import upperCaseFilter from '@/filters/upper-case-filter'
import lowerCaseFilter from '@/filters/lower-case-filter'

Vue.filter('date', dateFilter)
Vue.filter('upper', upperCaseFilter)
Vue.filter('lower', lowerCaseFilter)

Vue.config.productionTip = false

Vue.use(VueExcelEditor)
Vue.use(BootstrapVue)
Vue.use(Vuelidate)
Vue.use(vco)
// eslint-disable-next-line
Vue.use(require('vue-moment'))
Vue.use(CodeDiff)

// Set the components prop default to return our fresh components
VueSelects.props.components.default = () => ({
  OpenIndicator: {
    render: (createElement: any) => createElement('span', ''),
  },
})

Vue.component('VSelect', VueSelects)
Vue.component('FSelect', Select)

// register all VueLayers components
Vue.use(VueLayers, {
  // global data projection, see https://vuelayers.github.io/#/quickstart?id=global-data-projection
  // dataProjection: 'EPSG:4326',
})

process.on('unhandledRejection', (error) => {
  console.error(error)
})

const app = new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')

declare global {
  interface Window {
    Cypress?: any
    app?: any
    ipcRenderer?: any
  }
}

if (window.Cypress) {
  // only available during E2E tests
  window.app = app
}
