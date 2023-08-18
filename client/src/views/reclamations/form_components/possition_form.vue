<script>
import { uuid } from 'vue-uuid'
import { mapGetters, mapMutations } from 'vuex'
import Vue from 'vue'

export default {
  name: 'ReclPositionForm',

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
    currentPossition: {
      type: Object,
    }
  },
  data() {
    return {
      possition: {}
    }
  },

  async created() {
    if(this.currentPossition != null) {
      this.possition = this.currentPossition
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

    pendingPossitions: {
      get() {
        return this.objectView ? this.object.pendingPossitions : []
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'pendingPossitions', value })
      },
    },

    possitionWh: {
      get() {
        return this.possition ? this.possition.possitionWh : ''
      },
      set(value) {
        Vue.set(this.possition, 'possitionWh', value)
      },
    },

    quantity: {
      get() {
        return this.possition ? this.possition.quantity : ''
      },
      set(value) {
        Vue.set(this.possition, 'quantity', value)
      },
    },

    kwatera: {
      get() {
        return this.possition ? this.possition.kwatera : ''
      },
      set(value) {
        Vue.set(this.possition, 'kwatera', value)
      },
    },

    comment: {
      get() {
        return this.possition ? this.possition.comment : ''
      },
      set(value) {
        Vue.set(this.possition, 'comment', value)
      },
    },

    _reclamationExecutionType: {
      get() {
        return this.possition ? this.possition._reclamationExecutionType : ''
      },
      set(value) {
        Vue.set(this.possition, '_reclamationExecutionType', value)
        Vue.set(this.possition, 'executionTypeId', value ? value.id : value)
      },
    },

    _reclamationReason: {
      get() {
        return this.possition ? this.possition._reclamationReason : ''
      },
      set(value) {
        Vue.set(this.possition, '_reclamationReason', value)
        Vue.set(this.possition, 'reclamationReasonId', value ? value.id : value)
      },
    },

    _reclamationSubject: {
      get() {
        return this.possition ? this.possition._reclamationSubject : ''
      },
      set(value) {
        Vue.set(this.possition, '_reclamationSubject', value)
        Vue.set(this.possition, 'reclamationSubjectId', value ? value.id : value)
      },
    },

    _reclamationDecision: {
      get() {
        return this.possition ? this.possition._reclamationDecision : ''
      },
      set(value) {
        Vue.set(this.possition, '_reclamationDecision', value)
        Vue.set(this.possition, 'reclamationDecisionId', value ? value.id : value)
      },
    },

    _perpetrator: {
      get() {
        return this.possition ? this.possition._perpetrator : ''
      },
      set(value) {
        Vue.set(this.possition, '_perpetrator', value)
        Vue.set(this.possition, 'reclamationPerpetratorId', value ? value.id : value)
      },
    },

    _clientDemand: {
      get() {
        return this.possition ? this.possition._clientDemand : ''
      },
      set(value) {
        Vue.set(this.possition, '_clientDemand', value)
        Vue.set(this.possition, 'reclamationClientDemandId', value ? value.id : value)
      },
    },
  },

  methods: {
    ...mapMutations({
      setObjectProperty: 'reclamations/setObjectProperty',
      setShowModalPossitionForm: 'reclamations/setShowModalPossitionForm',
    }),

    async writeObject() {
      const saveObject = {
        id: this.possition.id,
        kwatera: this.possition.kwatera,
        comment: this.possition.comment,
        quantity: this.possition.quantity,
        possitionWh: this.possition.possitionWh,
        reclamationId: this.viewId,
        executionTypeId: this.possition._reclamationExecutionType ? this.possition._reclamationExecutionType.id : undefined,
        reclamationReasonId: this.possition._reclamationReason ? this.possition._reclamationReason.id : undefined,
        reclamationSubjectId: this.possition._reclamationSubject ? this.possition._reclamationSubject.id : undefined,
        reclamationDecisionId: this.possition._reclamationDecision ? this.possition._reclamationDecision.id : undefined,
        reclamationPerpetratorId: this.possition._perpetrator ? this.possition._perpetrator.id : undefined,
        reclamationClientDemandId: this.possition._clientDemand ? this.possition._clientDemand.id : undefined,
      }

      const response = await this.$store.dispatch('reclamations/findAllReclamations', {
        params: {
          filter: {
            id: this.viewId
          }
        }
      })

      if(response.data.length > 0) {
        if (this.possition.id === null || this.possition.id === undefined) {
          await this.$store
            .dispatch('reclamationItems/create', saveObject)
            .then((res) => {
              this.$bvToast.toast('Pozycja została zapisana', {
                title: this.$tc('common.msg'),
                variant: 'success',
                solid: true,
                autoHideDelay: 5000,
              })
              this.close()
            })
            .catch((err) => {
              this.$bvToast.toast(`Błąd zapisu pozycji ${err}`, {
                title: this.$tc('common.msg'),
                variant: 'danger',
                solid: true,
                autoHideDelay: 5000,
              })
            })
        } else {
          await this.$store
            .dispatch('reclamationItems/update', saveObject)
            .then((res) => {
              this.$bvToast.toast('Pozycja została zapisana', {
                title: this.$tc('common.msg'),
                variant: 'success',
                solid: true,
                autoHideDelay: 5000,
              })
              this.close()
            })
            .catch((err) => {
              this.$bvToast.toast(`Błąd zapisu pozycji ${err}`, {
                title: this.$tc('common.msg'),
                variant: 'danger',
                solid: true,
                autoHideDelay: 5000,
              })
            })
        }
      } else {
        this.possition.id = uuid.v4()

        let currentPossitions = this.pendingPossitions;

        if(!currentPossitions) {
          currentPossitions = []
        }

        this.possition.reclamationId = this.viewId

        for(let i = 0; i < currentPossitions.length; i++) {
          if(currentPossitions[i].id === this.possition.id) {
            currentPossitions.splice(i, 1)
          }
        }

        currentPossitions.push(this.possition)
        this.pendingPossitions = currentPossitions
        this.close()
      }
    },

    async close() {
      this.possition = {}
      this.setShowModalPossitionForm(false)
    },
  },
}
</script>

<template>
  <b-card>
    <b-row class="mb-2">
      <b-col md="4">
        <b-form-group label="Pozycja">
          <b-form-input id="possition-field" min="0" size="sm" type="number" v-model="possitionWh" placeholder="Pozycja"> </b-form-input>
        </b-form-group>
      </b-col>
      <b-col md="4">
        <b-form-group label="Ilość produktów">
          <b-form-input id="prod-quantity-field" min="0" size="sm" type="number" v-model="quantity" placeholder="Ilość produktów"> </b-form-input>
        </b-form-group>
      </b-col>
      <b-col md="4">
        <b-form-group label="Kwatera">
          <b-form-input id="kwatera-field" size="sm" v-model="kwatera" placeholder="Kwatera"> </b-form-input>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row class="mb-2">
      <b-col md="12">
        <b-form-group label="Przedmiot">
          <f-select v-model="_reclamationSubject" select-btn size="sm" value-type="reclamationSubjects" placeholder="Wyszukaj przedmiot..." label="description"></f-select>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row class="mb-2">
      <b-col md="12">
        <b-form-group label="Opis">
          <b-form-textarea id="comment" size="sm" v-model="comment" rows="5"> </b-form-textarea>
        </b-form-group>
      </b-col>
    </b-row>
    
    <b-row class="mb-2">
      <b-col md="6">
        <b-form-group label="Wykonanie">
          <f-select v-model="_reclamationExecutionType" select-btn size="sm" value-type="reclamationExecutionTypes" placeholder="Wyszukaj wykonanie..." label="description"></f-select>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Decyzja">
          <f-select v-model="_reclamationDecision" select-btn size="sm" value-type="reclamationDecisions" placeholder="Wyszukaj decyzje..." label="description"></f-select>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row class="mb-2">
      <b-col md="6">
        <b-form-group label="Odpowiedzialność">
          <f-select v-model="_perpetrator" select-btn size="sm" value-type="reclamationPerpetrators" placeholder="Wyszukaj odpowiedzialnego..." label="description"></f-select>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Powód">
          <f-select v-model="_reclamationReason" select-btn size="sm" value-type="reclamationReasons" placeholder="Wyszukaj powód..." label="description"></f-select>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row class="mb-2">
      <b-col md="6">
        <b-form-group label="Oczekiwanie klienta">
          <f-select v-model="_clientDemand" select-btn size="sm" value-type="reclamationClientDemands" placeholder="Wyszukaj oczekiwanie..." label="description"></f-select>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row class="mb-2">
      <b-col>
        <b-button variant="success" @click="writeObject" class="mr-1" size="sm">
          <i class="ri-file-add-line mr-1"></i>
          {{ $t('commands.write') }}
        </b-button>
        <b-button variant="outline-secondary" class="mr-1" @click="close" size="sm">
          <i class="ri-file-excel-line mr-1"></i>
          {{ $t('commands.close') }}
        </b-button>
      </b-col>
    </b-row>
    <!-- <div class="row align-items-center">
      <div class="col-6">
        <div class="text-left pb-2 pl-2">
          <b-button type="submit" variant="success" class="mr-2" @click="saveChanges">Zapisz zmiany</b-button>
          <b-button variant="light" class="mr-2" @click="cancelItemModification">Anuluj</b-button>
        </div>
      </div>

      <div class="col-6" v-if="openPossitionIndex !== 0">
        <div class="text-right pb-2 pr-2">
          <b-button variant="danger" @click="deletePossition">Usuń</b-button>
        </div>
      </div>
    </div> -->
  </b-card>
</template>
