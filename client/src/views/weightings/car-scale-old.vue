<template>
  <Layout>
    <div>
      <b-card align="center">
        <b-row>
          <b-col md="6">
            <!-- <h1> {{currentWeight}} T: {{stabilityInfo}}</h1> -->
            <p style="font-size: 50px; font-weight: bold"> {{ currentWeight }} T: {{ stabilityInfo }} </p>
          </b-col>
          <b-col md="6">
            <!-- <b-row> -->
            <p style="font-size: 5px"> </p>
            <!-- </b-row> -->
            <b-button class="mr-1" @click="scanBarCode"> ZESKANUY KOD </b-button>
            <b-button class="mr-1" @click="setZero"> ZEROWANIE </b-button>
            <!-- <b-button class="mr-1" @click="CancellationOfWeighing"> ZRZUĆ </b-button> -->
            <!-- <b-button variant="primary" class="mr-1" @click="getWeight"> ZWAŻ </b-button> -->
            <b-button class="mr-1" @click="printDN"> KWITY </b-button>
            <!-- <b-button variant="danger" class="mr-1" @click="addWeight">DOSYPKA</b-button> -->
            <b-button class="mr-1" @click="selectReport"> RAPORTY </b-button>
            <b-button class="mr-1" @click="syncData"> ODŚWIEŻ </b-button>
          </b-col>
        </b-row>

        <b-tabs pills card v-model="tabIndex">
          <b-tab @click="tabsClick(0)">
            <template v-slot:title> Pierwsze ważenie ( {{ dispositionListFirst.length }} ) </template>
            <b-row>
              <b-col>
                <b-table
                  ref="dispositionListFirst"
                  hover
                  striped
                  responsive
                  bordered
                  class="mb-2"
                  small
                  selectable
                  select-mode="single"
                  no-local-sorting
                  :items="dispositionListFirst"
                  :fields="fieldsW1"
                  :per-page="limit"
                  :current-page="currentPage1"
                  :tbody-tr-class="rowClass"
                  primary-key="index"
                >
                  <template v-slot:cell(index)="data">
                    <p>{{ getLineNumber(data.index) }}</p>
                  </template>
                  <template v-slot:cell(disposition)="data">
                    <p>{{ getDocumentPresentation(data.item) }}</p>
                  </template>
                  <template v-slot:cell(order)="data">
                    <p>{{ getDocumentPresentation(data.item.order) }}</p>
                  </template>
                  <!-- <template v-slot:cell(vehicle)="data">
                    <p>{{ getCatalogPresentation(data.item.vehicle) }}</p>
                  </template> -->
                  <template v-slot:cell(vehicle)="data">
                    <a href="javascript:void(0);" @click="editObject(data.item.id, weightingTypes[0])">
                      <span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ getCatalogPresentation(data.item.vehicle) }}</span>
                    </a>
                  </template>
                  <template v-slot:cell(driver)="data">
                    <p>{{ getCatalogPresentation(data.item.driver) }}</p>
                  </template>
                  <template v-slot:cell(ship)="data">
                    <p>{{ getCatalogPresentation(data.item.ship) }}</p>
                  </template>
                  <template v-slot:cell(product)="data">
                    <p>{{ getCatalogPresentation(data.item.product) }}</p>
                  </template>
                  <template v-slot:cell(schemeOfCargo)="data">
                    <p>{{ getCatalogPresentation(data.item.schemeOfCargo) }}</p>
                  </template>
                  <template v-slot:cell(customer)="data">
                    <p>{{ getCatalogPresentation(data.item.customer) }}</p>
                  </template>
                  <template v-slot:cell(forwarder)="data">
                    <p>{{ getCatalogPresentation(data.item.forwarder) }}</p>
                  </template>
                  <template v-slot:cell(vendor)="data">
                    <p>{{ getCatalogPresentation(data.item.vendor) }}</p>
                  </template>
                </b-table>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col>
                <b-pagination v-model="currentPage1" :total-rows="currentView.total1" :per-page="limit" align="right" class="my-0"> </b-pagination>
              </b-col>
            </b-row>
          </b-tab>

          <b-tab @click="tabsClick(1)">
            <template v-slot:title> Drugie ważenie ( {{ dispositionListSecond.length }} ) </template>
            <b-row>
              <b-table
                ref="dispositionListSecond"
                hover
                striped
                responsive
                bordered
                class="mb-2"
                small
                selectable
                select-mode="single"
                no-local-sorting
                :items="dispositionListSecond"
                :fields="fieldsW2"
                :per-page="limit"
                :current-page="currentPage2"
                :tbody-tr-class="rowClass"
                primary-key="index"
              >
                <template v-slot:cell(index)="data">
                  <p>{{ getLineNumber(data.index) }}</p>
                </template>
                <template v-slot:cell(disposition)="data">
                  <p>{{ getDocumentPresentation(data.item) }}</p>
                </template>
                <template v-slot:cell(order)="data">
                  <p>{{ getDocumentPresentation(data.item.order) }}</p>
                </template>
                <!-- <template v-slot:cell(vehicle)="data">
                    <p>{{ getCatalogPresentation(data.item.vehicle) }}</p>
                  </template> -->
                <template v-slot:cell(vehicle)="data">
                  <a href="javascript:void(0);" @click="editObject(data.item.id, weightingTypes[1])">
                    <span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ getCatalogPresentation(data.item.vehicle) }}</span>
                  </a>
                </template>
                <template v-slot:cell(driver)="data">
                  <p>{{ getCatalogPresentation(data.item.driver) }}</p>
                </template>
                <template v-slot:cell(ship)="data">
                  <p>{{ getCatalogPresentation(data.item.ship) }}</p>
                </template>
                <template v-slot:cell(product)="data">
                  <p>{{ getCatalogPresentation(data.item.product) }}</p>
                </template>
                <template v-slot:cell(schemeOfCargo)="data">
                  <p>{{ getCatalogPresentation(data.item.schemeOfCargo) }}</p>
                </template>
                <template v-slot:cell(customer)="data">
                  <p>{{ getCatalogPresentation(data.item.customer) }}</p>
                </template>
                <template v-slot:cell(forwarder)="data">
                  <p>{{ getCatalogPresentation(data.item.forwarder) }}</p>
                </template>
                <template v-slot:cell(vendor)="data">
                  <p>{{ getCatalogPresentation(data.item.vendor) }}</p>
                </template>
              </b-table>
            </b-row>
            <b-row class="mt-2">
              <b-col>
                <b-pagination v-model="currentPage2" :total-rows="currentView.total2" :per-page="limit" align="right" class="my-0"> </b-pagination>
              </b-col>
            </b-row>
          </b-tab>
        </b-tabs>
        <b-row>
          <b-col md="3">
            <b-form-group horizontal :label-cols="2" :label="$t('table.scale')" label-for="currentScalesId">
              <b-form-select id="currentScalesId" v-model="currentScalesId" :options="scales" size="sm" @change="changeScale" />
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>

      <b-modal
        v-model="showScanBarcode"
        title="Zeskanuj kod kreskowy"
        header-class="pr-4 pl-4 border-bottom-0"
        title-class="text-black font-18"
        body-class="pt-3 pr-4 pl-4"
        centered
        @ok="onScanBarcodeOK"
      >
        <b-form>
          <b-form-input id="barCode" v-model="currentBarCode" type="text" class="form-control" placeholder="Zeskanuj kod kreskowy" autofocus />
        </b-form>
        <!-- <b-button variant="success" class="mt-2" @click="getWeight"> Zeskanuj kod kreskowy </b-button> -->
      </b-modal>

      <b-modal
        v-model="showWeight"
        title="Wprowadż wagę"
        header-class="pr-4 pl-4 border-bottom-0"
        title-class="text-black font-18"
        body-class="pt-3 pr-4 pl-4"
        centered
        @ok="onShowWeightOK"
      >
        <b-form>
          <b-form-input id="weightValue" v-model="currentWeight" type="number" step="0.01" min="0.00" max="500.00" class="form-control" autofocus />
        </b-form>
      </b-modal>

      <b-modal
        v-model="showSelectionReport"
        title="Wybierz raport"
        header-class="pr-4 pl-4 border-bottom-0"
        title-class="text-black font-18"
        body-class="pt-3 pr-4 pl-4"
        hide-footer
        centered
      >
        <b-card>
          <b-card-body>
            <label for="sbNumberOfCopies"> Ilość kopii </label>
            <b-form-spinbutton id="sbNumberOfCopies" v-model="numberOfCopies" min="1" max="10" step="1"></b-form-spinbutton>
            <p> </p>
            <b-button class="mb-1 w-100" @click="weightRaport1">RAPORT WAGOWY</b-button>
            <b-button class="mb-1 w-100" @click="weightRaport2">RAPORT ROZMIESZCZENIA SAMOCHODÓW</b-button>
            <b-button class="mb-1 w-100" @click="weightRaport3">RAPORT ZMIANOWY WAGI</b-button>
          </b-card-body>
        </b-card>
      </b-modal>

      <b-modal v-model="showViewDisposition" size="xl" hide-footer body-class="pr-4 pl-4 pb-3" title="Ważenie dispozycji">
        <div align="left" style="font-size: 18px">
          <b-row style="font-size: 50px; font-weight: bold">
            <p style="padding-right: 10px"> {{ weightType }}: </p>
            <p :style="{ color: colorWeight }"> {{ currentWeight }} T. {{ stabilityInfo }} </p>
          </b-row>
          <p> </p>
          <b-row align-h="start">
            <b-col md="6">
              <p>
                {{ $t('table.deliveryOrder') }} : <b> {{ getDocumentPresentation(getDocumentsAttrByName(currentDisposition, 'order')) }}</b></p
              >
              <p size="sm">
                {{ $t('table.disposition') }}: <b> {{ getDocumentPresentation(currentDisposition) }}</b></p
              >
              <p>
                {{ $t('table.deliveryNote') }}: <b> {{ getDocumentPresentation(currentDeliveryNote) }}</b></p
              >
              <p>
                Relacja: <b> {{ getCatalogPresentation(getDocumentsAttrByName(currentDisposition, 'schemeOfCargo')) }}</b></p
              >
              <p>
                Typ operacji: <b> {{ getDocumentsAttrByName(currentDisposition, 'typeOfOperation') }}</b></p
              >
              <p>
                Towar: <b> {{ getCatalogPresentation(getDocumentsAttrByName(currentDisposition, 'product')) }}</b></p
              >
            </b-col>
            <b-col md="6">
              <p>
                Nr samochodu: <b> {{ getCatalogPresentation(getDocumentsAttrByName(currentDisposition, 'vehicle')) }} </b>, naczepa:
                <b> {{ getCatalogPresentation(getDocumentsAttrByName(currentDisposition, 'trailer')) }}</b></p
              >
              <p>
                Kierowca: <b> {{ getCatalogPresentation(getDocumentsAttrByName(currentDisposition, 'driver')) }} </b>, nr dowodu:
                <b> {{ getCatalogPresentation(getDocumentsAttrByName(currentDisposition, 'driver.idCard')) }}</b></p
              >
              <p>
                Magazyn: <b> {{ getCatalogPresentation(getDocumentsAttrByName(currentDisposition, 'warehouse')) }} </b>, nr magazynowy:
                <b> {{ getCatalogPresentation(getDocumentsAttrByName(currentDisposition, 'box')) }}</b></p
              >
              <p>
                Spedytor: <b> {{ getCatalogPresentation(getDocumentsAttrByName(currentDisposition, 'forwarder')) }} </b></p
              >
              <p>
                Odbiorca: <b> {{ getCatalogPresentation(getDocumentsAttrByName(currentDisposition, 'customer')) }} </b></p
              >
              <p>
                Deklarowany tonaż: <b> {{ getDocumentsAttrByName(currentDisposition, 'quantity') }} </b></p
              >
            </b-col>
          </b-row>
          <b-row :style="{ color: colorTabTitleText, backgroundColor: colorTabTitle }">
            <p style="padding-top: 15px; padding-left: 15px"> <b> WAŻENIE: </b></p>
          </b-row>
          <b-row align-h="start" style="border: 2px solid rgb(49, 56, 71); padding-top: 10px; padding-left: 10px; padding-right: 10px">
            <b-col md="4">
              <p style="border-bottom: 2px solid lightgrey"> <b> BRUTTO </b></p>
              <p>
                Waga: <b> {{ getCatalogPresentation(getDocumentsAttrByName(currentDeliveryNote, 'scaleBrutto')) }} </b></p
              >
              <!-- <p> Brutto:<b> {{getDocumentsAttrByName(getDocumentsAttrByName(currentDisposition, "deliveryNotes"), "brutto")}} </b></p> -->
              <p>
                Brutto:<b> {{ currentBrutto }} </b></p
              >
              <p> Data i czas ważenia:</p>
              <p>
                <b> {{ setFormatDateTime(getDocumentsAttrByName(getDocumentsAttrByName(currentDisposition, 'deliveryNotes'), 'bruttoTime')) }} </b></p
              >
            </b-col>
            <b-col md="4">
              <p style="border-bottom: 2px solid lightgrey"> <b> TARA </b></p>
              <p>
                Waga: <b> {{ getCatalogPresentation(getDocumentsAttrByName(currentDeliveryNote, 'scaleTare')) }} </b></p
              >
              <!-- <p> Tara:<b> {{getDocumentsAttrByName(getDocumentsAttrByName(currentDisposition, "deliveryNotes"), "tare")}} </b></p> -->
              <p>
                Tara:<b> {{ currentTare }} </b></p
              >
              <p> Data i czas ważenia:</p>
              <p>
                <b> {{ setFormatDateTime(getDocumentsAttrByName(getDocumentsAttrByName(currentDisposition, 'deliveryNotes'), 'tareTime')) }} </b></p
              >
            </b-col>
            <b-col md="4">
              <p style="border-bottom: 2px solid lightgrey"> <b> NETTO </b></p>
              <p>
                Waga: <b> {{ getCatalogPresentation(getDocumentsAttrByName(currentDeliveryNote, 'scaleNetto')) }} </b></p
              >
              <!-- <p> Netto:<b> {{getDocumentsAttrByName(getDocumentsAttrByName(currentDisposition, "deliveryNotes"), "netto")}} </b></p> -->
              <p>
                Netto:<b> {{ currentNetto }} </b></p
              >
              <p> Data i czas ważenia:</p>
              <p>
                <b> {{ setFormatDateTime(getDocumentsAttrByName(getDocumentsAttrByName(currentDisposition, 'deliveryNotes'), 'nettoTime')) }} </b></p
              >
            </b-col>
          </b-row>
          <p> </p>
          <b-row>
            <b-button variant="primary" class="mr-1" @click="setWeight"> OK </b-button>
            <b-button variant="danger" class="mr-1" @click="getWeight"> ZWAŻ </b-button>
            <b-button v-if="isSecondWeighting" class="mr-1" @click="addWeight">DOSYPKA</b-button>
            <b-button v-if="isSecondWeighting" class="mr-1" @click="setZeroDN">ZEROWANJE KWITU</b-button>
            <b-button v-if="isWielokrotność" class="mr-1" @click="sendToTare">WYSŁANIE NA WAŻENIE TARY</b-button>
            <b-button class="mr-1" @click="cancellationOfWeighing"> ZRZUĆ (ANULUJ) </b-button>
          </b-row>
        </div>
      </b-modal>
    </div>
  </Layout>
</template>


<script>
// import appConfig from '@/app.config'
import Layout from '@/layouts/main'
// import PageHeader from '@components/page-header'
import { mapGetters, mapMutations } from 'vuex'
import { catalogPresentation, documentPresentation, dateTimePresentation, showMessageBox, showQuestion } from '@/utils/commonUse.js'
import {
  getWeight as weightingsGetWeight,
  thisIsShipment as weightingsThisIsShipment,
  getDataForWriteOK as weightingsGetDataForWriteOK,
  getDataForWriteNumberOfWeighted as weightingsGetDataForWriteNumberOfWeighted,
  getDataForWriteAddRemove as weightingGetDataForWriteAddRemove,
  getDataForWriteSendToTare as weightingsGetDataForWriteSendToTare,
} from '@/utils/weightings.js'
// import weightings from '../state/modules/weightings'

export default {
  name: 'CarScaleOld',
  page: {
    title: 'Wagi samochodowe',
    // meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    // PageHeader
  },
  data() {
    return {
      usedColors: {
        originalText: '#6D7680',
        primaryText: '#874AF9',
        redText: '#FF0000',
        darkTitle: '#313847',
        lightTitle: '#6E8B90',
      },
      colorWeight: '',
      colorTabTitle: '',
      colorTabTitleText: '',

      title: 'Wagi samochodowe',

      testMode: true,

      showWeight: false,
      showScanBarcode: false,
      showSelectionReport: false,
      showViewDisposition: false,

      weightingTypes: ['Pierwsze ważenie', 'Drugie ważenie'],

      limit: 5,

      stabilityInfo: 'Waga stabilna',

      correctionWeight: 0,
      eqal: 0,
      currentDisposition: [],
      currentDeliveryNote: null,
      currentBrutto: 0,
      currentTare: 0,
      currentNetto: 0,
      currentBarCode: '',
      currentUser: null,
      currentScale: null,
      currentUserId: '',
      currentScalesId: '',
      scales: [],

      // scaleBrutto: null,
      // scaleTare: null,
      // scaleNetto: null,
      operationWeight: '',

      // disposition: 'Dyspozycja Nr 1111',
      // vehicleNumber: 'KR3MG12',
      // warehouse: 'Magazyn 27',
      // ship: 'PANOPY',
      declaredWeight: 100,
      firstWeight: 25,
      secondWeight: 30,

      numberOfWeighted: 0,

      numberOfCopies: 1,

      fieldsW1: [
        { key: 'index', label: 'Nr' },
        { key: 'vehicle', label: 'Samochod', sortable: true },
        { key: 'driver', label: 'Kierowca', sortable: true },
        { key: 'order', label: 'Zlecenje', sortable: true },
        { key: 'disposition', label: 'Dispozycja', sortable: true },
        { key: 'ship', label: 'Statek', sortable: true },
        { key: 'product', label: 'Towar', sortable: true },
        { key: 'schemeOfCargo', label: 'Relacja', sortable: true },
        { key: 'type', label: 'Typ', sortable: true },
        { key: 'numberOfWeighings', label: 'Wielokrotność' },
        { key: 'numberOfWeighted', label: 'Wykonane' },
        { key: 'forwarder', label: 'Spedytor', sortable: true },
        // { key: 'vendor', label: 'Dostawca', sortable: true },
        // { key: 'customer', label: 'Odbiorca', sortable: true },
      ],

      fieldsW2: [
        { key: 'index', label: 'Nr' },
        { key: 'vehicle', label: 'Samochod', sortable: true },
        { key: 'driver', label: 'Kierowca', sortable: true },
        { key: 'order', label: 'Zlecenje', sortable: true },
        { key: 'disposition', label: 'Dispozycja', sortable: true },
        { key: 'ship', label: 'Statek', sortable: true },
        { key: 'product', label: 'Towar', sortable: true },
        { key: 'schemeOfCargo', label: 'Relacja', sortable: true },
        { key: 'type', label: 'Typ', sortable: true },
        { key: 'numberOfWeighings', label: 'Wielokrotność' },
        { key: 'numberOfWeighted', label: 'Wykonane' },
        { key: 'forwarder', label: 'Spedytor', sortable: true },
        // { key: 'vendor', label: 'Dostawca', sortable: true },
        // { key: 'customer', label: 'Odbiorca', sortable: true },
      ],

      selectedListFirst: [],
      selectedListSecond: [],
      isClickWeighting: false,
      isSecondWeighting: false,
      isWielokrotność: false,
    }
  },

  computed: {
    ...mapGetters({
      // dispositionListFirst: 'dispositions/dispositionListFirst',
      // dispositionListSecond: 'dispositions/dispositionListSecond',
      currentView: 'weightingScalesCars/currentView',
      dispositionListFirst: 'weightingScalesCars/dispositionListFirst',
      dispositionListSecond: 'weightingScalesCars/dispositionListSecond',
    }),
    currentPage1: {
      get() {
        return this.currentView.page1
      },
      set(value) {
        this.setListViewProperty({ page1: value })
        // this.updateLists()
      },
    },
    currentPage2: {
      get() {
        return this.currentView.page2
      },
      set(value) {
        this.setListViewProperty({ page2: value })
        // this.updateLists()
      },
    },
    tabIndex: {
      get() {
        return this.currentView.tabIndex
      },
      set(value) {
        this.setListViewProperty({ tabIndex: value })
      },
    },
    weightType: {
      get() {
        return this.currentView.weightType
      },
      set(value) {
        this.setListViewProperty({ weightType: value })
      },
    },
    currentWeight: {
      get() {
        return this.currentView.currentWeight
      },
      set(value) {
        this.setListViewProperty({ currentWeight: value })
      },
    },
  },

  watch: {
    // currentView(newVal, oldVal) {
    //   console.log('111')
    //   this.dispositionListFirst = newVal.dispositionListFirst
    //   this.dispositionListSecond = newVal.dispositionListSecond
    // },
  },

  mounted() {
    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {})
  },

  async created() {
    await this.initialize()
    this.setStartValues()
  },

  methods: {
    async initialize() {
      const authUser = await this.$store.state.auth.currentUser
      this.currentUser = authUser
      this.currentUserId = authUser.id

      const params = {
        userId: authUser.id,
        userSettingItemKey: 'currentScalesCars',
      }

      let scalesCarsName = ''
      await this.$store
        .dispatch('userSettings/findByKey', { params })
        .then((response) => {
          if (response.status === 200) {
            scalesCarsName = response.data
          }
        })
        .catch((error) => {
          console.warn(error)
        })

      if (scalesCarsName.trim() !== '') {
        await this.$store
          .dispatch('scales/findByName', { name: scalesCarsName })
          .then((response) => {
            if (response.status === 200) {
              this.currentScale = response.data
              this.currentScalesId = response.data.id
            }
          })
          .catch((error) => {
            console.warn(error)
          })
      }

      await this.$store.dispatch('weightingScalesCars/findAllForScalesCars', { scaleId: this.currentScalesId })

      await this.$store.dispatch('scales/findAll', { params: { filter: { typeOfDocument: 'Automobile' } } }).then((response) => {
        if (response.status === 200) {
          //for (let i = 0; i < scales.length; i++) {
          for (const scale of response.data) {
            this.scales.push({ text: scale.name, value: scale.id })
          }
        }
      })

      this.updateView()
    },
    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },
    ...mapMutations({
      addObjectView: `weightingScalesCars/addObjectView`,
      setListViewProperty: `weightingScalesCars/setListViewProperty`,
      setFilter: `weightingScalesCars/setFilters`,
      setSort: `weightingScalesCars/setSort`,
    }),
    setStartValues() {
      // this.currentWeight = 0
      this.correctionWeight = 0
      this.currentDisposition = null
      this.currentDeliveryNote = null
      this.currentBarCode = ''
      // this.weightType = this.weightingTypes[0]

      this.firstWeight = 0
      this.secondWeight = 0
      this.currentBrutto = 0
      this.currentTare = 0
      this.currentNetto = 0
      this.numberOfWeighted = 0
      this.operationWeight = ''
      this.isSecondWeighting = false
      this.isWielokrotność = false

      this.colorWeight = this.usedColors.primaryText
      this.colorTabTitle = this.usedColors.darkTitle
      this.colorTabTitleText = this.usedColors.lightTitle
    },
    getLineNumber(index) {
      return index + 1
    },
    getCatalogPresentation(objCatalog) {
      return catalogPresentation(objCatalog)
    },
    getDocumentPresentation(objDocument, strAttr = '') {
      return documentPresentation(objDocument, strAttr)
    },
    setFormatDateTime(valueDateTime) {
      return dateTimePresentation(valueDateTime)
    },
    scanBarCode() {
      this.showScanBarcode = true
    },
    onScanBarcodeOK(event) {
      event.preventDefault()
      if (this.currentBarCode !== '') {
        this.findDispositionByBarCode(this.currentBarCode)
        this.currentBarCode = ''
      }
      this.showScanBarcode = false
    },
    async findDispositionByBarCode(findBarCode) {
      const queryParams = {
        ticketNumber: findBarCode,
      }
      const selectedItem = await this.$store.dispatch('weightingScalesCars/getDispositionByTicket', queryParams)
      if (selectedItem === null) {
        showMessageBox(this, 'Dyspozycja nie zostanie znaleziony!', 28, true)
        return
      }
      if (selectedItem.state === 'NaTerminalu') {
        this.weightType = this.weightingTypes[0]
        this.selectedListFirst = selectedItem
        this.currentDisposition = this.selectedListFirst
      } else {
        this.weightType = this.weightingTypes[1]
        this.selectedListSecond = selectedItem
        this.currentDisposition = this.selectedListSecond
      }
      this.showViewDisposition = true
    },
    getWeight() {
      if (this.currentDisposition === null) {
        showMessageBox(this, 'Nie wybrana dyspozycja! Samochód nie został zważony!')
        return
      }
      if (this.stabilityInfo === 'Waga nie stabilna') {
        return
      }

      this.operationWeight = 'OK'
      this.getWeightContinue()
    },
    getWeightContinue() {
      this.isClickWeighting = true
      this.currentWeight = ''
      if (this.testMode) {
        this.showWeight = true
      } else {
        this.currentWeight = weightingsGetWeight()
        this.getWeightingEnd()
      }
    },
    onShowWeightOK(event) {
      event.preventDefault()
      this.showWeight = false
      this.getWeightingEnd()
      this.currentWeight = Number(this.currentWeight).toFixed(2)
    },
    async getWeightingEnd() {
      const thisIsShipment = weightingsThisIsShipment(this.currentDisposition)
      const dispositionNumberOfWeighings = this.currentDisposition.numberOfWeighings
      const dispositionAllowRetaring = this.currentDisposition.allowRetaring
      const dispositionQuantity = this.currentDisposition.quantity
      if (this.operationWeight === 'OK') {
        if (this.weightType === this.weightingTypes[0] && thisIsShipment && dispositionNumberOfWeighings > 1 && dispositionAllowRetaring === false) {
          const queryParams = {
            dispositionId: this.currentDisposition.id,
          }
          const lastTareWeiting = await this.$store.dispatch('deliveryNotes/getLastTareWeighting', queryParams)
          if (lastTareWeiting > 0) {
            let deltaWeight = this.currentWeight - lastTareWeiting
            if (deltaWeight < 0) {
              deltaWeight = -deltaWeight
            }

            if (deltaWeight > 0.06) {
              // 60 kg
              showMessageBox(this, 'Uwaga! Zakaz ważenia!\nPrzekroczono dopuszczalną (60 kg) rozbieżność między tarowaniem.\nSkontaktuj się z obsługą.')
              return
            }
          }
        } else if (this.weightType === this.weightingTypes[1] && thisIsShipment) {
          const delta = 0.005
          this.firstWeight = this.currentTare
          if (Number(this.currentWeight) - Number(this.firstWeight) - Number(delta) > Number(dispositionQuantity) + 0.1) {
            // Quantity + 100 kg - Kolano...
            this.correctionWeight = Number(this.currentWeight) - Number(this.firstWeight) - Number(dispositionQuantity)
            this.operationWeight = 'Remove'
            showMessageBox(this, 'Waga przekracza wagę deklarowaną. Musisz odsypać ' + this.correctionWeight + ' ton.')
          } else if (Number(this.currentWeight) - Number(this.firstWeight) < Number(dispositionQuantity) - 0.3) {
            // Quantity - 300 kg - Kolano...
            this.correctionWeight = Number(dispositionQuantity) - (Number(this.currentWeight) - Number(this.firstWeight))
            showQuestion(this, 'Masz mniej o (' + this.correctionWeight + 't).\nCzy chcesz wykonać ważenia?', this.answerWeightingQuestionOk, this.answerWeightingQuestionCancel)
          }
        }
      } else if (this.operationWeight === 'ZeroDN') {
        if (thisIsShipment) {
          this.firstWeight = this.currentTare
        } else {
          this.firstWeight = this.currentBrutto
        }
        let delta = (this.currentWeight - this.firstWeight).toFixed(2)
        if (delta < 0) {
          delta = -delta
        }
        if (delta > 0.06) {
          // 60 kg - Kolano...
          showMessageBox(this, 'Waga nie odpowiada pierwszemu ważeniu!')
          return
        } else {
          showMessageBox(this, 'UWAGA!!! SAMOCHÓD ZEROWANY!')
          this.currentWeight = this.firstWeight
        }
      } else if (this.operationWeight === 'Add') {
        if (thisIsShipment) {
          this.firstWeight = this.currentTare
        } else {
          this.firstWeight = this.currentBrutto
        }
        this.correctionWeight = Number(dispositionQuantity) + Number(this.firstWeight) - Number(this.currentWeight)
        if (this.correctionWeight > 0) {
          showQuestion(this, 'Wysłać samochód do doładowania ' + this.correctionWeight + ' t?', this.setWeightingEnd)
        } else {
          showMessageBox(this, 'Operacja jest nie możliwa! Waga większa od deklarowanej wagi!', 22, true)
        }
        return
      }

      if (this.weightType === this.weightingTypes[0]) {
        if (thisIsShipment) {
          this.currentBrutto = 0
          this.currentTare = this.currentWeight
        } else {
          this.currentBrutto = this.currentWeight
          this.currentTare = 0
        }
        this.currentNetto = 0
      } else {
        if (thisIsShipment) {
          this.currentBrutto = this.currentWeight
        } else {
          this.currentTare = this.currentWeight
        }
        this.currentNetto = (this.currentBrutto - this.currentTare).toFixed(2)
      }
    },
    setWeight() {
      if (!this.isClickWeighting) {
        showMessageBox(this, 'Ważenie niedokończone!')
        return
      }

      if (this.weightType === this.weightingTypes[1] && this.operationWeight === 'OK') {
        const objParameters = { currentDeliveryNoteId: this.currentDeliveryNote.id }
        showQuestion(this, 'Wydrukować kwity?', this.printCurrentDeliveryNote, undefined, objParameters)
      }

      this.setWeightingEnd()
    },
    async setWeightingEnd() {
      let dataForWrite = ''
      if (this.operationWeight === 'OK' || this.operationWeight === 'ZeroDN') {
        dataForWrite = weightingsGetDataForWriteOK(this)
        await this.$store.dispatch('weightingScalesCars/updateItem', dataForWrite.dispositionData)
        await this.$store.dispatch('deliveryNotes/' + dataForWrite.deliveryNoteData.action, dataForWrite.deliveryNoteData)
        await this.writeNumberOfWeighted()
      } else if (this.operationWeight === 'Add' || this.operationWeight === 'Remove') {
        dataForWrite = weightingGetDataForWriteAddRemove(this)
        await this.$store.dispatch('weightingScalesCars/updateItem', dataForWrite)
      }
      await this.initialize()
      this.setStartValues()
      this.showViewDisposition = false
    },
    answerWeightingQuestionOk() {
      this.setWeight()
    },
    answerWeightingQuestionCancel() {
      this.currentBrutto = 0
    },
    async syncData() {
      await this.$store.dispatch('sync1CData/runSyncData')
      await this.initialize()
      this.setStartValues()

      showMessageBox(this, 'Wymiana zakończona!')
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()

      // this.getWeight()
    },
    handleCancel(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    setZero() {
      if (this.currentWeight > 80 || this.currentWeight < -80) {
        return
      }
      this.eqal = -this.currentWeight
    },
    printDN() {
      this.$router.push('/deliveryNotesList')
    },
    addWeight() {
      if (this.currentDisposition === null) {
        showMessageBox(this, 'Nie wybrana dyspozycja! Samochód nie został zważony!')
        return ''
      }
      if (this.stabilityInfo === 'Waga nie stabilna') {
        return
      }
      this.currentWeight = 0
      this.operationWeight = 'Add'
      this.getWeightContinue()
    },
    cancellationOfWeighing() {
      this.showViewDisposition = false
      this.setStartValues()
    },
    setZeroDN() {
      if (this.currentDisposition === null) {
        showMessageBox(this, 'Nie wybrano dyspozycji')
        return ''
      }
      if (this.weightType === this.weightingTypes[0]) {
        showMessageBox(this, 'Operacja dostępna tylko dla drugiego ważenia', 22, true)
        return
      }
      this.currentWeight = 0
      this.operationWeight = 'ZeroDN'
      this.getWeightContinue()
    },
    sendToTare(event) {
      showQuestion(this, 'Samochód zostanie wysłany do ważenia tary.\nWykonać?', this.sendToTareContinue)
    },
    async sendToTareContinue() {
      const dataForWrite = weightingsGetDataForWriteSendToTare(this)
      await this.$store.dispatch('weightingScalesCars/updateItem', dataForWrite)
      await this.writeNumberOfWeighted()
    },
    async writeNumberOfWeighted() {
      const queryParams = {
        dispositionId: this.currentDisposition.id,
      }
      const response = await this.$store.dispatch('weightingScalesCars/getNumberOfWeighted', queryParams)
      if (response) {
        this.numberOfWeighted = response.data
        const dataForWrite = weightingsGetDataForWriteNumberOfWeighted(this)
        await this.$store.dispatch('weightingScalesCars/updateItem', dataForWrite)
      }
    },
    printCurrentDeliveryNote(parameters) {
      showMessageBox(this, 'Print Current Delivery Note Id : ' + parameters.currentDeliveryNoteId, 22, true)
    },
    selectReport() {
      this.showSelectionReport = true
    },
    weightRaport1() {
      this.$router.push('/tableTest')
      this.showSelectionReport = false
    },
    weightRaport2() {
      this.$router.push('/dragula')
      this.showSelectionReport = false
    },
    weightRaport3() {
      this.showSelectionReport = false
      this.$router.push({ name: 'report-common-routes', params: { reportModule: 'shiftReportFromScale' } })
    },

    async editObject(objectId, weightType) {
      this.currentDisposition = null
      this.currentDeliveryNote = null

      let response = await this.$store.dispatch(`dispositions/findByPk`, {
        params: {
          id: objectId,
        },
      })
      if (response.status === 200) {
        // this.$router.push({ name: 'disposition-form', params: { id: objectId } })
        this.weightType = weightType
        this.currentDisposition = response.data
        response = await this.$store.dispatch('deliveryNotes/findForWeighting', { dispositionId: objectId })

        if (response && response.status === 200) {
          this.currentDeliveryNote = response.data
        }

        if (this.currentDeliveryNote !== null) {
          this.currentBrutto = this.currentDeliveryNote.brutto
          this.currentTare = this.currentDeliveryNote.tare
          this.currentNetto = this.currentDeliveryNote.netto
          this.scaleBrutto = this.currentDeliveryNote.scaleBrutto
          this.scaleTare = this.currentDeliveryNote.scaleTare
          this.scaleNetto = this.currentDeliveryNote.scaleNetto
        } else {
          this.currentBrutto = 0
          this.currentTare = 0
          this.currentNetto = 0
          this.scaleBrutto = null
          this.scaleTare = null
          this.scaleNetto = null
        }

        this.showViewDisposition = true
        this.isSecondWeighting = this.weightType === this.weightingTypes[1]
        this.isWielokrotność = this.currentDisposition.numberOfWeighings > 1
        this.isClickWeighting = false
      }
    },

    async onRowSelectedListFirst(items) {
      this.selectedListFirst = items
      if (this.selectedListFirst.length > 0) {
        this.weightType = this.weightingTypes[0]
        this.currentDisposition = this.selectedListFirst[0]
        const queryParams = {
          dispositionId: this.currentDisposition.id,
        }
        this.currentDeliveryNote = await this.$store.dispatch('deliveryNotes/findForWeighting', queryParams)
        if (this.currentDeliveryNote !== null) {
          this.currentBrutto = this.currentDeliveryNote.brutto
          this.currentTare = this.currentDeliveryNote.tare
          this.currentNetto = this.currentDeliveryNote.netto
          this.scaleBrutto = this.currentDeliveryNote.scaleBrutto
          this.scaleTare = this.currentDeliveryNote.scaleTare
          this.scaleNetto = this.currentDeliveryNote.scaleNetto
        } else {
          this.currentBrutto = 0
          this.currentTare = 0
          this.currentNetto = 0
          this.scaleBrutto = null
          this.scaleTare = null
          this.scaleNetto = null
        }
        this.showViewDisposition = true
        this.isSecondWeighting = false
        this.isWielokrotność = false
        this.isClickWeighting = false
      } else {
        this.currentDisposition = null
        this.currentDeliveryNote = null
      }
    },
    async onRowSelectedListSecond(items) {
      this.selectedListSecond = items
      if (this.selectedListSecond.length > 0) {
        this.weightType = this.weightingTypes[1]
        this.currentDisposition = this.selectedListSecond[0]
        const queryParams = {
          dispositionId: this.currentDisposition.id,
        }
        this.currentDeliveryNote = await this.$store.dispatch('deliveryNotes/findForWeighting', queryParams)
        if (this.currentDeliveryNote !== null) {
          this.currentBrutto = this.currentDeliveryNote.brutto
          this.currentTare = this.currentDeliveryNote.tare
          this.currentNetto = this.currentDeliveryNote.netto
          this.scaleBrutto = this.currentDeliveryNote.scaleBrutto
          this.scaleTare = this.currentDeliveryNote.scaleTare
          this.scaleNetto = this.currentDeliveryNote.scaleNetto
        } else {
          this.currentBrutto = 0
          this.currentTare = 0
          this.currentNetto = 0
          this.scaleBrutto = null
          this.scaleTare = null
          this.scaleNetto = null
        }
        this.showViewDisposition = true
        this.isSecondWeighting = true
        this.isWielokrotność = this.currentDisposition.numberOfWeighings > 1
        this.isClickWeighting = false
      } else {
        this.currentDisposition = null
        this.currentDeliveryNote = null
      }
    },
    async getScaleById(id) {
      if (id === null) {
        return null
      }

      const queryParams = {
        id: id,
      }
      const findItem = await this.$store.dispatch('scales/findByPk', queryParams)
      return findItem
    },
    closeViewDisposition() {
      this.showViewDisposition = false
    },
    getDocumentsAttrByName(doc, attrName) {
      if (doc) {
        const attr = doc[attrName]
        if (Array.isArray(attr)) {
          return attr[0]
        } else {
          return attr
        }
      }
    },
    async changeScale() {
      await this.$store.dispatch('weightingScalesCars/findAllForScalesCars', { scaleId: this.currentScalesId })
    },

    tabsClick(tabIndex) {
      this.weightType === this.weightingTypes[tabIndex]
    },
    updateView() {
      // if (this.weightType === this.weightingTypes[1]) {
      //   this.tabIndex = 1
      // } else {
      //   this.tabIndex = 0
      // }
      // console.log('this.weightType = ', this.weightType)
    },
  },
}
</script>

<style>
.subtitle {
  padding-top: 15px;
  text-align: start;
  /* border: 2px solid lightgray;
    margin-top: 2px; */
  font-size: 22px;
  font-weight: bold;
  background-color: rgb(49, 56, 71);
  color: rgb(133, 140, 143);
}
</style>
