<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row class="mt-3">
      <b-col cols="3">
        <b-table id="accessLogsFilesList" striped hover :per-page="perFilePage" :current-page="currentFilePage" small :items="allFiles" :fields="filesTableHeader">
          <template v-slot:cell(file)="data">
            <a href="#" @click="getFileInfo(data.item)">{{ data.item.file }}</a>
          </template>
        </b-table>
        <b-pagination v-model="currentFilePage" :total-rows="files" :per-page="perFilePage" aria-controls="accessLogsFilesList"></b-pagination>
      </b-col>
      <b-col cols="9">
        <b-table v-if="fileData.length > 0" id="accessLogsList" striped hover :per-page="perPage" :current-page="currentPage" small :items="fileData" :fields="fields">
          <template v-slot:cell(user)="data">
            <a href="#" @click="getUserFullInfo(data.index)">{{ data.value.name }}</a>
          </template>
        </b-table>
        <h1 v-else>Brak danych</h1>
        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" aria-controls="accessLogsList" align="right"></b-pagination>
      </b-col>
    </b-row>

    <b-modal ref="userInfo" title="Informacja o użytkowniku">
      <b-row>
        <b-col>
          <h5>Id</h5>
        </b-col>
        <b-col>
          <p>{{ this.selectedUserData.id }}</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h5>Imię</h5>
        </b-col>
        <b-col>
          <p>{{ this.selectedUserData.name }}</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h5>Login</h5>
        </b-col>
        <b-col>
          <p>{{ this.selectedUserData.login }}</p>
        </b-col>
      </b-row>
    </b-modal>
  </Layout>
</template>
  
  <script>
import _ from 'lodash'
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import moment from 'moment'

export default {
  name: 'AccessLogsList',
  page() {
    return {
      title: 'Dzenniki rejestracji',
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },
  components: {
    Layout,
    PageHeader,
  },

  async created() {
    await this.getAllFiles()
    await this.getFileInfo(this.allFiles[0])
  },

  computed: {
    rows() {
      return this.fileData.length
    },
    files() {
      return this.allFiles.length
    },
  },

  data() {
    return {
      title: 'Dzienniki rejestracji',
      perPage: 20,
      currentPage: 1,
      filesTableHeader: [{ key: 'file', label: 'Wszystkie pliki' }],
      perFilePage: 17,
      currentFilePage: 1,
      fields: [
        { key: 'date', label: 'Data', sortable: true },
        { key: 'ip', label: 'Ip', sortable: true },
        { key: 'user', label: 'Użytkownik', sortable: true },
        { key: 'method', label: 'Metod', sortable: true },
        { key: 'url', label: 'Url', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'time', label: 'Czas', sortable: true },
        { key: 'query', label: 'Zapytanie', sortable: true },
        { key: 'params', label: 'Parametr', sortable: true },
        { key: 'body', label: 'Ciało', sortable: true },
      ],
      allFiles: [],
      fileData: [],
      selectedUserData: [],
    }
  },
  methods: {
    async getAllFiles() {
      const response = await this.$store.dispatch(`accessLogs/getAllFiles`)

      const objResponse = []

      for (let i = 0; i < response.length; i++) {
        objResponse[i] = { file: response[i] }
      }

      this.allFiles = objResponse
    },

    async getFileInfo(fileName) {
      const response = await this.$store.dispatch(`accessLogs/getFileInfo`, fileName.file)

      for (let i = 0; i < response.length; i++) {
        response[i].date = this.convertDate(response[i].date)
      }

      if (response.length > 0) {
        this.fileData = response
      } else {
        this.fileData = []
      }
    },

    convertDate(dateValue) {
      const convertedDate = moment(dateValue).format('DD-MM-YYYY')
      return convertedDate
    },

    showModal() {
      this.$refs['userInfo'].show()
    },

    getUserFullInfo(rowIndex) {
      const index = rowIndex + this.perPage * this.currentPage
      this.showModal()
      this.selectedUserData = this.fileData[index].user
    },

    hideModal() {
      this.$refs['userInfo'].hide()
    },
  },
}
</script>
  