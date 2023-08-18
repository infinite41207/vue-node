<template>
  <h3 class="title-header text-center">
    <b-popover v-if="help" ref="helpTitle" placement="top-start" :title="title" class="container-help" width="400" trigger="hover">
      <div class="content-help" v-html="help" />
    </b-popover>

    <div class="container-title">
      {{ title }}
    </div>

    <slot />
  </h3>
</template>

<script>
export default {
  name: 'TitleAndHelp',

  props: {
    title: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      help: '',
    }
  },

  created() {
    if (this.$route.meta.description) {
      this.help = this.$route.meta.description
    }
  },
}
</script>

<style>
/* text content title */
.b-popover__title {
  padding-top: 10px;
  padding-left: 10px;
}
</style>

<style lang="scss" scoped>
// title container
.title-header {
  margin: 0px 0px !important;
  padding-top: 0px !important;
  padding-bottom: 20px !important;
}
// text content help into popover
.content-help {
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 0px !important;
  padding-bottom: 10px;
  word-break: break-word;
}
// title of the main views into popover
.container-title {
  text-align: left;
  color: #3f4346;
  font-size: 32px;
  font-weight: 700;
}
// smart browser help in title popover
.container-help {
  width: 100%;
  height: 200%;
  padding-left: 39px !important;
}
</style>
