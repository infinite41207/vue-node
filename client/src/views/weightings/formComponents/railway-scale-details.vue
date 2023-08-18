<template>
  <div>
    <b-modal v-model="value" size="xl" hide-footer body-class="pr-4 pl-4 pb-3" title="Ważenie wagonów" @close="onClose">
      <div align="left" style="font-size: 18px">
        <b-row style="font-size: 50px; font-weight: bold">
          <span :class="{ 'not-stable-weight': !stable, 'stable-weight': stable }"> {{ getWeightPresentation(currentWeightTimer) }} {{ stabilityInfo }} </span>
        </b-row>

        <b-row class="mt-2">
          <b-col md="6">
            <b-row class="mb-2">
              <span>
                Numer pociągu: <b> {{ getObjectAttrByName(currentDeliveryNote, 'trainNumber') }}</b></span
              >
            </b-row>
            <b-row class="mb-2">
              <span>
                Numer wagonu: <b> {{ getCatalogPresentation(getObjectAttrByName(currentDeliveryNote, 'vehicle')) }}</b></span
              >
            </b-row>
            <b-row class="mb-2">
              <span>
                Magazyn: <b> {{ getCatalogPresentation(getObjectAttrByName(currentDisposition, 'warehouse')) }}</b></span
              >
            </b-row>
            <b-row class="mb-2">
              <span>
                Deklarowana tara: <b> {{ declareTare }} </b></span
              >
            </b-row>
            <b-row class="mb-2">
              <span>
                Nośność wagonu: <b> {{ declareLoadCapacity }} </b></span
              >
            </b-row>
          </b-col>
          <b-col md="6">
            <!-- <b-row class="mb-2"> -->
            <!-- <span>
                Typ ważenia: <b> {{ weightType }} </b></span
              > -->
            <b-form-group horizontal class="mb-2" :label-cols="3" label="Typ ważenia:">
              <b-form-select id="weight-type" v-model="weightType" :options="weightingTypes" text-field="name" value-field="value" size="sm" />
            </b-form-group>
            <!-- </b-row> -->
            <b-row class="mb-2">
              <span>
                Waga maksymalna:
                <b> {{ maxWeight.toFixed(3) }}</b></span
              >
            </b-row>
            <b-row class="mb-2">
              <span>
                Tara zważona: <b> {{ getObjectAttrByName(currentDeliveryNote, 'tare') }}</b></span
              >
            </b-row>
            <b-row class="mb-2">
              <span>
                Waga brutto: <b> {{ getObjectAttrByName(currentDeliveryNote, 'brutto') }}</b></span
              >
            </b-row>
            <b-row class="mb-2">
              <span>
                Waga netto: <b> {{ getObjectAttrByName(currentDeliveryNote, 'netto') }}</b></span
              >
            </b-row>
          </b-col>
        </b-row>
        <!-- <b-row :style="{ color: colorTabTitleText, backgroundColor: colorTabTitle }">
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
        <p> </p> -->
        <b-row class="mt-2">
          <!-- <b-button variant="primary" class="mr-1" @click="setWeight"> OK </b-button> -->
          <b-button variant="danger" class="mr-1" @click="getWeightBrutto"> ZWAŻ BRUTTO</b-button>
          <b-button v-if="(weightType = 1)" variant="danger" class="mr-1" @click="getWeightTare"> ZWAŻ TARA</b-button>
          <!-- <b-button class="mr-1" @click="cancellationOfWeighing"> ZRZUĆ (ANULUJ) </b-button> -->
        </b-row>
      </div>
    </b-modal>

    <!-- <InputWeight v-model="showInputWeight" @on-input-weight="onInputWeight" /> -->

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
</template>
  
  
  <script>
import _ from 'lodash'
// import appConfig from '@/app.config'
import Layout from '@/layouts/main'
// import PageHeader from '@components/page-header'
import { mapGetters, mapMutations } from 'vuex'
import {
  catalogPresentation,
  documentPresentation,
  dateTimePresentation,
  weightPresentation,
  showMessageBox,
  showQuestion,
  fillObject as commonUseFillObject,
} from '@/utils/commonUse.js'
import { getWeight as weightingsGetWeight, getPhotoScale, readValueS7, writeValueS7 } from '@/utils/weightings.js'
import { newUuid as getNewUuid } from '@/utils/commonUse.js'
// import { resolve } from 'path/posix'
import DeliveryNote from '@/dto/DeliveryNote.json'

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    currentWeightTimer: {
      type: Number,
    },
    stabilityInfo: {
      type: String,
      default: '',
    },
    stable: {
      type: Boolean,
      default: false,
    },
    testMode: {
      type: Boolean,
      default: false,
    },
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
      weightingTypes: [
        { value: 0, name: 'Tara deklarowana' },
        { value: 1, name: 'Tara zważona' },
      ],

      showInputWeight: false,

      brutto: 0,
      bruttoScale: null,
      bruttoAuthor: null,
      bruttoTime: '',
      tare: 0,
      tareScale: null,
      tareAuthor: null,
      tareTime: '',
      nettoScale: null,
      nettoAuthor: null,
      nettoTime: '',

      currentBrutto: 0,
      currentTare: 0,
      currentNetto: 0,
      maxWeight: 0,
      declareTare: 0,
      declareLoadCapacity: 0,

      weightType: 0,
      operationWeight: '',
      stabilityTypes: ['Waga stabilna', 'Waga nie stabilna'],

      automaticWeightingEnd: false,
      isStarted: false,
    }
  },

  computed: {
    ...mapGetters({
      currentView: 'weightingScalesRailway/currentView',
    }),
    currentWeight: {
      get() {
        return this.currentView.currentWeight
      },
      set(value) {
        this.setListViewProperty({ currentWeight: value })
      },
    },
    weightOperation: {
      get() {
        return this.currentView.weightOperation
      },
      set(value) {
        this.setListViewProperty({ weightOperation: value })
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

  watch: {
    currentDeliveryNote(newVal, oldVal) {
      this.initialize()
    },
  },

  created() {
    if (this.showDetails === true) {
      this.initialize()
    }
  },

  methods: {
    ...mapMutations({
      setListViewProperty: `weightingScalesRailway/setListViewProperty`,
    }),
    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },

    async initialize() {
      this.brutto = this.currentDeliveryNote.brutto
      this.bruttoScale = this.currentDeliveryNote.scaleBrutto
      this.bruttoAuthor = this.currentDeliveryNote.bruttoAuthor
      this.bruttoTime = this.currentDeliveryNote.bruttoTime
      this.tare = this.currentDeliveryNote.tare
      this.tareScale = this.currentDeliveryNote.scaleTare
      this.tareAuthor = this.currentDeliveryNote.tareAuthor
      this.tareTime = this.currentDeliveryNote.tareTime
      this.netto = this.currentDeliveryNote.netto
      this.nettoScale = this.currentDeliveryNote.scaleNetto
      this.nettoAuthor = this.currentDeliveryNote.nettoAuthor
      this.nettoTime = this.currentDeliveryNote.nettoTime
      this.weightType = 0
      const response = await this.$store.dispatch(`vehicles/findByPk`, {
        params: {
          id: this.currentDeliveryNote.vehicle.id,
        },
        noCommit: true,
      })
      if (response.status === 200) {
        this.declareTare = response.data.tare
        this.declareLoadCapacity = response.data.loadCapacity ? response.data.loadCapacity : 0
        this.maxWeight = Number(this.declareTare) + Number(this.declareLoadCapacity)
      } else {
        this.declareTare = 0
        this.declareLoadCapacity = 0
        this.maxWeight = 0
      }

      // debugger
      // (
      //   Number(getObjectAttrByName(getObjectAttrByName(currentDeliveryNote, 'vehicle'), 'tare')) +
      //   Number(getObjectAttrByName(getObjectAttrByName(currentDeliveryNote, 'vehicle'), 'loadCapacity'))
      // ).toFixed(3)

      this.isClickWeighting = false
    },

    async weightStart() {
      if (this.currentDisposition === null) {
        showMessageBox(this, 'Nie wybrana dyspozycja! Samochód nie został zważony!')
        return
      }
      if (this.stabilityInfo === 'Waga nie stabilna') {
        // showMessageBox(this, 'Waga nie stabilna!')
        return
      }
      const queryParams = {
        id: this.currentDisposition.id,
      }
      const response = await this.$store.dispatch('weightingScalesBunker/getLockedParameters', queryParams)
      if (response.status === 200) {
        if (response.data.scaleId === this.scaleId) {
          const textMessage =
            'W przypadku awarii ważenia samochodu (powiązane z wylączeniem aplikacji lub zamykania miejsca wagowego) i potrzeby przedłużenia zaladowania samochodu po uruchomieniu, wciśnij ""TAK"". Jeżeli samochód w trakcie ważenia i był wybrany przypadkowo, wciśnij ""NIE"".'
          showQuestion(this, textMessage, this.weightStartContinue)
          return
        } else {
          const textMessage = this.currentDisposition.presentation + ' już w trakcie ważenia na wadze ' + response.data.scale.name + ' ' + response.data.weightingStation.name
          showMessageBox(this, textMessage)
          return
        }
      }
      this.weightStartContinue()
    },
    async weightStartContinue() {
      this.weightOperation = 'start'
      if (this.currentDeliveryNote === null) {
        await this.getWeight()
      } else {
        this.currentWeight = this.currentDeliveryNote.brutto
        await this.getWeightEnd()
      }
    },
    async weightEnd() {
      if (this.automaticWeightingEnd !== true) {
        if (this.currentDeliveryNote === null) {
          if (this.testMode === false) {
            // ptCommonUseClient.WriteValueToExternalRegister(DriverObject, ScaleParameters, 2, "Begin"+ScaleName, 0);
            await writeValueS7(this.scaleId, 'Begin', false)
          }
          return
        }
        if (this.stabilityInfo === 'Waga nie stabilna') {
          // showMessageBox(this, 'Waga nie stabilna!')
          return
        }
      }
      this.weightOperation = 'end'
      await this.getWeight()
    },

    async getWeight() {
      await this.getWeightContinue()
    },
    async getWeightContinue() {
      this.isClickWeighting = true
      this.currentWeight = ''
      if (this.testMode === true) {
        this.showInputWeight = true
      } else {
        const weightingData = await weightingsGetWeight(this.scaleId, Number(this.currentWeight))
        if (weightingData) {
          this.currentWeight = weightingData.weight
        }

        this.getWeightEnd()
      }
    },
    onInputWeight(event) {
      this.showInputWeight = false
      this.currentWeight = Number(this.currentWeight).toFixed(2)
      this.getWeightEnd()
    },

    async getWeightEnd() {
      if (this.weightOperation === 'start') {
        if (Number(this.currentWeight) < Number(this.currentDisposition.quantity)) {
          const textMessage = 'Deklarowany tonaż więcej nabranego tonażu na wagę, chcecie rozpocząć ładowanie?'
          showQuestion(this, textMessage, this.getWeightEndAtStart)
          return
        }
        await this.getWeightEndAtStart()
      } else if (this.weightOperation === 'end') {
        this.weightAtEnd = this.currentWeight
        if (this.weightAtBeginning - this.weightAtEnd <= 0.04) {
          const textMessage = 'Naważanie nie zostało zakończone! Czy na pewno chcesz zakończyć?'
          showQuestion(this, textMessage, this.clearDeliveryNote, this.getWeightEndAtEnd)
          return
        } else {
          await this.endWeightingAtServer()
          let templateName = 'roll'
          if (process.env.IS_ELECTRON) {
            // If IsRollPrinter Then
            //   TemplateName = "DeliveryNoteThin";
            // Else
            //   TemplateName = "DeliveryNote";
            // EndIf;
            // NumberOfCopies
            // templateName = 'main-dn-print'
            templateName = 'roll'
          }
          const queryParams = {
            name: templateName,
            id: this.currentDeliveryNote.id,
            object: this.currentDeliveryNote,
            routeOwner: 'scales-bunker',
            isPrintAndClosed: true,
          }
          this.$store.dispatch('printForms/addPrint', queryParams)
          this.$router.push({ name: templateName, params: { id: templateName + '-' + this.currentDeliveryNote.id } })
          try {
            const resPhoto = await getPhotoScale(this.scaleId, this.currentDeliveryNote.id)
            console.log(resPhoto)
          } catch (error) {
            console.log(error)
          }
        }
        await this.getWeightEndAtEnd()
      }
    },

    async getWeightEndAtStart() {
      let isFull = false
      let endLoad = false
      if (this.testMode === false) {
        // Result = ptCommonUseClient.ReadValueFromExternalRegister(DriverObject, InputParameters, "IsFull"+ScaleName, IsFull);
        isFull = await readValueS7(this.scaleId, 'IsFull')
        if (isFull === false) {
          showMessageBox(this, 'Nie zapełniona waga!')
          return
        }
        try {
          // Result = ptCommonUseClient.ReadValueFromExternalRegister(DriverObject, InputParameters, "EndLoad"+ScaleName, EndLoad);
          endLoad = await readValueS7(this.scaleId, 'EndLoad')
        } catch {
          endLoad = true
        }
        if (endLoad === false) {
          showMessageBox(this, 'Nie zapełniona waga!')
          return
        }
      }
      this.weightAtBeginning = this.currentWeight
      this.isStarted = true
      this.automaticWeightingEnd = this.weighingStation.obj.automaticWeightingEnd
      if (this.automaticWeightingEnd === true) {
        this.timerAutomaticEnd()
      }
      console.log()

      if (this.weightAtBeginning > 0) {
        await this.beginWeightingAtServer()
        if (this.testMode === false) {
          const mахWeight = Number(this.currentDisposition.quantity)
          if (mахWeight > 0) {
            console.log()
            // ptCommonUseClient.WriteValueToExternalRegister(DriverObject, ScaleParameters, 2, "WagaZadana"+ScaleName, МахWeight*ScaleParameters.Factor);
            // ptCommonUseClient.WriteValueToExternalRegister(DriverObject, ScaleParameters, 2, "Begin"+ScaleName, 1);
            const write1 = await writeValueS7(this.scaleId, 'WagaZadana', Number(this.currentDisposition.quantity) * 1000)
            const write2 = await writeValueS7(this.scaleId, 'Begin', true)
            console.log('write1 = ', write1)
            console.log('write2 = ', write2)
          }
          try {
            const resPhoto = await getPhotoScale(this.scaleId, this.currentDeliveryNote.id)
            console.log(resPhoto)
          } catch (error) {
            console.log(error)
          }
        }
      }
      this.weightOperation = ''
    },

    async getWeightEndAtEnd() {
      if (this.testMode === false) {
        // ptCommonUseClient.WriteValueToExternalRegister(DriverObject, ScaleParameters, 2, "Begin"+ScaleName, 0);
        await writeValueS7(this.scaleId, 'Begin', false)
      }
      const queryParams = {
        dispositionId: this.currentDisposition.id,
      }
      await this.$store.dispatch('weightingScalesBunker/deleteLockedDisposition', queryParams)
      this.isStarted = false
      this.weightOperation = ''
      // this.showDetails = false
      // this.setWeightingEndClose()
    },

    async beginWeightingAtServer() {
      const queryParams = {
        dispositionId: this.currentDisposition.id,
        scaleId: this.scaleId,
        weighingStationId: this.weighingStationId,
        authorId: this.currentUserId,
      }
      await this.$store.dispatch('weightingScalesBunker/setLockedDisposition', queryParams)

      const dataForWrite = _.cloneDeep(DeliveryNote)
      if (this.currentDeliveryNote !== null) {
        if (this.currentDeliveryNote.brutto > 0) {
          return
        } else {
          dataForWrite.action = 'update'
          dataForWrite.id = this.currentDeliveryNote.id
        }
      } else {
        dataForWrite.action = 'create'
        dataForWrite.id = getNewUuid()
      }
      const excludeArray = ['id', 'date', 'number', 'numberStr', 'author', 'comment']
      commonUseFillObject(dataForWrite, this.currentDisposition, [], excludeArray)

      dataForWrite.dispositionId = this.currentDisposition.id
      dataForWrite.date = Date.now()
      dataForWrite.prefix = 'LP'
      dataForWrite.state = 'OnBrutto'
      dataForWrite.brutto = this.weightAtBeginning
      dataForWrite.bruttoTime = Date.now()
      dataForWrite.bruttoAuthorId = this.currentUserId
      dataForWrite.scaleBruttoId = this.scaleId
      dataForWrite.tare = 0
      dataForWrite.netto = 0
      dataForWrite.comment = ''
      dataForWrite.markedToDelete = false
      await this.$store.dispatch('deliveryNotes/' + dataForWrite.action, dataForWrite)
      const response = await this.$store.dispatch('deliveryNotes/findByPk', { params: { id: dataForWrite.id }, noCommit: true })
      if (response && response.status === 200) {
        this.currentDeliveryNote = response.data
      }
      this.$store.dispatch('sync1CData/sendTo1C')
    },

    async endWeightingAtServer() {
      const dataForWrite = {}
      dataForWrite.id = this.currentDeliveryNote.id
      dataForWrite.tare = this.weightAtEnd
      dataForWrite.tareTime = Date.now()
      dataForWrite.tareAuthorId = this.currentUserId
      dataForWrite.scaleTareId = this.scaleId
      dataForWrite.netto = this.weightAtBeginning - this.weightAtEnd
      dataForWrite.nettoTime = Date.now()
      dataForWrite.nettoAuthorId = this.currentUserId
      dataForWrite.scaleNettoId = this.scaleId
      await this.$store.dispatch('deliveryNotes/update', dataForWrite)
      const response = await this.$store.dispatch('deliveryNotes/findByPk', { params: { id: dataForWrite.id }, noCommit: true })
      if (response && response.status === 200) {
        this.currentDeliveryNote = response.data
      }
      await this.updateDisposition()
      this.$store.dispatch('sync1CData/sendTo1C')
    },

    async clearDeliveryNote() {
      const dataForWrite = {}
      dataForWrite.id = this.currentDeliveryNote.id
      dataForWrite.brutto = 0
      dataForWrite.bruttoTime = null
      dataForWrite.bruttoAuthor = null
      dataForWrite.scaleBrutto = null
      await this.$store.dispatch('deliveryNotes/update', dataForWrite)
      const response = await this.$store.dispatch('deliveryNotes/findForWeighting', { dispositionId: this.currentDisposition.id })
      if (response && response.status === 200) {
        this.currentDeliveryNote = response.data
      }
      this.$store.dispatch('sync1CData/sendTo1C')
    },

    setWeightingEndClose() {
      this.$emit('on-input-weight')
      this.$emit('input', false)
    },
    onClose() {
      this.$emit('on-input-weight')
      this.$emit('input', false)
    },
    cancellationOfWeighing() {
      this.$emit('on-input-weight')
      this.$emit('input', false)
    },

    async updateDisposition() {
      const queryParams = {
        dispositionId: this.currentDisposition.id,
      }
      let numberOfWeighted = 0
      let response = await this.$store.dispatch('weightingScalesBunker/getNumberOfWeighted', queryParams)
      if (response) {
        numberOfWeighted = response.data
        queryParams.numberOfWeighted = response.data
      }
      if (this.currentDisposition.numberOfWeighings > 1) {
        if (numberOfWeighted < this.currentDisposition.numberOfWeighings) {
          queryParams.newStateDisposition = 'SecondWeighing'
        } else {
          queryParams.newStateDisposition = 'Closed'
        }
      } else {
        queryParams.newStateDisposition = 'Closed'
      }
      response = await this.$store.dispatch('weightingScalesBunker/updateDisposition', queryParams)
    },

    printCurrentDeliveryNote(parameters) {
      const queryParams = {
        name: 'roll',
        id: this.currentDeliveryNote.id,
        object: this.currentDeliveryNote,
        routeOwner: 'scales-cars',
        isPrintAndClosed: true,
      }
      this.$store.dispatch('printForms/addPrint', queryParams)
      this.$router.push({ name: 'roll', params: { id: 'roll-' + this.currentDeliveryNote.id } })
    },

    onInputWeightOK(event) {
      event.preventDefault()
      this.showInputWeight = false
      this.getWeightEnd()
      this.currentWeight = Number(this.currentWeight).toFixed(2)
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
    getWeightPresentation(value) {
      return weightPresentation(value)
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
    printDN() {
      if (this.currentDeliveryNote) {
        const queryParams = {
          name: 'roll',
          id: this.currentDeliveryNote.id,
          object: this.currentDeliveryNote,
          routeOwner: '',
          isPrintAndClosed: false,
        }
        this.$store.dispatch('printForms/addPrint', queryParams)
        this.$router.push({ name: 'roll', params: { id: 'roll-' + this.currentDeliveryNote.id } })
      }
    },

    async timerAutomaticEnd() {
      // if (this.testMode === true) return
      if (!this.isStarted === true) {
        const isClosed = await readValueS7(this.scaleId, 'IsClosed')
        console.log('timerAutomaticEnd isClosed = ', isClosed)
        return
      }

      setTimeout(async () => {
        let isClosed = false
        // Result = ptCommonUseClient.ReadValueFromExternalRegister(DriverObject, InputParameters, "IsClosed" + ScaleName, IsClosed);
        isClosed = await readValueS7(this.scaleId, 'IsClosed')
        console.log('timerAutomaticEnd isClosed = ', isClosed)
        if (isClosed === true) {
          await this.getWeightEnd()
          console.log('AutomaticEnd')
          return
        }
        this.timerAutomaticEnd()
      }, 2000)
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

    setWeight() {},
    getWeightBrutto() {},
    getWeightTare() {},
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
  color: rgb(49, 56, 71);
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