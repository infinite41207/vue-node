<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col>
        <b-card>
          <b-row class="mb-2">
            <b-col>
              <b-button class="btn btn-success btn-sm" :disabled="readOnly" @click="addNew">
                <i class="ri-add-line"></i>
                {{ $t('commands.add') }}
              </b-button>
              <a href="javascript:void(0);" class="btn btn-info btn-sm ml-2" @click="openHistory">
                <i class="ri-history-line"></i>
              </a>
              <b-button class="ml-2" size="sm" @click="showHideFilters">
                <i class="ri-filter-line"></i>
              </b-button>
              <b-button variant="outline-secondary" size="sm" class="btn ml-2" @click="startTracking"> Uruchom tracking </b-button>
              <b-button variant="outline-secondary" class="ml-2 mr-2" size="sm" @click="openTrackingHistory">
                <i class="ri-time-line"></i>
              </b-button>
              <b-button variant="outline-secondary" size="sm"  @click="updateList">
                <i class="ri-refresh-line"></i>
              </b-button>
            </b-col>
            <b-col md="2">
              <b-form-checkbox id="filter-all" v-model="showClosed" size="sm" name="filter-all" switch>
                {{ $t('commands.showCanceled') }}
              </b-form-checkbox>
            </b-col>
            <b-col>
              <b-input-group>
                <b-form-input id="filter-input" v-model="searchStr" type="search" autofocus size="sm" :placeholder="$t('common.search')"></b-form-input>
              </b-input-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-collapse id="list-filters" v-model="visibleFilters">
                <b-row>
                  <b-col cols="12" md="6" lg="4">
                    <b-form-group horizontal label-cols="12" label-cols-sm="3" label="Okres" label-for="filter-period">
                      <date-picker v-model="period" range type="date" range-separator="-" format="DD.MM.YYYY" :lang="dateLang" show-week-number size="sm"></date-picker>
                    </b-form-group>
                  </b-col>
                  <b-col cols="12" md="6" lg="4">
                    <b-form-group horizontal label-cols="12" label-cols-sm="3" :label="$t('table.status')" label-for="request-status">
                      <b-input-group size="sm">
                        <b-form-select
                          id="request-status"
                          v-model="status"
                          :options="statusList"
                          name="request-status"
                          text-field="name"
                          value-field="id"
                          size="sm"
                          :multiple="multiplyStatus"
                        >
                          <template v-if="!multiplyStatus" v-slot:first>
                            <b-form-select-option :value="null">-- Brak filtru --</b-form-select-option>
                          </template></b-form-select
                        >
                        <b-input-group-append>
                          <b-form-checkbox v-model="multiplyStatus" size="sm" button class="multiply-btn">{{ multiplyStatus === true ? '+' : '-' }}</b-form-checkbox>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                  <b-col cols="12" md="6" lg="4">
                    <b-form-group horizontal label-cols="12" label-cols-sm="3" :label="$t('table.tags')" label-for="filter-tags">
                      <b-form-select id="filter-tags" v-model="tags" :options="tagsList" name="filter-tags" text-field="name" value-field="name" size="sm">
                        <template v-slot:first>
                          <b-form-select-option :value="null">-- Brak filtru --</b-form-select-option>
                        </template></b-form-select
                      >
                    </b-form-group>
                  </b-col>
                  <b-col cols="12" md="6" lg="4">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.executor')" label-for="executor">
                      <f-select v-model="executor" select-btn open-btn value-type="users" detail-view="user-detail" placeholder="Wyszukaj wykonawcę..."></f-select>
                    </b-form-group>

                  </b-col>
                  <b-col cols="12" md="6" lg="4">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.customer')" label-for="customer">
                      <f-select v-model="customer" select-btn open-btn value-type="counterparties" detail-view="counterparty-detail" placeholder="Wyszukaj klienta..."></f-select>
                    </b-form-group>
                  </b-col>
                  <b-col cols="12" md="6" lg="4">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.manager')" label-for="manager">
                      <f-select v-model="manager" select-btn open-btn value-type="employees" detail-view="employee-detail" placeholder="Wyszukaj handlowca..."></f-select>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-collapse>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                ref="interactionList"
                hover
                :items="listView.list"
                :fields="fields"
                selectable
                select-mode="single"
                small
                responsive
                class="mb-2"
                no-local-sorting
                :sort-by.sync="listView.sort.sortBy"
                :sort-desc.sync="listView.sort.sortDesc"
                :per-page="listView.limit"
                :current-page="1"
                :tbody-tr-class="rowClass"
                @row-selected="onRowSelected"
                @sort-changed="onSortingChanged"
              >
                <template v-slot:cell(numberStr)="data">
                  <a href="javascript:void(0);" @click="editItem(data.item.id)">
                    <template v-if="data.rowSelected">
                      <span class="ri-check-line mr-1 text-info row-icon" aria-hidden="true"></span>
                    </template>
                    <template v-else>
                      <span class="ri-arrow-right-s-line mr-1 text-info row-icon" aria-hidden="true"></span>
                    </template>
                    <span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ data.item.numberStr }}w{{ data.item.version }}</span>
                  </a>
                </template>
                <template v-slot:cell(status)="data">
                  <b-row>
                    <span class="badge badge-font" :class="getBadgeColor(data.item.status)">{{ data.item.status.name }} </span>
                  </b-row>
                  <b-row v-if="data.item.activeTimeTracking === true">
                    <span class="badge badge-font" :class="getTrackingHistoryBadgeColor(data.item)">Aktywny tracking </span>
                  </b-row>
                  <b-row v-if="data.item.timeTrackingHistory && data.item.activeTimeTracking !== true">
                    <span class="badge badge-font" :class="getTrackingHistoryBadgeColor(data.item)">Tracking</span>
                  </b-row>
                </template>
                <template v-slot:cell(executionTerm)="data">
                  <span class="badge badge-font" :class="getExecutionDateColor(data.item)">{{ formatDate(data.item.executionTerm) }}</span>
                </template>
                <template v-slot:cell(delete)="data">
                  <a
                    href="javascript:void(0);"
                    :class="data.item.markedToDelete ? 'ri-arrow-up-circle-fill text-primary' : 'ri-delete-bin-7-fill text-danger'"
                    @click="deleteRestoreItem(data.item)"
                  >
                  </a>
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4" sm="3" md="2" lg="1">
              <b-form-select id="filter-per-page" v-model="limit" :options="listLimits" name="request-per-page" size="sm"></b-form-select>
            </b-col>
            <b-col>
              <b-pagination v-model="currentPage" :total-rows="listView.total" :per-page="listView.limit" align="right" class="my-0"></b-pagination>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <Question :question="questionMessage" @on-question-end="onQuestionEnd" />
    <Message :message="modalMessage" />

    <!-- changes history -->
    <ChangesHistory v-if="historyShowMode && selectedItem" :object-id="selectedItem.id" object-name="interaction" @history-closed="historyViewEnd" />

    <!-- <SearchCustomer v-if="customerSearchMode" :return-name="true" @value-selected="customerSelectedEnd" /> -->

    <ObjectsTimeTracking v-if="timeTrackingShowMode && selectedItem" :timeTrackingHistoryTable="selectedItem.timeTrackingHistory" :object-id="selectedItem.id" object-name="interaction" @tracking-closed="trackingViewEnd" />

  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import ChangesHistory from '@/components/object-versions/changes-history'
import ObjectsTimeTracking from '@/components/objects-time-tracking/tracking-history'
import Interaction from '@/dto/Interaction.json'
import ListLimits from '@/constants/listLimits'
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/pl'
// import SearchCustomer from '@/views/counterparties/select'
import Message from '@/components/common/message'
import Question from '@/components/common/question'
import _ from 'lodash'
import { uuid } from 'vue-uuid'

export default {
  name: 'InteractionList',

  components: {
    Layout,
    PageHeader,
    ChangesHistory,
    ObjectsTimeTracking,
    DatePicker,
    // SearchCustomer,
    Message,
    Question,
  },

  page() {
    return {
      title: this.title,
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },

  data() {
    return {
      title: this.$t('route.interactions'),
      dateLang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: false,
      },
      listLimits: _.cloneDeep(ListLimits),
      customerSearchMode: false,
      fields: [
        { key: 'numberStr', label: this.$t('table.number'), sortable: true },
        { key: 'status', label: this.$t('table.status'), sortable: true },
        { key: 'reference', label: this.$t('table.reference'), sortable: true },
        {
          key: 'tags',
          label: this.$t('table.tags'),
          sortable: true,
          formatter: (value) => {
            return value.join(', ')
          },
        },
        { key: 'customer.name', label: this.$t('table.customer'), sortable: true },
        {
          key: 'manager.name',
          label: this.$t('table.manager'),
          sortable: true,
          formatter: (value) => {
            return this.convertNames(value)
          },
        },
        { key: 'createdAt', label: this.$t('table.createdAt'), sortable: true },
        { key: 'executionTerm', label: this.$t('table.executionPeriod'), sortable: true },
        { key: 'delete', label: '-' },
      ],
      questionAction: null,
      questionParams: null,
      questionMessage: '',
      historyShowMode: false,
      timeTrackingShowMode: false,  
      tasksShowMode: false,
      selectedItem: null,
      versionUuid: '',
      modalMessage: '',
      statusList: [],
   
      tagsList: [],
      
      visibleFilters: false,
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      listView: 'interactions/listView',
      userList: 'users/getUsers',
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

    limit: {
      get() {
        return this.listView.limit
      },
      set(value) {
        this.setListViewProperty({ limit: value })
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

    manager: {
      get() {
        return this.listView.filters.manager
      },
      set(value) {
        this.updateFilter({ manager: value })
      },
    },

    executor: {
      get() {
        return this.listView.filters.executor
      },
      set(value) {
        this.updateFilter({ executor: value })
      },
    },

    period: {
      get() {
        return this.listView.filters.period
      },
      set(value) {
        this.updateFilter({ period: value })
      },
    },

    tags: {
      get() {
        return this.listView.filters.tags
      },
      set(value) {
        this.updateFilter({ tags: value })
      },
    },

    customer: {
      get() {
        return this.listView.filters.customer
      },
      set(value) {
        this.updateFilter({ customer: value })
      },
    },

    multiplyStatus: {
      get() {
        return this.listView.filters.multiplyStatus
      },
      set(value) {
        let newStatus
        if (value === true) {
          newStatus = []
          if (this.status !== null) {
            newStatus.push(this.status)
          }

          this.updateFilter({ multiplyStatus: value, status: newStatus })
        } else {
          newStatus = null
          if (this.status.length > 0) {
            newStatus = this.status[0]
          }

          this.updateFilter({ multiplyStatus: value, status: newStatus })
        }
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

    showClosed: {
      get() {
        return this.listView.filters.showClosed
      },
      set(value) {
        this.updateFilter({ showClosed: value })
      },
    },

    filterIsSet() {
      let result = false

      if (this.manager !== null) {
        result = true
      }

      if (this.executor !== null) {
        result = true
      }

      if (this.customer !== null) {
        result = true
      }

      if (this.tags !== null) {
        result = true
      }

      if (this.multiplyStatus === false) {
        if (this.status !== null) {
          result = true
        }
      } else {
        if (this.status.length > 0) {
          result = true
        }
      }

      if (this.period.length > 0 && this.period[0] !== null) {
        result = true
      }

      return result
    },
  },

  watch: {
    'listView.list'(newVal, oldVal) {
      this.$refs.interactionList.refresh()
    },
  },

  async mounted() {
    await this.initialize()
    await this.updateList()
  },

  methods: {
    ...mapMutations({
      setListViewProperty: 'interactions/setListViewProperty',
      addObjectView: 'interactions/addObjectView',
      setFilter: 'interactions/setFilters',
      setSort: 'interactions/setSort',
    }),

    async initialize() {
    
      this.initTags()
      this.initStatuses()

      if (this.customer) {
        this.customerList.push({ ...this.customer })
      }

      this.visibleFilters = this.filterIsSet
    },

    async initTags() {
      const response = await this.$store.dispatch('interactionTags/findAll', {})

      if (response.status === 200) {
        this.tagsList = response.data
      } else {
        this.tagsList = []
      }
    },

    async initStatuses() {
      await this.$store
        .dispatch('interactionStatuses/findAll', {})
        .then((response) => {
          if (response && response.status === 200) {
            this.statusList = response.data.responseData
          } else {
            this.statusList = []
          }
        })
        .catch((err) => {
          console.error(err)
          this.statusList = []
        })
    },

    async onSortingChanged(ctx) {
      this.setSort({ sortBy: ctx.sortBy, sortDesc: ctx.sortDesc })
      this.updateList()
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
      if (item.state === 'Deactive') return 'table-secondary text-secondary striped'
    },

    // openCustomerSearch() {
    //   this.customerSearchMode = true
    // },

    // customerSelectedEnd(value) {
    //   if (value !== undefined) {
    //     this.updateFilter({ customer: value })
    //     this.customerList = []
    //     this.customerList.push({ ...this.customer })
    //   }

    //   this.customerSearchMode = false
    // },

    // onSearchCustomer(searchValue) {
    //   this.updateCustomerList(searchValue)
    // },

    // async updateCustomerList(searchStr) {
    //   if (searchStr === '') {
    //     return
    //   }

    //   const reqParams = {
    //     params: {
    //       sort: { sortBy: 'name', sortDesc: false },
    //       filter: {},
    //       limit: 50,
    //     },
    //   }

    //   reqParams.params.filter.searchStr = searchStr

    //   const response = await this.$store.dispatch('counterparties/findAll', {
    //     ...reqParams,
    //     noCommit: true,
    //   })

    //   this.customerList = []
    //   if (response.status === 200) {
    //     for (const customerRow of response.data) {
    //       this.customerList.push({ id: customerRow.id, name: customerRow.name })
    //     }
    //   }

    //   if (this.customer) {
    //     const existCustomer = this.customerList.find((el) => el.id === this.customer.id)

    //     if (!existCustomer) {
    //       this.customerList.push({ ...this.customer })
    //     }
    //   }
    // },

    updateFilter(filter) {
      this.setFilter(filter)
      this.updateList()
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    addNew() {
      const viewId = uuid.v4()

      this.addObjectView({
        viewId,
        editMode: 'NEW',
        nevVersion: false,
        byEmail: false,
        emailData: {
          uid: null,
          iId: null,
          title: '',
          type: 'INCOMING',
          emailAccountId: null,
        },
        object: _.cloneDeep(Interaction),
      })

      this.$router.push({ name: 'interaction-detail', params: { id: viewId } })
    },

    async editItem(itemId) {
      const response = await this.$store.dispatch('interactions/findByPk', {
        params: {
          id: itemId,
        },
      })
      if (response.status === 200) {
        this.$router.push({ name: 'interaction-detail', params: { id: itemId } })
      }
    },

    showHideFilters() {
      this.visibleFilters = !this.visibleFilters
    },

    async deleteRestoreItem(itemData) {
      if (itemData.markedToDelete) {
        this.questionMessage = this.$t('interaction.msg.return')
      } else {
        this.questionMessage = this.$t('interaction.msg.delete')
      }

      this.questionAction = this.deleteRestoreItemEnd
      this.questionParams = itemData.id

      this.$bvModal.show('modal-question')
    },

    async deleteRestoreItemEnd(itemId) {
      await this.$store.dispatch('interactions/changeDeletionMark', {
        id: itemId,
      })

      this.initialize()
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

    onRowSelected(items) {
      if (items.length === 1) {
        this.selectedItem = { ...items[0] }
      } else {
        this.selectedItem = null
      }
    },

    openHistory() {
      if (!this.selectedItem) {
        this.modalMessage = this.$t('interaction.msg.selectItemFirst')
        this.$bvModal.show('modal-message')
        return
      }

      this.historyShowMode = true
    },

    async startTracking() {
      if (this.selectedItem) {
        const params = {
          object: this.selectedItem,
          objectType: 'interaction',
        };
        const createTrackingResult = await this.$store.dispatch('objectsTimeTracking/create', params).then((response) => {
          console.log('successfull part');
          if (response.status === 200) {
            this.$bvToast.toast(this.$t('msg.createTrackingSuccess'), {
              title: this.$t('common.msg'),
              variant: 'success',
              solid: true,
              autoHideDelay: 2000,
            }) 
          }
          return response;
        }).catch((err) => {
          this.$bvToast.toast(this.$t('msg.createTrackingError'), {
            title: this.$t('common.msg'),
            variant: 'danger',
            solid: true,
            autoHideDelay: 2000,
          })
        })
        await this.updateList()
      }
    },

    async openTrackingHistory() {
      
      if (!this.selectedItem) {
        this.modalMessage = this.$t('interaction.msg.selectItemFirst')
        this.$bvModal.show('modal-message')
        return
      }

      this.timeTrackingShowMode = true
    },

    convertNames(value) {
      if (typeof value === 'string') {
        return value
          .split(' ')
          .map((subName) => subName[0])
          .join('')
      }
      return ''
    },

    async updateList() {
      const filterStr = {
        params: {
          filter: {},
          pagination: { page: this.currentPage, limit: this.listView.limit },
          sort: { sortBy: this.listView.sort.sortBy, sortDesc: this.listView.sort.sortDesc },
        },
      }

      if (!this.showClosed) {
        filterStr.params.filter.state = 'Active'
        filterStr.params.filter.markedToDelete = false
        filterStr.params.filter.statusFilter = { isClosed: false }
      }

      if (this.period.length === 2 && this.period[0] !== null) {
        filterStr.params.filter.period = this.period
      }

      if (this.customer) {
        filterStr.params.filter.customerId = this.customer.id
      }

      if (this.tags) {
        filterStr.params.filter.tags = this.tags
      }

      if (this.manager) {
        filterStr.params.filter.managerId = this.manager.id
      }

      if (this.executor) {
        filterStr.params.filter.executorId = this.executor.id
      }

      if (this.status) {
        filterStr.params.filter.statusId = this.status
      }

      if (this.searchStr) {
        filterStr.params.filter.searchStr = this.searchStr
      }

      await this.$store.dispatch('interactions/findAll', filterStr)
    },

    getExecutionDateColor(item) {
      const date = item.executionTerm

      const isClosed = item.status ? item.status.isClosed : false
      let color = 'badge-light'

      if (isClosed !== true) {
        const currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)

        const executionDate = new Date(date)

        if (executionDate.getTime() < currentDate.getTime()) {
          color = 'badge-danger'
        } else if (this.addDays(executionDate, -1) <= currentDate) {
          color = 'badge-warning'
        }
      }
      return color
    },

    formatDate(date) {
      return date ? moment(date).format('DD.MM.YYYY') : ''
    },

    addDays(date, days) {
      var result = new Date(date)
      result.setDate(result.getDate() + days)
      return result
    },

    getBadgeColor(status) {
      let color = 'light'
      if (status) {
        if (status.color.length > 0) {
          color = status.color
        }
      }
      return `badge-${color}`
    },

    getTrackingHistoryBadgeColor(item) {
      let color = 'light'
      if (item) {
        if (item.activeTimeTracking === true) {
          color = "danger"
        } else if (item.timeTrackingHistory.length > 0) {
          color = "info"
        }
      }
      return `badge-${color}`
    },    

    historyViewEnd() {
      this.historyShowMode = false
    },

    trackingViewEnd() {
      this.timeTrackingShowMode = false
    },
  },
}
</script>

<style>
.badge-font {
  font-size: 0.75rem;
}

.multiply-btn .btn-sm {
  padding: 0.25rem 0.8rem !important;
}
</style>
