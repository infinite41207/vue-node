<template>
  <Layout>
    <div>
      <b-card align="center">
        <b-row align="left">
          <b-col md="6">
            <p style="font-size: 50px; font-weight: bold" :class="{ 'not-stable-weight': !stable, 'stable-weight': stable }"> {{ currentWeightTimer }} T: {{ stabilityInfo }} </p>
          </b-col>
          <b-col md="6"> </b-col>
        </b-row>
        <b-row>
          <b-col md="2">
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
          <b-col>
            <b-form-group horizontal :label-cols="2" :label="$t('route.dispositions')" label-for="disposition">
              <f-select
                v-model="currentDisposition"
                select-btn
                open-btn
                value-type="dispositions"
                detail-view="disposition-form"
                placeholder="Wyszukaj dispozycje..."
                label="presentation"
                :filter="dispositionFilter"
              >
              </f-select>
            </b-form-group>
          </b-col>
          <b-col align="right">
            <b-button class="mr-1" variant="outline-secondary" size="sm" @click="scanBarCode"> ZESKANUY KOD </b-button>
            <b-button class="mr-1" variant="outline-secondary" size="sm" @click="enterWagons"> WPROWADŻ WAGONY </b-button>
            <b-button class="mr-1" variant="outline-secondary" size="sm" @click="printDN"> KWITY </b-button>
            <!-- <b-button class="mr-1" variant="outline-secondary" size="sm" @click="selectReport"> RAPORTY </b-button> -->
            <!-- <b-button class="mr-1" @click="syncData"> ODŚWIEŻ </b-button> -->
            <b-dropdown variant="outline-secondary" text="RAPORTY" class="mr-1" size="sm">
              <b-dropdown-item @click="weightRaport1">RAPORT WAGOWY</b-dropdown-item>
              <b-dropdown-item @click="weightRaport2">RAPORT ROZMIESZCZENIA SAMOCHODÓW</b-dropdown-item>
              <b-dropdown-item @click="weightRaport3">RAPORT ZMIANOWY WAGI</b-dropdown-item>
            </b-dropdown>
          </b-col>
        </b-row>

        <!-- <b-row>
            <b-col>
              <b-form-group horizontal :label-cols="1" :label="$t('route.dispositions')" label-for="currentDispositionIdSelect">
                <b-form-select id="currentDispositionIdSelect" v-model="currentDispositionId" :options="dispositions" size="sm" @change="changeDisposition" />
              </b-form-group>
            </b-col>
          </b-row> -->

        <b-table
          ref="deliveryNotes"
          hover
          striped
          responsive
          bordered
          class="mb-2"
          small
          selectable
          select-mode="single"
          no-local-sorting
          :items="deliveryNotes"
          :fields="fieldsW1"
          :per-page="perPage"
          :current-page="currentPage"
          :tbody-tr-class="rowClass"
          primary-key="index"
        >
          <template v-slot:cell(index)="data">
            <p>{{ getLineNumber(data.index) }}</p>
          </template>
          <template v-slot:cell(vehicle)="data">
            <!-- <p>{{ getCatalogPresentation(data.item.vehicle) }}</p> -->
            <a href="javascript:void(0);" @click="editObject(data.item.id)">
              <span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ getCatalogPresentation(data.item.vehicle) }}</span>
            </a>
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
      </b-card>
      <div> </div>

      <InputBarcode v-model="showScanBarcode" @on-input-barcode="onInputBarcode" />
      <InputWagon v-model="showEnterWagon" @on-input-wagon="onInputWagon" />
      <RailwayScaleDetails
        v-model="showDetails"
        :current-weight-timer="currentWeightTimer"
        :stability-info="stabilityInfo"
        :stable="stable"
        :test-mode="testMode"
        @on-input-weight="onInputWeight"
      />

      <!-- <b-modal
        v-model="showEnterWagon"
        title="Dodanie wagonu"
        header-class="pr-4 pl-4 border-bottom-0"
        title-class="text-black font-18"
        body-class="pt-3 pr-4 pl-4"
        centered
        @ok="onShowEnterWagonOK"
      >
        <b-form-group horizontal :label-cols="3" :label="$t('table.wagon')" label-for="currentWagonRef">
          <f-select
            ref="currentWagonRef"
            v-model="currentWagonId"
            select-btn
            open-btn
            value-type="vehicles"
            detail-view="vehicle-detail"
            placeholder="Wyszukaj wagon..."
            label="presentation"
            :obFilter="wagonFilter"
          >
          </f-select>
        </b-form-group>

        <b-form-group horizontal :label-cols="3" :label="$t('table.tare')" label-for="currentWagonTare">
          <b-form-input id="currentWagonTare" v-model="currentWagonTare" size="sm" type="number" step="0.001" min="0.000" max="50.000" class="form-control" />
        </b-form-group>
        <b-form-group horizontal :label-cols="3" :label="$t('table.loadCapacity')" label-for="currentWagonLoadCapacity">
          <b-form-input id="currentWagonLoadCapacity" v-model="currentWagonTare" size="sm" type="number" step="0.001" min="0.000" max="50.000" class="form-control" />
        </b-form-group>
      </b-modal> -->

      <!-- <b-modal v-model="showViewDisposition" size="xl" hide-footer body-class="pr-4 pl-4 pb-3" title="Ważenie dispozycji">
        <div align="left" style="font-size: 18px">
          <b-row style="font-size: 50px; font-weight: bold">
            <p :style="{ color: colorWeight }"> {{ currentWeight }} T. {{ stabilityInfo }} </p>
          </b-row>
          <p> </p>
          <b-row align-h="start">
            <b-col md="6">
              <p>
                Numer pociągu: <b> {{ getObjectAttrByName(currentDisposition, 'trainNumber') }}</b></p
              >
              <p>
                Numer wagonu: <b> {{ getCatalogPresentation(getObjectAttrByName(currentDeliveryNote, 'vehicle')) }}</b></p
              >
              <p>
                Magazyn: <b> {{ getCatalogPresentation(getObjectAttrByName(currentDisposition, 'warehouse')) }}</b></p
              >
              <p>
                Deklarowana tara: <b> {{ getObjectAttrByName(getObjectAttrByName(currentDeliveryNote, 'vehicle'), 'tare') }} </b></p
              >
              <p>
                Nośność wagonu: <b> {{ getObjectAttrByName(getObjectAttrByName(currentDeliveryNote, 'vehicle'), 'loadCapacity') }} </b></p
              >
            </b-col>
            <b-col md="6">
              <p>
                Typ ważenia: <b> {{ weightType }} </b></p
              >
              <p>
                Waga maksymalna:
                <b>
                  {{
                    (
                      Number(getObjectAttrByName(getObjectAttrByName(currentDeliveryNote, 'vehicle'), 'tare')) +
                      Number(getObjectAttrByName(getObjectAttrByName(currentDeliveryNote, 'vehicle'), 'loadCapacity'))
                    ).toFixed(3)
                  }}</b
                ></p
              >
              <p>
                Tara zważona: <b> {{ getObjectAttrByName(currentDeliveryNote, 'tare') }}</b></p
              >
              <p>
                Waga brutto: <b> {{ getObjectAttrByName(currentDeliveryNote, 'brutto') }}</b></p
              >
              <p>
                Waga netto: <b> {{ getObjectAttrByName(currentDeliveryNote, 'netto') }}</b></p
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
                Waga: <b> {{ getCatalogPresentation(getObjectAttrByName(currentDeliveryNote, 'scaleBrutto')) }} </b></p
              >
              <p>
                Brutto:<b> {{ currentBrutto }} </b></p
              >
              <p> Data i czas ważenia:</p>
              <p>
                <b> {{ setFormatDateTime(getObjectAttrByName(currentDeliveryNote, 'bruttoTime')) }} </b></p
              >
            </b-col>
            <b-col md="4">
              <p style="border-bottom: 2px solid lightgrey"> <b> TARA </b></p>
              <p>
                Waga: <b> {{ getCatalogPresentation(getObjectAttrByName(currentDeliveryNote, 'scaleTare')) }} </b></p
              >

              <p>
                Tara:<b> {{ currentTare }} </b></p
              >
              <p> Data i czas ważenia:</p>
              <p>
                <b> {{ setFormatDateTime(getObjectAttrByName(currentDeliveryNote, 'tareTime')) }} </b></p
              >
            </b-col>
            <b-col md="4">
              <p style="border-bottom: 2px solid lightgrey"> <b> NETTO </b></p>
              <p>
                Waga: <b> {{ getCatalogPresentation(getObjectAttrByName(currentDeliveryNote, 'scaleNetto')) }} </b></p
              >
              <p>
                Netto:<b> {{ currentNetto }} </b></p
              >
              <p> Data i czas ważenia:</p>
              <p>
                <b> {{ setFormatDateTime(getObjectAttrByName(currentDeliveryNote, 'nettoTime')) }} </b></p
              >
            </b-col>
          </b-row>
          <p> </p>
          <b-row>
            <b-button variant="primary" class="mr-1" @click="setWeight"> OK </b-button>
            <b-button variant="danger" class="mr-1" @click="getWeightBrutto"> ZWAŻ BRUTTO</b-button>
            <b-button variant="danger" class="mr-1" @click="getWeightTare"> ZWAŻ TARA</b-button>
            <b-button class="mr-1" @click="cancellationOfWeighing"> ZRZUĆ (ANULUJ) </b-button>
          </b-row>
        </div>
      </b-modal> -->
    </div>
  </Layout>
</template>


<script>
import _ from 'lodash'
import InputBarcode from './formComponents/input-barcode'
import InputWagon from './formComponents/input-wagon'
import RailwayScaleDetails from './formComponents/railway-scale-details'
import SerialPort from './formComponents/serial-port'
// import appConfig from '@/app.config'
import Layout from '@/layouts/main'
// import PageHeader from '@components/page-header'
import { mapGetters, mapMutations } from 'vuex'
import {
  catalogPresentation,
  documentPresentation,
  dateTimePresentation,
  showMessageBox,
  showQuestion,
  fillObject as commonUseFillObject,
  newUuid as getNewUuid,
} from '@/utils/commonUse.js'
import {
  getWeight as weightingsGetWeight,
  thisIsShipment as weightingsThisIsShipment,
  getDataForWriteOK as weightingsGetDataForWriteOK,
  getDataForWriteNumberOfWeighted as weightingsGetDataForWriteNumberOfWeighted,
  getDataForWriteAddRemove as weightingGetDataForWriteAddRemove,
  getDataForWriteSendToTare as weightingsGetDataForWriteSendToTare,
} from '@/utils/weightings.js'
import DeliveryNote from '@/dto/DeliveryNote.json'

export default {
  name: 'RailwayScale',
  page: {
    title: 'Wagi samochodowe',
    // meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    // PageHeader
    InputBarcode,
    InputWagon,
    RailwayScaleDetails,
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

      title: 'Wagi kolejowe',

      testMode: true,

      showWeight: false,
      showScanBarcode: false,
      showEnterWagon: false,

      // weightingTypes: ['Tara deklarowana', 'Tara zważona'],

      perPage: 10,
      currentPage: 1,
      totalRows: 1,

      currentWeight: 0,
      currentBrutto: 0,
      currentTare: 0,
      currentNetto: 0,
      eqal: 0,

      currentBarCode: '',
      scales: [],

      currentDispositionId: null,
      dispositions: [],
      deliveryNotes: [],

      wagons: [],
      currentWagonId: '',
      currentWagonTare: 0,
      currentWagonLoadCapacity: 0,
      wagonFilter: { type: 'Carriage', markedToDelete: false },

      scaleBrutto: null,
      scaleTare: null,
      scaleNetto: null,
      operationWeight: '',

      // weightType: '',

      numberOfCopies: 1,

      fieldsW1: [
        { key: 'index', label: 'Nr' },
        { key: 'vehicle', label: 'Numer wagonu', sortable: true },
        { key: 'trainNumber', label: 'Numer pociągu', sortable: true },
        { key: 'numberStr', label: 'Numer', sortable: true },
        { key: 'date', label: 'Data', sortable: true },
        { key: 'dispositionType', label: 'Dispozycja', sortable: true },
        { key: 'orderNumber', label: 'Zlecenie', sortable: true },
        { key: 'schemeOfCargo', label: 'Relacja', sortable: true },
        { key: 'typeOfOperation', label: 'Typ', sortable: true },
        { key: 'brutto', label: 'Brutto', sortable: true },
        { key: 'tare', label: 'Tara', sortable: true },
        { key: 'netto', label: 'Netto', sortable: true },
        { key: 'product', label: 'Towar', sortable: true },
        { key: 'forwarder', label: 'Spedytor', sortable: true },
        // { key: 'vendor', label: 'Dostawca', sortable: true },
        // { key: 'customer', label: 'Odbiorca', sortable: true },
      ],

      selectMode: 'single',
      selectedListFirst: [],
      isClickWeighting: false,

      modeElectron: process.env.IS_ELECTRON ? true : false,
      clientIdSerial: null,
      comInfoPanel: false,

      currentWeightTimer: 0,
      stabilityTypes: ['Waga stabilna', 'Waga nie stabilna'],
      stabilityInfo: 'Waga stabilna',
      stable: false,
      startTimer: false,
    }
  },

  computed: {
    ...mapGetters({
      currentView: 'weightingScalesRailway/currentView',
      deliveryNotesList: 'weightingScalesRailway/deliveryNotesList',
    }),
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
        this.currentDispositionId = value ? value.id : null
        this.changeDisposition()
      },
    },
    dispositionFilter: {
      get() {
        return this.currentView.dispositionFilter
      },
      set(value) {
        this.setListViewProperty({ dispositionFilter: value })
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
    // dispositionList(newVal, oldVal) {
    //   this.dispositions = []
    //   for (const item of this.dispositionList) {
    //     this.dispositions.push({ text: this.getDocumentPresentation(item), value: item.id })
    //   }
    // },
  },

  mounted() {
    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {})
  },

  async created() {
    this.startTimer = true
    this.countDownTimer()

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
    async initialize() {
      let scaleByWoringPlace = null
      const authUser = await this.$store.state.auth.currentUser
      this.currentUser = authUser
      this.currentUserId = authUser.id

      // await this.$store.dispatch('weightingsScalesRailway/findAllForScalesRailway', { scaleId: this.currentScalesId })
      await this.fillDispositionsFilter()
      if (process.env.IS_ELECTRON) {
        scaleByWoringPlace = await this.getClientIdSerial()
      }

      await this.$store.dispatch('scales/findAll', { params: { filter: { typeOfDocument: 'Railway' } }, noCommit: true }).then((response) => {
        if (response.status === 200) {
          this.scales = []
          this.filterScales(scaleByWoringPlace, response, authUser.fullRights)
        }
      })

      this.fillDispositionsFilter()
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
    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },
    ...mapMutations({
      addObjectView: `weightingScalesRailway/addObjectView`,
      setListViewProperty: `weightingScalesRailway/setListViewProperty`,
      setFilter: `weightingScalesRailway/setFilters`,
      setSort: `weightingScalesRailway/setSort`,
    }),
    setStartValues() {
      this.currentWeight = 0
      this.correctionWeight = 0
      this.currentDisposition = null
      this.currentDeliveryNote = null
      this.currentBarCode = ''
      // this.weightType = this.weightingTypes[0]
      // this.disposition = ''
      // this.vehicleNumber = ''
      // this.warehouse = ''
      // this.ship = ''
      // this.declaredWeight = 0
      // this.firstWeight = 0
      // this.secondWeight = 0
      // this.currentBrutto = 0
      // this.currentTare = 0
      // this.currentNetto = 0
      // this.numberOfWeighted = 0
      // this.operationWeight = ''
      // this.isSecondWeighting = false
      // this.isWielokrotność = false

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
      const arrStates = ['NaTerminalu', 'OnTheWay', 'Closed']
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
            if (!selectedItem.typeOfDocument === 'Railway') {
              const stringMessage =
                'Ważenie jest nie możliwe! \
									Nie właściwa waga!'
              showMessageBox(this, stringMessage, 28, true)
              this.currentBarCode = ''
              return
            }
            if (!(selectedItem.status.key === 'NaTerminalu' || selectedItem.status.key === 'OnTheWay')) {
              const stringMessage =
                'Uwaga! Nie właściwy status dyspozycji... \
                      \n Obecny status: ' +
                selectedItem.status.name +
                '.'
              showMessageBox(this, stringMessage, 28, true, 'xl')
              return
            }
            this.currentDisposition = this.selectedItem
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    enterWagons() {
      if (this.currentDispositionId === '') {
        showMessageBox(this, 'Nie wybrana dyspozycja!', 28, true)
        return
      }
      this.showEnterWagon = true
    },
    async onInputWagon(obInputValues) {
      for (const row of this.deliveryNotes) {
        if (row.vehicle && row.vehicle.id === obInputValues.wagonId) {
          const stringMessage = 'Uwaga! Wagon ' + row.vehicle.name + ' wszedł więcej niż jeden raz!!!'
          showMessageBox(this, stringMessage, 28, true, 'xl')
          return
        }
      }

      const queryParams = {
        dispositionId: this.currentDisposition.id,
        scaleId: this.scaleId,
        authorId: this.currentUserId,
      }

      const dataForWrite = _.cloneDeep(DeliveryNote)
      dataForWrite.action = 'create'
      dataForWrite.id = getNewUuid()
      const excludeArray = ['id', 'date', 'number', 'numberStr', 'author', 'comment']
      commonUseFillObject(dataForWrite, this.currentDisposition, [], excludeArray)
      dataForWrite.dispositionId = this.currentDisposition.id
      dataForWrite.date = Date.now()
      dataForWrite.prefix = 'LP'
      dataForWrite.state = 'OnTare'
      dataForWrite.tare = obInputValues.wagonTare
      dataForWrite.tareTime = Date.now()
      dataForWrite.tareAuthorId = this.currentUserId
      dataForWrite.scaleTareId = this.currentScaleId
      dataForWrite.brutto = 0
      dataForWrite.bruttoAuthorId = this.currentUserId
      dataForWrite.scaleBruttoId = this.currentScaleId
      dataForWrite.netto = 0
      dataForWrite.nettoAuthorId = this.currentUserId
      dataForWrite.scaleNettoId = this.currentScaleId
      dataForWrite.comment = ''
      dataForWrite.markedToDelete = false
      await this.$store.dispatch('deliveryNotes/create', dataForWrite)
      await this.changeDisposition()
      this.$store.dispatch('sync1CData/sendTo1C')
    },

    async editObject(objectId) {
      if (this.currentScaleId === '') {
        showMessageBox(this, 'Nie wybrana waga! Ważenie niemożliwe!')
        return
      }
      this.currentDeliveryNote = null
      const response = await this.$store.dispatch(`deliveryNotes/findByPk`, {
        params: {
          id: objectId,
        },
        noCommit: true,
      })
      if (response.status === 200) {
        this.currentDeliveryNote = response.data
        this.showDetails = true
      }
    },
    async onInputWeight() {},

    getWeightBrutto() {
      if (this.stabilityInfo === 'Waga nie stabilna') {
        return
      }

      this.operationWeight = 'brutto'
      this.getWeightContinue()
    },
    getWeightTare() {
      if (this.stabilityInfo === 'Waga nie stabilna') {
        return
      }

      this.operationWeight = 'tare'
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
      if (this.operationWeight === 'brutto') {
        this.currentBrutto = this.currentWeight
      } else if (this.operationWeight === 'tare') {
        this.currentTare = this.currentWeight
      }

      this.currentNetto = (this.currentBrutto - this.currentTare).toFixed(3)
    },
    setWeight() {
      //   if (!this.isClickWeighting) {
      //     showMessageBox(this, 'Ważenie niedokończone!')
      //     return
      //   }
      //   if (this.weightType === this.weightingTypes[1] && this.operationWeight === 'OK') {
      //     const objParameters = { currentDeliveryNoteId: this.currentDeliveryNote.id }
      //     showQuestion(this, 'Wydrukować kwity?', this.printCurrentDeliveryNote, undefined, objParameters)
      //   }
      //   this.setWeightingEnd()
      // },
      // async setWeightingEnd() {
      //   let dataForWrite = ''
      //   if (this.operationWeight === 'OK' || this.operationWeight === 'ZeroDN') {
      //     dataForWrite = weightingsGetDataForWriteOK(this)
      //     await this.$store.dispatch('dispositions/updateItem', dataForWrite.dispositionData)
      //     await this.$store.dispatch('deliveryNotes/' + dataForWrite.deliveryNoteData.action, dataForWrite.deliveryNoteData)
      //     await this.writeNumberOfWeighted()
      //   } else if (this.operationWeight === 'Add' || this.operationWeight === 'Remove') {
      //     dataForWrite = weightingGetDataForWriteAddRemove(this)
      //     await this.$store.dispatch('dispositions/updateItem', dataForWrite)
      //   }
      //   await this.initialize()
      //   this.setStartValues()
      //   this.showViewDisposition = false
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
    cancellationOfWeighing() {
      this.showViewDisposition = false
      this.setStartValues()
    },
    printDN() {
      this.$router.push('/deliveryNotesList')
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
    // async onRowSelectedListFirst(items) {
    //   this.selectedListFirst = items
    //   if (this.selectedListFirst.length > 0) {
    //     this.weightType = this.weightingTypes[0]
    //     this.currentDeliveryNote = this.selectedListFirst[0]

    // console.log('this.currentDeliveryNote = ', this.currentDeliveryNote)
    // console.log('this.currentDisposition = ', this.currentDisposition)

    //   const queryParams = {
    //     dispositionId: this.currentDispositionId,
    //   }
    //   this.currentDeliveryNote = await this.$store.dispatch('deliveryNotes/findForWeighting', queryParams)
    //   if (this.currentDeliveryNote !== null) {
    //     this.currentBrutto = this.currentDeliveryNote.brutto
    //     this.currentTare = this.currentDeliveryNote.tare
    //     this.currentNetto = this.currentDeliveryNote.netto
    //     this.scaleBrutto = this.currentDeliveryNote.scaleBrutto
    //     this.scaleTare = this.currentDeliveryNote.scaleTare
    //     this.scaleNetto = this.currentDeliveryNote.scaleNetto
    //   } else {
    //     this.currentBrutto = 0
    //     this.currentTare = 0
    //     this.currentNetto = 0
    //     this.scaleBrutto = null
    //     this.scaleTare = null
    //     this.scaleNetto = null
    //   }
    // this.showViewDisposition = true
    //   this.isSecondWeighting = false
    //   this.isWielokrotność = false
    //   this.isClickWeighting = false
    // } else {
    //   this.currentDisposition = null
    //   this.currentDeliveryNote = null
    //   }
    // },
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
      // this.showViewDisposition = false
    },
    getObjectAttrByName(obj, attrName) {
      if (obj) {
        const attr = obj[attrName]
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
      await this.fillDispositionsFilter()
      // await this.$store.dispatch('weightingsScalesRailway/findAllForScalesRailway', { scaleId: this.currentScaleId }).catch((error) => {
      //   console.warn(error)
      // })

      // let isFindCurrentDispositionId = false
      // for (const item of this.dispositionList) {
      //   if (item.id === this.currentDispositionId) {
      //     isFindCurrentDispositionId = true
      //     break
      //   }
      // }
      // if (!isFindCurrentDispositionId) {
      //   if (this.dispositionList.length === 0) {
      //     this.currentDispositionId = ''
      //   } else {
      //     this.currentDispositionId = this.dispositionList[0].id
      //   }

      //   this.changeDisposition()
      // }
    },
    async changeDisposition() {
      this.deliveryNotes = []
      if (!this.currentDispositionId) {
        return
      }
      // let response = await this.$store.dispatch('dispositions/findByPk', { params: { id: this.currentDispositionId } })

      const response = await this.$store.dispatch('deliveryNotes/findAll', { params: { filter: { dispositionId: this.currentDispositionId } } })
      if (response) {
        for (const item of response.data) {
          item.dispositionType = item.disposition.type
          item.orderNumber = item.disposition.order.number
          this.deliveryNotes.push(item)
        }
      }
    },

    async fillDispositionsFilter() {
      const response = await this.$store.dispatch('weightingScalesRailway/getDispositionFilter', { scaleId: this.currentScaleId })
    },

    async fillWagons() {
      const params = {
        type: '	Carriage',
        markedToDelete: false,
      }
      const wagons = await this.$store.dispatch('vehicles/findAll', { params })
      for (const item of wagons) {
        this.wagons.push({ name: item.name, value: item.id, tare: item.tare, loadCapacity: item.loadCapacity })
      }

      console.log('wagons count = ', this.wagons.length)
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
        console.log('railway_scale_timer', this.currentWeightTimer)
        this.countDownTimer()
      }, 3000)
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
