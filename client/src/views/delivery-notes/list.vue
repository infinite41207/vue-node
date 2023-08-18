<template>
  <Layout>
    <PageHeader :title="title" />
    <b-card>
      <b-row class="align-items-center m-1">
        <b-col>
          <b-row>
            <b-button id="add-btn" :disabled="readOnly" @click="addNewObject" class="btn-success" size="sm">
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
            <b-button variant="outline-secondary" class="ml-1" size="sm" :pressed="visibleFilters" @click="showHideFilters">
              <i class="ri-filter-line"></i>
            </b-button>
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
                <b-form-group horizontal :label-cols="3" :label="$t('table.warehouseSquare')" label-for="warehouse">
                  <f-select v-model="warehouse" select-btn open-btn value-type="warehouses" detail-view="warehouse-detail" placeholder="Wyszukaj miejsce..."></f-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.forwarder')" label-for="forwarder">
                  <f-select v-model="forwarder" select-btn open-btn value-type="vendorsAndCustomers" detail-view="forwarder-detail" placeholder="Wyszukaj spedytora..."></f-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.disposition')" label-for="disposition">
                  <f-select v-model="disposition" select-btn open-btn value-type="dispositions" detail-view="disposition" placeholder="Wyszukaj dyspozycje..." label="number">
                  </f-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.warehouseSection')" label-for="warehouseSection">
                  <f-select v-model="box" select-btn open-btn value-type="boxes" detail-view="box-detail" placeholder="Wyszukaj sektor magazynu..."></f-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.customer')" label-for="customer">
                  <f-select v-model="customer" select-btn open-btn value-type="vendorsAndCustomers" detail-view="customer-detail" placeholder="Wyszukaj odbiorce..."></f-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group :label-cols="3" :label="$t('table.scaleNetto')" label-for="scale-netto">
                  <f-select v-model="scaleNetto" select-btn open-btn value-type="scales" detail-view="scales-detail" placeholder="Wyszukaj wagi..."></f-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.ship')" label-for="ship">
                  <f-select v-model="ship" select-btn open-btn value-type="ships" detail-view="ship-detail" placeholder="Wyszukaj statek..."></f-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.vendor')" label-for="vendor">
                  <f-select
                    v-model="vendor"
                    select-btn
                    open-btn
                    value-type="vendorsAndCustomers"
                    detail-view="vendors-and-customers-detail"
                    placeholder="Wyszukaj dostawcę..."
                  ></f-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.schemeOfCargo')" label-for="filter-schemeOfCargoId">
                  <f-select v-model="schemeOfCargo" select-btn open-btn value-type="schemesOfCargo" detail-view="scheme-of-cargo" placeholder="Wyszukaj relację..."> </f-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.product')">
                  <f-select v-model="product" select-btn open-btn value-type="products" detail-view="assortment-detail" placeholder="Wyszukaj produkt..."></f-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group :label-cols="3" :label="$t('table.docType')" label-for="order_type">
                  <b-form-select id="order_type" v-model="typeOfDocument" :options="typesOfDocuments" text-field="name" value-field="value" name="orderTypeName" size="sm" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('common.vehicle')" label-for="vehicleId">
                  <f-select v-model="vehicle" select-btn open-btn value-type="vehicles" detail-view="vehicle-form" placeholder="Wyszukaj somohód/wagon..."> </f-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.position')" label-for="numer">
                  <f-select v-model="position" select-btn open-btn value-type="positions" detail-view="detail" placeholder="Wyszukaj pozycję..."> </f-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.typeOfOperation')" label-for="typeOfOperation">
                  <b-input-group>
                    <b-form-select id="order_status" v-model="typeOfOperation" :options="typesOfOperations" text-field="name" value-field="value" name="status" size="sm" />
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.driver')" label-for="driverId">
                  <f-select v-model="driver" select-btn open-btn value-type="drivers" detail-view="driver-form" placeholder="Wyszukaj kierowce..."> </f-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.mine')" label-for="mine">
                  <f-select v-model="mine" select-btn open-btn value-type="mines" detail-view="mine-detail" placeholder="Wyszukaj kopalnie..."> </f-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group :label-cols="3" :label="$t('table.status')" label-for="order-status">
                  <b-form-select id="order_status" v-model="state" :options="deliveryNoteStates" text-field="name" value-field="value" name="orderStatusName" size="sm" />
                </b-form-group>
              </b-col>
            </b-row>
          </b-collapse>
        </b-col>
      </b-row>

      <b-table
        striped
        responsive
        :items="listView.list"
        selectable
        select-mode="single"
        hover
        no-local-sorting
        :fields="fields"
        :tbody-tr-class="rowClass"
        :sort-by.sync="listView.sort.sortBy"
        :sort-desc.sync="listView.sort.sortDesc"
        @sort-changed="onSortingChanged"
      >
        <template v-slot:cell(date)="data">
          <template>
            <span class="ri-arrow-right-s-line mr-1 text-info" aria-hidden="true"></span>
          </template>
          <a href="javascript:void(0);" @click="editObject(data.item.id)"
            ><span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ data.item.date }}</span>
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

      <b-pagination v-model="currentPage" :total-rows="listView.total" :per-page="listView.limit" align="right" class="my-0"> </b-pagination>

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
    </b-card>
  </Layout>
</template>

<script>
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import DeliveryNote from '@/dto/DeliveryNote'
import { mapGetters, mapMutations } from 'vuex'
import { uuid } from 'vue-uuid'
import TypesOfDocuments from '@/constants/documentTypes'
import TypesOfOperations from '@/constants/operationTypes'
import DeliveryNoteStates from '@/constants/deliveryNoteStatuses'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/pl'
import _ from 'lodash'

export default {
  name: 'DeliveryNoteList',

  page: {
    title: 'List przewozowy',
  },

  components: {
    Layout,
    PageHeader,
    DatePicker,
  },

  data() {
    return {
      title: 'Listy przewozowe',
      fields: [
        { key: 'date', label: 'Data', sortable: true },
        { key: 'numberStr', label: 'Numer', sortable: true },
        { key: 'state', label: 'Status', sortable: true },
        { key: 'schemeOfCargo.name', label: 'Relacja', sortable: true },
        { key: 'trailer.name', label: 'Numer samochodu', sortable: true },
        { key: 'driver.name', label: 'Kierowca', sortable: true },
        { key: 'customer.name', label: 'Odbiorca', sortable: true },
        { key: 'typeOfOperation', label: 'Typ operacji', sortable: true },
        { key: 'product.name', label: 'Towar', sortable: true },
        { key: 'warehouse.name', label: 'Mazgazyn', sortable: true },
        { key: 'warehouse_num', label: 'Numer magazynu', sortable: true },
        { key: 'netto', label: 'Netto', sortable: true },
        { key: 'brutto', label: 'Brutto', sortable: true },
        { key: 'tare', label: 'Tara', sortable: true },
        { key: 'ship.name', label: 'Statek', sortable: true },
        { key: 'typeOfDocument', label: 'Typ dokumentu', sortable: true },
        { key: 'forwarder.name', label: 'Spedytor', sortable: true },
        { key: 'delete', label: '-' },
      ],
      perPage: 3,
      visibleFilters: false,
      items: [],
      schemesOfCargo: [],
      dateLang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: false,
      },
      options: [{ value: null, text: 'Manual option' }],
      questionAction: null,
      questionParams: null,
      questionMessage: '',
      showFilter: false,

      warehouses: [],
      customers: [],
      typesOfDocuments: [],
      typesOfOperations: [],
      deliveryNoteStates: [],
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      listView: `deliveryNotes/listView`,
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

    box: {
      get() {
        return this.listView.filters.box
      },
      set(value) {
        this.updateFilter({ box: value })
      },
    },

    forwarder: {
      get() {
        return this.listView.filters.forwarder
      },
      set(value) {
        this.updateFilter({ forwarder: value })
      },
    },

    deliveryOrder: {
      get() {
        return this.listView.filters.deliveryOrder
      },
      set(value) {
        this.updateFilter({ deliveryOrder: value })
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

    carrier: {
      get() {
        return this.listView.filters.carrier
      },
      set(value) {
        this.updateFilter({ carrier: value })
      },
    },

    mine: {
      get() {
        return this.listView.filters.mine
      },
      set(value) {
        this.updateFilter({ mine: value })
      },
    },

    product: {
      get() {
        return this.listView.filters.product
      },
      set(value) {
        this.updateFilter({ product: value })
      },
    },

    ship: {
      get() {
        return this.listView.filters.ship
      },
      set(value) {
        this.updateFilter({ ship: value })
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

    vendor: {
      get() {
        return this.listView.filters.vendor
      },
      set(value) {
        this.updateFilter({ vendor: value })
      },
    },

    warehouse: {
      get() {
        return this.listView.filters.warehouse
      },
      set(value) {
        this.updateFilter({ warehouse: value })
      },
    },

    position: {
      get() {
        return this.listView.filters.position
      },
      set(value) {
        this.updateFilter({ position: value })
      },
    },

    typeOfDocument: {
      get() {
        return this.listView.filters.typeOfDocument
      },
      set(value) {
        this.updateFilter({ typeOfDocument: value })
      },
    },

    state: {
      get() {
        return this.listView.filters.state
      },
      set(value) {
        this.updateFilter({ state: value })
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

    type: {
      get() {
        return this.listView.filters.type
      },
      set(value) {
        this.updateFilter({ type: value })
      },
    },

    disposition: {
      get() {
        return this.listView.filters.disposition
      },
      set(value) {
        this.updateFilter({ disposition: value })
      },
    },

    vehicle: {
      get() {
        return this.listView.filters.vehicle
      },
      set(value) {
        this.updateFilter({ vehicle: value })
      },
    },

    driver: {
      get() {
        return this.listView.filters.driver
      },
      set(value) {
        this.updateFilter({ driver: value })
      },
    },

    scaleBrutto: {
      get() {
        return this.listView.filters.scaleBrutto
      },
      set(value) {
        this.updateFilter({ scaleBrutto: value })
      },
    },

    scaleTare: {
      get() {
        return this.listView.filters.scaleTare
      },
      set(value) {
        this.updateFilter({ scaleTare: value })
      },
    },

    scaleNetto: {
      get() {
        return this.listView.filters.scaleNetto
      },
      set(value) {
        this.updateFilter({ scaleNetto: value })
      },
    },
  },

  async created() {
    await this.initialize()
    if (this.$route.params.scaleNetto) {
      this.scaleNetto = this.$route.params.scaleNetto
    }
  },

  methods: {
    ...mapMutations({
      addObjectView: `deliveryNotes/addObjectView`,
      setListViewProperty: `deliveryNotes/setListViewProperty`,
      setFilter: `deliveryNotes/setFilters`,
      setSort: `deliveryNotes/setSort`,
    }),

    async initialize() {
      this.typesOfDocuments = this.loadEnums(TypesOfDocuments)
      this.typesOfOperations = this.loadEnums(TypesOfOperations)
      this.deliveryNoteStates = this.loadEnums(DeliveryNoteStates)

      await this.updateList()
    },

    async onSortingChanged(ctx) {
      this.setSort({ sortBy: ctx.sortBy, sortDesc: ctx.sortDesc })
      this.updateList()
    },

    loadEnums(enumVar) {
      const finalList = []
      for (let i = 0; i < enumVar.length; i++) {
        finalList.push({ name: enumVar[i], value: enumVar[i] })
      }

      return finalList
    },

    async onSearchSchemeOfCargo(searchValue) {
      await this.updateSchemesOfCargo(searchValue)
      await this.updateList()
    },

    showHideFilters() {
      this.visibleFilters = !this.visibleFilters
    },

    openItemSubordination() {
      if (!this.selectedItem) {
        this.modalMessage = this.$t('common.msges.selectItemFirst')
        this.$bvModal.show('modal-message')
        return
      }

      this.subordinationShowMode = true
    },

    updateFilter(filter) {
      this.setFilter(filter)
      this.updateList()
    },

    showReport() {
      this.$router.push({ name: 'report-common-routes', params: { reportModule: 'reportCustomerRequestList' } })
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

      if (this.orderState) {
        filterStr.params.filter.state = this.orderState.id
      }

      if (this.forwarder) {
        filterStr.params.filter.forwarderId = this.forwarder.id
      }

      if (this.deliveryOrder) {
        filterStr.params.filter.orderId = this.deliveryOrder.id
      }

      if (this.recepient) {
        filterStr.params.filter.recepientId = this.recepient.id
      }

      if (this.box) {
        filterStr.params.filter.boxId = this.box.id
      }

      if (this.carrier) {
        filterStr.params.filter.carrierId = this.carrier.id
      }

      if (this.product) {
        filterStr.params.filter.productId = this.product.id
      }

      if (this.ship) {
        filterStr.params.filter.shipId = this.ship.id
      }

      if (this.customer) {
        filterStr.params.filter.customerId = this.customer.id
      }

      if (this.vendor) {
        filterStr.params.filter.vendorId = this.vendor.id
      }

      if (this.warehouse) {
        filterStr.params.filter.warehouseId = this.warehouse.id
      }

      if (this.position) {
        filterStr.params.filter.positionId = this.position.id
      }

      if (this.typeOfDocument) {
        filterStr.params.filter.typeOfDocument = this.typeOfDocument
      }

      if (this.state) {
        filterStr.params.filter.state = this.state
      }

      if (this.type) {
        filterStr.params.filter.type = this.type
      }

      if (this.disposition) {
        filterStr.params.filter.dispositionId = this.disposition.id
      }

      if (this.driver) {
        filterStr.params.filter.driverId = this.driver.id
      }

      if (this.typeOfOperation) {
        filterStr.params.filter.typeOfOperation = this.typeOfOperation
      }

      if (this.scaleNetto) {
        filterStr.params.filter.scaleNettoId = this.scaleNetto.id
      }

      if (this.scaleBrutto) {
        filterStr.params.filter.scaleBruttoId = this.scaleBrutto.id
      }

      if (this.scaleTare) {
        filterStr.params.filter.scaleTare = this.scaleTare.id
      }

      const response = await this.$store.dispatch(`deliveryNotes/findAll`, filterStr)
    },

    addNewObject() {
      const viewId = uuid.v4()
      const newObject = _.cloneDeep(DeliveryNote)
      newObject.id = viewId
      newObject.isNew = true

      this.addObjectView({ viewId, object: newObject })
      this.$router.push({ name: 'delivery-note-detail', params: { id: viewId } })
    },

    async deleteObject(object) {
      await this.$store.dispatch(`deliveryNotes/delete`, object)
      this.updateList()
    },

    async beforeDeleteItem(itemData) {
      this.questionMessage = 'Czy na pewno chcesz usunąć element z bazy danych?'

      this.questionAction = this.deleteItem
      this.questionParams = itemData

      this.$bvModal.show('modal-question')
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
        this.questionMessage = this.$t('order.msg.return')
      } else {
        this.questionMessage = this.$t('order.msg.delete')
      }

      this.questionAction = this.deleteRestoreItemEnd
      this.questionParams = itemData.id

      this.$bvModal.show('modal-question')
    },

    async deleteRestoreItemEnd(itemId) {
      await this.$store.dispatch('deliveryNotes/changeDeletionMark', {
        id: itemId,
      })

      this.updateList()
    },

    async deleteItem(deleteItem) {
      await this.$store.dispatch('deliveryNotes/delete', {
        id: deleteItem.id,
      })

      this.updateList()

      this.$bvModal.hide('modal-question')
    },

    toggleFilter() {
      this.showFilter = !this.showFilter
    },

    async editObject(objectId) {
      const response = await this.$store.dispatch(`deliveryNotes/findByPk`, {
        params: {
          id: objectId,
        },
      })
      if (response.status === 200) {
        this.$router.push({ name: 'delivery-note-detail', params: { id: objectId } })
      }
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },
  },
}
</script>

<style>
.btn-container {
  display: inline;
}

.short-input {
  max-width: 70%;
}

.chackbox-box {
  display: flex;
  align-items: center;
}

button {
  padding: 0;
  border: none;
  background: none;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
}

a:hover {
  cursor: pointer;
}
</style>
