<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col>
        <b-card>
          <b-row class="mb-2">
            <b-col>
              <b-button id="add-btn" :disabled="readOnly" variant="success" size="sm" @click="addNewObject">
                <i class="ri-add-line"></i>
                {{ $t('commands.add') }}
              </b-button>
              <b-button variant="outline-secondary" class="btn-sm ml-1" @click="copyItem">
                <i class="ri-file-copy-line"></i>
              </b-button>
            </b-col>
            <b-col cols="3">
              <b-form-input id="search-input" v-model="searchStr" type="search" autofocus size="sm" :placeholder="$t('common.search')"></b-form-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                ref="itemList"
                hover
                striped
                :items="listView.list"
                :fields="fields"
                :filter="filter"
                :filter-included-fields="filterOn"
                class="mb-2"
                small
                :per-page="listView.limit"
                :current-page="listView.page"
                :tbody-tr-class="rowClass"
                @row-selected="onRowSelected"
                @sort-changed="onSortingChanged"
              >
                <template v-slot:cell(name)="data">
                  <template>
                    <span class="ri-arrow-right-s-line mr-1 text-info" aria-hidden="true"></span>
                  </template>
                  <a href="javascript:void(0);" @click="editObject(data.item.id)"
                    ><span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ data.item.name }}</span>
                  </a>
                </template>
                <template v-slot:cell(actions)="data">
                  <div class="table-button-container">
                    <a href="javascript:void(0);" class="action-icon ri-edit-box-line text-success" @click="editObject(data.item.id)"> </a>
                  </div>
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-pagination v-model="currentPage" :total-rows="listView.total" :per-page="listView.limit" align="right" class="my-0"></b-pagination>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </Layout>
</template>

<script>
import _ from 'lodash'
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations } from 'vuex'
import Employee from '../../dto/Employee.json'
import { uuid } from 'vue-uuid'

const namespace = 'employees'

export default {
  name: 'ObjectList',

  page() {
    return { title: this.$t(`route.${namespace}`), meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: {
    Layout,
    PageHeader,
  },

  data() {
    return {
      title: this.$t(`route.${namespace}`),
      fields: [
        { key: 'name', label: this.$t('table.name'), sortable: true },
        { key: 'abbreviation', label: this.$t('table.abbreviation'), sortable: true },
        { key: 'actions', label: this.$t('table.actions'), sortable: false },
      ],
      filter: null,
      filterOn: [],
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
      this.$refs.itemList.refresh()
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

    onFiltered(filteredItems) {
      this.setListViewProperty({ total: filteredItems.length, page: 1 })
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

    addNewObject() {
      const viewId = uuid.v4()
      const newObject = _.cloneDeep(Employee)
      newObject.id = viewId
      newObject.isNew = true

      this.addObjectView({ viewId, object: newObject })
      this.$router.push({ name: this.detailPath, params: { id: viewId } })
    },

    async editObject(objectId) {
      const response = await this.$store.dispatch(`${namespace}/findByPk`, {
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

<style></style>
