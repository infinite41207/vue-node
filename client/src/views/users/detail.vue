<template>
  <Layout>
    <PageHeader :title="title" />
    <b-card>
      <b-card-header>
        <b-button-toolbar>
          <b-btn-group>
            <a href="javascript:void(0);" :disabled="readOnly" class="btn btn-success btn-sm" @click="saveChanges">
              <i class="ri-save-2-fill"></i>
              Zapisz zmiany
            </a>
            <a href="javascript:void(0);" class="btn btn-light btn-sm ml-2" @click="exitWithOutSaving">
              <i class="ri-close-line"></i>
              Zamknij
            </a>
          </b-btn-group>
        </b-button-toolbar>
      </b-card-header>
      <b-card-body>
        <b-tabs nav-class="nav-tabs nav-bordered" content-class="mt-3">
          <b-tab active>
            <template v-slot:title>
              <span class="d-inline-block d-sm-none">
                <i class="ri-home-4-fill d-md-none d-block"></i>
              </span>
              <span class="d-none d-sm-inline-block">Podstawowe</span>
            </template>
            <b-form>
              <b-row>
                <b-col md="6">
                  <b-form-group horizontal :label-cols="3" label="Nazwa" label-for="userName">
                    <b-form-input
                      id="userName"
                      v-model="name"
                      type="text"
                      name="Nazwa"
                      :state="fullnameState"
                      placeholder="Wprowadż imię i nazwisko"
                      size="sm"
                      @change="onChangeFullname"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="6">
                  <b-form-group horizontal :label-cols="3" label="Login" label-for="user-login">
                    <b-form-input id="user-login" v-model="login" type="text" name="user-login" :state="loginState" placeholder="Wprowadż login" size="sm"></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="6">
                  <b-form-group horizontal :label-cols="3" label="Email" label-for="userEmail">
                    <b-form-input id="userEmail" v-model="email" type="text" name="Email" placeholder="Wprowadż email" size="sm"></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="6">
                  <b-form-group horizontal :label-cols="3" label="Język" label-for="user-language">
                    <b-form-select
                      id="user-language"
                      v-model="language"
                      :options="languages"
                      name="user-language"
                      text-field="name"
                      value-field="code"
                      size="sm"
                      placeholder="Wybierz Język"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="6">
                  <b-form-group horizontal :label-cols="3" label="Hasło" label-for="userPassword">
                    <b-form-input
                      id="userPassword"
                      v-model="password"
                      type="password"
                      name="Hasło"
                      placeholder="Wprowadż hasło"
                      autocomplete="new-password"
                      size="sm"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="6">
                  <b-form-group horizontal :label-cols="3" label="Potwierdzenie hasła" label-for="userPasswordConfirmation">
                    <b-form-input
                      id="userPasswordConfirmation"
                      v-model="passwordConfirmation"
                      type="password"
                      name="Potwierdzenie hasła"
                      autocomplete="new-password"
                      placeholder="Wprowadż potwierdzenie hasła"
                      size="sm"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="2">
                  <b-form-checkbox v-model="isActive" name="check-button" switch> Aktywny użytkownik </b-form-checkbox>
                </b-col>
                <b-col md="2">
                  <b-form-checkbox v-model="fullRights" name="full-rights-button" switch> Pełne uprawnienia </b-form-checkbox>
                </b-col>
                <b-col md="2">
                  <b-form-checkbox v-model="externalUser" name="external-user-button" switch> Zewnętrzny użytkownik </b-form-checkbox>
                </b-col>
              </b-row>
            </b-form>
          </b-tab>
          <b-tab>
            <template v-slot:title>
              <span class="d-inline-block d-sm-none">
                <i class="ri-user-fill d-md-none d-block"></i>
              </span>
              <span class="d-none d-sm-inline-block">Powiązania</span>
            </template>
            <b-row class="mt-2 mb-3">
              <b-col md="6">
                <b-form-checkbox v-model="useCustomerAccess" name="use-customer-access-button" switch> Użyj ograniczenie dostępu wg klientów </b-form-checkbox>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <a href="javascript:void(0);" class="btn mb-2 btn-info btn-sm" @click="addCustomerLink">
                  <i class="ri-user-add-fill"></i>
                  Dodaj klienta
                </a>
              </b-col>
            </b-row>
            <b-row>
              <b-table ref="customerList" hover :items="userCustomers" :fields="customerFields" class="mb-2">
                <template v-slot:cell(actions)="{ index }">
                  <div class="table-button-container">
                    <b-row inline>
                      <a href="javascript:void(0);" class="action-icon" @click="removeCustomerLink(index)">
                        <i class="ri-delete-bin-7-fill" color="red"></i>
                      </a>
                    </b-row>
                  </div>
                </template>
              </b-table>
            </b-row>
          </b-tab>
          <b-tab>
            <template v-slot:title>
              <span class="d-inline-block d-sm-none">
                <i class="ri-home-4-fill d-md-none d-block"></i>
              </span>
              <span class="d-none d-sm-inline-block">Ustawienia</span>
            </template>
            <b-form>
              <SettingItem :items="settingsList" :userId="currentUser.id"></SettingItem>
            </b-form>
          </b-tab>
        </b-tabs>
      </b-card-body>
    </b-card>
    <SearchCustomer v-if="customerSearchMode" @value-selected="customerSelectedEnd" />
  </Layout>
</template>

<script>
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import Languages from '../../dto/Languages.json'
import appConfig from '@/app.config'
import SettingItem from './setting_item.vue'
import SearchCustomer from '@/views/counterparties/select'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  name: 'UserDetail',

  page: {
    title: 'Edycja danych użytkownika',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    SearchCustomer,
    SettingItem,
  },
  data() {
    return {
      title: 'Edycja danych użytkownika',
      password: '',
      passwordConfirmation: '',
      languages: _.cloneDeep(Languages),
      name: '',
      login: '',
      emptyLogin: false,
      email: '',
      externalUser: false,
      fullRights: false,
      isConstructor: false,
      useCustomerAccess: false,
      abbreviation: '',
      accessFiles: '',
      language: 'pl',
      isActive: false,
      questionAction: null,
      questionParams: null,
      questionMessage: '',
      userCustomers: [],
      customerFields: [
        { key: 'customer.name', label: 'Nazwa', sortable: false },
        { key: 'customer.abbreviation', label: 'Skrut', sortable: false },
        { key: 'customer.email', label: 'E-mail', sortable: false },
        { key: 'actions', label: 'Akcje' },
      ],
      customerSearchMode: false,

      arrayUserSettings: [],
      settingsList: [],
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      currentUser: 'users/getOpenUser',
      customers: 'counterparties/customerList',
    }),

    fullnameState() {
      return this.fullname !== ''
    },
    loginState() {
      return this.login !== null && this.login !== ''
    },
    emailState() {
      if (!this.email || this.email.length === 0) return false
      return this.validEmail(this.email)
    },
    passwordState() {
      return this.password !== ''
    },
  },

  async mounted() {
    this.name = this.currentUser.name
    this.login = this.currentUser.login
    this.email = this.currentUser.email
    this.isActive = this.currentUser.isActive
    this.useCustomerAccess = this.currentUser.useCustomerAccess
    this.externalUser = this.currentUser.externalUser
    this.fullRights = this.currentUser.fullRights
    this.isConstructor = this.currentUser.isConstructor
    this.abbreviation = this.currentUser.abbreviation
    this.accessFiles = this.currentUser.accessFiles
    this.language = this.currentUser.language ? this.currentUser.language : 'pl'
    this.userCustomers = this.currentUser.customers

    this.emptyLogin = !this.loginState

    // this.arrayItems = await this.$store.dispatch('userSettings/findAllItems')
    this.refreshUserSettings()
  },

  methods: {
    ...mapMutations({}),

    ...mapActions({
      delView: 'tagsViews/delView',
    }),

    getSettingsObject() {
      const newList = []

      for (let i = 0; i < this.arrayUserSettings.length; i++) {
        if (this.arrayUserSettings[i].groupId === null) {
          this.arrayUserSettings[i].items = this.getChilds(this.arrayUserSettings[i].id)
          newList.push(this.arrayUserSettings[i])
        }
      }

      return newList
    },

    getChilds(id) {
      const childs = []

      for (let i = 0; i < this.arrayUserSettings.length; i++) {
        if (this.arrayUserSettings[i].groupId === id) {
          if (this.arrayUserSettings[i].isGroup === true) {
            this.arrayUserSettings[i].items = this.getChilds(this.arrayUserSettings[i].id)
          }
          childs.push(this.arrayUserSettings[i])
        }
      }

      return childs
    },

    validEmail(email) {
      // eslint-disable-next-line
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },

    onChangeFullname() {
      if (this.emptyLogin === true) this.login = this.name.toLowerCase().replace(' ', '.')
    },

    async saveChanges() {
      let res = null
      const userId = this.currentUser.id

      const saveData = {
        id: userId,
        name: this.name,
        login: this.login,
        email: this.email,
        password: this.password,
        isActive: this.isActive,
        useCustomerAccess: this.useCustomerAccess,
        externalUser: this.externalUser,
        fullRights: this.fullRights,
        isConstructor: this.isConstructor,
        abbreviation: this.abbreviation,
        accessFiles: this.accessFiles,
        language: this.language ? this.language : 'pl',
        customers: this.userCustomers,
      }

      if (this.currentUser.id === null) {
        res = await this.$store.dispatch('users/addUser', saveData)
      } else {
        res = await this.$store.dispatch('users/editUser', saveData)
      }

      this.writeUserSettings(userId)

      if (res) {
        await this.$store.dispatch('users/clearOpenUser')
        this.$router.push({ path: 'users' })
        this.delView({ name: this.$route.name, path: this.$route.path })
      }
    },

    async addCustomerLink() {
      await this.$store.dispatch('counterparties/findAll', {})

      this.customerSearchMode = true
    },

    removeCustomerLink(index) {
      this.userCustomers.splice(index, 1)
    },

    customerSelectedEnd(value) {
      if (value !== undefined) {
        const curCustomer = this.customers.find((element) => element.id === value)
        if (curCustomer) {
          this.userCustomers.push({
            customerId: value,
            customer: {
              abbreviation: curCustomer.abbreviation,
              name: curCustomer.name,
              nip: curCustomer.nip,
              email: curCustomer.email,
            },
          })
        }
      }

      this.customerSearchMode = false
    },

    async exitWithOutSaving() {
      this.$router.push({ path: 'users' })
      this.delView({ name: this.$route.name, path: this.$route.path })
      await this.$store.dispatch('users/clearOpenUser')
    },

    async refreshUserSettings() {
      const responseItem = await this.$store.dispatch('userSettings/findAllItems', {})
      const arrayUSI = responseItem.data

      const response = await this.$store.dispatch('userSettings/findAll', {
        params: {
          filter: {
            userId: this.currentUser.id,
          },
        },
      })
      const arrayUS = response.data

      for (const obj of arrayUSI) {
        if (obj.isGroup === true) continue

        obj.valueNumber = 0
        obj.valueString = ''
        obj.valueDate = null
        obj.valueBoolean = false
        obj.valueRef = 0
        obj.sourceArray = []

        for (const rowUS of arrayUS) {
          if (rowUS.userSettingItemId === obj.id) {
            obj.valueNumber = rowUS.valueNumber
            obj.valueString = rowUS.valueString
            obj.valueDate = rowUS.valueDate
            obj.valueBoolean = rowUS.valueBoolean
            obj.valueRef = rowUS.valueRef
          }
        }
      }
      this.arrayUserSettings = arrayUSI
      this.settingsList = this.getSettingsObject()
    },

    async writeUserSettings(userId) {
      const userSettings = []
      for (const row of this.arrayUserSettings) {
        if (row.isGroup === true) continue
        userSettings.push(row)
      }

      const params = {
        userId: userId,
        userSettings: userSettings,
      }

      await this.$store.dispatch('userSettings/writeAll', params)
    },
  },
}
</script>
