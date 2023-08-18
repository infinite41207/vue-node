<template>
  <Layout>
    <b-tabs content-class="mt-3">
      <b-tab active title="Dyspozycja">
        <b-card style="max-width: 70%">
          <b-row class="initial-color">
            <b-col> Spedytor: {{ getObjectName('forwarder') }} </b-col>
            <b-col style="text-align: right"> Data / Godzina {{ convertDate(object.date) }} </b-col>
          </b-row>
          <b-row class="initial-color">
            <b-col style="text-align: center">
              <h3>Dyspozycja załadowscza dla HES Gdynia nr {{ object.number }}</h3>
            </b-col>
          </b-row>
          <b-row class="initial-color">
            <b-col>
              <qrcode class="qrcode" value="https://example.com" :size="qrCodeSize" />
            </b-col>
            <b-col>
              <b-row style="margin-top: 30px">
                <b-col> Nr samochodu: {{ getObjectName('vehicle') }} </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="initial-color" style="margin-top: 0px">
            <b-col> </b-col>
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
                <p class="mt-4 signiture-line-top"> podpis kierowcy </p>
              </div>
            </b-col>
            <b-col class="initial-color">
              Dyspozycje wystawił <span class="signiture-line-bottom">{{ getObjectName('author') }}</span>
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
          <!-- <div class="d-print-none mt-2 mb-2">
                        <div class="text-right">
                            <a href="javascript:window.print()" class="btn btn-primary"> <i class="ri-printer-fill"></i>
                                Drukuj
                            </a>
                        </div>
                    </div> -->
        </b-card>
      </b-tab>
      <b-tab title="Karta towaru">
        <b-card style="max-width: 50%">
          <b-row class="initial-color">
            <b-col>
              <img class="img-logo" src="../../../../public/img/product-card-logo.png" />
            </b-col>
            <b-col class="right-header"> Gdynia , dnia <span class="text-bold">25.01.2023 18:21:49</span> </b-col>
          </b-row>
          <b-row class="mt-3">
            <b-col>
              <p class="initial-color">
                Peterson polska Sp. z o. o. <br />
                81-341 Gdynia , ul. Tadeusza Wendy 15/402<br />
                Regon 811118544, NIP 851-236-98-76 <br />
              </p>
            </b-col>
            <b-col>
              <h3 style="margin-top: -10px" class="text-center initial-color"
                >KARTA TOWARU <br />
                NR REFERENCYJNY PARTII / DYSPOZYCJI: 00009716</h3
              >
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3">
              <h4>Statek:</h4>
            </b-col>
            <b-col cols="3">
              <h4>STAR HARMONY</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3">
              <h4>Odbiorca:</h4>
            </b-col>
            <b-col cols="3">
              <h4></h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3">
              <h4>Samochód:</h4>
            </b-col>
            <b-col cols="3">
              <h4>GDA45643 GDA93595</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3">
              <h4>Nazwa towartu:</h4>
            </b-col>
            <b-col cols="3">
              <h4>PSZENICA ZAŁADUNEK</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3">
              <p class="initial-color">Parametry analizy jakościowej</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="8">
              <h5>Wilgotność max 14% , Białko surowe min 46% , Włókno surowe max 4% , Tłuszcz surowy max 2%</h5>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h2 class="initial-color text-bold">TOWAR WOLNY OD SALMONELLI</h2>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h4>Materiał paszowy</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h4 class="text-bold">Wyprodukowany z genetycznie zmodyfikowanej soi. </h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <p class="initial-color">Importer: Cargill Poland Sp. z o. o.</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <p class="initial-color">ul. Wołoska 22, 02-675 Warszawa, tel. 22/546 01 00</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <p class="initial-color">Nr weterynaryjny PL 1465007p</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h4>Produkt bez różnicy wartościowej z produktem tradycyjnym.</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h4>Kwituję odbiór karty towaru i zobowiązuję się do</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h4>przekazania wraz z kwitem wagowym odbiorcy towaru.</h4>
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col>
              <h4>KRAWCZYK RAFAŁ CCY472979</h4>
            </b-col>
            <b-col>
              <h4>Exchange</h4>
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col>
              <h5 class="pt-2 signiture-line-top">podpis kierowcy</h5>
            </b-col>
            <b-col>
              <h5 class="pt-2 signiture-line-top">podpis dysponenta</h5>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="d-print-none">
              <div class="text-right">
                <a href="javascript:window.print()" class="btn btn-primary">
                  <i class="ri-printer-fill"></i>
                  Drukuj
                </a>
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-tab>
    </b-tabs>
  </Layout>
</template>

<script>
import Layout from '@/layouts/main'
import { mapMutations, mapActions } from 'vuex'
import moment from 'moment'
import VueQrCode from 'qrcode.vue'

export default {
  name: 'PFDispMainAndCard',

  page: {
    title: 'Druk dyspozycji',
  },

  components: {
    Layout,
    qrcode: VueQrCode,
  },

  data() {
    return {
      viewId: this.$route.params.id,
      object: this.$route.params.object,
      qrCodeSize: 300,
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

.signiture-line-top {
  border-top: 2px #000 solid;
  max-width: 250px;
}

.signiture-line-bottom {
  border-bottom: 2px #000 solid;
}

.initial-color,
h3,
h4,
h5 {
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

.img-logo {
  width: 10vw;
}

.text-bold {
  font-weight: bold;
}

.right-header {
  text-align: right;
  align-items: center;
}

.qrcode {
  width: 400px;
  height: 400px;
}

@media print {
  .main-block {
    max-width: 100%;
  }
}
</style>