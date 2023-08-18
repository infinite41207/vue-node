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
                :items="listView.list"
                :fields="fields"
                :filter="filter"
                :filter-included-fields="filterOn"
                class="mb-2"
                :per-page="perPage"
                :current-page="currentPage"
                :tbody-tr-class="rowClass"
              >
                <template v-slot:cell(name)="data">
                  <a href="javascript:void(0);" @click="editItem(data.item)"
                    ><p>{{ data.item.name }}</p>
                  </a>
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

    <b-modal v-model="showItemForm" title="Edycja statusu wydarzeń" title-class="font-18" hide-footer>
      <b-form-group label="Nazwa" label-for="itemDescription">
        <b-form-input id="itemDescription" v-model="currentItem.name" type="text" name="item-description" size="sm"></b-form-input>
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
import { mapGetters, mapMutations } from 'vuex'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'

export default {
  name: 'EventStatusesList',

  page: {
    title: 'Statusy wydarzeń',
    meta: [{ name: 'description', content: appConfig.description }],
  },

  components: {
    Layout,
    PageHeader,
  },

  data() {
    return {
      title: 'Statusy wydarzeń',
      currentItem: { ...this.newItem() },
      showItemForm: false,
      perPage: 10,
      currentPage: 1,
      itemsData: [],
      totalRows: 1,
      fields: [
        { key: 'name', label: 'Nazwa', sortable: true },
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
    ...mapMutations({
      addObjectView: `eventStatuses/addObjectView`,
      setListViewProperty: `eventStatuses/setListViewProperty`,
      setFilter: `eventStatuses/setFilters`,
      setSort: `eventStatuses/setSort`,
    }),

    newItem() {
      return {
        id: null,
        description: '',
      }
    },

    async initialize() {
      await this.updateList()
    },

    async onSortingChanged(ctx) {
      this.setSort({ sortBy: ctx.sortBy, sortDesc: ctx.sortDesc })
      this.updateList()
    },

    updateFilter(filter) {
      this.setFilter(filter)
      this.updateList()
    },

    async updateList() {
      const filterStr = {
        params: {
          filter: {},
          pagination: { page: this.currentPage, limit: this.listView.limit },
          sort: { sortBy: this.listView.sort.sortBy, sortDesc: this.listView.sort.sortDesc },
        },
      }

      if (this.searchStr) {
        filterStr.params.filter.searchStr = this.searchStr
      }

      await this.$store.dispatch(`eventStatuses/findAll`, filterStr)
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
      if (this.currentItem.id !== null) {
        const res = await this.$store.dispatch('eventStatuses/update', this.currentItem)
      } else {
        const res = await this.$store.dispatch('eventStatuses/create', this.currentItem)
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
      const res = await this.$store.dispatch('eventStatuses/delete', deleteItem)
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

  computed: {
    ...mapGetters({
      listView: `eventStatuses/listView`,
    }),
  },
}
</script>

<style></style>
