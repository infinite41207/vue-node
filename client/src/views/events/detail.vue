<template>
  <Layout>
    <PageHeader :title="title" />

    <b-card>
      <b-row class="mb-3">
        <b-col>
          <b-button-toolbar>
            <b-btn-group>
              <a href="javascript:void(0);" class="btn btn-success btn-sm" :disabled="readOnly" @click="writeObject">
                <i class="ri-save-2-fill"></i>
                {{ $t('commands.writeAndClose') }}
              </a>
              <a href="javascript:void(0);" class="btn btn-info btn-sm ml-2" @click="closeView">
                <i class="ri-close-line"></i>
                {{ $t('commands.close') }}
              </a>
              <a href="javascript:void(0);" class="btn btn-info btn-sm ml-2" @click="eventFormModalShow = true">
                {{ $t('commands.addToCalendar') }}
              </a>
              <a href="javascript:void(0);" class="btn btn-info btn-sm ml-2" @click="eventsListModalShow = true">
                {{ $t('commands.eventsList') }}
              </a>
            </b-btn-group></b-button-toolbar
          >
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="6">
          <b-row>
            <b-col>
              <b-form-group horizontal :label-cols="3" label="Kontrahent">
                <f-select v-model="counterparty" size="sm" select-btn open-btn value-type="counterparties" detail-view="counterparty-detail" placeholder="Wyszukaj kontrahenta...">
                </f-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group>
                <f-select v-model="eventType" select-btn open-btn value-type="eventTypes" detail-view="event-type" placeholder="Typ wydarzenia..."> </f-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group>
                <b-form-textarea rows="8" id="salesReferenceId" v-model="name" size="sm"></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="6">
          <b-row>
            <b-col>
              <b-form-group horizontal :label-cols="2" label="Status">
                <f-select v-model="eventStatus" size="sm" select-btn open-btn value-type="eventStatuses" detail-view="event-status" placeholder="Wyszukaj status..."> </f-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group horizontal :label-cols="4" label="Początek">
                <date-picker id="begin" v-model="begin" name="date" value-type="date" type="datetime" size="sm"></date-picker>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group horizontal :label-cols="3" label="Koniec">
                <date-picker id="ending" v-model="ending" name="date" value-type="date" type="datetime" size="sm"></date-picker>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group horizontal :label-cols="2" label="Projekt">
                <f-select v-model="project" size="sm" select-btn open-btn value-type="projects" detail-view="project-detail" placeholder="Wyszukaj projekt..."> </f-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group horizontal :label-cols="2" label="Podstawowy dokument">
                <f-select
                  size="sm"
                  v-model="interaction"
                  select-btn
                  open-btn
                  value-type="interactions"
                  detail-view="interaction-detail"
                  placeholder="Wyszukaj podstawowy dokument..."
                >
                </f-select>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button class="mr-2" @click="addNewContact" v-if="counterparty" size="sm" variant="outline-success">Nowy kontakt</b-button>
          <b-button size="sm" @click="selectContact = true" variant="outline-success">Wybierz kontakt z listy</b-button>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="overflow-x-auto">
          <b-table
            ref="itemsList"
            hover
            striped
            class="mb-2 min-w-800"
            small
            selectable
            select-mode="single"
            no-local-sorting
            :items="selectedContacts"
            :fields="fields"
            :per-page="10"
            :current-page="1"
            :tbody-tr-class="rowClass"
          >
            <template v-slot:cell(name)="data">
              <a class="primary" href="javascript:void(0)" @click="contactDetails(data.item.id)">{{ data.item.name }}</a>
            </template>
            <template v-slot:cell(delete)="data">
              <a id="del-res-btn" href="javascript:void(0);" class="ri-delete-bin-7-fill text-danger" @click="removeContact(data.item)"> </a>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col>
          <b-pagination v-model="currentPage" :total-rows="listView.total" :per-page="listView.limit" align="right" class="my-0"></b-pagination>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" label="Odpowiedzialny">
            <f-select v-model="employee" size="sm" select-btn open-btn value-type="employees" detail-view="employee-detail" placeholder="Wyszukaj odpowiedzialnego..."> </f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" label="Autor">
            <b-form-input v-if="author" v-model="author.name" disabled size="sm"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <SelectView v-if="selectContact" value-type="contactPersons" @value-selected="addContact" />
      <b-modal v-model="show">
        <ContactPersonsDetail />
      </b-modal>

      <CalendarEventsFormModal v-model="eventFormModalShow" :defaultData="defaultEventFormData" />
      <CalendarEventsListModal v-model="eventsListModalShow" :parentType="defaultEventFormData.parentType" :parentId="defaultEventFormData.parentId" />
    </b-card>
  </Layout>
</template>

<script>
import _ from 'lodash'
import ContactPersons from '@/dto/ContactPerson.json'
import { uuid } from 'vue-uuid'
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import ContactPersonsDetail from '@/views/contact-persons/detail.vue'
import DatePicker from 'vue2-datepicker'
import SelectView from '@/components/common/select-view'
import CalendarEventsFormModal from '@/components/calendar-events-modal/events-form-modal'
import CalendarEventsListModal from '@/components/calendar-events-modal/events-list-modal'

/**
 * Products Details component
 */
export default {
  name: 'EventsDetail',
  page() {
    return { title: this.$t('route.event'), meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: {
    Layout,
    PageHeader,
    DatePicker,
    SelectView,
    ContactPersonsDetail,
    CalendarEventsFormModal,
    CalendarEventsListModal,
  },

  async created() {
    await this.initialize()
  },

  data() {
    return {
      title: this.$t('route.event'),

      fields: [
        { key: 'name', label: this.$t('table.contact'), sortable: true },
        { key: 'delete', label: '-', sortable: true },
      ],

      viewId: this.$route.params.id,
      allContacts: [],
      show: false,
      selectContact: false,
      selectedContacts: [],
      readOnly: this.$route.meta.isReadOnly,
      eventFormModalShow: false,
      eventsListModalShow: false,
      defaultEventFormData: {
        parentType: 'event',
        parentId: this.$route.params.id,
        allDay: false,
        start: null,
        end: null,
        date: null,
      },
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'events/objectView',
      listView: `events/listView`,
      currentUser: 'auth/currentUser',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      console.log()
      return this.objectView ? this.objectView.object : {}
    },

    currentPage: {
      get() {
        return this.listView.page
      },
      set(value) {
        this.setListViewProperty({ page: value })
        this.updateList()
      },
    },

    id: {
      get() {
        return this.objectView ? this.objectView.object.id : ''
      },
      set(value) {
        this.defaultEventFormData.parentId = value
        this.setObjectProperty({ viewId: this.viewId, property: 'id', value })
      },
    },

    name: {
      get() {
        return this.objectView ? this.objectView.object.name : ''
      },
      set(value) {
        this.defaultEventFormData.title = value
        this.setObjectProperty({ viewId: this.viewId, property: 'name', value })
      },
    },

    contact: {
      get() {
        return this.objectView ? this.objectView.object.contact : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'contact', value })
      },
    },

    howToContact: {
      get() {
        return this.objectView ? this.objectView.object.howToContact : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'howToContact', value })
      },
    },

    date: {
      get() {
        return this.objectView ? (this.object.date ? new Date(this.object.date) : null) : null
      },
      set(value) {
        this.defaultEventFormData.date = value
        this.setObjectProperty({ viewId: this.viewId, property: 'date', value: value })
      },
    },

    begin: {
      get() {
        return this.objectView ? (this.object.begin ? new Date(this.object.begin) : null) : null
      },
      set(value) {
        this.defaultEventFormData.start = value
        this.setObjectProperty({ viewId: this.viewId, property: 'begin', value: value })
      },
    },

    ending: {
      get() {
        return this.objectView ? (this.object.ending ? new Date(this.object.ending) : null) : null
      },
      set(value) {
        this.defaultEventFormData.end = value
        this.setObjectProperty({ viewId: this.viewId, property: 'ending', value: value })
      },
    },

    // relations

    author: {
      get() {
        return this.objectView ? this.object.author : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'author', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'authorId', value: value ? value.id : value })
      },
    },

    employee: {
      get() {
        return this.objectView ? this.object.employee : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'employee', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'employeeId', value: value ? value.id : value })
      },
    },

    project: {
      get() {
        return this.objectView ? this.object.project : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'project', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'projectId', value: value ? value.id : value })
      },
    },

    counterparty: {
      get() {
        return this.objectView ? this.object.counterparty : null
      },
      async set(value) {
        this.findContactPersonByVendor(value)
        this.setObjectProperty({ viewId: this.viewId, property: 'counterparty', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'counterpartyId', value: value ? value.id : value })
      },
    },

    interaction: {
      get() {
        return this.objectView ? this.object.interaction : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'interaction', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'interactionId', value: value ? value.id : value })
      },
    },

    eventType: {
      get() {
        return this.objectView ? this.object.eventType : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'eventType', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'eventTypeId', value: value ? value.id : value })
      },
    },

    eventStatus: {
      get() {
        return this.objectView ? this.object.eventStatus : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'eventStatus', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'eventStatusId', value: value ? value.id : value })
      },
    },
  },

  methods: {
    ...mapMutations({
      addContactView: `contactPersons/addObjectView`,
      setObjectViewProperty: 'events/setObjectViewProperty',
      setObjectProperty: 'events/setObjectProperty',
      delObjectView: 'events/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async initialize() {
      if (this.object.id === null || this.object.id === undefined) {
        this.author = this.currentUser
      }

      await this.setAllContacts()

      await this.findContactPersonByVendor(this.object.counterparty)
    },

    async setAllContacts() {
      if (this.object.id === null || this.object.id === undefined) {
        return
      }

      await this.$store.dispatch('events/findByPk', {
        params: {
          id: this.object.id,
        },
      })

      this.selectedContacts = JSON.parse(this.contact)
    },

    async contactDetails(objectId) {
      const response = await this.$store.dispatch(`contactPersons/findByPk`, {
        params: {
          id: objectId,
        },
      })
      if (response.status === 200) {
        this.$router.push({ name: 'contact-person-detail', params: { id: objectId } })
      }
    },

    async findContactPersonByVendor(value) {
      console.log(value)

      this.allContacts = []

      if (value) {
        const reqParams = {
          params: {
            sort: { sortBy: 'name', sortDesc: true },
            filter: {
              counterpartyId: value.id,
            },
            limit: 50,
          },
          noCommit: true,
        }

        const response = await this.$store.dispatch('contactPersons/findAll', reqParams)

        this.allContacts = response.data
      }
    },

    addContact(contact) {
      if (this.selectedContacts.includes(contact) === false) {
        this.selectedContacts.push(contact)
      }

      this.selectContact = false
    },

    removeContact(contact) {
      const contacts = this.selectedContacts

      for (let i = 0; i < contacts.length; i++) {
        if (contacts[i] === contact) {
          contacts.splice(i, 1)
        }
      }

      this.selectedContacts = contacts
      this.selectContact = false
    },

    addNewContact() {
      const viewId = uuid.v4()
      const object = _.cloneDeep(ContactPersons)
      object.id = viewId
      object.isNew = true

      if (this.counterparty) {
        object.counterparty = this.counterparty
        object.counterpartyId = this.counterparty.id
      }

      this.addContactView({ viewId, object })
      this.$router.push({ name: 'contact-person-detail', params: { id: viewId } })
    },

    async writeObject() {
      let response

      console.log('object: ', this.object)

      this.object.contact = JSON.stringify(this.selectedContacts)

      if (this.object.id === null || this.object.id === undefined) {
        response = await this.$store.dispatch('events/create', this.object)
      } else {
        response = await this.$store.dispatch('events/update', this.object)
      }

      if (response.status === 200) {
        this.$router.push({ name: 'events' })
        this.closeView()
      }
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.priceType === 'main') return 'table-success'
    },

    async closeView() {
      this.$destroy()
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)
      await this.$router.push({ name: 'events-list' })
    },
  },
}
</script>
<style>
p {
  margin-top: 5px;
}
</style>