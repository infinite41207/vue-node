<template>
  <b-container class="mt-2">
    <b-card>
      <b-row>
        <b-col>
          <NestedList v-model="data.list" el-type="main" @remove-item="onRemoveListItem" />
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
import NestedList from './NestedList.vue'

export default {
  components: {
    NestedList,
  },

  props: ['data', 'select'],

  data() {
    return {
      selectWidget: this.select,
      selectElement: '',
      selectVal: false,
    }
  },

  watch: {
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val)
      },
      deep: true,
    },
  },

  mounted() {},

  methods: {
    onRemoveListItem(idx) {
      this.data.list.splice(idx, 1)
    },
  },
}
</script>

<style>
</style>