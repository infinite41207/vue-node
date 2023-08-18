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
                <template v-slot:cell(name)="data">
                  <template>
                    <span class="ri-arrow-right-s-line mr-1 text-info" aria-hidden="true"></span>
                  </template>
                  <a href="javascript:void(0);" @click="editObject(data.item.id)"
                    ><span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ data.item.name }}</span>
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

        <b-modal id="modal-question" :title="$t('common.modalTitle')">
          <p class="my-4">{{ questionMessage }}</p>
          <template v-slot:modal-footer>
            <div class="w-100">
              <b-button-toolbar class="float-right">
                <b-button variant="danger" size="sm" class="mr-2" @click="onCancelModalQuestion"> {{ $t('commands.cancel') }} </b-button>
                <b-button variant="success" size="sm" @click="onOkModalQuestion"> {{ $t('commands.ok') }} </b-button>
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
import { RoleGroup } from '@/store/types/RoleGroup'
import { uuid } from 'vue-uuid'

const namespace = 'roleGroups'

export default {
  name: 'RoleGroupList',

  page() {
    return {
      title: this.$t(`route.accessGroups`),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },

  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: this.$t(`route.accessGroups`),
      fields: [
        { key: 'name', label: this.$t('table.name'), sortable: true },
        { key: 'createdAt', label: this.$t('table.createdAt'), sortable: true },
        { key: 'delete', label: '-' },
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
      listView: `roleGroups/listView`,
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
      addObjectView: `roleGroups/addObjectView`,
      setListViewProperty: `roleGroups/setListViewProperty`,
      setFilter: `roleGroups/setFilters`,
      setSort: `roleGroups/setSort`,
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

      await this.$store.dispatch(`${this.namespace}/findAll`, filterStr)
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
        this.questionMessage = this.$t('message.restoreItem')
      } else {
        this.questionMessage = this.$t('message.deleteItem')
      }

      this.questionAction = this.deleteRestoreItemEnd
      this.questionParams = itemData

      this.$bvModal.show('modal-question')
    },

    async deleteRestoreItemEnd(itemData) {
      await this.$store.dispatch(`${this.namespace}/update`, {
        id: itemData.id,
        markedToDelete: !itemData.markedToDelete,
      })

      this.updateList()
    },

    addNewObject() {
      const viewId = uuid.v4()

      const object = _.cloneDeep(RoleGroup)
      object.id = viewId
      object.isNew = true

      this.addObjectView({ viewId, object: object, settings: [] })
      this.$router.push({ name: this.detailPath, params: { id: viewId } })
    },

    async editObject(objectId) {
      await this.$store
        .dispatch(`${this.namespace}/findByPk`, {
          params: {
            id: objectId,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            this.$router.push({ name: this.detailPath, params: { id: objectId } })
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },
  },
}
</script>
