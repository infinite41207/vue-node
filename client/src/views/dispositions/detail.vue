<template>
  <Layout>
    <PageHeader :title="title" />

    <b-card>
      <b-row class="align-items-center m-1 toggle-btns-group flex-nowrap">
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
        <b-button variant="outline-secondary" class="mr-1" size="sm" @click="subordinationShowMode = true">
          <i class="ri-node-tree"></i>
        </b-button>
        <b-dropdown variant="outline-secondary" :text="$t('commands.createFrom')" size="sm">
          <b-dropdown-item @click="createDisposition">Dyspozycję</b-dropdown-item>
        </b-dropdown>
        <b-dropdown variant="outline-secondary" :text="$t('commands.print')" class="ml-1" size="sm">
          <b-dropdown-item @click="openPrintForm('main-d-print')">Dyspozycja</b-dropdown-item>
          <b-dropdown-item @click="openPrintForm('to-weight')">Dyspozfycja (na wagę) </b-dropdown-item>
          <b-dropdown-item @click="openPrintForm('main-and-card')">Dyfspozycja i karta towaru</b-dropdown-item>
          <b-dropdown-item @click="openPrintForm('product-card')">Karta towaru</b-dropdown-item>
        </b-dropdown>
        <b-button variant="outline-secondary" v-if="object.id" class="ml-1" size="sm" @click="handleCreateBP">
          <span v-if="!isProcessing">Utwórz proces</span>
          <div v-if="isProcessing">
            <b-spinner small type="grow"></b-spinner>
            Przetwarzanie...
          </div>
        </b-button>
        <b-button variant="outline-secondary" id="analyze-btn" v-if="object.id" :disabled="!activeStage" class="ml-1" size="sm" @click="showProcessModal">
          Analiza procesu
        </b-button>
        <b-dropdown variant="outline-secondary" class="ml-1" id="more-btn" :text="$t('commands.more')" size="sm">
          <b-dropdown-item />
        </b-dropdown>
      </b-row>

      <bpAnalyze
        v-if="openBpDefinitions.stages"
        :nodes="openBpDefinitions.stages"
        :activeStage="activeStage"
        :isShow="isShowAnalyze"
        :isProcessing="isProcessing"
        :histories="histories"
        @handleNext="handleGoNext"
        @onClose="
          () => {
            this.isShowAnalyze = false
          }
        "
      />

      <b-row class="mt-4">
        <b-col md="3">
          <b-form-group :label-cols="3" :label="$t('table.number')" label-for="object-number">
            <b-form-input id="object-number" v-model="numberStr" name="number" size="sm" />
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group :label-cols="3" :label="$t('table.date')" label-for="order_date">
            <!-- <b-form-datepicker id="order_date" v-model="date" name="date" size="sm"
                            aria-describedby="statusFeedback"></b-form-datepicker> -->
            <date-picker id="order_date" v-model="date" name="date" value-type="date" type="datetime" size="sm"></date-picker>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group :label-cols="3" :label="$t('table.docType')" label-for="order_type">
            <b-form-select id="order_type" v-model="typeOfDocument" :options="typesOfDocuments" text-field="text" value-field="value" name="orderTypeName" size="sm" />
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group :label-cols="3" :label="$t('table.status')" label-for="status">
            <f-select v-model="status" select-btn open-btn value-type="dispositionStatuses" detail-view="disposition-statuses-form" placeholder="Wyszukaj status..."></f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3">
          <b-form-group horizontal :label-cols="3" :label="$t('table.disposition')">
            <b-form-select id="operation_type" v-model="type" :options="dispositionTypes" text-field="text" value-field="value" name="dispositionName" size="sm" />
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group horizontal :label-cols="3" :label="$t('table.weighingStation')">
            <f-select v-model="weighingStation" select-btn open-btn value-type="weighingStations" detail-view="detail" placeholder="Wyszukaj stanowisko wagowe..."> </f-select>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group horizontal :label-cols="3" :label="$t('table.scale')">
            <f-select v-model="scale" select-btn open-btn value-type="scales" detail-view="detail" placeholder="Wyszukaj wagę..."> </f-select>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group horizontal :label-cols="3" :label="$t('table.scale2')">
            <f-select v-model="scaleTwo" select-btn open-btn value-type="scales" detail-view="detail" placeholder="Wyszukaj wagę..."> </f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.driver')" label-for="order_driver">
            <f-select v-model="driver" select-btn open-btn value-type="drivers" detail-view="detail" placeholder="Wyszukaj kierowcę..."> </f-select>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.carQueueStatus')" label-for="numer">
            <b-form-select id="order_status" v-model="carsQueueStatus" :options="carQueueStatuses" text-field="text" value-field="value" name="carQueesStatusName" size="sm" />
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.driverPhoneNumber')" label-for="numer">
            <b-form-input id="driverPhoneNumberId" v-model="driverPhoneNumber" name="driverPhoneNumberName" size="sm" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.carNumber')" label-for="vehicleId">
            <f-select v-model="vehicle" select-btn open-btn value-type="vehicles" detail-view="cars" placeholder="Wyszukaj samochód..."> </f-select>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.trailer')" label-for="trailerId">
            <f-select v-model="trailer" select-btn open-btn value-type="vehicles" detail-view="trailers" placeholder="Wyszukaj naczepe..."> </f-select>
          </b-form-group>
        </b-col>
        <b-col md="4" class="mt-1">
          <!-- <b-form-group horizontal :label-cols="3" :label="$t('table.idNumber')" label-for="numer">
                        <a> {{ $t('table.idNumber') }} <b> {{ driver.idCard }} </b> </a>
                    </b-form-group> -->
          <a>
            {{ $t('table.idNumber') }} : <b> {{ driver === null ? '' : driver.idCard }} </b>
          </a>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.parkingAriveDateAndTime')" label-for="numer">
            <!-- <b-form-select id="arrivalDateDriver" v-model="parkingAriveDateAndTime" :options="typesOfDocuments"
                            text-field="text" value-field="value" name="typeOfDocument" size="sm" /> -->
            <!-- <b-form-datepicker id="arrivalDateDriver" v-model="arrivalDateDriver" name="arrivalDateDriver" size="sm" aria-describedby="statusFeedback"></b-form-datepicker> -->
            <date-picker id="arrivalDateDriver" v-model="arrivalDateDriver" name="arrivalDateDriver" value-type="date" type="datetime" size="sm"></date-picker>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <!-- Start of left side -->
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.carrier')" label-for="carrier">
            <f-select v-model="carrier" select-btn open-btn value-type="carriers" detail-view="carrier-detail" placeholder="Wyszukaj przewoźnika..."></f-select>
          </b-form-group>
          <b-form-group horizontal :label-cols="3" :label="$t('table.deliveryOrder')">
            <f-select v-model="base" select-btn open-btn value-type="deliveryOrders" detail-view="delivery-order-detail" label="number" placeholder="Wyszukaj podstawę...">
            </f-select>
          </b-form-group>
          <b-form-group horizontal :label-cols="3" :label="$t('table.item')">
            <f-select v-model="product" select-btn open-btn value-type="products" detail-view="assortment-detail" placeholder="Wyszukaj produkt..."></f-select>
          </b-form-group>
          <b-form-group horizontal :label-cols="3" :label="$t('table.ship')" label-for="ship">
            <f-select v-model="ship" select-btn open-btn value-type="ships" detail-view="ship-detail" placeholder="Wyszukaj statek..."></f-select>
          </b-form-group>
          <b-form-group horizontal :label-cols="3" :label="$t('table.schemeOfCargo')" label-for="numer">
            <f-select v-model="schemeOfCargo" select-btn open-btn value-type="schemesOfCargo" detail-view="scheme-of-cargo" placeholder="Wyszukaj relację..."> </f-select>
          </b-form-group>
          <b-form-group horizontal :label-cols="3" :label="$t('table.forwarder')" label-for="forwarder">
            <f-select
              v-model="forwarder"
              select-btn
              open-btn
              value-type="vendorsAndCustomers"
              detail-view="vendors-and-customers-detail"
              placeholder="Wyszukaj spedytora..."
            ></f-select>
          </b-form-group>
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
          <b-form-group horizontal :label-cols="3" :label="$t('table.warehouseSection')" label-for="warehouseSection">
            <f-select v-model="box" select-btn open-btn value-type="boxes" detail-view="box-detail" placeholder="Wyszukaj sektor magazynu..."></f-select>
          </b-form-group>
          <b-form-group horizontal :label-cols="3" :label="$t('table.warehouseSquare')" label-for="warehouse">
            <f-select v-model="warehouse" select-btn open-btn value-type="warehouses" detail-view="warehouse-detail" placeholder="Wyszukaj magazyn..."></f-select>
          </b-form-group>

          <div v-if="typeOfDocument !== 'Railway'">
            <b-row class="mb-2" style="display: flex; align-items: center">
              <b-col cols="3">
                <p>{{ $t('table.tests') }}</p>
              </b-col>
              <b-col cols="1">
                <b-checkbox v-model="useResearch"> </b-checkbox>
              </b-col>
              <b-col cols="8">
                <b-form-select size="sm" v-model="researchResult" :options="researchResults"></b-form-select>
              </b-col>
            </b-row>

            <b-form-group horizontal :label-cols="3" :label="$t('table.dateOfTest')" label-for="researchDate">
              <!-- <b-form-datepicker id="researchDate" v-model="researchDate" name="date" size="sm"
                                aria-describedby="statusFeedback"> </b-form-datepicker> -->
              <date-picker id="researchDate" v-model="researchDate" name="researchDate" value-type="date" type="datetime" size="sm"></date-picker>
            </b-form-group>
          </div>

          <div v-if="typeOfDocument === 'Railway'">
            <b-form-group horizontal :label-cols="3" :label="$t('table.actualWarehouse')" label-for="warehouse">
              <f-select v-model="actualWarehouse" select-btn open-btn value-type="warehouses" detail-view="warehouse-detail" placeholder="Wyszukaj miejsce założenia..."></f-select>
            </b-form-group>
            <!-- <b-form-group horizontal :label-cols="3" :label="$t('table.approvedDate')"
                            label-for="researchDate">
                            <b-form-datepicker id="approvedDate" v-model="approvedDate" name="date" size="sm" aria-describedby="statusFeedback"></b-form-datepicker>
                        </b-form-group> -->
            <b-form-group horizontal :label-cols="3" :label="$t('table.approvedDate')" label-for="approvedDate">
              <!-- <b-form-datepicker id="approvedDate" v-model="approvedDate" name="date" size="sm" aria-describedby="statusFeedback"></b-form-datepicker> -->
              <date-picker id="approvedDate" v-model="approvedDate" name="approvedDate" value-type="date" type="datetime" size="sm"></date-picker>
            </b-form-group>
          </div>

          <b-row class="mb-2" style="display: flex; align-items: center">
            <b-col cols="3">
              <p>{{ $t('table.numberAndDateDSKAndMRN') }}</p>
            </b-col>
            <b-col cols="5">
              <b-form-input size="sm" v-model="customsNumber"></b-form-input>
            </b-col>
            <b-col cols="4">
              <!-- <b-form-datepicker id="dateIssueDSK" v-model="dateIssueDSK" name="date" size="sm" aria-describedby="statusFeedback"></b-form-datepicker> -->
              <date-picker id="dateIssueDSK" v-model="dateIssueDSK" name="dateIssueDSK" value-type="date" type="date" size="sm"></date-picker>
            </b-col>
          </b-row>
        </b-col>

        <!-- End of left side -->

        <!-- Start of right side -->
        <b-col md="6">
          <div v-if="typeOfDocument === 'Railway'">
            <b-form-group horizontal :label-cols="3" :label="$t('table.trainNumber')">
              <b-form-input size="sm" v-model="trainNumber"></b-form-input>
            </b-form-group>

            <!-- Here has to be container number -->
          </div>
          <b-form-group horizontal :label-cols="3" :label="$t('table.declaredTonnage')">
            <b-form-input size="sm" v-model="quantity" type="number"></b-form-input>
          </b-form-group>
          <b-form-group horizontal :label-cols="3" :label="$t('table.operationType')">
            <b-form-select id="typesOfOperationsId" v-model="typeOfOperation" :options="typesOfOperations" name="typesOfOperations" size="sm" />
          </b-form-group>

          <div v-if="typeOfDocument !== 'Railway'">
            <b-row>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.multiple')">
                  <b-form-input id="numberOfWeighingsId" size="sm" v-model="numberOfWeighings" type="number"> </b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.retaring')">
                  <b-form-input id="retarningId" size="sm" v-model="retarning" type="number"> </b-form-input>
                </b-form-group>
              </b-col>

              <b-col>
                <b-form-group horizontal :label-cols="3" :label="$t('table.done')" label-for="customer">
                  <b-form-input id="numberOfWeightedId" size="sm" v-model="numberOfWeighted" type="number"> </b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-form-group v-if="numberOfWeighings > 1" horizontal :label-cols="3" :label="$t('table.allowRetaring')">
              <b-form-checkbox id="allowRetaringId" v-model="allowRetaring" class="mt-1"></b-form-checkbox>
            </b-form-group>

            <b-form-group horizontal :label-cols="3" :label="$t('table.station')" label-for="numer">
              <f-select v-model="position" select-btn open-btn value-type="positions" detail-view="detail" placeholder="Wyszukaj stanowisko..."> </f-select>
            </b-form-group>
            <b-form-group horizontal :label-cols="3" :label="$t('table.assortment')">
              <f-select v-model="assortment" select-btn open-btn value-type="assortments" detail-view="assortment-detail" placeholder="Wyszukaj sortyment..."></f-select>
            </b-form-group>
            <b-form-group horizontal :label-cols="3" :label="$t('table.allowSetZero')">
              <b-form-checkbox id="allowSetZeroId" v-model="allowSetZero" class="mt-1"></b-form-checkbox>
            </b-form-group>

            <b-form-group horizontal :label-cols="3" label="GMP+">
              <b-form-checkbox id="gmp" v-model="gmp" class="mt-1"></b-form-checkbox>
            </b-form-group>
          </div>
          <div v-if="typeOfDocument === 'Railway'">
            <b-form-group horizontal :label-cols="3" :label="$t('table.station')" label-for="numer">
              <f-select v-model="position" select-btn open-btn value-type="positions" detail-view="detail" placeholder="Wyszukaj stanowisko..."> </f-select>
            </b-form-group>
            <b-form-group horizontal :label-cols="3" :label="$t('table.mine')">
              <f-select v-model="mine" select-btn open-btn value-type="mines" detail-view="mine-detail" placeholder="Wyszukaj kopalnie..."> </f-select>
            </b-form-group>
            <b-form-group horizontal :label-cols="3" :label="$t('table.assortment')">
              <f-select v-model="assortment" select-btn open-btn value-type="assortments" detail-view="assortment-detail" placeholder="Wyszukaj sortyment..."></f-select>
            </b-form-group>
            <b-form-group horizontal :label-cols="3" :label="$t('table.advicesNumber')">
              <b-form-input id="advicesNumber" size="sm" v-model="advicesNumber"> </b-form-input>
            </b-form-group>
            <b-form-group horizontal :label-cols="3" :label="$t('table.deliveryNoteNumber')">
              <b-form-input id="deliveryNoteNumber" size="sm" v-model="deliveryNoteNumber"> </b-form-input>
            </b-form-group>
            <b-form-group horizontal :label-cols="3" label="GMP+">
              <b-form-checkbox id="gmp" v-model="gmp"></b-form-checkbox>
            </b-form-group>
          </div>
        </b-col>
        <!-- End of right side -->
      </b-row>

      <b-tabs>
        <b-tab title="Komentarz" active>
          <b-row class="mt-3">
            <b-col>
              <b-button variant="success" @click="writeObject" class="mr-1" size="sm"> Dodaj korespondencję </b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <p class="mt-2">{{ $t('table.correspondence') }}</p>
              <b-form-textarea id="textarea" v-model="correspondence" placeholder="Enter something..." rows="3" max-rows="6"></b-form-textarea>
            </b-col>
            <b-col md="6">
              <p class="mt-2">{{ $t('table.descComment') }}</p>
              <b-form-textarea id="textarea" v-model="comment" placeholder="Enter something..." rows="3" max-rows="6"></b-form-textarea>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Usługi"> </b-tab>
        <b-tab title="Kary kierowcy"> </b-tab>
        <b-tab title="Kody wjazdowe">
          <b-col class="mt-3">
            <b-form-group horizontal :label-cols="3" :label="$t('table.barCode')">
              <b-form-input id="barCodeId" size="sm" v-model="barCode"> </b-form-input>
            </b-form-group>
            <b-form-group horizontal :label-cols="3" :label="$t('table.driverTicket')">
              <b-form-input id="driverTicketId" size="sm" v-model="driverTicket"> </b-form-input>
            </b-form-group>
            <b-form-group horizontal :label-cols="3" :label="$t('table.entryTicket')">
              <b-form-input id="entryTicketId" size="sm" v-model="entryTicket"> </b-form-input>
            </b-form-group>
          </b-col>
        </b-tab>
      </b-tabs>

      <b-form-group class="mt-2" style="max-width: 49%" horizontal :label-cols="3" :label="$t('table.dispositionAuthor')">
        <f-select v-model="author" select-btn open-btn value-type="users" detail-view="user-detail" placeholder="Wyszukaj autora dyspozycji..."></f-select>
      </b-form-group>
    </b-card>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import bpAnalyze from './bp-analyze.vue'
import TypesOfDocuments from '@/constants/documentTypes'
import TypesOfOperations from '@/constants/operationTypes'
import ResearchResult from '@/constants/researchResult'
import DispositionTypes from '@/constants/dispositionTypes'
import CarQueueStatuses from '@/constants/carQueueStatuses'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import { fillByDeliveryOrder as serviceFillByDeliveryOrder } from '@/utils/disposition-service.js'

export default {
  name: 'DispositionDetail',

  setup: () => ({ v$: useVuelidate() }),

  page() {
    return { title: this.$t('common.dispositionData'), meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: { Layout, PageHeader, DatePicker, bpAnalyze },
  data() {
    return {
      title: this.$t('common.dispositionData'),
      openBpDefinitions: [],
      isShowAnalyze: false,
      activeStage: '',
      nextStage: '',
      isProcessing: false,

      typesOfDocuments: [],
      typesOfOperations: [],
      dispositionStates: [],
      dispositionTypes: [],
      carQueueStatuses: [],
      researchResults: [],

      isDocTypeRailway: true,

      services: [
        { key: 'count', label: 'N', sortable: true },
        { key: 'service', label: 'Service', sortable: true },
        { key: 'amount', label: 'Amount', sortable: true },
      ],

      viewId: this.$route.params.id,
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  validations() {
    return {
      date: { required },
      type: { required },
      typeOfDocument: { required },
      typeOfOperation: { required },
      status: { required },
      carsQueueStatus: { required },
      useResearch: { required },
      schemeOfCargo: { required },
      vehicle: { required },
      product: { required },
      scale: {
        required: requiredIf(() => !(this.scale || this.weighingStation)),
      },
      scaleTwo: {
        required: requiredIf(() => !(this.scaleTwo || this.weighingStation)),
      },
      quantity: { required },
    }
  },

  async mounted() {
    await this.initialize()
  },

  computed: {
    ...mapGetters({
      getObjectView: 'dispositions/objectView',
      currentLanguage: 'auth/currentLanguage',
      getHistories: 'bpHistories/histories',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    histories() {
      return this.getHistories
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
        return this.object.customer
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'customer', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'customerId', value: value ? value.id : value })
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

    vendor: {
      get() {
        return this.object.vendor
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'vendor', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'vendorId', value: value ? value.id : value })
      },
    },

    driver: {
      get() {
        return this.object.driver
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'driver', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'driverId', value: value ? value.id : value })
      },
    },

    mine: {
      get() {
        return this.object.mine
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'mine', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'mineId', value: value ? value.id : value })
      },
    },

    carrier: {
      get() {
        return this.object.carrier
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'carrier', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'carrierId', value: value ? value.id : value })
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

    position: {
      get() {
        return this.object.position
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'position', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'positionId', value: value ? value.id : value })
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

    scaleTwo: {
      get() {
        return this.object.scaleTwo
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'scaleTwo', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'scaleTwoId', value: value ? value.id : value })
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

    vehicle: {
      get() {
        return this.object.vehicle
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'vehicle', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'vehicleId', value: value ? value.id : value })
      },
    },

    trailer: {
      get() {
        return this.object.trailer
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'trailer', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'trailerId', value: value ? value.id : value })
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

    actualWarehouse: {
      get() {
        return this.object.actualWarehouse
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'actualWarehouse', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'actualWarehouseId', value: value ? value.id : value })
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

    trainNumber: {
      get() {
        return this.objectView ? this.objectView.object.trainNumber : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'trainNumber', value })
      },
    },

    deliveryNoteNumber: {
      get() {
        return this.objectView ? this.objectView.object.deliveryNoteNumber : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'deliveryNoteNumber', value })
      },
    },

    carsQueueStatus: {
      get() {
        return this.objectView ? this.objectView.object.carsQueueStatus : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'carsQueueStatus', value })
      },
    },

    approvedDate: {
      get() {
        // return this.objectView ? this.objectView.object.approvedDate : ''
        return this.objectView ? new Date(this.objectView.object.approvedDate) : null
      },
      set(value) {
        // this.setObjectProperty({ viewId: this.viewId, property: 'approvedDate', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'approvedDate', value: value })
      },
    },

    driverPhoneNumber: {
      get() {
        return this.objectView ? this.objectView.object.driverPhoneNumber : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'driverPhoneNumber', value })
      },
    },

    advicesNumber: {
      get() {
        return this.objectView ? this.objectView.object.advicesNumber : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'advicesNumber', value })
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

    allowRetaring: {
      get() {
        return this.objectView ? this.objectView.object.allowRetaring : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'allowRetaring', value })
      },
    },

    allowSetZero: {
      get() {
        return this.objectView ? this.objectView.object.allowSetZero : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'allowSetZero', value })
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

    type: {
      get() {
        return this.objectView ? this.objectView.object.type : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'type', value })
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
        return this.objectView ? new Date(this.objectView.object.dateIssueDSK) : null
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

    arrivalDateDriver: {
      get() {
        // return this.objectView ? moment(this.objectView.object.arrivalDateDriver).format('YYYY-MM-DD') : ''
        return this.objectView ? new Date(this.objectView.object.arrivalDateDriver) : null
      },
      set(value) {
        // this.setObjectProperty({ viewId: this.viewId, property: 'arrivalDateDriver', value: moment(value).format('YYYY-MM-DD') })
        this.setObjectProperty({ viewId: this.viewId, property: 'arrivalDateDriver', value: value })
      },
    },

    useResearch: {
      get() {
        return this.objectView ? this.objectView.object.useResearch : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'useResearch', value })
      },
    },

    researchResult: {
      get() {
        return this.objectView ? this.objectView.object.researchResult : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'researchResult', value })
      },
    },

    researchDate: {
      get() {
        // return this.objectView ? moment(this.objectView.object.researchDate).format('YYYY-MM-DD HH:mm') : ''
        return this.objectView ? new Date(this.objectView.object.researchDate) : null
      },
      set(value) {
        // this.setObjectProperty({ viewId: this.viewId, property: 'researchDate', value: moment(value).format('YYYY-MM-DD HH:mm') })
        this.setObjectProperty({ viewId: this.viewId, property: 'researchDate', value: value })
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

    status: {
      get() {
        return this.objectView ? this.object.status : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'status', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'statusId', value: value ? value.id : value })
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

    numberOfWeighings: {
      get() {
        return this.objectView ? this.objectView.object.numberOfWeighings : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'numberOfWeighings', value })
      },
    },

    numberOfWeighted: {
      get() {
        return this.objectView ? this.objectView.object.numberOfWeighted : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'numberOfWeighted', value })
      },
    },

    retarning: {
      get() {
        return this.objectView ? this.objectView.object.retarning : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'retarning', value })
      },
    },

    barCode: {
      get() {
        return this.objectView ? this.objectView.object.barCode : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'barCode', value })
      },
    },

    driverTicket: {
      get() {
        return this.objectView ? this.objectView.object.driverTicket : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'driverTicket', value })
      },
    },

    entryTicket: {
      get() {
        return this.objectView ? this.objectView.object.entryTicket : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'entryTicket', value })
      },
    },
  },

  watch: {
    base(newVal, oldVal) {
      console.log('change order = ', newVal)
      console.log('this = ', this)
      const docDisposition = serviceFillByDeliveryOrder(this, newVal, false)
      const { base, ...copyObject } = docDisposition
      Object.keys(copyObject).forEach((key) => {
        this[key] = copyObject[key]
      })
    },
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'dispositions/setObjectViewProperty',
      setObjectProperty: 'dispositions/setObjectProperty',
      delObjectView: 'dispositions/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
      findAllBP: 'bpExemplars/findAllItems',
      findAllHistory: 'bpHistories/findAllByPk',
    }),

    async initialize() {
      this.typesOfDocuments = this.loadEnums(TypesOfDocuments)
      this.typesOfOperations = this.loadEnums(TypesOfOperations)
      // this.dispositionStates = this.loadEnums(DispositionStates)
      this.dispositionTypes = this.loadEnums(DispositionTypes)
      this.carQueueStatuses = this.loadEnums(CarQueueStatuses)
      this.researchResults = this.loadEnums(ResearchResult)
      await this.loadDispStatuses()
      this.checkBpExemplar()
    },

    loadEnums(enumVar, objectVar) {
      const finalList = []
      for (let i = 0; i < enumVar.length; i++) {
        finalList.push({ text: enumVar[i], value: enumVar[i] })
      }

      return finalList
    },

    async loadDispStatuses() {
      console.log('loadDispStatuses')

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: false },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch(`dispositionStatuses/findAll`, {
        ...reqParams,
        noCommit: true,
      })

      if (response.status === 200) {
        this.dispositionStates = response.data
        for (let i = 0; i < response.data.length; i++) {
          this.dispositionStates[i] = response.data[i].name
        }

        this.dispositionStates = [...new Set(this.dispositionStates)]
      } else {
        this.dispositionStates = []
      }
    },

    openPrintForm(printName) {
      console.log('Print open: ', printName)
      this.$router.push({ name: printName, params: { id: this.viewId, object: this.object } })
    },

    initOrders() {
      if (this.order) {
        this.orders.push({ text: this.order.number, value: this.order.id })
      }
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
      let response

      if (!(await this.checkFormValidation())) {
        return
      }

      if (this.object.id === null || this.object.id === undefined) {
        response = await this.$store
          .dispatch('dispositions/create', this.object)
          .then((res) => {
            console.log('create disposition response:', res)
            this.$bvToast.toast('Dyspozycja została zapisana', {
              title: this.$tc('common.msg'),
              variant: 'success',
              solid: true,
              autoHideDelay: 5000,
            })
            this.closeView()
          })
          .catch((err) => {
            console.log('create disposition error: ', err)
            this.$bvToast.toast(`Błąd zapisu dyspozycji ${err}`, {
              title: this.$tc('common.msg'),
              variant: 'danger',
              solid: true,
              autoHideDelay: 5000,
            })
          })
      } else {
        response = await this.$store
          .dispatch('dispositions/update', this.object)
          .then((res) => {
            console.log('update disposition res: ', res)
            this.$bvToast.toast('Dyspozycja została zapisana', {
              title: this.$tc('common.msg'),
              variant: 'success',
              solid: true,
              autoHideDelay: 5000,
            })
            this.closeView()
          })
          .catch((err) => {
            console.log('update disposition error: ', err)
            this.$bvToast.toast(`Błąd zapisu dyspozycji ${err}`, {
              title: this.$tc('common.msg'),
              variant: 'danger',
              solid: true,
              autoHideDelay: 5000,
            })
          })
      }
    },

    async checkBpExemplar() {
      const exemplar = await this.getBpExemplarByOwner()
      if (exemplar) {
        const currentStage = exemplar.stage
        this.activeStage = JSON.parse(currentStage)

        const bpDefiRes = await this.$store.dispatch('bpDefinitions/findByPk', {
          params: {
            id: exemplar.definitionId,
          },
        })
        this.openBpDefinitions = bpDefiRes
        this.nextStage = bpDefiRes.stages.find((e) => e.uuid === this.activeStage.nextStage)
      }
    },

    async getBpExemplarByOwner() {
      const bpExemplars = await this.findAllBP()
      let exemplar
      bpExemplars.data.responseData.map((data) => {
        if (data.ownerId === this.object.id) {
          exemplar = data
        }
      })
      return exemplar
    },

    async handleCreateBP() {
      if (this.object.id !== null || this.object.id !== undefined) {
        if (!this.activeStage) {
          const definitionId = '4e219e67-313b-406e-81b5-b52bad991885'
          const bpDefiRes = await this.$store.dispatch('bpDefinitions/findByPk', {
            params: {
              id: definitionId,
            },
          })

          const stage = bpDefiRes.stages[0]
          const data = {
            status: 'Active',
            ownerType: 'disposition',
            ownerId: this.object.id,
            stage: JSON.stringify(stage), //current stage
            definitionId, //id from bp_definition table, for now it inserted manually
          }
          this.$store
            .dispatch('bpExemplars/addItem', data)
            .then((res) => {
              this.$bvToast.toast('Success', {
                title: this.$tc('common.msg'),
                variant: 'success',
                solid: true,
                autoHideDelay: 5000,
              })
            })
            .catch((err) => {
              this.$bvToast.toast(`Error ${err}`, {
                title: this.$tc('common.msg'),
                variant: 'danger',
                solid: true,
                autoHideDelay: 5000,
              })
            })
          this.activeStage = stage
          this.nextStage = stage
          this.openBpDefinitions = bpDefiRes
        }
        await this.handleProcess(this.nextStage)
      }
    },

    async showProcessModal() {
      const exemplar = await this.getBpExemplarByOwner()
      await this.findAllHistory({ id: exemplar.id })
      this.isShowAnalyze = true
    },

    async handleGoNext() {
      await this.handleProcess(this.nextStage)
    },

    async handleProcess(stage) {
      if (stage) {
        this.isProcessing = true
        const isCondition = stage.isCondition
        console.log('--- start verification ---')
        const conditionBefore = await this.checkBeforeExecution()
        console.log('--- finish verification ---')
        if (conditionBefore) {
          let nextStageId
          if (isCondition) {
            const checkCondition = await this.checkConditionExecution(stage.conditions)
            if (checkCondition) nextStageId = stage.conditions.find((e) => e.link === 'Tak').nextStage
            else nextStageId = stage.conditions.find((e) => e.link === 'Nie').nextStage
          }
          if (!nextStageId) nextStageId = stage.nextStage
          await this.executeOnStageExecution()
          const nextStage = this.openBpDefinitions.stages.find((e) => e.uuid === nextStageId)
          if (stage) {
            this.activeStage = stage
            await this.addHistory(stage)
            if (nextStage) {
              await this.updateExemplar(stage)
              this.nextStage = nextStage
              if (stage.isCondition) await this.handleProcess(nextStage)
            } else {
              this.nextStage = ''
            }
          }
        }
      } else {
        this.$bvToast.toast(`cannot find next stage`, {
          title: this.$tc('common.msg'),
          variant: 'warning',
          solid: true,
          autoHideDelay: 5000,
        })
      }
      this.isProcessing = false
    },

    async addHistory(stage) {
      const exemplar = await this.getBpExemplarByOwner()
      const history = {
        stage: JSON.stringify(stage),
        exemplarId: exemplar.id,
      }
      this.$store
        .dispatch('bpHistories/addHistory', history)
        .then((res) => {
          if (res) {
            console.log('history inserted')
          }
        })
        .catch((err) => {
          this.$bvToast.toast(`Error ${err}`, {
            title: this.$tc('common.msg'),
            variant: 'danger',
            solid: true,
            autoHideDelay: 5000,
          })
        })
    },

    async updateExemplar(nextStage) {
      const exemplar = await this.getBpExemplarByOwner()
      const itemData = {
        id: exemplar.id,
        status: 'Active',
        ownerType: 'disposition',
        ownerId: this.object.id,
        stage: JSON.stringify(nextStage), //current stage
        definitionId: exemplar.definitionId,
      }
      this.$store.dispatch('bpExemplars/updateItem', itemData)
    },

    async checkBeforeExecution() {
      // code here for validation
      const beforeExecutionCheck = await this.$store.dispatch('tasks/checkBeforeExecutionTaskCondition2', {
        currentStage: this.activeStage,
      })
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return beforeExecutionCheck
    },

    async executeOnStageExecution() {
      // code after validation returns true
      eval(this.activeStage.onExecution)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    },

    async checkConditionExecution(conditions) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return true
    },

    // changeDispossitionstatus(state) {
    //   this.state = state
    //   this.$store.dispatch('dispositions/update', { id: this.object.id, state })
    // },

    async closeView() {
      this.$destroy()
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)
      await this.$router.push({ name: 'dispositions-list' })
    },

    createDisposition() {},
  },
}
</script>
