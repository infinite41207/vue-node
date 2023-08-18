<template>
  <div id="app">
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script lang="ts">
import appConfig from '@/app.config.json'
import { Component, Vue } from 'vue-property-decorator'

@Component<App>({
  page: {
    // All subcomponent titles will be injected into this template.
    titleTemplate(title: any) {
      title = typeof title === 'function' ? title().title : title
      return title ? `${title} | ${appConfig.title}` : appConfig.title
    },
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import '@/design/app.scss';
</style>
