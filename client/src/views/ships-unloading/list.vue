<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col>
        <b-card>
          <b-row class="mb-2">
            <b-col>
              <b-button-toolbar>
                <b-button-group>
                  <b-button id="add-btn" variant="success" :disabled="readOnly" size="sm" @click="addNewObject">
                    <i class="ri-add-line"></i>
                    {{ $t('commands.add') }}
                  </b-button>
                  <b-button variant="outline-secondary" class="btn-sm ml-1" @click="copyItem">
                    <i class="ri-file-copy-line"></i>
                  </b-button>
                </b-button-group>
              </b-button-toolbar>
            </b-col>
            <b-col cols="3">
              <b-form-input id="search-input" v-model="searchStr" type="search" autofocus size="sm" :placeholder="$t('common.search')"></b-form-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="overflow-x-auto">
              <b-table
                ref="itemsList"
                hover
                striped
                class="mb-2 min-w-800"
                small
                selectable
                select-mode="single"
                no-local-sorting
                :items="listView.list"
                :fields="fields"
                :sort-by.sync="listView.sort.sortBy"
                :sort-desc.sync="listView.sort.sortDesc"
                :per-page="listView.limit"
                :current-page="1"
                :tbody-tr-class="rowClass"
                @row-selected="onRowSelected"
                @sort-changed="onSortingChanged"
              >
                <template v-slot:cell(date)="data">
                  <a class="text-info" @click="editObject(data.item.id)">
                    <span>{{ data.item.date }}</span>
                  </a>
                </template>
                <template v-slot:cell(delete)="data">
                  <a
                    id="del-res-btn"
                    href="javascript:void(0);"
                    :class="data.item.markedToDelete ? 'ri-arrow-up-circle-fill text-primary' : 'ri-delete-bin-7-fill text-danger'"
                    @click="deleteRestoreItem(data.item)"
                  >
                  </a>
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col>
              <b-pagination v-model="currentPage" :total-rows="listView.total" :per-page="listView.limit" align="right" class="my-0"></b-pagination>
            </b-col>
          </b-row>
        </b-card>
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
      </b-col>
    </b-row>
  </Layout>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapMutations } from 'vuex'
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import ShipsUnloading from '@/dto/ShipsUnloading.json'
import { uuid } from 'vue-uuid'

const namespace = 'shipsUnloading'

export default {
  name: 'ObjectList',

  page() {
    return {
      title: this.$t(`route.${namespace}`),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: this.$t(`route.${namespace}`),
      fields: [
        { key: 'date', label: 'Data', sortable: true },
        { key: 'number', label: 'Numer', sortable: true },
        { key: 'disposition.number', label: 'Dyspozycja', sortable: true },
        { key: 'scale.name', label: 'Waga', sortable: true },
        { key: 'beginWeighting', label: 'Zaczęło ważenie', sortable: true },
        { key: 'endWeighting', label: 'Koniec ważenia', sortable: true },
        { key: 'warehouse.name', label: 'Magazyn', sortable: true },
        { key: 'box.name', label: 'Numer magazynowy', sortable: true },
        { key: 'netto', label: 'Netto', sortable: true },
        { key: 'comment', label: 'Komentarz', sortable: true },
        { key: 'author.name', label: 'Autor', sortable: true },
        { key: 'delete', label: 'Usuń', sortable: true },
      ],
      namespace: this.$route.meta.store,
      detailPath: this.$route.meta.detailPath,
      questionAction: null,
      questionParams: null,
      questionMessage: '',
      readOnly: this.$route.meta.isReadOnly,
      selectedRows: null,
    }
  },

  computed: {
    ...mapGetters({
      listView: `${namespace}/listView`,
    }),

    currentPage: {
      get() {
        return this.listView.page
      },
      set(value) {
        this.setListViewProperty({ page: value })
        this.updateList()
      },
    },

    searchStr: {
      get() {
        return this.listView.filters.searchStr
      },
      set(value) {
        this.updateFilter({ searchStr: value })
      },
    },
  },

  watch: {
    'listView.list'(newVal, oldVal) {
      this.$refs.itemsList.refresh()
    },
  },

  async created() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      addObjectView: `${namespace}/addObjectView`,
      setListViewProperty: `${namespace}/setListViewProperty`,
      setFilter: `${namespace}/setFilters`,
      setSort: `${namespace}/setSort`,
    }),

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

      await this.$store.dispatch(`${namespace}/findAll`, filterStr)
    },

    onRowSelected(items) {
      if (items && items.length > 0) {
        this.selectedRows = _.cloneDeep(items)
      } else {
        this.selectedRows = null
      }
    },

    async copyItem() {
      if (this.selectedRows) {
        await this.$store
          .dispatch(`${namespace}/findByPk`, {
            params: {
              id: this.selectedRows[0].id,
            },
            noCommit: true,
          })
          .then((response) => {
            const viewId = uuid.v4()
            const newObject = response.data

           newObject.id = viewId
            newObject.isNew = true
            delete newObject.createdAt
            delete newObject.updatedAt

            this.addObjectView({
              viewId,
              object: newObject,
            })

            this.$router.push({ name: this.detailPath, params: { id: viewId } })
          })
          .catch(() => {})
      }
    },

    async beforeDeleteItem(itemData) {
      this.questionMessage = 'Czy na pewno chcesz usunąć element z bazy danych?'

      this.questionAction = this.deleteItem
      this.questionParams = itemData

      this.$bvModal.show('modal-question')
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

    async deleteRestoreItem(itemData) {
      if (this.readOnly === true) {
        return
      }
      if (itemData.markedToDelete) {
        this.questionMessage = this.$t('order.msg.return')
      } else {
        this.questionMessage = this.$t('order.msg.delete')
      }

      this.questionAction = this.deleteRestoreItemEnd
      this.questionParams = itemData.id

      this.$bvModal.show('modal-question')
    },

    async deleteRestoreItemEnd(itemId) {
      await this.$store.dispatch(`${namespace}/changeDeletionMark`, {
        id: itemId,
      })
      this.updateList()
    },

    async deleteItem(deleteItem) {
      await this.$store.dispatch(`${namespace}/delete`, {
        id: deleteItem.id,
      })

      this.updateList()

      this.$bvModal.hide('modal-question')
    },

    addNewObject() {
      const viewId = uuid.v4()
      const newObject = _.cloneDeep(ShipsUnloading)
      newObject.id = viewId
      newObject.isNew = true

      this.addObjectView({ viewId, object: newObject })
      this.$router.push({ name: this.detailPath, params: { id: viewId } })
    },

    async editObject(objectId) {
      const response = await this.$store.dispatch(`shipsUnloading/findByPk`, {
        params: {
          id: objectId,
        },
      })

      if (response.status === 200) {
        this.$router.push({ name: this.detailPath, params: { id: objectId } })
      }
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },
  },
}
</script>
