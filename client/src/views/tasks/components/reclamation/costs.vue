<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'TaskCosts',
  components: {},
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
      currentCostItemId: 0,
      currentCostArticle: 0,
      currentAmount: 0,

      costArticles: [],
      reclamationCosts: [],

      questionMessage: '',
      showQuestion: false,
    }
  },
  computed: {
    ...mapGetters({
      openReclamation: 'reclamations/openReclamation',
      getModalCostsFormValue: 'reclamations/getModalCostsFormValue',
      getModalPossitionFormValue: 'reclamations/getModalPossitionFormValue',
    }),

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

    async addCostRecord() {
      const costRecord = {
        reclamationId: this.openReclamation.id,
        cost_article: this.currentCostArticle,
        amount: this.currentAmount,
      }

      if (this.currentCostItemId === 0) {
        await this.$store.dispatch('reclamationCosts/addItem', costRecord)
      } else {
        costRecord.id = this.currentCostItemId
        await this.$store.dispatch('reclamationCosts/updateItem', costRecord)
      }

      this.initialize()
      this.setShowModalCostsForm(false)
      this.clearCurrentCostValues()
    },

    editCostItem(costItem) {
      this.currentCostItemId = costItem.id
      this.currentCostArticle = costItem.cost_article
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
      await this.$store.dispatch('reclamationCosts/deleteItem', deleteItem)
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
      this.reclamationCosts = await this.$store.dispatch('reclamationCosts/findAll', this.openReclamation.id)
    },
  },
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div v-if="openReclamation.editPossitions === true" class="row">
        <div class="col-lg-6">
          <h4>Koszty</h4>
        </div>
        <div class="col-lg-6">
          <div class="text-lg-right">
            <b-button variant="outline-secondary mb-1" class="btn ml-1" @click="openModalForm"> <i class="ri-add-line mr-1"></i> Dodaj </b-button>
          </div>
        </div>
        <!-- end col-->
      </div>
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
                <a href="javascript:void(0);" class="btn btn-light" @click="editCostItem(reclamationCost)">
                  <i class="ri-search-line"></i>
                </a>
              </td>
              <td>
                {{ getCostArticleDescription(reclamationCost.cost_article) }}
              </td>
              <td>
                {{ reclamationCost.amount }}
              </td>
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
