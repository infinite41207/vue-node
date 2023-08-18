<template>
  <div>
    <div class="card">
      <div class="card-body">
        <!-- <b-row>
          <b-col>
            <b-form-group label="Data przyjęcia" label-for="reclDate">
              <b-form-input 
                v-model="inputDate"
                :state="inputDateState"
                id="reclDate" 
                type="date"
                :readonly="clientsRestrictions"
                >
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row> -->
        <!-- <b-row>
          <b-col>
            <b-form-group label="Typ zlecenia" label-for="doc_type_label">
              <b-form-select
                id="doc_type_label"
                v-model="docType"
                :state="docTypeState"
                :options="reclamation_types"
                text-field="description"
                value-field="id"
                name="currency"
                aria-describedby="currencyFeedback"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <p class="mb-1">
              Ilość dni : <b>{{ getOrderTypeExecutionDays(docType) }}</b>
            </p>
          </b-col>
        </b-row> -->
        <!-- <b-row>
          <b-col>
            <b-form-group label="Termin" label-for="reclExecutionDate">
              <b-form-input 
              id="reclExecutionDate"
              v-model="executionTerm"
              :readonly="clientsRestrictions"
              type="date">
            </b-form-input>
            </b-form-group>
          </b-col>
        </b-row> -->
        <!-- <b-row>
          <b-col>
            <b-form-group label="Oczekiwany odbiór" label-for="reclDeliveryTerm">
              <b-form-input               
                id="reclDeliveryTerm"
                v-model="deliveryTerm"
                type="date">
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row> -->
        <b-row>
          <b-col>
            <p class="mb-1">
              Status: <br />
              <b>{{ getCurrentReclamationStatusDescription(status) }}</b>
            </p>
            <div class="input-group-append">
              <b-button variant="outline-secondary" class="ml-1" @click="beforeStatusChange"> <i class="ri-edit-box-line"></i> Zmień status </b-button>
            </div>
          </b-col>
        </b-row>
        <!-- <p></p>
        <b-row v-if="newDocumentMode===false">
          <b-col>
            <b-form-group label="Odpowiedzialność" label-for="perpetratorId">
              <b-form-select
                id="perpetratorId"
                v-model="perpetrator"
                :options="reclamationPerpetrators"
                text-field="description"
                value-field="id"
                name="perpetrator"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row v-if="newDocumentMode===false&&!clientsRestrictions">
          <b-col>
            <b-form-group label="Powód" label-for="recl_reason">
              <b-form-select
                id="recl_reason"
                v-model="reclamationReason"
                :options="reclamationReasons"
                text-field="description"
                value-field="id"
                name="recl_reasonname"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row v-if="newDocumentMode===false">
          <b-col>
            <p class="mb-1">
              Decyzja: <br />
              <b>{{ getCurrentReclamationDecisionDescription(this.decision) }}</b>
            </p>
            <div class="input-group-append">
              <b-button 
                @click="beforeDecisionChange()"
                variant="outline-secondary" 
                class="ml-1"
                v-if="!clientsRestrictions"
                >
                <i class="ri-edit-box-line"></i> Zmień decyzję
              </b-button>
            </div>
          </b-col>
        </b-row>
        <p></p>
        <b-row  v-if="newDocumentMode===false">
          <b-col>
            <p class="mb-1">
              Data decyzji: <br />
              <b>{{decisionDate}}</b>
            </p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <p class="mb-1">
              Użytkownik: <br />
              <b>{{authorName}}</b>
            </p>
          </b-col>
        </b-row> -->
      </div>

      <!-- <b-button v-b-modal.change-status-form variant="primary">Standard Modal</b-button> -->
      <b-modal v-model="showChangeStatusForm" title="Zmiana statusu" title-class="font-18" hide-footer>
        <b-form-group label="Wybierz nowy status" label-for="recl_status">
          <b-form-select id="recl_status" v-model="modalFormStatus" :options="reclamationStatuses" text-field="description" value-field="id" name="recl_status" />
        </b-form-group>
        <b-form-group label="Komentarz" label-for="comment" class="mb-3">
          <b-form-textarea id="comment" v-model="modalFromStatusComment" rows="5"></b-form-textarea>
        </b-form-group>

        <div class="text-right pt-2 pb-2">
          <b-button type="submit" variant="success" class="ml-1" @click="changeStatus">Zmień status</b-button>
          <b-button variant="light" @click="showChangeStatusForm = false">Anuluj</b-button>
        </div>
      </b-modal>

      <b-modal id="change-decision-form" v-model="showChangeDecisionForm" title="Zmiana decyzji" title-class="font-18" hide-footer>
        <b-form-group label="Data decyzji" label-for="decisionDate">
          <b-form-input id="decisionDate" v-model="modalFormDecisionDate" type="date"> </b-form-input>
        </b-form-group>

        <b-form-group label="Wybierz decyzję" label-for="recl_decision">
          <b-form-select id="recl_decision" v-model="modalFormDecision" :options="reclamationDecisions" text-field="description" value-field="id" name="recl_decision" />
        </b-form-group>
        <b-form-group label="Uzasadnienie" label-for="decisionComment" class="mb-3">
          <b-form-textarea id="decisionComment" v-model="modalFormDecisionComment" rows="5"> </b-form-textarea>
        </b-form-group>

        <div class="text-right pt-2 pb-2">
          <b-button type="submit" variant="success" class="ml-1" @click="changeDecision">Zmień decyzję</b-button>
          <b-button variant="light" @click="showChangeDecisionForm = false">Anuluj</b-button>
        </div>
      </b-modal>
    </div>

    <!-- <div class="card">
      <div class="card-body">
        <b-row v-if="!clientsRestrictions">
          <b-col>
            <b-form-group label="Konstruktor" label-for="responsibleId">
              <b-form-select
                id="responsibleId"
                v-model="responsible"
                :options="users"
                text-field="name"
                value-field="id"
                name="responsible"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'

export default {
  name: 'TaskSidebar',

  components: {},

  props: {
    mode: {
      type: String,
      default: 'vertical',
    },
  },

  data() {
    return {
      showChangeStatusForm: false,
      showChangeDecisionForm: false,

      reclamation_types: [],

      modalFormStatus: '',
      modalFromStatusComment: '',

      modalFormDecision: '',
      modalFormDecisionDate: '',
      modalFormDecisionComment: '',

      reclamationStatuses: [],

      reclamationExecutionTypes: [],

      reclamationDecisions: [],
      reclamationReasons: [],
      reclamationPerpetrators: [],

      menuItems: '',
      menuRef: null,
      authorName: '',
    }
  },

  computed: {
    ...mapGetters({
      openReclamation: 'reclamations/openReclamation',
      newDocumentMode: 'reclamations/newDocumentMode',
      users: 'users/getUsers',
    }),

    status: {
      get() {
        return this.openReclamation.status
      },
      set(value) {
        this.setReclamationProperty({
          property: 'status',
          value: value,
        })
      },
    },

    execution_type: {
      get() {
        return this.openReclamation.execution_type
      },
      set(value) {
        this.setReclamationProperty({
          property: 'execution_type',
          value: value,
        })
      },
    },

    reclamationReason: {
      get() {
        return this.openReclamation.reclamationReason
      },
      set(value) {
        this.setReclamationProperty({
          property: 'reclamationReason',
          value: value,
        })
      },
    },

    perpetrator: {
      get() {
        return this.openReclamation.perpetrator
      },
      set(value) {
        this.setReclamationProperty({
          property: 'perpetrator',
          value: value,
        })
      },
    },

    responsible: {
      get() {
        return this.openReclamation.responsible
      },
      set(value) {
        this.setReclamationProperty({
          property: 'responsible',
          value: value,
        })
      },
    },

    inputDate: {
      get() {
        return moment(this.openReclamation.inputDate).format('YYYY-MM-DD')
      },
      set(value) {
        this.setReclamationProperty({
          property: 'inputDate',
          value: moment(value).format('YYYY-MM-DD'),
        })
        this.setExecutionTerm(this.openReclamation.docType)
      },
    },

    docType: {
      get() {
        return this.openReclamation.docType
      },
      set(value) {
        this.setReclamationProperty({
          property: 'docType',
          value: value,
        })
        this.setExecutionTerm(value)
      },
    },

    decisionDate: {
      get() {
        return moment(this.openReclamation.decisionDate).format('YYYY-MM-DD')
      },
      set(value) {
        this.setReclamationProperty({
          property: 'decisionDate',
          value: moment(value).format('YYYY-MM-DD'),
        })
      },
    },

    decision: {
      get() {
        return this.openReclamation.decision
      },
      set(value) {
        this.setReclamationProperty({
          property: 'decision',
          value: value,
        })
      },
    },

    executionTerm: {
      get() {
        return moment(this.openReclamation.executionTerm).format('YYYY-MM-DD')
      },
      set(value) {
        this.setReclamationProperty({
          property: 'executionTerm',
          value: moment(value).format('YYYY-MM-DD'),
        })
        this.setReclamationProperty({
          property: 'deliveryTerm',
          value: moment(value).format('YYYY-MM-DD'),
        })
      },
    },

    deliveryTerm: {
      get() {
        return moment(this.openReclamation.deliveryTerm).format('YYYY-MM-DD')
      },
      set(value) {
        this.setReclamationProperty({
          property: 'deliveryTerm',
          value: moment(value).format('YYYY-MM-DD'),
        })
      },
    },

    inputDateState() {
      if (Date.parse(this.openReclamation.inputDate)) {
        return true
      }
      return false
    },

    docTypeState() {
      if (this.openReclamation.docType > 0) {
        return true
      }
      return false
    },

    clientsRestrictions() {
      if (this.$attrs.user) {
        return this.$attrs.user.externalUser
      } else {
        return false
      }
    },
  },

  async mounted() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      setReclamationProperty: 'reclamations/setReclamationProperty',
    }),

    setExecutionTerm(currentDocType) {
      const found = this.reclamation_types.find((item) => item.id === currentDocType)

      if (found) {
        if (Number(found.days) > 0 && this.inputDate) {
          const new_date = this.addDays(this.inputDate, found.days)
          this.setReclamationProperty({
            property: 'executionTerm',
            value: new_date,
          })
          this.setReclamationProperty({
            property: 'deliveryTerm',
            value: new_date,
          })
        }
      }
    },

    async initialize() {
      this.reclamation_types = await this.$store.dispatch('reclamationTypes/findAll', {})
      this.reclamationStatuses = await this.$store.dispatch('reclamationStatuses/findAll', {})
      this.reclamationExecutionTypes = await this.$store.dispatch('reclamationExecutionTypes/findAll', {})
      this.reclamationReasons = await this.$store.dispatch('reclamationReasons/findAll', {})
      this.reclamationDecisions = await this.$store.dispatch('reclamationDecisions/findAll', {})
      this.reclamationPerpetrators = await this.$store.dispatch('reclamationPerpetrators/findAll', {})

      if (this.users.length === 0) {
        await this.$store.dispatch('users/findAll', {})
      }

      if (this.openReclamation.id === null) {
        this.setReclamationProperty({
          property: 'inputDate',
          value: moment(new Date()).format('YYYY-MM-DD'),
        })

        if (this.openReclamation.docType > 0) {
          this.setExecutionTerm(this.openReclamation.docType)
        }
        // if (this.reclamation_types.length > 0) {
        //   this.setReclamationProperty({
        //     property: 'docType',
        //     value: this.reclamation_types[0].id,
        //   })
        //   this.setExecutionTerm(this.reclamation_types[0].id);
        // }
      }
      if (this.openReclamation.author) {
        const userData = await this.$store.dispatch('users/findByPk', {
          id: this.openReclamation.author,
          noCommit: true,
        })
        if (userData !== false) {
          if (userData.name) {
            this.authorName = userData.name
          } else {
            this.authorName = userData.email
          }
        } else this.authorName = ''
      }
    },

    beforeStatusChange() {
      this.modalFormStatus = this.openReclamation.status
      this.modalFromStatusComment = ''
      this.showChangeStatusForm = true
    },

    async changeStatus() {
      const historyEventItem = {
        reclamationId: this.openReclamation.id,
        actionDate: new Date(),
        // actionDate: moment(new Date()).format('YYYY.MM.DD HH:mm:ss'),
        actionId: 1,
        comment: this.modalFromStatusComment,
      }
      await this.$store.dispatch('reclamationHistory/addItem', historyEventItem)
      this.setReclamationProperty({
        property: 'status',
        value: this.modalFormStatus,
      })
      await this.$store.dispatch('reclamations/updateReclamation', this.openReclamation)
      this.showChangeStatusForm = false
    },

    beforeDecisionChange() {
      this.modalFormDecision = this.openReclamation.decision
      this.modalFormDecisionComment = ''
      this.modalFormDecisionDate = moment(new Date()).format('YYYY-MM-DD')
      this.showChangeDecisionForm = true
    },

    async changeDecision() {
      const historyEventItem = {
        reclamationId: this.openReclamation.id,
        actionDate: new Date(),
        // actionDate: moment(new Date()).format('YYYY.MM.DD HH:mm:ss'),
        actionId: 4,
        comment: this.modalFormDecisionComment,
      }
      await this.$store.dispatch('reclamationHistory/addItem', historyEventItem)

      this.setReclamationProperty({
        property: 'decision',
        value: this.modalFormDecision,
      })
      this.setReclamationProperty({
        property: 'decisionDate',
        value: this.modalFormDecisionDate,
      })

      await this.$store.dispatch('reclamations/updateReclamation', this.openReclamation)

      this.showChangeDecisionForm = false
    },

    getCurrentReclamationStatusDescription(statusId) {
      let statusDescription = 'Nie określono'
      const found = this.reclamationStatuses.find((item) => item.id === statusId)
      if (found) {
        statusDescription = found.description
      }
      return statusDescription
    },

    getCurrentReclamationDecisionDescription(decisionId) {
      let decisionDescription = 'Nie określono'
      const found = this.reclamationDecisions.find((item) => item.id === decisionId)
      if (found) {
        decisionDescription = found.description
      }
      return decisionDescription
    },

    addDays(date, days) {
      var result = new Date(date)
      result.setDate(result.getDate() + days)
      return result
    },

    getOrderTypeExecutionDays(orderTypeId) {
      let executionDaysDescription = 'Nie określono'
      const found = this.reclamation_types.find((item) => item.id === orderTypeId)
      if (found) {
        executionDaysDescription = found.days
        if (Number(found.days) > 0 && this.inputDate) {
          this.addDays(this.inputDate, found.days)
        }
      }
      return executionDaysDescription
    },
  },
}
</script>
