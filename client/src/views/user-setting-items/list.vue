<template>
  <Layout>
    <PageHeader :title="title" />
    <b-card>
      <b-row class="mb-3">
        <b-col>
          <b-button-toolbar>
            <b-button variant="outline-secondary" :disabled="readOnly" class="mr-2" size="sm" @click="createGroup">
              <i class="ri-folder-add-line mr-1"></i>
              {{ $t('commands.addGroup') }}
            </b-button>
            <b-button variant="outline-secondary" :disabled="readOnly" class="mr-2" size="sm" @click="createItem">
              <i class="ri-add-fill mr-1"></i>
              {{ $t('commands.addSetting') }}
            </b-button>
          </b-button-toolbar>
        </b-col>
      </b-row>
      <b-row>
        <SettingItem :items="this.settingsList" @refresh="refresh"></SettingItem>
      </b-row>

      <b-modal id="modalGroup" v-model="showFormGroup" size="xs" title="Grupa ustawień użytkownika" @ok="writeGroup">
        <b-row>
          <b-col>
            <b-form-group label="Należy do">
              <b-form-select v-model="settingGroupId" :options="settingGroups" value-field="id" text-field="description" size="sm" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Nazwa">
              <b-form-input id="descriptionId" size="sm" v-model="settingDescriptionGroup" placeholder="Nazwa"> </b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </b-modal>

      <b-modal id="modalItem" v-model="showFormItem" size="lg" title="Ustawienia użytkowników" @ok="writeItem">
        <b-row>
          <b-col md="2">
            <p class="mt-1 mr-2"> {{ $t('table.name') }}</p>
          </b-col>
          <b-col md="10">
            <b-form-input v-model="settingDescriptionItem" type="text" size="sm" class="form-control" />
          </b-col>
        </b-row>
        <b-row>
          <b-col md="2">
            <p class="mt-1 mr-2"> Nazwa grupy:</p>
          </b-col>
          <b-col md="10">
              <b-form-select v-model="settingGroupId" :options="settingGroups" value-field="id" text-field="description" size="sm" />
          </b-col>
        </b-row>
        <b-row>
          <b-col md="2">
            <p class="mt-1 mr-2"> Klucz:</p>
          </b-col>
          <b-col md="10">
            <b-form-input v-model="settingKey" type="text" class="form-control" size="sm" />
          </b-col>
        </b-row>
        <b-row>
          <b-col md="2">
            <p class="mt-1 mr-2"> Typ wartości:</p>
          </b-col>
          <b-col md="10">
            <b-form-select v-model="settingValueType" :options="valueTypes" size="sm" />
          </b-col>
        </b-row>
        <b-row v-if="settingValueType === 'Ref'">
          <b-col md="2">
            <p class="mt-1 mr-2"> Nazwa modelu:</p>
          </b-col>
          <b-col md="10">
            <b-form-input v-model="settingModelName" type="text" class="form-control" size="sm" />
          </b-col>
        </b-row>
      </b-modal>
    </b-card>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import ValueTypes from '@/constants/valueTypes'
import SettingItem from './setting_item.vue'

export default {
  name: 'UserSettingItemsList',
  page() {
    return { title: this.$t('route.usersSettings'), meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: {
    Layout,
    PageHeader,
    SettingItem,
  },
  data() {
    return {
      title: this.$t('route.usersSettings'),
      currentUserId: null,
      showFormItem: false,
      showFormGroup: false,
      settingGroups: [],
      valueTypes: ValueTypes.map((el) => {
        return { value: el, text: this.$t(`valueTypes.${el}`) }
      }),
      settingDescriptionItem: '',
      settingDescriptionGroup: '',
      settingGroupId: null,
      settingValueType: 'string',
      settingModelName: '',
      settingKey: '',

      settingsList: [],

      readOnly: this.$route.meta.isReadOnly,
    }
  },

  async created() {
    await this.refresh()
  },

  methods: {
    async initialize() {
      const authUser = await this.$store.state.auth.currentUser
      this.currentUserId = authUser.id
    },

    async refresh() {
      await this.$store
        .dispatch('userSettings/findAllItems', {
          noCommit: true
        })
        .then((response) => {
          if(response.status === 200) {
            this.settingsList = this.getSettingsObject(response.data)
          } else {
            this.settingsList = []
          }
        })
        .catch((err) => {
          this.settingsList = []
          console.error(err)
        })
    },

    getSettingsObject(list) {
      const newList = []

      for (let i = 0; i < list.length; i++) {
        if (list[i].groupId === null) {
          list[i].items = this.getChilds(list, list[i].id)
          newList.push(list[i])
        }
      }

      return newList
    },

    getChilds(list, id) {
      const childs = []

      for (let i = 0; i < list.length; i++) {
        if (list[i].groupId === id) {
          if (list[i].isGroup === true) {
            list[i].items = this.getChilds(list, list[i].id)
          }
          childs.push(list[i])
        }
      }

      return childs
    },

    async createGroup() {
      await this.fillGroupsArray()
      this.clearModal()
      this.showFormGroup = true
    },

    async createItem() {
      await this.fillGroupsArray()
      this.clearModal()
      this.showFormItem = true
    },

    clearModal() {
			this.settingDescriptionGroup = ''
			this.settingDescriptionItem = ''
      this.settingGroupId = null
      this.settingValueType = ''
      this.settingModelName = ''
      this.settingKey = ''
		},

    async writeGroup() {
      const currentData = {
        groupId: this.settingGroupId,
        description: this.settingDescriptionGroup,
        isGroup: true,
      }

      await this.$store
        .dispatch('userSettings/createItem', currentData)
        .then((response) => {
          if(response.status === 200) {
            this.refresh()
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },

		async writeItem() {
      const currentData = {
        description: this.settingDescriptionItem,
        valueType: this.settingValueType,
        refModelName: this.settingValueType === 'ref' ? this.settingModelName : '',
        isGroup: false,
        groupId: this.settingGroupId,
        key: this.settingKey,
      }

      await this.$store
        .dispatch('userSettings/createItem', currentData)
        .then((response) => {
          if(response.status === 200) {
            this.refresh()
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },

    async fillGroupsArray() {
      this.settingGroups = [{ id: null, description: '-' }]

      await this.$store
        .dispatch('userSettings/findAllItems', {
          noCommit: true
        })
        .then((response) => {
          if(response.status === 200) {
						const settingsList = response.data
						for(let i = 0; i < settingsList.length; i++) {
							if(settingsList[i].isGroup === true) {
								this.settingGroups.push(settingsList[i])
							}
						}
          } else {
            this.settingGroups = []
          }
        })
        .catch((err) => {
          this.settingGroups = []
          console.error(err)
        })
    },
  },
}
</script>
