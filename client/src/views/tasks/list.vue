<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col>
        <b-card>
          <ToolBar :items="toolBarItems" />
          <b-row>
            <b-col>
              <b-collapse id="list-filters" v-model="visibleFilters">
                <b-row>
                  <b-col>
                    <b-form-group horizontal :label-cols="3" label="Okres" label-for="filter-period">
                      <date-picker v-model="period" range type="date" range-separator="-" format="DD.MM.YYYY" :lang="dateLang" show-week-number size="sm"></date-picker>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group horizontal :label-cols="3" :label="$t('table.customer')" label-for="filter-customer">
                      <b-input-group>
                        <v-select
                          ref="fromSelectRef"
                          v-model="customer"
                          :options="customerList"
                          :loading="false"
                          :clearable="true"
                          class="with-append"
                          label="name"
                          placeholder="Wybierz klienta..."
                          @search="onSearchCustomer"
                        >
                        </v-select>
                        <template v-slot:append>
                          <b-button id="customer-search" class="customer-search" size="sm" @click="openCustomerSearch">
                            <i class="ri-search-line"></i>
                          </b-button>
                        </template>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group horizontal :label-cols="3" :label="$t('table.executor')" label-for="filter-executor">
                      <b-form-select id="filter-executor" v-model="executor" :options="executorList" name="request-executor" text-field="name" value-field="id" size="sm">
                        <template v-slot:first>
                          <b-form-select-option :value="null">-- Brak filtru --</b-form-select-option>
                        </template>
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-collapse>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                ref="taskList"
                hover
                :items="listView.list"
                :fields="fields"
                selectable
                small
                select-mode="single"
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
                <template v-slot:cell(number)="data">
                  <template v-if="data.rowSelected">
                    <span class="ri-check-line mr-1 text-info" aria-hidden="true"></span>
                  </template>
                  <template v-else>
                    <span class="ri-arrow-right-s-line mr-1 text-info" aria-hidden="true"></span>
                  </template>
                  <a href="javascript:void(0);" @click="editTask(data.item.id)"
                    ><span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ data.item.number }}</span>
                  </a>
                </template>
                <template v-slot:cell(delete)="data">
                  <a
                    v-if="currentUser.fullRights === true"
                    href="javascript:void(0);"
                    class=""
                    :class="data.item.markedToDelete ? 'ri-arrow-up-circle-fill text-primary' : 'ri-delete-bin-7-fill text-danger'"
                    @click="deleteTask(data.item.id)"
                  >
                  </a>
                </template>
                <template v-slot:cell(customer)="data">
                  <strong v-if="data.item.customer.deliverySettings.vip === true">{{ data.item.customer.name }}</strong>
                  <span v-else>{{ data.item.customer.name }}</span>
                </template>
                <template v-slot:cell(executor)="data">
                  <span v-if="data.item.executor" class="ri-user-fill mr-1 text-info" aria-hidden="true"></span>
                  <span v-else class="ri-group-fill mr-1 text-info" aria-hidden="true"></span>
                  <span>{{ data.item.executor ? data.item.executor.name : data.item.executorRole ? data.item.executorRole.name : '' }}</span>
                </template>
                <template v-slot:cell(importance)="data">
                  <span
                    class="badge"
                    :class="{
                      'badge-success-lighten': data.item.importance === 'LOW',
                      'badge-primary-lighten': data.item.importance === 'NORMAL',
                      'badge-danger-lighten': data.item.importance === 'HIGHT',
                    }"
                    >{{ $t(`importance.${data.item.importance}`) }}</span
                  >
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="1">
              <b-form-select id="filter-per-page" v-model="limit" :options="listLimits" name="request-per-page" size="sm"></b-form-select>
            </b-col>
            <b-col>
              <b-pagination v-model="currentPage" :total-rows="listView.total" :per-page="limit" align="right" class="my-0"></b-pagination>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- modal message -->
    <b-modal id="modal-message" hide-footer :title="$t('common.modalTitle')">
      <p class="my-4">{{ modalMessage }}</p>
    </b-modal>

    <SearchCustomer v-if="customerSearchMode" :return-name="true" @value-selected="customerSelectedEnd" />
    <RedirectTask v-if="redirectMode" :task-id="selectedTask ? selectedTask.id : null" @redirect-end="redirectTaskEnd" />
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import ListLimits from '@/constants/listLimits'
import PageHeader from '@/components/page-header'
import ToolBar from '@/components/tool-bar'
import { mapGetters, mapMutations } from 'vuex'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/pl'
import SearchCustomer from '@/views/counterparties/select'
import RedirectTask from './components/redirect'
import _ from 'lodash'

/**
 * Tasks component
 */
export default {
  name: 'TasksList',

  page() {
    return { title: this.$t('route.tasks'), meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: {
    Layout,
    PageHeader,
    ToolBar,
    DatePicker,
    SearchCustomer,
    RedirectTask,
  },

  data() {
    return {
      title: this.$t('route.tasks'),
      toolBarItems: [],
      dateLang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: false,
      },
      listLimits: _.cloneDeep(ListLimits),
      customerSearchMode: false,
      redirectMode: false,
      fields: [
        { key: 'number', label: this.$t('table.number'), sortable: true },
        { key: 'name', label: this.$t('table.name'), sortable: true },
        {
          key: 'importance',
          label: this.$t('table.importance'),
          sortable: true,
        },
        { key: 'date', label: this.$t('table.createdAt'), sortable: true },
        { key: 'executionPeriod', label: this.$t('table.executionPeriod'), sortable: true },
        { key: 'customer.name', label: this.$t('table.customer'), sortable: true },
        { key: 'customer.abbreviation', label: this.$t('table.abbreviation'), sortable: true },
        { key: 'baseDocument', label: this.$t('table.baseDocument'), sortable: false },

        { key: 'authorName', label: this.$t('table.author'), sortable: true },
        { key: 'executor', label: this.$t('table.executor'), sortable: false },
        { key: 'delete', label: '' },
      ],
      selectedTask: null,
      modalMessage: '',
      customerList: [],
      executorList: [],
      visibleFilters: false,
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      listView: 'tasks/listView',
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

    showExecuted: {
      get() {
        return this.listView.filters.executed
      },
      set(value) {
        this.updateFilter({ executed: value })
      },
    },

    showMyTasks: {
      get() {
        return this.listView.filters.myTasks
      },
      set(value) {
        this.updateFilter({ myTasks: value })
      },
    },

    showTasksByExecutorRole() {
      return this.listView.filters.tasksByExecutorRole
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

    customer: {
      get() {
        return this.listView.filters.customer
      },
      set(value) {
        this.updateFilter({ customer: value })
      },
    },

    filterIsSet() {
      let result = false

      if (this.executor !== null) {
        result = true
      }

      if (this.customer !== null) {
        result = true
      }

      if (this.period.length > 0 && this.period[0] !== null) {
        result = true
      }

      return result
    },
  },

  watch: {
    'listView.list'(newVal, oldVal) {
      this.$refs.taskList.refresh()
    },
    selectedTask() {
      this.updateToolBarItems()
    },
    'selectedTask.executed'() {
      this.updateToolBarItems()
    },
    'selectedTask.executionAccepted'() {
      this.updateToolBarItems()
    },
    readOnly() {
      this.updateToolBarItems()
    },
  },

  async created() {
    this.updateToolBarItems()
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      setListViewProperty: 'tasks/setListViewProperty',
      setFilter: 'tasks/setFilters',
      setSort: 'tasks/setSort',
      setOpenTask: 'tasks/setOpenTask',
    }),
    updateToolBarItems() {
      this.toolBarItems = [
        {
          title: this.$t('commands.execute'),
          icon: 'ri-check-line',
          variant: 'success',
          size: 'sm',
          disabled: !this.selectedTask || this.selectedTask.executed || this.readOnly,
          click: this.executeTask,
        },
        {
          title: this.$t('task.executionReceive'),
          icon: 'ri-bookmark-fill',
          variant: 'outline-secondary',
          size: 'sm',
          disabled: !this.selectedTask || this.selectedTask.executed || this.selectedTask.executionAccepted,
          click: this.acceptToExecutionTask,
        },
        {
          title: this.$t('commands.redirect'),
          icon: 'ri-arrow-right-line-bold',
          variant: 'outline-secondary',
          size: 'sm',
          disabled: !this.selectedTask || this.selectedTask.executed,
          click: this.redirectTask,
        },
        {
          icon: 'ri-filter-line',
          variant: 'outline-secondary',
          size: 'sm',
          click: this.showHideFilters,
        },
      ]
    },

    async initialize() {
      this.initExecutors()

      await this.$store
        .dispatch('userSettings/findByPk', {
          params: {
            userId: this.currentUser.id,
            userSettingItemKey: 'showTasksByExecutorRole',
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const userSetting = response.data
            if (userSetting === true) {
              this.setFilter({ tasksByExecutorRole: userSetting })
            }
          }
        })
        .catch((error) => {
          console.warn(error)
        })

      if (this.customer) {
        this.customerList.push({ ...this.customer })
      }

      this.visibleFilters = this.filterIsSet

      await this.updateList()
    },

    async initExecutors() {
      if (this.executorList.length === 0) {
        await this.$store.dispatch('users/findAll', { noCommit: true }).then((response) => {
          if (response.status === 200) {
            this.executorList = response.data
          }
        })
      }
    },

    async updateList() {
      const filterStr = {
        params: {
          filter: { started: true },
          pagination: { page: this.currentPage, limit: this.listView.limit },
          sort: { sortBy: this.listView.sort.sortBy, sortDesc: this.listView.sort.sortDesc },
        },
      }

      if (!this.showExecuted) {
        filterStr.params.filter.executed = false
      }

      if (this.showMyTasks) {
        filterStr.params.filter.myTasks = this.showMyTasks
      }

      if (this.showTasksByExecutorRole === true) {
        filterStr.params.filter.showTasksByExecutorRole = this.showTasksByExecutorRole
      }

      if (this.period.length === 2 && this.period[0] !== null) {
        filterStr.params.filter.period = this.period
      }

      if (this.customer) {
        filterStr.params.filter.customerId = this.customer.id
      }

      if (this.executor) {
        filterStr.params.filter.executorId = this.executor
      }

      if (this.searchStr) {
        filterStr.params.filter.searchStr = this.searchStr
      }

      await this.$store.dispatch('tasks/findAll', filterStr)
    },

    async onSortingChanged(ctx) {
      this.setSort({ sortBy: ctx.sortBy, sortDesc: ctx.sortDesc })
      this.updateList()
    },

    redirectTask() {
      this.redirectMode = true
    },

    redirectTaskEnd() {
      this.redirectMode = true
    },

    openCustomerSearch() {
      this.customerSearchMode = true
    },

    customerSelectedEnd(value) {
      if (value !== undefined) {
        this.updateFilter({ customer: value })
        this.customerList = []
        this.customerList.push({ ...this.customer })
      }

      this.customerSearchMode = false
    },

    onSearchCustomer(searchValue) {
      this.updateCustomerList(searchValue)
    },

    async updateCustomerList(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: false },
          filter: {},
          limit: 50,
        },
      }

      reqParams.params.filter.searchStr = searchStr

      const response = await this.$store.dispatch('counterparties/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.customerList = []
      if (response.status === 200) {
        for (const customerRow of response.data) {
          this.customerList.push({ id: customerRow.id, name: customerRow.name })
        }
      }

      if (this.customer) {
        const existCustomer = this.customerList.find((el) => el.id === this.customer.id)

        if (!existCustomer) {
          this.customerList.push({ ...this.customer })
        }
      }
    },

    updateFilter(filter) {
      this.setFilter(filter)
      this.updateList()
    },

    showHideFilters() {
      this.visibleFilters = !this.visibleFilters
    },

    async editTask(taskId) {
      const dataObject = await this.$store.dispatch('tasks/findByPk', {
        params: {
          id: taskId,
        },
      })
      if (dataObject) {
        this.$router.push({ name: 'task-detail' })
      }
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
      if (item.executed) return 'table-success text-secondary striped'
      if (item.executionAccepted) return 'table-warning striped'
    },

    async deleteTask(taskId) {
      if (this.readOnly === true) {
        return
      }
      await this.$store.dispatch('tasks/deleteTask', {
        id: taskId,
      })

      this.initialize()
    },

    onRowSelected(items) {
      if (items.length === 1) {
        this.selectedTask = { ...items[0] }
      } else {
        this.selectedTask = null
      }
    },

    async executeTask() {
      await this.$store.dispatch('tasks/executeTask', { id: this.selectedTask.id, executionResult: '' })
      this.updateList()
    },

    async acceptToExecutionTask() {
      await this.$store
        .dispatch('tasks/acceptToExecutionTask', { id: this.selectedTask.id })
        .then((response) => {
          if (response.status !== 200) {
            this.$bvToast.toast(response.message, {
              title: this.$t('common.msg'),
              variant: 'danger',
              solid: true,
              autoHideDelay: 2000,
            })
          }
        })
        .catch((error) => {
          console.error(error)
        })

      this.updateList()
    },
  },
}
</script>

<style>
.multiply-btn .btn-sm {
  padding: 0.25rem 0.8rem !important;
}
</style>
