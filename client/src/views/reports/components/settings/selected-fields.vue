<template>
  <b-row>
    <b-col>
      <draggable class="list-group col-md-12" group="columns" v-model="columns">
        <div v-for="column in columns" :key="column.id">
          <SelectedFieldItem
            :column="column"
            :settings="settings"
            @change="onChangeColumn"
            @change-filters="updateFilters"
            @change-groups="onChangeGroups(column)"
            @change-functional="onChangeFunctional(column)"
            @change-totals="onChangeTotals(column)"
          />
        </div>
      </draggable>
    </b-col>
  </b-row>
</template>

<script>
import { mapMutations } from 'vuex'
import draggable from 'vuedraggable'
import SelectedFieldItem from './selected-field-item.vue'
import _ from 'lodash'

export default {
  name: 'ReportSelectedFields',

  components: {
    draggable,
    SelectedFieldItem,
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

  data() {
    return {
      objectOperators: ['=', '!=', 'inList', 'notInList'],
      enumOperators: ['=', '!=', 'inList', 'notInList'],
      textOperators: ['=', '!=', 'like', 'notLike'],
      numberOperators: ['=', '!=', '<=', '<', '>', '>='],
      dateOperators: ['=', '!=', '<=', '<', '>', '>='],
    }
  },

  computed: {
    columns: {
      get() {
        return this.settings?.columns
      },
      set(value) {
        this.setReportSetting({
          reportType: this.reportType,
          property: 'columns',
          value,
        })
      },
    },

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

    groups: {
      get() {
        return this.settings?.groups
      },
      set(value) {
        this.setReportSetting({
          reportType: this.reportType,
          property: 'groups',
          value,
        })
      },
    },

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

    totals: {
      get() {
        return this.settings?.totals
      },
      set(value) {
        this.setReportSetting({
          reportType: this.reportType,
          property: 'totals',
          value,
        })
      },
    },
  },

  async created() {
    this.updateFilters()
    this.updateGroupingFields()
  },

  methods: {
    ...mapMutations({
      setReportSetting: 'reports/setReportSetting',
    }),

    onChangeColumn(column) {
      const columns = _.cloneDeep(this.columns)

      const index = columns.findIndex((el) => el.id === column.id)
      if (index > -1) {
        columns[index] = column
      }

      this.setReportSetting({
        reportType: this.reportType,
        property: 'columns',
        value: columns,
      })
    },

    async updateFilters() {
      const filters = _.cloneDeep(this.filters)

      for (const column of this.columns) {
        const filter = filters.find((filter) => filter.id === column.id)

        if (filter === undefined) {
          if (column.filterable === true) {
            const newFilter = {
              id: column.id,
              use: true,
              description: column.description,
              property: column.property,
              type: column.type,
              sqlColumnName: column.sqlColumnName,
              valueType: column.valueType,
              operators: [],
              operator: '=',
              source: [],
              value: null,
            }

            if (column.valueType) {
              newFilter.operators = this[`${column.valueType}Operators`].map((el) => {
                return {
                  value: el,
                  text: this.$tc(`operators['${el}']`),
                }
              })
            }

            filters.push(newFilter)
          }
        } else {
          if (column.filterable === true) {
            filter.use = true
          } else {
            const index = filters.indexOf(filter)
            if (index > -1) {
              filters.splice(index, 1)
            }
          }
        }
      }

      this.setReportSetting({
        reportType: this.reportType,
        property: 'filters',
        value: filters,
      })
    },

    updateGroupingFields() {
      const groups = _.cloneDeep(this.groups)

      for (const column of this.columns) {
        const groupField = groups.find((el) => el.id === column.id)

        if (!groupField) {
          if (column.groupable === true) {
            groups.push({
              id: column.id,
              use: true,
              property: column.property,
              description: column.description,
              valueType: column.valueType,
              type: column.valueType,
            })
          }
        } else {
          if (column.groupable === false) {
            const index = groups.indexOf(groupField)
            groups.splice(index, 1)
          }
        }
      }

      this.setReportSetting({
        reportType: this.reportType,
        property: 'groups',
        value: groups,
      })
    },

    onChangeGroups(column) {
      let groups = _.cloneDeep(this.groups)

      if (column.groupable) {
        groups.push({
          id: column.id,
          use: true,
          property: column.property,
          description: column.description,
          valueType: column.valueType,
          title: column.title,
        })
      } else {
        groups = groups.filter((el) => el.id !== column.id)
      }

      this.setReportSetting({
        reportType: this.reportType,
        property: 'groups',
        value: groups,
      })
    },

    onChangeFunctional(column) {
      let funcs = _.cloneDeep(this.funcs)

      if (column.function) {
        funcs.push({
          id: column.id,
          property: column.property,
          description: column.description,
          valueType: column.valueType,
          type: column.valueType,
          use: true,
        })
      } else {
        funcs = funcs.filter((el) => el.id !== column.id)

        if (this.totals.length > 0) {
          const totals = this.totals.filter((el) => el.id !== column.id)

          this.setReportSetting({
            reportType: this.reportType,
            property: 'totals',
            value: totals,
          })
        }
      }

      this.setReportSetting({
        reportType: this.reportType,
        property: 'funcs',
        value: funcs,
      })
    },

    onChangeTotals(column) {
      const totals = _.cloneDeep(this.totals)

      if (column.isTotal) {
        const total = totals.find((el) => el.id === column.id)

        if (total) {
          total.use = true
        } else {
          totals.push({
            id: column.id,
            property: column.property,
            description: column.description,
            valueType: column.valueType,
            use: true,
          })
        }
      } else {
        totals.map((el) => {
          if (el.id === column.id) el.use = false
        })
      }

      this.setReportSetting({
        reportType: this.reportType,
        property: 'totals',
        value: totals,
      })
    },
  },
}
</script>

<style>
</style>