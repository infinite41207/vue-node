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
                  <b-button id="add-btn" :disabled="readOnly" variant="success" size="sm" @click="addNewObject">
                    <i class="ri-add-line"></i>
                    {{ $t('commands.add') }}
                  </b-button>
                </b-button-group>
              </b-button-toolbar>
            </b-col>
            <b-col cols="3">
              <b-form-input id="search-input" v-model="searchStr" type="search" autofocus size="sm" :placeholder="$t('common.search')"></b-form-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                ref="emailAccountList"
                hover
                striped
                small
                class="mb-2"
                :items="listView.list"
                :fields="fields"
                no-local-sorting
                :sort-by.sync="listView.sort.sortBy"
                :sort-desc.sync="listView.sort.sortDesc"
                :per-page="listView.limit"
                :current-page="1"
                :tbody-tr-class="rowClass"
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
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations } from 'vuex'
import EmailAccount from '../../dto/EmailAccount.json'
import _ from 'lodash'
import { uuid } from 'vue-uuid'
/**
 * Email account component
 */
export default {
  name: 'EmailAccounts',
  page() {
    return { title: this.$t('route.emailAccounts'), meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: {
    Layout,
    PageHeader,
  },

  data() {
    return {
      title: this.$t('route.emailAccounts'),
      fields: [
        { key: 'name', label: this.$t('table.name'), sortable: true },
        {
          key: 'isActive',
          label: this.$t('table.isActive'),
          sortable: true,
          formatter: (value) => {
            return value === true ? this.$t('common.yes') : this.$t('common.no')
          },
        },
        {
          key: 'isService',
          label: this.$t('table.isService'),
          sortable: true,
          formatter: (value) => {
            return value === true ? this.$t('common.yes') : this.$t('common.no')
          },
        },
        {
          key: 'isGeneral',
          label: this.$t('table.isGeneral'),
          sortable: true,
          formatter: (value) => {
            return value === true ? this.$t('common.yes') : this.$t('common.no')
          },
        },
        { key: 'actions', label: this.$t('table.actions'), sortable: false },
      ],
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      listView: 'emailAccounts/listView',
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
      this.$refs.emailAccountList.refresh()
    },
  },

  async created() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      addObjectView: 'emailAccounts/addObjectView',
      setListViewProperty: 'emailAccounts/setListViewProperty',
      setFilter: `emailAccounts/setFilters`,
      setSort: `emailAccounts/setSort`,
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

      const result = await this.$store.dispatch('emailAccounts/findAll', filterStr)
    },

    addNewObject() {
      const viewId = uuid.v4()
      const object = _.cloneDeep(EmailAccount)
      object.id = viewId
      object.isNew = true

      this.addObjectView({ viewId, object })
      this.$router.push({ name: 'email-account-detail', params: { id: viewId } })
    },

    async editObject(id) {
      await this.$store
        .dispatch('emailAccounts/findByPk', {
          params: { id },
        })
        .then((response) => {
          if (response.status === 200) {
            this.$router.push({ name: 'email-account-detail', params: { id } })
          }
        })
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },
  },
}
</script>

<style></style>
