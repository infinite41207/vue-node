<template>
  <Layout>
    <div>
      <b-card align="center">
        <b-card-body>
          <b-row>
            <b-col md="2">
              <p style="font-size: 50px; font-weight: bold"> {{ currentWeight }} T </p>
            </b-col>
            <b-col md="2">
              <p style="font-size: 50px; font-weight: bold"> {{ netto }} T </p>
            </b-col>
            <b-col md="2">
              <p style="font-size: 50px; font-weight: bold"> {{ lostWeight }} T </p>
            </b-col>
            <b-col md="6">
              <b-row>
                <p style="font-size: 5px"> </p>
              </b-row>
              <b-button class="mr-1" @click="scanBarCode"> ZESKANUY KOD </b-button>
              <!-- <b-button class="mr-1" @click="setZero"> ZEROWANIE </b-button> -->
              <!-- <b-button class="mr-1" @click="CancellationOfWeighing"> ZRZUĆ </b-button> -->
              <!-- <b-button variant="primary" class="mr-1" @click="getWeight"> ZWAŻ </b-button> -->
              <b-button class="mr-1" @click="printDN"> KWITY </b-button>
              <!-- <b-button variant="danger" class="mr-1" @click="addWeight">DOSYPKA</b-button> -->
              <b-button class="mr-1" @click="selectReport"> RAPORTY </b-button>
              <!-- <b-button class="mr-1" @click="syncData"> ODŚWIEŻ </b-button> -->
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
          </b-table>
        </b-card-body>
      </b-card>
      <div>
        <b-row>
          <b-col md="4">
            <b-form-group horizontal :label-cols="4" :label="$t('table.weighingStation')" label-for="currentWeighingStationId">
              <b-form-select id="currentWeighingStationId" v-model="currentWeighingStationId" :options="weighingStations" size="sm" @change="changeWeighingStation" />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group horizontal :label-cols="2" :label="$t('table.scale')" label-for="currentScaleId">
              <b-form-select id="currentScaleId" v-model="currentScaleId" :options="scales" size="sm" @change="changeScale" />
            </b-form-group>
          </b-col>
        </b-row>
      </div>

      <!-- <b-modal
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
      </b-modal> -->

      <InputBarcode v-model="showScanBarcode" @on-input-barcode="onInputBarcode" />

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
            <b-button class="mb-1 w-100" @click="WeightRaport1">RAPORT WAGOWY</b-button>
            <b-button class="mb-1 w-100" @click="WeightRaport2">RAPORT ROZMIESZCZENIA SAMOCHODÓW</b-button>
            <b-button class="mb-1 w-100" @click="WeightRaport3">RAPORT ZMIANOWY WAGI</b-button>
          </b-card-body>
        </b-card>
      </b-modal>

      <b-modal v-model="showDetails" size="xl" hide-footer body-class="pr-4 pl-4 pb-3" title="Ważenie dispozycji">
        <div align="left" style="font-size: 18px">
          <b-row style="font-size: 50px; font-weight: bold">
            <b-col md="3">
              <p> {{ currentWeight }} T </p>
            </b-col>
            <b-col md="3">
              <p> {{ netto }} T </p>
            </b-col>
            <b-col md="3">
              <p> {{ lostWeight }} T </p>
            </b-col>
          </b-row>
          <p> </p>
          <b-row align-h="start">
            <b-col md="6">
              <p>
                Zlecenie: <b> {{ getDocumentPresentation(getDocumentsAttrByName(currentDisposition, 'order')) }}</b></p
              >
              <p>
                Dyspozycja: <b> {{ getDocumentPresentation(currentDisposition) }}</b></p
              >
              <p>
                List przwozowy: <b> {{ getDocumentPresentation(getDocumentsAttrByName(currentDisposition, 'deliveryNotes')) }}</b></p
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
                Waga: <b> {{ getCatalogPresentation(scaleBrutto) }} </b></p
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
                Waga: <b> {{ getCatalogPresentation(scaleTare) }} </b></p
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
                Waga: <b> {{ getCatalogPresentation(scaleNetto) }} </b></p
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
            <b-button variant="danger" class="mr-1" @click="getWeightStart"> START </b-button>
            <b-button variant="danger" class="mr-1" @click="getWeightEnd"> KONIEC </b-button>
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

      testMode: true,

      showWeight: false,
      showScanBarcode: false,
      showSelectionReport: false,

      perPage: 10,

      netto: 0,
      lostWeight: 0,
      correctionWeight: 0,
      currentBrutto: 0,
      currentTare: 0,
      currentNetto: 0,
      currentBarCode: '',

      currentWeighingStationId: '',
      scales: [],
      weighingStations: [],

      scaleBrutto: null,
      scaleTare: null,
      scaleNetto: null,
      operationWeight: '',

      weightType: 'Pierwsze ważenie',
      disposition: 'Dyspozycja Nr 1111',
      vehicleNumber: 'KR3MG12',
      warehouse: 'Magazyn 27',
      ship: 'PANOPY',
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

      selectMode: 'single',
      selectedListFirst: [],
      isClickWeighting: false,
      isWielokrotność: false,
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

  mounted() {
    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {})
  },

  async created() {
    this.setStartValues()

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

    await this.initialize()
  },

  methods: {
    ...mapMutations({
      addObjectView: `weightingScalesBunker/addObjectView`,
      setListViewProperty: `weightingScalesBunker/setListViewProperty`,
      setFilter: `weightingScalesBunker/setFilters`,
      setSort: `weightingScalesBunker/setSort`,
    }),

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
            this.weighingStations.push({ text: weighingStation.name, value: weighingStation.id })
            this.currentWeighingStationId = weighingStation.id
            this.weighingStationInWorkingPlace = true
          } else {
            if (fullRights) {
              this.weighingStations.push({ text: weighingStation.name, value: weighingStation.id })
            } else {
              this.weighingStations.push({ text: weighingStation.name, value: weighingStation.id, disabled: true })
            }
          }
        }
        if (this.currentWeighingStationId !== '') {
          await this.changeScale()
        }
      } else {
        for (const weighingStation of responseDB.data) {
          this.weighingStations.push({ text: weighingStation.name, value: weighingStation.id })
        }
      }
    },

    async initialize() {
      const weighingStations = await this.$store.dispatch('weighingStations/findAll', {})
      for (let i = 0; i < weighingStations.length; i++) {
        this.weighingStations.push({ text: weighingStations[i].name, value: weighingStations[i].id })
      }

      await this.fillScales()

      await this.$store.dispatch('weightingScalesBunker/findAllForScalesBunker', { weighingStationId: this.currentWeighingStationId })
    },
    async fillScales() {
      this.scales = []
      const params = { params: { filter: {} } }
      let isFindCurrentScaleId = false
      if (this.currentWeighingStationId === '') {
        return
      }
      params.params.filter.weighingStationId = this.currentWeighingStationId
      const response = await this.$store.dispatch('scales/findAll', params)
      if (!response.status === 200) {
        return
      }
      for (let i = 0; i < response.data.length; i++) {
        this.scales.push({ text: response.data[i].name, value: response.data[i].id })
        if (this.currentScaleId === response.data[i].id) {
          isFindCurrentScaleId = true
        }
      }

      if (!isFindCurrentScaleId) {
        this.currentScaleId = response.data[0].id
      }
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },
    ...mapMutations({}),
    setStartValues() {
      this.currentWeight = 0
      this.correctionWeight = 0
      this.currentDisposition = null
      this.currentDeliveryNote = null
      this.currentBarCode = ''
      this.disposition = ''
      this.vehicleNumber = ''
      this.warehouse = ''
      this.ship = ''
      this.declaredWeight = 0
      this.firstWeight = 0
      this.secondWeight = 0
      this.currentBrutto = 0
      this.currentTare = 0
      this.currentNetto = 0
      this.numberOfWeighted = 0
      this.operationWeight = ''

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
      if (this.currentWeighingStationId === '') {
        showMessageBox(this, 'Nie wybrana zaladownja! Ważenie niemożliwe!')
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
            if (!selectedItem.status.key === 'NaTerminalu') {
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
            this.selectedList = selectedItem
            this.currentDisposition = selectedItem
            this.showDetails = true
          }
        })
        .catch((error) => {
          console.error(error)
        })
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
      const selectedItem = await this.$store.dispatch('dispositions/getDispositionByTicket', queryParams)
      if (selectedItem === null) {
        showMessageBox(this, 'Dyspozycja nie zostanie znaleziony!', 28, true)
        return
      }
      if (selectedItem.state === 'NaTerminalu') {
        this.selectedList = selectedItem
        this.currentDisposition = this.selectedListFirst
      }
      this.showViewDisposition = true
    },
    getWeightStart() {
      if (this.currentDisposition === null) {
        showMessageBox(this, 'Nie wybrana dyspozycja! Samochód nie został zważony!')
        return
      }

      this.weightType = this.weightingTypes[0]
      this.getWeightContinue()
    },
    getWeightEnd() {
      if (this.currentDisposition === null) {
        showMessageBox(this, 'Nie wybrana dyspozycja! Samochód nie został zważony!')
        return
      }

      this.weightType = this.weightingTypes[1]
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
      const dispositionQuantity = this.currentDisposition.quantity

      //   if (this.weightType === this.weightingTypes[0] && thisIsShipment && dispositionNumberOfWeighings > 1 && dispositionAllowRetaring === false) {
      //     const queryParams = {
      //       dispositionId: this.currentDisposition.id,
      //     }
      //     const lastTareWeiting = await this.$store.dispatch('deliveryNotes/getLastTareWeighting', queryParams)
      //     if (lastTareWeiting > 0) {
      //       let deltaWeight = this.currentWeight - lastTareWeiting
      //       if (deltaWeight < 0) {
      //         deltaWeight = -deltaWeight
      //       }

      //       if (deltaWeight > 0.06) {
      //         // 60 kg
      //         showMessageBox(this, 'Uwaga! Zakaz ważenia!\nPrzekroczono dopuszczalną (60 kg) rozbieżność między tarowaniem.\nSkontaktuj się z obsługą.')
      //         return
      //       }
      //     }
      //   } else if (this.weightType === this.weightingTypes[1] && thisIsShipment) {
      //     const delta = 0.005
      //     this.firstWeight = this.currentTare
      //     if (Number(this.currentWeight) - Number(this.firstWeight) - Number(delta) > Number(dispositionQuantity) + 0.1) {
      //       // Quantity + 100 kg - Kolano...
      //       this.correctionWeight = Number(this.currentWeight) - Number(this.firstWeight) - Number(dispositionQuantity)
      //       this.operationWeight = 'Remove'
      //       showMessageBox(this, 'Waga przekracza wagę deklarowaną. Musisz odsypać ' + this.correctionWeight + ' ton.')
      //     } else if (Number(this.currentWeight) - Number(this.firstWeight) < Number(dispositionQuantity) - 0.3) {
      //       // Quantity - 300 kg - Kolano...
      //       this.correctionWeight = Number(dispositionQuantity) - (Number(this.currentWeight) - Number(this.firstWeight))
      //       showQuestion(this, 'Masz mniej o (' + this.correctionWeight + 't).\nCzy chcesz wykonać ważenia?', this.answerWeightingQuestionOk, this.answerWeightingQuestionCancel)
      //     }
      //   }
      // }

      if (this.weightType === this.weightingTypes[0]) {
        this.currentBrutto = 0
        this.currentTare = this.currentWeight
        this.currentNetto = 0
      } else {
        this.currentBrutto = this.currentWeight
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
        await this.$store.dispatch('dispositions/updateItem', dataForWrite.dispositionData)
        await this.$store.dispatch('deliveryNotes/' + dataForWrite.deliveryNoteData.action, dataForWrite.deliveryNoteData)
        await this.writeNumberOfWeighted()
      } else if (this.operationWeight === 'Add' || this.operationWeight === 'Remove') {
        dataForWrite = weightingGetDataForWriteAddRemove(this)
        await this.$store.dispatch('dispositions/updateItem', dataForWrite)
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

    cancellationOfWeighing() {
      this.showViewDisposition = false
      this.setStartValues()
    },
    printCurrentDeliveryNote(parameters) {
      showMessageBox(this, 'Print Current Delivery Note Id : ' + parameters.currentDeliveryNoteId, 22, true)
    },
    selectReport() {
      this.showSelectionReport = true
    },
    WeightRaport1() {
      this.$router.push('/tableTest')
      this.showSelectionReport = false
    },
    WeightRaport2() {
      this.$router.push('/dragula')
      this.showSelectionReport = false
    },
    WeightRaport3() {
      this.showSelectionReport = false
      this.$router.push({ name: 'report-common-routes', params: { reportModule: 'shiftReportFromScale' } })
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

      // this.selectedListFirst = items
      // if (this.selectedListFirst.length > 0) {
      //   this.weightType = this.weightingTypes[0]
      //   this.currentDisposition = this.selectedListFirst[0]
      //   const queryParams = {
      //     dispositionId: this.currentDisposition.id,
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
      //   this.showViewDisposition = true
      //   this.isSecondWeighting = false
      //   this.isWielokrotność = false
      //   this.isClickWeighting = false
      // } else {
      //   this.currentDisposition = null
      //   this.currentDeliveryNote = null
      // }
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

    async changeWeighingStation() {
      this.fillScales()
      await this.$store.dispatch('weightingScalesBunker/findAllForScalesBunker', { weighingStationId: this.currentWeighingStationId })
    },

    async changeScale() {
      await this.$store.dispatch('weightingScalesBunker/findAllForScalesBunker', { weighingStationId: this.currentWeighingStationId })
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
