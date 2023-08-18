<template>
  <b-row>
    <b-col>
      <draggable class="list-group col-md-12" group="sums" :v-model="funcs">
        <div v-for="func in funcs" :key="func.id">
          <ResourseItem :func="func" @change="onChangeFunc" />
        </div>
      </draggable>
    </b-col>
  </b-row>
</template>

<script>
import { mapMutations } from 'vuex'
import draggable from 'vuedraggable'
import ResourseItem from './resourse-item.vue'

export default {
  name: 'ReportResourses',

  components: {
    draggable,
    ResourseItem,
  },

  props: {
    reportType: {
      type: String,
      require: true,
      default: null,
    },

    settings: {
      type: Object,
      require: true,
      default() {
        return {}
      },
    },
  },

  computed: {
    funcs: {
      get() {
        return this.settings?.funcs
      },
      set(value) {
        this.setReportSetting({
          reportType: this.reportType,
          property: 'funcs',
          value,
        })
      },
    },
  },

  methods: {
    ...mapMutations({
      setReportSetting: 'reports/setReportSetting',
    }),

    onChangeFunc(func) {
      const funcs = [...this.funcs]

      const index = funcs.findIndex((el) => el.id === func.id)
      if (index > -1) {
        funcs[index] = func
      }

      this.setReportSetting({
        reportType: this.reportType,
        property: 'funcs',
        value: funcs,
      })
    },
  },
}
</script>

<style>
</style>