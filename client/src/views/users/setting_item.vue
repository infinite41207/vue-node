<template>
  <b-col>
    <div v-for="item in items" :key="item.id" class="ml-2">
      <div v-if="item.isGroup === true">
        <b-row>
          <h5 v-b-toggle="item.id" class="ml-2 mt-1"> {{ item.description }} </h5>
        </b-row>
        <b-collapse :id="item.id">
          <SettingItem :items="item.items" :userId="userId" @save="saveChanges"></SettingItem>
        </b-collapse>
      </div>
      <div v-else>
        <b-row class="ml-2 mt-0 mb-0">
          <b-col md="6">
            <div v-if="item.valueType === 'number'">
              <b-form-group horizontal :label-cols="5" :label="item.description" :label-for="'value-number' + item.id">
                <b-form-input @change="saveItem(item)" :id="'value-number' + item.id" v-model="item.valueNumber" type="number" class="form-control" size="sm" />
              </b-form-group>
            </div>
            <div v-if="item.valueType === 'string'">
              <b-form-group horizontal :label-cols="5" :label="item.description" :label-for="'value-string' + item.id">
                <b-form-input @change="saveItem(item)" :id="'value-string' + item.id" v-model="item.valueString" type="text" class="form-control" size="sm" />
              </b-form-group>
            </div>
            <div v-if="item.valueType === 'date'">
              <b-form-group horizontal :label-cols="5" :label="item.description" :label-for="'value-date' + item.id">
                <b-form-input @change="saveItem(item)" :id="'value-date' + item.id" v-model="item.valueDate" type="date" class="form-control" size="sm" />
              </b-form-group>
            </div>
            <div v-if="item.valueType === 'boolean'">
              <b-form-group horizontal :label-cols="5" :label="item.description" :label-for="'value-boolean' + item.id">
                <b-form-checkbox @change="saveItem(item)" :id="'value-boolean' + item.id" v-model="item.valueBoolean" :value="true" :unchecked-value="false" class="mt-1" switch />
              </b-form-group>
            </div>
            <div v-if="item.valueType === 'ref'">
              <b-form-group horizontal :label-cols="5" :label="item.description" :label-for="'value-ref' + item.id">
                <b-form-select @change="saveItem(item)" :id="'value-ref' + item.id" v-model="item.ref" :options="item.sourceArray" size="sm"> </b-form-select>
              </b-form-group>
            </div>
          </b-col>
        </b-row>
      </div>
    </div>
  </b-col>
</template>

<script>
import SettingItem from './setting_item.vue'

export default {
  name: 'SettingItem',

  components: {
    SettingItem,
  },

  props: {
    items: {
      type: [],
    },
    userId: {
      type: String,
    },
  },

  methods: {
    async saveChanges() {
      const userSettings = []
      for (const row of this.items) {
        if (row.isGroup === true) continue
        userSettings.push(row)
      }
      this.getSettingItems()
      const params = {
        userId: this.userId,
        userSettings: userSettings,
      }

      await this.$store.dispatch('userSettings/writeAll', params)
    },

    async saveItem(item) {
      if (item.items) {
        delete item.items
      }

      item.userId = this.userId
      console.log(item)

      await this.$store
        .dispatch('userSettings/update', item)
        .then((response) => {
          if (response.status === 200) {
            console.log('saved')
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },

    getSettingItems() {
      const items = []

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].isGroup === true) {
          items.push(this.getItemChilds(this.items[i].items))
        }

        items.push(this.items[i])
      }

      console.log(items)
      return items
    },

    getItemChilds(parentItems) {
      const items = []

      for (let i = 0; i < parentItems.length; i++) {
        if (parentItems[i].isGroup === true) {
          items.push(this.getItemChilds(parentItems[i].items))
        }

        items.push(parentItems[i])
      }

      return items
    },
  },
}
</script>
