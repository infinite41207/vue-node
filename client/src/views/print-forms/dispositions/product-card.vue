<template>
  <Layout>
    <b-card class="print-area main-block">
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
  </Layout>
</template>

<script>
import Layout from '@/layouts/main'
import { mapMutations, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'PFDispProductCard',

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

@media print {
  .main-block {
    max-width: 100%;
  }
}
</style>