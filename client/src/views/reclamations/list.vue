<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col>
        <b-card>
          <b-row class="mb-2">
            <!-- <div>
              <a href="javascript:void(0);" class="btn btn-success ml-3 mb-3" @click="addNewObject"> <i class="ri-add-line"></i> Dodaj reklamację </a>
              <b-button class="ml-2 mb-3" @click="showHideFilters">
                <i class="ri-filter-line"></i>
              </b-button>
            </div> -->

            <b-col>
              <ToolBar :items="toolBar" />

              <!-- <b-button v-for="statusEl of this.statusList" :key="statusEl.id" :variant="filterVariant(statusEl.id)" class="ml-1" @click="status = statusEl.id">
                {{ statusEl.description }}
              </b-button> -->
            </b-col>
            <b-col md="3">
              <b-input-group>
                <b-form-input id="search-input" v-model="searchStr" type="search" autofocus size="sm" :placeholder="$t('common.search')"></b-form-input>
              </b-input-group>
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
                    <b-form-group horizontal :label-cols="3" :label="$t('table.customer')" label-for="customer">
                      <f-select v-model="customer" select-btn open-btn value-type="counterparties" detail-view="counterparty-detail" placeholder="Wyszukaj klienta..."></f-select>
                    </b-form-group>
                  </b-col>
                  <div v-if="permissionRestrictView === true">
                    <h5 class="mt-1 ml-2 mr-2"> Wykonawca: {{ executorObj.name }}</h5>
                  </div>
                </b-row>
                <b-row v-if="permissionRestrictView === false">
                  <b-col>
                    <b-form-group horizontal :label-cols="3" :label="$t('table.responsible')" label-for="responsible">
                      <f-select v-model="responsible" select-btn open-btn value-type="users" detail-view="user-detail" placeholder="Wyszukaj konstruktora..."></f-select>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group horizontal :label-cols="3" :label="$t('table.manager')" label-for="manager">
                      <f-select v-model="manager" select-btn open-btn value-type="users" detail-view="user-detail" placeholder="Wyszukaj handlowca..."></f-select>
                    </b-form-group>

                  </b-col>
                  <b-col>
                    <b-form-group horizontal :label-cols="3" :label="$t('table.executor')" label-for="executor">
                      <f-select v-model="executor" select-btn open-btn value-type="users" detail-view="user-detail" placeholder="Wyszukaj wykonawcy..."></f-select>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-collapse>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <b-table
                ref="reclamationsList"
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
                @sort-changed="onSortingChanged"
              >
                <template v-slot:cell(number)="data">
                  <b-dropdown
                    split
                    size="sm"
                    v-if="data.item.hasTasks !== 1 && data.item.hasTasks !== 2"
                    split-variant="outline-secondary"
                    variant="secondary"
                    @click="viewReclamation(data.item.id)"
                    :text="data.item.number"
                  >
                    <b-dropdown-item href="javascript:void(0);" @click="editObject(data.item.id)">Edytuj</b-dropdown-item>
                    <b-dropdown-item href="javascript:void(0);" @click="showReclamationTasks(data.item)">Pokaż zadania</b-dropdown-item>
                  </b-dropdown>

                  <b-dropdown
                    split
                    size="sm"
                    v-if="data.item.hasTasks === 2"
                    split-variant="info"
                    variant="secondary"
                    @click="viewReclamation(data.item.id)"
                    :text="data.item.number"
                  >
                    <b-dropdown-item href="javascript:void(0);" @click="editObject(data.item.id)">Edytuj</b-dropdown-item>
                    <b-dropdown-item href="javascript:void(0);" @click="showReclamationTasks(data.item)">Pokaż zadania</b-dropdown-item>
                  </b-dropdown>

                  <b-dropdown
                    split
                    size="sm"
                    v-if="data.item.hasTasks === 1"
                    split-variant="success"
                    variant="secondary"
                    @click="viewReclamation(data.item.id)"
                    :text="data.item.number"
                  >
                    <b-dropdown-item href="javascript:void(0);" @click="editObject(data.item.id)">Edytuj</b-dropdown-item>
                    <b-dropdown-item href="javascript:void(0);" @click="showReclamationTasks(data.item)">Pokaż zadania</b-dropdown-item>
                  </b-dropdown>
                </template>

                <template v-slot:cell(possitionsDescription)="data">
                  <a v-if="data.item.possitionsDescription" href="javascript:void(0);" class="btn btn-light" @click="showReclamationPossitions(data.item)"
                    >{{ data.item.possitionsDescription }}
                  </a>
                </template>
                <template v-slot:cell(docType)="data">
                  <p>{{ getElDescription(data.item.docType) }}</p>
                </template>
                <template v-slot:cell(clientName)="data">
                  <p>{{ getClientDescription(data.item) }}</p>
                </template>
                <template v-slot:cell(execution_type)="data">
                  <p>{{ getElDescription(data.item._execution_type) }}</p>
                </template>
                <template v-slot:cell(decision)="data">
                  <p>{{ getElDescription(data.item._decision) }}</p>
                </template>
                <template v-slot:cell(customer)="data">
                  <p>{{ data.item.clientName + ' ' + data.item.clientSurname }}</p>
                </template>
                <template v-slot:cell(reclamationReason)="data">
                  <p>{{ getElDescription(data.item._reclamationReason, 'description') }}</p>
                </template>

                <template v-slot:cell(executor)="data">
                  <p>{{ getElDescription(data.item._executor, 'name') }}</p>
                </template>
                <template v-slot:cell(status)="data">
                  <p>
                    <b-badge :variant="getBadgeColor(data.item._status)">{{ getElDescription(data.item._status) }}</b-badge></p
                  >
                </template>
                <template v-slot:cell(recstatusDate)="data">
                  <p>{{ getFormatedDate(data.item.recstatusDate) }}</p>
                </template>
                <template v-slot:cell(inputDate)="data">
                  <p>{{ getFormatedDate(data.item.inputDate) }}</p>
                </template>
                <template v-slot:cell(executionTerm)="data">
                  <p>
                    <b-badge :variant="getExecutionTermColor(data.item)">{{ getFormatedDate(data.item.executionTerm) }}</b-badge>
                  </p>
                </template>
                <template v-slot:cell(executionDate)="data">
                  <p>
                    <b-badge :variant="'light'">{{ getFormatedDate(data.item.executionDate) }}</b-badge>
                  </p>
                </template>
                <template v-slot:cell(deliveryTerm)="data">
                  <p>
                    <b-badge :variant="getDeliveryDateColor(data.item)">{{ getFormatedDate(data.item.deliveryTerm) }}</b-badge>
                  </p>
                </template>
                <template v-slot:cell(guarantyCard)="data">
                  <p>{{ getBooleanPresentation(data.item.guarantyCard) }}</p>
                </template>
                <template v-slot:cell(delete)="data">
                  <a
                    href="javascript:void(0);"
                    :class="data.item.markedToDelete ? 'ri-arrow-up-circle-fill text-primary' : 'ri-delete-bin-7-fill text-danger'"
                    @click="beforeDeleteItem(data.item)"
                  >
                  </a>
                </template>
                <template v-slot:cell(daysFromInput)="data">
                  <p>{{ parseInt((new Date() - new Date(data.item.inputDate)) / 3600000 / 24) }}</p>
                </template>
                <template v-slot:cell(execution)="data">
                  <p>{{ getElDescription(data.item._execution_type, 'description') }}</p>
                </template>
                <template v-slot:cell(statusChange)="data">
                  <p>{{ getFormatedDate(data.item.recstatusDate) }}</p>
                </template>
                <template v-slot:cell(type)="data">
                  <p>{{ getElDescription(data.item.docType, 'description') }}</p>
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

    <!-- modal question -->
    <b-modal id="modal-question" title="Uwaga!">
      <p class="my-4">{{ questionMessage }}</p>
      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button-toolbar class="float-right">
            <b-button variant="danger" size="sm" class="mr-2" @click="onCancelModalQuestion"> Anuluj </b-button>

            <b-button variant="success" size="sm" @click="onOkModalQuestion"> OK </b-button>
          </b-button-toolbar>
        </div>
      </template>
    </b-modal>

    <b-modal id="modal-possitions" v-model="showPossitionsForm" hide-footer size="xl" title="Pozycje zlecenia reklamacyjnego">
      <Possitions :view-id="currentRec"></Possitions>
    </b-modal>

    <SearchUser v-if="responsibleSearchMode" :return-name="true" @user-selected="responsibleSelectedEnd" />
    <SearchUser v-if="executorSearchMode" :return-name="true" @user-selected="executorSelectedEnd" />
    <SearchManager v-if="managerSearchMode" :return-name="true" @manager-selected="managerSelectedEnd" />

    <b-modal id="modal-tasks" v-model="showTasksForm" hide-footer size="lg" title="Zadania powiązane z reklamacją">
      <RecentActivity :activity-data="openReclamation.tasks" />
    </b-modal>
  </Layout>
</template>

<script>
import moment from 'moment'
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import Reclamation from '@/dto/Reclamation.json'
import ToolBar from '@/components/tool-bar'

import { mapGetters, mapMutations } from 'vuex'
import { uuid } from 'vue-uuid'
import Possitions from './form_components/possitions.vue'
import RecentActivity from '@/components/widgets/recent-activity-list'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/pl'
import SearchUser from '@/components/order/search-user'
import SearchManager from '@/components/order/search-manager'
import _ from 'lodash'

export default {
  name: 'ReclamationsList',

  page: {
    title: 'Reklamacje',
    meta: [{ name: 'description', content: appConfig.description }],
  },

  components: {
    Layout,
    ToolBar,
    PageHeader,
    Possitions,
    RecentActivity,
    DatePicker,
    SearchUser,
    SearchManager,
  },

  data() {
    return {
      title: 'Reklamacje',
      showItemForm: false,
      // statusFilterItems: [],
      filterStatusGorupId: 0,
      currentRec: '',
      showPossitionsForm: false,

      currentTab: 0,
      showTasksForm: false,

      perPage: 25,
      // currentPage: 1,
      itemsData: [],
      totalRows: 1,
      fields: [
        { key: 'number', label: 'Numer', sortable: true },
        { key: 'inputDate', label: 'Data przyjęcia', sortable: true },
        { key: 'daysFromInput', label: 'Dni od przyjęcia', sortable: true },
        { key: 'executionTerm', label: 'Termin realizacji', sortable: true },
        { key: 'execution', label: 'Realizacja', sortable: true },
        // { key: 'deliveryTerm', label: 'Data wysyłki', sortable: true },
        // { key: 'executionDate', label: 'Data zamknięcia', sortable: true },
        // { key: 'deliveryTerm', label: 'Oczekiwania', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'statusChange', label: 'Zmiana statusu', sortable: true },
        { key: 'type', label: 'Typ', sortable: true },
        // { key: 'docType', label: 'Typ', sortable: true },
        { key: 'customer', label: 'Klient', sortable: true },
        // { key: 'email', label: 'Email', sortable: true },
        { key: 'salesOrder', label: 'Umowa', sortable: true },
        // { key: 'salesRequest', label: 'Oferta', sortable: true },
        // { key: 'salesReference', label: 'Referencja', sortable: true },
        // { key: 'docGroup', label: 'Grupa' , sortable: true },
        { key: 'possitionsDescription', label: 'Przedmiot', sortable: true },
        // { key: 'client', label: 'Klient' , sortable: true },
        // { key: 'item', label: 'Przedmiot' , sortable: true },
        // { key: 'execution_type', label: 'Realizacja', sortable: true },
        { key: 'reclamationReason', label: 'Powód', sortable: true },
        { key: 'decision', label: 'Decyzja', sortable: true },
        // { key: 'productionOrderDescription', label: 'Zlec. prod.', sortable: true },
        // { key: 'responsible', label: 'Wykonawca', sortable: true },
        // { key: 'executor', label: 'Wykonawca', sortable: true },
        // { key: 'executionDays', label: 'Dni', sortable: true },
        // { key: 'recstatusDate', label: 'Zmiana statusu', sortable: true },
        // { key: 'status_change', label: 'Zmiana statusu' , sortable: true },
        // { key: 'guarantyCard', label: 'Karta', sortable: true },
      ],
      visibleFilters: false,
      dateLang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: false,
      },

      filter: null,
      filterOn: [],
      questionAction: null,
      questionParams: null,
      questionMessage: '',
      customerList: [],
      customerSearchMode: false,
      responsibleList: [],
      responsibleSearchMode: false,
      managerList: [],
      managerSearchMode: false,
      executorList: [],
      executorSearchMode: false,

      executorObj: { id: null, name: '' },
      userSettingItemKey: 'reclamationsRestrictViewList',
      permissionRestrictView: false,
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      listView: 'reclamations/listView',
      filters: 'reclamations/listFilters',
      openReclamation: 'reclamations/openReclamation',
      users: 'users/getUsers',
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

    toolBar: {
      get() {
        return this.listView.toolBar
      },
      set(value) {
        this.setListViewProperty({ toolBar: value })
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

    responsible: {
      get() {
        return this.listView.filters.responsible
      },
      set(value) {
        this.updateFilter({ responsible: value })
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
  },

  watch: {
    reclamations(newVal, oldVal) {
      this.$refs.reclamationsList.refresh()
    },
  },

  async created() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      setOpenReclamation: 'reclamations/setOpenReclamation',
      setNewDocumentMode: 'reclamations/setNewDocumentMode',
      setPossitionsEditionMode: 'reclamations/setPossitionsEditionMode',

      addObjectView: `reclamations/addObjectView`,
      setListViewProperty: 'reclamations/setListViewProperty',
      setFilter: 'reclamations/setFilters',
      setSort: 'reclamations/setSort',
    }),

    filterVariant(id) {
      if (this.status === id) {
        return 'primary'
      }
      return 'outline-secondary'
    },

    async addNewObject() {
      const viewId = uuid.v4()
      const object = _.cloneDeep(Reclamation)
      object.inputDate = new Date()
      object.executionTerm = new Date(Date.parse(object.inputDate) + 1209600000)

      const statuses = await this.$store.dispatch('reclamationStatuses/findAll', { noCommit: true })
      for(let i = 0; i < statuses.length; i++) {
        if(statuses[i].description === 'Nowe zlecenie') {
          object._status = statuses[i]
          object.statusId = statuses[i].id
          console.log('Object', object)
        }
      }

      this.addObjectView({ viewId, object: object })
      this.$router.push({ name: 'reclamation-detail', params: { id: viewId } })
    },

    getClientDescription(el) {
      return el.clientName + ' ' + el.clientSurname + String.fromCharCode(9, 10) + el.telephone
    },

    getElDescription(el, fieldName = 'description') {
      if (el) {
        return el[fieldName]
      } else return 'Nie określono'
    },

    addDays(date, days) {
      var result = new Date(date)
      result.setDate(result.getDate() + days)
      return result
    },

    getExecutionTermColor(item) {
      let color = 'light'
      const currentDate = new Date()
      const executionDate = new Date(item.executionTerm)
      if (!item.executionDate) {
        if (executionDate < currentDate) {
          color = 'danger'
        } else if (this.addDays(executionDate, -4) <= currentDate) {
          color = 'warning'
        }
        if (item.executionDate !== null) {
          color = 'success'
        }
      }
      return color
    },

    getDeliveryDateColor(item) {
      let color = 'light'
      const currentDate = new Date()
      const deliveryDate = new Date(item.deliveryTerm)

      if (!item.executionDate) {
        if (item.deliveryTerm === null) {
          color = 'danger'
        } else if (deliveryDate < currentDate) {
          color = 'danger'
        } else if (this.addDays(deliveryDate, -4) <= currentDate) {
          color = 'warning'
        }

        // RG do poprawy w przyszłości
        if (item.deliveryStatus === 'Wysłane' || item.status === 18 || item.status === 21 || item.status === 23) {
          color = 'success'
        }
      }

      return color
    },

    getBadgeColor(status) {
      let color = 'light'
      if (status && status.color) {
        if (status.color.length > 0) {
          color = status.color
        }
      }
      return color
    },

    getFormatedDate(curDate) {
      let resDate
      if (curDate === null) {
        resDate = 'Brak'
      } else {
        resDate = moment(curDate).format('DD.MM.YYYY')
      }
      return resDate
    },

    getBooleanPresentation(curValue) {
      if (curValue === true) {
        return 'TAK'
      } else return 'NIE'
    },

    async setCurrentTab(tabNumber) {
      this.currentTab = tabNumber
      await this.initialize()
    },

    showHideFilters() {
      this.visibleFilters = !this.visibleFilters
    },

    newItem() {
      return {
        id: null,
        name: '',
        postCode: '',
        city: '',
        address: '',
        email: '',
        telephon: '',
      }
    },

    async initializeToolBar() {

      const statusFilterItems = []
      statusFilterItems.push(
        {
          title: 'Dodaj reklamację',
          icon: 'ri-add-line',
          variant: 'primary',
          size: 'sm',
          click: this.addNewObject,
        }
      ); 
      statusFilterItems.push(
        {
          icon: 'ri-filter-line',
          variant: 'outline-secondary',
          size: 'sm',
          click: this.showHideFilters
        }
      ); 

      // const statusList = await this.$store.dispatch('reclamationStatusGroups/findAll', {})
      // const countResponse = await this.$store.dispatch('reclamationStatusGroups/countAll', {})
      // const statusCount = countResponse.data

      // let sum = 0
      // for (let i = 0; i < statusList.length; i++) {
      //   if (statusList[i].description === 'Otwarte') {
      //     this.status = statusList[i].id
      //   }

      //   for (let j = 0; j < statusCount.length; j++) {
      //     if (statusCount[j].id === statusList[i].id) {
      //       statusFilterItems.push(
      //         {
      //           title: statusList[i].description + ' (' + statusCount[j].count + ')',
      //           // icon: 'ri-check-line',
      //           variant: this.filterVariant(statusList[i].id),
      //           size: 'sm',
      //           "click":  function() { 
      //             return console.log('test message');
      //             // this.setFilterStatus(statusList[i].id) 
      //           },
      //         }
      //       ); 
      //       sum += statusCount[j].count
      //     }
      //   }
      // }      
      this.setListViewProperty({ toolBar: statusFilterItems })

    },

    async initialize() {
      
      this.initializeToolBar();

      const authUser = await this.$store.state.auth.currentUser
      this.executorObj.id = authUser.id
      this.executorObj.name = authUser.name

      await this.$store
        .dispatch('userSettings/findByPk', {
          params: {
            userId: this.executorObj.id,
            userSettingItemKey: this.userSettingItemKey,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const checkPermission = response.data
            if (checkPermission === true) {
              this.permissionRestrictEdit = true
            }
          }
        })
        .catch((error) => {
          console.warn(error)
        })

      await this.updateList()
    },

    async onSortingChanged(ctx) {
      this.setSort({ sortBy: ctx.sortBy, sortDesc: ctx.sortDesc })
      this.updateList()
    },

    async updateList() {
      const filterStr = {
        params: {
          filter: {},
          statusgroupfilter: {},
          pagination: { page: this.currentPage, limit: this.listView.limit },
          sort: { sortBy: this.listView.sort.sortBy, sortDesc: this.listView.sort.sortDesc },
        },
      }

      if (this.period.length === 2 && this.period[0] !== null) {
        filterStr.params.filter.period = this.period
      }

      if (this.customer) {
        filterStr.params.filter.customerId = this.customer.id
      }

      if (this.status) {
        filterStr.params.statusgroupfilter.statusgroupid = this.status
      }

      if (this.responsible) {
        filterStr.params.filter.responsibleId = this.responsible.id
      }

      if (this.executor) {
        filterStr.params.filter.executorId = this.executor.id
      }

      if (this.manager) {
        filterStr.params.filter.managerId = this.manager.id
      }

      if (this.searchStr) {
        filterStr.params.filter.searchStr = this.searchStr
      }

      if (this.permissionRestrictView === true) {
        filterStr.params.filter.executor = this.executorObj.id
      }

      await this.$store.dispatch('reclamations/findAllReclamations', filterStr)
    },
    setFilterStatus(id) {
      this.status = id
    },

    updateFilter(filter) {
      this.setFilter(filter)
      this.updateList()
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },

    // onFiltered(filteredItems) {
    //   this.totalRows = filteredItems.length
    //   // this.currentPage = 1
    // },

    async showReclamationPossitions(reclamationData) {
      await this.$store.dispatch('reclamations/findByPk', {
        params: {
          id: reclamationData.id,
        },
      })

      this.currentRec = reclamationData.id
      this.showPossitionsForm = true
    },

    async editObject(objectId) {
      const response = await this.$store.dispatch('reclamations/findByPk', {
        params: {
          id: objectId,
        },
      })
      if (response.status === 200) {
        this.$router.push({ name: 'reclamation-detail', params: { id: objectId } })
      }
    },

    async viewReclamation(objectId) {
      // this.setNewDocumentMode(false)
      const dataObject = await this.$store.dispatch('reclamations/findByPk', {
        params: {
          id: objectId,
        },
      })

      if (dataObject) {
        // this.setPossitionsEditionMode(true)
        this.$router.push({ name: 'reclamationviewform', params: { id: objectId } })
      }
    },

    async showReclamationTasks(reclamationData) {
      this.setNewDocumentMode(false)
      const dataObject = await this.$store.dispatch('reclamations/findByPk', {
        params: {
          id: reclamationData.id,
        },
      })
      if (dataObject) {
        this.showTasksForm = true
      }
    },

    async beforeDeleteItem(itemData) {
      if (this.readOnly === true) {
        return
      }
      this.questionMessage = 'Czy na pewno chcesz usunąć element z bazy danych?'

      this.questionAction = this.deleteItem
      this.questionParams = itemData

      this.$bvModal.show('modal-question')
    },

    async deleteItem(deleteItem) {
      await this.$store.dispatch('reclamations/deleteItem', deleteItem)

      this.initialize()

      this.questionAction = null
      this.questionParams = null
      this.questionMessage = ''
      this.$refs.itemsList.refresh()

      this.$bvModal.hide('modal-question')
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

    showReport() {
      this.$router.push({ name: 'report-common-routes', params: { reportType: 'reportReclamationList' } })
    },
  },
}
</script>

<style></style>
