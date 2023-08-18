<template>
  <b-col>
    <div v-for="item in items" :key="item.id" class="ml-2">
      <div v-if="item.isGroup === true">
        <b-row>
          <a href="javascript:void(0);" class="btn btn-light btn-sm mb-2" @click="editGroup(item.id)">
            <i class="ri-pencil-fill"></i>
          </a>
          <p v-b-toggle="item.id" class="ml-2 mt-1"
            ><b> {{ item.description }} </b></p
          >
        </b-row>
        <b-collapse :id="item.id">
          <SettingItem :items="item.items" @refresh="emitRefresh"></SettingItem>
        </b-collapse>
      </div>
      <div v-else>
        <b-row>
          <a href="javascript:void(0)" class="btn btn-light btn-sm mb-2" @click="editItem(item.id)">
            <i class="ri-pencil-fill"></i>
          </a>
          <p class="ml-2 mt-1"> {{ item.description }} </p>
        </b-row>
      </div>
    </div>

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
        <b-col>
          <b-form-group :label="$t('table.name')">
            <b-form-input id="descriptionId" size="sm" v-model="settingDescriptionItem" placeholder="Nazwa"> </b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group label="Grupa">
            <b-form-select v-model="settingGroupId" :options="settingGroups" value-field="id" text-field="description" size="sm" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group label="Klucz">
            <b-form-input id="descriptionId" size="sm" v-model="settingKey" placeholder="Klucz"> </b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group label="Typ wartości">
            <b-form-select size="sm" v-model="settingValueType" :options="valueTypes" placeholder="Typ"> </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-if="settingValueType === 'Ref'">
        <b-col>
          <b-form-group label="Nazwa modelu">
            <b-form-input id="descriptionId" size="sm" v-model="settingModelName" placeholder="Typ"> </b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group :label-cols="8" label="Ustawienie globalne">
            <b-form-checkbox size="sm" class="mt-1" v-model="globalSetting" switch></b-form-checkbox>
          </b-form-group>
        </b-col>
        <b-col md="6" v-if="globalSetting">
          <b-form-group :label-cols="8" label="Domyślna wartość">
            <b-form-checkbox size="sm" class="mt-1" v-model="defaultValue" switch></b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
    </b-modal>
  </b-col>
</template>

<script>
import SettingItem from './setting_item.vue'
import ValueTypes from '@/constants/valueTypes'

export default {
  name: 'SettingItem',

  components: {
    SettingItem,
  },

  props: {
    items: {
      type: [],
      required: true,
    },
  },

  data() {
    return {
      settingId: null,
      settingDescriptionGroup: '',
      settingDescriptionItem: '',
      settingGroupId: '',
      settingValueType: '',
      settingModelName: '',
      settingKey: '',
      globalSetting: false,
      defaultValue: false,

      settingGroups: [],
      valueTypes: ValueTypes.map((el) => {
        return { value: el, text: this.$t(`valueTypes.${el}`) }
      }),

      showFormGroup: false,
      showFormItem: false,
    }
  },

  methods: {
    async editGroup(groupId) {
      this.settingId = groupId
      await this.fillGroupsArray()

      await this.$store
        .dispatch('userSettings/findByPkItem', {
          noCommit: true,
          params: {
            id: groupId,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            this.settingGroupId = response.data.groupId
            this.settingDescriptionGroup = response.data.description
            this.showFormGroup = true
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },

    async editItem(itemId) {
      this.settingId = itemId
      await this.fillGroupsArray()

      await this.$store
        .dispatch('userSettings/findByPkItem', {
          noCommit: true,
          params: {
            id: itemId,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            this.settingDescriptionItem = response.data.description
            this.settingGroupId = response.data.groupId
            this.settingValueType = response.data.valueType
            this.settingModelName = response.data.refModelName
            this.settingKey = response.data.key
            this.globalSetting = response.data.global
            this.defaultValue = response.data.default

            this.showFormItem = true
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },

    async writeGroup() {
      const currentData = {
        id: this.settingId,
        groupId: this.settingGroupId,
        description: this.settingDescriptionGroup,
        isGroup: true,
      }

      if (this.settingId === null) {
        await this.$store
          .dispatch('userSettings/createItem', currentData)
          .then((response) => {
            if (response.status === 200) {
              this.clearModal()
              this.emitRefresh()
              this.successMessage()
            } else {
              this.errorMessage()
            }
          })
          .catch((err) => {
            this.errorMessage()
            console.error(err)
          })
      } else {
        await this.$store
          .dispatch('userSettings/updateItem', currentData)
          .then((response) => {
            if (response.status === 200) {
              this.clearModal()
              this.emitRefresh()
              this.successMessage()
            } else {
              this.errorMessage()
            }
          })
          .catch((err) => {
            this.errorMessage()
            console.error(err)
          })
      }
    },

    async writeItem() {
      const currentData = {
        id: this.settingId,
        description: this.settingDescriptionItem,
        valueType: this.settingValueType,
        refModelName: this.settingValueType === 'ref' ? this.settingModelName : '',
        isGroup: false,
        groupId: this.settingGroupId,
        key: this.settingKey,
        global: this.globalSetting,
        default: this.defaultValue,
      }

      if (this.settingId === null) {
        await this.$store
          .dispatch('userSettings/createItem', currentData)
          .then((response) => {
            if (response.status === 200) {
              this.clearModal()
              this.emitRefresh()
              this.successMessage()
            } else {
              this.errorMessage()
            }
          })
          .catch((err) => {
            this.errorMessage()
            console.error(err)
          })
      } else {
        await this.$store
          .dispatch('userSettings/updateItem', currentData)
          .then((response) => {
            if (response.status === 200) {
              this.clearModal()
              this.emitRefresh()
              this.successMessage()
            } else {
              this.errorMessage()
            }
          })
          .catch((err) => {
            this.errorMessage()
            console.error(err)
          })
      }
    },

    successMessage() {
      this.$bvToast.toast('Element został zapisany', {
        title: this.$tc('common.msg'),
        variant: 'success',
        solid: true,
        autoHideDelay: 5000,
      })
    },

    errorMessage() {
      this.$bvToast.toast('Błąd podczas zapisu elementu!', {
        title: this.$tc('common.msg'),
        variant: 'danger',
        solid: true,
        autoHideDelay: 5000,
      })
    },

    clearModal() {
      this.settingId = null
      this.settingDescriptionGroup = ''
      this.settingDescriptionItem = ''
      this.settingGroupId = null
      this.settingValueType = ''
      this.settingModelName = ''
      this.settingKey = ''
    },

    async fillGroupsArray() {
      this.settingGroups = [{ id: null, description: '-' }]

      await this.$store
        .dispatch('userSettings/findAllItems', {
          noCommit: true,
        })
        .then((response) => {
          if (response.status === 200) {
            const settingsList = response.data
            for (let i = 0; i < settingsList.length; i++) {
              if (settingsList[i].isGroup === true) {
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

    emitRefresh() {
      this.$emit('refresh')
    },
  },
}
</script>
