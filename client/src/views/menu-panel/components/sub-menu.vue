<template>
  <b-col v-if="item.isSubsystem === true" :cols="12">
    <h4 class="title">{{ getTitle() }}</h4>
    <b-row justify="space-around">
      <b-col v-for="(childItems, index) in item.children" :key="index" cols="12" md="6" lg="4" xl="3" class="mb-0">
        <menu-card :item="childItems" :parent-path="item.path" size="medium" />
      </b-col>
    </b-row>
  </b-col>
  <b-col v-else key="is-mobile-dropdown" cols="4">
    <menu-card :item="item" size="medium" />
  </b-col>
</template>

<script>
import MenuCard from './menu-card'

export default {
  name: 'SubMenu',

  components: {
    MenuCard,
  },

  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
  },

  mounted() {},

  methods: {
    getTitle() {
      if (this.item.isDynamic) {
        return this.item.title
      }

      return this.$tc(`route.${this.item.title}`)
    },
  },
}
</script>

<style lang="scss">
.title {
  font-weight: 700;
  font-size: 18px;
  color: #3f4346;
  margin: 0;
  margin-bottom: 24px;
}
</style>
