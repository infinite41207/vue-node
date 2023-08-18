<template>
  <Layout>
    <PageHeader :title="title" />

    <b-card>
      <b-row class="align-items-center m-1">
        <b-button variant="success" @click="writeObject" :disabled="readOnly" class="mr-1" size="sm">
          <i class="ri-file-add-line mr-1"></i>
          {{ $t('commands.writeAndClose') }}
        </b-button>
        <b-button variant="outline-secondary" :disabled="readOnly" class="mr-1" size="sm">
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
        <b-dropdown variant="outline-secondary" class="mr-1" :text="$t('commands.createFrom')" size="sm">
          <b-dropdown-item @click="createDisposition">Dyspozycję</b-dropdown-item>
        </b-dropdown>
        <b-dropdown variant="outline-secondary" :text="$t('commands.print')" class="mr-1" size="sm">
          <b-dropdown-item @click="openPrintForm('order-print')">Zlecenie</b-dropdown-item>
        </b-dropdown>
        <b-button disabled variant="outline-secondary" class="mr-1" size="sm">
          {{ $t('commands.sendListToAuthor') }}
        </b-button>
      </b-row>
      <b-row class="mt-4">
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.number')" label-for="numer">
            <b-input-group>
              <b-form-input id="object-number" v-model="numberStr" name="numberStr" size="sm" />
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.date')" label-for="numer">
            <b-input-group>
              <date-picker id="order_date" v-model="date" name="date" value-type="date" type="datetime" size="sm"></date-picker>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.schemeOfCargo')" label-for="schemeOfCargo">
            <f-select v-model="schemeOfCargo" required select-btn open-btn value-type="schemesOfCargo" detail-view="scheme-of-cargo" placeholder="Wyszukaj relację..."> </f-select>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.status')" label-for="status">
            <b-input-group>
              <b-form-select id="order_status" v-model="state" :options="orderStates" text-field="name" value-field="value" name="status" size="sm" />
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.docType')" label-for="customer">
            <b-form-select id="order_status" v-model="typeOfDocument" :options="typesOfDocuments" text-field="name" value-field="value" name="status" size="sm" />
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.weighingStation')" label-for="customer">
            <f-select v-model="weighingStation" select-btn open-btn value-type="weighingStations" detail-view="detail" placeholder="Wyszukaj stanowisko wagowe..."></f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.typeOfOperation')" label-for="customer">
            <b-form-select id="order_status" v-model="typeOfOperation" :options="typesOfOperations" text-field="name" value-field="value" name="status" size="sm" />
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.scale')" label-for="customer">
            <f-select v-model="scale" select-btn open-btn value-type="scales" detail-view="detail" placeholder="Wyszukaj wagę..."></f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.counterparty')" label-for="customer">
            <f-select v-model="customer" required select-btn open-btn value-type="customers" detail-view="counterparties-detail" placeholder="Wyszukaj właściciela..."></f-select>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.ship')" label-for="ship">
            <f-select v-model="ship" select-btn open-btn value-type="ships" detail-view="ship-detail" placeholder="Wyszukaj statek..."></f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.item')" label-for="item">
            <f-select v-model="product" required select-btn open-btn value-type="products" detail-view="product-detail" placeholder="Wyszukaj towar..."></f-select>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.warehouseSquare')">
            <f-select v-model="warehouse" select-btn open-btn value-type="warehouses" detail-view="detail" placeholder="Wyszukaj magazyn..."></f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.declaredTonnage')" label-for="item">
            <b-form-input size="sm" v-model="quantity" type="number"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.warehouseSection')" label-for="warehouseSection">
            <f-select v-model="box" select-btn open-btn value-type="boxes" detail-view="box-detail" placeholder="Wyszukaj sektor magazynu..."></f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.numberAndDateSdk')" label-for="item">
            <b-row>
              <b-col>
                <b-form-input size="sm" v-model="customsNumber" type="number"></b-form-input>
              </b-col>
              <b-col cols="8">
                <!-- <b-form-datepicker id="order_close_date" v-model="dateIssueDSK" name="date" size="sm" aria-describedby="statusFeedback"></b-form-datepicker> -->
                <date-picker id="dateIssueDSK" v-model="dateIssueDSK" name="dateIssueDSK" value-type="date" type="date" size="sm"></date-picker>
              </b-col>
            </b-row>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.forwarder')" label-for="forwarder">
            <f-select v-model="forwarder" select-btn open-btn value-type="vendorsAndCustomers" detail-view="forwarder-detail" placeholder="Wyszukaj spedytora..."></f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.base')">
            <f-select v-model="base" select-btn open-btn value-type="deliveryOrders" detail-view="delivery-order-detail" label="number" placeholder="Wyszukaj podstawę...">
            </f-select>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.assortment')">
            <f-select v-model="assortment" select-btn open-btn value-type="assortments" detail-view="assortment-detail" placeholder="Wyszukaj sortyment..."></f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.carServiceTime')" label-for="item">
            <b-row>
              <b-col>
                <b-form-input size="sm" v-model="minutesCarService" type="number"></b-form-input>
              </b-col>
              <b-col style="padding-top: 5px"> (minuty) </b-col>
            </b-row>
          </b-form-group>
        </b-col>
        <b-col v-if="showMaxDecrease" lg="6">
          <b-form-group horizontal :label-cols-sm="3" :label="$t('table.maxLoss')" label-for="maxDecrease">
            <b-form-input size="sm" v-model="maxDecrease" type="number"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mb-2">
        <b-col xl="6">
          <b-row>
            <b-col lg="8" xl="7">
              <b-form-group horizontal :label-cols-sm="3" :label-cols-xl="4" :label="$t('table.arriveFrom')">
                <b-form-timepicker v-model="timeStart" v-bind="timeLabels[timeLocale]" :locale="timeLocale" size="sm"></b-form-timepicker>
              </b-form-group>
            </b-col>
            <b-col lg="4" xl="5">
              <b-form-group horizontal :label-cols-sm="3" :label-cols-xl="2" :label="$t('table.to')">
                <b-form-timepicker v-model="timeEnd" size="sm" v-bind="timeLabels[timeLocale]" :locale="timeLocale"></b-form-timepicker>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col xl="6">
          <b-form-group horizontal :label-cols-sm="3" :label-cols-lg="2" :label-cols-xl="3" :label="$t('table.customGoodsStatus')" label-for="customsStatusOfGoods">
            <b-form-select id="order_status" v-model="customsStatusOfGoods" :options="customStatesOfGoods" text-field="name" value-field="value" name="status" size="sm" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mb-2">
        <b-col xl="6">
          <b-row>
            <b-col lg="8" xl="7">
              <b-form-group horizontal :label-cols-sm="3" :label-cols-xl="4" :label="$t('table.lockArrivesFrom')">
                <date-picker id="arrivalsBlockingStart" v-model="arrivalsBlockingStart" name="arrivalsBlockingStart" value-type="date" type="datetime" size="sm"></date-picker>
              </b-form-group>
            </b-col>
            <b-col lg="4" xl="5">
              <b-form-group horizontal :label-cols-sm="3" :label-cols-xl="2" :label="$t('table.to')">
                <date-picker id="arrivalsBlockingEnd" v-model="arrivalsBlockingEnd" name="arrivalsBlockingEnd" value-type="date" type="datetime" size="sm"></date-picker>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col xl="6">
          <b-form-group horizontal :label-cols-sm="3" :label-cols-lg="2" :label-cols-xl="3" :label="$t('table.controlCompany')">
            <f-select
              v-model="controlCompany"
              select-btn
              open-btn
              value-type="controlCompanies"
              detail-view="control-company-form"
              placeholder="Wyszukaj firmę kontrolną..."
            ></f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.tests')" label-for="item">
            <b-row>
              <b-col>
                <b-input-group-append>
                  <b-form-checkbox class="ml-3 mt-1" v-model="isOpenSubOrders"> </b-form-checkbox>
                </b-input-group-append>
              </b-col>
            </b-row>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" label="GMP+" label-for="item">
            <b-row>
              <b-col>
                <b-input-group-append>
                  <b-form-checkbox class="ml-3 mt-1" v-model="gmp"> </b-form-checkbox>
                </b-input-group-append>
              </b-col>
            </b-row>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col>
          <b-button variant="success" @click="writeObject" class="mr-1" size="sm"> Dodaj korespondencję </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <p class="mt-2">{{ $t('table.correspondence') }}</p>
          <b-form-textarea id="textarea" v-model="correspondence" placeholder="Wprowadz komentarz..." rows="3" max-rows="6"></b-form-textarea>
        </b-col>
        <b-col lg="6">
          <p class="mt-2">{{ $t('table.descComment') }}</p>
          <b-form-textarea id="textarea" v-model="comment" placeholder="Wprowadz komentarz..." rows="3" max-rows="6"></b-form-textarea>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group class="mt-2" horizontal :label-cols-sm="3" :label="$t('table.orderAuthor')">
            <f-select v-model="author" select-btn open-btn value-type="users" detail-view="user-detail" placeholder="Wyszukaj autora zlecenia..."></f-select>
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>
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
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Disposition from '@/dto/Disposition'
import { uuid } from 'vue-uuid'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'DeliveryOrderDetail',

  setup: () => ({ v$: useVuelidate() }),

  page() {
    return { title: this.$t('common.orderData'), meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: { Layout, PageHeader, DatePicker },

  data() {
    return {
      title: this.$t('common.orderData'),
      subordinationShowMode: false,
      viewId: this.$route.params.id,
      customStatesOfGoods: [],
      typesOfDocuments: [],
      typesOfOperations: [],
      orderStates: [],
      controlCompanies: [],
      showMaxDecrease: true,
      readOnly: this.$route.meta.isReadOnly,
      timeLocale: 'pl',
      timeLabels: {
        pl: {
          labelHours: 'Godzin',
          labelMinutes: 'Minut',
          labelSeconds: 'Sekund',
          labelIncrement: 'Zwiększ',
          labelDecrement: 'Zmniejsz',
          labelSelected: 'Wybrany czas',
          labelNoTimeSelected: 'Nie wybrano czasu',
          labelCloseButton: 'Zamknij',
        },
      },
    }
  },

  validations() {
    return {
      date: { required },
      schemeOfCargo: { required },
      customer: { required },
      product: { required },
      customsStatusOfGoods: { required },
      quantity: { required },
      state: { required },
      minutesCarService: { required },
    }
  },

  async created() {
    await this.initialize()
  },

  computed: {
    ...mapGetters({
      getObjectView: 'deliveryOrders/objectView',
      currentLanguage: 'auth/currentLanguage',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    customerData() {
      return this.objectView ? this.objectView.customerData : {}
    },

    schemeOfCargo: {
      get() {
        return this.object.schemeOfCargo
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'schemeOfCargo', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'schemeOfCargoId', value: value ? value.id : value })
      },
    },

    customer: {
      get() {
        return this.object.owner
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'owner', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'counterpartyId', value: value ? value.id : value })
      },
    },

    product: {
      get() {
        return this.object.product
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'product', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'productId', value: value ? value.id : value })
      },
    },

    assortment: {
      get() {
        return this.object.assortment
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'assortment', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'assortmentId', value: value ? value.id : value })
      },
    },

    weighingStation: {
      get() {
        return this.object.weighingStation
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'weighingStation', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'weighingStationId', value: value ? value.id : value })
      },
    },

    scale: {
      get() {
        return this.object.scale
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'scale', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'scaleId', value: value ? value.id : value })
      },
    },

    author: {
      get() {
        return this.object.author
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'author', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'authorId', value: value ? value.id : value })
      },
    },

    ship: {
      get() {
        return this.object.ship
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'ship', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'shipId', value: value ? value.id : value })
      },
    },

    forwarder: {
      get() {
        return this.object.forwarder
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'forwarder', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'forwarderId', value: value ? value.id : value })
      },
    },

    base: {
      get() {
        return this.object.base
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'base', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'baseId', value: value ? value.id : value })
      },
    },

    box: {
      get() {
        return this.object.box
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'box', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'boxId', value: value ? value.id : value })
      },
    },

    controlCompany: {
      get() {
        return this.object.controlCompany
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'controlCompany', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'controlCompanyId', value: value ? value.id : value })
      },
    },

    warehouse: {
      get() {
        return this.object.warehouse
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'warehouse', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'warehouseId', value: value ? value.id : value })
      },
    },

    // next are not for f-select

    id: {
      get() {
        return this.objectView ? this.objectView.object.id : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'id', value })
      },
    },

    numberStr: {
      get() {
        return this.objectView ? this.objectView.object.numberStr : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'numberStr', value })
      },
    },

    gmp: {
      get() {
        return this.objectView ? this.objectView.object.gmp : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'gmp', value })
      },
    },

    isOpenSubOrders: {
      get() {
        return this.objectView ? this.objectView.object.isOpenSubOrders : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'isOpenSubOrders', value })
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
        // return this.objectView ? moment(this.objectView.object.dateIssueDSK).format('YYYY-MM-DD') : ''
        return this.objectView ? (this.objectView.object.dateIssueDSK ? new Date(this.objectView.object.dateIssueDSK) : null) : null
      },
      set(value) {
        // this.setObjectProperty({ viewId: this.viewId, property: 'dateIssueDSK', value: moment(value).format('YYYY-MM-DD') })
        this.setObjectProperty({ viewId: this.viewId, property: 'dateIssueDSK', value: value })
      },
    },

    date: {
      get() {
        // return this.objectView ? moment(this.objectView.object.date).format('YYYY-MM-DD') : ''
        return this.objectView ? new Date(this.objectView.object.date) : null
      },
      set(value) {
        // this.setObjectProperty({ viewId: this.viewId, property: 'date', value: moment(value).format('YYYY-MM-DD') })
        this.setObjectProperty({ viewId: this.viewId, property: 'date', value: value })
      },
    },

    timeStart: {
      get() {
        return this.object?.timeStart ? moment(this.object.timeStart).format('HH:mm:ss') : null
      },
      set(value) {
        if (value) {
          this.setObjectProperty({ viewId: this.viewId, property: 'timeStart', value: moment(value, 'HH:mm:ss').toDate() })
        }
      },
    },

    timeEnd: {
      get() {
        return this.object?.timeEnd ? moment(this.object.timeEnd).format('HH:mm:ss') : null
      },
      set(value) {
        if (value) {
          this.setObjectProperty({ viewId: this.viewId, property: 'timeEnd', value: moment(value, 'HH:mm:ss').toDate() })
        }
      },
    },

    arrivalsBlockingStart: {
      get() {
        // return this.objectView ? moment(this.objectView.object.arrivalsBlockingStart).format('YYYY-MM-DD') : ''
        return this.objectView ? (this.objectView.object.arrivalsBlockingStart ? new Date(this.objectView.object.arrivalsBlockingStart) : null) : null
      },
      set(value) {
        // this.setObjectProperty({ viewId: this.viewId, property: 'arrivalsBlockingStart', value: moment(value).format('YYYY-MM-DD') })
        this.setObjectProperty({ viewId: this.viewId, property: 'arrivalsBlockingStart', value: value })
      },
    },

    arrivalsBlockingEnd: {
      get() {
        // return this.objectView ? moment(this.objectView.object.arrivalsBlockingEnd).format('YYYY-MM-DD') : ''
        return this.objectView ? (this.objectView.object.arrivalsBlockingEnd ? new Date(this.objectView.object.arrivalsBlockingEnd) : null) : null
      },
      set(value) {
        // this.setObjectProperty({ viewId: this.viewId, property: 'arrivalsBlockingEnd', value: moment(value).format('YYYY-MM-DD') })
        this.setObjectProperty({ viewId: this.viewId, property: 'arrivalsBlockingEnd', value: value })
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

    state: {
      get() {
        return this.objectView ? this.objectView.object.state : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'state', value })
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
  },

  watch: {
    typeOfDocument(type) {
      type === 'Railway' ? (this.showMaxDecrease = true) : (this.showMaxDecrease = false)
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
      this.customStatesOfGoods = this.loadEnums(CustomStatesOfGoods)
      this.typesOfDocuments = this.loadEnums(TypesOfDocuments)
      this.typesOfOperations = this.loadEnums(TypesOfOperations)
      this.orderStates = this.loadEnums(OrderStates)

      this.checkDocType()

      await this.initializeControlCompanies()
    },

    loadEnums(enumVar) {
      const finalList = []
      for (let i = 0; i < enumVar.length; i++) {
        finalList.push({ name: enumVar[i], value: enumVar[i] })
      }
      return finalList
    },

    checkDocType() {
      this.typeOfDocument === 'Railway' ? (this.showMaxDecrease = true) : (this.showMaxDecrease = false)
    },

    async initializeControlCompanies() {
      await this.$store
        .dispatch('controlCompanies/findAll', { noCommit: true })
        .then((response) => {
          if (response.status === 200) {
            for (const company of response.data) {
              this.controlCompanies.push({ name: company.name, id: company.id })
            }
          }
        })
        .catch((error) => {
          console.error(error)
        })
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

    async checkFormValidation() {
      const isFormCorrect = await this.v$.$validate()
      if (!isFormCorrect) {
        for (const currentError of this.v$.$errors) {
          let errorType = ''
          if (currentError.$validator === 'required') {
            errorType = 'Brak wypełnienia'
          } else {
            errorType = currentError.$message
          }
          this.$bvToast.toast(errorType, {
            title: this.$tc('table.' + currentError.$property),
            variant: 'danger',
            solid: true,
            autoHideDelay: 5000,
          })
        }
      }
      return isFormCorrect
    },

    async writeObject() {
      console.log('object: ', this.object)

      let response

      if (!(await this.checkFormValidation())) {
        return
      }

      if (this.object.isNew) {
        response = await this.$store
          .dispatch('deliveryOrders/create', this.object)
          .then((res) => {
            console.log('create result: ', res)
            this.$bvToast.toast('Zlecenie zostalo zapisane', {
              title: this.$tc('common.msg'),
              variant: 'success',
              solid: true,
              autoHideDelay: 2000,
            })
            this.closeView()
          })
          .catch((err) => {
            console.log('create error: ', err)
            this.$bvToast.toast(`Błąd zapisania zlecenia ${err.message}`, {
              title: this.$tc('common.msg'),
              variant: 'danger',
              solid: true,
              autoHideDelay: 2000,
            })
          })
      } else {
        response = await this.$store
          .dispatch('deliveryOrders/update', this.object)
          .then((res) => {
            this.closeView()
          })
          .catch((err) => {
            console.log('create error: ', err)
            this.$bvToast.toast(`Błąd zapisania zlecenia ${err.message}`, {
              title: this.$tc('common.msg'),
              variant: 'danger',
              solid: true,
              autoHideDelay: 2000,
            })
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
      this.$router.push({ name: printName, params: { id: this.viewId, object: this.object } })
    },

    async fillCustomerData(customerId) {
      await this.$store.dispatch('orders/getCustomerData', {
        params: {
          id: customerId,
          viewId: this.viewId,
        },
      })

      if (this.customerData) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'customer',
          value: {
            id: this.customerData.id,
            name: this.customerData.name,
            presentation: this.customerData.presentation,
          },
        })

        this.deliverySettings = this.customerData.deliverySettings

        if (this.customerData.currencyId !== null) {
          const currency = this.currencyList.find((el) => {
            return el.id === this.customerData.currencyId
          })

          if (currency) {
            this.currency = { id: currency.id, name: currency.name }
          }
        }

        this.termOfPayment = this.customerData.termOfPaymentId
        this.packageMaterial = this.customerData.packageMaterial

        if (this.deliverySettings) {
          this.updateDeliveryMethod()
          this.updateDeliverySettingsDescription()
          this.deliveryDate = null
          this.shipmentDate = null

          this.calculateDatesAvailability()
        }
      }
    },

    async setCustomer(value) {
      this.setObjectProperty({ viewId: this.viewId, property: 'customerId', value })

      if (value) {
        await this.fillCustomerData(value)
      }
    },
  },
}
</script>

<style>
.disabled {
  pointer-events: none;
  color: gray;
  cursor: not-allowed;
  background-image: none;
  background-color: #eef1f6;
  border-color: #d1dbe5;
}
</style>