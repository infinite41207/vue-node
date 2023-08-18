<script>
import { mapGetters, mapMutations } from 'vuex'
import DatePicker from 'vue2-datepicker'
import moment from 'moment'

export default {
  name: 'ReclSidebar',

  components: { DatePicker },

  props: {
    mode: {
      type: String,
      default: 'vertical',
    },
    viewId: {
      type: String,
      required: true,
    },
    sideBarRestrictions: {
      type: Boolean,
    }
  },

  data() {
    return {
      showChangeStatusForm: false,
      showChangeDecisionForm: false,

      reclamationTypes: [],

      modalFormStatus: '',
      modalFormStatusDesc: '',

      modalFormDecision: '',
      modalFormDecisionDate: '',
      modalFormDecisionDesc: '',

      reclamationStatuses: [],

      reclamationExecutionTypes: [],

      reclamationDecisions: [],
      reclamationReasons: [],
      reclamationPerpetrators: [],

      menuItems: '',
      menuRef: null,
      authorName: '',
      employees: [],
      userSettings: [],
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'reclamations/objectView',
      openReclamation: 'reclamations/openReclamation',
      newDocumentMode: 'reclamations/newDocumentMode',
      users: 'users/getUsers',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    inputDate: {
      get() {
        return this.objectView ? ( this.object.inputDate ? new Date(this.object.inputDate) : null ) : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'inputDate', value })
      },
    },

    executionDate: {
      get() {
        return this.objectView ? ( this.object.executionDate ? new Date(this.object.executionDate) : null ) : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'executionDate', value })
      },
    },

    executionTerm: {
      get() {
        return this.objectView ? ( this.object.executionTerm ? new Date(this.object.executionTerm) : null ) : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'executionTerm', value })
      },
    },

    responsible: {
      get() {
        return this.objectView ? this.object._responsible : {}
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: '_responsible', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'responsibleId', value: value ? value.id : value })
      },
    },

    manager: {
      get() {
        return this.objectView ? this.object.manager : {}
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'manager', value: value })
        this.setObjectProperty({ viewId: this.viewId, property: 'managerId', value: value ? value.id : value })
      },
    },

    executor: {
      get() {
        return this.objectView ? this.object._executor : {}
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: '_executor', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'executorId', value: value ? value.id : value })
      },
    },

    status: {
      get() {
        return this.objectView ? this.object._status : {}
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: '_status', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'statusId', value: value ? value.id : value })
      },
    },

    perpetrator: {
      get() {
        return this.objectView ? this.object._perpetrator : {}
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: '_perpetrator', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'perpetratorId', value: value ? value.id : value })
      },
    },

    decision: {
      get() {
        return this.objectView ? this.object._decision : {}
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: '_decision', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'decisionId', value: value ? value.id : value })
      },
    },

    executionType: {
      get() {
        return this.objectView ? this.object._execution_type : {}
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: '_execution_type', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'executionTypeId', value: value ? value.id : value })
      },
    },

    type: {
      get() {
        return this.objectView ? this.object.docType : {}
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'docType', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'docTypeId', value: value ? value.id : value })
      },
    },

    author: {
      get() {
        return this.objectView ? this.object._author : {}
      },
    },

    decisionDescription: {
      get() {
        return this.objectView ? this.object.decisionDescription : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'decisionDescription', value })
      },
    },

    statusDescription: {
      get() {
        return this.objectView ? this.objectView.recstatusDescription : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'recstatusDescription', value })
      },
    },

    decisionDate: {
      get() {
        return this.objectView ? moment(this.object.decisionDate).format('YYYY-MM-DD') : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'decisionDate', value })
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

    deliveryTerm: {
      get() {
        return this.openReclamation.deliveryTerm
      },
      set(value) {
        this.setReclamationProperty({
          property: 'deliveryTerm',
          value,
        })
      },
    },

    showHidable() {
      let returnValue = true

      if(this.userSettings) {
        for(let i = 0; i < this.userSettings.length; i++) {
          if(this.userSettings[i].userSettingItem) {
            if(this.userSettings[i].userSettingItem.key === 'sideBarRestrictions') {
              returnValue = !this.userSettings[i].valueBoolean
            }
          }
        }
      }

      return returnValue
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
      setObjectViewProperty: 'reclamations/setObjectViewProperty',
      setObjectProperty: 'reclamations/setObjectProperty',
      delObjectView: 'reclamations/delObjectView',
      setReclamationProperty: 'reclamations/setReclamationProperty',
    }),

    // setExecutionTerm(currentDocType) {
    //   const found = this.reclamationTypes.find((item) => item.id === currentDocType)
    //   if (found) {
    //     if (Number(found.days) > 0 && this.inputDate) {
    //       const new_date = this.addDays(this.inputDate, found.days)
    //       this.setReclamationProperty({
    //         property: 'executionTerm',
    //         value: new_date,
    //       })
    //       this.setReclamationProperty({
    //         property: 'deliveryTerm',
    //         value: new_date,
    //       })
    //     }
    //   }
    // },

    async initialize() {
      this.userSettings = await this.$store.dispatch('userSettings/findAll', {})

      this.reclamationTypes = await this.$store.dispatch('reclamationTypes/findAll', {})
      this.reclamationStatuses = await this.$store.dispatch('reclamationStatuses/findAll', {})
      this.reclamationExecutionTypes = await this.$store.dispatch('reclamationExecutionTypes/findAll', {})
      this.reclamationReasons = await this.$store.dispatch('reclamationReasons/findAll', {})
      this.reclamationDecisions = await this.$store.dispatch('reclamationDecisions/findAll', {})
      this.reclamationDecisions = this.reclamationDecisions.data
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
          //this.setExecutionTerm(this.openReclamation.docType)
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

      const employeesResponse = await this.$store.dispatch('employees/findAll', { noCommit: true })

      if (employeesResponse.status === 200) {
        this.employees = employeesResponse.data
      }
    },

    // addDays(date, days) {getStatusDescription
    //   var result = new Date(date)
    //   result.setDate(result.getDate() + days)
    //   return result
    // },

    // getOrderTypeExecutionDays(orderTypeId) {
    //   let executionDaysDescription = 'Nie określono'
    //   const found = this.reclamation_types.find((item) => item.id === orderTypeId)
    //   if (found) {
    //     executionDaysDescription = found.days
    //     if (Number(found.days) > 0 && this.inputDate) {
    //       this.addDays(this.inputDate, found.days)
    //     }
    //   }
    //   return executionDaysDescription
    // },

    beforeStatusChange() {
      this.modalFormStatus = ''
      this.modalFormStatusDesc = ''
      this.showChangeStatusForm = true
    },

    async changeStatus() {
      const foundStatus = this.reclamationStatuses.find((item) => item.id === this.modalFormStatus)

      const historyEventItem = {
        reclamationId: this.object.id,
        actionDate: new Date(),
        // actionDate: moment(new Date()).format('YYYY.MM.DD HH:mm:ss'),
        actionId: 1,
        comment: 'Nowy status: ' + foundStatus.description + ' ' + this.modalFormStatusDesc,
      }
      await this.$store.dispatch('reclamationHistory/addItem', historyEventItem)

      this.status = foundStatus
      this.statusDescription = this.modalFormStatusDesc

      await this.$store.dispatch('reclamations/update', this.object)

      this.showChangeStatusForm = false
    },

    beforeDecisionChange() {
      this.modalFormDecision = ''
      this.modalFormDecisionDesc = ''
      this.modalFormDecisionDate = new Date()
      this.showChangeDecisionForm = true
    },

    async changeDecision() {
      const foundDecision = this.reclamationDecisions.find((item) => item.id === this.modalFormDecision)

      const historyEventItem = {
        reclamationId: this.object.id,
        actionDate: new Date(),
        // actionDate: moment(new Date()).format('YYYY.MM.DD HH:mm:ss'),
        actionId: 4,
        comment: 'Nowa decyzja: ' + foundDecision.description + ' / ' + this.modalFormDecisionDesc,
      }
      await this.$store.dispatch('reclamationHistory/addItem', historyEventItem)

      this.decision = foundDecision
      this.decisionDate = this.modalFormDecisionDate
      this.decisionDescription = this.modalFormDecisionDesc

      await this.$store.dispatch('reclamations/update', this.object)

      this.showChangeDecisionForm = false
    },

    getStatusDescription() {
      let description = 'Nie określono'
      if (this.status) {
        description = this.status.description
      }

      return description
    },

    getDecisionDescription() {
      let description = 'Nie określono'
      if (this.decision) {
        description = this.decision.description
      }

      return description
    },

    getAuthorName() {
      let name = 'Nie określono'
      if (this.author) {
        name = this.author.name
      }

      return name
    },
  },
}
</script>

<template>
  <div>
    <div class="card mb-2">
      <div class="card-body pl-2 pb-3 pr-2 pt-2">
        <b-row>
          <b-col>
            <b-form-group horizontal :label-cols="3" label="Data przyjęcia">
              <date-picker id="reclDate" v-model="inputDate" size="sm" value-type="date" type="date"></date-picker>
            </b-form-group>
          </b-col>
        </b-row>
        <!-- <b-row>
          <b-col>
            <p class="mb-1">
              Ilość dni : <b>{{ getOrderTypeExecutionDays(docType) }}</b>
            </p>
          </b-col>
        </b-row> -->
        <b-row>
          <b-col>
            <b-form-group horizontal :label-cols="3" label="Termin">
              <date-picker id="reclExecutionTerm" v-model="executionTerm" size="sm" value-type="date" type="date"></date-picker>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <b-form-group horizontal :label-cols="3" label="Data zamknięcia">
              <date-picker id="reclExecutionDate" v-model="executionDate" size="sm" value-type="date" type="date"></date-picker>
            </b-form-group>
          </b-col>
        </b-row>

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
            <b-form-group horizontal :label-cols="3" label="Typ zlecenia">
              <f-select v-model="type" size="sm" select-btn value-type="reclamationTypes" detail-view="user-detail" placeholder="Wyszukaj typ..." label="description"></f-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group horizontal :label-cols="3" label="Realizacja">
              <f-select v-model="executionType" size="sm" select-btn value-type="reclamationExecutionTypes" detail-view="user-detail" placeholder="Wyszukaj realizacje..." label="description"></f-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <p class="mb-1">
              Status: <br />
              <b>{{ getStatusDescription() }}</b>
            </p>
          </b-col>
          <div v-if="!object.isNew" class="input-group-append">
            <b-button variant="outline-secondary" class="ml-1 pl-2 mr-2 mb-1 btn-sm" @click="beforeStatusChange"> <i class="ri-edit-box-line"></i> Zmień status </b-button>
          </div>
        </b-row>
        <p></p>
        <!-- <b-row v-if="newDocumentMode===false">
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
        </b-row> -->

        <b-row v-if="!object.isNew">
          <b-col>
            <p class="mb-1">
              Decyzja: <br />
              <b>{{ getDecisionDescription() }}</b>
            </p>
          </b-col>
          <div class="input-group-append">
            <b-button v-if="!clientsRestrictions" variant="outline-secondary" class="ml-1 pl-1 mr-2 mb-1 btn-sm" @click="beforeDecisionChange">
              <i class="ri-edit-box-line"></i> Zmień decyzję
            </b-button>
          </div>
        </b-row>
        <p></p>
        <b-row v-if="!object.isNew">
          <b-col>
            <p class="mb-1">
              Data decyzji:
              <b class="ml-4">{{ decisionDate }}</b>
            </p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <p class="mb-1">
              Użytkownik:
              <b class="ml-4">{{ getAuthorName() }}</b>
            </p>
          </b-col>
        </b-row>
      </div>

      <!-- <b-button v-b-modal.change-status-form variant="primary">Standard Modal</b-button> -->
      <b-modal v-model="showChangeStatusForm" title="Zmiana statusu" title-class="font-18" hide-footer>
        <b-form-group label="Wybierz nowy status" label-for="recl_status">
          <b-form-select id="recl_status" v-model="modalFormStatus" :options="reclamationStatuses" text-field="description" value-field="id" name="recl_status" />
        </b-form-group>
        <b-form-group label="Komentarz" label-for="comment" class="mb-3">
          <b-form-textarea id="comment" v-model="modalFormStatusDesc" rows="5"></b-form-textarea>
        </b-form-group>

        <div class="text-right pt-2 pb-2">
          <b-button type="submit" variant="success" class="ml-1" @click="changeStatus">Zmień status</b-button>
          <b-button variant="light" @click="showChangeStatusForm = false">Anuluj</b-button>
        </div>
      </b-modal>

      <b-modal id="change-decision-form" v-model="showChangeDecisionForm" title="Zmiana decyzji" title-class="font-18" hide-footer>
        <b-form-group label="Data decyzji" label-for="decisionDate">
          <date-picker id="decisionDate" v-model="modalFormDecisionDate" size="sm" value-type="date" type="date"></date-picker>
        </b-form-group>

        <b-form-group label="Wybierz decyzję" label-for="recl_decision">
          <b-form-select id="recl_decision" v-model="modalFormDecision" :options="reclamationDecisions" text-field="description" value-field="id" name="recl_decision" />
        </b-form-group>
        <b-form-group label="Uzasadnienie" label-for="decisionComment" class="mb-3">
          <b-form-textarea id="decisionComment" v-model="modalFormDecisionDesc" rows="5"> </b-form-textarea>
        </b-form-group>

        <div class="text-right pt-2 pb-2">
          <b-button type="submit" variant="success" class="ml-1" @click="changeDecision">Zmień decyzję</b-button>
          <b-button variant="light" @click="showChangeDecisionForm = false">Anuluj</b-button>
        </div>
      </b-modal>
    </div>

    <div v-if="!sideBarRestrictions" class="card mb-2">
      <div class="card-body l-2 pb-0 pr-2 pt-2">
        <b-row>
          <b-col>
            <b-form-group horizontal :label-cols="3" label="Konstruktor">
              <f-select v-model="responsible" size="sm" select-btn open-btn value-type="users" detail-view="user-detail" placeholder="Wyszukaj konstruktora..."></f-select>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </div>

    <div v-if="!sideBarRestrictions" class="card mb-2">
      <div class="card-body l-2 pb-0 pr-2 pt-2">
        <b-row>
          <b-col>
            <b-form-group horizontal :label-cols="3" :label="$t('table.manager')">
              <f-select v-model="manager" size="sm" select-btn open-btn value-type="employees" detail-view="employee-detail" placeholder="Wyszukaj handlowca..."></f-select>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </div>

    <div v-if="!sideBarRestrictions" class="card mb-2">
      <div class="card-body l-2 pb-0 pr-2 pt-2">
        <b-row>
          <b-col>
            <b-form-group horizontal :label-cols="3" :label="$t('table.executor')">
              <f-select v-model="executor" size="sm" select-btn open-btn value-type="users" detail-view="user-detail" placeholder="Wyszukaj executor..."></f-select>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>
