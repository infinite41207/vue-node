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
              <b-button variant="outline-secondary" class="ml-1 btn-sm" @click="openHistory"><i class="ri-history-line"></i></b-button>
              <b-button variant="outline-secondary" class="ml-1 btn-sm" @click="showHideFilters">
                <i class="ri-filter-line"></i>
              </b-button>
              <b-button v-if="permissionHideAmount === false" variant="outline-secondary" class="ml-1 btn-sm" @click="showReport">
                <i class="ri-file-text-fill"></i>
                Analiza zapytań ofertowych
              </b-button>
              <b-button v-if="permissionHideAmount === true" variant="outline-secondary" class="ml-1 btn-sm" @click="showReportM">
                <i class="ri-file-text-fill"></i>
                Analiza zapytań ofertowych
              </b-button>
            </b-col>
            <b-col md="2">
              <b-form-checkbox id="filter-all" v-model="showClosed" name="filter-all" class="mt-2" switch>
                {{ $t('commands.showCanceled') }}
              </b-form-checkbox>
            </b-col>
            <b-col md="3">
              <b-form-input id="search-input" v-model="searchStr" type="search" autofocus size="sm" :placeholder="$t('common.search')"></b-form-input>
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
                  <b-col v-show="!isConstructor" cols="12" md="6" lg="4">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.executor')" label-for="executor">
                      <f-select v-model="constr" select-btn open-btn value-type="users" detail-view="user-detail" placeholder="Wyszukaj konstruktora..."></f-select>
                    </b-form-group>
                  </b-col>
                  <b-col cols="12" md="6" lg="4" class="mb-2 mb-md-0 mt-2 mt-sm-0">
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
                ref="customerRequestList"
                hover
                :items="listView.list"
                :fields="fields"
                selectable
                small
                responsive
                select-mode="single"
                class="mb-2"
                no-local-sorting
                :sort-by.sync="listView.sort.sortBy"
                :sort-desc.sync="listView.sort.sortDesc"
                :per-page="limit"
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
                    <template v-else> <span class="ri-arrow-right-s-line mr-1 text-info row-icon" aria-hidden="true"></span> </template
                    ><span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ data.item.numberStr }}w{{ data.item.version }}</span>
                  </a>
                </template>
                <template v-slot:cell(status)="data">
                  <span class="badge badge-font" :class="getBadgeColor(data.item.status)">{{ data.item.status.name }}</span>
                </template>
                <template v-slot:cell(customer)="data">
                  <strong v-if="data.item.unknownCustomer === true">{{ data.item.customerName }}</strong>
                  <span v-else>{{ data.item.customer ? data.item.customer.name : '' }}</span>
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
            <b-col cols="6" sm="3" md="2" xl="1">
              <b-form-select id="filter-per-page" v-model="limit" :options="listLimits" name="request-per-page" size="sm"></b-form-select>
            </b-col>
            <b-col class="mt-1" cols="6" sm="3">
              <strong>{{ `${limit > listView.total ? listView.total : limit} z ${listView.total} wierszy` }}</strong>
            </b-col>
            <b-col cols="12" sm="6" md="7" xl="8" class="mt-2 mt-sm-0">
              <b-pagination v-model="currentPage" :total-rows="listView.total" :per-page="limit" align="right" class="my-0"></b-pagination>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- modal question -->
    <b-modal id="modal-question" :title="$t('common.modalTitle')">
      <p class="my-4">{{ questionMessage }}</p>
      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button-toolbar class="float-right">
            <b-button variant="danger" size="sm" class="mr-2" @click="onCancelModalQuestion">
              {{ $t('commands.cancel') }}
            </b-button>

            <b-button variant="success" size="sm" @click="onOkModalQuestion">
              {{ $t('commands.ok') }}
            </b-button>
          </b-button-toolbar>
        </div>
      </template>
    </b-modal>

    <!-- modal message -->
    <b-modal id="modal-message" hide-footer title="Uwaga!">
      <p class="my-4">{{ modalMessage }}</p>
    </b-modal>

    <!-- changes history -->
    <ChangesHistory v-if="historyShowMode && selectedItem" :object-id="selectedItem.id" object-name="customerRequest" @history-closed="historyViewEnd" />

    <NewItem v-if="addNewMode" :new-version="false" @add-new-end="addNewEnd" />

  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import ChangesHistory from '@/components/object-versions/changes-history'
import NewItem from '@/views/customer-requests/form-components/new-item'
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/pl'
import SearchCustomer from '@/views/counterparties/select'
import ListLimits from '@/constants/listLimits'
import _ from 'lodash'

export default {
  name: 'CustomerRequestList',
  components: {
    Layout,
    PageHeader,
    NewItem,
    ChangesHistory,
    DatePicker,
  },

  page() {
    return {
      title: this.title,
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },

  data() {
    return {
      title: this.$t('route.customerRequests'),
      dateLang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: false,
      },
      customerSearchMode: false,
      listLimits: _.cloneDeep(ListLimits),
      fields: [
        { key: 'numberStr', label: this.$t('table.number'), sortable: true },
        { key: 'status', label: this.$t('table.status'), sortable: true },
        {
          key: 'constr.name',
          label: this.$t('table.constructor'),
          sortable: true,
          formatter: (value) => {
            return this.convertNames(value)
          },
        },
        { key: 'reference', label: this.$t('table.reference'), sortable: true },
        {
          key: 'tags',
          label: this.$t('table.tags'),
          sortable: true,
          formatter: (value) => {
            return value.join(', ')
          },
        },
        { key: 'customer', label: this.$t('table.customer'), sortable: true },
        { key: 'commission', label: this.$t('table.commission'), sortable: true },
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
        { key: 'sendingDate', label: this.$t('table.sendingDate'), sortable: true },
        { key: 'orderNumber', label: this.$t('table.orderNumber'), sortable: false },
        { key: 'delete', label: '-' },
      ],
      questionAction: null,
      questionParams: null,
      questionMessage: '',
      historyShowMode: false,
      tasksShowMode: false,
      selectedItem: null,
      versionUuid: '',
      modalMessage: '',
      addNewMode: false,
      isConstructor: false,
      statusList: [],
      employees: [],
      tagsList: [],
      customerList: [],
      visibleFilters: false,
      userSettingItemKey: 'hideAmountsInReports',
      permissionHideAmount: false,
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      listView: 'customerRequests/listView',
      userList: 'users/getUsers',
      currentUser: 'auth/currentUser',
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

    constr: {
      get() {
        return this.listView.filters.constructor
      },
      set(value) {
        this.updateFilter({ constructor: value })
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

    status: {
      get() {
        return this.listView.filters.status
      },
      set(value) {
        this.updateFilter({ status: value })
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

      if (this.constr !== null && this.isConstructor !== true) {
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
      this.$refs.customerRequestList.refresh()
    },
  },

  async mounted() {
    await this.initialize()
    await this.updateList()
  },

  methods: {
    ...mapMutations({
      setListViewProperty: 'customerRequests/setListViewProperty',
      setOpenCustomerRequest: 'customerRequests/setOpenCustomerRequest',
      setFilter: 'customerRequests/setFilters',
      setSort: 'customerRequests/setSort',
    }),

    async initialize() {
      this.initTags()
      this.initStatuses()

      this.visibleFilters = this.filterIsSet

      const authUser = await this.$store.state.auth.currentUser

      await this.$store
        .dispatch('userSettings/findByKey', {
          params: {
            userId: authUser.id,
            userSettingItemKey: this.userSettingItemKey,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const checkPermission = response.data
            if (checkPermission === true) {
              this.permissionHideAmount = true
            }
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    },

    async initTags() {
      const response = await this.$store.dispatch('customerRequestsTags/findAll', {})

      if (response.status === 200) {
        this.tagsList = response.data
      } else {
        this.tagsList = []
      }
    },

    async initStatuses() {
      await this.$store
        .dispatch('customerRequestsStatuses/findAll', {})
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


    updateFilter(filter) {
      this.setFilter(filter)
      this.updateList()
    },

    addNew() {
      this.addNewMode = true
    },

    addNewEnd() {
      this.addNewMode = false
      this.initialize()
    },

    async editItem(itemId) {
      const dataObject = await this.$store.dispatch('customerRequests/findByPk', {
        params: {
          id: itemId,
        },
      })
      if (dataObject) {
        this.$router.push({ name: 'customer-request-detail', params: { id: itemId } })
      }
    },

    showHideFilters() {
      this.visibleFilters = !this.visibleFilters
    },

    async deleteRestoreItem(itemData) {
      if (itemData.markedToDelete) {
        this.questionMessage = this.$t('customerRequest.msg.return')
      } else {
        this.questionMessage = this.$t('customerRequest.msg.delete')
      }

      this.questionAction = this.deleteRestoreItemEnd
      this.questionParams = itemData.id

      this.$bvModal.show('modal-question')
    },

    async deleteRestoreItemEnd(itemId) {
      if (this.readOnly === true) {
        return
      }
      await this.$store.dispatch('customerRequests/changeDeletionMark', {
        id: itemId,
      })

      this.initialize()
      this.updateList()
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

    onRowSelected(items) {
      if (items.length === 1) {
        this.selectedItem = { ...items[0] }
      } else {
        this.selectedItem = null
      }
    },

    openHistory() {
      if (!this.selectedItem) {
        this.modalMessage = this.$t('customerRequest.msg.selectItemFirst')
        this.$bvModal.show('modal-message')
        return
      }

      this.historyShowMode = true
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

      if (this.isConstructor === true) {
        if (this.constr) {
          filterStr.params.filter.isConstructor = true
        }
      } else {
        if (this.constr) {
          filterStr.params.filter.constructorId = this.constr.id
        }
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

      if (this.status) {
        filterStr.params.filter.statusId = this.status
      }

      if (this.searchStr) {
        filterStr.params.filter.searchStr = this.searchStr
      }

      await this.$store.dispatch('customerRequests/findAll', filterStr)
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
      return moment(date).format('DD.MM.YYYY')
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

    historyViewEnd() {
      this.historyShowMode = false
    },

    showReport() {
      this.$router.push({ name: 'customer-request-list', params: { reportType: 'customerRequestList' } })
    },

    showReportM() {
      this.$router.push({ name: 'report-common-routes', params: { reportModule: 'reportCustomerRequestListM' } })
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
