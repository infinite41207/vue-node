<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col>
        <b-card>
          <b-row class="mb-2">
            <b-col>
              <b-button-toolbar key-nav>
                <b-button-group>
                  <b-button id="add-btn" :disabled="readOnly" variant="success" size="sm" @click="addNewObject">
                    <i class="ri-add-line"></i>
                    {{ $t('commands.add') }}
                    <b-tooltip target="add-btn" triggers="hover" variant="success" placement="bottom">
                      {{ $t('commands.addNew') }}
                    </b-tooltip>
                  </b-button>
                  <b-button id="copy-btn" variant="outline-secondary" class="btn-sm ml-1" :disabled="!selectedRows" @click="copyObject">
                    <i class="ri-file-copy-line"></i>
                    <b-tooltip target="copy-btn" triggers="hover" variant="success" placement="bottom">
                      {{ $t('commands.copy') }}
                    </b-tooltip>
                  </b-button>
                  <b-button id="edit-btn" variant="outline-secondary" class="btn-sm ml-1" :disabled="!selectedRows" @click="editObject(null)">
                    <i class="ri-pencil-line"></i>
                    <b-tooltip target="edit-btn" triggers="hover" variant="success" placement="bottom">
                      {{ $t('commands.edit') }}
                    </b-tooltip>
                  </b-button>
                  <b-button id="delete-btn" variant="outline-secondary" class="btn-sm ml-1" :disabled="!selectedRows" @click="deleteRestoreObject(null)">
                    <i class="ri-delete-bin-line"></i>
                    <b-tooltip target="delete-btn" triggers="hover" variant="success" placement="bottom">
                      {{ $t('commands.deleteRestore') }}
                    </b-tooltip>
                  </b-button>
                  <b-button id="history-btn" variant="outline-secondary" class="btn-sm ml-1" :disabled="!selectedRows || !isVersioning" @click="showHistory = true">
                    <i class="ri-history-line"></i>
                    <b-tooltip target="history-btn" triggers="hover" variant="success" placement="bottom">
                      {{ $t('commands.showHistory') }}
                    </b-tooltip>
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
              <ul v-show="contextMenu.visible" :style="{ left: contextMenu.left + 'px', top: contextMenu.top + 'px' }" class="contextmenu">
                <li @click="selectAll"> <i class="ri-list-check-2 mr-1"></i> {{ $t('commands.selectAll') }} </li>
                <li @click="addNewObject"> <i class="ri-add-line mr-1"></i> {{ $t('commands.add') }} </li>
                <li @click="copyObject"> <i class="ri-file-copy-line mr-1"></i> {{ $t('commands.copy') }} </li>
                <li @click="editObject(null)"> <i class="ri-pencil-line mr-1"></i> {{ $t('commands.edit') }} </li>
                <li @click="deleteRestoreObject(null)"> <i class="ri-delete-bin-line mr-1"></i> {{ $t('commands.deleteRestore') }} </li>
              </ul>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="overflow-x-auto">
              <b-table
                ref="itemsList"
                hover
                striped
                class="min-w-800 mb-1"
                small
                sticky-header="70vh"
                selectable
                select-mode="range"
                selected-variant="secondary"
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
                @row-contextmenu="onRowContextMenu"
                @row-clicked="onRowClicked"
              >
                <template v-slot:table-colgroup="scope">
                  <col v-for="field in scope.fields" :key="field.key" :style="{ width: field.width ? field.width : '' }" />
                </template>
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
                    :class="data.item.markedToDelete ? 'ri-arrow-up-circle-line text-primary' : 'ri-delete-bin-line text-danger'"
                    @click="deleteRestoreObject(data.item)"
                  >
                  </a>
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
    <Question :question="questionMessage" @on-question-end="onQuestionEnd" />
    <ObjectHistory v-if="showHistory" v-model="showHistory" :object-id="selectedRows[0].id" :object-type="model"></ObjectHistory>
  </Layout>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { uuid } from 'vue-uuid'
import { mapMutations } from 'vuex'
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import Question from '@/components/common/question'
import ObjectHistory from '@/components/object-versions/object-history'

export default {
  name: 'ObjectList',

  components: {
    Layout,
    PageHeader,
    Question,
    ObjectHistory,
  },

  page() {
    return {
      title: this.$t(`route.${this.$route.meta.store}`),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },

  data() {
    return {
      title: this.$t(`route.${this.$route.meta.store}`),
      fields: [],
      namespace: this.$route.meta.store,
      detailPath: this.$route.meta.detailPath,
      model: this.$route.meta.model,
      questionAction: null,
      questionParams: null,
      questionMessage: '',
      readOnly: this.$route.meta.isReadOnly,
      selectedRows: null,
      isVersioning: false,
      showHistory: false,
      contextMenu: {
        visible: false,
        left: 0,
        top: 0,
      },
    }
  },

  watch: {
    'listView.list'() {
      this.$refs.itemsList.refresh()
    },

    'contextMenu.visible'(newValue, oldValue) {
      if (newValue) {
        document.body.addEventListener('click', this.closeContextMenu)
      } else {
        document.body.removeEventListener('click', this.closeContextMenu)
      }
    },
  },

  computed: {
    listView() {
      return this.$store.getters[`${this.namespace}/listView`]
    },

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

  async created() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      addObjectView(commit, payload) {
        return commit(this.namespace + '/addObjectView', payload)
      },
      setListViewProperty(commit, payload) {
        return commit(this.namespace + '/setListViewProperty', payload)
      },
      setFilter(commit, payload) {
        return commit(this.namespace + '/setFilters', payload)
      },
      setSort(commit, payload) {
        return commit(this.namespace + '/setSort', payload)
      },
    }),

    async initialize() {
      await this.initFields()
      await this.updateList()
      this.setVersioning()
    },

    async initFields() {
      try {
        this.$store
          .dispatch(`${this.namespace}/getListFields`)
          .then((result) => {
            if (result) {
              this.fields = result.map((el) => {
                const field = { key: el.key, label: el.label === '-' ? '-' : this.$tc(el.label), sortable: el.sortable, width: el.width }
                if (el.formatter) {
                  field.formatter = (value) => {
                    if (el.formatter.dataType == 'date') {
                      return !value ? '-' : moment(value).format(el.formatter.format)
                    } else if (el.formatter.dataType == 'boolean') {
                      return value === true ? this.$tc('common.yes') : this.$tc('common.no')
                    } else if (el.formatter.dataType == 'enum') {
                      return !value ? '-' : this.$tc(`enums.${el.formatter.key}.${value}`)
                    } else return value
                  }
                }

                return field
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

    async setVersioning() {
      if (!this.model) {
        return
      }

      this.$store
        .dispatch('objectVersioningSettings/findAll', {
          noCommit: true,
          params: {
            filter: { objectType: this.model },
          },
        })
        .then((response) => {
          if (response) {
            this.isVersioning = response.data.length > 0
          }
        })
    },

    onRowClicked(item, index, event) {},

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

    onRowContextMenu(item, index, event) {
      event.preventDefault()

      this.$refs.itemsList.clearSelected()
      this.$refs.itemsList.selectRow(index)

      this.contextMenu.visible = true
      this.contextMenu.left = event.layerX
      this.contextMenu.top = event.layerY
    },

    closeContextMenu() {
      this.contextMenu.visible = false
    },

    selectAll() {
      this.$refs.itemsList.selectAllRows()
    },

    addNewObject() {
      const viewId = uuid.v4()
      this.$store.dispatch(`${this.namespace}/addNew`, viewId)
      this.$router.push({ name: this.detailPath, params: { id: viewId } })
    },

    async copyObject() {
      if (this.selectedRows) {
        await this.$store
          .dispatch(`${this.namespace}/findByPk`, {
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

    async deleteRestoreObject(itemData) {
      if (this.readOnly === true) {
        return
      }

      if (itemData === null && this.selectedRows) {
        if (this.selectedRows.length > 0) {
          itemData = this.selectedRows[0]
        }
      }

      if (itemData === null) {
        return
      }

      if (itemData.markedToDelete) {
        this.questionMessage = this.$t('msg.restore')
      } else {
        this.questionMessage = this.$t('msg.delete')
      }

      this.questionAction = this.deleteRestoreObjectEnd
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

    async deleteRestoreObjectEnd(itemId) {
      await this.$store.dispatch(`${this.namespace}/changeDeletionMark`, {
        id: itemId,
      })

      this.updateList()
    },

    async editObject(objectId) {
      if (objectId === null && this.selectedRows) {
        if (this.selectedRows.length > 0) {
          objectId = this.selectedRows[0].id
        }
      }

      if (objectId === null) {
        return
      }

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

<style lang="scss" scoped>
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 10000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  width: 30vw;
  border-radius: 2px;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;

    &:hover {
      background: #eee;
    }
  }
}
</style>