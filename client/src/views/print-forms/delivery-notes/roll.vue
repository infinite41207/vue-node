<template>
  <Layout>
    <!-- <PageHeader :title="title" /> -->
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
        <b-col>
          <b-row>
            <b-col>
              <h1 class="p-2 title" style="font-size: xx-large">HES GDYNIA BULK TERMINAL Sp. z o.o.</h1>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div class="title">
                <div style="margin-right: 30px; font-size: larger"> ul. Węglowa 4 </div>
                <div style="margin-left: 30px; font-size: larger"> 81-341 Gdynia </div>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <b-row class="mt-4">
        <b-col class="bb-n col-border">
          <h4>Kwit wag. nr</h4>
        </b-col>
        <b-col class="bb-n col-border">
          <h4>Spedytor</h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="bt-n col-border">
          <h4>{{ object.numberStr }}</h4>
        </b-col>
        <b-col class="bt-n col-border">
          <h4>{{ getObjectName('forwarder') }}</h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="bb-n col-border">
          <h4>Odbiorca</h4>
        </b-col>
        <b-col class="bb-n col-border">
          <h4>Wag. nr</h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="bt-n col-border">
          <h4>{{ getObjectName('customer') }}</h4>
        </b-col>
        <b-col class="bt-n col-border">
          <h4>{{ getObjectName('scaleNetto') }}</h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-border">
          <b-row>
            <b-col>
              <h4>Nr zlecenia: </h4>
            </b-col>
            <b-col class="bt-n col-border">
              <h4>{{ deliveryOrder.numberStr }}</h4>
            </b-col>
          </b-row>
        </b-col>
        <b-col class="col-border">
          <b-row>
            <b-col>
              <h4>Nr Dyspozycji: </h4>
            </b-col>
            <b-col>
              <h4>{{ getObjectNumber('disposition') }}</h4>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-border">
          <b-row>
            <b-col>
              <h4>Statek </h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h3> {{ getObjectName('ship') }}</h3>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-border">
          <b-row>
            <b-col>
              <h4>Stanowisko</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h3> {{ getObjectName('position') }} </h3>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-border">
          <b-row>
            <b-col>
              <h4>Miejsce</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h3> {{ getObjectName('warehouse') }} </h3>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-border">
          <b-row>
            <b-col>
              <h4>Sortyment</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h3></h3>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-border">
          <b-row>
            <b-col>
              <h4>№ rej. samochodu</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h3> {{ getObjectName('vehicle') }} </h3>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-border">
          <b-row>
            <b-col>
              <h4>Dostawca</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h3> {{ getObjectName('vendor') }} </h3>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="col-border">
          <h4>Data</h4>
        </b-col>
        <b-col class="col-border">
          <h4>Godzina</h4>
        </b-col>
        <b-col class="col-border">
          <h4>Nazwa towaru</h4>
        </b-col>
        <!-- <b-col cols="1" class="col-border">
                            <h4>Waga tary</h4>
                        </b-col>
                        <b-col cols="1" class="col-border">
                            <h4>Waga brutto</h4>
                        </b-col>
                        <b-col cols="1" class="col-border">
                            <h4>Waga netto</h4>
                        </b-col> -->
      </b-row>
      <b-row>
        <b-col class="col-border">
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
        <b-col class="col-border">
          <b-row>
            <b-col class="b-n col-border">
              <h4>{{ getTimeDate(object.bruttoTime) }}</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="br-n bl-n bb-n col-border">
              <h4> {{ getTimeDate(object.tareTime) }} </h4>
            </b-col>
          </b-row>
        </b-col>
        <b-col class="col-border">
          <h4>{{ getObjectName('product') }}</h4>
        </b-col>
        <!-- <b-col cols="1" class="col-border">
                            <h4>{{ object.tare }}</h4>
                        </b-col>
                        <b-col cols="1" class="col-border">
                            <h4>{{ object.brutto }}</h4>
                        </b-col>
                        <b-col cols="1" class="col-border">
                            <h4>{{ object.netto }}</h4>
                        </b-col> -->
      </b-row>
      <div v-if="isBunker === false">
        <b-row>
          <b-col class="col-border">
            <h4>Waga tary</h4>
          </b-col>
          <b-col class="col-border">
            <h4>Waga brutto</h4>
          </b-col>
          <b-col class="col-border">
            <h4>Waga netto</h4>
          </b-col>
        </b-row>
        <b-row align="right">
          <b-col class="col-border">
            <h4>{{ object.tare }}</h4>
          </b-col>
          <b-col class="col-border">
            <h4>{{ object.brutto }}</h4>
          </b-col>
          <b-col class="col-border">
            <h4>{{ object.netto }}</h4>
          </b-col>
        </b-row>
      </div>
      <div v-if="isBunker === true">
        <b-row>
          <b-col class="col-border">
            <h4>Waga netto</h4>
          </b-col>
          <b-col align="right" class="col-border">
            <h4>{{ object.netto }}</h4>
          </b-col>
        </b-row>
      </div>

      <b-row class="mt-3" cols="8">
        <b-row>
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
        </b-row>
      </b-row>
      <b-row>
        <b-col class="color-black">
          <h4
            >Wagowy brutto: <span>{{ getObjectName('bruttoAuthor') }}</span></h4
          >
        </b-col>
      </b-row>
      <b-row>
        <b-col class="color-black">
          <h4
            >Wagowy tara: <span>{{ getObjectName('tareAuthor') }}</span></h4
          >
        </b-col>
      </b-row>
      <b-row class="mt-4">
        <b-col>
          <p class="color-black">
            */ Kierowca oświadcza, że samochód został załadowany zgodnie z wymogami par. 3.1 Rozp. Min. Infrastruktury z dn 31 grudnia 2002r. Tekst jedn. Dz.U. 2016 poz. 2022 z
            późniejszymi zmianami (Dz.U. 2017 poz. 2338 i Dz.U. 2019 poz. 2560).
          </p>
        </b-col>
      </b-row>
    </b-card>
  </Layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import PageHeader from '@/components/page-header.vue'
import moment from 'moment'
import Layout from '@/layouts/main'

export default {
  name: 'rollDN',
  title: 'List rolkowy',

  page: {
    // title: 'Druk list przwozowych',
  },

  components: {
    Layout,
    // PageHeader,
  },

  data() {
    return {
      viewId: null,
      deliveryOrder: { numberStr: '' },
      isBunker: false,
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
      if (this.object && this.object.disposition) {
        const response = await this.$store.dispatch('dispositions/findByPk', {
          params: {
            id: this.object.disposition.id,
          },
          noCommit: true,
        })
        if (response.status === 200) {
          this.deliveryOrder = response.data.order
          if (response.data.weighingStation) {
            this.isBunker = true
          }
        }
      }
      if (process.env.IS_ELECTRON) {
        if (this.isPrintAndClosed && this.isPrintAndClosed === true) {
          const paramsForPrint = await this.getClientIdSerial()
          const printRes = await window.ipcRenderer.invoke('printPage', { text: 'info', paramsForPrint })
          this.$destroy()
          this.delTagView({ name: this.$route.name, path: this.$route.path })
          this.delObjectView(this.viewId)
          await this.$router.push({ name: this.routeOwner })
        }
      }
    },

    async getClientIdSerial() {
      //find current working place
      const clientIdSerial = await window.ipcRenderer.invoke('getSerialIdClient', '')
      //const clientIdSerial = "5358def1fa367ad021760510ac56bb00089a01fdbe521c83eb100f08e41f54ed"
      const response = await this.$store.dispatch('workingPlaces/findAll', {
        params: {
          filter: {
            clientIdSerial: clientIdSerial,
          },
        },
      })
      if (response.data[0] && response.status === 200) {
        return {
          pageSize: response.data[0].pageSize,
          orientation: response.data[0].orientation,
          numberOfCopies: response.data[0].numberOfCopies,
          printerName: response.data[0].printerName || null,
        }
      } else {
        return {
          pageSize: null,
          orientation: null,
          numberOfCopies: null,
          printerName: null,
        }
      }
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
          currentName = this.object[propertyName].numberStr
          if (currentName === '') {
            currentName = this.object[propertyName].number
          }
        }
      }
      return currentName
    },

    convertDate(dateValue) {
      if (!dateValue) return ''
      const convertedDate = moment(dateValue).format('DD MM YYYY hh:mm:ss')
      return convertedDate
    },

    getShortDate(dateValue) {
      if (!dateValue) return ''
      const convertedDate = moment(dateValue).format('DD MM YYYY')
      return convertedDate
    },

    getTimeDate(dateValue) {
      if (!dateValue) return ''
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

h4,
h3 {
  color: black;
  font-weight: bolder;
}

.card-settings {
  max-width: 30%;
}

@media print {
  .card-settings {
    margin-left: 10%;
    max-width: 80%;
  }

  p {
    font-size: larger;
  }

  h4 {
    font-size: x-large;
  }
}
</style>