<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col>
        <b-card>
          <b-row class="mb-2">
            <b-col>
              <b-button-toolbar>
                <b-btn-group>
                  <b-button id="add-btn" :disabled="readOnly" variant="success" size="sm" @click="addNewItem">
                    <i class="ri-add-line"></i>
                    {{ $t('commands.add') }}
                  </b-button>
                  <b-button variant="outline-secondary" class="btn-sm ml-1" @click="copyItem">
                    <i class="ri-file-copy-line"></i>
                  </b-button>
                  <b-button variant="outline-secondary" class="btn-sm ml-4" @click="openHistory">
                    <i class="ri-history-line"></i>
                  </b-button>
                  <b-button variant="outline-secondary" class="btn-sm ml-1" @click="openItemTasks">
                    <i class="ri-file-text-fill"></i>
                    {{ $t('route.tasks') }}
                  </b-button>
                  <b-button variant="outline-secondary" class="btn-sm ml-1" @click="openItemSubordination">
                    <i class="ri-node-tree"></i>
                  </b-button>
                  <b-button variant="outline-secondary" class="btn-sm ml-1" @click="createTask">
                    <i class="ri-add-line"></i>
                    {{ $t('order.createTask') }}
                  </b-button>
                  <b-button variant="outline-secondary" class="ml-1" size="sm" @click="showHideFilters">
                    <i class="ri-filter-line"></i>
                  </b-button>
                  <b-dropdown id="dropdown-reports" variant="outline-secondary" size="sm" class="ml-1" :text="$t('route.reports')">
                    <b-dropdown-item-button @click="showReport">
                      <i class="ri-file-text-fill mr-1"></i>
                      {{ $t('reports.salesOrderRegister') }}
                    </b-dropdown-item-button>
                    <b-dropdown-item-button @click="showSaleReport"> <i class="ri-file-text-fill mr-1"></i>{{ $t('reports.salesAnalize') }} </b-dropdown-item-button>
                  </b-dropdown>
                </b-btn-group>
              </b-button-toolbar>
            </b-col>
            <b-col md="4">
              <b-form-group :label="$t('common.filter')" label-for="filter-input" label-cols-sm="2" size="sm">
                <b-form-input id="search-input" v-model="searchStr" type="search" autofocus :placeholder="$t('common.search')" size="sm"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
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
                    <b-form-group horizontal :label-cols="3" :label="$t('table.status')" label-for="request-status">
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
                          <b-form-checkbox v-model="multiplyStatus" variant="outline-secondary" size="sm" button class="multiply-btn">{{
                            multiplyStatus === true ? '+' : '-'
                          }}</b-form-checkbox>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group horizontal :label-cols="3" :label="$t('table.customer')" label-for="filter-customer">
                      <f-select v-model="customer" select-btn open-btn value-type="counterparties" detail-view="counterparties-detail" placeholder="Wyszukaj klienta..."></f-select>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-collapse>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                ref="orderList"
                hover
                responsive
                :items="listView.list"
                :fields="fields"
                selectable
                select-mode="single"
                class="mb-2"
                small
                no-local-sorting
                :sort-by.sync="listView.sort.sortBy"
                :sort-desc.sync="listView.sort.sortDesc"
                :per-page="listView.limit"
                :current-page="1"
                :tbody-tr-class="rowClass"
                @row-selected="onRowSelected"
                @sort-changed="onSortingChanged"
              >
                <template v-slot:table-colgroup="scope">
                  <col v-for="field in scope.fields" :key="field.key" :style="{ width: setColumnWidth(field.key) }" />
                </template>
                <template v-slot:cell(numberStr)="data">
                  <template v-if="data.rowSelected">
                    <span class="ri-check-line mr-1 text-info" aria-hidden="true"></span>
                  </template>
                  <template v-else>
                    <span class="ri-arrow-right-s-line mr-1 text-info" aria-hidden="true"></span>
                  </template>

                  <a href="javascript:void(0);" @click="editItem(data.item.id)"
                    ><span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ data.item.numberStr }}</span>
                  </a>
                  <template v-if="data.item.exchangeComplete">
                    <span class="ri-refresh-line ml-1 text-success" aria-hidden="true"></span>
                  </template>
                </template>
                <template v-slot:cell(status)="data">
                  <span class="badge badge-font" :class="getBadgeColor(data.item.status)">{{ data.item.status ? data.item.status.name : '' }}</span>
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
          <b-row>
            <b-col cols="1">
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
    <ChangesHistory v-if="historyShowMode && selectedItem" :object-id="selectedItem.id" object-name="order" @history-closed="historyViewEnd" />

    <OrderTasks v-if="tasksShowMode && selectedItem" :order-id="selectedItem.id" @tasks-closed="tasksViewEnd" />
    <Subordination v-if="subordinationShowMode && selectedItem" :object-id="selectedItem.id" object-type="orders" @subordination-closed="subordinationViewEnd" />
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations } from 'vuex'
import ChangesHistory from '@/components/object-versions/changes-history'
import OrderTasks from '@/components/order/order-tasks'
import Subordination from '@/components/common/subordination'
import Question from '@/components/common/question'
import ListLimits from '@/constants/listLimits'
import Message from '@/components/common/message'
import SalesOrder from '@/dto/SalesOrder.json'
import CustomerData from '@/dto/Customer.json'
import _ from 'lodash'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/pl'
import { uuid } from 'vue-uuid'

export default {
  name: 'SalesOrdersList',

  components: {
    Layout,
    PageHeader,
    ChangesHistory,
    OrderTasks,
    Question,
    Message,
    DatePicker,
    Subordination,
  },

  page() {
    return {
      title: this.title,
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },

  data() {
    return {
      title: this.$t('order.title'),
      fields: [
        { key: 'numberStr', label: this.$t('table.number'), sortable: true },
        { key: 'customer.name', label: this.$t('table.customer'), sortable: true },
        { key: 'customer.abbreviation', label: this.$t('table.abbreviation'), sortable: true },
        { key: 'reference', label: this.$t('table.reference'), sortable: true },
        { key: 'createdAt', label: this.$t('table.createdAt'), sortable: true },
        {
          key: 'deliveryDate',
          label: this.$t('table.deliveryDate'),
          formatter: (value) => {
            return !value ? '-' : value
          },
        },
        {
          key: 'status',
          label: this.$t('table.status'),
        },
        { key: 'author.name', label: this.$t('table.author'), sortable: true },
        { key: 'sumBrutto', label: this.$t('table.sum') },
        { key: 'currencyStr', label: this.$t('table.currency') },
        { key: 'delete', label: '-' },
      ],
      listLimits: _.cloneDeep(ListLimits),
      dateLang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: false,
      },
      questionAction: null,
      questionParams: null,
      questionMessage: '',
      modalMessage: '',
      historyShowMode: false,
      subordinationShowMode: false,
      tasksShowMode: false,
      selectedItem: null,
      visibleFilters: false,
      statusList: [],
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      listView: 'orders/listView',
      customerList: 'counterparties/customerList',
      currentLanguage: 'auth/currentLanguage',
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

    period: {
      get() {
        return this.listView.filters.period
      },
      set(value) {
        this.updateFilter({ period: value })
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
          if (!Array.isArray(this.status) && this.status !== null) {
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

    customer: {
      get() {
        return this.listView.filters.customer
      },
      set(value) {
        this.updateFilter({ customer: value })
      },
    },
  },

  watch: {
    'listView.list'(newVal, oldVal) {
      this.$refs.orderList.refresh()
    },
  },

  async mounted() {
    await this.initialize()
    await this.updateList()
  },

  methods: {
    ...mapMutations({
      setListViewProperty: 'orders/setListViewProperty',
      addObjectView: 'orders/addObjectView',
      setFilter: 'orders/setFilters',
      setSort: 'orders/setSort',
      setOpenTask: 'tasks/setOpenTask',
      setTaskProperties: 'tasks/setTaskProperties',
      setTaskParentView: 'tasks/setParentView',
    }),

    async initialize() {
      this.initStatuses()
      //this.initCustomers()
    },

    async onSortingChanged(ctx) {
      this.setSort({ sortBy: ctx.sortBy, sortDesc: ctx.sortDesc })
      this.updateList()
    },

    async updateList() {
      const filterStr = {
        params: {
          filter: {},
          pagination: { page: this.currentPage, limit: this.listView.limit },
          sort: { sortBy: this.listView.sort.sortBy, sortDesc: this.listView.sort.sortDesc },
          lang: this.currentLanguage.code,
        },
      }

      if (this.period.length === 2 && this.period[0] !== null) {
        filterStr.params.filter.period = this.period
      }

      if (this.customer) {
        filterStr.params.filter.customerId = this.customer
      }

      if (this.status) {
        filterStr.params.filter.statusId = this.status
      }

      if (this.searchStr) {
        filterStr.params.filter.searchStr = this.searchStr
      }

      await this.$store.dispatch('orders/findAll', filterStr)
    },

    setColumnWidth(key) {
      if (key === 'customer.name') {
        return '20%'
      } else if (key === 'numberStr') {
        return '10%'
      } else {
        return ''
      }
    },

    getBadgeColor(status) {
      let color = 'light'
      if (status) {
        if (status.color && status.color.length > 0) {
          color = status.color
        }
      }
      return `badge-${color}`
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
      if (item.incompliteParams) return 'table-warning text-warning'
    },

    addNewItem() {
      const viewId = uuid.v4()

      const salesOrder = _.cloneDeep(SalesOrder)
      salesOrder.id = viewId
      salesOrder.isNew = true

      this.addObjectView({
        viewId,
        object: salesOrder,
        customerData: _.cloneDeep(CustomerData),
        currentProduct: null,
        viewMode: 'order_modification',
        initCalcPrices: false,
        referenceDouble: false,
        tabIndex: 0,
      })

      this.$router.push({ name: 'sales-order-detail', params: { id: viewId } })
    },

    async copyItem() {
      if (this.selectedItem) {
        await this.$store
          .dispatch('orders/findByPk', {
            params: {
              id: this.selectedItem.id,
            },
            noCommit: true,
          })
          .then((response) => {
            if (response.status === 200) {
              const viewId = uuid.v4()

              const newObject = response.data

              newObject.id = viewId
              newObject.number = null
              newObject.numberStr = null
              newObject.comment = ''
              newObject.author = { name: '' }
              newObject.authorId = null
              newObject.reference = ''
              delete newObject.createdAt
              delete newObject.updatedAt

              for (const productRow of newObject.products) {
                delete productRow.id
                for (const proceRow of productRow.prices) {
                  delete proceRow.id
                }
              }

              this.addObjectView({
                viewId,
                object: newObject,
                customerData: _.cloneDeep(CustomerData),
                currentProduct: null,
                viewMode: 'order_modification',
                initCalcPrices: false,
                tabIndex: 0,
              })

              this.$router.push({ name: 'sales-order-detail', params: { id: viewId } })
            }
          })
      }
    },

    async editItem(itemId) {
      const response = await this.$store.dispatch('orders/findByPk', {
        params: {
          id: itemId,
        },
      })
      if (response.status === 200) {
        this.$router.push({ name: 'sales-order-detail', params: { id: itemId } })
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
      await this.$store.dispatch('orders/changeDeletionMark', {
        id: itemId,
      })

      this.updateList()
    },

    updateFilter(filter) {
      this.setFilter(filter)
      this.updateList()
    },

    onRowSelected(items) {
      if (items.length === 1) {
        this.selectedItem = { ...items[0] }
      } else {
        this.selectedItem = null
      }
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

    createTask() {
      if (!this.selectedItem) {
        this.modalMessage = this.$t('order.msg.selectOrderFirst')
        this.$bvModal.show('modal-message')
        return
      }

      this.setOpenTask(null)

      this.setTaskProperties({
        orderId: this.selectedItem.id,
        ownerType: 'Order',
        ownerId: this.selectedItem.id,
        subjectString: this.$t('order.presentation', [this.selectedItem.number, this.selectedItem.createdAt]),
        customerId: this.selectedItem.customer.id,
      })

      this.setTaskParentView('sales/sales-orders')

      this.$router.push({ name: 'task-detail' })
    },

    openHistory() {
      if (!this.selectedItem) {
        this.modalMessage = this.$t('order.msg.selectOrderFirst')
        this.$bvModal.show('modal-message')
        return
      }

      this.historyShowMode = true
    },

    historyViewEnd() {
      this.historyShowMode = false
    },

    openItemTasks() {
      if (!this.selectedItem) {
        this.modalMessage = this.$t('order.msg.selectOrderFirst')
        this.$bvModal.show('modal-message')
        return
      }

      this.tasksShowMode = true
    },

    openItemSubordination() {
      if (!this.selectedItem) {
        this.modalMessage = this.$t('order.msg.selectOrderFirst')
        this.$bvModal.show('modal-message')
        return
      }

      this.subordinationShowMode = true
    },

    showHideFilters() {
      this.visibleFilters = !this.visibleFilters
    },

    tasksViewEnd() {
      this.tasksShowMode = false
    },

    subordinationViewEnd() {
      this.subordinationShowMode = false
    },

    async initStatuses() {
      const inputParams = {
        params: {
          filter: {},
          lang: this.currentLanguage.code,
        },
        noCommit: true,
      }

      await this.$store
        .dispatch('salesOrderStatuses/findAll', inputParams)
        .then((response) => {
          if (response && response.status === 200) {
            this.statusList = response.data
          } else {
            this.statusList = []
          }
        })
        .catch((err) => {
          console.error(err)
          this.statusList = []
        })
    },

    async initCustomers() {
      if (this.customerList.length === 0) {
        await this.$store.dispatch('counterparties/findAll', {})
      }
    },

    showReport() {
      this.$router.push({ name: 'order-list', params: { reportType: 'orderList' } })
    },

    showSaleReport() {
      this.$router.push({ name: 'reportCommonRoutes', params: { reportModule: 'reportEnovaSalesList' } })
    },
  },
}
</script>

<style></style>
