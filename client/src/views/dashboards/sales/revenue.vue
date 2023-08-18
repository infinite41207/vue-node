<script>
import VueApexCharts from 'vue-apexcharts'
import moment from 'moment'

export default {
  name: 'DashboardEcommerceRevenue',
  components: { VueApexCharts },
  data() {
    return {
      series: [
        {
          name: 'Current Week',
          data: [10, 20, 15, 25, 20, 30, 20],
        },
        {
          name: 'Previous Week',
          data: [0, 15, 10, 30, 15, 35, 25],
        },
      ],
      chartOptions: {
        chart: {
          dropShadow: {
            enabled: true,
            opacity: 0.2,
            blur: 7,
            left: -7,
            top: 7,
          },
          toolbar: {
            show: false,
          },
          parentHeightOffset: 0,
        },
        grid: {
          padding: {
            left: 0,
            right: 0,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
          width: 4,
        },
        colors: ['#32AE89', '#727cf5'],
        zoom: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        xaxis: {
          type: 'string',
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          tooltip: {
            enabled: false,
          },
          axisBorder: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return '$' + val
            },
            offsetX: -15,
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return '$' + val
            },
          },
        },
      },
      currentWeekAmount: 0,
      prevWeekAmount: 0,
      todayAmount: 0,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // customer requests amount - sumBrutto
      const period = [moment().startOf('week'), moment().endOf('week')]

      const lastWeek = moment().subtract(1, 'week')

      const params = {
        filter: { period },
        group: 'day',
      }

      Promise.all([this.getTotalAmount(params), this.getTotalAmount({ ...params, filter: { period: [lastWeek.startOf('week'), lastWeek.endOf('week')] } })]).then((data) => {
        this.series[0].data = this.getSeries(data[0].count)
        this.series[1].data = this.getSeries(data[1].count)

        this.currentWeekAmount = this.series[0].data.reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
        this.prevWeekAmount = this.series[1].data.reduce((a, b) => parseFloat(a) + parseFloat(b), 0)

        const today = data[0].count.find((item) => moment().diff(moment(item.group)) === 0)
        this.todayAmount = today?.totalAmount || 0

        this.$refs.crCharts.updateSeries(this.series, false, true)
      })
    },
    async getTotalAmount(params) {
      return this.$store.dispatch('customerRequests/getAmount', { params }).then((res) => res.data)
    },
    getSeries(data) {
      const arr = [0, 0, 0, 0, 0, 0, 0]
      data.map((item) => {
        const day = moment(item.group).format('d')
        arr[day - 1] = item.totalAmount
      })
      return arr
    },
  },
}
</script>

<template>
  <b-card>
    <div class="d-flex justify-content-between">
      <h4 class="header-title mb-3">Amount of customer request</h4>
      <b-dropdown toggle-class="card-drop p-0" variant="black" no-caret right>
        <template v-slot:button-content>
          <i class="ri-more-2-fill"></i>
        </template>
        <b-dropdown-item>Sales Report</b-dropdown-item>
        <b-dropdown-item>Export Report</b-dropdown-item>
        <b-dropdown-item>Profit</b-dropdown-item>
        <b-dropdown-item>Action</b-dropdown-item>
      </b-dropdown>
    </div>

    <div class="row text-center">
      <div class="col-md-6">
        <p class="text-muted mb-0 mt-3">Current Week</p>
        <h2 class="font-weight-normal mb-3">
          <i class="ri-checkbox-blank-circle-fill text-success align-middle mr-1"></i>
          <span>${{ currentWeekAmount }}</span>
        </h2>
      </div>
      <div class="col-md-6">
        <p class="text-muted mb-0 mt-3">Previous Week</p>
        <h2 class="font-weight-normal mb-3">
          <i class="ri-checkbox-blank-circle-fill text-indigo align-middle mr-1"></i>
          <span>${{ prevWeekAmount }}</span>
        </h2>
      </div>
    </div>
    <div class="dash-item-overlay d-none d-md-block">
      <h5>Today's Earning: ${{ todayAmount }}</h5>
      <p class="text-muted font-13 mb-3 mt-2"> Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus... </p>
      <a href="javascript: void(0);" class="btn btn-outline-primary">
        View Statements
        <i class="ri-arrow-right-line ml-2"></i>
      </a>
    </div>
    <VueApexCharts height="317" type="line" ref="crCharts" class="apex-charts mt-3" :series="series" :options="chartOptions" />
  </b-card>
</template>
