<script>
import PossitionForm from './possition_form.vue'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'TaskPositions',

  components: {
    PossitionForm,
  },
  props: {
    mode: {
      type: String,
      default: 'vertical',
    },
  },
  data() {
    return {
      menuItems: '',
      orderData: [],
      menuRef: null,
      reclamationExecutionTypes: [],
      reclamationDecisions: [],
      reclamationSubjects: [],

      reclamationReasons: [],
      reclamationPerpetrators: [],

      questionMessage: '',
      showQuestion: false,
    }
  },
  computed: {
    ...mapGetters({
      openReclamation: 'reclamations/openReclamation',
      getModalPossitionFormValue: 'reclamations/getModalPossitionFormValue',
    }),

    _showModalPossitionForm: {
      get() {
        return this.getModalPossitionFormValue
      },
      set(value) {
        this.setShowModalPossitionForm(value)
      },
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
    this.initialize()
  },

  methods: {
    ...mapMutations({
      setShowModalPossitionForm: 'reclamations/setShowModalPossitionForm',
      setOpenPossitionIndex: 'reclamations/setOpenPossitionIndex',
    }),

    async openModalPossitionForm() {
      const hasEmptyObligatoryAttributes = await this.$store.dispatch('reclamations/hasEmptyObligatoryAttributes')
      if (hasEmptyObligatoryAttributes) {
        this.questionMessage = 'Najpierw musisz uzupełnić wszystkie obowiązkowe atrybuty!'
        this.showQuestion = true
      } else {
        await this.saveChanges()
        this.setOpenPossitionIndex(0)
        this.setShowModalPossitionForm(true)
      }
    },

    async saveChanges() {
      let res
      if (this.openReclamation.id !== null) {
        res = await this.$store.dispatch('reclamations/updateReclamation', this.openReclamation)
      } else {
        res = await this.$store.dispatch('reclamations/addReclamation', this.openReclamation)
      }
    },

    editPossition(curIndex) {
      this.setOpenPossitionIndex(curIndex)
      this.setShowModalPossitionForm(true)
    },

    getExecutionTypeDescription(curId) {
      const found = this.reclamationExecutionTypes.find((el) => el.id === curId)
      if (found) {
        return found.description
      } else return 'nie określono'
    },

    getDecisionDescription(curId) {
      const found = this.reclamationDecisions.find((el) => el.id === curId)
      if (found) {
        return found.description
      } else return 'nie określono'
    },

    getPerpetratorDescription(curId) {
      const found = this.reclamationPerpetrators.find((el) => el.id === curId)
      if (found) {
        return found.description
      } else return 'nie określono'
    },

    getReclamationReasonDescription(curId) {
      const found = this.reclamationReasons.find((el) => el.id === curId)
      if (found) {
        return found.description
      } else return 'nie określono'
    },

    getSubjectDescription(curId) {
      const found = this.reclamationSubjects.find((el) => el.id === curId)
      if (found) {
        return found.description
      } else return 'nie określono'
    },

    onOkModalQuestion() {
      this.closeAndClearModalQuestion()
    },

    closeAndClearModalQuestion() {
      this.questionMessage = ''
      this.showQuestion = false
    },

    async initialize() {
      this.reclamationSubjects = await this.$store.dispatch('reclamationSubjects/findAll', {})
      this.reclamationExecutionTypes = await this.$store.dispatch('reclamationExecutionTypes/findAll', {})
      this.reclamationDecisions = await this.$store.dispatch('reclamationDecisions/findAll', {})
      this.reclamationReasons = await this.$store.dispatch('reclamationReasons/findAll', {})
      this.reclamationPerpetrators = await this.$store.dispatch('reclamationPerpetrators/findAll', {})
    },
  },
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-lg-6">
          <h4>Pozycje</h4>
        </div>
        <div class="col-lg-6">
          <div class="text-lg-right">
            <b-button variant="outline-secondary mb-1" class="btn ml-1" @click="openModalPossitionForm"> <i class="ri-add-line mr-1"></i> Dodaj </b-button>
          </div>
        </div>
        <!-- end col-->
      </div>
      <div class="table-responsive">
        <table class="table table-centered mb-0">
          <thead class="thead-light">
            <tr>
              <th>LP</th>
              <th>Pozycja</th>
              <th>Ilość prod.</th>
              <th>Kwatera</th>
              <th>Przedmiot</th>
              <th>Opis</th>
              <!-- <th>Wykonane</th> -->
              <th>Decyzja</th>
              <th>Odpowiedzialność</th>
              <th>Powód</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="possition of openReclamation.possitions" :key="possition.possitionIndex">
              <td>
                <a href="javascript:void(0);" class="btn btn-light" @click="editPossition(possition.possitionIndex)">
                  <i class="ri-search-line"></i>
                  {{ possition.possitionIndex }}
                </a>
              </td>
              <td>
                {{ possition.possitionWh }}
              </td>
              <td>
                {{ possition.quantity }}
              </td>
              <td>
                {{ possition.kwatera }}
              </td>
              <td>
                {{ getSubjectDescription(possition.reclamationSubject) }}
              </td>
              <td>{{ possition.comment }}</td>
              <!-- <td>{{ getExecutionTypeDescription(possition.reclamationExecutionType) }}</td> -->
              <td>{{ getDecisionDescription(possition.reclamationDecision) }}</td>

              <td>{{ getPerpetratorDescription(possition.perpetrator) }}</td>
              <td>{{ getReclamationReasonDescription(possition.reclamationReason) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <b-modal v-model="showQuestion" title="Uwaga!">
      <p class="my-4">{{ questionMessage }}</p>
      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button-toolbar class="float-right">
            <b-button variant="success" size="sm" @click="onOkModalQuestion"> OK </b-button>
          </b-button-toolbar>
        </div>
      </template>
    </b-modal>

    <b-modal id="modal-possition-form" v-model="_showModalPossitionForm" title="Dodanie / Edycja pozycji zamówienia reklamacyjnego" size="lg" hide-footer>
      <PossitionForm></PossitionForm>
    </b-modal>
  </div>
</template>
