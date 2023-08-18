<template>
  <div class="calendar-left-bar">
    <b-calendar class="navigate-calendar" :hide-header="true" @context="onContext" />
    <div class="calendars">
      <div class="mb-1 d-flex justify-content-between align-items-center">
        <span>My calendars</span>
        <b-button variant="light" size="sm" @click="modalShow = !modalShow">
          <i class="ri-add-fill"></i>
        </b-button>
      </div>
      <b-radio-group v-model="selectedCalendar" @change="handleCalendarChange('myCalendar')" stacked>
        <b-radio value="all" class="mb-1">All</b-radio>
        <b-radio v-for="(calendar, index) in myCalendars" :key="index" :value="calendar.id" class="mb-1" :style="{ zIndex: 100 + myCalendars.length - index }">
          {{ calendar.title }}

          <b-dropdown right menu-class="" toggle-class="p-0" variant="text" no-caret>
            <template slot="button-content">
              <i class="ri-more-2-fill"></i>
            </template>

            <b-dropdown-item @click="handleEdit(calendar)">Edit</b-dropdown-item>
            <b-dropdown-item @click="handleDelete(calendar.id)">Delete</b-dropdown-item>
          </b-dropdown>
        </b-radio>
      </b-radio-group>
      <div class="mt-4">Available for me</div>
      <b-radio-group v-model="selectedCalendar" @change="handleCalendarChange('sharedCalendar')" stacked>
        <b-radio value="all" class="mb-1">All</b-radio>
        <b-radio v-for="(calendar, index) in sharedCalendars" :key="index" :value="calendar.id" class="mb-1">
          {{ calendar.title }}
        </b-radio>
      </b-radio-group>
    </div>
    <b-modal v-model="modalShow" @hidden="onCloseModal" centered size="md" title="Add Calendar" title-tag="h4" title-class="modal-title">
      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button-toolbar>
            <b-button variant="success" size="sm" class="mr-2" @click="handleSave">Save</b-button>
            <b-button variant="secondary" size="sm" class="mr-2" @click="modalShow = false">Anuluj</b-button>
          </b-button-toolbar>
        </div>
      </template>
      <form>
        <div class="form-group">
          <label for="title">Tytuł</label>
          <b-form-input id="title" v-model="calendarFormData.title" :state="!$v.calendarFormData.title.$invalid" placeholder="Dodaj tytuł" />
        </div>
        <div class="form-group">
          <label for="color">Color</label>
          <b-form-input type="color" id="color" v-model="calendarFormData.color" />
        </div>

        <div class="d-flex">
          <b-radio-group v-model="calendarType" @change="handleChangeCalendarType">
            <b-radio value="private" class="mb-1">Private</b-radio>
            <b-radio value="common" class="mb-1">Shared</b-radio>
          </b-radio-group>

          <b-form-checkbox v-if="calendarType === 'common'" switch v-model="calendarFormData.type" value="common" unchecked-value="shared">Common</b-form-checkbox>
        </div>
        <UsersTable v-if="calendarFormData.type === 'shared'" :users="users" v-model="calendarFormData.attendees" />
      </form>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import UsersTable from './users-table.vue'

export default {
  name: 'CalendarLeftBar',
  props: {},
  components: { UsersTable },
  data() {
    return {
      modalShow: false,
      selectedCalendar: 'all',
      myCalendars: [],
      sharedCalendars: [],
      users: [],
      calendarFormData: {
        title: '',
        color: '#000000',
        type: 'private',
        attendees: null,
      },
      calendarType: 'private',
    }
  },
  validations: {
    calendarFormData: {
      title: {
        required,
      },
    },
  },
  computed: {
    ...mapGetters({
      calendars: 'calendars/calendars',
      usersList: 'users/getUsers',
    }),
    currentUser() {
      return this.$store.state.auth.currentUser
    },
  },
  async mounted() {
    this.findAllCalendars()
  },
  methods: {
    ...mapActions({
      findAllCalendars: 'calendars/findAllCalendars',
      createCalendar: 'calendars/createCalendar',
      updateCalendar: 'calendars/updateCalendar',
      deleteCalendar: 'calendars/deleteCalendar',
    }),
    onContext(ctx) {
      this.$emit('goToDate', ctx)
    },
    handleCalendarChange(calendarGroup) {
      this.$emit('onCalendarChange', { calendarGroup, selectedCalendar: this.selectedCalendar })
    },
    async fillUsers() {
      const users = []
      this.usersList.forEach((user) => {
        if (user.id !== this.currentUser.id) {
          users.push({
            userId: user.id,
            name: user.name,
            isActive: false,
          })
        }
      })
      this.users = users
    },
    handleChangeCalendarType(newVal) {
      this.calendarFormData = {
        ...this.calendarFormData,
        type: newVal,
      }
    },
    handleEdit(calendar) {
      this.calendarFormData = calendar
      this.calendarType = calendar.type === 'shared' ? 'common' : 'private'
      this.users = this.users.map((user) => {
        if (calendar.attendees?.includes(user.userId)) {
          user.isActive = true
        }
        return user
      })
      this.modalShow = true
    },
    async handleDelete(calendarId) {
      await this.deleteCalendar({ id: calendarId })
    },
    async handleSave() {
      if (this.$v.$invalid === true) {
        this.$bvToast.toast(this.$t('msg.filingError'), {
          title: this.$t('common.msg'),
          variant: 'danger',
          solid: true,
          autoHideDelay: 2000,
        })
        return
      }
      let attendees = []
      if (this.calendarFormData.type === 'shared') {
        attendees = this.users.filter((user) => user.isActive).map((user) => user.userId)
      }
      const calendar = {
        ...this.calendarFormData,
        attendees,
      }

      await (this.calendarFormData.id ? this.updateCalendar : this.createCalendar)(calendar)
      this.modalShow = false
      this.onCloseModal()
    },
    onCloseModal() {
      this.calendarFormData = {
        title: '',
        color: '#000000',
        type: 'private',
        attendees: null,
      }
      this.calendarType = 'private'
      this.fillUsers()
      this.$nextTick(() => {
        this.$v.$reset()
        this.$v.calendarFormData.title.$reset()
      })
    },
  },
  watch: {
    calendars(newCalendars) {
      const myCalendars = []
      const sharedCalendars = []
      newCalendars.forEach((calendar) => {
        if (calendar.ownerId === this.currentUser.id) {
          myCalendars.push(calendar)
        } else {
          sharedCalendars.push(calendar)
        }
      })
      this.myCalendars = myCalendars
      this.sharedCalendars = sharedCalendars
    },
    usersList() {
      this.fillUsers()
    },
  },
}
</script>

<style lang="scss">
.calendar-left-bar {
  min-width: 300px;

  .navigate-calendar {
    margin-top: 4rem;

    .form-control {
      border: none !important;
    }

    .b-calendar-grid-help {
      display: none;
    }
  }

  .custom-control-label {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-right: 20px;
  }
}

.calendars {
  margin-top: 40px;
  padding-right: 24px;
}
</style>
