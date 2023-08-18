declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'nprogress/nprogress'
declare module 'vuelidate'
declare module 'vuelayers'
declare module 'vue-select'
declare module 'v-click-outside'
declare module 'vue-jstree'
declare module 'lodash'
declare module 'vue-excel-editor'

declare module '*.json' {
  const value: { [key: string]: any }
  export default value
}
