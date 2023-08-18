<template>
  <Layout>
    <PageHeader :title="title" />

    <b-card>
      <b-row class="align-items-center m-1">
        <b-button variant="success" @click="writeObject" class="mr-1" size="sm">
          <i class="ri-file-add-line mr-1"></i>
          {{ $t('commands.writeAndClose') }}
        </b-button>
        <b-button variant="outline-secondary" class="mr-1" size="sm">
          <i class="ri-file-add-line mr-1"></i>
          {{ $t('commands.write') }}
        </b-button>
        <b-button variant="outline-secondary" class="mr-1" @click="closeView" size="sm">
          <i class="ri-file-excel-line mr-1"></i>
          {{ $t('commands.close') }}
        </b-button>
        <b-button variant="outline-secondary" class="mr-1" size="sm">
          <i class="ri-history-line"></i>
          {{ $t('components.historyOfChanges') }}
        </b-button>
        <b-button variant="outline-secondary" class="mr-1" size="sm" :disabled="!object.id" @click="subordinationShowMode = true">
          <i class="ri-node-tree"></i>
        </b-button>
        <b-dropdown variant="outline-secondary" :text="$t('commands.createFrom')" size="sm">
          <b-dropdown-item @click="createDisposition">Dyspozycję</b-dropdown-item>
        </b-dropdown>
        <b-dropdown variant="outline-secondary" :text="$t('commands.print')" class="ml-1" size="sm">
          <b-dropdown-item @click="openPrintForm('order-print')">Zlecenie</b-dropdown-item>
        </b-dropdown>
        <b-dropdown variant="outline-secondary" class="ml-1" :text="$t('commands.more')" size="sm"> </b-dropdown>
      </b-row>
      <b-row>
        <b-col cols="7">
          <b-row class="m-1">
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Numer: </p>
              <b-form-input id="numberId" size="sm" v-model="number" type="text"> </b-form-input>
              <p class="mt-1 mr-2 m-1"> Nie laduj do Oracle: </p>
              <b-form-checkbox id="nonOracleLoadId" v-model="nonOracleLoad" name="nonOracleLoad" switch class="mt-1"> </b-form-checkbox>
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Data: </p>
              <b-form-input id="dateId" size="sm" v-model="date" type="date"> </b-form-input>
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Data wygasniecia: </p>
              <b-form-input id="endDateId" size="sm" v-model="endDate" type="date"> </b-form-input>
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Data zamkniecia: </p>
              <b-form-input id="dateClosingId" size="sm" v-model="dateClosing" type="date"> </b-form-input>
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Relacja: </p>
              <v-select
                v-model="schemeOfCargoId"
                :options="schemesOfCargo"
                :reduce="(option) => option.value"
                label="text"
                placeholder="Wybierz relacje..."
                size="sm"
                @search="onSearchSchemeOfCargo"
              >
              </v-select>
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Typ dokumentu: </p>
              <b-form-select id="typeOfDocumentId" v-model="typeOfDocument" :options="typesOfDocuments" placeholder="Wybierz typ dokumentu..." name="typeOfDocument" size="sm" />
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Rodzaj transakcji: </p>
              <b-form-select id="typeOfOperationId" v-model="typeOfOperation" :options="typesOfOperations" name="typeOfOperation" size="sm" />
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Własciciel: </p>
              <v-select
                v-model="counterpartyId"
                :options="owners"
                :reduce="(option) => option.value"
                label="text"
                placeholder="Wybierz wlasciciela..."
                size="sm"
                @search="onSearchOwner"
              >
              </v-select>
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Towar: </p>
              <v-select v-model="productId" :options="products" :reduce="(option) => option.value" label="text" placeholder="Wybierz towar..." size="sm" @search="onSearchProduct">
              </v-select>
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Deklarowany tonaz: </p>
              <b-form-input id="quantityId" size="sm" v-model="quantity" type="text"> </b-form-input>
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Numer, data SDK: </p>
              <b-form-input id="customsNumberId" size="sm" v-model="customsNumber" type="text"> </b-form-input>
              <b-form-input id="dateIssueDSKId" size="sm" v-model="dateIssueDSK" type="date"> </b-form-input>
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Czas oblugi samochodu: </p>
              <b-form-input id="minutesCarServiceId" size="sm" v-model="minutesCarService" type="number"> </b-form-input>
              <p class="mt-1 mr-1 w-50 m-1"> (minuty) </p>
            </b-input-group>
          </b-row>
        </b-col>
        <!-- end col -->
        <b-col cols="5">
          <b-row class="m-1">
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Status: </p>
              <b-form-select id="orderStateId" v-model="state" :options="orderStates" name="orderState" size="sm" />
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Statek: </p>
              <v-select v-model="shipId" :options="ships" :reduce="(option) => option.value" label="text" placeholder="Wybierz statek..." size="sm" @search="onSearchShip">
              </v-select>
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Miejsce: </p>
              <v-select
                v-model="warehouseId"
                :options="warehouses"
                :reduce="(option) => option.value"
                label="text"
                placeholder="Wybierz miejsce..."
                size="sm"
                @search="onSearchWarehouse"
              >
              </v-select>
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Sektor magazynu: </p>
              <v-select v-model="boxId" :options="boxes" :reduce="(option) => option.value" label="text" placeholder="Wybierz sektor magazynu..." size="sm" @search="onSearchBox">
              </v-select>
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Spedytor: </p>
              <v-select
                v-model="forwarderId"
                :options="forwarders"
                :reduce="(option) => option.value"
                label="text"
                placeholder="Wybierz spedytora..."
                size="sm"
                @search="onSearchForwarder"
              >
              </v-select>
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Maks. ubytek: </p>
              <b-form-input id="deliveryTermId" size="sm" v-model="maxDecrease" type="text"> </b-form-input>
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Status celny towaru: </p>
              <b-form-select id="customsStatusOfGoodsId" v-model="customsStatusOfGoods" :options="customStatesOfGoods" name="customStatusOfGoods" size="sm" />
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1 w-25"> Firma kontrolna: </p>
              <b-form-select id="controlCompanyId" v-model="controlCompany" :options="controlCompanies" name="controlCompany" size="sm" />
            </b-input-group>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="6">
          <b-row class="p-1">
            <b-button variant="outline-secondary" class="mr-1">
              <i class="ri-file-add-line mr-1"></i>
              Dodaj korespondencję
            </b-button>
          </b-row>
          <b-row>
            <b-col cols="6">
              <p class="mt-1 mr-1"> Korespondencja: </p>
              <b-form-textarea id="correspondenceId" size="sm" v-model="correspondence" type="text"> </b-form-textarea>
            </b-col>
            <b-col cols="6">
              <p class="mt-1 mr-1"> Komentarz: </p>
              <b-form-textarea id="commentId" size="sm" v-model="comment" type="text"> </b-form-textarea>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="6"></b-col>
      </b-row>
    </b-card>

    <Subordination v-if="subordinationShowMode" :object-id="object.id" object-type="deliveryOrders" @subordination-closed="subordinationShowMode = false" />
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import CustomStatesOfGoods from '@/constants/customStatesOfGoods'
import TypesOfDocuments from '@/constants/documentTypes'
import TypesOfOperations from '@/constants/operationTypes'
import OrderStates from '@/constants/orderStates'
import Subordination from '@/components/common/subordination'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Disposition from '@/dto/Disposition'
import { uuid } from 'vue-uuid'
import _ from 'lodash'

import moment from 'moment'

export default {
  name: 'DeliveryOrderDetailOld',

  page() {
    return { title: this.$t('common.orderData'), meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: { Layout, PageHeader, Subordination },

  data() {
    return {
      title: this.$t('common.orderData'),

      owners: [],
      ships: [],
      warehouses: [],
      boxes: [],
      products: [],
      forwarders: [],
      controlCompanies: [],
      customStatesOfGoods: [],
      typesOfDocuments: [],
      typesOfOperations: [],
      schemesOfCargo: [],
      orderStates: [],
      subordinationShowMode: false,
      viewId: this.$route.params.id,
    }
  },

  async created() {
    await this.initialize()
  },

  computed: {
    ...mapGetters({
      getObjectView: 'deliveryOrders/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    id: {
      get() {
        return this.objectView ? this.objectView.object.id : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'id', value })
      },
    },

    number: {
      get() {
        return this.objectView ? this.objectView.object.number : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'number', value })
      },
    },

    nonOracleLoad: {
      get() {
        return this.objectView ? this.objectView.object.nonOracleLoad : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'nonOracleLoad', value })
      },
    },

    customsNumber: {
      get() {
        return this.objectView ? this.objectView.object.customsNumber : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'customsNumber', value })
      },
    },

    dateIssueDSK: {
      get() {
        return this.objectView ? moment(this.objectView.object.dateIssueDSK).format('YYYY-MM-DD') : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'dateIssueDSK', value: moment(value).format('YYYY-MM-DD') })
      },
    },

    date: {
      get() {
        return this.objectView ? moment(this.objectView.object.date).format('YYYY-MM-DD') : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'date', value: moment(value).format('YYYY-MM-DD') })
      },
    },

    endDate: {
      get() {
        return this.objectView ? moment(this.objectView.object.endDate).format('YYYY-MM-DD') : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'endDate', value: moment(value).format('YYYY-MM-DD') })
      },
    },

    dateClosing: {
      get() {
        return this.objectView ? moment(this.objectView.object.dateClosing).format('YYYY-MM-DD') : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'dateClosing', value: moment(value).format('YYYY-MM-DD') })
      },
    },

    schemeOfCargoId: {
      get() {
        return this.objectView ? this.objectView.object.schemeOfCargoId : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'schemeOfCargoId', value })
      },
    },

    schemeOfCargo: {
      get() {
        return this.objectView ? this.objectView.object.schemeOfCargo : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'schemeOfCargo', value })
      },
    },

    typeOfDocument: {
      get() {
        return this.objectView ? this.objectView.object.typeOfDocument : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'typeOfDocument', value })
      },
    },

    typeOfOperation: {
      get() {
        return this.objectView ? this.objectView.object.typeOfOperation : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'typeOfOperation', value })
      },
    },

    counterpartyId: {
      get() {
        return this.objectView ? this.objectView.object.counterpartyId : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'counterpartyId', value })
      },
    },

    owner: {
      get() {
        return this.objectView ? this.objectView.object.owner : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'owner', value })
      },
    },

    productId: {
      get() {
        return this.objectView ? this.objectView.object.productId : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'productId', value })
      },
    },

    product: {
      get() {
        return this.objectView ? this.objectView.object.product : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'product', value })
      },
    },

    quantity: {
      get() {
        return this.objectView ? this.objectView.object.quantity : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'quantity', value })
      },
    },

    minutesCarService: {
      get() {
        return this.objectView ? this.objectView.object.minutesCarService : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'minutesCarService', value })
      },
    },

    status: {
      get() {
        return this.objectView ? this.objectView.object.status : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'status', value })
      },
    },

    ship: {
      get() {
        return this.objectView ? this.objectView.object.ship : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'ship', value })
      },
    },

    shipId: {
      get() {
        return this.objectView ? this.objectView.object.shipId : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'shipId', value })
      },
    },

    warehouseId: {
      get() {
        return this.objectView ? this.objectView.object.warehouseId : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'warehouseId', value })
      },
    },

    warehouse: {
      get() {
        return this.objectView ? this.objectView.object.warehouse : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'warehouse', value })
      },
    },

    boxId: {
      get() {
        return this.objectView ? this.objectView.object.boxId : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'boxId', value })
      },
    },

    box: {
      get() {
        return this.objectView ? this.objectView.object.box : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'box', value })
      },
    },

    forwarderId: {
      get() {
        return this.objectView ? this.objectView.object.forwarderId : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'forwarderId', value })
      },
    },

    forwarder: {
      get() {
        return this.objectView ? this.objectView.object.forwarder : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'forwarder', value })
      },
    },

    maxDecrease: {
      get() {
        return this.objectView ? this.objectView.object.maxDecrease : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'maxDecrease', value })
      },
    },

    customsStatusOfGoods: {
      get() {
        return this.objectView ? this.objectView.object.customsStatusOfGoods : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'customsStatusOfGoods', value })
      },
    },

    controlCompany: {
      get() {
        return this.objectView ? this.objectView.object.controlCompanyId : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'controlCompanyId', value })
      },
    },

    correspondence: {
      get() {
        return this.objectView ? this.objectView.object.correspondence : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'correspondence', value })
      },
    },

    comment: {
      get() {
        return this.objectView ? this.objectView.object.comment : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'comment', value })
      },
    },

    state: {
      get() {
        return this.objectView ? this.objectView.object.state : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'state', value })
      },
    },
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'deliveryOrders/setObjectViewProperty',
      addDispositionObjectView: 'dispositions/addObjectView',
      setObjectProperty: 'deliveryOrders/setObjectProperty',
      delObjectView: 'deliveryOrders/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async initialize() {
      await this.initializeControlCompanies()

      this.customStatesOfGoods = this.loadEnums(CustomStatesOfGoods, null)
      this.typesOfDocuments = this.loadEnums(TypesOfDocuments, null)
      this.typesOfOperations = this.loadEnums(TypesOfOperations, null)
      this.orderStates = this.loadEnums(OrderStates, null)

      this.ships = this.loadEnums(this.ships, this.ship)
      this.warehouses = this.loadEnums(this.warehouses, this.warehouse)
      this.owners = this.loadEnums(this.owners, this.owner)
      this.schemesOfCargo = this.loadEnums(this.schemesOfCargo, this.schemeOfCargo)
      this.boxes = this.loadEnums(this.boxes, this.box)
      this.forwarders = this.loadEnums(this.forwarders, this.forwarder)
      this.products = this.loadEnums(this.products, this.product)
    },

    loadEnums(enumVar, objectVar) {
      const finalList = []
      for (let i = 0; i < enumVar.length; i++) {
        finalList.push({ text: enumVar[i], value: enumVar[i] })
      }

      if (objectVar) {
        finalList.push({ text: objectVar.name, value: objectVar.id })
      }

      return finalList
    },

    async initializeControlCompanies() {
      const companies = await this.$store.dispatch('controlCompanies/findAll', {})
      for (let i = 0; i < companies.length; i++) {
        this.controlCompanies.push({ text: companies[i].name, value: companies[i].id })
      }
    },

    async createDisposition() {
      const newDisposition = _.cloneDeep(Disposition)

      newDisposition.id = uuid.v4()

      const { number, date, quantity, comment, ...copyObject } = this.object

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
    },

    async writeObject() {
      let response
      if (this.object.id === null || this.object.id === undefined) {
        response = await this.$store.dispatch('deliveryOrders/create', this.object)
      } else {
        response = await this.$store.dispatch('deliveryOrders/update', this.object)
      }

      if (response.status && response.status === 200) {
        this.$bvToast.toast('Zlecenie zostalo zapisane', {
          title: this.$tc('common.msg'),
          variant: 'success',
          solid: true,
          autoHideDelay: 2000,
        })
        this.closeView()
      } else {
        this.$bvToast.toast(`Błąd zapisania zlecenia ${response.data.message}`, {
          title: this.$tc('common.msg'),
          variant: 'danger',
          solid: true,
          autoHideDelay: 2000,
        })
      }
    },

    async closeView() {
      this.$destroy()
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)
      await this.$router.push({ name: 'delivery-orders-list' })
    },

    openPrintForm(printName) {
      console.log('Print open: ', printName)
      this.$router.push({ name: printName })
    },

    async updateShips(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('ships/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.ships = []
      for (let i = 0; i < response.length; i++) {
        this.ships.push({ text: response[i].name, value: response[i].id })
      }
    },

    async updateOwners(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: false },
          filter: { status: 'Active' },
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
          this.owners.push({ text: owners[i].name, value: owners[i].id })
        }
      }
    },

    async updateSchemesOfCargo(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('schemesOfCargo/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.schemesOfCargo = []
      for (let i = 0; i < response.length; i++) {
        this.schemesOfCargo.push({ text: response[i].name, value: response[i].id })
      }
    },

    async updateWarehouses(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('warehouses/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.warehouses = []
      for (let i = 0; i < response.length; i++) {
        this.warehouses.push({ text: response[i].name, value: response[i].id })
      }
    },

    async updateBoxes(searchStr) {
      if (this.warehouse === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr, warehouseId: this.warehouseId },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('boxes/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.boxes = []
      for (let i = 0; i < response.length; i++) {
        this.boxes.push({ text: response[i].name, value: response[i].id })
      }
    },

    async updateProducts(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('products/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.products = []
      for (let i = 0; i < response.data.length; i++) {
        this.products.push({ text: response.data[i].name, value: response.data[i].id })
      }
    },

    async updateForwarders(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('vendorsAndCustomers/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.forwarders = []
      for (let i = 0; i < response.length; i++) {
        this.forwarders.push({ text: response[i].name, value: response[i].id })
      }
    },

    onSearchShip(searchValue) {
      this.updateShips(searchValue)
    },

    onSearchOwner(searchValue) {
      this.updateOwners(searchValue)
    },

    onSearchSchemeOfCargo(searchValue) {
      this.updateSchemesOfCargo(searchValue)
    },

    onSearchWarehouse(searchValue) {
      this.updateWarehouses(searchValue)
    },

    onSearchBox(searchValue) {
      this.updateBoxes(searchValue)
    },

    onSearchProduct(searchValue) {
      this.updateProducts(searchValue)
    },

    onSearchForwarder(searchValue) {
      this.updateForwarders(searchValue)
    },
  },
}
</script>

<style>
.btn-container {
  display: inline-flexbox;
}

.short-input {
  max-width: 70%;
}

.chackbox-box {
  display: flex;
  align-items: center;
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

.long {
  min-width: 80vw;
}

.text-box {
  width: 80px;
}

.text-box-down {
  width: 100px;
}
</style>