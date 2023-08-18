<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'ReclHistory',

  components: {},
  props: {
    mode: {
      type: String,
      default: 'vertical',
    },
    viewId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      historyEventsData: [],
      historyEventId: 0,
      comment: '',
      reclamationActionTypes: [],
      showModalHistoryForm: false,
      showModalQuestion: false,
      questionAction: null,
      questionParams: null,
      questionMessage: '',
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'reclamations/objectView',
      openReclamation: 'reclamations/openReclamation',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    clientsRestrictions() {
      if (this.$attrs.user) {
        return this.$attrs.user.externalUser
      } else {
        return false
      }
    },

    status: {
      get() {
        return this.openReclamation.status
      },
    },
    decision: {
      get() {
        return this.openReclamation.decision
      },
    },
    decisionDate: {
      get() {
        return this.openReclamation.decisionDate
      },
    },
  },

  watch: {
    status(newVal, oldVal) {
      this.initialize()
    },
    decision(newVal, oldVal) {
      this.initialize()
    },
    decisionDate(newVal, oldVal) {
      this.initialize()
    },
  },

  async mounted() {
    this.initialize()
  },

  methods: {
    async initialize() {
      const response = await this.$store.dispatch('reclamationHistory/findAll', { params: { filter: { reclamationId: this.object.id }}})
      this.historyEventsData = response.data
      this.reclamationActionTypes = await this.$store.dispatch('reclamations/getReclamationActionTypes')
    },

    getAuthorName(authorObj) {
      if (authorObj) {
        return authorObj.name
      } else return 'Nie określono'
    },

    getActionTypeDescription(currentActionType) {
      const foundAction = this.reclamationActionTypes.find((el) => el.id === currentActionType)
      if (foundAction) {
        return foundAction.description
      } else return 'Nie określono'
    },

    async addHistoryEvent() {
      const historyEventItem = {
        reclamationId: this.object.id,
        actionDate: new Date(),
        // actionDate: moment(new Date()).format('YYYY.MM.DD HH:mm:ss'),
        actionId: 2,
        comment: this.comment,
      }

      if (this.historyEventId === 0) {
        await this.$store.dispatch('reclamationHistory/create', historyEventItem)
      } else {
        historyEventItem.id = this.historyEventId
        await this.$store.dispatch('reclamationHistory/update', historyEventItem)
      }

      this.initialize()
      this.showModalHistoryForm = false

      this.clearCurrentHistoryEventValues()
    },

    editHistoryEvent(historyEvent) {
      this.historyEventId = historyEvent.id
      this.comment = historyEvent.comment
      this.showModalHistoryForm = true
    },

    async beforeDeleteItem() {
      this.questionMessage = 'Czy na pewno chcesz usunąć element z bazy danych?'

      const historyEventItem = {
        id: this.historyEventId,
      }

      this.questionAction = this.deleteItem
      this.questionParams = historyEventItem
      this.showModalQuestion = true
      // this.$bvModal.show('modal-question')
    },

    clearCurrentHistoryEventValues() {
      this.historyEventId = 0
      this.comment = ''
    },

    async deleteItem(deleteItem) {
      await this.$store.dispatch('reclamationHistory/delete', deleteItem)
      this.questionAction = null
      this.questionParams = null
      this.questionMessage = ''

      this.clearCurrentHistoryEventValues()
      this.showModalQuestion = false
      // this.$bvModal.hide('modal-question')
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
      this.showModalHistoryForm = false
      await this.initialize()
    },

    closeAndClearModalQuestion() {
      this.questionAction = null
      this.questionParams = null
      this.questionMessage = ''
      this.showModalQuestion = false
      // this.$bvModal.hide('modal-question')
    },

    cancelItemModification() {
      this.clearCurrentHistoryEventValues()
      this.showModalHistoryForm = false
    },

    getFormatedDate(curDate) {
      return moment(curDate).format('DD MM YYYY HH:mm')
    },
  },
}
</script>

<template>
  <div class="card mb-1">
    <div class="card-body pl-2 pb-1 pr-2 pt-2">
      <div class="d-flex align-items-start">
        <b-button v-b-toggle.collapse-6 size="sm" variant="outline-secondary">
          <i class="ri-pencil-fill"></i>
        </b-button>
        <div class="w-100 overflow-hidden ml-2">
          <div class="row">
            <div class="col-lg-6">
              <h5>Historia</h5>
            </div>
            <div class="col-lg-6">
              <div class="text-lg-right">
                <b-button variant="outline-secondary mb-1" class="btn ml-1 btn-sm" @click="showModalHistoryForm = true">
                  <i class="ri-add-line mr-1"></i> Dodaj komentarz
                </b-button>
              </div>
            </div>
          </div>
          <b-collapse id="collapse-6" class="mt-0">
            <div class="table-responsive">
              <table class="table table-centered mb-0">
                <thead class="thead-light">
                  <tr>
                    <th></th>
                    <th>Data</th>
                    <th>Użytkownik</th>
                    <th>Akcja</th>
                    <th>Komentarz</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="historyEvent of historyEventsData" :key="historyEvent.id">
                    <td>
                      <a href="javascript:void(0);" class="btn btn-light" @click="editHistoryEvent(historyEvent)">
                        <i class="ri-search-line"></i>
                      </a>
                    </td>
                    <td>{{ getFormatedDate(historyEvent.actionDate) }}</td>
                    <td>{{ getAuthorName(historyEvent.author) }}</td>
                    <td>{{ getActionTypeDescription(historyEvent.actionId) }}</td>
                    <td>{{ historyEvent.comment }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </b-collapse>
        </div>
      </div>
    </div>

    <b-modal id="modal-history-form" v-model="showModalHistoryForm" title="Dodanie / Edycja historii" size="lg" hide-footer>
      <div class="card">
        <div class="card-body">
          <b-row class="mb-2">
            <b-col md="12">
              <b-form-group label="Komentarz" label-for="comment" class="mb-3">
                <b-form-textarea id="comment" v-model="comment" rows="5"> </b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </div>

        <div class="row align-items-center">
          <div class="col-6">
            <div class="text-left pb-2 pl-2">
              <b-button type="submit" variant="success" class="mr-2" @click="addHistoryEvent">Zapisz zmiany</b-button>
              <b-button variant="light" class="mr-2" @click="cancelItemModification">Anuluj</b-button>
            </div>
          </div>

          <div class="col-6">
            <div class="text-right pb-2 pr-2" v-if="!clientsRestrictions">
              <b-button variant="danger" @click="beforeDeleteItem">Usuń</b-button>
            </div>
          </div>
        </div>
      </div>
    </b-modal>

    <b-modal id="modal-question" v-model="showModalQuestion" title="Uwaga!">
      <p class="my-4">{{ questionMessage }}</p>
      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button-toolbar class="float-right">
            <b-button variant="danger" size="sm" class="mr-2" @click="onCancelModalQuestion"> Anuluj </b-button>

            <b-button variant="success" size="sm" @click="onOkModalQuestion"> OK </b-button>
          </b-button-toolbar>
        </div>
      </template>
    </b-modal>
  </div>
</template>
