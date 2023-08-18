<template>
  <Layout>
    <!-- <b-container> -->
    <b-row class="initial-color">
      <b-col> Spedytor: {{ getObjectName('forwarder') }} </b-col>
      <b-col style="text-align: right"> Data / Godzina {{ convertDate(object.date) }} </b-col>
    </b-row>
    <b-row class="initial-color">
      <b-col style="text-align: center">
        <h3>{{ object.number }}</h3>
      </b-col>
    </b-row>
    <b-row class="initial-color">
      <b-col>
        <!-- <img width="200" height="100"
                    src="https://www.freepnglogos.com/uploads/barcode-png/barcode-laser-code-vector-graphic-pixabay-3.png"
                    alt="barcode" /> -->
        <!-- <barcode :value="object.barCode" format="barcode-format">
                    There is no QrCode
                </barcode> -->
        <barcode :value="object.barCode">
          <p class="qr-text-error">{{ $t('errorLog.qrCodeNotFound') }}</p>
        </barcode>
      </b-col>
      <b-col>
        <b-row style="margin-top: 30px">
          <b-col> Nr samochodu: {{ getObjectName('vehicle') }} </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="initial-color" style="margin-top: 0px">
      <b-col>
        {{ object.barCode }}
      </b-col>
      <b-col> Pierwsze ważenie: {{ getObjectName('scale') }} </b-col>
      <b-col> Drugie ważenie: {{ getObjectName('scaleTwo') }} </b-col>
    </b-row>
    <b-row style="margin-top: 30px">
      <b-col class="initial-color" style="text-align: left"> Kierowca: {{ object.driver.name }} </b-col>
      <b-col class="initial-color" style="text-align: left"> Nr dowodu: </b-col>
    </b-row>
    <hr />
    <b-row style="margin-top: 30px">
      <b-col class="initial-color">
        <ul>
          <li
            >Towar: <span>{{ getObjectName('product') }}</span></li
          >
          <li
            >Numer zlecenia: <span>{{ object.deliveryNoteNumber }}</span></li
          >
          <li
            >Statek: <span>{{ getObjectName('ship') }}</span></li
          >
          <li
            >Spedytor: <span>{{ getObjectName('forwarder') }}</span></li
          >
          <li
            >Odbiorca: <span>{{ getObjectName('customer') }}</span></li
          >
          <li
            >Dostawca: <span>{{ getObjectName('vendor') }}</span></li
          >
        </ul>
      </b-col>
      <b-col class="initial-color">
        <ul>
          <li
            >Deklarowany tonaż: <span>{{ object.quantity }}</span></li
          >
          <li
            >Miejsce założenia: <span>{{ getObjectName('actualWarehouse') }}</span></li
          >
          <li
            >Sortyment: <span>{{ getObjectName('assortment') }}</span></li
          >
          <li
            >Relacja: <span>{{ getObjectName('schemeOfCargo') }}</span></li
          >
          <li
            >Typ operacji: <span>{{ object.typeOfOperation }}</span></li
          >
          <li
            >Stanowisko: <span>{{ getObjectName('position') }}</span></li
          >
        </ul>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="initial-color">
        <p
          >Uwagi: Wyrażam zgodę na przetwarzanie moich danych osobowych przez HES Gdynia Bulk Terminal Sp. z o.o. zgodnie z Ustawą z dnia 24 maja 2018r. o ochronie danych
          osobowych. (Dz.U. 2018. poz.1000) dla potrzeb niezbędnych do współpracy podpis poniże</p
        >
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col cols="4">
        <div class="initial-color">
          Potwierdzam klauzulę danych osobowych i że ładownia samochodu jest czysta i sucha:
          <p class="signiture-line-top"> podpis kierowcy </p>
        </div>
      </b-col>
      <b-col class="initial-color">
        Dyspozycje wystawił <span class="signiture-line-bottom">{{ getObjectName('author') }}</span>
      </b-col>
      <b-col class="initial-color">
        <p class="signiture-line-bottom">Dyspozycję wykonał: {{ getObjectName('author') }}</p>
      </b-col>
    </b-row>
    <!-- </b-container> -->
    <div class="d-print-none mt-2 mb-2">
      <div class="text-right">
        <a href="javascript:window.print()" class="btn btn-primary">
          <i class="ri-printer-fill"></i>
          Drukuj
        </a>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/layouts/main'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'
import VueBarcode from 'vue-barcode'

export default {
  name: 'PFDispPrint',

  page: {
    title: 'Druk dyspozycji',
  },

  components: {
    Layout,
    barcode: VueBarcode,
  },

  data() {
    return {
      viewId: this.$route.params.id,
      object: this.$route.params.object,
    }
  },

  async created() {
    this.initialize()
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'dispositions/setObjectViewProperty',
      setObjectProperty: 'dispositions/setObjectProperty',
      delObjectView: 'dispositions/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async initialize() {
      console.log('object of disposition: ', this.object)
    },

    getObjectName(propertyName) {
      let currentName = ''
      if (this.object) {
        if (this.object[propertyName]) {
          currentName = this.object[propertyName].name
        }
      }
      return currentName
    },

    convertDate(dateValue) {
      const convertedDate = moment(dateValue).format('DD MM YYYY hh:mm:ss')
      return convertedDate
    },
  },
}
</script>

<style>
li {
  list-style: none;
}

/* span {
    margin: 0px 0px 0px 30px;
} */

.signiture-line-top {
  border-top: 2px #000 solid;
}

.signiture-line-bottom {
  border-bottom: 2px #000 solid;
}

.initial-color {
  color: black;
}

.qr-text-error {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>