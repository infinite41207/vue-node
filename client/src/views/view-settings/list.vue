<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col>
        <b-card>
          <b-row class="mb-2">
            <b-col>
              <b-button
                class="btn btn-success mdi mdi-plus btn-sm"
                @click="
                  newForm = true
                  currentItem = newItem()
                "
              >
                {{ $t('commands.add') }}
              </b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                ref="itemsList"
                hover
                :items="itemsData"
                :fields="fields"
                :filter="filter"
                :filter-included-fields="filterOn"
                class="mb-2"
                :per-page="perPage"
                :current-page="currentPage"
              >
                <template v-slot:cell(name)="data">
                  <a href="#" @click="editObject(data.item.id)"
                    ><p>{{ data.item.name }}</p>
                  </a>
                </template>
                <template v-slot:cell(delete)="data">
                  <a href="#" class="mdi mdi-delete text-danger" @click="titleClicked(data.item)"> </a>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-modal v-model="newForm" title="Nowe ustawienia formularza" title-class="font-18" hide-footer>
      <b-form-group label="Name" label-for="item-name">
        <b-form-input id="item-name" v-model="currentItem.name" type="text" name="item-name" size="sm"> </b-form-input>
      </b-form-group>
      <div class="text-right pt-2 pb-2">
        <b-button type="submit" variant="success" class="mr-2" @click="saveNewSettings">{{ $t('commands.write') }}</b-button>
        <b-button variant="light" @click="cancelItemModification">{{ $t('commands.cancel') }}</b-button>
      </div>
    </b-modal>

    <b-modal v-model="showRemoveConfirmation" title="Usuń element" title-class="font-18" hide-footer>
      <p>Czy na pewno chcesz usunąc wybrany element?</p>
      <div class="text-right pt-2 pb-2">
        <b-button type="submit" variant="success" class="mr-2" @click="removeForm">{{ $t('commands.delete') }}</b-button>
        <b-button variant="light" @click="cancelItemModification">{{ $t('commands.cancel') }}</b-button>
      </div>
    </b-modal>
  </Layout>
</template>
  
<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'

/**
 * Orders component
 */
export default {
  name: 'ViewSettingsList',
  page() {
    return {
      title: this.title,
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },
  components: {
    Layout,
    PageHeader,
  },

  data() {
    return {
      title: this.$t('route.forms'),
      currentItem: { ...this.newItem() },
      showFormSettings: false,
      newForm: false,
      showRemoveConfirmation: false,
      perPage: 15,
      currentPage: 1,
      itemsData: [],
      fields: [
        { key: 'name', label: 'Nazwa', sortable: true },
        { key: 'description', label: 'Opis', sortable: true },
        { key: 'id', label: 'Id', sortable: true },
        { key: 'delete', label: '-', sortable: true },
      ],
      filter: null,
      filterOn: [],
      questionAction: null,
      questionParams: null,
      questionMessage: '',
      hidingElementsList: [],
      removeItem: null,
    }
  },

  async created() {
    await this.initialize()
  },

  methods: {
    newItem() {
      return {
        id: null,
        name: '',
        form: '',
      }
    },

    async initialize() {
      await this.$store
        .dispatch('viewSettings/findAll', {
          noCommit: true,
        })
        .then((response) => {
          if (response && response.status === 200) {
            this.itemsData = response.data
          } else {
            this.itemsData = []
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },

    changeSettings(itemData) {
      for (let i = 0; i < this.itemsData.length; i++) {
        if (this.itemsData[i].name === itemData.name) {
          this.hidingElementsList = JSON.parse(this.itemsData[i].hidingElementsList)
        }
      }

      this.editItem(itemData)
    },

    async removeForm() {
      const saveItem = JSON.parse(JSON.stringify(this.removeItem))

      if (saveItem.id !== null) {
        await this.$store.dispatch('viewSettings/delete', saveItem)
      }

      this.initialize()
      this.currentItem = { ...this.newItem() }
      this.removeItem = null
      this.showRemoveConfirmation = false
    },

    titleClicked(itemData) {
      this.removeItem = itemData
      this.showRemoveConfirmation = true
    },

    async editItem(itemData) {
      if (itemData) {
        this.currentItem = { ...itemData }
        this.showFormSettings = true
      }
    },

    async saveChanges() {
      const saveItem = JSON.parse(JSON.stringify(this.currentItem))
      saveItem.hidingElementsList = JSON.stringify(this.hidingElementsList)

      if (this.currentItem.id !== null) {
        await this.$store.dispatch('viewSettings/update', saveItem)
      }

      this.initialize()
      this.currentItem = { ...this.newItem() }
      this.showFormSettings = false
    },

    async saveNewSettings() {
      const saveItem = JSON.parse(JSON.stringify(this.currentItem))

      if (this.currentItem.id !== null) {
        await this.$store.dispatch('viewSettings/update', saveItem)
      } else {
        await this.$store.dispatch('viewSettings/create', saveItem)
      }

      this.initialize()
      this.currentItem = { ...this.newItem() }
      this.newForm = false
    },

    async cancelItemModification() {
      this.currentItem = this.newItem()
      this.showFormSettings = false
      this.newForm = false
      this.showRemoveConfirmation = false
      this.initialize()
    },

    async editObject(objectId) {
      const editParams = {
        params: {
          id: objectId,
        },
      }
      const response = await this.$store.dispatch('viewSettings/findByPk', editParams)
      this.$router.push({ name: 'form-bulder', params: { id: objectId } })
    },
  },
}
</script>
  
<style>
li {
  list-style: none;
}
</style>