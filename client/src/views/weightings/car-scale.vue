<template>
  <Layout>
    <div>
      <b-card align="center">
        <b-row align="left">
          <b-col md="7">
            <p style="font-size: 50px; font-weight: bold" :class="{ 'not-stable-weight': !stable, 'stable-weight': stable }"> {{ currentWeightTimer }} T: {{ stabilityInfo }} </p>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="3">
            <div v-if="modeElectron">
              <b-form-group horizontal :label-cols="2" :label="$t('table.scale')" label-for="currentScaleId">
                <b-form-select id="currentScaleId" v-model="currentScaleId" :disabled="scaleInWorkingPlace === true" :options="scales" size="sm" @change="changeScale" />
              </b-form-group>
            </div>
            <div v-else>
              <b-form-group horizontal :label-cols="2" :label="$t('table.scale')" label-for="currentScaleId">
                <b-form-select id="currentScaleId" v-model="currentScaleId" :options="scales" size="sm" @change="changeScale" />
              </b-form-group>
            </div>
          </b-col>
          <b-col align="right">
            <b-button v-if="modeElectron" class="mr-1" size="sm" variant="outline-secondary" @click="openSettingCom">COM</b-button>
            <b-button class="mr-1" variant="outline-secondary" size="sm" @click="scanBarCode"> ZESKANUY KOD </b-button>
            <b-button class="mr-1" variant="outline-secondary" size="sm" @click="setZero"> ZEROWANIE </b-button>
            <b-button class="mr-1" variant="outline-secondary" size="sm" @click="printDN"> KWITY </b-button>
            <!-- <b-button class="mr-1" variant="outline-secondary" @click="selectReport"> RAPORTY </b-button> -->
            <!-- <b-dropdown variant="outline-secondary" :text="$t('commands.print')" class="mr-1"> -->
            <b-dropdown variant="outline-secondary" text="RAPORTY" class="mr-1" size="sm">
              <b-dropdown-item @click="weightRaport1">RAPORT WAGOWY</b-dropdown-item>
              <b-dropdown-item @click="weightRaport2">RAPORT ROZMIESZCZENIA SAMOCHODÓW</b-dropdown-item>
              <b-dropdown-item @click="weightRaport3">RAPORT ZMIANOWY WAGI</b-dropdown-item>
            </b-dropdown>
            <!-- <b-button class="mr-1" variant="outline-secondary" @click="syncData"> ODŚWIEŻ </b-button> -->
            <b-button class="mr-1" variant="outline-secondary" size="sm" @click="blockSelfServiceInterface"> BLOKUJ/ODBLOKUJ INTERFEJS SAMOOBSŁUGOWY </b-button>
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
                  :current-page="currentPage"
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
      </b-card>

      <InputBarcode v-model="showScanBarcode" @on-input-barcode="onInputBarcode" />
      <CarScaleDetails
        v-model="showDetails"
        :current-weight-timer="currentWeightTimer"
        :stability-info="stabilityInfo"
        :stable="stable"
        :test-mode="testMode"
        @on-input-weight="onInputWeight"
      />
      <SerialPort v-model="comInfoPanel"></SerialPort>

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
import InputBarcode from './formComponents/input-barcode'
import CarScaleDetails from './formComponents/car-scale-details'
import SerialPort from './formComponents/serial-port'

export default {
  name: 'CarScale',
  page: {
    title: 'Wagi samochodowe',
    // meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    InputBarcode,
    CarScaleDetails,
    SerialPort,
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
      currentWeightTimer: 0,
      startTimer: false,
      testMode: false,

      showScanBarcode: false,
      showSelectionReport: false,

      scaleInWorkingPlace: false,
      // showDetails: false,

      weightingTypes: ['Pierwsze ważenie', 'Drugie ważenie'],

      limit: 5,
      stabilityTypes: ['Waga stabilna', 'Waga nie stabilna'],
      stabilityInfo: 'Waga stabilna',
      stable: false,

      correctionWeight: 0,
      currentBrutto: 0,
      currentTare: 0,
      currentNetto: 0,
      scales: [],

      operationWeight: '',

      declaredWeight: 0,
      firstWeight: 0,
      secondWeight: 0,

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

      isWielokrotność: false,
      //palaniuk
      modeElectron: process.env.IS_ELECTRON ? true : false,
      clientIdSerial: null,
      comInfoPanel: false,
    }
  },

  computed: {
    ...mapGetters({
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
    currentUser: {
      get() {
        return this.currentView.user
      },
      set(value) {
        this.setListViewProperty({ user: value })
      },
    },
    currentUserId: {
      get() {
        return this.currentView.userId
      },
      set(value) {
        this.setListViewProperty({ userId: value })
      },
    },
    currentScale: {
      get() {
        return this.currentView.scale
      },
      set(value) {
        this.setListViewProperty({ scale: value })
      },
    },
    currentScaleId: {
      get() {
        return this.currentView.scaleId
      },
      set(value) {
        this.setListViewProperty({ scaleId: value })
      },
    },
    currentDisposition: {
      get() {
        return this.currentView.currentDisposition
      },
      set(value) {
        this.setListViewProperty({ currentDisposition: value })
      },
    },
    currentDeliveryNote: {
      get() {
        return this.currentView.currentDeliveryNote
      },
      set(value) {
        this.setListViewProperty({ currentDeliveryNote: value })
      },
    },
    isSecondWeighting: {
      get() {
        return this.currentView.isSecondWeighting
      },
      set(value) {
        this.setListViewProperty({ isSecondWeighting: value })
      },
    },
    eqal: {
      get() {
        return this.currentView.eqal
      },
      set(value) {
        this.setListViewProperty({ eqal: value })
      },
    },
    showDetails: {
      get() {
        return this.currentView.showDetails
      },
      set(value) {
        this.setListViewProperty({ showDetails: value })
      },
    },
  },

  watch: {
    // currentView(newVal, oldVal) {
    //   console.log('111')
    //   this.dispositionListFirst = newVal.dispositionListFirst
    //   this.dispositionListSecond = newVal.dispositionListSecond
    // },
    comInfoPanel() {
      console.log('comInfoPanel', this.comInfoPanel)
    },
    showScanBarcode() {
      console.log('showScanBarcode', this.showScanBarcode)
    },
  },

  mounted() {
    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {})
  },

  async created() {
    this.startTimer = true
    this.countDownTimer()
    //remove after test
    await this.initialize()
    this.setStartValues()

    if (process.env.IS_ELECTRON) {
      //init serialCom
      window.ipcRenderer.send('getBarcode', 'ticketNumber')
      window.ipcRenderer.on('barcode', async (event, res) => {
        console.log('COM: ', res)
        if (res.data) {
          await this.onInputBarcode(res.data)
        }
        if (res.error) {
          await window.ipcRenderer.invoke('reConnectPort', 'reconnect')
        }
      })
    }
  },

  beforeDestroy() {
    this.startTimer = false
    if (process.env.IS_ELECTRON) {
      window.ipcRenderer.removeAllListeners('barcode')
      window.ipcRenderer.invoke('closeSerialPort', 'ticketNumber')
    }
  },

  methods: {
    async getClientIdSerial() {
      //find working place and scaleId
      this.clientIdSerial = await window.ipcRenderer.invoke('getSerialIdClient', '')
      //console.log('this.clientIdSerial: ', this.clientIdSerial)
      const response = await this.$store.dispatch('workingPlaces/findAll', {
        params: {
          filter: {
            clientIdSerial: this.clientIdSerial,
          },
        },
      })
      if (response.data[0] && response.status === 200) {
        return response.data[0].scaleId
      } else {
        return null
      }
    },

    async filterScales(scaleByWoringPlace, responseDB, fullRights = false) {
      if (process.env.IS_ELECTRON) {
        for (const scale of responseDB.data) {
          if (scaleByWoringPlace && scaleByWoringPlace == scale.id) {
            this.scales.push({ text: scale.name, value: scale.id })
            this.currentScaleId = scale.id
            this.scaleInWorkingPlace = true
          } else {
            if (fullRights) {
              this.scales.push({ text: scale.name, value: scale.id })
            } else {
              this.scales.push({ text: scale.name, value: scale.id, disabled: true })
            }
          }
        }
        if (this.currentScaleId !== '') {
          await this.changeScale()
        }
      } else {
        for (const scale of responseDB.data) {
          this.scales.push({ text: scale.name, value: scale.id })
        }
      }
    },

    async initialize() {
      const authUser = await this.$store.state.auth.currentUser
      this.currentUserId = authUser.id
      let scaleByWoringPlace = null

      const params = {
        userId: authUser.id,
        userSettingItemKey: 'weightingTestMode',
      }

      await this.$store
        .dispatch('userSettings/findByKey', { params })
        .then((response) => {
          if (response.status === 200) {
            this.testMode = response.data
          }
        })
        .catch((error) => {
          console.warn(error)
        })

      await this.$store.dispatch('weightingScalesCars/findAllForScalesCars', { scaleId: this.currentScaleId })

      //find workingPlace
      if (process.env.IS_ELECTRON) {
        scaleByWoringPlace = await this.getClientIdSerial()
      }

      await this.$store.dispatch('scales/findAll', { params: { filter: { typeOfDocument: 'Automobile' } }, noCommit: true }).then((response) => {
        if (response.status === 200) {
          this.scales = []
          this.filterScales(scaleByWoringPlace, response, authUser.fullRights)
        }
      })
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
      if (this.showDetails === false) {
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
      }

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
      if (this.currentScaleId === '') {
        showMessageBox(this, 'Nie wybrana waga! Ważenie niemożliwe!')
        return
      }
      this.showScanBarcode = true
    },

    async onInputBarcode(findBarCode) {
      this.currentBarCode = findBarCode
      const arrStates = [
        'NaTerminalu',
        'Loaded',
        'Unloaded',
        'Closed',
        'ToClarifySecurity',
        'ParkingDeparture',
        'OnWarehouse',
        'ToClarifyWarehouse',
        'FirstWeighing',
        'SecondWeighing',
        'ToClarifyDisponent',
        'AddWeight',
        'RemoveWeight',
        'ZeroDN',
      ]
      const queryParams = { params: { ticketNumber: findBarCode, arrStates: arrStates } }
      await this.$store
        .dispatch('dispositions/getDispositionByTicket', queryParams)
        .then((response) => {
          if (response.status === 200) {
            const selectedItem = response.data
            if (selectedItem === '') {
              showMessageBox(this, 'Dyspozycja nie zostanie znaleziony!', 28, true)
              this.currentBarCode = ''
              return
            }
            if (!selectedItem.typeOfDocument === 'Automobile') {
              const stringMessage =
                'Ważenie jest nie możliwe! \
									Nie właściwa waga!'
              showMessageBox(this, stringMessage, 28, true)
              this.currentBarCode = ''
              return
            }
            if (!(selectedItem.status.key === 'NaTerminalu' || selectedItem.status.key === 'Loaded' || selectedItem.status.key === 'Unloaded')) {
              const stringMessage =
                'Uwaga! Nie właściwy status dyspozycji... \
                      \n Obecny status: ' +
                selectedItem.status.name +
                '.'
              showMessageBox(this, stringMessage, 28, true, 'xl')
              return
            }

            // const queryParams = { params: { ticketNumber: findBarCode } }
            // await this.$store
            //   .dispatch('weightingScalesCars/getDispositionByTicket', queryParams)
            //   .then((response) => {
            //     if (response.status === 200) {
            //       const selectedItem = response.data // якщо стікера немає повертає пусту строку ""
            //       if (selectedItem === '' || selectedItem === null) {
            //         // було null
            //         showMessageBox(this, 'Dyspozycja nie zostanie znaleziony!', 28, true)
            //         return
            //       }
            if (selectedItem.status.key === 'NaTerminalu') {
              this.weightType = this.weightingTypes[0]
              this.selectedListFirst = selectedItem
              this.currentDisposition = this.selectedListFirst
            } else {
              this.weightType = this.weightingTypes[1]
              this.selectedListSecond = selectedItem
              this.currentDisposition = this.selectedListSecond
            }
            this.showDetails = true
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    onInputWeight() {
      console.log('onInputWeight')
      this.initialize()
    },
    async syncData() {
      const queryParams = { params: { isFull: true } }
      await this.$store.dispatch('sync1CData/runSyncData', queryParams)

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
    async printDN() {
      this.$router.push({ name: 'delivery-notes', params: { scaleNetto: this.scale } })
    },
    selectReport() {
      this.showSelectionReport = true
    },
    weightRaport1() {
      this.$router.push({ name: 'shift-report-from-scale', params: { object: this.object, reportType: 'shiftReportFromScale' } })
      this.showSelectionReport = false
    },
    weightRaport2() {
      this.$router.push({ name: 'disposition-list-report', params: { object: this.object, reportType: 'dispositionList' } })
      this.showSelectionReport = false
    },
    weightRaport3() {
      this.showSelectionReport = false
      this.$router.push({ name: 'shift-report-from-scale', params: { object: this.object, reportType: 'shiftReportFromScale' } })
    },

    async editObject(objectId, weightType) {
      if (this.currentScaleId === '') {
        showMessageBox(this, 'Nie wybrana waga! Ważenie niemożliwe!')
        return
      }
      this.currentDisposition = null
      this.currentDeliveryNote = null

      let response = await this.$store.dispatch(`dispositions/findByPk`, {
        params: {
          id: objectId,
        },
      })
      if (response.status === 200) {
        this.weightType = weightType
        this.currentDisposition = response.data
        response = await this.$store.dispatch('deliveryNotes/findForWeighting', { dispositionId: objectId, dispositionStatusKey: this.currentDisposition.status.key })

        if (response && response.status === 200) {
          this.currentDeliveryNote = response.data
        }

        this.showDetails = true
        this.isSecondWeighting = this.weightType === this.weightingTypes[1]
        this.isWielokrotność = this.currentDisposition.numberOfWeighings > 1
      }
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
      for (const scale of this.scales) {
        if (scale.id === this.currentScaleId) {
          this.currentScale = scale
          break
        }
      }
      await this.$store.dispatch('weightingScalesCars/findAllForScalesCars', { scaleId: this.currentScaleId }).catch((error) => {
        console.warn(error)
      })
    },

    tabsClick(tabIndex) {
      this.weightType === this.weightingTypes[tabIndex]
    },

    async blockSelfServiceInterface() {
      if (this.currentScaleId === '') {
        showMessageBox(this, 'Nie wybrana waga!')
        return
      }

      let response = await this.$store.dispatch('scales/findByPk', { params: { id: this.currentScaleId }, noCommit: true })
      let textMessage = ''
      if (response) {
        const currentScale = response.data
        if (currentScale.blockSelfServiceInterface === true) {
          currentScale.blockSelfServiceInterface = false
          textMessage = 'Samoobsługowy interfejs odblokowany!'
        } else {
          currentScale.blockSelfServiceInterface = true
          textMessage = 'Samoobsługowy interfejs zablokowany!'
        }
        response = await this.$store.dispatch('scales/update', currentScale)
        if (response) {
          showMessageBox(this, textMessage)
        }
      }
    },

    countDownTimer() {
      if (!this.startTimer === true) return

      setTimeout(async () => {
        if (this.testMode) {
          this.currentWeightTimer = Number(this.currentWeightTimer) + 1
          if (this.stabilityInfo === this.stabilityTypes[0]) {
            this.stabilityInfo = this.stabilityTypes[1]
          } else {
            this.stabilityInfo = this.stabilityTypes[0]
          }
        } else {
          const weightingData = await weightingsGetWeight(this.currentScaleId, this.currentWeightTimer)
          if (weightingData) {
            this.currentWeightTimer = Number(weightingData.weight)
            const stabilityIndex = Number(weightingData.stabilityIndex)
            this.stabilityInfo = this.stabilityTypes[stabilityIndex]
          }
        }
        this.stable = this.stabilityInfo === this.stabilityTypes[0]
        console.log('car_scale_timer', this.currentWeightTimer)
        this.countDownTimer()
      }, 3000)
    },

    openSettingCom() {
      console.log('Setting port')
      this.comInfoPanel = true
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

.not-stable-weight {
  color: red;
}
.stable-weight {
  color: rgb(135, 74, 249);
}
</style>
