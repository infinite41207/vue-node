<template>
  <Layout>
    <PageHeader :title="title" />
    <b-card>
      <b-row class="mb-3">
        <b-col>
          <b-button-toolbar>
            <b-btn-group>
              <b-button variant="success" :disabled="readOnly" class="btn-sm" @click="writeObject">
                <i class="ri-save-2-fill"></i>
                {{ $t('commands.writeAndClose') }}
              </b-button>
              <b-button variant="outline-secondary" class="btn-sm ml-1" @click="closeView">
                <i class="ri-close-line"></i>
                {{ $t('commands.close') }}
              </b-button>
              <b-button variant="outline-secondary" class="btn-sm ml-1" @click="getComputerID">
                <i class="ri-close-line"></i>
                {{ $t('commands.getComputerID') }}
              </b-button>
              <b-button v-if="modeElectron" variant="outline-success" class="btn-sm ml-1" v-b-modal.modal-xl @click="getInfoEquipment">
                {{ $t('commands.getInfoEquipment') }}
              </b-button>
              <b-button v-if="modeElectron" variant="outline-secondary" class="btn-sm ml-1" @click="printTest">
                <i class="ri-close-line"></i>
                PrintTest
              </b-button>
            </b-btn-group>
          </b-button-toolbar>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col cols="8" class="checkbox-box">
          <div class="fixed-w mr-3">{{ $t('table.code') }}</div>
          <b-form-input v-model="code" size="sm" class="ml-5"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col cols="8" class="checkbox-box">
          <div class="fixed-w mr-3">{{ $t('table.name') }}</div>
          <b-form-input class="ml-5" size="sm" v-model="name"></b-form-input>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-row>
            <b-col cols="9">
              <b-form-group label-cols="2" content-cols="6" :label="$t('table.description')" label-for="input-default">
                <b-form-input id="input-default" type="text" v-model="description" size="sm"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="9">
              <b-form-group label-cols="2" :label="$t('table.clientId')" label-for="input-default">
                <b-form-input id="input-default" type="text" v-model="clientIdSerial" size="sm"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="6">
              <b-form-group label-cols="3" :label="$t('table.computerName')" label-for="input-default">
                <b-form-input id="input-default" type="text" v-model="computerName" size="sm"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col offset-md="3">
              <b-form-group label-cols="4" :label="$t('table.networkPort')" label-for="input-default">
                <b-form-input id="input-default" type="number" v-model="networkPort" size="sm"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="9">
              <b-form-group horizontal :label-cols="2" :label="$t('table.weighingStation')">
                <f-select v-model="weighingStation" select-btn open-btn value-type="weighingStations" detail-view="detail" size="sm" placeholder="Wyszukaj stanowisko wagowe...">
                </f-select>
              </b-form-group>

              <b-form-group horizontal :label-cols="2" :label="$t('table.scale')">
                <f-select v-model="scale" select-btn open-btn value-type="scales" detail-view="detail" size="sm" placeholder="Wyszukaj wagę..."></f-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="6">
              <b-row>
                <b-col>
                  <b-row class="my-3">
                    <b-row class="mr-2 ml-2">{{ $t('table.prohibitionWorkSeveralSessions') }}</b-row>
                    <b-form-checkbox class="ml-1" v-bind:value="true" v-model="desibleWorkingInSeveralSessions" switch></b-form-checkbox>
                  </b-row>
                </b-col>
                <b-col>
                  <b-row class="my-3">
                    <b-row class="mr-2 ml-2">{{ $t('table.issuanceRailwayInstructions') }}</b-row>
                    <b-form-checkbox class="ml-1" v-bind:value="true" v-model="raisingRailwayDisposition" switch></b-form-checkbox>
                  </b-row>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3">
              <b-form-group horizontal :label-cols="4" :label="$t('table.desktopMode')" label-for="item-desktop-mode">
                <b-form-checkbox id="item-desktop-mode" v-model="desktopMode" switch name="item-desktop-mode" class="mt-1"></b-form-checkbox>
              </b-form-group>
            </b-col>
            <b-col cols="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.desktopName')" label-for="item-desktop-name">
                <b-form-input id="item-desktop-name" v-model="desktopName" name="item-desktop-name" size="sm" />
              </b-form-group>
            </b-col>
          </b-row>
          <h3 text-success>Ustawienia domyślne drukarki</h3>
          <b-row>
            <b-col cols="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.printerName')" label-for="item-printer-name">
                <b-form-input id="item-printer-name" v-model="printerName" name="item-printer-name" size="sm" />
              </b-form-group>
            </b-col>
            <b-col cols="3" v-if="modeElectron">
              <div>
                <b-button variant="outline-secondary" class="btn-sm ml-1" v-b-modal.printerList-1>{{ $t('table.printerList') }}</b-button>
                <b-modal id="printerList-1" title="List printers">
                  <b-list-group>
                    <div v-for="(item, index) in listPrinters" :key="item.name">
                      <div v-if="item.default">
                        <b-list-group-item variant="success"> {{ index + 1 }}. {{ item.name }} </b-list-group-item>
                      </div>
                      <div v-else>
                        <b-list-group-item> {{ index + 1 }}. {{ item.name }} </b-list-group-item>
                      </div>
                    </div>
                  </b-list-group>
                </b-modal>
              </div>
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col cols="2">
              <b-form-group label-cols="4" :label="$t('table.numberCopies')" label-for="input-default">
                <b-form-input id="input-default" type="number" v-model="numberOfCopies" size="sm" min="1"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="3">
              <b-form-group label-cols="3" :label="$t('table.orientation')" label-for="input-default">
                <b-form-select id="input-default" v-model="orientation" :options="optionsOptions" size="sm"></b-form-select>
              </b-form-group>
            </b-col>
            <b-col cols="3" md="2">
              <b-form-group label-cols="4" content-cols="8" :label="$t('table.size')" label-for="input-default">
                <b-form-input id="input-default" type="text" v-model="pageSize" size="sm" placeholder="A4, A5, Legal, Letter"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="3">
              <b-row class="my-1">
                <b-row class="mr-2 ml-2">{{ $t('table.rollPrinter') }}</b-row>
                <b-form-checkbox class="ml-1" v-bind:value="true" v-model="isRollPrinter" size="sm" switch></b-form-checkbox>
              </b-row>
            </b-col>
          </b-row>

          <!-- <b-row>
            <b-col cols="6">
              <b-row class="my-3">
                <b-row class="mr-2 ml-2">Drukarki rolkowa:</b-row>
                <b-form-checkbox class="ml-1" v-bind:value="true" v-model="isRollPrinter" size="sm" switch> </b-form-checkbox>
              </b-row>
            </b-col>
          </b-row> -->

          <b-row>
            <b-col>
              <b-form-group label="Lokalna instalacja:" label-for="input-default">
                <b-form-textarea id="input-default" v-model="localInstallation" size="sm"></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>

    <!-- My form     -->
    <EquipmentList v-model="openModal" :devices="objectView.object"> </EquipmentList>
  </Layout>
</template>


<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import EquipmentList from './equipment-list'

export default {
  name: 'WorkingPlacesDetail',

  page() {
    return { title: this.$t('common.shipData'), meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: { Layout, PageHeader, EquipmentList },

  async created() {
    console.log('this', this)
    console.log('this.objectView: ', this.objectView.object)
    if (this.modeElectron) {
      await this.getPrinterList()
    }
  },

  data() {
    return {
      title: 'Miejsca pracy',
      viewId: this.$route.params.id,
      optionsOptions: [
        { value: 'Portrait', text: 'Portrait' },
        { value: 'Landscape', text: 'Landscape' },
      ],
      readOnly: this.$route.meta.isReadOnly,
      openModal: false,
      modeElectron: process.env.IS_ELECTRON ? true : false,
      listPrinters: [],
      protocolFromScale: null,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'workingPlaces/objectView',
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
    name: {
      get() {
        return this.objectView ? this.objectView.object.name : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'name', value })
      },
    },
    code: {
      get() {
        return this.objectView ? this.objectView.object.code : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'code', value })
      },
    },
    computerName: {
      get() {
        return this.objectView ? this.objectView.object.computerName : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'computerName', value })
      },
    },
    description: {
      get() {
        return this.objectView ? this.objectView.object.description : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'description', value })
      },
    },
    namePc: {
      get() {
        return this.objectView ? this.objectView.object.namePc : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'namePc', value })
      },
    },
    weighingStation: {
      get() {
        return this.objectView ? this.objectView.object.weighingStation : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'weighingStation', value })
      },
    },
    scale: {
      get() {
        return this.objectView ? this.objectView.object.scale : {}
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'scale', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'scaleId', value: value.id })
      },
    },
    networkPort: {
      get() {
        return this.objectView ? this.objectView.object.networkPort : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'networkPort', value })
      },
    },
    orientation: {
      get() {
        return this.objectView ? this.objectView.object.orientation : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'orientation', value })
      },
    },
    desibleWorkingInSeveralSessions: {
      get() {
        return this.objectView ? this.objectView.object.desibleWorkingInSeveralSessions : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'desibleWorkingInSeveralSessions', value })
      },
    },
    raisingRailwayDisposition: {
      get() {
        return this.objectView ? this.objectView.object.raisingRailwayDisposition : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'raisingRailwayDisposition', value })
      },
    },
    numberOfCopies: {
      get() {
        return this.objectView ? this.objectView.object.numberOfCopies : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'numberOfCopies', value })
      },
    },
    pageSize: {
      get() {
        return this.objectView ? this.objectView.object.pageSize : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'pageSize', value })
      },
    },
    isRollPrinter: {
      get() {
        return this.objectView ? this.objectView.object.isRollPrinter : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'isRollPrinter', value })
      },
    },
    localInstallation: {
      get() {
        return this.objectView ? this.objectView.object.localInstallation : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'localInstallation', value })
      },
    },
    clientIdSerial: {
      get() {
        return this.objectView ? this.objectView.object.clientIdSerial : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'clientIdSerial', value })
      },
    },
    desktopMode: {
      get() {
        return this.objectView ? this.objectView.object.desktopMode : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'desktopMode', value })
      },
    },
    desktopName: {
      get() {
        return this.objectView ? this.objectView.object.desktopName : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'desktopName', value })
      },
    },
    printerName: {
      get() {
        return this.objectView ? this.objectView.object.printerName : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'printerName', value })
      },
    },
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'workingPlaces/setObjectViewProperty',
      setObjectProperty: 'workingPlaces/setObjectProperty',
      delObjectView: 'workingPlaces/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async writeObject() {
      let response
      if (this.object.isNew) {
        response = await this.$store.dispatch('workingPlaces/create', this.object)
      } else {
        response = await this.$store.dispatch('workingPlaces/update', this.object)
      }

      if (response.status === 200) {
        this.$router.push({ name: 'working-places' })
        this.closeView()
      }
    },
    async getComputerID() {
      // eslint-disable-next-line
      const self = this
      window.ipcRenderer.send('getMachineId', 'getId')
      window.ipcRenderer.on('reply', (event, data) => {
        self.clientIdSerial = data
      })
    },
    async printTest() {
      // eslint-disable-next-line
      const printTest = await window.ipcRenderer.invoke('prtintTest', '')
      console.log('printTest', printTest)
    },
    async getInfoEquipment() {
      this.openModal = true
    },
    async getPrinterList() {
      if (this.modeElectron) {
        const listPrinter = await window.ipcRenderer.invoke('printList', '')
        if (listPrinter.length) {
          for (const el of listPrinter) {
            this.listPrinters.push({ name: el.name, default: el.isDefault })
          }
        }
        console.log('this.listPrinters', this.listPrinters)
      }
    },
    async closeView() {
      this.$destroy()
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)
      await this.$router.push({ name: 'working-places' })
    },
  },
}
</script>

<style>
.checkbox-box {
  display: flex;
  align-items: center;
}

.fixed-w {
  width: 100px;
}

.long-table {
  width: 80vw;
}
</style>
