<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'ReclProductionOrder',

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

      productionOrdersData: [],
      productionOrderId: 0,
      productionOrderNumber: '',
      productionOrderComment: '',
      productionOrderExecutionDate: '',

      productionOrderNumbersString: '',

      showModalTableForm: false,
      showModalProductionOrderForm: false,

      questionAction: null,
      questionParams: null,
      questionMessage: '',

      userSettingItemKey: 'reclamationsProductionOrdersRestrictEdit',
      permissionRestrictEdit: false,
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
  },

  async mounted() {
    this.initialize()
  },

  methods: {
    async initialize() {
      const response = await this.$store.dispatch('reclamationProductionOrders/findAll', { params: { filter: { reclamationId: this.object.id }}})
      this.productionOrdersData = response.data
      this.fillProductionOrderNumbersString()

      const authUser = await this.$store.state.auth.currentUser

      await this.$store
        .dispatch('userSettings/findByPk', {
          params: {
            userId: authUser.id,
            userSettingItemKey: this.userSettingItemKey,
          },
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

    async addProductionOrderData() {
      const productionOrderItem = {
        reclamationId: this.object.id,
        orderNumber: this.productionOrderNumber,
        comment: this.productionOrderComment,
        executionDate: this.productionOrderExecutionDate,
      }

      if (this.productionOrderId === 0) {
        await this.$store.dispatch('reclamationProductionOrders/create', productionOrderItem)
      } else {
        productionOrderItem.id = this.productionOrderId
        await this.$store.dispatch('reclamationProductionOrders/update', productionOrderItem)
      }

      this.initialize()
      this.showModalProductionOrderForm = false

      this.clearCurrentProductionOrderValues()
    },

    editProductionOrderData(productionOrder) {
      this.productionOrderId = productionOrder.id
      this.productionOrderNumber = productionOrder.orderNumber
      this.productionOrderComment = productionOrder.comment
      this.productionOrderExecutionDate = moment(productionOrder.executionDate).format('YYYY-MM-DD')

      this.showModalProductionOrderForm = true
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

    clearCurrentProductionOrderValues() {
      this.productionOrderId = 0
      this.productionOrderNumber = ''
      this.productionOrderComment = ''
      this.productionOrderExecutionDate = ''
    },

    async deleteItem(deleteItem) {
      await this.$store.dispatch('reclamationProductionOrders/deleteItem', deleteItem)
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

    cancelItemModification() {
      this.clearCurrentProductionOrderValues()
      this.showModalProductionOrderForm = false
    },

    getFormatedDate(curDate) {
      return moment(curDate).format('DD MM YYYY')
    },

    onShowModalTableForm() {
      this.showModalTableForm = true
    },

    fillProductionOrderNumbersString() {
      this.productionOrderNumbersString = ' '
      let countValues = 0
      for (const row of this.productionOrdersData) {
        countValues += 1
        if (countValues <= 5) {
          this.productionOrderNumbersString += row.orderNumber + ', '
        } else {
          this.productionOrderNumbersString += '\r\n...'
          break
        }
      }
    },
  },
}
</script>

<template>
  <b-card class="mb-2 pl-0 pb-0 pr-0 pt-0" height="100%">
    <b-card-body class="pl-0 pb-0 pr-0 pt-0">
      <div class="row">
        <div class="col-lg-8">
          <h5>Zlecenia produkcyjne</h5>
        </div>
        <div class="col-lg-4">
          <div v-if="permissionRestrictEdit === false" class="text-lg-right">
            <b-button size="sm" variant="outline-secondary" @click="showModalProductionOrderForm = true">
              <i class="ri-add-fill"></i>
            </b-button>
            <b-button class="ml-1" size="sm" variant="outline-secondary" @click="onShowModalTableForm">
              <i class="ri-pencil-fill"></i>
            </b-button>
          </div>
        </div>
      </div>
      <b-input-group class="mt-2" style="height: 50px">
        <span style="white-space: pre"> Numery: {{ productionOrderNumbersString }} </span>
      </b-input-group>
    </b-card-body>

    <b-modal id="modal-edit-table-form" v-model="showModalTableForm" title="Zlecenia produkcyjne" size="lg" hide-footer>
      <div>
        <!-- <div class="row"> -->
        <!-- <div class="col-lg-6">
            <h5></h5>
          </div>
          <div class="col-lg-6"> -->
        <div class="text-lg-right">
          <b-button variant="outline-secondary mb-1" class="btn ml-1 btn-sm" @click="showModalProductionOrderForm = true">
            <i class="ri-add-line mr-1"></i> Dodaj zlecenie
          </b-button>
        </div>
        <!-- </div>
        </div> -->
        <div class="table-responsive">
          <table class="table table-centered mb-0" small>
            <thead class="thead-light">
              <tr>
                <th></th>
                <th>Numer zlecenia</th>
                <th>Opis</th>
                <th>Data realizacji</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="productionOrder of productionOrdersData" :key="productionOrder.id">
                <td>
                  <a href="javascript:void(0);" class="btn btn-light btn-sm" @click="editProductionOrderData(productionOrder)">
                    <i class="ri-search-line"></i>
                  </a>
                </td>
                <td>{{ productionOrder.orderNumber }}</td>
                <td>{{ productionOrder.comment }}</td>
                <td>{{ getFormatedDate(productionOrder.executionDate) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </b-modal>

    <b-modal id="modal-history-form" v-model="showModalProductionOrderForm" title="Dodanie / Edycja zleceń produkcyjnych" size="lg" hide-footer>
      <div class="card">
        <div class="card-body">
          <b-row class="mb-2">
            <b-col md="6">
              <label for="kwatera-field">Numer zadania produkcyjnego</label>
              <b-form-input id="kwatera-field" v-model="productionOrderNumber" placeholder="Numer zlecenia produkcyjnego"> </b-form-input>
            </b-col>
            <b-col md="6">
              <b-form-group label="Planowa data realizacji" label-for="executionDateId">
                <b-form-input id="executionDateId" v-model="productionOrderExecutionDate" type="date"> </b-form-input>
              </b-form-group>
            </b-col>
          </b-row>

          <b-row class="mb-2">
            <b-col md="12">
              <b-form-group label="Komentarz" label-for="comment" class="mb-3">
                <b-form-textarea id="comment" v-model="productionOrderComment" rows="5"> </b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </div>

        <div class="row align-items-center">
          <div class="col-6">
            <div class="text-left pb-2 pl-2">
              <b-button type="submit" variant="success" class="mr-2" @click="addProductionOrderData">Zapisz zmiany</b-button>
              <b-button variant="light" class="mr-2" @click="cancelItemModification">Anuluj</b-button>
            </div>
          </div>

          <div class="col-6">
            <div class="text-right pb-2 pr-2">
              <b-button variant="danger" @click="beforeDeleteItem">Usuń</b-button>
            </div>
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
  </b-card>
</template>
