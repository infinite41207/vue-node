<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'TaskFiles',
  components: {},
  props: {
    mode: {
      type: String,
      default: 'vertical',
    },
  },
  data() {
    return {
      selectedFiles: null,

      filesData: [],
      fileDescription: '',
      verificationProtocol: false,

      menuRef: null,
    }
  },

  computed: {
    ...mapGetters({
      openReclamation: 'reclamations/openReclamation',
    }),
  },
  async mounted() {
    this.initialize()
  },

  methods: {
    async initialize() {
      this.filesData = await this.$store.dispatch('reclamations/getFiles', {
        reclamationId: this.openReclamation.id,
      })
    },

    getFormatedDate(curDate) {
      return moment(curDate).format('DD MM YYYY HH:mm:ss')
    },

    addFile() {
      this.fileDescription = ''
      this.verificationProtocol = false

      this.$bvModal.show('modal-select-file')
    },

    async handleOkFile(bvModalEvt) {
      bvModalEvt.preventDefault()
      await this.handleSubmitFile()

      this.$nextTick(() => {
        this.$bvModal.hide('modal-select-file')
      })
    },

    async handleSubmitFile() {
      await this.$store.dispatch('reclamations/uploadFiles', {
        files: this.selectedFiles,
        description: this.fileDescription,
        verification_protocol: this.verificationProtocol,
      })

      this.initialize()
    },

    async openFile(item) {
      await this.$store.dispatch('orders/openFile', {
        id: item.id,
        type: item.type,
        name: item.originalname,
      })
    },
  },
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-lg-6">
          <h4>Pliki</h4>
        </div>
        <div class="col-lg-6">
          <div class="text-lg-right">
            <b-button variant="outline-secondary mb-1" class="btn ml-1" @click="addFile"> <i class="ri-add-line mr-1"></i> Dodaj </b-button>
          </div>
        </div>
        <!-- end col-->
      </div>
      <div class="table-responsive">
        <table class="table table-centered mb-0">
          <thead class="thead-light">
            <tr>
              <th></th>
              <th>Data</th>
              <th>Nazwa</th>
              <th>Opis</th>
              <th>Protokół</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="file of filesData" :key="file.id">
              <td>
                <a href="javascript:void(0);" class="btn btn-light" @click="editPossition(file)">
                  <i class="ri-search-line"></i>
                </a>
              </td>
              <td>
                {{ getFormatedDate(file.createdAt) }}
              </td>
              <td>
                {{ file.originalname }}
              </td>
              <td>
                {{ file.description }}
              </td>
              <td>
                {{ file.hasProtocol }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <b-modal id="modal-select-file" ok-only title="Wybierz plik!" @ok="handleOkFile">
      <b-col>
        <b-row class="mb-2">
          <b-form-file v-model="selectedFiles" class="mt-2" browse-text="Wybierz" placeholder="Nie wybrano plików" multiple></b-form-file>
        </b-row>
        <b-row class="mb-2">
          <label for="kwatera-field">Opis</label>
          <b-form-input id="kwatera-field" v-model="fileDescription" placeholder="Opis pliku"> </b-form-input>
        </b-row>
        <b-row>
          <b-form-group label="Protokół weryfikacji reklamacji" label-for="verificationProtocolId">
            <b-form-checkbox v-model="verificationProtocol" name="verificationProtocolId" switch> </b-form-checkbox>
          </b-form-group>
        </b-row>
      </b-col>
    </b-modal>
  </div>
</template>
