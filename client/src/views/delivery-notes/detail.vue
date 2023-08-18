<template>
  <Layout>
    <PageHeader :title="title" />

    <b-card>
      <b-row class="align-items-center m-1">
        <b-button variant="success" @click="writeObject(true)" :disabled="readOnly" class="mr-1" size="sm">
          <i class="ri-file-add-line mr-1"></i>
          {{ $t('commands.writeAndClose') }}
        </b-button>
        <b-button variant="outline-secondary" @click="writeObject" :disabled="readOnly" class="mr-1" size="sm">
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
        <b-button variant="outline-secondary" class="mr-1" size="sm" @click="subordinationShowMode = true">
          <i class="ri-node-tree"></i>
        </b-button>
        <b-dropdown variant="outline-secondary" :text="$t('commands.createFrom')" size="sm">
          <b-dropdown-item @click="createDisposition">Dyspozycję</b-dropdown-item>
        </b-dropdown>
        <b-dropdown variant="outline-secondary" :text="$t('commands.print')" class="ml-1" size="sm">
          <b-dropdown-item @click="openPrintForm('main-dn-print')">Wydruk kwitu wagowego<!--TODO--></b-dropdown-item>
          <b-dropdown-item @click="openPrintForm('roll')">Wydruk kwitu wagowego (rolka)<!--TODO--></b-dropdown-item>
          <b-dropdown-item @click="openPrintForm('with-turn')">Wydruk kwitu wagowego ze skrętem<!--TODO--></b-dropdown-item>
        </b-dropdown>
        <b-dropdown variant="outline-secondary" class="ml-1" :text="$t('commands.more')" size="sm"> </b-dropdown>
      </b-row>
      <b-row class="mt-4">
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.number')" label-for="numer">
            <b-input-group>
              <b-form-input id="object-number" v-model="numberStr" name="number" size="sm" />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.status')" label-for="status">
            <b-input-group>
              <b-form-select id="order_status" v-model="state" :options="deliveryNoteStates" text-field="name" value-field="value" name="status" size="sm" />
              <b-input-group-append>
                <b-form-checkbox class="ml-3 mt-1" v-model="cancelWeighting" switch>
                  {{ $t('table.cancelWeighting') }}
                </b-form-checkbox>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.date')" label-for="numer">
            <b-input-group>
              <!-- <b-form-datepicker id="order_date" v-model="date" name="date" size="sm"
                aria-describedby="statusFeedback"></b-form-datepicker> -->
              <date-picker id="order_date" v-model="date" name="date" value-type="date" type="datetime" size="sm"></date-picker>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.docType')" label-for="status">
            <b-form-select id="order_status" v-model="typeOfDocument" :options="typesOfDocuments" text-field="name" value-field="value" name="status" size="sm" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-if="typeOfDocument === 'Automobile'">
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.carNumber')" label-for="vehicleId">
            <f-select v-model="vehicle" select-btn open-btn value-type="vehicles" detail-view="cars" placeholder="Wyszukaj samochód..."> </f-select>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.trailer')" label-for="trailerId">
            <f-select v-model="trailer" select-btn open-btn value-type="vehicles" detail-view="trailers" placeholder="Wyszukaj naczepe..."> </f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-if="typeOfDocument === 'Automobile'">
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.driver')" label-for="driverId">
            <f-select v-model="driver" select-btn open-btn value-type="drivers" detail-view="driver-form" placeholder="Wyszukaj kierowce..."> </f-select>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.idNumber')" label-for="idNumber">
            <b-input-group>
              <b-form-input id="object-idNumber" v-model="TODO" name="idNumber" size="sm" disabled />
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <!-- <b-row v-if="typeOfDocument === 'Railway'">
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.trainNumber')" label-for="vehicle">
            <f-select v-model="vehicle" select-btn open-btn value-type="vehicles" detail-view="trains" placeholder="Wyszukaj pociąg..."> </f-select>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.carriageNumber')" label-for="vehicle">
            <f-select v-model="trailer" select-btn open-btn value-type="vehicles" detail-view="vehicle" placeholder="Wyszukaj wagon..."> </f-select>
          </b-form-group>
        </b-col>
      </b-row> -->
      <b-row v-if="typeOfDocument === 'Railway'">
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.trainNumber')" label-for="vehicle">
            <b-form-input size="sm" v-model="trainNumber"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.carriageNumber')" label-for="vehicle">
            <f-select v-model="vehicle" select-btn open-btn value-type="vehicles" detail-view="vehicle" placeholder="Wyszukaj wagon..."> </f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.ship')" label-for="ship">
            <f-select v-model="ship" select-btn open-btn value-type="ships" detail-view="ship-detail" placeholder="Wyszukaj statek..."></f-select>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.schemeOfCargo')" label-for="schemeOfCargo">
            <f-select v-model="schemeOfCargo" select-btn open-btn value-type="schemesOfCargo" detail-view="scheme-of-cargo" placeholder="Wyszukaj relację..."> </f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.disposition')" label-for="disposition">
            <f-select v-model="disposition" select-btn open-btn value-type="dispositions" detail-view="disposition" placeholder="Wyszukaj dyspozycje..." label="number"> </f-select>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.typeOfOperation')" label-for="typeOfOperation">
            <b-input-group>
              <b-form-select id="order_status" v-model="typeOfOperation" :options="typesOfOperations" text-field="name" value-field="value" name="status" size="sm" />
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.forwarder')" label-for="forwarder">
            <f-select v-model="forwarder" select-btn open-btn value-type="vendorsAndCustomers" detail-view="forwarder-detail" placeholder="Wyszukaj spedytora..."></f-select>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.position')" label-for="position">
            <f-select v-model="position" select-btn open-btn value-type="positions" detail-view="position" placeholder="Wyszukaj pozycje..."> </f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.customer')" label-for="customer">
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
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.mine')" label-for="mine">
            <f-select v-model="mine" select-btn open-btn value-type="mines" detail-view="mine-detail" placeholder="Wyszukaj kopalnie..."> </f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.vendor')" label-for="vendor">
            <f-select v-model="vendor" select-btn open-btn value-type="vendorsAndCustomers" detail-view="vendor-detail" placeholder="Wyszukaj dostawcę..."></f-select>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.product')" label-for="product">
            <f-select v-model="product" select-btn open-btn value-type="products" detail-view="product" placeholder="Wyszukaj towar..."> </f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.warehouse')" label-for="warehouse">
            <f-select v-model="warehouse" select-btn open-btn value-type="warehouses" detail-view="warehouse-detail" placeholder="Wyszukaj magazyn..."></f-select>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.quantity')" label-for="quantity">
            <b-input-group>
              <b-form-input id="object-quantity" v-model="quantity" name="quantity" size="sm" type="number" />
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.warehouseSection')" label-for="warehouseSection">
            <f-select v-model="box" select-btn open-btn value-type="boxes" detail-view="box-detail" placeholder="Wyszukaj sektor magazynu..."></f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-tabs>
        <b-tab title="Dane z wagi" active>
          <b-row class="mt-4">
            <b-col md="4">
              <h5>{{ $t('table.brutto') }}</h5>
              <b-form-group horizontal :label-cols="3" :label="$t('table.scaleBrutto')" label-for="scaleBrutto">
                <f-select v-model="scaleBrutto" select-btn open-btn value-type="scales" detail-view="scale-detail" placeholder="Wyszukaj wagę..."></f-select>
              </b-form-group>
              <b-form-group horizontal :label-cols="3" :label="$t('table.brutto')" label-for="brutto">
                <b-input-group>
                  <b-form-input id="object-brutto" v-model="brutto" name="brutto" size="sm" type="number" />
                </b-input-group>
              </b-form-group>
              <b-form-group horizontal :label-cols="3" :label="$t('table.bruttoTime')" label-for="bruttoTime">
                <!-- <b-form-datepicker id="brutto_time" v-model="bruttoTime" name="bruttoTime"
                  size="sm"></b-form-datepicker> -->
                <date-picker id="brutto_time" v-model="bruttoTime" name="bruttoTime" value-type="date" type="datetime" size="sm"></date-picker>
              </b-form-group>
              <b-form-group horizontal :label-cols="3" :label="$t('table.bruttoAuthor')" label-for="bruttoAuthor">
                <f-select v-model="bruttoAuthor" select-btn open-btn value-type="users" detail-view="user-detail" placeholder="Wyszukaj wykonawcę brutto..."></f-select>
              </b-form-group>
            </b-col>
            <b-col md="4">
              <h5>{{ $t('table.tare') }}</h5>
              <b-form-group horizontal :label-cols="3" :label="$t('table.scaleTare')" label-for="scaleTare">
                <f-select v-model="scaleTare" select-btn open-btn value-type="scales" detail-view="scale-detail" placeholder="Wyszukaj wagę..."></f-select>
              </b-form-group>
              <b-form-group horizontal :label-cols="3" :label="$t('table.tare')" label-for="tare">
                <b-input-group>
                  <b-form-input id="object-tare" v-model="tare" name="tare" size="sm" type="number" />
                </b-input-group>
              </b-form-group>
              <b-form-group horizontal :label-cols="3" :label="$t('table.tareTime')" label-for="tareTime">
                <!-- <date-picker id="tare_time" v-model="tareTime" name="tareTime" size="sm" type="datetime" :time-picker-options="timePickerOptions"></date-picker> -->
                <!-- <date-picker id="tare_time" v-model="tareTime" value-type="format" type="datetime" :time-picker-options="timePickerOptions" ></date-picker> -->
                <!-- <date-picker id="tare_time" v-model="tareTime" value-type="format" type="date"></date-picker> -->
                <!-- <date-picker id="tare_time" v-model="tareTime" value-type="format" type="time"></date-picker> -->
                <date-picker id="tare_time" v-model="tareTime" name="tareTime" value-type="date" type="datetime" size="sm"></date-picker>
              </b-form-group>
              <b-form-group horizontal :label-cols="3" :label="$t('table.tareAuthor')" label-for="tareAuthor">
                <f-select v-model="tareAuthor" select-btn open-btn value-type="users" detail-view="user-detail" placeholder="Wyszukaj wykonawcę tary..."></f-select>
              </b-form-group>
            </b-col>
            <b-col md="4">
              <h5>{{ $t('table.netto') }}</h5>
              <b-form-group horizontal :label-cols="3" :label="$t('table.scaleNetto')" label-for="scaleNetto">
                <f-select v-model="scaleNetto" select-btn open-btn value-type="scales" detail-view="scale-detail" placeholder="Wyszukaj wagę..."></f-select>
              </b-form-group>
              <b-form-group horizontal :label-cols="3" :label="$t('table.netto')" label-for="netto">
                <b-input-group>
                  <b-form-input id="object-netto" v-model="netto" name="netto" size="sm" type="number" />
                </b-input-group>
              </b-form-group>
              <b-form-group horizontal :label-cols="3" :label="$t('table.nettoTime')" label-for="nettoTime">
                <!-- <b-form-datepicker id="netto_time" v-model="nettoTime" name="nettoTime" size="sm"></b-form-datepicker> -->
                <date-picker id="netto_time" v-model="nettoTime" name="nettoTime" value-type="date" type="datetime" size="sm"></date-picker>
              </b-form-group>
              <b-form-group horizontal :label-cols="3" :label="$t('table.nettoAuthor')" label-for="nettoAuthor">
                <f-select v-model="nettoAuthor" select-btn open-btn value-type="users" detail-view="user-detail" placeholder="Wyszukaj wykonawcę netto..."></f-select>
              </b-form-group>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Dane z wagonu" :disabled="typeOfDocument !== 'Railway'">
          <b-row class="mt-4">
            <b-col md="12">
              <b-form-group horizontal :label-cols="3" :label="$t('table.approved')" label-for="approved">
                <b-form-checkbox id="approved" v-model="approved" name="approved" size="sm" switch></b-form-checkbox>
              </b-form-group>
              <b-form-group horizontal :label-cols="3" :label="$t('table.approvedDate')" label-for="approvedDate">
                <b-form-datepicker id="approved_date" v-model="approvedDate" name="approvedDate" size="sm"></b-form-datepicker>
              </b-form-group>
              <b-form-group horizontal :label-cols="3" :label="$t('table.approvedAuthor')" label-for="approvedAuthor">
                <f-select v-model="approvedAuthor" select-btn open-btn value-type="users" detail-view="user-detail" placeholder="Przyjął..."></f-select>
              </b-form-group>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Zdjęcia">
            <b-container @click="showModal = true">
                <b-row>
                    <b-col v-for="(photo, index) in photos" :key="index">
                        <b-img  thumbnail fluid :src="getPhotoSrc(photo)" alt="Zdjęcia" size="sm"></b-img>
                    </b-col>
                </b-row>
            </b-container>
            <b-modal v-model="showModal" size="lg" centered hide-footer>
                <b-carousel
                        controls
                        indicators
                >
                    <b-carousel-slide
                            v-for="(photo, index) in photos"
                            :key="index"
                            :img-src="getPhotoSrc(photo)"
                    ></b-carousel-slide>
                </b-carousel>
            </b-modal>
        </b-tab>
      </b-tabs>
      <b-row class="mt-4">
        <b-col>
          <p class="mt-2">{{ $t('table.descComment') }}</p>
          <b-form-textarea id="textarea" v-model="comment" placeholder="Wprowadz komentarz..." rows="3" max-rows="6"></b-form-textarea>
        </b-col>
      </b-row>
    </b-card>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import TypesOfDocuments from '@/constants/documentTypes'
import TypesOfOperations from '@/constants/operationTypes'
import DeliveryNoteStates from '@/constants/deliveryNoteStatuses'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import PageHeader from '@/components/page-header.vue'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import moment from 'moment'
import { getPhoto } from '@/utils/get-photo-buffer.js'

export default {
  name: 'DeliveryNoteDetail',

  page() {
    return { title: this.$t('common.deliveryNoteData'), meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: { Layout, PageHeader, DatePicker },

  data() {
    return {
      title: this.$t('common.deliveryNoteData'),

      typesOfDocuments: [],
      typesOfOperations: [],
      deliveryNoteStates: [],

      viewId: this.$route.params.id,

      tareTimeTemp: null,
      readOnly: this.$route.meta.isReadOnly,
      photos: [],
      showModal: false,
    }
  },

  async created() {
    await this.initialize()
    await this.getPhotoBuffer()
  },

  computed: {
    ...mapGetters({
      getObjectView: 'deliveryNotes/objectView',
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

    numberStr: {
      get() {
        return this.objectView ? this.objectView.object.numberStr : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'numberStr', value })
      },
    },

    date: {
      get() {
        return this.objectView ? (this.object.date ? new Date(this.object.date) : null) : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'date', value: value })
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

    state: {
      get() {
        return this.objectView ? this.objectView.object.state : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'state', value })
      },
    },

    cancelWeighting: {
      get() {
        return this.objectView ? this.object.cancelWeighting : false
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'cancelWeighting', value })
      },
    },

    quantity: {
      get() {
        return this.objectView ? this.objectView.object.quantity : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'quantity', value })
      },
    },

    netto: {
      get() {
        return this.objectView ? this.objectView.object.netto : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'netto', value })
      },
    },

    tare: {
      get() {
        return this.objectView ? this.objectView.object.tare : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'tare', value })
      },
    },

    brutto: {
      get() {
        return this.objectView ? this.objectView.object.brutto : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'brutto', value })
      },
    },

    approved: {
      get() {
        return this.objectView ? this.objectView.object.approved : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'approved', value })
      },
    },

    approvedDate: {
      get() {
        return this.objectView ? (this.object.approvedDate ? new Date(this.object.approvedDate) : null) : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'approvedDate', value: moment(value).format('YYYY-MM-DD') })
      },
    },

    nettoTime: {
      get() {
        return this.objectView ? (this.object.nettoTime ? new Date(this.object.nettoTime) : null) : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'nettoTime', value: value })
      },
    },

    tareTime: {
      get() {
        return this.objectView ? (this.object.tareTime ? new Date(this.object.tareTime) : null) : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'tareTime', value: value })
      },
    },

    bruttoTime: {
      get() {
        return this.objectView ? (this.object.bruttoTime ? new Date(this.object.bruttoTime) : null) : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'bruttoTime', value: value })
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

    schemeOfCargo: {
      get() {
        return this.objectView ? this.object.schemeOfCargo : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'schemeOfCargo', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'schemeOfCargoId', value: value ? value.id : value })
      },
    },

    customer: {
      get() {
        return this.objectView ? this.object.customer : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'customer', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'customerId', value: value ? value.id : value })
      },
    },

    mine: {
      get() {
        return this.objectView ? this.object.mine : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'mine', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'mineId', value: value ? value.id : value })
      },
    },

    driver: {
      get() {
        return this.objectView ? this.object.driver : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'driver', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'driverId', value: value ? value.id : value })
      },
    },

    forwarder: {
      get() {
        return this.objectView ? this.object.forwarder : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'forwarder', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'forwarderId', value: value ? value.id : value })
      },
    },

    position: {
      get() {
        return this.objectView ? this.object.position : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'position', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'positionId', value: value ? value.id : value })
      },
    },

    disposition: {
      get() {
        return this.objectView ? this.object.disposition : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'disposition', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'dispositionId', value: value ? value.id : value })
      },
    },

    approvedAuthor: {
      get() {
        return this.objectView ? this.object.approvedAuthor : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'approvedAuthor', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'approvedAuthorId', value: value ? value.id : value })
      },
    },

    vendor: {
      get() {
        return this.objectView ? this.object.vendor : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'vendor', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'vendorId', value: value ? value.id : value })
      },
    },

    ship: {
      get() {
        return this.objectView ? this.object.ship : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'ship', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'shipId', value: value ? value.id : value })
      },
    },

    vehicle: {
      get() {
        return this.objectView ? this.object.vehicle : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'vehicle', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'vehicleId', value: value ? value.id : value })
      },
    },

    trailer: {
      get() {
        return this.objectView ? this.object.trailer : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'trailer', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'trailerId', value: value ? value.id : value })
      },
    },

    warehouse: {
      get() {
        return this.objectView ? this.object.warehouse : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'warehouse', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'warehouseId', value: value ? value.id : value })
      },
    },

    box: {
      get() {
        return this.objectView ? this.object.box : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'box', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'boxId', value: value ? value.id : value })
      },
    },

    product: {
      get() {
        return this.objectView ? this.object.product : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'product', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'productId', value: value ? value.id : value })
      },
    },

    bruttoAuthor: {
      get() {
        return this.objectView ? this.object.bruttoAuthor : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'bruttoAuthor', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'bruttoAuthorId', value: value ? value.id : value })
      },
    },

    nettoAuthor: {
      get() {
        return this.objectView ? this.object.nettoAuthor : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'nettoAuthor', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'nettoAuthorId', value: value ? value.id : value })
      },
    },

    tareAuthor: {
      get() {
        return this.objectView ? this.object.tareAuthor : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'tareAuthor', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'tareAuthorId', value: value ? value.id : value })
      },
    },

    scaleBrutto: {
      get() {
        return this.objectView ? this.object.scaleBrutto : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'scaleBrutto', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'scaleBruttoId', value: value ? value.id : value })
      },
    },

    scaleNetto: {
      get() {
        return this.objectView ? this.object.scaleNetto : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'scaleNetto', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'scaleNettoId', value: value ? value.id : value })
      },
    },

    scaleTare: {
      get() {
        console.log('scale tara', this.object.scaleTare)
        return this.objectView ? this.object.scaleTare : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'scaleTare', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'scaleTareId', value: value ? value.id : value })
      },
    },

    trainNumber: {
      get() {
        return this.objectView ? this.object.trainNumber : ''
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'trainNumber', value })
      },
    },
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'deliveryNotes/setObjectViewProperty',
      setObjectProperty: 'deliveryNotes/setObjectProperty',
      delObjectView: 'deliveryNotes/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async initialize() {
      this.typesOfDocuments = this.loadEnums(TypesOfDocuments)
      this.typesOfOperations = this.loadEnums(TypesOfOperations)
      this.deliveryNoteStates = this.loadEnums(DeliveryNoteStates)
    },

    loadEnums(enumVar) {
      const finalList = []
      for (let i = 0; i < enumVar.length; i++) {
        finalList.push({ name: enumVar[i], value: enumVar[i] })
      }
      return finalList
    },

    openPrintForm(printName) {
      // this.$router.push({ name: printName, params: { id: this.viewId, object: this.object, routeOwner: 'delivery-note-detail', isPrintAndClosed: true } })

      const queryParams = {
        name: printName,
        id: this.viewId,
        object: this.object,
        routeOwner: 'delivery-note-detail',
        isPrintAndClosed: false,
      }
      this.$store.dispatch('printForms/addPrint', queryParams)
      this.$router.push({ name: printName, params: { id: printName + '-' + this.viewId } })
    },

    async writeObject(close) {
      let response
      if (this.object.isNew) {
        console.log('create object: ', this.object)
        response = await this.$store.dispatch('deliveryNotes/create', this.object)
      } else {
        response = await this.$store.dispatch('deliveryNotes/update', this.object)
      }

      if (response.status && response.status === 200) {
        this.$bvToast.toast('Zlecenie zostalo zapisane', {
          title: this.$tc('common.msg'),
          variant: 'success',
          solid: true,
          autoHideDelay: 2000,
        })
        if (close === true) {
          this.closeView()
        }
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
      await this.$router.push({ name: 'delivery-notes' })
      console.log('closeView deliveryNote')
    },

    createDisposition() {},

    onSortingChanged() {},

    async getPhotoBuffer() {
      if (this.objectView.object.createdAt) {
        // object: Object
        // viewId:
        //updatedAt
        const photo = await getPhoto()
        console.log(photo)
        if (photo.data.length) {
          for (const el of photo.data) {
            this.photos.push(el.data)
          }
        }
      }
    },
    getPhotoSrc(photo) {
      return `data:image/jpeg;base64,${Buffer.from(photo).toString('base64')}`
    },
  },
}
</script>
