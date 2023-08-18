<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import appConfig from '@/app.config'
import LeftBar from './left-bar.vue'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import CalendarEventsFormModal from '@/components/calendar-events-modal/events-form-modal'

import _ from 'lodash'
export default {
  name: 'CalendarList',
  components: {
    FullCalendar,
    LeftBar,
    Layout,
    PageHeader,
    CalendarEventsFormModal,
  },
  page() {
    return {
      title: this.title,
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },
  computed: {
    ...mapGetters({
      calendars: 'calendars/calendars',
      events: 'calendarEvents/events',
      usersList: 'users/getUsers',
    }),
    currentUser() {
      return this.$store.state.auth.currentUser
    },
    linkToParent: {
      get() {
        let link = '/'

        if (this.selectedEvent.parentType === 'event') {
          link += 'event_detail/'
        }

        link += this.selectedEvent.parentId
        return link
      },
    },
  },
  async mounted() {
    window.addEventListener('scroll', this.handleHidePopup)
    document.body.addEventListener('click', (e) => this.clickOutside(e))
    this.findAllEvents()
    await this.$store.dispatch('users/findAll', {})
  },
  data() {
    return {
      title: this.$t('route.calendar'),
      calendarPlugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      users: [],
      currentEvents: [],
      calendarGroup: '',
      calendar: 'all',
      eventModalShow: false,
      selectedEvent: {},
    }
  },
  methods: {
    ...mapActions({
      findAllEvents: 'calendarEvents/findAllEvents',
      updateEvent: 'calendarEvents/updateEvent',
      deleteEvent: 'calendarEvents/deleteEvent',
    }),
    clickOutside(e) {
      const eventDetailRef = document.querySelector('.event-detail')
      if (!e.target.closest('.fc-event')) {
        if (eventDetailRef && eventDetailRef && !eventDetailRef.contains(e.target) && !eventDetailRef.classList.contains('d-none')) {
          eventDetailRef.classList.add('d-none')
        }
      }
    },
    // left bar methods
    handleCalendarChange({ calendarGroup, selectedCalendar }) {
      if (selectedCalendar === 'all') {
        this.currentEvents = this.events
        this.calendar = selectedCalendar
        this.calendarGroup = ''
        return
      }
      this.currentEvents = this.events.filter((e) => e.calendarId === selectedCalendar)
      this.calendar = selectedCalendar
      this.calendarGroup = calendarGroup
    },
    // full calendar methods
    handleGoToDate(ctx) {
      const calendarApi = this.$refs.fullCalendar.getApi()
      calendarApi.gotoDate(ctx.activeYMD)
    },
    handleDateSelect(payload) {
      if (this.calendarGroup === 'sharedCalendar') {
        return
      }

      this.selectedEvent = _.cloneDeep({
        allDay: payload.allDay,
        start: payload.start,
        end: payload.end,
        calendarId: this.calendar === 'all' ? '' : this.calendar,
      })
      this.eventModalShow = true
    },
    handleEventClick({ el, event }) {
      this.$refs.eventDetail.classList.add('d-none')
      const elRects = el.getBoundingClientRect()
      this.$refs.eventDetail.style.top = `${elRects.top - 105}px`
      if (window.innerWidth - elRects.right > 350) {
        this.$refs.eventDetail.style.left = `${elRects.right + 12}px`
        this.$refs.eventDetail.classList.add('right-position')
        this.$refs.eventDetail.classList.remove('left-position')
      } else {
        this.$refs.eventDetail.style.left = `${elRects.left - 320}px`
        this.$refs.eventDetail.classList.remove('right-position')
        this.$refs.eventDetail.classList.add('left-position')
      }

      const selectedEvent = _.cloneDeep(this.events.find((e) => e.id === event.id))
      selectedEvent.start = new Date(selectedEvent.start)
      selectedEvent.end = new Date(selectedEvent.end)
      this.selectedEvent = selectedEvent

      setTimeout(() => {
        this.$refs.eventDetail.classList.remove('d-none')
      }, 300)
    },
    handleEventUpdate({ event }) {
      const updateEvent = {
        id: event.id,
        date: event.date,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
      }
      this.updateEvent(updateEvent)
    },
    handleDelete() {
      this.handleHidePopup()
      this.deleteEvent({ id: this.selectedEvent.id })
    },
    handleHidePopup() {
      const eventDetailRef = document.querySelector('.event-detail')
      eventDetailRef?.classList.add('d-none')
    },
    showEditModal() {
      this.eventModalShow = true
      this.handleHidePopup()
    },
    getFormattedDate(curDate) {
      return moment(curDate).format('DD/MM/YYYY HH:mm')
    },
  },
  watch: {
    events(newVal) {
      this.currentEvents = newVal
    },
    usersList(newVal) {
      this.users = newVal.filter((e) => e.id !== this.currentUser.id)
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" />
    <b-card no-body>
      <b-card-body class="d-flex">
        <LeftBar @goToDate="handleGoToDate" @onCalendarChange="handleCalendarChange" />
        <div class="calendar-section">
          <FullCalendar
            ref="fullCalendar"
            defaultView="dayGridMonth"
            :editable="true"
            :events="currentEvents"
            :selectable="true"
            :plugins="calendarPlugins"
            :header="header"
            @eventClick="handleEventClick"
            @eventDrop="handleEventUpdate"
            @eventResize="handleEventUpdate"
            @select="handleDateSelect"
            :disabled="true"
          />
        </div>
      </b-card-body>
    </b-card>

    <CalendarEventsFormModal v-model="eventModalShow" :defaultData="selectedEvent" :linkToParent="linkToParent" />

    <div ref="eventDetail" class="event-detail d-none">
      <div class="title mb-3 d-flex align-items-center">
        {{ selectedEvent.title }}
      </div>
      <div class="mb-2" v-if="selectedEvent.parentType && selectedEvent.parentId">
        <router-link :to="linkToParent" class="item-link">Go to parent document</router-link>
      </div>
      <div class="mb-2">
        <i class="ri-time-line"></i>
        {{ `${getFormattedDate(selectedEvent.start)} - ${getFormattedDate(selectedEvent.end)}` }}
      </div>
      <div class="d-flex align-items-center mb-1">
        <i class="ri-user-add-line mr-1"></i>
        <div v-if="selectedEvent.ownerId === this.currentUser.id">You are organizer</div>
        <div v-else>{{ selectedEvent.owner?.name }} invited you</div>
      </div>
      <div class="mb-2">
        <i class="ri-file-list-2-line"></i>
        {{ selectedEvent.notes }}
      </div>
      <div v-if="selectedEvent.ownerId === this.currentUser.id">
        <b-button variant="primary" size="sm" @click="showEditModal">Edit</b-button>
        <b-button variant="danger" class="ml-1" size="sm" @click="handleDelete">Delete</b-button>
      </div>
    </div>
  </Layout>
</template>

<style lang="scss">
.event-detail {
  position: fixed;
  transition: 0.1s ease-in;
  background-color: white;
  padding: 2rem;
  box-shadow: 0px 0px 7px -1px rgb(0 0 0 / 32%);
  z-index: 99;
  top: 0;
  opacity: 1;

  &.d-none {
    opacity: 0;
    z-index: -1;
  }

  .title {
    font-size: 1.25rem;
    font-weight: 500;
  }

  &:before {
    content: '';
    position: absolute;
    display: block;
    top: 50%;
    width: 25px;
    height: 25px;
    background: white;
    box-shadow: -6px 6px 8px -7px rgb(0 0 0 / 32%);
  }

  &.left-position {
    &:before {
      transform: rotate(220deg);
      right: -5px;
    }
  }

  &.right-position {
    &:before {
      transform: rotate(48deg);
      left: -5px;
    }
  }
}

.private {
  i {
    font-size: 22px;
  }
}
</style>
