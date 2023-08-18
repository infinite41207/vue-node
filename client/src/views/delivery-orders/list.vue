<template>
  <Layout>
    <PageHeader :title="title" />
    <b-card>
      <b-row class="align-items-center m-1">
        <b-col>
          <b-row>
            <b-button id="add-btn" class="btn-success" :disabled="readOnly" size="sm" @click="addNewObject">
              <i class="ri-file-add-line"></i>
              {{ $t('commands.add') }}
            </b-button>
            <b-button variant="outline-secondary" class="ml-1" size="sm">
              <i class="ri-history-line"></i>
              {{ $t('components.historyOfChanges') }}
            </b-button>
            <b-button variant="outline-secondary" class="ml-1" size="sm" @click="openItemSubordination">
              <i class="ri-node-tree"></i>
            </b-button>
            <b-button variant="outline-secondary" class="ml-1" size="sm" @click="showHideFilters">
              <i class="ri-filter-line"></i>
            </b-button>
            <b-dropdown variant="outline-secondary" :text="$t('commands.createFrom')" class="ml-1" size="sm">
              <b-dropdown-item @click="createDisposition">Dyspozycję</b-dropdown-item>
            </b-dropdown>
            <b-dropdown variant="outline-secondary" :text="$t('commands.print')" class="ml-1" size="sm">
              <b-dropdown-item>Zlecenie</b-dropdown-item>
            </b-dropdown>
            <b-button variant="outline-secondary" class="ml-1" size="sm">
              <i class="ri-file-add-line"></i>
              {{ $t('commands.setStatus') }}
            </b-button>
            <b-dropdown variant="outline-secondary" class="ml-1" :text="$t('commands.more')" size="sm">
              <b-dropdown-item @click="updateList"><i class="ri-refresh-line mr-1"></i> {{ $t('commands.update') }}</b-dropdown-item>
            </b-dropdown>
          </b-row>
        </b-col>
        <b-col cols="3">
          <b-form-input id="search-input" v-model="searchStr" type="search" autofocus size="sm" :placeholder="$t('common.search')"></b-form-input>
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
                <b-form-group horizontal :label-cols="3" :label="$t('table.schemeOfCargo')" label-for="filter-schemeOfCargoId">
                  <f-select
                    v-model="schemeOfCargo"
                    select-btn
                    open-btn
                    value-type="schemesOfCargo"
                    detail-view="scheme-of-cargo"
                    placeholder="Wyszukaj relację..."
                    @search="onSearchSchemeOfCargo"
                  >
                  </f-select>
                  <template v-slot:append>
                    <b-button id="customer-search" class="customer-search" size="sm" @click="openCustomerSearch">
                      <i class="ri-search-line"></i>
                    </b-button>
                  </template>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.counterparty')" label-for="filter-ownerId">
                  <f-select
                    v-model="counterparty"
                    select-btn
                    open-btn
                    value-type="counterparties"
                    detail-view="counterparties-detail"
                    placeholder="Wyszukaj właściciela..."
                  ></f-select>
                  <template v-slot:append>
                    <b-button id="customer-search" class="customer-search" size="sm" @click="openCustomerSearch">
                      <i class="ri-search-line"></i>
                    </b-button>
                  </template>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.typeOfOperation')" label-for="filter-ownerId">
                  <b-form-select
                    id="type_of_operation"
                    v-model="typeOfOperation"
                    :options="typesOfOperations"
                    text-field="name"
                    value-field="value"
                    name="type_of_operation"
                    size="sm"
                  />
                  <template v-slot:append>
                    <b-button id="customer-search" class="customer-search" size="sm" @click="openCustomerSearch">
                      <i class="ri-search-line"></i>
                    </b-button>
                  </template>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.state')" label-for="filter-ownerId">
                  <b-form-select id="order_status" v-model="orderState" :options="orderStates" text-field="name" value-field="value" name="status" size="sm" />
                  <template v-slot:append>
                    <b-button id="customer-search" class="customer-search" size="sm" @click="openCustomerSearch">
                      <i class="ri-search-line"></i>
                    </b-button>
                  </template>
                </b-form-group>
              </b-col>
            </b-row>
          </b-collapse>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-table
            ref="itemsList"
            hover
            striped
            responsive
            class="mb-2"
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
            <template v-slot:cell(date)="data">
              <template v-if="data.rowSelected">
                <span class="ri-check-line mr-1 text-info" aria-hidden="true"></span>
              </template>
              <template v-else>
                <span class="ri-arrow-right-s-line mr-1 text-info" aria-hidden="true"></span>
              </template>
              <a href="javascript:void(0);" @click="editObject(data.item.id)">
                <span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'"> {{ data.item.date }} </span>
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
      <b-pagination v-model="currentPage" :total-rows="listView.total" :per-page="listView.limit" align="right" class="my-0"></b-pagination>
    </b-card>

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

    <Subordination v-if="subordinationShowMode && selectedItem" :object-id="selectedItem.id" object-type="deliveryOrders" @subordination-closed="subordinationShowMode = false" />
  </Layout>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapMutations } from 'vuex'
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import DeliveryOrder from '@/dto/DeliveryOrder.json'
import { uuid } from 'vue-uuid'
import DatePicker from 'vue2-datepicker'
import TypesOfOperations from '@/constants/operationTypes'
import OrderStates from '@/constants/orderStates'
import Subordination from '@/components/common/subordination'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/pl'
import { fillByDeliveryOrder as serviceFillByDeliveryOrder } from '@/utils/disposition-service.js'

export default {
  name: 'DeliveryOrderList',
  page() {
    return {
      title: this.$t(`route.deliveryOrders`),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },
  components: {
    Layout,
    PageHeader,
    DatePicker,
    Subordination,
  },
  data() {
    return {
      title: this.$t(`route.deliveryOrders`),
      owners: [],
      schemesOfCargo: [],
      customStatesOfGoods: [],
      typesOfOperations: [],
      orderStates: [],
      dateLang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: false,
      },

      visibleFilters: false,
      fields: [
        { key: 'date', label: this.$t('table.date'), sortable: true },
        { key: 'numberStr', label: this.$t('table.number'), sortable: true },
        { key: 'schemeOfCargo.name', label: this.$t('table.schemeOfCargo'), sortable: true },
        { key: 'owner.name', label: this.$t('table.counterparty'), sortable: true },
        { key: 'product.name', label: this.$t('table.product'), sortable: true },
        { key: 'typeOfOperation', label: this.$t('table.typeOfOperation'), sortable: true },
        { key: 'warehouse.name', label: this.$t('table.warehouse'), sortable: true },
        { key: 'quantity', label: this.$t('table.quantity'), sortable: true },
        { key: 'ship.name', label: this.$t('table.ship'), sortable: true },
        { key: 'state', label: this.$t('table.state'), sortable: true },
        { key: 'delete', label: '-' },
      ],

      questionAction: null,
      questionParams: null,
      questionMessage: '',
      subordinationShowMode: false,
      namespace: this.$route.meta.store,
      detailPath: this.$route.meta.detailPath,
      readOnly: this.$route.meta.isReadOnly,
      currentItem: null,
      modalMessage: '',
    }
  },

  computed: {
    ...mapGetters({
      listView: `deliveryOrders/listView`,
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

    period: {
      get() {
        return this.listView.filters.period
      },
      set(value) {
        this.updateFilter({ period: value })
      },
    },

    schemeOfCargo: {
      get() {
        return this.listView.filters.schemeOfCargo
      },
      set(value) {
        this.updateFilter({ schemeOfCargo: value })
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

    typeOfOperation: {
      get() {
        return this.listView.filters.typeOfOperation
      },
      set(value) {
        this.updateFilter({ typeOfOperation: value })
      },
    },

    orderState: {
      get() {
        return this.listView.filters.orderState
      },
      set(value) {
        this.updateFilter({ orderState: value })
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
      addObjectView: `deliveryOrders/addObjectView`,
      addDispositionObjectView: 'dispositions/addObjectView',
      setListViewProperty: `deliveryOrders/setListViewProperty`,
      setFilter: `deliveryOrders/setFilters`,
      setSort: `deliveryOrders/setSort`,
    }),

    async initialize() {
      await this.updateList()

      this.typesOfOperations = this.loadEnums(TypesOfOperations)
      this.orderStates = this.loadEnums(OrderStates)
    },

    loadEnums(enumVar) {
      const finalList = []
      for (let i = 0; i < enumVar.length; i++) {
        finalList.push({ name: enumVar[i], value: enumVar[i] })
      }

      return finalList
    },

    showHideFilters() {
      this.visibleFilters = !this.visibleFilters
    },

    async onSearchSchemeOfCargo(searchValue) {
      await this.updateSchemesOfCargo(searchValue)
      await this.updateList()
    },

    async updateSchemesOfCargo(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: {},
          limit: 50,
        },
      }
      reqParams.params.filter.searchStr = searchStr

      const response = await this.$store.dispatch('schemesOfCargo/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.schemesOfCargo = []
      for (let i = 0; i < response.length; i++) {
        this.schemesOfCargo.push({ name: response[i].name, value: response[i].id })
      }
    },

    async onSearchOwner(searchValue) {
      await this.updateOwners(searchValue)
      await this.updateList()
    },

    async updateOwners(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: {},
          limit: 50,
        },
      }
      reqParams.params.filter.searchStr = searchStr

      const response = await this.$store.dispatch('counterparties/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.owners = []
      if (response.status === 200) {
        const owners = response.data
        for (let i = 0; i < owners.length; i++) {
          this.owners.push({ name: owners[i].name, value: owners[i].id })
        }
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
      await this.$store.dispatch('deliveryOrders/changeDeletionMark', {
        id: itemId,
      })

      this.updateList()
    },

    async onSortingChanged(ctx) {
      this.setSort({ sortBy: ctx.sortBy, sortDesc: ctx.sortDesc })
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

    createDisposition() {
      // if (!this.selectedItem) {
      //   this.$bvToast.toast('Wybierz zlecenie!', {
      //     title: this.$tc('common.msg'),
      //     variant: 'warning',
      //     solid: true,
      //     autoHideDelay: 2000,
      //   })
      //   return
      // }

      const newDisposition = serviceFillByDeliveryOrder(this, this.selectedItem, true)
      if (!newDisposition) return
      // const newDisposition = _.cloneDeep(Disposition)

      // newDisposition.id = uuid.v4()

      // const { id, number, numberStr, createAt, updateAt, date, quantity, comment, ...copyObject } = this.selectedItem

      // console.log('copyObject = ', copyObject)

      // Object.keys(copyObject).forEach((key) => {
      //   newDisposition[key] = copyObject[key]
      // })

      // newDisposition.date = new Date()
      // newDisposition.state = 'OnTheWay'
      // newDisposition.carsQueueStatus = 'OnTheWay'

      // newDisposition.scaleTwo = copyObject.scale
      // newDisposition.order = copyObject.id

      // if (newDisposition.productId) {
      //   this.$store
      //     .dispatch('products/findByPk', { noCommit: true, params: { id: newDisposition.productId } })
      //     .then((response) => {
      //       if (response.status === 200) {
      //         const product = response.data
      //         const notUsedProductCondition = product.notUsedProductCondition

      //         if (notUsedProductCondition === true) {
      //           newDisposition.productCondition = 'TOWAR WOLNY OD SALMONELI'
      //         }
      //       }
      //     })
      //     .catch((error) => {
      //       console.error(error)
      //     })
      // }

      // if (newDisposition.schemeOfCargoId) {
      //   this.$store
      //     .dispatch('schemesOfCargo/findByPk', { noCommit: true, params: { id: newDisposition.schemeOfCargoId } })
      //     .then((response) => {
      //       if (response.status === 200) {
      //         const schemeOfCargo = response.data

      //         if (!newDisposition.typeOfDocument) {
      //           newDisposition.typeOfDocument = schemeOfCargo.typeOfDocument
      //         }

      //         newDisposition.typeOfOperation = schemeOfCargo.typeOfOperation

      //         if (newDisposition.typeOfOperation === 'Receipt' || newDisposition.typeOfOperation === 'DirectVariantReceipt') {
      //           newDisposition.type = 'Unloading'
      //         } else {
      //           newDisposition.type = 'Loading'
      //         }
      //       }
      //     })
      //     .catch((error) => {
      //       console.error(error)
      //     })
      // }

      this.addDispositionObjectView({ viewId: newDisposition.id, object: newDisposition })
      this.$router.push({ name: 'disposition-form', params: { id: newDisposition.id } })
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

      if (this.period.length === 2 && this.period[0] !== null) {
        filterStr.params.filter.period = this.period
      }

      if (this.schemeOfCargo) {
        filterStr.params.filter.schemeOfCargoId = this.schemeOfCargo.id
      }

      if (this.counterparty) {
        filterStr.params.filter.counterpartyId = this.counterparty.id
      }

      if (this.typeOfOperation) {
        filterStr.params.filter.typeOfOperation = this.typeOfOperation
      }

      if (this.orderState) {
        filterStr.params.filter.state = this.orderState
      }

      await this.$store.dispatch(`deliveryOrders/findAll`, filterStr)
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

    addNewObject() {
      const viewId = uuid.v4()
      const newObject = _.cloneDeep(DeliveryOrder)
      newObject.id = viewId
      newObject.isNew = true

      this.addObjectView({ viewId, object: newObject })
      this.$router.push({ name: 'delivery-order-detail', params: { id: viewId } })
    },

    async editObject(objectId) {
      console.log('objectId = ', objectId)

      await this.$store
        .dispatch(`deliveryOrders/findByPk`, {
          params: {
            id: objectId,
          },
        })
        .then((response) => {
          console.log('response = ', response)
          if (response.status === 200) {
            this.$router.push({ name: 'delivery-order-detail', params: { id: objectId } })
          } else {
            this.$bvToast.toast(`${response.data.message}`, {
              title: this.$tc('common.msg'),
              variant: 'danger',
              solid: true,
              autoHideDelay: 2000,
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    openItemSubordination() {
      if (!this.selectedItem) {
        this.$bvToast.toast('Wybierz zlecenie!', {
          title: this.$tc('common.msg'),
          variant: 'warning',
          solid: true,
          autoHideDelay: 2000,
        })
        return
      }

      this.subordinationShowMode = true
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },
  },
}
</script>

<style>
</style>
