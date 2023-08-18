<template>
  <Layout>
    <div>
      <b-card align="center" v-if="blockingInterface !== true">
        <b-row>
          <b-col md="9">
            <b-row class="ml-1">
              <b-col md="11">
                <b-form-input
                  id="barCode"
                  v-model="currentBarCode"
                  type="text"
                  style="font-size: 26px; font-weight: bold"
                  class="form-control"
                  placeholder="Zeskanuj kod kreskowy"
                  disabled
                  autofocus
                />
                <b-form-select
                  class="mt-1"
                  id="currentScaleId"
                  v-model="currentScaleId"
                  :disabled="scaleInWorkingPlace === true"
                  :options="scales"
                  size="sm"
                  @change="changeScale"
                />
              </b-col>
              <b-col md="1">
                <b-button class="mr-1 pt-3 pb-3" variant="danger" @click="weightCancel"> USUŃ </b-button>
                <!-- <b-button v-if="modeElectron" class="mr-1" variant="outline-secondary" @click="openSettingCom"> COM </b-button> -->
              </b-col>
            </b-row>
            <div align="left" style="font-size: 26px" class="ml-4 mt-2">
              <b-row class="mb-1">
                <span>
                  {{ $t('table.weightingType') }} : <b> {{ weightType }}</b></span
                >
              </b-row>
              <b-row class="mb-1">
                <span>
                  {{ $t('table.disposition') }}: <b> {{ getDocumentPresentation(currentDisposition) }}</b></span
                >
              </b-row>
              <b-row class="mb-1">
                <span>
                  {{ $t('table.deliveryOrder') }} : <b> {{ getDocumentPresentation(getDocumentsAttrByName(currentDisposition, 'order')) }}</b></span
                >
              </b-row>
              <b-row class="mb-1">
                <span>
                  {{ $t('table.deliveryNote') }} : <b> {{ getDocumentPresentation(currentDeliveryNote) }}</b></span
                >
              </b-row>
              <b-row class="mb-1">
                <span>
                  {{ $t('table.carNumber') }}: <b> {{ getCatalogPresentation(getDocumentsAttrByName(currentDisposition, 'vehicle')) }} </b></span
                >
              </b-row>
              <b-row class="mb-1">
                <span>
                  {{ $t('table.warehouse') }}: <b> {{ getCatalogPresentation(getDocumentsAttrByName(currentDisposition, 'warehouse')) }} </b></span
                >
              </b-row>
              <b-row class="mb-1">
                <span>
                  {{ $t('table.ship') }}: <b> {{ getCatalogPresentation(getDocumentsAttrByName(currentDisposition, 'ship')) }} </b></span
                >
              </b-row>
              <b-row class="mb-1">
                <span>
                  {{ $t('table.product') }}: <b> {{ getCatalogPresentation(getDocumentsAttrByName(currentDisposition, 'product')) }} </b></span
                >
              </b-row>
              <b-row class="mb-1">
                <span>
                  {{ $t('table.declaredTonnage') }}: <b> {{ getDocumentsAttrByName(currentDisposition, 'quantity') }} </b></span
                >
              </b-row>
              <b-row class="mb-1">
                <span> {{ $t('table.firstWeighting') }}: {{ firstWeight }} </span>
                <span class="mr-1"> , </span>
                <span> {{ $t('table.secondWeighting') }}: {{ secondWeight }} </span>
                <span class="mr-1"> , </span>
                <span :style="{ color: colorRed }">
                  {{ ' ' + $t('table.netto') }}: <b> {{ currentNetto }} </b></span
                >
              </b-row>
            </div>
          </b-col>
          <b-col md="3" align="left" class="mb-1">
            <b-button class="btn-lg btn-block button-font p-4" variant="success" @click="setZeroDN"> ZEROWANIE KWITU</b-button>
            <b-button v-if="testMode === true" class="btn-lg btn-block button-font p-2" variant="success" @click="scanBarCode"> PODAJ KOD </b-button>
            <b-button class="btn-lg btn-block button-font p-4" variant="info" @click="toClarifyInfo"> MASZ PYTANIA? </b-button>
            <b-button v-if="isEnabledWeighting && isSecondWeighting" class="btn-lg btn-block button-font p-4" variant="success" @click="addWeight"> DOSYPKA </b-button>
            <b-button v-if="isClosedDisposition" class="btn-lg btn-block button-font p-4" variant="success" @click="printReport"> DRUKUJ </b-button>
          </b-col>
        </b-row>
        <b-col>
          <span style="font-size: 90px; font-weight: bold" :class="{ 'not-stable-weight': !stable, 'stable-weight': stable }"> {{ currentWeightTimer }} T </span>
          <span style="font-size: 40px; font-weight: bold" :class="{ 'not-stable-weight': !stable, 'stable-weight': stable }"> {{ stabilityInfo }} </span>
          <b-button v-if="isEnabledWeighting" class="btn-lg btn-block button-font p-4" variant="success" @click="getWeight"> WAŻENIE </b-button>
        </b-col>
      </b-card>
      <div style="margin-top: 275px">
        <b-card align="center" v-if="blockingInterface === true">
          <b-col>
            <span style="font-size: 90px; font-weight: bold" class="not-stable-weight"> {{ $t('msg.technicalBreak') }} </span>
          </b-col>
        </b-card>
      </div>
      <InputBarcode v-model="showScanBarcode" @on-input-barcode="onInputBarcode" />
      <SerialPort v-model="comInfoPanel"></SerialPort>

      <b-modal
        v-model="showInputWeight"
        title="Wprowadż wagę"
        header-class="pr-4 pl-4 border-bottom-0"
        title-class="text-black font-18"
        body-class="pt-3 pr-4 pl-4"
        centered
        @ok="onInputWeightOK"
      >
        <b-form>
          <b-form-input id="weightValue" v-model="currentWeight" type="number" step="0.01" min="0.00" max="500.00" class="form-control" autofocus />
        </b-form>
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
  getPhotoScale,
} from '@/utils/weightings.js'
import InputBarcode from './formComponents/input-barcode'
import SerialPort from './formComponents/serial-port'

export default {
  name: 'CarScaleSelfService',
  page: {
    title: 'Wagi samochodowe',
    // meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    InputBarcode,
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
      colorRed: '',
      colorTabTitle: '',
      colorTabTitleText: '',

      title: 'Wagi samoobsługowe',

      testMode: false,
      currentWeightTimer: 0,
      startTimer: false,
      blockingInterface: false,
      isCheckDriverActivity: false,
      driverActivity: 0,

      showWeight: false,
      showScanBarcode: false,
      showInputWeight: false,

      scaleInWorkingPlace: false,
      weightingTypes: ['Pierwsze ważenie', 'Drugie ważenie'],
      stabilityTypes: ['Waga stabilna', 'Waga nie stabilna'],
      stabilityInfo: '',
      stable: false,
      limit: 5,

      correctionWeight: 0,
      currentNetto: 0,
      scales: [],

      operationWeight: '',

      declaredWeight: 0,
      firstWeight: 0,
      secondWeight: 0,

      numberOfWeighted: 0,
      numberOfCopies: 1,

      isClickWeighting: false,
      isWielokrotność: false,
      isEnabledWeighting: false,
      isClosedDisposition: false,
      //com var
      modeElectron: process.env.IS_ELECTRON ? true : false,
      clientIdSerial: null,
      comInfoPanel: false,
    }
  },

  computed: {
    ...mapGetters({
      currentView: 'weightingScalesCarsSelfService/currentView',
    }),
    currentBarCode: {
      get() {
        return this.currentView.currentBarCode
      },
      set(value) {
        this.setListViewProperty({ currentBarCode: value })
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
    // stabilityInfo: {
    //   get() {
    //     return this.currentView.stabilityInfo
    //   },
    //   set(value) {
    //     this.setListViewProperty({ stabilityInfo: value })
    //   },
    // },
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
  },

  mounted() {
    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {})
  },

  async created() {
    await this.initialize()
    this.setStartValues()
    this.startTimer = true
    this.countDownTimer()
    this.timerBlockingInterface()

    // this.printCurrentDeliveryNote()

    if (process.env.IS_ELECTRON) {
      window.ipcRenderer.send('getBarcode', 'ticketNumber')
      window.ipcRenderer.on('barcode', async (event, res) => {
        console.log('COM data in Vue.js: ', res)
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
    openSettingCom() {
      console.log('Setting port')
      this.comInfoPanel = true
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

      // let params = {
      //   userId: authUser.id,
      //   userSettingItemKey: 'currentScalesCars',
      // }

      // let scalesCarsName = ''
      // await this.$store
      //   .dispatch('userSettings/findByKey', { params })
      //   .then((response) => {
      //     if (response.status === 200) {
      //       scalesCarsName = response.data
      //     }
      //   })
      //   .catch((error) => {
      //     // console.warn(error)
      //   })

      // if (scalesCarsName.trim() !== '') {
      //   await this.$store
      //     .dispatch('scales/findByName', { name: scalesCarsName })
      //     .then((response) => {
      //       if (response.status === 200) {
      //         this.currentScale = response.data
      //         this.currentScaleId = response.data.id
      //       }
      //     })
      //     .catch((error) => {
      //       console.warn(error)
      //     })
      // }

      const params = {
        userId: authUser.id,
        userSettingItemKey: 'weightingTestMode',
      }

      await this.$store.dispatch('userSettings/findByKey', { params }).then((response) => {
        if (response.status === 200) {
          this.testMode = response.data
        }
      })

      //find workingPlace
      if (process.env.IS_ELECTRON) {
        scaleByWoringPlace = await this.getClientIdSerial()
      }
      await this.$store.dispatch('scales/findAll', { params: { filter: { typeOfDocument: 'Automobile' } } }).then((response) => {
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
      addObjectView: `weightingScalesCarsSelfService/addObjectView`,
      setListViewProperty: `weightingScalesCarsSelfService/setListViewProperty`,
      setFilter: `weightingScalesCarsSelfService/setFilters`,
      setSort: `weightingScalesCarsSelfService/setSort`,
    }),
    setStartValues() {
      this.currentWeight = 0
      this.correctionWeight = 0
      this.currentDisposition = null
      this.currentDeliveryNote = null
      this.currentBarCode = ''
      this.weightType = ''

      this.firstWeight = 0
      this.secondWeight = 0
      this.currentNetto = 0
      this.numberOfWeighted = 0
      this.operationWeight = ''
      this.isSecondWeighting = false
      this.isWielokrotność = false
      this.isEnabledWeighting = false
      this.isClosedDisposition = false

      this.colorWeight = this.usedColors.primaryText
      this.colorRed = this.usedColors.redText
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
    scanBarCode() {
      if (this.currentScaleId === '') {
        showMessageBox(this, 'Nie wybrana waga! Ważenie niemożliwe!')
        return
      }
      if (this.currentBarCode === '') {
        this.showScanBarcode = true
      }
    },

    async onInputBarcode(findBarCode) {
      if (findBarCode === this.currentBarCode) {
        return
      }
      this.isCheckDriverActivity = true
      this.driverActivity = 0
      this.timerCheckDriverActivity()

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
              if (!selectedItem.status.key === 'Closed') {
                this.currentBarCode = ''
                return
              }
            }

            this.currentDisposition = selectedItem
            this.fillFormsDataContinue()
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },

    async fillFormsDataContinue() {
      const response = await this.$store.dispatch('deliveryNotes/findForWeighting', {
        dispositionId: this.currentDisposition.id,
        dispositionStatusKey: this.currentDisposition.status.key,
      })
      if (response && response.status === 200) {
        this.currentDeliveryNote = response.data
      } else {
        this.currentDeliveryNote = null
      }
      if (!this.currentDeliveryNote) {
        if (this.currentDisposition.numberOfWeighings === this.currentDisposition.numberOfWeighted) {
          // this.weightType = ''
          // this.currentDisposition = null
          // this.firstWeigh = 0
          if (!this.currentDisposition.status.key === 'Closed') {
            this.setStartValues()
          }
        } else {
          if (this.currentDisposition.status.key === 'Loaded' || this.currentDisposition.status.key === 'Unloaded') {
            this.weightType = this.weightingTypes[1]
            this.currentDeliveryNote = null
            const response = await this.$store.dispatch('deliveryNotes/getLastTareOfReversOperation', { dispositionId: this.currentDisposition.id })
            console.log(response)
            if (response) {
              this.firstWeight = response.data.tare
            }
          } else {
            this.weightType = this.weightingTypes[0]
            this.firstWeight = 0
          }
        }
        this.secondWeight = 0
        this.currentNetto = 0
      } else {
        this.weightType = this.weightingTypes[1]
        const thisIsShipment = weightingsThisIsShipment(this.currentDeliveryNote)
        if (thisIsShipment) {
          this.firstWeight = this.currentDeliveryNote.tare
          this.secondWeight = this.currentDeliveryNote.brutto
        } else {
          this.firstWeight = this.currentDeliveryNote.brutto
          this.secondWeight = this.currentDeliveryNote.tare
        }
        this.currentNetto = this.currentDeliveryNote.netto
      }
      this.isSecondWeighting = this.weightType === this.weightingTypes[1]
      this.isWielokrotność = this.currentDisposition.numberOfWeighings > 1
      this.isClosedDisposition = this.currentDisposition.status.key === 'Closed'
      this.isEnabledWeighting =
        this.currentDisposition.status.key === 'NaTerminalu' || this.currentDisposition.status.key === 'Loaded' || this.currentDisposition.status.key === 'Unloaded'
    },

    async changeScale() {
      for (const scale of this.scales) {
        if (scale.id === this.currentScaleId) {
          this.currentScale = scale
          break
        }
      }
    },
    async setZeroDN() {
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
      await this.getWeightContinue()
    },
    onInputWeightOK(event) {
      event.preventDefault()
      this.showInputWeight = false
      this.getWeightingEnd()
      this.currentWeight = Number(this.currentWeight).toFixed(2)
    },
    getWeight() {
      if (this.currentDisposition === null) {
        showMessageBox(this, 'Nie wybrana dyspozycja! Samochód nie został zważony!')
        return
      }
      if (this.stabilityInfo === this.stabilityTypes[1]) {
        return
      }

      this.operationWeight = 'OK'
      this.getWeightContinue()
    },
    async getWeightContinue() {
      this.isClickWeighting = true
      this.currentWeight = ''
      if (this.testMode) {
        this.showInputWeight = true
      } else {
        const weightingData = await weightingsGetWeight(this.currentScaleId, Number(this.currentWeight))
        if (weightingData) {
          this.currentWeight = Number(weightingData.weight)
        }

        this.getWeightingEnd()
      }
    },
    onInputWeight(event) {
      this.showInputWeight = false
      this.currentWeight = Number(this.currentWeight).toFixed(2)
      this.stabilityInfo = this.stabilityTypes[0]
      this.getWeightingEnd()
    },
    async getWeightingEnd() {
      const thisIsShipment = weightingsThisIsShipment(this.currentDisposition)
      if (this.weightType === this.weightingTypes[0]) {
        this.firstWeight = this.currentWeight
      } else {
        this.secondWeight = this.currentWeight
        this.currentNetto = Number(this.secondWeight) - Number(this.firstWeight)
        if (this.currentNetto < 0) {
          this.currentNetto = -this.currentNetto
        }
      }
      const dispositionNumberOfWeighings = this.currentDisposition.numberOfWeighings
      const dispositionAllowRetaring = this.currentDisposition.allowRetaring
      const dispositionQuantity = this.currentDisposition.quantity
      if (this.operationWeight === 'OK') {
        if (this.weightType === this.weightingTypes[0] && thisIsShipment && dispositionNumberOfWeighings > 1 && dispositionAllowRetaring === false) {
          const queryParams = {
            dispositionId: this.currentDisposition.id,
          }
          const response = await this.$store.dispatch('deliveryNotes/getLastTareOfReversOperation', queryParams)
          if (response) {
            const lastTareWeitingParams = response.data
            if (lastTareWeitingParams.tare > 0) {
              let deltaWeight = this.currentWeight - lastTareWeitingParams.tare
              if (deltaWeight < 0) {
                deltaWeight = -deltaWeight
              }

              if (deltaWeight > 0.06) {
                // 60 kg
                showMessageBox(this, 'Uwaga! Zakaz ważenia!\nPrzekroczono dopuszczalną (60 kg) rozbieżność między tarowaniem.\nSkontaktuj się z obsługą.')
                return
              }
            }
          }
        } else if (this.weightType === this.weightingTypes[1] && thisIsShipment) {
          const delta = 0.005
          if (Number(this.currentWeight) - Number(this.firstWeight) < 0.06) {
            showMessageBox(this, 'Waga nieprawidłowa, zgłoś się do obsługi dysponenckiej.')
            return
          } else if (Number(this.currentWeight) - Number(this.firstWeight) - Number(delta) > Number(dispositionQuantity) + 0.1) {
            // Quantity + 100 kg - Kolano...
            this.correctionWeight = Number(this.currentWeight) - Number(this.firstWeight) - Number(dispositionQuantity)
            this.operationWeight = 'Remove'
            showMessageBox(this, 'Waga przekracza wagę deklarowaną. Musisz odsypać ' + Number(this.correctionWeight).toFixed(2) + ' ton.')
          } else if (Number(this.currentWeight) - Number(this.firstWeight) < Number(dispositionQuantity) - 0.3) {
            // Quantity - 300 kg - Kolano...
            this.correctionWeight = Number(dispositionQuantity) - (Number(this.currentWeight) - Number(this.firstWeight))
            showQuestion(
              this,
              'Masz mniej o (' + Number(this.correctionWeight).toFixed(2) + 't).\nCzy chcesz wykonać ważenia?',
              this.answerWeightingQuestionOk,
              this.answerWeightingQuestionCancel
            )
            return
          }
        }
      } else if (this.operationWeight === 'ZeroDN') {
        if (!this.currentDisposition.allowSetZero === true) {
          showMessageBox(this, 'Żeby przerwać operację i opuścić teren HES proszę skontaktować się z obsługą!')
          this.setStartValues()
          return
        }

        let delta = this.currentWeight - this.firstWeight
        if (delta < 0) {
          delta = -delta
        }
        if (delta > 0.06) {
          // 60 kg - Kolano...
          showMessageBox(this, 'Waga nie odpowiada pierwszemu ważeniu!')
          this.setStartValues()
          return
        } else {
          showMessageBox(this, 'UWAGA!!! SAMOCHÓD ZEROWANY!')
          this.currentWeight = this.firstWeight
        }
      } else if (this.operationWeight === 'Add') {
        this.correctionWeight = (Number(dispositionQuantity) + Number(this.firstWeight) - Number(this.currentWeight)).toFixed(2)
        if (this.correctionWeight > 0) {
          showQuestion(this, 'Wysłać samochód do doładowania ' + Number(this.correctionWeight).toFixed(2) + ' t?', this.setWeightingEnd)
        } else {
          showMessageBox(this, 'Operacja jest nie możliwa! Waga większa od deklarowanej wagi!', 22, true)
          this.setStartValues()
        }
        return
      }
      this.setWeight()
    },
    answerWeightingQuestionOk() {
      this.setWeight()
    },
    answerWeightingQuestionCancel() {
      this.setStartValues()
    },
    async setWeight() {
      const isError = await this.setWeightingEnd()
      // console.log('isError = ', isError)
      if (isError === false && this.operationWeight === 'OK') {
        let textMessage = ''
        if (this.weightType === this.weightingTypes[1]) {
          if (this.currentDisposition.numberOfWeighings <= 1) {
            textMessage =
              'Ważenie wykonano poprawnie! \
											    \nPoczekaj na odbiór kwitu wagowego!'
            if (this.currentDeliveryNote) {
              await this.printCurrentDeliveryNote({ currentDeliveryNoteId: this.currentDeliveryNote.id })
            }
          } else {
            textMessage =
              'Samochód został zważony! \
										      \nJedź w miejsce za/rozładunku.'
          }
          // const objParameters = { currentDeliveryNoteId: this.currentDeliveryNote.id }
          // showQuestion(this, 'Wydrukować kwity?', this.printCurrentDeliveryNote, undefined, objParameters)
          // this.printCurrentDeliveryNote({ currentDeliveryNoteId: this.currentDeliveryNote.id })
        } else {
          textMessage =
            'Samohód został zważony! \
                        \nJedź w miejsce za/rozładunku.'
        }
        showMessageBox(this, textMessage, 22, true)
      }
      // if (!this.testMode === true) {
      //   //My palaniuyk
      //   console.log('this.currentDeliveryNote.id: ', this.currentDeliveryNote.id)
      //   const resPhoto = await getPhotoScale(this.currentScaleId, this.currentDeliveryNote.id)
      //   console.log(resPhoto)
      // }
      this.setStartValues()
      this.isCheckDriverActivity = false
    },
    async setWeightingEnd() {
      let dataForWrite = ''
      if (this.operationWeight === 'OK' || this.operationWeight === 'ZeroDN') {
        dataForWrite = await weightingsGetDataForWriteOK(this)
        if (dataForWrite.isError === true) {
          showMessageBox(this, dataForWrite.errorText, 22, true)
        } else {
          await this.$store.dispatch('dispositions/update', dataForWrite.dispositionData)
          await this.$store.dispatch('deliveryNotes/' + dataForWrite.deliveryNoteData.action, dataForWrite.deliveryNoteData)
          await this.writeNumberOfWeighted()
          this.$store.dispatch('sync1CData/sendTo1C')
        }
        return dataForWrite.isError
      } else if (this.operationWeight === 'Add' || this.operationWeight === 'Remove') {
        dataForWrite = await weightingGetDataForWriteAddRemove(this)
        await this.$store.dispatch('dispositions/update', dataForWrite)
        this.$store.dispatch('sync1CData/sendTo1C')
      }
    },

    async printCurrentDeliveryNote(parameters) {
      // showMessageBox(this, 'Print Current Delivery Note Id : ' + parameters.currentDeliveryNoteId, 22, true)
      const response = await this.$store.dispatch('deliveryNotes/findByPk', {
        params: {
          id: parameters.currentDeliveryNoteId,
        },
      })

      if (response.status === 200) {
        // this.$router.push({ name: 'roll', params: { id: parameters.currentDeliveryNoteId, object: response.data, routeOwner: 'car-scale-self-service', isPrintAndClosed: true } })
        const queryParams = {
          name: 'roll',
          id: parameters.currentDeliveryNoteId,
          object: response.data,
          routeOwner: 'car-scale-self-service',
          isPrintAndClosed: true,
        }
        this.$store.dispatch('printForms/addPrint', queryParams)
        this.$router.push({ name: 'roll', params: { id: 'roll-' + parameters.currentDeliveryNoteId } })
      }
    },
    async writeNumberOfWeighted() {
      const queryParams = {
        dispositionId: this.currentDisposition.id,
      }
      const response = await this.$store.dispatch('weightingScalesCarsSelfService/getNumberOfWeighted', queryParams)
      if (response) {
        this.numberOfWeighted = response.data
        const dataForWrite = weightingsGetDataForWriteNumberOfWeighted(this)
        await this.$store.dispatch('dispositions/update', dataForWrite)
      }
    },
    weightCancel() {
      this.setStartValues()
    },
    toClarifyInfo() {
      this.driverActivity = 0
      const msgString =
        'Jeżeli nie otrzymałeś wydruku, \
								\nzadzwoń na nr: 531 547 502. \
								\nStarszy dysponent tel. 508 375 964.'
      showMessageBox(this, msgString, 28, true)
    },
    async addWeight() {
      this.driverActivity = 0
      if (this.currentDisposition === null) {
        showMessageBox(this, 'Nie wybrana dyspozycja! Samochód nie został zważony!')
        return ''
      }
      if (this.stabilityInfo === 'Waga nie stabilna') {
        return
      }
      this.currentWeight = 0
      this.operationWeight = 'Add'
      await this.getWeightContinue()
    },
    printReport() {
      this.driverActivity = 0
      if (this.currentDeliveryNote) {
        this.currentDeliveryNote.printAndClose = true
        this.$router.push({ name: 'roll', params: { id: this.currentDeliveryNote.id, object: this.currentDeliveryNote } })
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

            if (this.weightType === this.weightingTypes[1]) {
              this.secondWeight = Number(this.currentWeightTimer).toFixed(2)
              this.currentNetto = Number(Number(this.secondWeight) - Number(this.firstWeight)).toFixed(2)
              if (this.currentNetto < 0) {
                this.currentNetto = -Number(this.currentNetto).toFixed(2)
              }
            }
          }
        }
        this.stable = this.stabilityInfo === this.stabilityTypes[0]

        console.log('car_scale_self_service_timer', this.currentWeightTimer)
        this.countDownTimer()
      }, 3000)
    },

    timerBlockingInterface() {
      if (!this.startTimer === true) return
      setTimeout(async () => {
        if (this.currentScaleId) {
          await this.$store.dispatch('scales/findByPk', { params: { id: this.currentScaleId }, noCommit: true }).then((response) => {
            if (response && response.status === 200) {
              if (response.data.blockSelfServiceInterface === true) {
                this.blockingInterface = true
              } else {
                this.blockingInterface = false
              }
            } else {
              this.blockingInterface = false
            }
          })
        }

        console.log('timerBlockingInterface', this.blockingInterface)
        this.timerBlockingInterface()
      }, 10000)
    },

    timerCheckDriverActivity() {
      if (this.isCheckDriverActivity === false) {
        this.driverActivity = 0
        return
      }
      if (this.driverActivity >= 10) {
        this.setStartValues()
        return
      }
      setTimeout(() => {
        this.driverActivity += 1
        console.log('driverActivity', this.driverActivity)
        this.timerCheckDriverActivity()
      }, 1000)
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
.button-font {
  font-size: 28px;
  font-weight: bold;
}
</style>
