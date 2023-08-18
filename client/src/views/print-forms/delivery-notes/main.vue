<template>
  <Layout>
    <b-row>
      <b-col class="d-print-none mb-1">
        <div class="text-left">
          <a href="javascript:window.print()" class="btn btn-primary">
            <i class="ri-printer-fill"></i>
            Drukuj
          </a>
        </div>
      </b-col>
    </b-row>
    <b-card id="printItem" class="card-settings">
      <!-- <Toolbar /> -->
      <b-row>
        <b-col class="col-border">
          <b-row>
            <b-col>
              <h1 class="p-2 title">HES GDYNIA BULK TERMINAL Sp. z o.o.</h1>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div class="title">
                <div style="margin-right: 30px"> ul. Węglowa 4 </div>
                <div style="margin-left: 30px"> 81-341 Gdynia </div>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <b-row class="mt-4">
        <b-col class="col-border">
          <h4>Kwit wag. nr</h4>
        </b-col>
        <b-col class="col-border">
          <h4>Spedytor</h4>
        </b-col>
        <b-col class="col-border">
          <h4>Odbiorca</h4>
        </b-col>
        <b-col class="col-border">
          <h4>Wag. nr</h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-border">
          <h4>{{ object.numberStr }}</h4>
        </b-col>
        <b-col class="col-border">
          <h4>{{ getObjectName('forwarder') }}</h4>
        </b-col>
        <b-col class="col-border">
          <h4>{{ getObjectName('customer') }}</h4>
        </b-col>
        <b-col class="col-border">
          <h4>{{ getObjectName('scaleNetto') }}</h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-border">
          <h4>Nr zlecenia: </h4>
        </b-col>
        <b-col class="col-border"> </b-col>
        <b-col class="col-border">
          <h4>Nr Dyspozycji: {{ getObjectNumber('disposition') }}</h4>
        </b-col>
        <b-col class="col-border"> </b-col>
      </b-row>
      <b-row>
        <b-col class="col-border">
          <h4>Statek </h4>
        </b-col>
        <b-col class="col-border">
          <h4>Stanowisko</h4>
        </b-col>
        <b-col class="col-border">
          <h4>Miejsce</h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-border">
          <h4> {{ getObjectName('ship') }}</h4>
        </b-col>
        <b-col class="col-border">
          <h4> {{ getObjectName('position') }} </h4>
        </b-col>
        <b-col class="col-border">
          <h4> {{ getObjectName('warehouse') }} </h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-border">
          <h4>Sortyment </h4>
        </b-col>
        <b-col class="col-border">
          <h4>№ rej. samochodu</h4>
        </b-col>
        <b-col class="col-border">
          <h4>Dostawca</h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-border">
          <h4> </h4>
        </b-col>
        <b-col class="col-border">
          <h4>{{ getObjectName('vehicle') }}</h4>
        </b-col>
        <b-col class="col-border">
          <h4>{{ getObjectName('vendor') }}</h4>
        </b-col>
      </b-row>
      <b-row class="mt-4">
        <b-col cols="2" class="col-border">
          <h4>Data</h4>
        </b-col>
        <b-col cols="2" class="col-border">
          <h4>Godzina</h4>
        </b-col>
        <b-col cols="5" class="col-border">
          <h4>Nazwa towaru</h4>
        </b-col>
        <b-col cols="1" class="col-border">
          <h4>Waga tary</h4>
        </b-col>
        <b-col cols="1" class="col-border">
          <h4>Waga brutto</h4>
        </b-col>
        <b-col cols="1" class="col-border">
          <h4>Waga netto</h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2" class="col-border">
          <b-row>
            <b-col class="br-n bl-n bt-n bb-n col-border">
              <h4>{{ getShortDate(object.bruttoTime) }}</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="bl-n br-n bb-n col-border">
              <h4>{{ getShortDate(object.tareTime) }}</h4>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="2" class="col-border">
          <b-row>
            <b-col class="b-n col-border">
              <h4>{{ getTimeDate(object.bruttoTime) }}</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="bl-n br-n bb-n col-border">
              <h4> {{ getTimeDate(object.tareTime) }} </h4>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="5" class="col-border">
          <h4>{{ getObjectName('product') }}</h4>
        </b-col>
        <b-col cols="1" class="col-border">
          <h4>{{ object.tare }}</h4>
        </b-col>
        <b-col cols="1" class="col-border">
          <h4>{{ object.brutto }}</h4>
        </b-col>
        <b-col cols="1" class="col-border">
          <h4>{{ object.netto }}</h4>
        </b-col>
      </b-row>

      <b-row cols="6" class="mt-3">
        <b-col>
          <h4 class="color-black">Uwagi: {{ object.comment }}</h4>
        </b-col>
      </b-row>
      <b-row cols="8">
        <b-col>
          <h4 class="color-black">Kierowca: {{ getObjectName('driver') }}</h4>
        </b-col>
        <b-col>
          <b-row>
            <b-col class="color-black">
              <h4>Wydano / Przyjęto towar bez zaniczyszczeń</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="color-black mt-4" style="border-top: 1px black solid"> Podis kierowcy </b-col>
          </b-row>
        </b-col>
        <b-col class="ml-5">
          <b-row>
            <b-col class="color-black">
              <h4
                >Waga brutto: <span>{{ object.brutto }}</span></h4
              >
            </b-col>
          </b-row>
          <b-row>
            <b-col class="color-black">
              <h4
                >Waga tara: <span>{{ object.tare }}</span></h4
              >
            </b-col>
          </b-row>
        </b-col>
        <b-col>
          <b-row>
            <b-col class="color-black">
              <h4>Administrator: <span></span></h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="color-black">
              <h4>Waga samoobsługowa: <span></span></h4>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="mt-5">
        <b-col cols="6">
          <p class="color-black">
            */ Kierowca oświadcza, że samochód został załadowany zgodnie z wymogami par. 3.1 Rozp. Min. Infrastruktury z dn 31 grudnia 2002r. Tekst jedn. Dz.U. 2016 poz. 2022 z
            późniejszymi zmianami (Dz.U. 2017 poz. 2338 i Dz.U. 2019 poz. 2560).
          </p>
        </b-col>
        <b-col> </b-col>
      </b-row>
    </b-card>
  </Layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'
import Layout from '@/layouts/main'
import Toolbar from '@/components/print-forms/toolbar.vue'

export default {
  name: 'PFDNMain',

  page: {
    title: 'Druk list przwozowych',
  },

  components: {
    Layout,
    // Toolbar,
  },

  data() {
    return {
      viewId: null,
    }
  },

  async created() {
    this.viewId = this.$route.params.id
    this.initialize()
  },

  computed: {
    ...mapGetters({
      getObjectView: 'printForms/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    id: {
      get() {
        return this.objectView ? this.objectView.object.id : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'id', value })
      },
    },

    routeOwner: {
      get() {
        return this.objectView ? this.objectView.object.routeOwner : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'routeOwner', value })
      },
    },

    isPrintAndClosed: {
      get() {
        return this.objectView ? this.objectView.object.isPrintAndClosed : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'isPrintAndClosed', value })
      },
    },
  },

  methods: {
    ...mapMutations({
      addObjectView: `printForms/addObjectView`,
      delObjectView: 'printForms/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async initialize() {
      console.log('object of delivery notes: ', this.object)
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

    getObjectNumber(propertyName) {
      let currentName = ''
      if (this.object) {
        if (this.object[propertyName]) {
          currentName = this.object[propertyName].number
        }
      }
      return currentName
    },

    convertDate(dateValue) {
      const convertedDate = moment(dateValue).format('DD MM YYYY hh:mm:ss')
      return convertedDate
    },

    getShortDate(dateValue) {
      const convertedDate = moment(dateValue).format('DD MM YYYY')
      return convertedDate
    },

    getTimeDate(dateValue) {
      const convertedDate = moment(dateValue).format('hh:mm:ss')
      return convertedDate
    },
  },
}
</script>

<style scoped>
.title {
  display: flex;
  justify-content: center;
  text-align: center;
}
/* 
.border-box {
    border: 1px #000 solid;
} */

.col-border {
  border: 1px #000 solid;
  min-height: 50px;
}

.full-width {
  min-width: 80vw;
}

.bl-n {
  border-left: none;
}

.br-n {
  border-right: none;
}

.bt-n {
  border-top: none;
}

.bb-n {
  border-bottom: none;
}

.b-n {
  border: none;
}

.color-black {
  color: black;
  font-weight: bolder;
}

h4 {
  color: black;
  font-weight: bolder;
}

.card-settings {
  max-width: 75%;
}

@media print {
  .card-settings {
    max-width: 100%;
  }
}
</style>