<script>
import PossitionForm from '../form_components/possition_form.vue'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ReclPositions',

  components: {
    PossitionForm,
  },

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
      userSettingItemKey: 'reclamationsPossitionsRestrictEdit',
      permissionRestrictEdit: false,

      showModalTableForm: false,
      possitions: [],
      currentPossition: null,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'reclamations/objectView',
      getModalPossitionFormValue: 'reclamations/getModalPossitionFormValue',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    showModalPossitionForm: {
      get() {
        return this.getModalPossitionFormValue
      },
      set(value) {
        this.setShowModalPossitionForm(value)
      },
    },
  },

  async mounted() {
    this.initialize()
  },

  methods: {
    ...mapMutations({
      setShowModalPossitionForm: 'reclamations/setShowModalPossitionForm',
    }),

    editPossition(possition) {
      this.currentPossition = possition
      this.setShowModalPossitionForm(true)
    },

    async initialize() {
      const response = await this.$store.dispatch('reclamationItems/findAll', {
        params: {
          filter: {
            reclamationId: this.viewId,
          },
        },
      })
      this.possitions = response.data
      if (this.possitions.length < 1) {
        this.possitions = this.object.pendingPossitions
      }

      const authUser = await this.$store.state.auth.currentUser

      await this.$store
        .dispatch('userSettings/findByPk', {
          userId: authUser.id,
          userSettingItemKey: this.userSettingItemKey,
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
    },
  },

  watch: {
    showModalPossitionForm(newValue, oldValue) {
      this.initialize()
    },
  },
}
</script>

<template>
  <b-card class="mb-2 pl-0 pb-0 pr-0 pt-0" height="100%">
    <div class="card-body pl-0 pb-0 pr-0 pt-0">
      <div class="row">
        <div class="col-lg-8">
          <h5>Pozycje</h5>
        </div>
        <div class="col-lg-4">
          <div class="text-lg-right">
            <b-button
              size="sm"
              variant="outline-secondary"
              @click="
                showModalPossitionForm = true
                currentPossition = null
              "
            >
              <i class="ri-add-fill"></i>
            </b-button>
            <b-button class="ml-1" size="sm" variant="outline-secondary" @click="showModalTableForm = true">
              <i class="ri-pencil-fill"></i>
            </b-button>
          </div>
        </div>
      </div>
      <b-input-group class="mt-2" style="height: 50px; overflow: hidden">
        <p v-for="(possition, index) of this.possitions" :key="possition.possitionIndex">
          {{ index + ': ' + possition._reclamationSubject.description + ', ' + possition.comment }}
        </p>
      </b-input-group>
    </div>

    <b-modal id="modal-edit-table-form" v-model="showModalTableForm" title="Pozycje" size="xl" hide-footer>
      <div>
        <div class="row">
          <div class="text-lg-right">
            <b-button
              variant="outline-secondary mb-1"
              class="btn ml-1 btn-sm"
              @click="
                showModalPossitionForm = true
                currentPossition = null
              "
            >
              <i class="ri-add-line mr-1"></i> Dodaj
            </b-button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-centered mb-0">
            <thead class="thead-light">
              <tr>
                <th style="width: 20px">
                  <div class="custom-control custom-checkbox">
                    <input id="customCheck" type="checkbox" class="custom-control-input" />
                    <label class="custom-control-label" for="customCheck">&nbsp;</label>
                  </div>
                </th>
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
              <tr v-for="(possition, index) of this.possitions" :key="possition.possitionIndex">
                <td>
                  <div class="custom-control custom-checkbox">
                    <input :id="`customCheck${index}`" type="checkbox" class="custom-control-input" />
                    <label class="custom-control-label" :for="`customCheck${index}`">&nbsp;</label>
                  </div>
                </td>
                <td>
                  <a href="javascript:void(0);" class="btn btn-light" @click="editPossition(possition)">
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
                  {{ possition._reclamationSubject ? possition._reclamationSubject.description : 'Nie określono' }}
                </td>
                <td>{{ possition.comment }}</td>
                <!-- <td>{{ getExecutionTypeDescription(possition.reclamationExecutionType) }}</td> -->
                <td>{{ possition._reclamationDecision ? possition._reclamationDecision.description : 'Nie określono' }}</td>
                <td>{{ possition._perpetrator ? possition._perpetrator.description : 'Nie określono' }}</td>
                <td>{{ possition._reclamationReason ? possition._reclamationReason.description : 'Nie określono' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </b-modal>

    <b-modal id="modal-possition-form" v-model="showModalPossitionForm" title="Dodanie / Edycja pozycji zamówienia reklamacyjnego" size="lg" hide-footer>
      <PossitionForm :view-id="viewId" :currentPossition="currentPossition"></PossitionForm>
    </b-modal>
  </b-card>
</template>
