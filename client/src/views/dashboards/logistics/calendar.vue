<script>
import flatPickr from 'vue-flatpickr-component'

export default {
  name: 'DashboardProjectsCalendar',
  components: {
    flatPickr,
  },
  data() {
    return {
      inlinepicker: +new Date(),
      inline: {
        inline: true,
        shorthandCurrentMonth: true,
      },
    }
  },
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
        <flat-pickr v-model="inlinepicker" :config="inline"></flat-pickr>
      </b-col>
      <b-col cols="12" md="auto">
        <ul class="list-unstyled">
          <li class="mb-4">
            <p class="text-muted mb-1 font-13"> <i class="ri-calendar-event-fill"></i> 7:30 AM - 10:00 AM </p>
            <h5>Meeting with BD Team</h5>
          </li>
          <li class="mb-4">
            <p class="text-muted mb-1 font-13"> <i class="ri-calendar-event-fill"></i> 10:30 AM - 11:45 AM </p>
            <h5>Design Review - Hyper Admin</h5>
          </li>
          <li class="mb-4">
            <p class="text-muted mb-1 font-13"> <i class="ri-calendar-event-fill"></i> 12:15 PM - 02:00 PM </p>
            <h5>Setup Github Repository</h5>
          </li>
          <li>
            <p class="text-muted mb-1 font-13"> <i class="ri-calendar-event-fill"></i> 5:30 PM - 07:00 PM </p>
            <h5>Meeting with Design Studio</h5>
          </li>
        </ul>
      </b-col>
    </b-row>
  </b-card>
</template>
