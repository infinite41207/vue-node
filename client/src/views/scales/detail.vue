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
            </b-btn-group>
          </b-button-toolbar>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col cols="8" class="checkbox-box">
          <div class="fixed-w">{{ $t('table.code') }}</div> <b-form-input id="item-code" v-model="code" size="sm" class="ml-2"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col cols="8" class="checkbox-box">
          <div class="fixed-w">{{ $t('table.name') }}</div> <b-form-input id="item-name" size="sm" v-model="name" class="ml-2"></b-form-input>
        </b-col>
      </b-row>

      <!-- My form -->
      <b-row class="p-1">
        <b-col>
          <b-tabs card>
            <b-tab :title="$t('table.base')" active>
              <b-row>
                <b-col cols="6">
                  <b-form-group label-cols="3" label="Mechaniczne:" label-for="input-default">
                    <b-row class="mt-1">
                      <b-col><b-form-checkbox id="mechanicalScales" v-bind:value="true" v-model="mechanicalScales"> </b-form-checkbox></b-col>
                      <b-col><b-form-checkbox v-bind:value="true" v-model="emulationsScales"> Emulacje:</b-form-checkbox></b-col>
                      <b-col><b-form-checkbox v-bind:value="true" v-model="iot"> IoT:</b-form-checkbox></b-col>
                    </b-row>
                  </b-form-group>

                  <b-form-group label-cols="3" label="Rodzaje wag:" label-for="scyleTypeOptions">
                    <b-form-select id="scyleTypeOptions" v-model="scalesType" :options="scyleTypeOptions"> </b-form-select>
                  </b-form-group>

                  <b-form-group label-cols="3" label="Typ dokumentu:" label-for="typeOfDocumentOptions">
                    <b-form-select id="typeOfDocumentOptions" v-model="typeOfDocument" :options="typeOfDocumentOptions"> </b-form-select>
                  </b-form-group>

                  <b-form-group horizontal :label-cols="3" :label="$t('table.weighingStation')">
                    <f-select v-model="weighingStation" select-btn open-btn value-type="weighingStations" detail-view="detail" placeholder="Wyszukaj stanowisko wagowe...">
                    </f-select>
                  </b-form-group>

                  <b-form-group label-cols="3" label="Współczynnik:" label-for="Factor">
                    <b-form-input id="Factor" type="number"> </b-form-input>
                  </b-form-group>

                  <b-form-group label-cols="3" label="Odchylenie:" label-for="Deviation">
                    <b-form-input id="Deviation" type="number"> </b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="6">
                  <b-form-group label-cols="3" label="Użyj stabilność:" label-for="input-default">
                    <b-form-checkbox class="mt-1" v-bind:value="true" v-model="stabilityUse"> </b-form-checkbox>
                  </b-form-group>

                  <b-form-group label-cols="3" label="Numer wag:" label-for="scalesNumber">
                    <b-form-input id="scalesNumber" type="number" v-model="scalesNumber"> </b-form-input>
                  </b-form-group>

                  <b-form-group label-cols="3" label="Wersja wagy:" label-for="scalesVersion">
                    <b-form-input id="scalesVersion" type="number" v-model="scalesVersion"> </b-form-input>
                  </b-form-group>

                  <b-form-group label-cols="3" :label="$t('table.address')" label-for="address">
                    <b-form-input id="address" type="text" v-model="address"> </b-form-input>
                  </b-form-group>

                  <b-form-group label-cols="3" :label="$t('table.port')" label-for="port">
                    <b-form-input id="port" type="number" v-model="port"> </b-form-input>
                  </b-form-group>

                  <b-form-group label-cols="3" label="Okres odnowienia:" label-for="updatePeriod">
                    <b-form-input id="updatePeriod" type="number" v-model="updatePeriod"> </b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab :title="$t('table.videoRecorder')">
              <b-row>
                <b-row class="mr-2 ml-2">{{ $t('table.usingVideoRecorder') }} </b-row>
                <b-form-checkbox v-bind:value="true" v-model="useVideoRecorder"> </b-form-checkbox>
              </b-row>
              <b-row class="mt-2">
                <b-col cols="6">
                  <b-form-group label-cols="3" :label="$t('table.server')" label-for="videoRecorderServer">
                    <b-form-input id="videoRecorderServer" type="text" v-model="videoRecorderServer" :disabled="useVideoRecorder ? false : true"> </b-form-input>
                  </b-form-group>
                </b-col>

                <b-col>
                  <b-form-group label-cols="3" :label="$t('table.port')" label-for="videoRecorderPort">
                    <b-form-input id="videoRecorderPort" type="text" v-model="videoRecorderPort" :disabled="useVideoRecorder ? false : true"> </b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>

              <b-row class="mt-2">
                <b-col cols="6">
                  <b-form-group label-cols="3" :label="$t('table.user')" label-for="videoRecorderUser">
                    <b-form-input id="videoRecorderUser" type="text" v-model="videoRecorderUser" :disabled="useVideoRecorder ? false : true"> </b-form-input>
                  </b-form-group>
                </b-col>

                <b-col>
                  <b-form-group label-cols="3" :label="$t('table.password')" label-for="videoRecorderPassword">
                    <b-form-input id="videoRecorderPassword" type="password" v-model="videoRecorderPassword" :disabled="useVideoRecorder ? false : true"> </b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>

              <b-row class="mt-2">
                <b-col cols="6">
                  <b-form-group label-cols="3" label="Droga do pliky:" label-for="VideoRecorderPathToFile">
                    <b-form-input id="VideoRecorderPathToFile" type="text" v-model="videoRecorderPathToFile" :disabled="useVideoRecorder ? false : true"> </b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>

              <b-row class="mt-2">
                <b-col cols="7">
                  <b-form-group :label="$t('table.inquiry')" label-for="VideoRecorderRequest">
                    <b-form-textarea id="VideoRecorderRequest" :disabled="useVideoRecorder ? false : true"> </b-form-textarea>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab title="Parametry bramy Iot" :disabled="iot ? false : true">
              <b-row>
                <b-col cols="8">
                  <b-form-group label-cols="3" label="Serwer:" label-for="gatewayServer">
                    <b-form-input id="gatewayServer" type="text" v-model="gatewayServer"> </b-form-input>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label-cols="3" label="Port:" label-for="gatewayPort">
                    <b-form-input id="gatewayPort" type="number" v-model="gatewayPort"> </b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row
                ><b-col cols="8">
                  <b-form-group label-cols="3" label="Login:" label-for="gatewayLogin">
                    <b-form-input id="gatewayLogin" type="text" v-model="gatewayLogin"> </b-form-input>
                  </b-form-group> </b-col
              ></b-row>
              <b-row
                ><b-col cols="8">
                  <b-form-group label-cols="3" label="HASŁO:" label-for="gatewayPassword">
                    <b-form-input id="gatewayPassword" type="password" v-model="gatewayPassword"> </b-form-input>
                  </b-form-group> </b-col
              ></b-row>
              <b-row
                ><b-col cols="8">
                  <b-form-group label-cols="3" label="Zasób:" label-for="gatewayResource">
                    <b-form-input id="gatewayResource" type="text" v-model="gatewayResource"> </b-form-input>
                  </b-form-group> </b-col
              ></b-row>
            </b-tab>
            <b-tab title="Tablica świetlne">
              <b-row class="my-3">
                <b-row class="mr-2 ml-2">Wynik na tablice świetlna:</b-row>
                <b-form-checkbox class="ml-1" v-bind:value="true" v-model="scoreLightBoard"> </b-form-checkbox>
              </b-row>

              <b-row class="mt-2">
                <b-col cols="5">
                  <b-form-group label-cols="4" label="Numer tablice świetlna:" label-for="lightBoardNumber">
                    <b-form-input id="lightBoardNumber" type="number" v-model="lightBoardNumber" :disabled="scoreLightBoard ? false : true"> </b-form-input>
                  </b-form-group> </b-col
              ></b-row>

              <b-row class="mt-2">
                <b-col cols="5">
                  <b-form-group label-cols="4" label="Port tablice świetlna:" label-for="DisplayPort">
                    <b-form-input id="DisplayPort" type="number" v-model="portBoardNumber" :disabled="scoreLightBoard ? false : true"> </b-form-input>
                  </b-form-group> </b-col
              ></b-row>
            </b-tab>
            <b-tab title="Dodatkowo">
              <b-row class="mt-1">
                <b-col cols="6">
                  <b-form-group label-cols="3" label="Zewnętrzne zródło:" label-for="RegistrAdress">
                    <b-form-input id="RegistrAdress" type="number" v-model="externalSource"> </b-form-input>
                  </b-form-group> </b-col
              ></b-row>

              <b-row class="mt-1">
                <b-col cols="3">
                  <b-row class="my-3">
                    <b-row class="mr-2 ml-2">Blokuj interfejs samoobsługowy:</b-row>
                    <b-form-checkbox class="ml-4" v-bind:value="true" v-model="blockSelfServiceInterface"> </b-form-checkbox>
                  </b-row>
                </b-col>
              </b-row>
            </b-tab>

            <b-tab :title="$t('table.ptotocols')">
              <b-col cols="6">
                <b-form-group horizontal :label-cols="2" :label="$t('table.scaleProtocol')">
                  <f-select v-model="scaleProtocol" select-btn open-btn value-type="scaleProtocols" detail-view="detail" size="sm" placeholder="Protokół wagi ..."> </f-select>
                </b-form-group>
              </b-col>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-card>
  </Layout>
</template>


<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'ScalesDetail',

  page() {
    return { title: this.$t('route.scale'), meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: { Layout, PageHeader },

  data() {
    return {
      title: this.$t('route.scale'),
      viewId: this.$route.params.id,
      scyleTypeOptions: [
        { value: 'Brutto', text: 'Brutto' },
        { value: 'Tara', text: 'Tara' },
        { value: 'GrossAndTara', text: 'Brutto i tara' },
        { value: 'Zasypowa', text: 'Zasypowa' },
        { value: 'WithoutWeighing', text: 'Bez wazenia' },
        { value: 'Bunker', text: 'Bunker' },
      ],
      typeOfDocumentOptions: [
        { value: 'Samochodowy', text: 'Samochodowy' },
        { value: 'Kolejowy', text: 'Kolejowy' },
        { value: 'Wodny', text: 'Wodny' },
        { value: 'Wewnętrzny', text: 'Wewnętrzny' },
        { value: 'Bez wazenia', text: 'Brutto' },
        { value: 'Samochodowy lub kolejowy', text: 'Samochodowy lub kolejowy' },
        { value: 'Automobile', text: 'Automobile' },
      ],
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  watch: {
    iot() {
      console.log(this.iot)
    },
    scaleProtocol() {
      console.log('scaleProtocol', this.scaleProtocol)
    },
    weighingStation() {
      //console.log('weighingStation:', this.weighingStation)
    },
  },

  computed: {
    ...mapGetters({
      getObjectView: 'scales/objectView',
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
    code: {
      get() {
        return this.objectView ? this.objectView.object.code : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'code', value })
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
    mechanicalScales: {
      get() {
        return this.objectView ? this.objectView.object.mechanicalScales : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'mechanicalScales', value })
      },
    },
    emulationsScales: {
      get() {
        return this.objectView ? this.objectView.object.emulations : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'emulations', value })
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
    port: {
      get() {
        return this.objectView ? this.objectView.object.port : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'port', value })
      },
    },
    address: {
      get() {
        return this.objectView ? this.objectView.object.address : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'address', value })
      },
    },
    scalesVersion: {
      get() {
        return this.objectView ? this.objectView.object.scalesVersion : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'scalesVersion', value })
      },
    },
    scalesNumber: {
      get() {
        return this.objectView ? this.objectView.object.scalesNumber : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'scalesNumber', value })
      },
    },
    updatePeriod: {
      get() {
        return this.objectView ? this.objectView.object.updatePeriod : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'updatePeriod', value })
      },
    },
    iot: {
      get() {
        return this.objectView ? this.objectView.object.iot : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'iot', value })
      },
    },
    scalesType: {
      get() {
        return this.objectView ? this.objectView.object.scalesType : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'scalesType', value })
      },
    },
    typeOfDocument: {
      get() {
        return this.objectView ? this.objectView.object.typeOfDocument : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'typeOfDocument', value })
      },
    },
    stabilityUse: {
      get() {
        return this.objectView ? this.objectView.object.stabilityUse : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'stabilityUse', value })
      },
    },
    useVideoRecorder: {
      get() {
        return this.objectView ? this.objectView.object.useVideoRecorder : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'useVideoRecorder', value })
      },
    },
    videoRecorderPassword: {
      get() {
        return this.objectView ? this.objectView.object.videoRecorderPassword : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'videoRecorderPassword', value })
      },
    },
    videoRecorderPort: {
      get() {
        return this.objectView ? this.objectView.object.videoRecorderPort : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'videoRecorderPort', value })
      },
    },
    videoRecorderUser: {
      get() {
        return this.objectView ? this.objectView.object.videoRecorderUser : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'videoRecorderUser', value })
      },
    },
    videoRecorderServer: {
      get() {
        return this.objectView ? this.objectView.object.videoRecorderServer : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'videoRecorderServer', value })
      },
    },
    videoRecorderPathToFile: {
      get() {
        return this.objectView ? this.objectView.object.videoRecorderPathToFile : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'videoRecorderPathToFile', value })
      },
    },
    gatewayLogin: {
      get() {
        return this.objectView ? this.objectView.object.gatewayLogin : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'gatewayLogin', value })
      },
    },
    gatewayPassword: {
      get() {
        return this.objectView ? this.objectView.object.gatewayPassword : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'gatewayPassword', value })
      },
    },
    gatewayPort: {
      get() {
        return this.objectView ? this.objectView.object.gatewayPort : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'gatewayPort', value })
      },
    },
    gatewayResource: {
      get() {
        return this.objectView ? this.objectView.object.gatewayResource : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'gatewayResource', value })
      },
    },
    gatewayServer: {
      get() {
        return this.objectView ? this.objectView.object.gatewayServer : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'gatewayServer', value })
      },
    },
    scoreLightBoard: {
      get() {
        return this.objectView && this.objectView.object.scoreLightBoard ? this.objectView.object.scoreLightBoard : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'scoreLightBoard', value })
      },
    },
    lightBoardNumber: {
      get() {
        return this.objectView ? this.objectView.object.lightBoardNumber : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'lightBoardNumber', value })
      },
    },
    portBoardNumber: {
      get() {
        return this.objectView ? this.objectView.object.portBoardNumber : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'portBoardNumber', value })
      },
    },
    externalSource: {
      get() {
        return this.objectView ? this.objectView.object.externalSource : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'externalSource', value })
      },
    },
    blockSelfServiceInterface: {
      get() {
        return this.objectView ? this.objectView.object.externalSource : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'externalSource', value })
      },
    },
    scaleProtocol: {
      get() {
        return this.objectView ? this.objectView.object.scaleProtocol : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'scaleProtocol', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'scaleProtocolId', value: value.id })
      },
    },
  },

  created() {
    this.initialize()
    console.log(this.objectView)
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'scales/setObjectViewProperty',
      setObjectProperty: 'scales/setObjectProperty',
      delObjectView: 'scales/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async initialize() {},

    async writeObject() {
      let response
      if (this.object.isNew) {
        response = await this.$store.dispatch('scales/create', this.object).catch((error) => {
          console.error(error)
        })
      } else {
        response = await this.$store.dispatch('scales/update', this.object).catch((error) => {
          console.error(error)
        })
      }

      if (response.status === 200) {
        this.closeView()

        this.$bvToast.toast(this.$t('msg.catalogWriteSuccess'), {
          title: this.$t('common.msg'),
          variant: 'success',
          solid: true,
          autoHideDelay: 2000,
        })
      } else {
        this.$bvToast.toast(response.data?.message || this.$t('msg.catalogWriteError'), {
          title: this.$t('common.msg'),
          variant: 'danger',
          solid: true,
          autoHideDelay: 2000,
        })
      }
    },

    async closeView() {
      this.$destroy()
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)
      await this.$router.push({ name: 'scales-list' })
    },
  },
}

//[vue-router] Route with name 'scales-list' does not exist
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
