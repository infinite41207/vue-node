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
                    <b-button variant="danger" :disabled="!filter" size="sm" @click="filter = ''">{{ $t('commands.clear') }}</b-button>
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

    <b-modal v-model="showItemForm" title="Edycja terminu zapłaty" title-class="font-18" hide-footer>
      <b-form-group :label="$t('table.name')" label-for="item-name">
        <b-form-input id="item-name" v-model="currentItem.name" type="text" name="item-name" size="sm"></b-form-input>
      </b-form-group>
      <b-form-group label="Dni" label-for="item-days">
        <b-form-input id="item-days" v-model="currentItem.days" type="number" name="item-days" size="sm"></b-form-input>
      </b-form-group>
      <div class="text-right pt-2 pb-2">
        <b-button type="submit" variant="success" class="mr-2" @click="saveChanges">{{ $t('commands.write') }}</b-button>
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
  name: 'TermsOfPaymentList',

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
      title: this.$t('route.termsOfPayment'),
      currentItem: { ...this.newItem() },
      showItemForm: false,
      perPage: 15,
      currentPage: 1,
      itemsData: [],
      totalRows: 1,
      fields: [
        { key: 'id', label: 'id', sortable: true },
        { key: 'name', label: this.$t('table.name'), sortable: true },
        { key: 'days', label: this.$t('table.days'), sortable: true },
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
        name: '',
        days: '',
      }
    },

    async initialize() {
      await this.$store
        .dispatch('termsOfPayment/findAll', {})
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

      if (this.currentItem.id !== null) {
        await this.$store.dispatch('termsOfPayment/update', saveItem)
      } else {
        await this.$store.dispatch('termsOfPayment/create', saveItem)
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
      await this.$store.dispatch('termsOfPayment/delete', deleteItem)

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
