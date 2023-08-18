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
              <b-button variant="outline-secondary" class="ml-1" size="sm" @click="showFilters = !showFilters">
                <i class="ri-filter-line"></i>
              </b-button>
              <b-button v-show="selectedRows && selectedRows.length === 1" variant="info ml-1" size="sm" @click="eventFormModalShow = true">
                {{ $t('commands.addToCalendar') }}
              </b-button>
              <b-button v-show="selectedRows && selectedRows.length === 1" variant="info ml-1" size="sm" @click="eventsListModalShow = true">
                {{ $t('commands.eventsList') }}
              </b-button>
            </b-col>
            <b-col cols="3">
              <b-form-input id="search-input" v-model="searchStr" type="search" autofocus size="sm" :placeholder="$t('common.search')"></b-form-input>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <b-collapse id="list-filters" v-model="showFilters">
                <b-row>
                  <b-col>
                    <b-form-group horizontal :label-cols="3" label="Właściciel">
                      <f-select v-model="counterparty" select-btn open-btn value-type="counterparties" detail-view="scheme-of-cargo" placeholder="Wyszukaj właściciela...">
                      </f-select>
                    </b-form-group>
                  </b-col>

                  <b-col>
                    <b-form-group horizontal :label-cols="3" label="Status">
                      <f-select v-model="status" select-btn open-btn value-type="eventStatuses" detail-view="scheme-of-cargo" placeholder="Wyszukaj status..."> </f-select>
                    </b-form-group>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col>
                    <b-form-group horizontal :label-cols="3" label="Typ">
                      <f-select v-model="type" select-btn open-btn value-type="eventTypes" detail-view="scheme-of-cargo" placeholder="Wyszukaj typ..."> </f-select>
                    </b-form-group>
                  </b-col>

                  <b-col>
                    <b-form-group horizontal :label-cols="3" label="Projekt">
                      <f-select v-model="project" select-btn open-btn value-type="projects" detail-view="scheme-of-cargo" placeholder="Wyszukaj projekt..."> </f-select>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-collapse>
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
                @sort-changed="onSortingChanged"
              >
                <template v-slot:cell(begin)="data">
                  <template>
                    <span class="ri-arrow-right-s-line mr-1 text-info" aria-hidden="true"></span>
                  </template>
                  <a href="javascript:void(0);" @click="editObject(data.item.id)"
                    ><span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ convertDate(data.item.begin) }}</span>
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
      </b-col>
    </b-row>

    <Question :question="questionMessage" @on-question-end="onQuestionEnd" />
    <CalendarEventsFormModal v-model="eventFormModalShow" :defaultData="defaultEventFormData" />
    <CalendarEventsListModal v-model="eventsListModalShow" :parentType="defaultEventFormData.parentType" :parentId="defaultEventFormData.parentId" />
  </Layout>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapMutations } from 'vuex'
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import Event from '@/dto/Event.json'
import { uuid } from 'vue-uuid'
import Question from '@/components/common/question'
import moment from 'moment'
import CalendarEventsFormModal from '@/components/calendar-events-modal/events-form-modal'
import CalendarEventsListModal from '@/components/calendar-events-modal/events-list-modal'

const namespace = 'events'

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
    CalendarEventsFormModal,
    CalendarEventsListModal,
  },
  data() {
    return {
      title: this.$t(`route.${namespace}`),
      fields: [
        { key: 'begin', label: this.$t('table.date'), sortable: true },
        { key: 'name', label: this.$t('table.discription'), sortable: true },
        { key: 'counterparty.name', label: this.$t('table.counterparty'), sortable: true },
        { key: 'eventStatus.name', label: this.$t('table.status'), sortable: true },
        { key: 'eventType.name', label: this.$t('table.type'), sortable: true },
        { key: 'project.name', label: this.$t('table.project'), sortable: true },
        { key: 'employee.name', label: this.$t('table.responsible'), sortable: true },
        { key: 'delete', label: this.$t('table.actions'), sortable: true },
      ],
      namespace: this.$route.meta.store,
      detailPath: this.$route.meta.detailPath,
      questionAction: null,
      questionParams: null,
      questionMessage: '',
      showFilters: false,

      readOnly: this.$route.meta.isReadOnly,
      selectedRows: null,

      eventFormModalShow: false,
      eventsListModalShow: false,
      defaultEventFormData: {
        parentType: 'event',
        parentId: null,
        allDay: false,
        start: null,
        end: null,
        date: null,
      },
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

    status: {
      get() {
        return this.listView.filters.status
      },
      set(value) {
        this.updateFilter({ status: value })
      },
    },

    counterparty: {
      get() {
        return this.listView.filters.counterparty
      },
      set(value) {
        this.updateFilter({ counterparty: value })
      },
    },

    type: {
      get() {
        return this.listView.filters.type
      },
      set(value) {
        this.updateFilter({ type: value })
      },
    },

    project: {
      get() {
        return this.listView.filters.project
      },
      set(value) {
        this.updateFilter({ project: value })
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

      if (this.status) {
        filterStr.params.filter.eventStatusId = this.status.id
      }

      if (this.counterparty) {
        filterStr.params.filter.counterpartyId = this.counterparty.id
      }

      if (this.type) {
        filterStr.params.filter.eventTypeId = this.type.id
      }

      if (this.project) {
        filterStr.params.filter.projectId = this.project.id
      }

      await this.$store.dispatch(`${this.namespace}/findAll`, filterStr)
    },

    onRowSelected(items) {
      if (items && items.length > 0) {
        this.selectedRows = _.cloneDeep(items)

        if (items.length < 2) {
          this.defaultEventFormData = {
            parentType: 'event',
            parentId: items[0].id,
            allDay: false,
            start: items[0].begin,
            end: items[0].ending,
            date: items[0].date,
          }
        }
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
      await this.$store.dispatch(`${this.namespace}/changeDeletionMark`, {
        id: itemId,
      })

      this.updateList()
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

    convertDate(value) {
      return moment(value).format('DD.MM.YYYY HH:mm:ss')
    },

    addNewObject() {
      const viewId = uuid.v4()
      const object = _.cloneDeep(Event)
      object.id = viewId
      object.isNew = true

      this.addObjectView({ viewId, object })
      this.$router.push({ name: this.detailPath, params: { id: viewId } })
    },

    async editObject(objectId) {
      const response = await this.$store.dispatch(`${this.namespace}/findByPk`, {
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
