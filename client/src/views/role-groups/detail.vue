<template>
  <Layout>
    <PageHeader :title="title" />
    <div>
      <b-card>
        <b-card-header>
          <b-button-toolbar>
            <b-btn-group class="mt-2">
              <b-button variant="success" :disabled="readOnly" class="btn-sm" @click="writeObject">
                <i class="ri-close-line"></i>
                {{ $t('commands.writeAndClose') }}
              </b-button>
              <b-button variant="outline-secondary" class="btn-sm ml-1" @click="closeView">
                <i class="ri-close-line"></i>
                {{ $t('commands.close') }}
              </b-button>
            </b-btn-group>
          </b-button-toolbar>
        </b-card-header>
        <b-card-body>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="2" :label="$tc('table.name')" label-for="object-name">
                <b-form-input id="object-name" v-model="name" type="text" :state="nameState" aria-describedby="name-feedback" size="sm"> </b-form-input>
                <b-form-invalid-feedback id="name-feedback"> {{ $t('common.notEmptyField') }} </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-tabs v-model="currTab" nav-class="nav-tabs nav-bordered" content-class="mt-3">
            <b-tab active :title="$t('common.settings')">
              <b-row class="mb-2">
                <b-col md="12">
                  <b-button variant="outline-secondary" class="btn-sm" @click="updateSettings">
                    <i class="ri-refresh-line"></i>
                    {{ $t('commands.update') }}
                  </b-button>
                </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col md="12">
                  <b-table ref="settingsList" hover :items="settings" :fields="settFields" small :per-page="settLimit" :current-page="settCurrPage">
                    <template v-slot:cell(canRead)="data">
                      <b-form-checkbox v-model="data.item.canRead" switch @change="changeSetting(data.item)"></b-form-checkbox>
                    </template>
                    <template v-slot:cell(canModify)="data">
                      <b-form-checkbox v-if="data.item.readOnly !== true" v-model="data.item.canModify" switch @change="changeSetting(data.item)"></b-form-checkbox>
                    </template>
                  </b-table>
                </b-col>
              </b-row>
              <b-row class="mt-2">
                <b-col>
                  <b-pagination v-model="settCurrPage" :total-rows="settTotal" :per-page="settLimit" align="right" class="my-0"></b-pagination>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab :title="$t('route.users')">
              <b-row class="mb-2">
                <b-col md="12">
                  <b-table ref="usersList" hover :items="users" :fields="usersFields" small :per-page="usersLimit" :current-page="usersCurrPage">
                    <template v-slot:cell(isActive)="data">
                      <b-form-checkbox v-model="data.item.isActive" switch @change="changeUser(data.item)"></b-form-checkbox>
                    </template>
                  </b-table>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-pagination v-model="usersCurrPage" :total-rows="usersTotal" :per-page="usersLimit" align="right" class="my-0"></b-pagination>
                </b-col>
              </b-row>
            </b-tab>
          </b-tabs>
        </b-card-body>
      </b-card>
    </div>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  name: 'RoleGroupDetail',

  page() {
    return { title: this.$t('route.accessGroup'), meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: { Layout, PageHeader },

  data() {
    return {
      title: this.$t('route.accessGroup'),
      viewId: this.$route.params.id,
      settings: [],
      settFields: [
        { key: 'name', label: this.$t('table.name'), sortable: true },
        { key: 'canRead', label: this.$t('table.read'), sortable: false },
        { key: 'canModify', label: this.$t('table.modify'), sortable: false },
      ],
      settLimit: 20,
      users: [],
      usersFields: [
        { key: 'name', label: this.$t('table.name'), sortable: true },
        { key: 'email', label: this.$t('table.email'), sortable: false },
        { key: 'isActive', label: this.$t('table.added'), sortable: false },
      ],
      usersLimit: 20,
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'roleGroups/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView?.object
    },

    name: {
      get() {
        return this.object ? this.object.name : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'name', value })
      },
    },

    settCurrPage: {
      get() {
        return this.objectView ? this.objectView.settCurrPage : 1
      },
      set(value) {
        this.setObjectViewProperty({ viewId: this.viewId, property: 'settCurrPage', value })
      },
    },

    usersCurrPage: {
      get() {
        return this.objectView ? this.objectView.usersCurrPage : 1
      },
      set(value) {
        this.setObjectViewProperty({ viewId: this.viewId, property: 'usersCurrPage', value })
      },
    },

    currTab: {
      get() {
        return this.objectView ? this.objectView.currTab : 1
      },
      set(value) {
        this.setObjectViewProperty({ viewId: this.viewId, property: 'currTab', value })
      },
    },

    usersTotal() {
      return this.users?.length
    },

    settTotal() {
      return this.settings?.length
    },

    nameState() {
      return this.name !== ''
    },
  },

  async mounted() {
    await this.initUsers()
    await this.updateSettings()
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'roleGroups/setObjectViewProperty',
      setObjectProperty: 'roleGroups/setObjectProperty',
      delObjectView: 'roleGroups/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async initUsers() {
      await this.$store
        .dispatch('users/findAll', { noCommit: true })
        .then((response) => {
          if (response.status === 200) {
            response.data.forEach((el) => {
              this.users.push({
                userId: el.id,
                name: el.name,
                email: el.email,
                isActive: false,
              })
            })

            const users = _.cloneDeep(this.object?.users)

            users.forEach((user) => {
              const foundUser = this.users.find((element) => element.userId === user.userId)
              if (foundUser) {
                foundUser.isActive = true
              }
            })
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },

    async writeObject() {
      let response
      if (this.object?.isNew === true) {
        response = await this.$store.dispatch('roleGroups/create', this.objectView.object).catch((error) => {
          console.error(error)
        })
      } else {
        response = await this.$store.dispatch('roleGroups/update', this.objectView.object).catch((error) => {
          console.error(error)
        })
      }
      if (response && response.status === 200) {
        this.closeView()
      }
    },

    async closeView() {
      this.$destroy()
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)
      await this.$router.push({ name: 'role-groups' })
    },

    async updateSettings() {
      const filterStr = {
        noCommit: true,
        params: {
          sort: { sortBy: 'name', sortDesc: true },
        },
      }

      await this.$store
        .dispatch('userRoles/findAll', filterStr)
        .then((response) => {
          if (response.status === 200) {
            this.settings = []

            for (const setting of response.data) {
              this.settings.push({
                id: setting.id,
                name: setting.name,
                readOnly: setting.readOnly,
                canRead: false,
                canModify: false,
              })
            }

            const objectSettings = _.cloneDeep(this.object?.settings)

            objectSettings.forEach((setting) => {
              const foundSetting = this.settings.find((el) => el.id === setting.userRoleId)

              if (foundSetting) {
                foundSetting.canModify = setting.canModify
                foundSetting.canRead = setting.canRead
              }
            })
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },

    changeSetting(settingData) {
      if (settingData.canModify === true) {
        settingData.canRead = true
      }

      const currentSettings = _.cloneDeep(this.object?.settings)
      const index = currentSettings.findIndex((item) => item.userRoleId === settingData.id)

      if (settingData.canRead === false && settingData.canModify === false) {
        if (index !== -1) {
          currentSettings.splice(index, 1)
        }
      } else if (index === -1) {
        currentSettings.push({ userRoleId: settingData.id, canRead: settingData.canRead, canModify: settingData.canModify })
      } else {
        currentSettings[index] = { userRoleId: settingData.id, canRead: settingData.canRead, canModify: settingData.canModify }
      }

      this.setObjectProperty({ viewId: this.viewId, property: 'settings', value: currentSettings })
    },

    changeUser(userData) {
      const currentUsers = _.cloneDeep(this.object?.users)

      if (userData.isActive === true) {
        currentUsers.push({ userId: userData.userId })
      } else {
        const index = currentUsers.findIndex((item) => item.userId === userData.userId)
        if (index !== -1) {
          currentUsers.splice(index, 1)
        }
      }

      this.setObjectProperty({ viewId: this.viewId, property: 'users', value: currentUsers })
    },
  },
}
</script>
