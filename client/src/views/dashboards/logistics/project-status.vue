<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'DashboardProjectsStatus',
  components: {
    VueApexCharts,
  },
  data() {
    return {
      series: [64, 26, 10],
      chartOptions: {
        legend: {
          show: false,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          colors: ['transparent'],
        },
        labels: ['Completed', 'In-progress', 'Behind'],
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
        colors: ['#32AE89', '#727cf5', '#fa5c7c'],
      },
    }
  },
}
</script>

<template>
  <b-card>
    <div class="d-flex justify-content-between mb-4">
      <h4 class="header-title">Project Status</h4>

      <b-dropdown toggle-class="card-drop p-0" variant="black" no-caret right>
        <template v-slot:button-content>
          <i class="ri-more-2-fill"></i>
        </template>
        <b-dropdown-item>Weekly Report</b-dropdown-item>
        <b-dropdown-item>Monthly Report</b-dropdown-item>
        <b-dropdown-item>Action</b-dropdown-item>
        <b-dropdown-item>Settings</b-dropdown-item>
      </b-dropdown>
    </div>
    <VueApexCharts height="200" type="donut" class="apex-charts mb-4 mt-4" :series="series" :options="chartOptions" />

    <div class="row text-center mt-2 py-2">
      <div class="col-4">
        <i class="ri-arrow-right-up-line text-success mt-3 h3"></i>
        <h3 class="font-weight-normal">64%</h3>
        <p class="text-muted mb-0">Completed</p>
      </div>
      <div class="col-4">
        <i class="ri-arrow-right-down-line text-indigo mt-3 h3"></i>
        <h3 class="font-weight-normal">26%</h3>
        <p class="text-muted mb-0">In-progress</p>
      </div>
      <div class="col-4">
        <i class="ri-arrow-right-down-line text-danger mt-3 h3"></i>
        <h3 class="font-weight-normal">10%</h3>
        <p class="text-muted mb-0">Behind</p>
      </div>
    </div>
  </b-card>
</template>
