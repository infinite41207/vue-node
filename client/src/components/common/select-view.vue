<template>
  <b-modal
    id="select-view"
    size="xl"
    dialog-class="pl-0 pl-md-5"
    :title="`${$t('common.selectPossition')}`"
    :cancel-title="$t('commands.cancel')"
    no-close-on-backdrop
    @cancel="handleCancel"
    @close="handelClose"
  >
    <b-row>
      <b-col>
        <b-row>
          <b-col md="2" v-if="addBtn">
            <b-button id="f-select-add" variant="outline-secondary" size="sm" @click="addDetailView">
              <i class="ri-add-line"></i>
            </b-button>
          </b-col>
          <b-col>
            <b-form-group label="Filter" label-for="filter-input" :label-cols="1">
              <b-form-input id="search-item" v-model="searchStr" type="search" debounce="50" size="sm" :placeholder="`${$t('common.search')}...`" @update="onChangeFilter">
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-table
          ref="selectTable"
          no-border-collapse
          :items="items"
          :fields="fields"
          responsive="sm"
          selectable
          select-mode="single"
          no-local-sorting
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          sticky-header="400px"
          lazy
          :per-page="perPage"
          :current-page="1"
          small
          @row-selected="onRowSelected"
          @sort-changed="onSortingChanged"
        >
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right" class="my-0" @change="onChangePage"></b-pagination>
      </b-col>
    </b-row>

    <template v-slot:modal-footer="{ cancel }">
      <b-button size="sm" variant="danger" @click="cancel"> {{ $t('commands.cancel') }} </b-button>
    </template>
  </b-modal>
</template>

<script>
import _ from 'lodash'
import { uuid } from 'vue-uuid'

export default {
  props: {
    valueType: {
      type: String,
      require: true,
    },
    label: {
      type: String,
      default: 'name',
    },
    addBtn: {
      type: Boolean,
      default: false,
    },
    detailView: {
      type: String,
      default: null,
    },
    filter: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      fields: [{ key: this.label, label: this.$t('table.name') }],
      items: [],
      searchStr: '',
      itemId: null,
      sortBy: null,
      sortDesc: null,
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
    }
  },

  computed: {},

  async mounted() {
    this.$bvModal.show('select-view')
    await this.initFields()
    await this.updateList()
  },

  methods: {
    async initFields() {
      try {
        this.$store
          .dispatch(`${this.valueType}/getSelectFields`)
          .then((result) => {
            if (result) {
              this.fields = result.map((el) => {
                return { key: el.key, label: this.$tc(el.label), sortable: el.sortable }
              })
            }
          })
          .catch((error) => {
            console.error(error)
          })
      } catch (error) {
        console.error(error)
      }
    },

    async updateList() {
      const filterStr = {
        noCommit: true,
        params: {
          filter: {},
          pagination: { page: this.currentPage, limit: this.perPage },
          sort: { sortBy: this.sortBy, sortDesc: this.sortDesc },
        },
      }

      if (this.searchStr) {
        filterStr.params.filter.searchStr = this.searchStr
      }

      if (this.filter) {
        for (const filterProperty in this.filter) {
          filterStr.params.filter[filterProperty] = this.filter[filterProperty]
        }
      }

      console.log('filer = ', filterStr.params.filter)

      let list = []
      let page = this.currentPage
      let total = 0

      await this.$store
        .dispatch(`${this.valueType}/findAll`, filterStr)
        .then((response) => {
          if (response.status === 200) {
            const result = response.data

            if (result.rows) {
              list = result.rows
              total = result.count
            } else {
              list = response.data
              total = response.data.length
            }

            if (total > 0) {
              const pages = Math.ceil(total / this.perPage)
              if (pages < page) {
                page = pages
              }
            } else {
              page = 1
            }
          } else {
            page = 1
          }
        })
        .catch((error) => {
          console.error(error)
          page = 1
        })

      this.items = list
      this.totalRows = total
      this.currentPage = page
    },

    async onSortingChanged(ctx) {
      this.sortBy = ctx.sortBy
      this.sortDesc = ctx.sortDesc

      this.updateList()
    },

    onChangeFilter() {
      this.updateList()
    },

    clearFilter() {
      this.filter = ''
      this.updateList()
    },

    onChangePage(page) {
      this.currentPage = page
      this.updateList()
    },

    onRowSelected(items) {
      if (items.length > 0) {
        this.$emit('value-selected', items[0])
      }
    },

    handleCancel() {
      this.$emit('value-selected', undefined)
    },

    handelClose() {
      this.$emit('value-selected', undefined)
    },

    async addDetailView() {
      const viewId = uuid.v4()
      this.$store.dispatch(`${this.valueType}/addNew`, viewId)
      this.$router.push({ name: this.detailView, params: { id: viewId } })
    },
  },
}
</script>

<style>
</style>
