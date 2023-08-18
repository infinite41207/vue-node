<template>
  <b-row>
    <b-col>
      <draggable class="list-group col-md-12" group="filters" :v-model="filters">
        <div v-for="filter in filters" :key="filter.id">
          <FilterFieldItem :filter="filter" @change="onChangeFilter" />
        </div>
      </draggable>
    </b-col>
  </b-row>
</template>

<script>
import { mapMutations } from 'vuex'
import draggable from 'vuedraggable'
import FilterFieldItem from './filter-field-item.vue'

export default {
  name: 'ReportFilterFields',

  components: {
    draggable,
    FilterFieldItem,
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
    filters: {
      get() {
        return this.settings?.filters
      },
      set(value) {
        this.setReportSetting({
          reportType: this.reportType,
          property: 'filters',
          value,
        })
      },
    },
  },

  methods: {
    ...mapMutations({
      setReportSetting: 'reports/setReportSetting',
    }),

    onChangeFilter(filter) {
      const filters = [...this.filters]

      const index = filters.findIndex((el) => el.id === filter.id)
      if (index > -1) {
        filters[index] = filter
      }

      this.setReportSetting({
        reportType: this.reportType,
        property: 'filters',
        value: filters,
      })
    },
  },
}
</script>

<style>
</style>