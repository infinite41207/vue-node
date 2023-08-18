<template>
  <div>
    <b-modal v-model="value" size="xl" hide-footer body-class="pr-4 pl-4 pb-3" title="Ważenie dispozycji" @close="onClose">
      <div align="left" style="font-size: 18px">
        <b-row style="font-size: 50px; font-weight: bold">
          <p style="padding-right: 10px"> {{ weightType }}: </p>
          <!-- <p :style="{ color: colorWeight }"> {{ currentWeightTimer }} T. {{ stabilityInfo }} </p> -->
          <p :class="{ 'not-stable-weight': !stable, 'stable-weight': stable }"> {{ currentWeightTimer }} T. {{ stabilityInfo }} </p>
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
              Waga: <b> {{ getCatalogPresentation(bruttoScale) }} </b></p
            >
            <p>
              Brutto:<b> {{ brutto }} </b></p
            >
            <p> Data i czas ważenia:</p>
            <p>
              <b> {{ setFormatDateTime(bruttoTime) }} </b></p
            >
          </b-col>
          <b-col md="4">
            <p style="border-bottom: 2px solid lightgrey"> <b> TARA </b></p>
            <p>
              Waga: <b> {{ getCatalogPresentation(tareScale) }} </b></p
            >
            <p>
              Tara:<b> {{ tare }} </b></p
            >
            <p> Data i czas ważenia:</p>
            <p>
              <b> {{ setFormatDateTime(tareTime) }} </b></p
            >
          </b-col>
          <b-col md="4">
            <p style="border-bottom: 2px solid lightgrey"> <b> NETTO </b></p>
            <p>
              Waga: <b> {{ getCatalogPresentation(nettoScale) }} </b></p
            >
            <p>
              Netto:<b> {{ netto }} </b></p
            >
            <p> Data i czas ważenia:</p>
            <p>
              <b> {{ setFormatDateTime(nettoTime) }} </b></p
            >
          </b-col>
        </b-row>
        <p> </p>
        <b-row>
          <b-button class="mr-1" variant="primary" @click="setWeight"> OK </b-button>
          <b-button class="ml-4 mr-1" variant="outline-secondary" @click="getWeight"> ZWAŻ </b-button>
          <b-button v-if="isClickWeighting !== true" class="mr-1" variant="outline-secondary" @click="printDN"> KWITY </b-button>
          <b-button v-if="isSecondWeighting" class="mr-1" variant="outline-secondary" @click="addWeight">DOSYPKA</b-button>
          <b-button v-if="isSecondWeighting" class="mr-1" variant="outline-secondary" @click="setZeroDN">ZEROWANJE KWITU</b-button>
          <b-button v-if="isWielokrotność" class="mr-1" variant="outline-secondary" @click="sendToTare">WYSŁANIE NA WAŻENIE TARY</b-button>
          <b-button class="mr-1" variant="outline-secondary" @click="cancellationOfWeighing"> ZRZUĆ (ANULUJ) </b-button>
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

      showInputWeight: false,

      weightingTypes: ['Pierwsze ważenie', 'Drugie ważenie'],
      stabilityTypes: ['Waga stabilna', 'Waga nie stabilna'],

      correctionWeight: 0,
      // eqal: 0,

      brutto: 0,
      bruttoScale: null,
      bruttoAuthor: null,
      bruttoTime: '',
      tare: 0,
      tareScale: null,
      tareAuthor: null,
      tareTime: '',
      netto: 0,
      nettoScale: null,
      nettoAuthor: null,
      nettoTime: '',

      operationWeight: '',

      declaredWeight: 100,
      firstWeight: 25,
      secondWeight: 30,

      numberOfWeighted: 0,

      isClickWeighting: false,
      isWielokrotność: false,
    }
  },

  computed: {
    ...mapGetters({
      currentView: 'weightingScalesCars/currentView',
    }),
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
    showDetails: {
      get() {
        return this.currentView.isSecondWeighting
      },
      set(value) {
        this.setListViewProperty({ isSecondWeighting: value })
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
      setListViewProperty: `weightingScalesCars/setListViewProperty`,
    }),
    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },

    async initialize() {
      // const params = {
      //   userId: this.currentUserId,
      //   userSettingItemKey: 'weightingTestMode',
      // }
      // await this.$store
      //   .dispatch('userSettings/findByKey', { params })
      //   .then((response) => {
      //     if (response.status === 200) {
      //       this.testMode = response.data
      //     }
      //   })
      //   .catch((error) => {
      //     console.warn(error)
      //   })

      this.correctionWeight = 0
      if (this.currentDeliveryNote !== null) {
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
      } else {
        if (this.currentDisposition.numberOfWeighings > 1) {
          const queryParams = {
            dispositionId: this.currentDisposition.id,
          }
          const response = await this.$store.dispatch('deliveryNotes/getLastTareOfReversOperation', queryParams)
          if (response) {
            const lastTareWeitingParams = response.data
            if (lastTareWeitingParams.tare > 0) {
              this.tare = lastTareWeitingParams.tare
              this.tareScale = lastTareWeitingParams.scaleTare
              this.tareAuthor = lastTareWeitingParams.tareAuthor
              this.tareTime = lastTareWeitingParams.tareTime
            }
          }
        }
      }

      this.firstWeight = 0
      this.secondWeight = 0
      this.numberOfWeighted = 0
      this.operationWeight = ''
      this.isClickWeighting = false
      this.isWielokrotność = false

      this.colorWeight = this.usedColors.primaryText
      this.colorTabTitle = this.usedColors.darkTitle
      this.colorTabTitleText = this.usedColors.lightTitle
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
    async getWeightContinue() {
      this.isClickWeighting = true
      this.currentWeight = ''
      if (this.testMode) {
        this.showInputWeight = true
      } else {
        const weightingData = await weightingsGetWeight(this.currentScaleId, Number(this.currentWeight))
        if (weightingData) {
          this.currentWeight = weightingData.weight
        }

        this.getWeightingEnd()
      }
    },
    onInputWeight(event) {
      this.showInputWeight = false
      this.currentWeight = Number(this.currentWeight).toFixed(2)
      this.getWeightingEnd()
    },
    async getWeightingEnd() {
      const thisIsShipment = weightingsThisIsShipment(this.currentDisposition)
      if (thisIsShipment) {
        this.firstWeight = this.tare
      } else {
        this.firstWeight = this.brutto
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
            showMessageBox(this, 'Waga przekracza wagę deklarowaną. Musisz odsypać ' + this.correctionWeight + ' ton.')
          } else if (Number(this.currentWeight) - Number(this.firstWeight) < Number(dispositionQuantity) - 0.3) {
            // Quantity - 300 kg - Kolano...
            this.correctionWeight = Number(dispositionQuantity) - (Number(this.currentWeight) - Number(this.firstWeight))
            showQuestion(this, 'Masz mniej o (' + this.correctionWeight + 't).\nCzy chcesz wykonać ważenia?', this.answerWeightingQuestionOk, this.answerWeightingQuestionCancel)
            // return
          }
        }
      } else if (this.operationWeight === 'ZeroDN') {
        if (!this.currentDisposition.allowSetZero === true) {
          showMessageBox(this, 'Żeby przerwać operację i opuścić teren HES proszę skontaktować się z obsługą!')
          return
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
          this.brutto = 0
          this.bruttoScale = null
          this.bruttoAuthor = null
          this.bruttoTime = ''
          this.tare = this.currentWeight
          this.tareScale = this.currentScale
          this.tareAuthor = this.curruntAuthor
          this.tareTime = new Date()
        } else {
          this.brutto = this.currentWeight
          this.bruttoScale = this.currentScale
          this.bruttoAuthor = this.curruntAuthor
          this.bruttoTime = new Date()
          this.tare = 0
          this.tareScale = null
          this.tareAuthor = null
          this.tareTime = ''
        }
        this.netto = 0
        this.nettoScale = null
        this.nettoAuthor = null
        this.nettoTime = ''
      } else {
        if (thisIsShipment) {
          this.brutto = this.currentWeight
          this.bruttoScale = this.currentScale
          this.bruttoAuthor = this.curruntAuthor
          this.bruttoTime = new Date()
        } else {
          this.tare = this.currentWeight
          this.tareScale = this.currentScale
          this.tareAuthor = this.curruntAuthor
          this.tareTime = new Date()
        }
        this.netto = (this.brutto - this.tare).toFixed(2)
        this.nettoScale = this.currentScale
        this.nettoAuthor = this.curruntAuthor
        this.nettoTime = new Date()
      }
    },
    async setWeight() {
      if (!this.isClickWeighting) {
        showMessageBox(this, 'Ważenie niedokończone!')
        return
      }
      const isError = await this.setWeightingEnd()
      if (isError === false && this.operationWeight === 'OK') {
        if (this.weightType === this.weightingTypes[1] && this.currentDisposition.numberOfWeighings <= 1) {
          const objParameters = { currentDeliveryNoteId: this.currentDeliveryNote.id }
          showQuestion(this, 'Wydrukować kwity?', this.printCurrentDeliveryNote, objParameters)
        } else {
          showMessageBox(this, 'Samohód został zważony!', 22, true)
          this.setWeightingEndClose()
        }
      } else {
        this.setWeightingEndClose()
      }
      if (!this.testMode === true) {
        //My palaniuyk
        console.log('this.currentDeliveryNote.id: ', this.currentDeliveryNote.id)
        const resPhoto = await getPhotoScale(this.currentScaleId, this.currentDeliveryNote.id)
        console.log(resPhoto)
      }
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
        this.setWeightingEndClose()
      }
    },
    setWeightingEndClose() {
      this.$emit('on-input-weight')
      this.$emit('input', false)
    },
    onClose() {
      this.$emit('input', false)
    },
    answerWeightingQuestionOk() {
      this.setWeight()
    },
    answerWeightingQuestionCancel() {
      this.cancellationOfWeighing()
    },
    setZero() {
      if (this.currentWeight > 80 || this.currentWeight < -80) {
        return
      }
      this.eqal = -this.currentWeight
    },
    async addWeight() {
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
      // await this.setWeight()
    },
    cancellationOfWeighing() {
      this.$emit('input', false)
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
    sendToTare(event) {
      showQuestion(this, 'Samochód zostanie wysłany do ważenia tary.\nWykonać?', this.sendToTareContinue)
    },
    async sendToTareContinue() {
      const dataForWrite = await weightingsGetDataForWriteSendToTare(this)
      await this.$store.dispatch('dispositions/update', dataForWrite)
      await this.writeNumberOfWeighted()
      await this.setWeight()
    },
    async writeNumberOfWeighted() {
      const queryParams = {
        dispositionId: this.currentDisposition.id,
      }
      const response = await this.$store.dispatch('weightingScalesCars/getNumberOfWeighted', queryParams)
      if (response) {
        this.numberOfWeighted = response.data
        const dataForWrite = weightingsGetDataForWriteNumberOfWeighted(this)
        await this.$store.dispatch('dispositions/update', dataForWrite)
      }
    },
    printCurrentDeliveryNote(parameters) {
      // const response = await this.$store.dispatch(`deliveryNotes/findByPk`, {
      //   params: {
      //     id: this.currentDeliveryNote.id,
      //   },
      // })

      // if (!response.status === 200) {
      //   return
      // }

      const queryParams = {
        name: 'roll',
        id: this.currentDeliveryNote.id,
        object: this.currentDeliveryNote,
        routeOwner: 'scales-cars',
        isPrintAndClosed: true,
      }
      this.$store.dispatch('printForms/addPrint', queryParams)
      this.$router.push({ name: 'roll', params: { id: 'roll-' + this.currentDeliveryNote.id } })
      // this.$router.push({ name: 'roll', params: { id: this.currentDeliveryNote.id, object: this.currentDeliveryNote, routeOwner: 'scales-cars', isPrintAndClosed: true } })
      this.setWeightingEndClose()
    },

    onInputWeightOK(event) {
      event.preventDefault()
      this.showInputWeight = false
      this.getWeightingEnd()
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
</style>