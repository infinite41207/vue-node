<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col>
        <b-card>
          <b-row class="mb-2">
            <b-col>
              <b-button class="btn btn-success" :disabled="readOnly" @click="showItemForm = true">
                <i class="ri-add-line"></i>
                Dodaj
              </b-button>
            </b-col>
            <b-col>
              <b-form-group label="Filter" label-for="filter-input" label-cols-sm="1">
                <b-input-group>
                  <b-form-input id="filter-input" v-model="filter" type="search" autofocus placeholder="Szukaj..."></b-form-input>

                  <b-input-group-append>
                    <b-button variant="danger" :disabled="!filter" @click="filter = ''">Wyczyść</b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
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
                :tbody-tr-class="rowClass"
              >
                <template v-slot:cell(description)="data">
                  <a href="javascript:void(0);" @click="editItem(data.item)"
                    ><p>{{ data.item.description }}</p>
                  </a>
                </template>
                <template v-slot:cell(statusgroup)="data">
                  <p>{{ data.item.statusgroup.description }}</p>
                </template>

                <template v-slot:cell(delete)="data">
                  <a
                    href="javascript:void(0);"
                    :class="data.item.markedToDelete ? 'ri-arrow-up-circle-fill text-primary' : 'ri-delete-bin-7-fill text-danger'"
                    @click="beforeDeleteItem(data.item)"
                  >
                  </a>
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right" class="my-0"></b-pagination>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- modal question -->
    <b-modal id="modal-question" title="Uwaga!">
      <p class="my-4">{{ questionMessage }}</p>
      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button-toolbar class="float-right">
            <b-button variant="danger" size="sm" class="mr-2" @click="onCancelModalQuestion"> Anuluj </b-button>

            <b-button variant="success" size="sm" @click="onOkModalQuestion"> OK </b-button>
          </b-button-toolbar>
        </div>
      </template>
    </b-modal>

    <b-modal v-model="showItemForm" title="Edycja statusu" title-class="font-18" hide-footer>
      <b-form-group label="Nazwa" label-for="itemDescription">
        <b-form-input id="itemDescription" v-model="currentItem.description" type="text" name="item-description" size="sm"></b-form-input>
      </b-form-group>
      <b-form-group label="Kolor" label-for="itemColor">
        <b-form-select id="itemColor" v-model="currentItem.color" :options="colorList" text-field="description" value-field="id" name="formItemColor" />
      </b-form-group>

      <b-form-group label="Dostęp użytkownika" label-for="userAccess">
        <b-form-checkbox v-model="currentItem.adminAccess" name="userAccess" switch> </b-form-checkbox>
      </b-form-group>
      <b-form-group label="Dostęp admina" label-for="adminAccess">
        <b-form-checkbox v-model="currentItem.userAccess" name="adminAccess" switch> </b-form-checkbox>
      </b-form-group>

      <b-form-group label="Grupa statusów" label-for="formStatusesGroup">
        <b-form-select id="formStatusesGroup" v-model="currentItem.statusgroup.id" :options="statusGroupsList" text-field="description" value-field="id" name="formStatusesGroup" />
      </b-form-group>

      <b-form-group label="Kod 1C" label-for="code1C">
        <b-form-input id="code1C" v-model="currentItem.code1C" type="number" name="code-1c" size="sm"></b-form-input>
      </b-form-group>

      <div class="text-right pt-2 pb-2">
        <b-button type="submit" variant="success" class="ml-1" @click="saveChanges">Zapisz zmiany</b-button>
        <b-button variant="light" @click="cancelItemModification">Anuluj</b-button>
      </div>
    </b-modal>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'

export default {
  name: 'ReclStatusesList',

  page: {
    title: 'Statusy zleceń',
    meta: [{ name: 'description', content: appConfig.description }],
  },

  components: {
    Layout,
    PageHeader,
  },

  data() {
    return {
      title: 'Statusy zleceń',
      currentItem: { ...this.newItem() },
      showItemForm: false,
      perPage: 10,
      currentPage: 1,
      itemsData: [],
      colorList: [
        {
          id: '',
          description: ' - brak - ',
        },
        {
          id: 'primary',
          description: 'Primary',
        },
        {
          id: 'secondary',
          description: 'Secondary',
        },
        {
          id: 'success',
          description: 'Success',
        },
        {
          id: 'warning',
          description: 'Warning',
        },
        {
          id: 'danger',
          description: 'Danger',
        },
        {
          id: 'info',
          description: 'Info',
        },
        {
          id: 'light',
          description: 'Light',
        },
        {
          id: 'dark',
          description: 'Dark',
        },
      ],
      statusGroupsList: [],
      totalRows: 1,
      fields: [
        { key: 'id', label: 'id', sortable: true },
        { key: 'description', label: 'Nazwa', sortable: true },
        { key: 'adminAccess', label: 'Dostęp admina', sortable: true },
        { key: 'userAccess', label: 'Dostęp użytkownika', sortable: true },
        { key: 'statusgroup', label: 'Grupa statusów', sortable: true },
        { key: 'code1C', label: 'Kod 1C', sortable: true },
        { key: 'delete', label: '-', sortable: false },
      ],
      filter: null,
      filterOn: [],
      questionAction: null,
      questionParams: null,
      questionMessage: '',
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  async created() {
    await this.initialize()
  },

  methods: {
    newItem() {
      return {
        id: null,
        adminAccess: false,
        userAccess: false,
        statusgroup: {
          id: null,
          description: '',
        },
        code1C: '',
        description: '',
        color: '',
      }
    },

    async initialize() {
      this.itemsData = await this.$store.dispatch('reclamationStatuses/findAll', {})
      this.statusGroupsList = await this.$store.dispatch('reclamationStatusGroups/findAll', {})

      this.totalRows = this.itemsData.length
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    async editItem(itemData) {
      if (itemData) {
        this.currentItem = { ...itemData }
        this.showItemForm = true
      }
    },

    async saveChanges() {
      const saveItem = JSON.parse(JSON.stringify(this.currentItem))
      saveItem.statusgroupid = saveItem.statusgroup.id

      if (this.currentItem.id !== null) {
        const res = await this.$store.dispatch('reclamationStatuses/updateItem', saveItem)
      } else {
        const res = await this.$store.dispatch('reclamationStatuses/addItem', saveItem)
      }
      this.initialize()
      this.currentItem = { ...this.newItem() }
      this.showItemForm = false
    },

    async cancelItemModification() {
      this.currentItem = this.newItem()
      this.showItemForm = false
      this.initialize()
    },

    async beforeDeleteItem(itemData) {
      if (this.readOnly === true) {
        return
      }
      this.questionMessage = 'Czy na pewno chcesz usunąć element z bazy danych?'

      this.questionAction = this.deleteItem
      this.questionParams = itemData

      this.$bvModal.show('modal-question')
    },

    async deleteItem(deleteItem) {
      const res = await this.$store.dispatch('reclamationStatuses/deleteItem', deleteItem)
      this.initialize()
      this.currentItem = { ...this.newItem() }
      this.questionAction = null
      this.questionParams = null
      this.questionMessage = ''
      this.$refs.itemsList.refresh()
      this.$bvModal.hide('modal-question')
    },

    onCancelModalQuestion() {
      this.closeAndClearModalQuestion()
    },

    onOkModalQuestion() {
      if (this.questionAction) {
        if (this.questionParams) {
          this.questionAction(this.questionParams)
        } else {
          this.questionAction()
        }
      }

      this.closeAndClearModalQuestion()
    },

    closeAndClearModalQuestion() {
      this.questionAction = null
      this.questionParams = null
      this.questionMessage = ''
      this.$bvModal.hide('modal-question')
    },
  },
}
</script>

<style></style>
