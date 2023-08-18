  <template>
  <Layout>
    <PageHeader :title="title" />
    <b-card>
      <b-row class="align-items-center m-1">
        <b-col>
          <b-row>
            <b-button @click="addNewObject" :disabled="readOnly" class="btn-success" size="sm">
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
            <b-button variant="outline-secondary" class="ml-1" size="sm" @click="showReport">
              <i class="ri-file-text-fill"></i>
              {{ $t('components.raport') }}
            </b-button>
            <b-dropdown variant="outline-secondary" :text="$t('commands.createFrom')" class="ml-1" size="sm">
              <b-dropdown-item @click="createDisposition">Dyspozycję</b-dropdown-item>
            </b-dropdown>
            <b-dropdown variant="outline-secondary" :text="$t('commands.print')" class="ml-1" size="sm">
              <b-dropdown-item @click="openPrintForm('main-d-print')">Dyspozycja</b-dropdown-item>
            </b-dropdown>
            <b-button variant="outline-secondary" class="ml-1" size="sm">
              <i class="ri-file-add-line"></i>
              {{ $t('commands.setStatus') }}
            </b-button>
            <!-- <b-dropdown variant="outline-secondary" class="ml-1" :text="$t('commands.more')" size="sm"> </b-dropdown> -->
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
                  <f-select v-model="schemeOfCargo" select-btn open-btn value-type="schemesOfCargo" detail-view="scheme-of-cargo" placeholder="Wyszukaj relację..."> </f-select>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.warehouseSection')" label-for="warehouseSection">
                  <f-select v-model="box" select-btn open-btn value-type="boxes" detail-view="box-detail" placeholder="Wyszukaj sektor magazynu..."></f-select>
                </b-form-group>
              </b-col>
              <b-col>
                <!-- <b-form-group horizontal :label-cols="3" :label="$t('table.forwarder')" label-for="filter-ownerId">
                  <v-select ref="fromSelectRef" v-model="forwarder" :options="forwarders" :loading="false"
                    :clearable="true" class="with-append" label="name" placeholder="Wybierz spedytora..."
                    @search="onSearchForwarder">
                  </v-select>
                  <template v-slot:append>
                    <b-button id="customer-search" class="customer-search" size="sm" @click="openCustomerSearch">
                      <i class="ri-search-line"></i>
                    </b-button>
                  </template>
                </b-form-group> -->
                <b-form-group horizontal :label-cols="3" :label="$t('table.forwarder')" label-for="forwarder">
                  <f-select v-model="forwarder" select-btn open-btn value-type="vendorsAndCustomers" detail-view="forwarder-detail" placeholder="Wyszukaj spedytora..."></f-select>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.deliveryOrder')">
                  <f-select v-model="deliveryOrder" select-btn open-btn value-type="deliveryOrders" detail-view="scheme-of-cargo" label="number" placeholder="Wyszukaj zlecenie...">
                  </f-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.carrier')" label-for="carrier">
                  <f-select v-model="carrier" select-btn open-btn value-type="carriers" detail-view="carrier-detail" placeholder="Wyszukaj przewoźnika..."></f-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.item')">
                  <f-select v-model="product" select-btn open-btn value-type="products" detail-view="assortment-detail" placeholder="Wyszukaj produkt..."></f-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.ship')" label-for="ship">
                  <f-select v-model="ship" select-btn open-btn value-type="ships" detail-view="ship-detail" placeholder="Wyszukaj statek..."></f-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.recipient')" label-for="customer">
                  <f-select
                    v-model="customer"
                    select-btn
                    open-btn
                    value-type="vendorsAndCustomers"
                    detail-view="vendors-and-customers-detail"
                    placeholder="Wyszukaj odbiorce..."
                  ></f-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.vendor')" label-for="vendor">
                  <f-select v-model="vendor" select-btn open-btn value-type="vendorsAndCustomers" detail-view="vendor-detail" placeholder="Wyszukaj dostawcę..."></f-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.warehouseSquare')" label-for="warehouse">
                  <f-select v-model="warehouse" select-btn open-btn value-type="warehouses" detail-view="warehouse-detail" placeholder="Wyszukaj magazyn..."></f-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.station')" label-for="numer">
                  <f-select v-model="position" select-btn open-btn value-type="positions" detail-view="detail" placeholder="Wyszukaj stanowisko..."> </f-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group :label-cols="3" :label="$t('table.docType')" label-for="order_type">
                  <b-form-select id="order_type" v-model="typeOfDocument" :options="typesOfDocuments" text-field="name" value-field="value" name="orderTypeName" size="sm" />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group :label-cols="3" :label="$t('table.status')" label-for="order-status">
                  <f-select
                    v-model="status"
                    select-btn
                    open-btn
                    value-type="dispositionStatuses"
                    detail-view="disposition-statuses-form"
                    placeholder="Wyszukaj status..."
                  ></f-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.disposition')">
                  <b-form-select id="operation_type" v-model="type" :options="dispositionTypes" text-field="name" value-field="value" name="dispositionName" size="sm" />
                </b-form-group>
              </b-col>
              <b-col></b-col>
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
            :tbody-tr-class="rowClass"
            :sort-by.sync="listView.sort.sortBy"
            :sort-desc.sync="listView.sort.sortDesc"
            :per-page="listView.limit"
            :current-page="1"
            @sort-changed="onSortingChanged"
          >
            <template v-slot:cell(status)="data">
              <span>
                <strong :style="{ color: data.item.status?.color }">{{ data.item.status?.name }}</strong>
              </span>
            </template>
            <template v-slot:cell(date)="data">
              <template>
                <span class="ri-arrow-right-s-line mr-1 text-info" aria-hidden="true"></span>
              </template>
              <a href="javascript:void(0);" @click="editObject(data.item.id)">
                <span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ data.item.date }}</span>
              </a>
            </template>
            <!-- <template v-slot:cell(state)="data">
              <span>{{ data.item }}</span>
            </template> -->
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
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import Disposition from '@/dto/Disposition.json'
import { uuid } from 'vue-uuid'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import DispositionStates from '@/constants/dispositionStates'
import TypesOfDocuments from '@/constants/documentTypes'
import DispositionTypes from '@/constants/dispositionTypes'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/pl'
import _ from 'lodash'

export default {
  name: 'DispositionList',
  page() {
    return {
      title: this.$t(`route.dispositions`),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },
  components: {
    Layout,
    PageHeader,
    DatePicker,
  },

  data() {
    return {
      title: this.$t(`route.dispositions`),
      fields: [
        { key: 'date', label: 'Data', sortable: true },
        { key: 'numberStr', label: 'Numer', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'driver.name', label: 'Kierowca', sortable: true },
        // { key: 'approvedDate', label: 'Zatwierdzony', sortable: true },
        { key: 'numberOfWeighings', label: 'Wielokrotność', sortable: true },
        { key: 'numberOfWeighted', label: 'Wykonane', sortable: true },
        { key: 'type', label: 'Dyspozycja', sortable: true },
        { key: 'schemeOfCargo.name', label: 'Relacja', sortable: true },
        { key: 'product.name', label: 'Towar', sortable: true },
        { key: 'order.number', label: 'Zlecenie', sortable: true },
        { key: 'ship.name', label: 'Statek', sortable: true },
        { key: 'warehouse.name', label: 'Miejsce', sortable: true },
        { key: 'box.name', label: 'Sektor magazynu', sortable: true },
        { key: 'forwarder.name', label: 'Spedytor', sortable: true },
        { key: 'weighingStation.name', label: 'Stanowisko wagowe', sortable: true },
        { key: 'quantity', label: 'Waga', sortable: true },
        { key: 'carrier.name', label: 'Przewoźnik', sortable: true },
        { key: 'author.name', label: 'Dyspozycję wystawił', sortable: true },
        { key: 'typeOfDocument', label: 'Typ dokumentu', sortable: true },
        { key: 'delete', label: '-' },
      ],
      perPage: 3,
      dateLang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: false,
      },
      questionAction: null,
      questionParams: null,
      questionMessage: '',
      visibleFilters: false,

      selected: '',
      options: [{ value: null, text: 'Manual option' }],
      showFilter: false,
      typesOfDocuments: [],
      dispositionStates: [],
      dispositionTypes: [],
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      listView: `dispositions/listView`,
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

    status: {
      get() {
        return this.listView.filters.status
      },
      set(value) {
        this.updateFilter({ status: value })
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
  },

  async created() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      addObjectView: `dispositions/addObjectView`,
      setListViewProperty: `dispositions/setListViewProperty`,
      setFilter: `dispositions/setFilters`,
      setSort: `dispositions/setSort`,
    }),

    async initialize() {
      this.typesOfDocuments = this.loadEnums(TypesOfDocuments)
      this.dispositionStates = this.loadEnums(DispositionStates)
      this.dispositionTypes = this.loadEnums(DispositionTypes)
      await this.updateList()
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

    async onSortingChanged(ctx) {
      this.setSort({ sortBy: ctx.sortBy, sortDesc: ctx.sortDesc })
      this.updateList()
    },

    openItemSubordination() {
      if (!this.selectedItem) {
        this.modalMessage = this.$t('common.msges.selectItemFirst')
        this.$bvModal.show('modal-message')
        return
      }

      this.subordinationShowMode = true
    },

    createDisposition() {
      if (this.selectedItem) {
        const newDisposition = _.cloneDeep(Disposition)

        newDisposition.id = uuid.v4()

        const { number, date, quantity, comment, ...copyObject } = this.selectedItem

        Object.keys(copyObject).forEach((key) => {
          newDisposition[key] = copyObject[key]
        })

        newDisposition.scaleTwo = copyObject.scale
        newDisposition.order = copyObject.id

        if (newDisposition.productId) {
          this.$store
            .dispatch('products/findByPk', { noCommit: true, params: { id: newDisposition.productId } })
            .then((response) => {
              if (response.status === 200) {
                const product = response.data
                const notUsedProductCondition = product.notUsedProductCondition

                if (notUsedProductCondition === true) {
                  newDisposition.productCondition = 'TOWAR WOLNY OD SALMONELI'
                }
              }
            })
            .catch((error) => {
              console.error(error)
            })
        }

        if (newDisposition.schemeOfCargoId) {
          this.$store
            .dispatch('schemesOfCargo/findByPk', { noCommit: true, params: { id: newDisposition.schemeOfCargoId } })
            .then((response) => {
              if (response.status === 200) {
                const schemeOfCargo = response.data

                if (!newDisposition.typeOfDocument) {
                  newDisposition.typeOfDocument = schemeOfCargo.typeOfDocument
                }

                newDisposition.typeOfOperation = schemeOfCargo.typeOfOperation

                if (newDisposition.typeOfOperation === 'Receipt' || newDisposition.typeOfOperation === 'DirectVariantReceipt') {
                  newDisposition.type = 'Unloading'
                } else {
                  newDisposition.type = 'Loading'
                }
              }
            })
            .catch((error) => {
              console.error(error)
            })
        }

        this.addDispositionObjectView({ viewId: newDisposition.id, object: newDisposition })
        this.$router.push({ name: 'disposition-form', params: { id: newDisposition.id } })
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
      await this.$store.dispatch('dispositions/changeDeletionMark', {
        id: itemId,
      })

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

      if (this.status) {
        filterStr.params.filter.statusId = this.status.id
      }

      if (this.position) {
        filterStr.params.filter.positionId = this.position.id
      }

      if (this.typeOfDocument) {
        filterStr.params.filter.typeOfDocument = this.typeOfDocument
      }

      // if (this.state) {
      //   filterStr.params.filter.state = this.state
      // }

      if (this.type) {
        filterStr.params.filter.type = this.type
      }

      const response = await this.$store.dispatch(`dispositions/findAll`, filterStr)

      console.log('response: ', response)
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
      this.addObjectView({ viewId, object: _.cloneDeep(Disposition) })
      this.$router.push({ name: 'disposition-form', params: { id: viewId } })
    },

    openPrintForm(formName) {
      const viewId = uuid.v4()
      this.addObjectView({ viewId, object: _.cloneDeep(Disposition) })
      this.$router.push({ name: formName, params: { id: viewId } })
    },

    async openStatusDetails(value) {
      const json = JSON.parse(value)

      const response = await this.$store.dispatch(`dispositionStatuses/findByPk`, {
        params: {
          id: json.id,
        },
      })
      this.$router.push({ name: 'disposition-statuses-form', params: { id: json.id } })
    },

    getStatusName(value) {
      console.log('value: ', value)

      const json = JSON.parse(value)
      console.log(json)
      if (json) {
        return json.name
      } else {
        return value
      }
    },

    async beforeDeleteItem(itemData) {
      this.questionMessage = 'Czy na pewno chcesz usunąć element z bazy danych?'

      this.questionAction = this.deleteItem
      this.questionParams = itemData

      this.$bvModal.show('modal-question')
    },

    async deleteItem(deleteItem) {
      await this.$store.dispatch('dispositions/delete', {
        id: deleteItem.id,
      })

      this.updateList()

      this.$bvModal.hide('modal-question')
    },

    async editObject(objectId) {
      const response = await this.$store.dispatch(`dispositions/findByPk`, {
        params: {
          id: objectId,
        },
      })
      if (response.status === 200) {
        this.$router.push({ name: 'disposition-form', params: { id: objectId } })
      }
    },

    showReport() {
      this.$router.push({ name: 'report-common-routes', params: { reportModule: 'reportDispositionList' } })
    },

    rowClass(item, type) {
      // console.log('item: ', item)
      if (!item || type !== 'row') return
      if (item.markedToDelete) {
        return 'table-danger text-danger striped'
      }
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

.statusColor {
  background-color: red;
}
</style>
