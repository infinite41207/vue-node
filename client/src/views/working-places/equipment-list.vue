<template>
  <b-modal
    v-model="value"
    title="Info equipment"
    header-class="pr-4 pl-4 border-bottom-0"
    title-class="text-black font-18"
    body-class="pt-3 pr-4 pl-4"
    size="xl"
    centered
    @cancel="onCancel"
    @close="onClose"
    @ok="onOk"
    @hide="onHide"
  >

    <b-row class="my-2 ml-1">
      <b-col>
        <b-button variant="success"  @click="refreshStatus">Refresh status</b-button>
      </b-col>
    </b-row>
    <b-container>
        <b-table striped hover :fields="fields" :items="items" responsive="sm">
          <template #cell(type)="data">
            {{ data.item.type }}
          </template>
          <template #cell(key)="data">
            <b-form-select  v-if="data.item.type === 'COM'" v-model="data.item.key[0]" :options="data.item.key"></b-form-select>
            <div v-else>
              {{ data.item.key }}
            </div>
          </template>
          <template #cell(status)="data">
            <b-badge v-if="data.item.status" variant="success">Success</b-badge>
            <b-badge v-else variant="danger">Error</b-badge>
          </template>
        </b-table>
    </b-container>

    <b-container v-if="spinner">
      <b-row  class="text-center">
        <b-col align-self="center">
          <b-spinner variant="success" label="Spinning"></b-spinner>
        </b-col>
      </b-row>
    </b-container>


  </b-modal>
</template>


<script>
//devices.isRollPrinter - true / false
//this.scale.scaleProtocol -
  // api: null
  // command: "SIR\\r\\n"
  // createdAt: "2023-02-27T12:48:20.443Z"
  // id: "a05aefc6-0769-4041-ad71-38589c860ae2"
  // markedToDelete: false
  // name: "Toledo two"
  // parserType: "ToledoSimpleTwice"
  // port: 3333
  // presentation: "Toledo two"
  // register: null
  // serialPort: null
  // server: "192.168.0.40"
  // type: "TCP/IP"
  //devices.scale.scaleProtocol.serialPort

import {
  getWeight as weightingsGetWeight,
  getPhotoScale
} from '@/utils/weightings.js'

import {getProtocol} from '@/utils/getProtocolForWorkingPlace.js'

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    devices: {
      type: Object,
      default: function () {
        return {}
      },
    }
  },
  data() {
    return {
      modeElectron: process.env.IS_ELECTRON ? true : false,
      spinner: true,
      protocols: ['Mechanical', 'IoT', 'TCP/IP', 'Modbus', 'COM', 'S7'],
      protocolFromScale: null,
      typeS7: 'S7',
      fields: [
        { key: 'type', label: "Type" },
        { key: 'key', label: "Key" },
        { key: 'status', label: "Status" }

      ],
      items: [],
    }
  },
  async created() {
    await this.initialize()
  },

  methods: {
    onClose() {
      this.$emit('input', false)
    },
    onCancel() {
      this.$emit('input', false)
    },
    onOk() {
      this.$emit('input', false)
    },
    onHide() {
      this.$emit('input', false)
    },

    async initialize(){
      await this.getProtocolByID();
      await this.drawTablve();
      this.spinner = false
    },

    async getProtocolByID () {
      this.protocolFromScale = await getProtocol(this.devices.scale.scaleProtocolId).catch(console.error)
      //console.log("this.protocolFromScale", this.protocolFromScale)
      if (this.protocolFromScale) {
        return this.protocolFromScale
      } else {
        return false
      }
    },
    async pingServeScale () {
      const weightingData = await weightingsGetWeight(this.devices.scale.id, 0)
      //console.log("weightingData", weightingData)
      //Scale
      const getProtocolByID = await this.getProtocolByID()
      if (getProtocolByID && getProtocolByID.type && getProtocolByID.type !== 'S7'){
        const scaleRow = {
          type: (this.devices.scale)? "Scale" : null ,
          key: getProtocolByID.type + "-" + getProtocolByID.server,
          status: (weightingData.connect) ? true: false
        }
        this.items.push(scaleRow)
      }else if (getProtocolByID && getProtocolByID.type && getProtocolByID.type === 'S7'){
        const configS7 =  getProtocolByID.configS7.find((row) => row.key == 'Weight')
        if (configS7){
          const scaleRow = {
            type: (this.devices.scale)? "Scale" : null ,
            key: getProtocolByID.type + "-" + configS7.server,
            status: (weightingData.connect) ? true: false
          }
          this.items.push(scaleRow)
        }

      }
    },
    async pingCamers(){
      const resPhoto = await getPhotoScale(this.devices.scale.id, "test")
      if (resPhoto.length){
        for (const el of resPhoto){
          const cameraRow = {
            type: "Camera",
            key: el.videoRecorderServer,
            status: (el.status == 200) ?  true : false
          }
          this.items.push(cameraRow)
        }
      }

    },
    async pingComPort () {
      const getComList = await window.ipcRenderer.invoke('getComList', '')
      //getComList.path
      if (getComList.length){
        const listCom = []
        for (const el of getComList){
          listCom.push(el.path)
        }

        const comRow = {
          type: "COM",
          key: listCom,
          status: true
        }
        this.items.push(comRow)
      }
    },
    async drawTablve(){
      //Scale
      await this.pingServeScale()
      //Camers
      await this.pingCamers()
      //COM
      await this.pingComPort();
    },
    async refreshStatus(){
      this.items = [];
      this.spinner = true
      await this.initialize()
    }


  },
}
</script>
