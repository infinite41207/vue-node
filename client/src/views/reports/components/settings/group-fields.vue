<template>
  <b-row>
    <b-col>
      <draggable class="list-group col-md-12" group="groups" :v-model="groups">
        <div v-for="column in groups" :key="column.id">
          <GroupFieldItem :column="column" @change="onChangeColumn" />
        </div>
      </draggable>
    </b-col>
  </b-row>
</template>

<script>
import { mapMutations } from 'vuex'
import draggable from 'vuedraggable'
import GroupFieldItem from './group-field-item.vue'

export default {
  name: 'ReportGroupFields',

  components: {
    draggable,
    GroupFieldItem,
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
  },

  methods: {
    ...mapMutations({
      setReportSetting: 'reports/setReportSetting',
    }),

    onChangeColumn(column) {
      const groups = [...this.groups]

      const index = groups.findIndex((el) => el.id === column.id)
      if (index > -1) {
        groups[index] = column
      }

      this.setReportSetting({
        reportType: this.reportType,
        property: 'groups',
        value: groups,
      })
    },
  },
}
</script>

<style>
</style>