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
                <template v-slot:table-colgroup="scope">
                  <col v-for="field in scope.fields" :key="field.key" :style="{ width: field.width ? field.width : '' }" />
                </template>
                <template v-slot:cell(objectType)="data">
                  <template>
                    <span class="ri-arrow-right-s-line mr-1 text-info" aria-hidden="true"></span>
                  </template>
                  <a href="javascript:void(0);" @click="editObject(data.item.id)"
                    ><span class="text-info">{{ data.item.objectType }}</span>
                  </a>
                </template>
                <template v-slot:cell(delete)="data">
                  <a id="del-res-btn" href="javascript:void(0);" class="ri-delete-bin-7-fill text-danger" @click="deleteItem(data.item)"> </a>
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
      </b-col>
    </b-row>

    <Question :question="questionMessage" @on-question-end="onQuestionEnd" />
  </Layout>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapMutations } from 'vuex'
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import ObjectVersionningSetting from '@/dto/ObjectVersionningSetting.json'
import Question from '@/components/common/question'
import { uuid } from 'vue-uuid'

const namespace = 'objectVersioningSettings'

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
    Question,
  },

  data() {
    return {
      title: this.$t(`route.${namespace}`),
      fields: [
        { key: 'objectType', label: this.$t('table.objectType'), sortable: true },
        {
          key: 'versioningMethod',
          label: this.$t('table.versioningMethod'),
          formatter: (value) => {
            return this.$t(`enums.versioningMethods.${value}`)
          },
          sortable: true,
          width: '20%',
        },
        { key: 'delete', label: '-', width: '3%' },
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

    async deleteItem(itemData) {
      if (this.readOnly === true) {
        return
      }

      this.questionMessage = this.$t('msg.delete')

      this.questionAction = this.deleteRestoreItemEnd
      this.questionParams = itemData.id

      this.$bvModal.show('modal-question')
    },

    onQuestionEnd(result) {
      if (result === true) {
        if (this.questionAction) {
          if (this.questionParams) {
            this.questionAction(this.questionParams)
          } else {
            this.questionAction()
          }
        }
      }

      this.questionAction = null
      this.questionParams = null
      this.questionMessage = null
    },

    async deleteItemEnd(itemId) {
      await this.$store.dispatch(`${namespace}/delete`, {
        id: itemId,
      })

      this.updateList()
    },

    addNewObject() {
      const viewId = uuid.v4()
      const object = _.cloneDeep(ObjectVersionningSetting)
      object.id = viewId
      object.isNew = true

      this.addObjectView({ viewId, object })
      this.$router.push({ name: this.detailPath, params: { id: viewId } })
    },

    async editObject(objectId) {
      await this.$store
        .dispatch(`${namespace}/findByPk`, {
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
