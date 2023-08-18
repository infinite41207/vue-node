<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'DashboardTasksOverview',
  components: { VueApexCharts },
  data() {
    return {
      series: [
        {
          name: 'This year',
          data: [16, 44, 32, 48, 72, 60, 84, 64, 78, 50, 68, 34, 26, 44, 32, 48, 72, 60, 74, 52, 62, 50, 32, 22],
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
        colors: ['#727cf5'],
        xaxis: {
          categories: [
            'Sprint 1',
            'Sprint 2',
            'Sprint 3',
            'Sprint 4',
            'Sprint 5',
            'Sprint 6',
            'Sprint 7',
            'Sprint 8',
            'Sprint 9',
            'Sprint 10',
            'Sprint 11',
            'Sprint 12',
            'Sprint 13',
            'Sprint 14',
            'Sprint 15',
            'Sprint 16',
            'Sprint 17',
            'Sprint 18',
            'Sprint 19',
            'Sprint 20',
            'Sprint 21',
            'Sprint 22',
            'Sprint 23',
            'Sprint 24',
          ],
          axisBorder: {
            show: false,
          },
        },
        yaxis: {
          show: false,
        },
        fill: {
          opacity: 1,
        },
      },
    }
  },
}
</script>

<template>
  <b-card>
    <div class="d-flex justify-content-between mb-4">
      <h4 class="header-title">Tasks Overview</h4>

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

    <VueApexCharts height="320" type="bar" :series="series" :options="chartOptions"></VueApexCharts>
  </b-card>
</template>
