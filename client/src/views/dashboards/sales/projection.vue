<script>
import VueApexCharts from 'vue-apexcharts'
import moment from 'moment'

export default {
  name: 'DashboardEcommerceProjection',
  components: { VueApexCharts },
  data() {
    return {
      series: [
        {
          name: 'Actual',
          data: [65, 59, 80, 81, 56, 89, 40, 32, 65, 59, 80, 81],
        },
        {
          name: 'Projection',
          data: [89, 40, 32, 65, 59, 80, 81, 56, 89, 40, 65, 59],
        },
      ],
      chartOptions: {
        chart: {
          parentHeightOffset: 0,
          stacked: true,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '20%',
          },
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
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        zoom: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        colors: ['#727cf5', '#e3eaef'],
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          axisBorder: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            offsetX: -15,
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return '$' + val
            },
          },
        },
      },
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // customer requests amount - sumBrutto
      const params = {
        filter: {
          ordered: true,
          period: [moment().startOf('year'), moment().endOf('year')],
        },
        group: 'month',
      }

      Promise.all([this.getTotalAmount(params), this.getTotalAmount({ ...params, filter: { ...params.filter, ordered: false } })]).then((data) => {
        this.series[0].data = this.getSeries(data[0].count)
        this.series[1].data = this.getSeries(data[1].count)

        this.$refs.crCharts.updateSeries(this.series, false, true)
      })
    },
    async getTotalAmount(params) {
      return this.$store.dispatch('customerRequests/getAmount', { params }).then((res) => res.data)
    },
    getSeries(data) {
      const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      data.map((item) => {
        const month = moment(item.group).format('M')
        arr[month - 1] = item.totalAmount
      })
      return arr
    },
  },
}
</script>

<template>
  <b-card>
    <div class="d-flex justify-content-between">
      <h4 class="header-title mb-0">Projections Vs Actuals</h4>
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
    <VueApexCharts height="255" type="bar" ref="crCharts" :series="series" :options="chartOptions"></VueApexCharts>
  </b-card>
</template>
