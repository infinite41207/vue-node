<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import Attachment from './attachment'

export default {
  name: 'TaskEmails',
  components: { Attachment },
  props: {
    mode: {
      type: String,
      default: 'vertical',
    },
  },

  data() {
    return {
      // configs: {
      //   spellChecker: false,
      //   placeholder: 'Treść wiadomości..',
      //   tabSize: 2,
      //   status: false,
      //   autosave: {
      //     enabled: false,
      //   },
      // },

      emailsData: [],

      emailId: 0,
      emailDate: '',
      emailSender: '',

      emailReciever: '',
      emailTittle: '',
      emailText: '',

      showNewEmailModalForm: false,
      showReadEmailModalForm: false,

      questionAction: null,
      questionParams: null,
      questionMessage: '',
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
      this.emailsData = await this.$store.dispatch('reclamationEmails/findAll', this.openReclamation.id)
    },

    async sendEmail() {
      const emailItem = {
        reclamationId: this.openReclamation.id,
        emailDate: new Date(),
        from: '',
        to: this.emailReciever,
        tittle: this.emailTittle,
        emailText: this.emailText,
        action: 1,
      }

      await this.$store.dispatch('reclamationEmails/addItem', emailItem)

      this.initialize()
      this.showNewEmailModalForm = false

      this.clearCurrentEmailValues()
    },

    createNewEmail() {
      this.clearCurrentEmailValues()
      this.showNewEmailModalForm = true
    },

    async readEmail(email) {
      if ((email.type = 'INCOMING' && email.uid !== null)) {
        const dataObject = await this.$store.dispatch('mailbox/findByUid', {
          params: {
            uid: Number(email.uid),
            emailAccountId: email.accountId,
          },
        })

        if (dataObject) {
          this.$router.push({ name: 'incoming-email-details' })
        }
      } else {
        this.emailDate = email.emailDate
        this.emailSender = email.from
        this.emailReciever = email.to
        this.emailTittle = email.tittle
        this.emailText = email.emailText

        this.showReadEmailModalForm = true
      }
    },

    async beforeDeleteItem() {
      this.questionMessage = 'Czy na pewno chcesz usunąć element z bazy danych?'

      const itemData = {
        id: this.productionOrderId,
        reclamationId: this.openReclamation.id,
        orderNumber: this.productionOrderNumber,
        comment: this.productionOrderComment,
        executionDate: this.productionOrderExecutionDate,
      }

      this.questionAction = this.deleteItem
      this.questionParams = itemData
      this.$bvModal.show('modal-question')
    },

    clearCurrentEmailValues() {
      this.emailId = 0
      this.emailDate = ''
      this.emailReciever = ''
      this.emailTittle = ''
      this.emailText = ''
    },

    async deleteItem(deleteItem) {
      await this.$store.dispatch('reclamationEmails/deleteItem', deleteItem)
      this.questionAction = null
      this.questionParams = null
      this.questionMessage = ''

      this.clearCurrentProductionOrderValues()

      this.$bvModal.hide('modal-question')
    },

    onCancelModalQuestion() {
      this.closeAndClearModalQuestion()
    },

    async onOkModalQuestion() {
      if (this.questionAction) {
        if (this.questionParams) {
          await this.questionAction(this.questionParams)
        } else {
          await this.questionAction()
        }
      }

      this.closeAndClearModalQuestion()
      this.showModalProductionOrderForm = false
      await this.initialize()
    },

    closeAndClearModalQuestion() {
      this.questionAction = null
      this.questionParams = null
      this.questionMessage = ''
      this.$bvModal.hide('modal-question')
    },

    cancelReadEmailForm() {
      this.clearCurrentEmailValues()
      this.showReadEmailModalForm = false
    },

    getFormatedDate(curDate) {
      return moment(curDate).format('DD MM YYYY HH:mm')
    },
  },
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-lg-6">
          <h4>Wiadomości</h4>
        </div>
        <div class="col-lg-6">
          <div class="text-lg-right">
            <b-button variant="outline-secondary mb-1" class="btn ml-1" @click="createNewEmail"> <i class="ri-add-line mr-1"></i> Email </b-button>
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
              <th>Od</th>
              <th>Do</th>
              <th>Tytuł</th>
              <th>Akcja</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reclamationEmail of emailsData" :key="reclamationEmail.id">
              <td>
                <a href="javascript:void(0);" class="btn btn-light" @click="readEmail(reclamationEmail)">
                  <i class="ri-search-line"></i>
                </a>
              </td>
              <td>{{ getFormatedDate(reclamationEmail.emailDate) }}</td>
              <td>{{ reclamationEmail.from }}</td>
              <td>{{ reclamationEmail.to }}</td>
              <td>{{ reclamationEmail.tittle }}</td>
              <td>{{ reclamationEmail.action }}</td>
              <td>{{ reclamationEmail.reclamationStatusId }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <b-modal id="modal-history-form" v-model="showNewEmailModalForm" title="Dodanie / Edycja Email" size="lg" hide-footer>
      <div class="card">
        <div class="card-body">
          <b-tabs content-class="mt-1" pills justified nav-class="bg-nav-pills">
            <b-tab active title="Treść" title-link-class="rounded-0">
              <div class="form-group mb-2 mt-3">
                <label for="msgto">Do</label>
                <input id="msgto" v-model="emailReciever" type="text" class="form-control" placeholder="example@email.com" />
              </div>
              <div class="form-group mb-2">
                <label for="mailsubject">Temat</label>
                <input id="mailsubject" v-model="emailTittle" type="text" class="form-control" placeholder="Temat wiadomości" />
              </div>
              <div class="form-group write-mdg-box mb-3">
                <label>Wiadomość</label>
                <!-- <vue-simplemde v-model="emailText" :configs="configs" class="markdown-editor CodeMirror-scroll mb-3 mr-1" /> //PRZECHODZIMY NA NOWY KOMPONENT -->
              </div>
            </b-tab>
            <b-tab title="Załączniki" title-link-class="rounded-0">
              <Attachment />
            </b-tab>
          </b-tabs>

          <button type="button" class="btn btn-success" @click="sendEmail"> <i class="ri-send-plane-2-fill mr-1"></i> Wyślij </button>
          <button type="button" class="btn btn-light ml-1" @click="showNewEmailModalForm = false">Anuluj</button>
        </div>
      </div>
    </b-modal>

    <b-modal id="modal-history-form" v-model="showReadEmailModalForm" title="Treść Email" size="lg" hide-footer>
      <div class="mt-3">
        <h5 class="font-18">{{ emailTittle }}</h5>

        <hr />

        <div class="media mb-3 mt-1">
          <!-- <img
              class="d-flex mr-2 rounded-circle"
              src="@/assets/images/users/avatar-2.jpg"
              alt="placeholder image"
              height="32"
            /> -->
          <div class="media-body">
            <small class="float-right">{{ getFormatedDate(emailDate) }}</small>
            <small class="text">Od: {{ emailSender }}</small> <br />
            <small class="text">Do: {{ emailReciever }}</small>
          </div>
        </div>

        <p>{{ emailText }}</p>

        <button type="button" class="btn btn-light ml-1" @click="cancelReadEmailForm">Anuluj</button>
        <!-- end row-->
      </div>
    </b-modal>
  </div>
</template>

<style>
/* .markdown-editor .CodeMirror,
.markdown-editor .CodeMirror-scroll {
  min-height: 350px;
}

.markdown-editor .CodeMirror {
  height: 350px;
} */
</style>
