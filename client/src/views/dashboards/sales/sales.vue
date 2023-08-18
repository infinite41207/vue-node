<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'DashboardEcommerceSales',
  components: { VueApexCharts },
  data() {
    return {
      series: [],
      chartOptions: {
        legend: {
          show: false,
        },
        stroke: {
          colors: ['transparent'],
        },
        labels: [],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
        colors: ['#727cf5', '#32AE89', '#fa5c7c', '#ffbc00', '#39afd1'],
        tooltip: {
          y: {
            enabled: true,
            formatter: function (val) {
              return '$' + val
            },
          },
        },
      },
      textColors: ['text-indigo', 'text-primary', 'text-danger', 'text-warning', 'text-info'],
      managers: [],
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // customer requests amount by managers - sumBrutto
      const params = {
        group: 'manager',
      }

      this.$store
        .dispatch('customerRequests/getAmount', { params })
        .then((res) => res.data?.count)
        .then((data) => {
          this.managers = data
          const series = []
          const labels = []
          data.map((item) => {
            series.push(parseFloat(item.totalAmount))
            labels.push(item.manager.name)
          })
          this.series = series
          this.chartOptions.labels = labels
          this.$refs.crCharts.updateOptions(this.chartOptions, false, true)
        })
    },
  },
}
</script>

<template>
  <b-card>
    <div class="d-flex justify-content-between">
      <h4 class="header-title">Amount by managers</h4>
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

    <VueApexCharts height="290" type="donut" ref="crCharts" class="apex-charts mb-4 mt-4" :series="series" :options="chartOptions" />

    <div class="chart-widget-list">
      <div v-for="(manager, i) in managers" :key="manager.id" class="d-flex justify-content-between">
        <p>
          <i class="ri-checkbox-blank-fill" :class="textColors[i]"></i>
          {{ manager.manager.name }}
        </p>
        <span>${{ manager.totalAmount }}</span>
      </div>
    </div>
  </b-card>
</template>
