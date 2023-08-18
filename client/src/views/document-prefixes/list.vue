<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col>
        <b-card>
          <b-row class="mb-2">
            <b-col>
              <b-button class="btn btn-success btn-sm" :disabled="readOnly" @click="showItemForm = true">
                <i class="ri-add-line"></i>
                {{ $t('commands.add') }}
              </b-button>
            </b-col>
            <b-col>
              <b-form-group label="Filter" label-for="filter-input" label-cols-sm="1">
                <b-input-group>
                  <b-form-input id="filter-input" v-model="filter" type="search" autofocus placeholder="Szukaj..." size="sm"></b-form-input>

                  <b-input-group-append>
                    <b-button variant="danger" size="sm" :disabled="!filter" @click="filter = ''">{{ $t('commands.clear') }}</b-button>
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
                small
              >
                <template v-slot:cell(name)="data">
                  <a href="javascript:void(0);" @click="editItem(data.item)">{{ data.item.name }} </a>
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
            <b-button variant="danger" size="sm" class="mr-2" @click="onCancelModalQuestion">
              {{ $t('commands.cancel') }}
            </b-button>

            <b-button variant="success" size="sm" @click="onOkModalQuestion">
              {{ $t('commands.ok') }}
            </b-button>
          </b-button-toolbar>
        </div>
      </template>
    </b-modal>

    <b-modal v-model="showItemForm" title="Edycja prefiksu dokumentów" title-class="font-18" hide-footer>
      <b-form-group label="Nazwa" label-for="item-name">
        <b-form-input id="item-name" v-model="currentItem.name" type="text" name="item-name" size="sm"></b-form-input>
      </b-form-group>
      <b-form-group label="Szablon" label-for="item-template">
        <b-form-input id="item-template" v-model="currentItem.template" type="text" name="item-template" size="sm"></b-form-input>
      </b-form-group>
      <b-form-checkbox v-model="currentItem.isActive" name="item-isActive" switch>
        {{ $t('table.isActive') }}
      </b-form-checkbox>

      <b-tabs nav-class="nav-tabs nav-bordered" content-class="mt-3">
        <b-tab>
          <template v-slot:title>
            <span class="d-inline-block d-sm-none">
              <i class="ri-user-fill d-md-none d-block"></i>
            </span>
            <span class="d-none d-sm-inline-block">Dokumenty</span>
          </template>
          <b-table ref="docList" hover :items="currentItem.documentTypes" :fields="docTypesFields" class="mb-2">
            <template v-slot:cell(isActive)="data">
              <b-form-checkbox v-if="data.item.isActive !== null" v-model="data.item.isActive" name="check-button" switch></b-form-checkbox>
            </template>
          </b-table>
        </b-tab>
      </b-tabs>
      <div class="text-right pt-2 pb-2">
        <b-button type="submit" variant="success" class="mr-2" @click="saveChanges"> {{ $t('commands.write') }}</b-button>
        <b-button variant="light" @click="cancelItemModification"> {{ $t('commands.cancel') }}</b-button>
      </div>
    </b-modal>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import _ from 'lodash'

export default {
  name: 'ItemList',

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
      title: this.$t('route.documentPrefixes'),
      documentTypes: [
        { documentType: 'SalesOrder', isActive: false },
        { documentType: 'Reclamation', isActive: false },
        { documentType: 'CustomerRequest', isActive: false },
        { documentType: 'Task', isActive: false },
        { documentType: 'Pricelist', isActive: false },
      ],
      currentItem: {},
      showItemForm: false,
      items: [
        {
          text: this.$t('route.main'),
          href: '/',
        },
        {
          text: this.$t('route.documentPrefixes'),
          active: true,
        },
      ],
      perPage: 15,
      currentPage: 1,
      itemsData: [],
      totalRows: 1,
      fields: [
        { key: 'id', label: 'id', sortable: true },
        { key: 'name', label: this.$t('table.name'), sortable: true },
        { key: 'delete', label: '-', sortable: false },
      ],
      docTypesFields: [
        { key: 'documentType', label: 'Rodzaj dokumentu', sortable: false },
        { key: 'isActive', label: 'Dołączony', sortable: false },
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
        uuid: null,
        name: '',
        template: '',
        isActive: false,
        documentTypes: _.cloneDeep(this.documentTypes),
      }
    },

    async initialize() {
      await this.$store
        .dispatch('documentPrefixes/findAll', {})
        .then((response) => {
          if (response && response.status === 200) {
            this.itemsData = response.data
          } else {
            this.itemsData = []
          }

          this.totalRows = this.itemsData.length
        })
        .catch((err) => {
          console.error(err)
          this.itemsData = []
          this.totalRows = this.itemsData.length
        })

      this.currentItem = { ...this.newItem() }
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
        this.currentItem.documentTypes = _.cloneDeep(this.documentTypes)

        const documentTypes = itemData.documentTypes

        documentTypes.forEach((el) => {
          const foundDoc = this.currentItem.documentTypes.find((element) => element.documentType === el.documentType)
          if (foundDoc) {
            foundDoc.isActive = true
          }
        })

        this.showItemForm = true
      }
    },

    async saveChanges() {
      const saveItem = JSON.parse(JSON.stringify(this.currentItem))

      saveItem.documentTypes = saveItem.documentTypes.filter((el) => el.isActive === true)

      if (this.currentItem.id !== null) {
        await this.$store.dispatch('documentPrefixes/update', saveItem)
      } else {
        await this.$store.dispatch('documentPrefixes/create', saveItem)
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
      await this.$store.dispatch('documentPrefixes/delete', deleteItem)

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
