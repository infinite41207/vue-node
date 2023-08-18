<script>
import flatPickr from 'vue-flatpickr-component'
import moment from 'moment'

export default {
  name: 'DashboardProjectsCalendar',
  components: {
    flatPickr,
  },
  data() {
    return {
      moment: moment,
      calendarConfig: {
        inline: true,
        shorthandCurrentMonth: true,
      },
      selectedDate: moment().format('YYYY-MM-DD'),
      data: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const payload = {
        noCommit: true,
        params: {
          filter: {
            date: this.selectedDate
          }
        }
      }
      this.$store
        .dispatch('calendarEvents/findAllEvents', payload)
        .then(res => res.data.responseData)
        .then(data => {
          this.data = data.slice(0, 4)
        })
    }
  },
  watch: {
    selectedDate(newVal) {
      this.fetchData()
    }
  }
}
</script>

<template>
  <b-card>
    <b-row no-gutters class="justify-content-between mb-3">
      <h4 class="header-title">Your Calendar</h4>
      <b-dropdown toggle-class="card-drop p-0" variant="black" no-caret right>
        <template v-slot:button-content>
          <i class="ri-more-2-fill"></i>
        </template>
        <b-dropdown-item>Weekly Report</b-dropdown-item>
        <b-dropdown-item>Monthly Report</b-dropdown-item>
        <b-dropdown-item>Action</b-dropdown-item>
        <b-dropdown-item>Settings</b-dropdown-item>
      </b-dropdown>
    </b-row>

    <b-row class="calendar-widget calendar-widget-inline">
      <b-col cols="12" md="auto" class="mb-4 mb-md-0">
        <flat-pickr v-model="selectedDate" :config="calendarConfig"></flat-pickr>
      </b-col>
      <b-col cols="12" md="auto">
        <ul class="list-unstyled">
          <li v-for="item in data" :key="item.id" class="mb-4">
            <p class="text-muted mb-1 font-13">
              <i class="ri-calendar-event-fill"></i>
              {{ moment(item.start).format('H:MM A') }}
              -
              {{ moment(item.end).format('H:MM A') }}
            </p>
            <h5>{{ item.title }}</h5>
          </li>
        </ul>
      </b-col>
    </b-row>
  </b-card>
</template>
