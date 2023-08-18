<script>
import DatePicker from 'vue2-datepicker'
import moment from 'moment'

//import appConfig from '@src/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'

import Stats from './stats'
import Projection from './projection'
import Revenue from './revenue'
import Sales from './sales'
import Calendar from './calendar'
import Products from './products'

/**
 * Dashboard-1 Component
 */
export default {
  name: 'DashboardEcommerce',
  page() {
    return {
      title: this.title,
      meta: [{ name: 'description' }],
    }
  },
  components: {
    DatePicker,
    PageHeader,
    Layout,
    Stats,
    Projection,
    Revenue,
    Sales,
    Calendar,
    Products,
  },
  data() {
    return {
      title: 'Dashboard',
      state: {
        period: [
          moment().startOf('month').toDate(),
          moment().endOf('month').toDate()
        ],
      },
    }
  },
}
</script>

<template>
  <Layout>
    <b-row>
      <b-col cols="12" sm="4">
        <PageHeader :title="title" />
      </b-col>
      <b-col cols="12" sm="8" class="d-flex justify-content-sm-end align-items-center">
        <b-form inline>
          <b-form-group class="date-picker">
            <date-picker v-model="state.period" range :first-day-of-week="1" lang="en" format="MM/DD/YYYY"></date-picker>
          </b-form-group>
          <b-button variant="primary" class="ml-2">
            <i class="ri-refresh-line"></i>
          </b-button>
          <b-button variant="primary" class="ml-1">
            <i class="ri-filter-3-line"></i>
          </b-button>
        </b-form>
      </b-col>
    </b-row>

    <div class="row">
      <div class="col-xl-5 col-lg-6">
        <Stats :period="state.period" />
      </div>
      <div class="col-xl-7 col-lg-6">
        <Projection />
      </div>
    </div>

    <div class="row">
      <div class="col-xl-9">
        <Revenue />
      </div>
      <div class="col-xl-3">
        <Sales />
      </div>
    </div>

    <div class="row">
      <div class="col-xl-6">
        <Calendar />
      </div>
      <div class="col">
        <Products />
      </div>
    </div>
  </Layout>
</template>

<style lang="scss">
.date-picker {
  margin-bottom: 0 !important;

  .mx-datepicker-range {
    width: 210px !important;
  }
}
</style>
