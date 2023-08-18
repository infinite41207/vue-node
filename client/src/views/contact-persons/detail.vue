<template>
  <Layout>
    <PageHeader :title="title" />

    <b-card>
      <b-row class="mb-3">
        <b-col>
          <b-button-toolbar>
            <b-btn-group>
              <b-button variant="success" @click="writeObject" class="mr-1" size="sm">
                <i class="ri-file-add-line mr-1"></i>
                {{ $t('commands.writeAndClose') }}
              </b-button>
              <b-button variant="outline-secondary" class="mr-1" @click="closeView" size="sm">
                <i class="ri-file-excel-line mr-1"></i>
                {{ $t('commands.close') }}
              </b-button>
              <b-button id="add-btn" :disabled="readOnly" variant="outline-secondary" size="sm" @click="addNewEvent">
                <i class="ri-add-line"></i>
                {{ $t('table.event') }}
              </b-button>
            </b-btn-group>
          </b-button-toolbar>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="6">
          <b-row>
            <b-col>
              <b-form-group horizontal :label-cols="3" label="Kontrahent">
                <f-select size="sm" v-model="counterparty" select-btn open-btn value-type="counterparties" detail-view="counterparty-detail" placeholder="Wyszukaj kontrahenta...">
                </f-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group horizontal :label-cols="3" label="Stanowisko">
                <f-select
                  size="sm"
                  v-model="standing"
                  select-btn
                  open-btn
                  value-type="standings"
                  detail-view="standing-detail"
                  placeholder="Wyszukaj stanowisko..."
                  label="description"
                >
                </f-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group horizontal :label-cols="3" label="Telefon">
                <b-form-input v-model="phone" type="text" size="sm" placeholder="Telefon..."></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group horizontal :label-cols="3" label="Adres">
                <b-form-input v-model="address" type="text" size="sm" placeholder="Adres..."></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group horizontal :label-cols="3" label="Data utworzenia">
                <b-form-input :value="createdAt" disabled type="text" size="sm"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <!-- <b-row>
            <b-col>
              <b-form-group horizontal :label-cols="3" label="Informacje dodatkowe">
                <b-form-textarea v-model="comment" size="sm" class="textarea-long"></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row> -->
        </b-col>

        <!-- End of left side -->
        <!-- Start of right side -->

        <b-col cols="6">
          <b-row>
            <b-col>
              <b-form-group horizontal :label-cols="3" label="Imie i nazwisko">
                <b-form-input v-model="name" type="text" size="sm" placeholder="Imie i nazwisko..."></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group horizontal :label-cols="3" label="Rola">
                <b-form-input v-model="role" type="text" size="sm" placeholder="Rola..."></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="6" label="Data urodzenia">
                <date-picker v-model="birthDate" value-type="date" type="date" size="sm" class="ml-1"></date-picker>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" label="Płeć">
                <b-row class="mt-1">
                  <b-col>
                    <b-form-radio v-model="sex" name="sex" value="male">Męska</b-form-radio>
                  </b-col>
                  <b-col>
                    <b-form-radio v-model="sex" name="sex" value="female">Żeńska</b-form-radio>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="9">
              <b-form-group horizontal :label-cols="4" label="Osoba odpowiedzialna">
                <f-select size="sm" v-model="employee" select-btn open-btn value-type="employees" detail-view="employee-detail" placeholder="Wyszukaj osobę odpowiedzialną..." />
              </b-form-group>
            </b-col>
            <b-col md="3">
              <b-form-group horizontal :label-cols="9" label="Nieaktywna">
                <b-form-checkbox v-model="notActive" size="sm" switch></b-form-checkbox>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-for="(contact, index) in currentContacts" :key="index">
            <b-col>
              <b-form-group horizontal :label-cols="3" :label="contactTypes.find((el) => el.value === contact.contactType).text">
                <b-form-input
                  v-model="contact.contactValue"
                  type="text"
                  size="sm"
                  :placeholder="contactTypes.find((el) => el.value === contact.contactType).text + '...'"
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="9">
              <b-form-group horizontal :label-cols="4" label="Dodaj kontakt">
                <b-form-select v-model="newContactType" :options="contactTypes" size="sm" placeholder="Typ kontaktu..."></b-form-select>
              </b-form-group>
            </b-col>
            <b-col md="3" style="text-align: right">
              <b-form-group>
                <a class="primary m-1" href="javascript:void(0)" @click="addContact">+ Kontakt</a>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <b-modal v-model="addEventModal"> sda </b-modal>
    </b-card>
  </Layout>
</template>

<script>
import _ from 'lodash'
import { uuid } from 'vue-uuid'
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import OperationTypes from '../../constants/operationTypes'
import DatePicker from 'vue2-datepicker'
import ContactTypes from '@/constants/contactTypes'

/**
 * Ships Details component
 */
export default {
  name: 'ContactPersonsDetail',
  page() {
    return { title: this.$t('route.contactPerson'), meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: { Layout, PageHeader, DatePicker },

  async created() {
    this.initialize()
  },

  data() {
    return {
      title: this.$t('route.contactPerson'),
      viewId: this.$route.params.id,
      allVendorsAndCustomers: [],
      operationTypes: [],
      contactTypes: ContactTypes.map((el) => {
        return { value: el, text: this.$t(`enums.contactTypes.${el}`) }
      }),
      currentContacts: [],
      newContactType: '',
      addEventModal: false,

      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'contactPersons/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    id: {
      get() {
        return this.objectView ? this.object.id : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'id', value })
      },
    },

    name: {
      get() {
        return this.objectView ? this.object.name : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'name', value })
      },
    },

    phone: {
      get() {
        return this.objectView ? this.object.phone : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'phone', value })
      },
    },

    role: {
      get() {
        return this.objectView ? this.object.role : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'role', value })
      },
    },

    email: {
      get() {
        return this.objectView ? this.object.email : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'email', value })
      },
    },

    address: {
      get() {
        return this.objectView ? this.object.address : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'address', value })
      },
    },

    birthDate: {
      get() {
        return this.objectView ? (this.object.birthDate ? new Date(this.object.birthDate) : null) : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'birthDate', value: value })
      },
    },

    createdAt() {
      return this.objectView ? this.object.createdAt : null
    },

    sex: {
      get() {
        return this.objectView ? this.object.sex : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'sex', value })
      },
    },

    notActive: {
      get() {
        return this.objectView ? this.object.notActive : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'notActive', value })
      },
    },

    comment: {
      get() {
        return this.objectView ? this.object.comment : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'comment', value })
      },
    },

    // relations

    counterparty: {
      get() {
        return this.objectView ? this.object.counterparty : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'counterparty', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'counterpartyId', value: value ? value.id : value })
      },
    },

    standing: {
      get() {
        return this.objectView ? this.object.standing : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'standing', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'standingId', value: value ? value.id : value })
      },
    },

    employee: {
      get() {
        return this.objectView ? this.object.employee : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'employee', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'employeeId', value: value ? value.id : value })
      },
    },
  },

  methods: {
    ...mapMutations({
      addEventView: `events/addObjectView`,
      setObjectViewProperty: 'contactPersons/setObjectViewProperty',
      setObjectProperty: 'contactPersons/setObjectProperty',
      delObjectView: 'contactPersons/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async initialize() {
      await this.getCurrentContacts()
      await this.getOperationTypes()
    },

    addNewEvent() {
      const viewId = uuid.v4()
      const object = _.cloneDeep(Event)
      object.id = viewId
      object.isNew = true

      if (this.counterparty) {
        object.counterparty = this.counterparty
        object.counterpartyId = this.counterparty.id
      }

      object.contact = JSON.stringify([this.object])

      this.addEventView({ viewId, object })
      this.$router.push({ name: 'event-detail', params: { id: viewId } })
    },

    async getCurrentContacts() {
      await this.$store
        .dispatch('contactInformations/findAll', {
          params: {
            filter: {
              objectType: 'contactPersons',
              objectId: this.object.id,
            },
          },
        })
        .then((response) => {
          console.log(response)
          if (response.status === 200) {
            this.currentContacts = response.data
          } else {
            this.currentContacts = []
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },

    async addContact() {
      this.currentContacts.push({ id: null, contactType: this.newContactType, contactValue: '', objectType: 'contactPersons', objectId: this.object.id })
    },

    async getOperationTypes() {
      const options = []

      for (let i = 0; i < OperationTypes.length; i++) {
        options.push({ value: OperationTypes[i], text: OperationTypes[i] })
      }

      this.operationTypes = options
    },

    async writeObject() {
      for (let i = 0; i < this.currentContacts.length; i++) {
        if (this.currentContacts[i].id === null) {
          await this.$store.dispatch('contactInformations/create', this.currentContacts[i])
        } else {
          await this.$store.dispatch('contactInformations/update', this.currentContacts[i])
        }
      }

      let response
      if (this.object.isNew) {
        response = await this.$store.dispatch('contactPersons/create', this.object)
      } else {
        response = await this.$store.dispatch('contactPersons/update', this.object)
      }

      if (response.status === 200) {
        this.$router.push({ name: 'contact-persons-list' })
        this.closeView()
      }
    },

    async closeView() {
      this.$destroy()
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)
      await this.$router.push({ name: 'contact-persons-list' })
    },
  },
}
</script>

<style>
.checkbox-box {
  display: flex;
  align-items: center;
}

.fixed-w {
  width: 100px;
}

.long-table {
  width: 80vw;
}

p,
.mt-d {
  margin-top: 5px;
}

.textarea-long {
  min-height: 200px;
}

.ml-d {
  margin-left: 7px;
}
</style>
