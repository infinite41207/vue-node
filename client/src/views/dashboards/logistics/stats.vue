<script>
export default {
  name: 'DashboardProjectsStats',
  data() {
    return {
      statData: [
        {
          icon: 'ri-briefcase-line',
          value: '29',
          text: 'Total Projects',
        },
        {
          icon: 'ri-list-check-2',
          value: '715',
          text: 'Total Tasks',
        },
        {
          icon: 'ri-group-line',
          value: '31',
          text: 'Members',
        },
        {
          icon: 'ri-line-chart-line',
          value: '93%',
          text: 'Productivity',
        },
      ],
    }
  },
}
</script>

<template>
  <b-card class="widget-inline">
    <div class="row no-gutters">
      <div v-for="data of statData" :key="data.text" class="col-sm-6 col-xl-3">
        <b-card class="text-center border-left">
          <i :class="`${data.icon} text-muted`" style="font-size: 24px"></i>
          <h3>
            {{ data.value }}
          </h3>
          <p class="text-muted font-15 mb-0">{{ data.text }}</p>
        </b-card>
      </div>
    </div>
  </b-card>
</template>
