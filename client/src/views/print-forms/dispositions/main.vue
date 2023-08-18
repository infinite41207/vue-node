<template>
  <Layout>
    <b-card class="main-block">
      <!-- <b-container> -->
      <b-row class="initial-color">
        <b-col> Spedytor: <span class="text-larger-1">{{ getObjectName('forwarder') }} </span> </b-col>
        <b-col style="text-align: right"> Data / Godzina {{ convertDate(object.date) }} </b-col>
      </b-row>
      <b-row class="initial-color">
        <b-col style="text-align: center">
          <h3>Dyspozycja załadowscza dla HES Gdynia nr {{ object.number }}</h3>
        </b-col>
      </b-row>
      <b-row class="initial-color">
        <b-col>
          <qr-code size="90" :text="qrCodeValue"></qr-code>
        </b-col>
        <b-col>
          <b-row style="margin-top: 30px">
            <b-col> Nr samochodu: <span class="text-larger-1" >{{ getObjectName('vehicle') }}</span> </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="initial-color" style="margin-top: 0px">
        <b-col> </b-col>
        <b-col class="text-larger-2"> Pierwsze ważenie: {{ getObjectName('scale') }} </b-col>
        <b-col class="text-larger-2"> Drugie ważenie: {{ getObjectName('scaleTwo') }} </b-col>
      </b-row>
      <b-row style="margin-top: 30px">
        <b-col class="initial-color" style="text-align: left"> Kierowca: <span class="text-larger-1"> {{ getObjectName('driver') }}</span> </b-col>
        <b-col class="initial-color" style="text-align: left"> Nr dowodu: <span class="text-larger-1">{{  }}</span></b-col>
      </b-row>
      <hr />
      <b-row style="margin-top: 30px">
        <b-col class="initial-color">
          <ul>
            <li
              >Towar: <span class="text-larger-3">{{ getObjectName('product') }}</span></li
            >
            <li
              >Numer zlecenia: <span>{{ object.deliveryNoteNumber }}</span></li
            >
            <li
              >Statek: <span class="text-larger-3">{{ getObjectName('ship') }}</span></li
            >
            <li
              >Spedytor: <span class="text-larger-3">{{ getObjectName('forwarder') }}</span></li
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
              >Miejsce złożenia: <span class="text-larger-3">{{ getObjectName('warehouse') }}</span></li
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
            <p class="mt-4 signiture-line-top"> podpis kierowcy </p>
          </div>
        </b-col>
        <b-col class="initial-color">
          <p class="signiture-line-bottom">Dyspozycje wystawił: {{ getObjectName('author') }}</p>
        </b-col>
        <b-col class="initial-color">
          <p class="signiture-line-bottom">Dyspozycję wykonał: {{ getObjectName('author') }}</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <p class="initial-color"
            >Uwagi: Wyrażam zgodę na przetwarzanie moich danych osobowych przez HES Gdynia Bulk Terminal Sp. z o.o. zgodnie z Ustawą z dnia 24 maja 2018r. o ochronie danych
            osobowych. (Dz.U. 2018. poz.1000) dla potrzeb niezbędnych do współpracy podpis poniże</p
          >
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
    </b-card>
  </Layout>
</template>

<script>
import Layout from '@/layouts/main'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'
// import VueBarcode from 'vue-barcode'
// import QrcodeVue from 'qrcode.vue'

import Vue from 'vue'
import VueQRCodeComponent from 'vue-qrcode-component'
Vue.component('qr-code', VueQRCodeComponent)

export default {
  name: 'PFDispMain',

  page: {
    title: 'Druk dyspozycji',
  },

  components: {
    Layout,
  },

  data() {
    return {
      viewId: this.$route.params.id,
      object: this.$route.params.object,
      qrCodeSize: 300,
      qrCodeValue: "value"
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
      this.qrCodeValue = this.object.barCode
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

.main-block {
  max-width: 50%;
}

.qrcode {
  width: 400px;
  height: 400px;
}

.text-larger-1 {
  font-size: x-large;
  font-weight: bolder;
  margin-left: 5%;
}

.text-larger-2 {
  font-size: larger;
  font-weight: bold;
}

.text-larger-3 {
  font-size: 500;
  font-weight: bold;
  margin-left: 1%;
}

@media print {
  .main-block {
    max-width: 100%;
  }
}
</style>