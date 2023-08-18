<template>
  <Layout>
    <div>
      <b-card align="center">
        <b-row>
          <span align="left" style="font-size: 50px; font-weight: bold; margin-left: 20px" :class="{ 'not-stable-weight': !stable, 'stable-weight': stable }">
            {{ getWeightPresentation(currentWeightTimer) }}
          </span>
          <span align="left" style="font-size: 32px; font-weight: bold; margin-top: 15px; margin-left: 50px" :class="{ 'not-stable-weight': !stable, 'stable-weight': stable }">
            {{ stabilityInfo }}
          </span>
        </b-row>

        <b-row>
          <b-col md="3">
            <b-form-group horizontal :label-cols="5" :label="$t('table.weighingStation')" label-for="weighingStationId">
              <b-form-select id="weighingStationId" v-model="weighingStationId" :options="weighingStations" size="sm" @change="changeWeighingStation" />
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group horizontal :label-cols="3" :label="$t('table.scale')" label-for="scaleId">
              <b-form-select id="scaleId" v-model="scaleId" :options="scales" size="sm" @change="changeScale" />
            </b-form-group>
          </b-col>
          <b-col align="right">
            <b-button class="mr-1" variant="outline-secondary" size="sm" @click="scanBarCode"> ZESKANUY KOD </b-button>
            <b-button class="mr-1" variant="outline-secondary" size="sm" @click="printDN"> KWITY </b-button>
            <b-dropdown class="mr-1" variant="outline-secondary" size="sm" text="RAPORTY">
              <b-dropdown-item @click="weightRaport1">RAPORT WAGOWY</b-dropdown-item>
              <b-dropdown-item @click="weightRaport2">RAPORT ROZMIESZCZENIA SAMOCHODÓW</b-dropdown-item>
              <b-dropdown-item @click="weightRaport3">RAPORT ZMIANOWY WAGI</b-dropdown-item>
            </b-dropdown>
            <b-button class="mr-1" variant="outline-secondary" size="sm" @click="addDisposition"> DODAY DYSPOZYCJE </b-button>
          </b-col>
        </b-row>

        <b-table
          ref="dispositionList"
          hover
          striped
          responsive
          bordered
          class="mb-2"
          small
          selectable
          select-mode="single"
          no-local-sorting
          :items="dispositionList"
          :fields="fieldsW1"
          :per-page="perPage"
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
          <template v-slot:cell(vehicle)="data">
            <a href="javascript:void(0);" @click="editObject(data.item.id)">
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
          <template v-slot:cell(warehouse)="data">
            <p>{{ getCatalogPresentation(data.item.warehouse) }}</p>
          </template>
          <template v-slot:cell(status)="data">
            <p>{{ getCatalogPresentation(data.item.status) }}</p>
          </template>
        </b-table>
        <b-row class="mt-2">
          <b-col>
            <b-pagination v-model="currentPage" :total-rows="currentView.total" :per-page="perPage" align="right" class="my-0"> </b-pagination>
          </b-col>
        </b-row>
      </b-card>

      <InputBarcode v-model="showScanBarcode" @on-input-barcode="onInputBarcode" />
      <BunkerScaleDetails
        v-model="showDetails"
        :current-weight-timer="currentWeightTimer"
        :netto="netto"
        :lost-weight="lostWeight"
        :stability-info="stabilityInfo"
        :stable="stable"
        :test-mode="testMode"
        @on-input-weight="onInputWeight"
      />
    </div>
  </Layout>
</template>


<script>
// import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import { mapGetters, mapMutations } from 'vuex'
import { catalogPresentation, documentPresentation, dateTimePresentation, weightPresentation, showMessageBox, showQuestion } from '@/utils/commonUse.js'
import {
  getWeight as weightingsGetWeight,
  thisIsShipment as weightingsThisIsShipment,
  getDataForWriteOK as weightingsGetDataForWriteOK,
  getDataForWriteNumberOfWeighted as weightingsGetDataForWriteNumberOfWeighted,
  getDataForWriteAddRemove as weightingGetDataForWriteAddRemove,
  getDataForWriteSendToTare as weightingsGetDataForWriteSendToTare,
  readValueS7 as weightingsReadValueS7,
} from '@/utils/weightings.js'
import InputBarcode from './formComponents/input-barcode'
import BunkerScaleDetails from './formComponents/bunker-scale-details'

export default {
  name: 'BunkerScale',

  page: {
    title: 'Wagi zasypowe',
    // meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    // PageHeader
    InputBarcode,
    BunkerScaleDetails,
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

      title: 'Wagi zasypowe',

      currentWeightTimer: 0,
      startTimer: false,
      testMode: false,

      showScanBarcode: false,
      currentBarCode: '',

      perPage: 6,

      scales: [],
      weighingStations: [],
      stabilityTypes: ['Waga stabilna', 'Waga nie stabilna'],
      stabilityInfo: 'Waga stabilna',
      stable: false,

      numberOfCopies: 1,

      fieldsW1: [
        { key: 'index', label: 'Nr' },
        { key: 'vehicle', label: 'Samochód / Wagon', sortable: true },
        { key: 'driver', label: 'Kierowca', sortable: true },
        { key: 'order', label: 'Zlecenje', sortable: true },
        { key: 'disposition', label: 'Dispozycja', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'schemeOfCargo', label: 'Relacja', sortable: true },
        { key: 'quantity', label: 'Deklarowany tonaż', sortable: true },
        { key: 'product', label: 'Towar', sortable: true },
        { key: 'forwarder', label: 'Spedytor', sortable: true },
        { key: 'ship', label: 'Statek', sortable: true },
        { key: 'warehouse', label: 'Magazyn', sortable: true },
        { key: 'type', label: 'Typ', sortable: true },
      ],
    }
  },

  computed: {
    ...mapGetters({
      currentView: 'weightingScalesBunker/currentView',
      dispositionList: 'weightingScalesBunker/dispositionList',
    }),
    currentPage: {
      get() {
        return this.currentView.page
      },
      set(value) {
        this.setListViewProperty({ page: value })
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
    lostWeight: {
      get() {
        return this.currentView.lostWeight
      },
      set(value) {
        this.setListViewProperty({ lostWeight: value })
      },
    },
    netto: {
      get() {
        return this.currentView.netto
      },
      set(value) {
        this.setListViewProperty({ netto: value })
      },
    },
    weightAtBeginning: {
      get() {
        return this.currentView.weightAtBeginning
      },
      set(value) {
        this.setListViewProperty({ weightAtBeginning: value })
      },
    },
    weightAtEnd: {
      get() {
        return this.currentView.weightAtEnd
      },
      set(value) {
        this.setListViewProperty({ weightAtEnd: value })
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
    scale: {
      get() {
        return this.currentView.scale
      },
      set(value) {
        this.setListViewProperty({ scale: value })
      },
    },
    scaleId: {
      get() {
        return this.currentView.scaleId
      },
      set(value) {
        this.setListViewProperty({ scaleId: value })
      },
    },
    weighingStation: {
      get() {
        return this.currentView.weighingStation
      },
      set(value) {
        this.setListViewProperty({ weighingStation: value })
      },
    },
    weighingStationId: {
      get() {
        return this.currentView.weighingStationId
      },
      set(value) {
        this.setListViewProperty({ weighingStationId: value })
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
    showDetails: {
      get() {
        return this.currentView.showDetails
      },
      set(value) {
        this.setListViewProperty({ showDetails: value })
      },
    },
  },

  mounted() {
    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {})
  },

  beforeDestroy() {
    this.startTimer = false
    if (process.env.IS_ELECTRON) {
      window.ipcRenderer.removeAllListeners('barcode')
      window.ipcRenderer.invoke('closeSerialPort', 'ticketNumber')
    }
  },

  async created() {
    this.startTimer = true
    this.countDownTimer()
    this.showDetails = false

    const authUser = await this.$store.state.auth.currentUser
    this.currentUser = authUser
    this.currentUserId = authUser.id

    let weighingStationIdByWorkingPlace = null

    //find workingPlace
    if (process.env.IS_ELECTRON) {
      weighingStationIdByWorkingPlace = await this.getClientIdSerial()
    }

    await this.$store.dispatch('weighingStations/findAll', { params: { filter: { typeOfDocument: 'Automobile' }, sort: { sortBy: 'name' } }, noCommit: true }).then((response) => {
      if (response.status === 200) {
        this.weighingStations = []
        this.filterWeighingStations(weighingStationIdByWorkingPlace, response, authUser.fullRights)
      }
    })

    if (process.env.IS_ELECTRON) {
      const result = await window.ipcRenderer.invoke('getComList', 'listCMD')
      console.log('getComList = ', result)
      //init serialCom
      window.ipcRenderer.send('getBarcode', 'ticketNumber')
      window.ipcRenderer.on('barcode', async (event, res) => {
        console.log('COM: ', res)
        if (res.data) {
          await this.onInputBarcode(res.data)
        }
      })
    }

    await this.initialize()
  },

  methods: {
    ...mapMutations({
      addObjectView: `weightingScalesBunker/addObjectView`,
      setListViewProperty: `weightingScalesBunker/setListViewProperty`,
      setFilter: `weightingScalesBunker/setFilters`,
      setSort: `weightingScalesBunker/setSort`,
    }),

    async writeItemsSiemensInt() {
      //запис ваги число ціле ІНТ
      const writeItems = await window.ipcRenderer.invoke('writeToSiemens', {
        server: '192.168.5.99', //192.168.5.99
        port: '102', // 102 || 8010
        rack: 0,
        slot: 1,
        variables: { weightW10: 'DB8,DINT82' }, // tag and DB для приклада, BeginW10 можна використовувати будь-який weightW10
        value: 1234, // item
      })
    },

    async writeItemsSiemensBool() {
      //запис значення булевого
      const writeItems = await window.ipcRenderer.invoke('writeToSiemens', {
        server: '192.168.5.99', //192.168.5.99
        port: '102', // 102 || 8010
        rack: 0,
        slot: 1,
        variables: { BeginW10: 'DB8,X86.4' }, // tag and DB
        value: true, // item
      })

      await this.readItemsSiemens()
    },

    async readItemsSiemens() {
      //read long int
      const getWeight = await window.ipcRenderer.invoke('getWeightFromSiemens', {
        server: '192.168.5.99', //192.168.5.99
        port: '102', // 102 || 8010
        rack: 0,
        slot: 1,
        variables: { weightW10: 'DB8,DINT82' },
      })

      // {weightW10: 1234, connect: true}  - успішно
      // {error: "text error", connect: false} - помилка
      console.log('getWeight', getWeight) // {weightW10: 1234, connect: true}

      //read bool
      const getBool = await window.ipcRenderer.invoke('getWeightFromSiemens', {
        server: '192.168.5.99', //192.168.5.99
        port: '102', // 102 || 8010
        rack: 0,
        slot: 1,
        variables: { BeginW10: 'DB8,X86.2' },
      })

      //{BeginW10: false, connect: true}  - успішно
      //{error: "text error", connect: false} - помилка
      console.log('getBool', getBool)
    },

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
        return response.data[0].weighingStationId
      } else {
        return null
      }
    },

    async filterWeighingStations(weighingStationId, responseDB, fullRights = false) {
      if (process.env.IS_ELECTRON) {
        for (const weighingStation of responseDB.data) {
          if (weighingStationId && weighingStationId == weighingStation.id) {
            this.weighingStations.push({ text: weighingStation.name, value: weighingStation.id, obj: weighingStation })
            this.weighingStationId = weighingStation.id
            this.weighingStationInWorkingPlace = true
          } else {
            if (fullRights) {
              this.weighingStations.push({ text: weighingStation.name, value: weighingStation.id, obj: weighingStation })
            } else {
              this.weighingStations.push({ text: weighingStation.name, value: weighingStation.id, obj: weighingStation, disabled: true })
            }
          }
        }
        if (this.weighingStationId !== '') {
          await this.changeWeighingStation()
        }
      } else {
        for (const weighingStation of responseDB.data) {
          this.weighingStations.push({ text: weighingStation.name, value: weighingStation.id, obj: weighingStation })
        }
      }
    },

    async initialize() {
      const authUser = await this.$store.state.auth.currentUser
      this.currentUserId = authUser.id
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

      const weighingStations = await this.$store.dispatch('weighingStations/findAll', {})
      for (let i = 0; i < weighingStations.length; i++) {
        this.weighingStations.push({ text: weighingStations[i].name, value: weighingStations[i].id, obj: weighingStations[i] })
      }

      await this.fillScales()

      await this.$store.dispatch('weightingScalesBunker/findAllForScalesBunker', { weighingStationId: this.weighingStationId })
    },
    async fillScales() {
      this.scales = []
      const params = { params: { filter: {} } }
      let isFindScaleId = false
      if (!this.weighingStationId) {
        return
      }
      params.params.filter.weighingStationId = this.weighingStationId
      const response = await this.$store.dispatch('scales/findAll', params)
      if (!response.status === 200) {
        return
      }
      for (let i = 0; i < response.data.length; i++) {
        this.scales.push({ text: response.data[i].name, value: response.data[i].id })
        if (this.scaleId === response.data[i].id) {
          isFindScaleId = true
        }
      }

      if (!isFindScaleId) {
        this.scaleId = response.data[0].id
        this.scale = response.data[0]
      }
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },
    ...mapMutations({}),
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
      if (!this.weighingStationId) {
        showMessageBox(this, 'Nie wybrana zaladownja! Ważenie niemożliwe!')
        return
      }
      this.showScanBarcode = true
    },
    async onInputBarcode(findBarCode) {
      if (findBarCode === this.currentBarCode) {
        return
      }
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
            if (!selectedItem.weighingStation) {
              const stringMessage =
                'Ważenie jest nie możliwe! \
									Nie właściwa waga!'
              showMessageBox(this, stringMessage, 28, true)
              this.currentBarCode = ''
              return
            }
            if (selectedItem.weighingStation.id !== this.weighingStationId) {
              const stringMessage = 'Dyspozycja odnosi się do ' + selectedItem.weighingStation.name
              showMessageBox(this, stringMessage, 28, true)
              this.currentBarCode = ''
              return
            }
            if (selectedItem.scale) {
              if (selectedItem.scale.id !== this.scaleId) {
                const stringMessage = 'Dyspozycja odnosi się do ' + selectedItem.scale.name
                showMessageBox(this, stringMessage, 28, true)
                this.currentBarCode = ''
                return
              }
            }
            if (selectedItem.typeOfDocument === 'Automobile' && selectedItem.numberOfWeighings <= 1)
              if (selectedItem.schemeOfCargo.disableControlOnScales === false && selectedItem.status.key !== 'NaTerminalu') {
                const stringMessage =
                  'Uwaga! Operacja jest możliwa tylko ze statusem Na terminalu. \
                Obecny status:' + selectedItem.status.name
                showMessageBox(this, stringMessage, 28, true)
                this.currentBarCode = ''
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
            this.selectedList = selectedItem
            this.currentDisposition = selectedItem
            this.showDetails = true
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },

    async printDN() {
      this.$router.push({ name: 'delivery-notes', params: { scaleNetto: this.scale } })
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
    async editObject(objectId) {
      console.log('objectId: ', objectId)

      this.currentDisposition = null
      this.currentDeliveryNote = null

      let response = await this.$store.dispatch(`dispositions/findByPk`, {
        params: {
          id: objectId,
        },
      })
      if (response.status === 200) {
        this.currentDisposition = response.data
        response = await this.$store.dispatch('deliveryNotes/findForWeighting', { dispositionId: objectId, dispositionStatusKey: this.currentDisposition.status.key })

        if (response && response.status === 200) {
          this.currentDeliveryNote = response.data
        }
        this.showDetails = true
      }
    },
    onInputWeight() {
      this.weightAtBeginning = 0
      this.weightAtEnd = 0
      this.netto = 0
      this.lostWeight = 0
      this.currentDisposition = null
      this.currentDeliveryNote = null

      this.initialize()
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
    getWeightPresentation(value) {
      return weightPresentation(value)
    },

    async changeWeighingStation() {
      this.fillScales()
      for (const item of this.weighingStations) {
        if (item.value === this.weighingStationId) {
          this.weighingStation = item
          break
        }
      }

      await this.$store.dispatch('weightingScalesBunker/findAllForScalesBunker', { weighingStationId: this.weighingStationId })
    },

    async changeScale() {
      for (const item of this.scales) {
        if (item.value === this.scaleId) {
          this.scale = item
          break
        }
      }
      await this.$store.dispatch('weightingScalesBunker/findAllForScalesBunker', { weighingStationId: this.weighingStationId })
      await weightingsReadValueS7(this.scaleId, 'Weight')
      if (!this.startTimer === true) {
        this.startTimer = true
        this.countDownTimer()
      }
    },
    addDisposition() {},

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
          const weightingData = await weightingsGetWeight(this.scaleId, this.currentWeightTimer)
          if (weightingData) {
            this.currentWeightTimer = Number(weightingData.weight)
            const stabilityIndex = Number(weightingData.stabilityIndex)
            this.stabilityInfo = this.stabilityTypes[stabilityIndex]
          }
        }
        this.stable = this.stabilityInfo === this.stabilityTypes[0]
        if (this.weightAtBeginning > 0) {
          this.netto = this.currentWeightTimer - this.weightAtBeginning
          if (this.netto < 0) {
            this.netto = -this.netto
          }
          this.lostWeight = this.currentDisposition ? this.currentDisposition.quantity - this.netto : 0
        }

        // console.log('bunker_scale_timer = ', this.currentWeightTimer)
        // const isFull = await weightingsReadValueS7(this.scaleId, 'IsFull')
        // console.log('IsFull = ', isFull)
        // const isClosed = await weightingsReadValueS7(this.scaleId, 'IsClosed')
        // console.log('IsClosed = ', isClosed)
        // const endLoad = await weightingsReadValueS7(this.scaleId, 'EndLoad')
        // console.log('EndLoad = ', endLoad)
        // const towar1 = await weightingsReadValueS7(this.scaleId, 'Towar1')
        // console.log('Towar1 = ', towar1)
        // const towar2 = await weightingsReadValueS7(this.scaleId, 'Towar2')
        // console.log('Towar2 = ', towar2)
        // const towar3 = await weightingsReadValueS7(this.scaleId, 'Towar3')
        // console.log('Towar3 = ', towar3)
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
.not-stable-weight {
  color: red;
}
.stable-weight {
  color: rgb(135, 74, 249);
}
.lost-weight-color {
  color: rgb(60, 176, 60);
}
</style>
