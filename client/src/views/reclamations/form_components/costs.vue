<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ReclCost',

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
      menuItems: '',
      orderData: [],
      menuRef: null,
      currentCostItemId: 0,
      currentCostArticle: 0,
      currentAmount: 0,

      costArticles: [],
      reclamationCosts: [],

      costString: '',

      questionMessage: '',
      showQuestion: false,
    }
  },
  computed: {
    ...mapGetters({
      getObjectView: 'reclamations/objectView',
      openReclamation: 'reclamations/openReclamation',
      getModalCostsFormValue: 'reclamations/getModalCostsFormValue',
      getModalPossitionFormValue: 'reclamations/getModalPossitionFormValue',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    _showModalCostsForm: {
      get() {
        return this.getModalCostsFormValue
      },
      set(value) {
        this.setShowModalCostsForm(value)
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
      setOpenCostsIndex: 'reclamations/setOpenCostsIndex',
      setShowModalCostsForm: 'reclamations/setShowModalCostsForm',
    }),

    clearCurrentCostValues() {
      this.currentCostItemId = 0
      this.currentAmount = 0
      this.currentCostArticle = 0
    },

    getCostArticleDescription(curId) {
      const found = this.costArticles.find((el) => el.id === curId)
      if (found) {
        return found.description
      } else return 'brak elementu w kartotece'
    },

    async fillAllCostsTypes() {
      if (this.reclamationCosts.length > 0) {
        alert('Można wypełniać tylko pustą tabelę!!!')
      } else {
        for (let i = 0; i < this.costArticles.length; i++) {
          const costRecord = {
            reclamationId: this.object.id,
            costArticleId: this.costArticles[i].id,
            amount: 0,
          }
          await this.$store.dispatch('reclamationCosts/create', costRecord)
        }
      }
      this.initialize()
    },

    async addCostRecord() {
      const costRecord = {
        reclamationId: this.object.id,
        costArticleId: this.currentCostArticle,
        amount: this.currentAmount,
      }

      if (this.currentCostItemId === 0) {
        await this.$store.dispatch('reclamationCosts/create', costRecord)
      } else {
        costRecord.id = this.currentCostItemId
        await this.$store.dispatch('reclamationCosts/update', costRecord)
      }

      this.initialize()
      this.setShowModalCostsForm(false)
      this.clearCurrentCostValues()
    },

    editCostItem(costItem) {
      this.currentCostItemId = costItem.id
      this.currentCostArticle = costItem.costArticleId
      this.currentAmount = costItem.amount

      this.setShowModalCostsForm(true)
    },

    async openModalForm() {
      // await this.saveChanges();
      // this.setOpenCostsIndex(0);
      this.setShowModalCostsForm(true)
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

    async beforeDeleteItem() {
      // this.questionMessage = 'Czy na pewno chcesz usunąć element z bazy danych?'

      const costItem = {
        id: this.currentCostItemId,
      }

      // this.questionAction = this.deleteItem;
      // this.questionParams = costItem;
      // this.$bvModal.show('modal-question')
      this.deleteItem(costItem)
    },

    async deleteItem(deleteItem) {
      await this.$store.dispatch('reclamationCosts/delete', deleteItem)
      this.setShowModalCostsForm(false)
      this.initialize()
      this.clearCurrentCostValues()
    },

    onCancelModalQuestion() {
      this.closeAndClearModalQuestion()
    },

    async cancelItemModification() {
      this.setShowModalCostsForm(false)
      this.initialize()
      this.clearCurrentCostValues()
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

    async initialize() {
      this.costArticles = await this.$store.dispatch('costArticles/findAll', {})
      const response = await this.$store.dispatch('reclamationCosts/findAll', { params: { filter: { reclamationId: this.object.id }}})
      this.reclamationCosts = response.data
      this.fillCostString()
    },

    fillCostString() {
      this.costString = ''
      for (const row of this.reclamationCosts) {
        this.costString += this.getCostArticleDescription(row.costArticleId) + ' = ' + row.amount + ', '
      }
    },
  },
}
</script>

<template>
  <div class="card mb-1">
    <div class="card-body pl-2 pb-1 pr-2 pt-2">
      <div class="d-flex align-items-start">
        <b-button v-b-toggle.collapse-5 size="sm" variant="outline-secondary">
          <i class="ri-pencil-fill"></i>
        </b-button>
        <div class="w-100 overflow-hidden ml-2">
          <div v-if="openReclamation.editPossitions === true" class="row">
            <div class="col-lg-1">
              <h5>Koszty</h5>
            </div>
            <div class="col-lg-7">
              <p class="mt-2 mb-0"> {{ costString }} </p>
            </div>
            <div class="col-lg-4">
              <div class="text-lg-right">
                <b-button variant="outline-secondary mb-1" class="btn ml-1 btn-sm" @click="fillAllCostsTypes">
                  <i class="ri-add-line mr-1"></i> Wypełnij wszystkie koszty
                </b-button>
                <b-button variant="outline-secondary mb-1" class="btn ml-1 btn-sm" @click="openModalForm"> <i class="ri-add-line mr-1"></i> Dodaj </b-button>
              </div>
            </div>
          </div>
          <b-collapse id="collapse-5" class="mt-0">
            <div class="table-responsive">
              <table class="table table-centered mb-0">
                <thead class="thead-light">
                  <tr>
                    <th v-if="openReclamation.editPossitions === true">LP</th>
                    <th>Rodzaj kosztu</th>
                    <th>Kwota</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="reclamationCost of reclamationCosts" :key="reclamationCost.id">
                    <td v-if="openReclamation.editPossitions === true">
                      <a href="javascript:void(0);" class="btn btn-light btn-sm" @click="editCostItem(reclamationCost)">
                        <i class="ri-search-line"></i>
                      </a>
                    </td>
                    <td>
                      {{ getCostArticleDescription(reclamationCost.costArticleId) }}
                    </td>
                    <td>
                      {{ reclamationCost.amount }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </b-collapse>
        </div>
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

    <b-modal id="modal-possition-form" v-model="_showModalCostsForm" title="Dodanie / Edycja kosztów zlecenia reklamacyjnego" size="lg" hide-footer>
      <b-row class="mb-2">
        <b-col md="8">
          <b-form-group label="Rodzaj kosztu" label-for="cost_articleId">
            <b-input-group class="mb-2">
              <b-form-select id="cost_articleId" name="cost_articleName" v-model="currentCostArticle" :options="costArticles" text-field="description" value-field="id" />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <label for="surname">Kwota</label>
          <b-form-input id="amountField" type="number" v-model="currentAmount" placeholder="Kwota"> </b-form-input>
        </b-col>
      </b-row>

      <div class="row align-items-center">
        <div class="col-6">
          <div class="text-left pb-2 pl-2">
            <b-button type="submit" variant="success" class="mr-2" @click="addCostRecord">Zapisz zmiany</b-button>
            <b-button variant="light" class="mr-2" @click="cancelItemModification">Anuluj</b-button>
          </div>
        </div>
        <div class="col-6">
          <div class="text-right pb-2 pr-2" v-if="currentCostItemId > 0">
            <b-button variant="danger" @click="beforeDeleteItem">Usuń</b-button>
          </div>
        </div>
      </div>
    </b-modal>

    <b-modal id="modal-question" title="Uwaga!">
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
