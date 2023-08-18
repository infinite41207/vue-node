<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'TaskPositionForm',
  components: {},
  props: {
    mode: {
      type: String,
      default: 'vertical',
    },
  },
  data() {
    return {
      possitionWh: 0,
      quantity: 0,
      kwatera: '',
      comment: '',

      possitionsArray: [],
      reclamationSubject: null,
      reclamationSubjects: [],

      reclamationExecutionType: null,
      reclamationExecutionTypes: [],

      reclamationDecision: null,
      reclamationDecisions: [],

      perpetrator: null,
      reclamationPerpetrators: [],
      reclamationReason: null,
      reclamationReasons: [],
    }
  },

  computed: {
    ...mapGetters({
      openReclamation: 'reclamations/openReclamation',
      openPossitionIndex: 'reclamations/openPossitionIndex',
    }),

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
      setShowModalPossitionForm: 'reclamations/setShowModalPossitionForm',
      setOpenPossitionIndex: 'reclamations/setOpenPossitionIndex',
    }),

    async initialize() {
      this.reclamationSubjects = await this.$store.dispatch('reclamationSubjects/findAll', {})
      this.reclamationExecutionTypes = await this.$store.dispatch('reclamationExecutionTypes/findAll', {})
      this.reclamationDecisions = await this.$store.dispatch('reclamationDecisions/findAll', {})
      this.reclamationReasons = await this.$store.dispatch('reclamationReasons/findAll', {})
      this.reclamationPerpetrators = await this.$store.dispatch('reclamationPerpetrators/findAll', {})

      if (this.openReclamation.possitions) {
        this.possitionsArray = JSON.parse(JSON.stringify(this.openReclamation.possitions))
        if (this.openPossitionIndex) {
          const foundPossition = this.possitionsArray.find((item) => item.possitionIndex === this.openPossitionIndex)
          if (foundPossition) {
            this.possitionWh = foundPossition.possitionWh
            this.quantity = foundPossition.quantity
            this.kwatera = foundPossition.kwatera
            this.comment = foundPossition.comment
            this.reclamationSubject = foundPossition.reclamationSubject
            this.reclamationExecutionType = foundPossition.reclamationExecutionType
            this.reclamationDecision = foundPossition.reclamationDecision
            this.perpetrator = foundPossition.perpetrator
            this.reclamationReason = foundPossition.reclamationReason
          }
        }
      }
    },

    getNextPossitionIndex() {
      let newPossitionIndex = 0
      this.possitionsArray.forEach((item, index) => {
        newPossitionIndex = Math.max(item.possitionIndex, newPossitionIndex)
      })
      return newPossitionIndex + 1
    },

    saveChanges() {
      if (this.openPossitionIndex === 0) {
        const nextPossitionIndex = this.getNextPossitionIndex()
        this.possitionsArray.push({
          possitionIndex: nextPossitionIndex,
          possitionWh: this.possitionWh,
          quantity: this.quantity,
          kwatera: this.kwatera,
          reclamationSubject: this.reclamationSubject,
          comment: this.comment,
          reclamationExecutionType: this.reclamationExecutionType,
          reclamationDecision: this.reclamationDecision,
          perpetrator: this.perpetrator,
          reclamationReason: this.reclamationReason,
        })
      } else {
        const foundPossition = this.possitionsArray.find((item) => item.possitionIndex === this.openPossitionIndex)
        if (foundPossition) {
          foundPossition.possitionWh = this.possitionWh
          foundPossition.quantity = this.quantity
          foundPossition.kwatera = this.kwatera
          foundPossition.comment = this.comment
          foundPossition.reclamationSubject = this.reclamationSubject
          foundPossition.reclamationExecutionType = this.reclamationExecutionType
          foundPossition.reclamationDecision = this.reclamationDecision
          foundPossition.perpetrator = this.perpetrator
          foundPossition.reclamationReason = this.reclamationReason
        }
      }
      this.setReclamationProperty({
        property: 'possitions',
        value: this.possitionsArray,
      })
      this.setShowModalPossitionForm(false)
      this.setOpenPossitionIndex(0)
    },

    deletePossition() {
      const filteredArray = this.possitionsArray.filter((e) => e.possitionIndex !== this.openPossitionIndex)

      let possitionIndex = 1
      filteredArray.forEach((item) => {
        item.possitionIndex = possitionIndex
        possitionIndex = possitionIndex + 1
      })

      this.setReclamationProperty({
        property: 'possitions',
        value: filteredArray,
      })
      this.setShowModalPossitionForm(false)
      this.setOpenPossitionIndex(0)
    },

    cancelItemModification() {
      this.setShowModalPossitionForm(false)
    },
  },
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <b-row class="mb-2">
        <b-col md="12">
          <b-form-group label="Opis" label-for="comment" class="mb-3">
            <b-form-textarea id="comment" v-model="comment" rows="5"> </b-form-textarea>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row class="mb-2">
        <b-col md="4">
          <label for="name">Pozycja</label>
          <b-form-input id="possition-field" type="number" v-model="possitionWh" :disabled="true" placeholder="Pozycja"> </b-form-input>
        </b-col>
        <b-col md="4">
          <label for="surname">Ilość produktów</label>
          <b-form-input id="prod-quantity-field" type="number" v-model="quantity" :disabled="true" placeholder="Ilość produktów"> </b-form-input>
        </b-col>
        <b-col md="4">
          <label for="kwatera-field">Kwatera</label>
          <b-form-input id="kwatera-field" v-model="kwatera" :disabled="true" placeholder="Kwatera"> </b-form-input>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <b-form-group label="Przedmiot" label-for="reclamation_subjectId">
            <b-input-group class="mb-2">
              <b-form-select
                id="reclamation_subjectId"
                name="reclamation_subjectName"
                v-model="reclamationSubject"
                :options="reclamationSubjects"
                :disabled="true"
                text-field="description"
                value-field="id"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mb-2" v-if="!clientsRestrictions">
        <b-col md="6">
          <b-form-group label="Wykonanie" label-for="reclamation_ExecutionTypeId">
            <b-input-group class="mb-2">
              <b-form-select
                id="reclamation_ExecutionTypeId"
                name="reclamation_ExecutionTypeName"
                v-model="reclamationExecutionType"
                :disabled="true"
                :options="reclamationExecutionTypes"
                text-field="description"
                value-field="id"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Decyzja" label-for="reclamation_decisionId">
            <b-input-group class="mb-2">
              <b-form-select
                id="reclamation_decisionId"
                name="reclamation_decisionName"
                v-model="reclamationDecision"
                :options="reclamationDecisions"
                :disabled="true"
                text-field="description"
                value-field="id"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row v-if="!clientsRestrictions" class="mb-2">
        <b-col>
          <b-form-group label="Odpowiedzialność" label-for="perpetratorId">
            <b-form-select
              id="perpetratorId"
              v-model="perpetrator"
              :options="reclamationPerpetrators"
              :disabled="true"
              text-field="description"
              value-field="id"
              name="perpetrator"
            />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Powód" label-for="recl_reason">
            <b-form-select
              id="recl_reason"
              v-model="reclamationReason"
              :options="reclamationReasons"
              :disabled="true"
              text-field="description"
              value-field="id"
              name="recl_reasonname"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </div>

    <div class="row align-items-center">
      <div class="col-6">
        <div class="text-left pb-2 pl-2">
          <b-button type="submit" variant="success" class="mr-2" @click="saveChanges">Zapisz zmiany</b-button>
          <b-button variant="light" class="mr-2" @click="cancelItemModification">Anuluj</b-button>
        </div>
      </div>
    </div>
  </div>
</template>
