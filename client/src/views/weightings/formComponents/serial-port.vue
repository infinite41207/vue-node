<template>
  <b-modal
    v-model="value"
    title="COM INFO"
    header-class="pr-4 pl-4 border-bottom-0"
    title-class="text-black font-18"
    body-class="pt-3 pr-4 pl-4"
    centered
    @cancel="onCancel"
    @close="onClose"
    @ok="onOk"
    @hide="onHide"
  >
    <b-row>
      <b-col>
        <b-form-group label-cols="4" content-cols="5" label="Port skanera:" label-for="input-skanera">
          <b-form-select id="input-skanera" v-model="selectedScanner" :options="listCom" v-on:change="onChange($event)"></b-form-select>
        </b-form-group>

        <b-row>
          <b-col>
            <div>Status COM:</div>
          </b-col>
          <b-col>
            <b-badge variant="info">{{statusCom.text}}</b-badge>
          </b-col>
        </b-row>
        <div v-if="statusCom.code === 400 && selectedScanner && listCom.length">
          <b-row class="mt-2">
            <b-col>
              <div>Reconect COM:</div>
            </b-col>
            <b-col>
              <b-button variant="info" @click="reConnect" >Reconect</b-button>
            </b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>


<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      com: '',
      listCom: '',
      selectedScanner: 'COM1',
      statusCom: {
        code: 0,
        text: ""
      },
      statusInterval: null
    }
  },
  async created() {
    this.listCom = await this.getListSerialPort()
    this.getStatusCom()
  },

  beforeDestroy() {
    clearInterval(this.statusInterval)
  },

  methods: {
    onClose() {
      this.$emit('input', false)
    },
    onCancel() {
      this.$emit('input', false)
    },
    async onOk(){
      if(this.statusCom.code !== 200 && this.listCom.length && this.selectedScanner){
        await window.ipcRenderer.invoke('openComport', "save")
      }
      this.$emit('input', false)

    },
    onHide(){
      this.$emit('input', false)
    },
    async getListSerialPort() {
      const fullList = []
        const result = await window.ipcRenderer.invoke('getComList', 'listCMD')
        this.selectedScanner = await window.ipcRenderer.invoke('getListenPort', 'getCom')
        if (result.length) {
          for (const com of result) {
            fullList.push(com.path)
          }
          return fullList
        } else {
          return ['']
        }

    },
    async onChange(event) {
      await window.ipcRenderer.invoke('setListenPort', event)
    },
    getStatusCom(){
      this.statusInterval = setInterval(async ()=>{
        this.statusCom = await window.ipcRenderer.invoke('getSerialStatus', 'statusCom')

        const listCom = await window.ipcRenderer.invoke('getComList', 'listCMD')
        const fullList = []

        if (!listCom.length){
          this.listCom = []
          this.selectedScanner = null
        }else {
          for (const com of listCom) {
            fullList.push(com.path)
          }
          this.listCom = fullList
        }
      }, 2000)

    },
    async reConnect(){
      await window.ipcRenderer.invoke('reConnectPort', "reconnect")
    }
  },
}
</script>
