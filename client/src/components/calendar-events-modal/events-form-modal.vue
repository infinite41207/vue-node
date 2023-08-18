<script>
import DatePicker from 'vue2-datepicker'
import { mapActions, mapGetters } from 'vuex'
import Multiselect from 'vue-multiselect'

export default {
  name: 'CalendarEventsFormModal',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    defaultData: {
      type: Object,
      default: () => ({}),
    },
    linkToParent: {
      type: String,
      default: '',
    },
  },
  components: {
    DatePicker,
    Multiselect,
  },
  computed: {
    ...mapGetters({
      calendars: 'calendars/calendars',
      usersList: 'users/getUsers',
    }),
    currentUser() {
      return this.$store.state.auth.currentUser
    },
    modalVisible: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  async mounted() {
    await this.$store.dispatch('users/findAll', {})
    await this.$store.dispatch('calendars/findAllCalendars', {})
  },
  data() {
    return {
      formData: {},
      myCalendars: [],
      users: [],
      selectedAttendees: [],
      datePickerType: 'datetime',
      datePickerFormat: 'DD/MM/YYY',
    }
  },
  methods: {
    ...mapActions({
      createEvent: 'calendarEvents/createEvent',
      updateEvent: 'calendarEvents/updateEvent',
    }),
    // modal form methods
    handleChangeAllDay(newVal) {
      if (!newVal) {
        this.datePickerType = 'datetime'
        this.datePickerFormat = 'DD/MM/YYYY HH:mm'
      } else {
        this.datePickerType = 'date'
        this.datePickerFormat = 'DD/MM/YYYY'
      }
    },
    async handleSave() {
      const attendees = this.selectedAttendees.map((item) => item.id)
      const formData = { ...this.formData, attendees }
      await (formData.id ? this.updateEvent : this.createEvent)(formData)
      this.modalVisible = false
      this.onClose()
    },
    onClose() {
      this.formData = {
        title: '',
        parentType: '',
        parentId: '',
        start: null,
        end: null,
        allDay: false,
        notes: '',
      }
      this.selectedAttendees = []
    },
  },
  watch: {
    usersList(newVal) {
      const users = newVal.filter((e) => e.id !== this.currentUser.id)
      this.users = users
    },
    calendars(newCalendars) {
      const myCalendars = newCalendars.filter((cal) => cal.ownerId === this.currentUser.id)
      this.myCalendars = myCalendars
    },
    value(visible) {
      if (!visible) return

      if (this.defaultData.attendees?.length > 0) {
        this.selectedAttendees = this.users.filter((user) => this.defaultData.attendees.includes(user.id))
      } else {
        this.selectedAttendees = []
      }
      this.formData = this.defaultData

      if (!this.defaultData.allDay) {
        this.datePickerType = 'datetime'
        this.datePickerFormat = 'DD/MM/YYYY HH:mm'
      } else {
        this.datePickerType = 'date'
        this.datePickerFormat = 'DD/MM/YYYY'
      }
    },
  },
}
</script>

<template>
  <b-modal id="calendar-event-modal" v-model="modalVisible" @hidden="onClose" centered size="md" title="Tworzenie wydarzenia" title-tag="h4" title-class="modal-title">
    <template v-slot:modal-footer>
      <div class="w-100">
        <b-button-toolbar>
          <b-button variant="success" size="sm" class="mr-2" @click="handleSave">Save</b-button>
          <b-button variant="secondary" size="sm" class="mr-2" @click="modalVisible = false">Anuluj</b-button>
        </b-button-toolbar>
      </div>
    </template>
    <form>
      <div class="form-group">
        <label for="title">Tytuł</label>
        <b-form-input id="title" v-model="formData.title" placeholder="Dodaj tytuł"> </b-form-input>
      </div>
      <div class="mt-2" v-if="formData.id && formData.parentType && formData.parentId">
        <router-link :to="linkToParent" class="item-link">Go to parent document</router-link>
      </div>
      <div class="form-group mt-2">
        <label>Calendar</label>
        <b-form-select v-model="formData.calendarId" :options="myCalendars" text-field="title" value-field="id" required />
      </div>
      <div class="form-group mt-2">
        <i class="ri-user-add-line mr-1"></i>
        <span>Attendees</span>
        <multiselect v-model="selectedAttendees" :options="users" track-by="name" label="name" :multiple="true" :taggable="true"></multiselect>
      </div>
      <div class="form-group d-flex align-items-center mt-2">
        <i class="ri-time-line"></i>
        <label class="mb-0 mx-1">All day</label>
        <b-form-checkbox v-model="formData.allDay" switch @change="handleChangeAllDay" />
      </div>
      <div class="form-group">
        <date-picker
          v-model="formData.start"
          name="start"
          size="sm"
          :format="datePickerFormat"
          :type="datePickerType"
          :time-picker-options="{
            start: '08:30',
            step: '00:30',
            end: '18:30',
          }"
        />
      </div>
      <div class="form-group">
        <date-picker
          v-model="formData.end"
          name="end"
          :format="datePickerFormat"
          :type="datePickerType"
          :time-picker-options="{
            start: '08:30',
            step: '00:30',
            end: '18:30',
          }"
          size="sm"
        />
      </div>
      <div class="form-group">
        <label>
          <i class="ri-file-list-2-line"></i>
          Notes
        </label>
        <b-form-textarea id="textarea" v-model="formData.notes" placeholder="Enter something..." rows="3" max-rows="6"></b-form-textarea>
      </div>
    </form>
  </b-modal>
</template>

<style lang="scss"></style>
