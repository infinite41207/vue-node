<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'ReclFiles',
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

      filesString: '',
      showModalTableForm: false,

      userSettingItemKey: 'reclamationsFilesRestrictEdit',
      permissionRestrictEdit: false,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'reclamations/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },
  },
  async mounted() {
    this.initialize()
  },

  methods: {
    async initialize() {
      this.filesData = await this.$store.dispatch('reclamations/getFiles', {
        params: {
          filter: {
            reclamationId: this.object.id,
          }
        }
      })

      const authUser = await this.$store.state.auth.currentUser

      await this.$store
        .dispatch('userSettings/findByPk', {
          params: {
            userId: authUser.id,
            userSettingItemKey: this.userSettingItemKey,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const checkPermission = response.data
            if (checkPermission === true) {
              this.permissionRestrictEdit = true
            }
          }
        })
        .catch((error) => {
          console.warn(error)
        })

      this.fillFilesString()
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
      const files = []
      for(let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles[i]
        files.push( {
          path: file.$path,
          filename: file.name,
          originalname: file.name,
          destination: file.$path,
          size: file.size,
          type: file.type,
        })
      }

      await this.$store.dispatch('reclamations/uploadFiles', {
        params: {
          id: this.object.id,
          files,
          description: this.fileDescription,
          verification_protocol: this.verificationProtocol,
        }
      })

      this.initialize()
    },

    async openFile(item, open) {
      await this.$store.dispatch('reclamations/openFile', {
        id: item.id,
        type: item.type,
        name: item.originalname,
        open,
      })
    },

    onShowModalTableForm() {
      this.showModalTableForm = true
    },

    fillFilesString() {
      this.filesString = ''
      let countValues = 0
      for (const row of this.filesData) {
        countValues += 1
        if (this.filesString) {
          this.filesString += ';\r\n'
        }
        if (countValues < 3) {
          this.filesString += row.originalname
        } else {
          this.filesString += '...'
          break
        }
      }
    },
  },
}
</script>

<template>
  <b-card class="flexcard mb-2 pl-0 pb-0 pr-0 pt-0" height="100%" border-variant="primary">
    <b-card-body class="pl-0 pb-0 pr-0 pt-0">
      <div class="row">
        <div class="col-lg-8">
          <h5>Pliki</h5>
        </div>
        <div class="col-lg-4">
          <div v-if="permissionRestrictEdit === false" class="text-lg-right">
            <b-button size="sm" variant="outline-secondary" @click="addFile">
              <i class="ri-add-fill"></i>
            </b-button>
            <b-button class="ml-1" size="sm" variant="outline-secondary" @click="onShowModalTableForm">
              <i class="ri-pencil-fill"></i>
            </b-button>
          </div>
        </div>
      </div>
      <b-input-group class="mt-2" style="height: 50px">
        <span style="white-space: pre"> {{ filesString }} </span>
      </b-input-group>
      <b-row> </b-row>
    </b-card-body>

    <b-modal id="modal-edit-table-form" v-model="showModalTableForm" title="Pliki" size="lg" hide-footer>
      <div>
        <div class="row">
          <div class="text-lg-right">
            <b-button variant="outline-secondary mb-1" class="btn ml-1 btn-sm" @click="addFile"> <i class="ri-add-line mr-1"></i> Dodaj </b-button>
          </div>
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
                  <b-button variant="outline-secondary mb-1" class="btn ml-1" @click="openFile(file, true)">
                    <i class="ri-search-line mr-1"></i>
                  </b-button>
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
    </b-modal>

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
  </b-card>
</template>
