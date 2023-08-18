<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import NewEmail from '@/views/mailbox/outgoing-email/new-email'

export default {
  name: 'ReclEmails',

  components: { NewEmail },
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

      sendEmailMode: false,
      customerEmail: '',
      customerLanguage: 'pl',
      emailAttachments: [],
      resultEmail: false,

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

    // async sendEmail() {

    //   const emailItem = {
    //     reclamationId: this.openReclamation.id,
    //     emailDate: new Date(),
    //     from: '',
    //     to: this.emailReciever,
    //     tittle: this.emailTittle,
    //     emailText: this.emailText,
    //     action: 1,
    //   }

    //   await this.$store.dispatch('reclamationEmails/addItem', emailItem)

    //   this.initialize()
    //   this.showNewEmailModalForm = false

    //   this.clearCurrentEmailValues()
    // },

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

    sendEmail() {
      this.sendEmailMode = true
      this.resultEmail = false
    },

    async sendEmailEnd(emailData) {
      if (emailData) {
        const emailAccount = await this.$store.dispatch('emailAccounts/getEmailAccountData', {
          params: {
            id: emailData.fromId,
          },
        })

        if (emailAccount.status === 200) {
          emailData.reclamationId = this.openReclamation.id
          emailData.action = 1
          emailData.emailDate = emailData.date
          ;(emailData.from = emailAccount.data.name), (emailData.tittle = emailData.subject)
          emailData.emailText = emailData.body

          await this.$store.dispatch('reclamationEmails/addItem', emailData)
          this.initialize()
          this.sendEmailMode = false
          this.clearCurrentEmailValues()
        }
      }
    },
  },
}
</script>

<template>
  <div class="card mb-1">
    <div class="card-body pl-2 pb-1 pr-2 pt-2">
      <div class="d-flex align-items-start">
        <b-button v-b-toggle.collapse-7 size="sm" variant="outline-secondary">
          <i class="ri-pencil-fill"></i>
        </b-button>
        <div class="w-100 overflow-hidden ml-2">
          <div class="row">
            <div class="col-lg-6">
              <h5>Wiadomości</h5>
            </div>
            <div class="col-lg-6">
              <div class="text-lg-right">
                <b-button variant="outline-secondary mb-1" class="btn ml-1 btn-sm" @click="sendEmail"> <i class="ri-add-line mr-1"></i> Email </b-button>
              </div>
            </div>
          </div>
          <b-collapse id="collapse-7" class="mt-0">
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
          </b-collapse>
        </div>
      </div>
    </div>

    <NewEmail
      v-if="sendEmailMode"
      :parent-obj-id="openReclamation.id"
      parent-obj-type="Reclamation"
      :email-to="customerEmail"
      :email-lanuage="customerLanguage"
      :attachments="emailAttachments"
      @send-email-end="sendEmailEnd"
    />
  </div>
</template>

<style>
</style>
