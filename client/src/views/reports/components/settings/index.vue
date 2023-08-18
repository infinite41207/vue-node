<template>
  <div>
    <b-sidebar id="report-settings" v-model="isOpen" :title="$tc('common.settings') | upper" right backdrop width="640px">
      <b-tabs pills card>
        <b-tab :title="$t('common.general')">
          <b-row v-if="settings?.periodType === 0" class="mb-2">
            <b-col cols="8">
              <b-form-group horizontal :label-cols="2" :label="$t('table.date')">
                <b-form-datepicker id="report-date" v-model="reportDate" :value-as-date="true" menu-class="w-100" calendar-width="100%" size="sm"></b-form-datepicker>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="settings?.periodType === 1" class="mb-1">
            <b-col>
              <b-form-group horizontal :label-cols="2" :label="$t('table.from')">
                <b-form-datepicker id="period-start" v-model="periodStart" :value-as-date="true" @input="onInputPeriodStart"></b-form-datepicker>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="settings?.periodType === 1" class="mb-2">
            <b-col>
              <b-form-group horizontal :label-cols="2" :label="$t('table.to')">
                <b-form-datepicker id="period-finish" v-model="periodFinish" :value-as-date="true" @input="onInputPeriodFinish"></b-form-datepicker>
              </b-form-group>
            </b-col>
          </b-row>

          <ReportVariants v-if="showVariants" :report-type="reportType" />
        </b-tab>
        <b-tab :title="$t('report.selectedFields')">
          <SelectedFields :report-type="reportType" :settings="settings" />
        </b-tab>
        <b-tab :title="$t('report.filters')">
          <FilterFields :report-type="reportType" :settings="settings" />
        </b-tab>
        <b-tab :title="$t('report.groups')">
          <GroupFields :report-type="reportType" :settings="settings" />
        </b-tab>
        <b-tab :title="$t('report.resourses')">
          <Resourses :report-type="reportType" :settings="settings" />
        </b-tab>
      </b-tabs>
    </b-sidebar>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ReportVariants from '../report-variants.vue'
import SelectedFields from './selected-fields.vue'
import FilterFields from './filter-fields.vue'
import GroupFields from './group-fields.vue'
import Resourses from './resourses.vue'

export default {
  name: 'ReportSettings',

  components: {
    ReportVariants,
    SelectedFields,
    FilterFields,
    GroupFields,
    Resourses,
  },

  props: {
    reportType: {
      type: String,
      require: true,
      default: null,
    },
  },

  data() {
    return {
      showVariants: true,
    }
  },

  computed: {
    ...mapGetters({
      getReportView: 'reports/reportView',
    }),

    reportView() {
      return this.getReportView(this.reportType)
    },

    settings() {
      return this.reportView?.settings
    },

    isOpen: {
      get() {
        return this.settings?.isOpen
      },
      set(value) {
        this.setReportSetting({
          reportType: this.reportType,
          property: 'isOpen',
          value,
        })
      },
    },

    reportDate: {
      get() {
        return this.settings?.reportDate
      },
      set(value) {
        this.setReportSetting({
          reportType: this.reportType,
          property: 'reportDate',
          value,
        })
      },
    },

    periodStart: {
      get() {
        return this.settings?.periodStart
      },
      set(value) {
        this.setReportSetting({
          reportType: this.reportType,
          property: 'periodStart',
          value,
        })
      },
    },

    periodFinish: {
      get() {
        return this.settings?.periodFinish
      },
      set(value) {
        this.setReportSetting({
          reportType: this.reportType,
          property: 'periodFinish',
          value,
        })
      },
    },
  },

  methods: {
    ...mapMutations({
      setReportSetting: 'reports/setReportSetting',
    }),

    onInputPeriodStart() {
      if (this.periodStart > this.periodFinish) {
        this.setReportSetting({
          reportType: this.reportType,
          property: 'periodStart',
          value: this.periodFinish,
        })

        this.showPeriodDanger()
      }
    },

    onInputPeriodFinish() {
      if (this.periodFinish < this.periodStart) {
        this.setReportSetting({
          reportType: this.reportType,
          property: 'periodFinish',
          value: this.periodStart,
        })

        this.showPeriodDanger()
      }
    },

    showPeriodDanger() {
      this.$bvToast.toast(this.$t('report.msg.periodControl'), {
        title: this.$tc('common.msg'),
        variant: 'danger',
        solid: true,
        autoHideDelay: 2000,
      })
    },
  },
}
</script>

<style>
</style>