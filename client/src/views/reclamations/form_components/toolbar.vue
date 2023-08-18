<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import RecentActivity from '@/components/widgets/recent-activity'
import _ from 'lodash'

import moment from 'moment'

export default {
  name: 'ReclToolbar',

  components: { RecentActivity },
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
      menuRef: null,
      questionMessage: '',
      showQuestion: false,
      reclamationNumber: '',
      editReclamationNumber: false,
      newNumNumber: 0,

      activityWindowHeight: '430px',
    }
  },
  computed: {
    ...mapGetters({
      getObjectView: 'reclamations/objectView',
      openReclamation: 'reclamations/openReclamation',
      bpDefinitionList: 'bpDefinitions/itemsListView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    number: {
      get() {
        return this.objectView ? this.object.number : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'number', value })
      },
    },
  },

  async created() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      setReclamationProperty: 'reclamations/setReclamationProperty',
      setOpenTask: 'tasks/setOpenTask',
      setTaskProperty: 'tasks/setTaskProperty',
      setTaskProperties: 'tasks/setTaskProperties',
      setObjectViewProperty: 'reclamations/setObjectViewProperty',
      setObjectProperty: 'reclamations/setObjectProperty',
      delObjectView: 'reclamations/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
      createTask: 'tasks/createTask',
    }),

    async initialize() {
      const filterStr = {
        params: {
          filter: {},
        },
      }
      await this.$store.dispatch('bpDefinitions/findAllItems', filterStr)
    },

    async getCurrentExecutor() {
      const response = await this.$store.dispatch('executors/getTaskExecutorByUserId', {
        params: {
          id: this.openReclamation.responsible,
        },
      })
      let currentExecutor = null
      if (response.status === 200) {
        currentExecutor = response.data.id
      }
      return currentExecutor
    },

    async createTaskFromReclamation(processItem) {
      if (processItem.stages) {
        const parsedObject = JSON.parse(processItem.stages)
        const currentBpDefinition = _.cloneDeep(parsedObject.array)
        const currentStage = currentBpDefinition[0]

        const executionTerm = new Date()
        executionTerm.setHours(0, 0, 0, 0)
        if (currentStage.executionTerm) {
          executionTerm.setDate(executionTerm.getDate() + Number(currentStage.executionTerm))
        }

        const currentExecutor = await this.getCurrentExecutor()
        this.setOpenTask(null)
        this.setTaskProperties({
          ownerType: 'reclamation',
          ownerId: this.openReclamation.id,
          executionPeriod: executionTerm,
          stage: currentStage.id,
          subjectString: currentStage.text,
          customerId: this.openReclamation.customer,
          executorId: currentStage.executorId > 0 ? currentStage.executorId : null,
          executorRoleId: currentStage.executorRoleId > 0 ? currentStage.executorRoleId : null,
          bpDefinition: processItem.id,
          name: currentStage.text,
        })

        await this.createTask()
        await this.$store.dispatch('reclamations/findReclamationTasks', this.openReclamation.id)

        alert('Zadanie dla konstruktora zostało pomyślnie utworzone')
      }
    },

    async beforeSavingReclamation(closeForm) {
      // const hasEmptyObligatoryAttributes = this.hasEmptyObligatoryAttributes()

      // if (hasEmptyObligatoryAttributes) {
      //   this.questionMessage = 'Najpierw musisz uzupełnić wszystkie obowiązkowe atrybuty!'
      //   this.showQuestion = true
      // } else if (this.openReclamation.possitions.length === 0) {
      //   this.questionMessage = 'Brak możliwości zapisać dokument bez dodania pozycji!'
      //   this.showQuestion = true
      // } else {
      this.saveChanges(closeForm)
      //}
    },

    async beforeEditReclamationNumber(closeForm) {
      this.questionMessage = 'Edycja numeru reklamacji!'
      this.editReclamationNumber = true
      this.newNumNumber = this.object.numNumber
    },

    hasEmptyObligatoryAttributes() {
      const attributesArray = ['salesDate', 'salesOrder', 'customerId', 'postCode', 'address']
      if (this.openReclamation.invAddress) {
        attributesArray.push('postCodeInv', 'addressInv')
      }

      let hasErrors = false

      attributesArray.forEach((el) => {
        if (!this.openReclamation[el] || this.openReclamation[el] === '') {
          hasErrors = true
        }
      })

      return hasErrors
    },

    async writeObject(close) {
      let response
      if (this.object.id === null || this.object.id === undefined) {
        response = await this.$store
          .dispatch('reclamations/create', this.object)
          .then((res) => {
            console.log('create reclamation response:', res)
            this.$bvToast.toast('Reklamacja została zapisana', {
              title: this.$tc('common.msg'),
              variant: 'success',
              solid: true,
              autoHideDelay: 5000,
            })
            if (close === true) {
              this.closeView()
            }
          })
          .catch((err) => {
            console.log('create reclamation error: ', err)
            this.$bvToast.toast(`Błąd zapisu reklamacji ${err}`, {
              title: this.$tc('common.msg'),
              variant: 'danger',
              solid: true,
              autoHideDelay: 5000,
            })
          })
      } else {
        response = await this.$store
          .dispatch('reclamations/update', this.object)
          .then((res) => {
            console.log('update reclamation res: ', res)
            this.$bvToast.toast('Reklamacja została zapisana', {
              title: this.$tc('common.msg'),
              variant: 'success',
              solid: true,
              autoHideDelay: 5000,
            })
            if (close === true) {
              this.closeView()
            }
          })
          .catch((err) => {
            console.log('update reclamation error: ', err)
            this.$bvToast.toast(`Błąd zapisu reklamacji ${err}`, {
              title: this.$tc('common.msg'),
              variant: 'danger',
              solid: true,
              autoHideDelay: 5000,
            })
          })
      }
    },

    confirmReclamationNumberModification() {
      this.questionMessage = ''
      this.editReclamationNumber = false

      const zeroPad = (num, places) => String(num).padStart(places, '0')

      const newNumber = String(zeroPad(this.newNumNumber, 5)) + '/' + String(new Date().getFullYear())

      this.setReclamationProperty({
        property: 'number',
        value: newNumber,
      })

      this.setReclamationProperty({
        property: 'numNumber',
        value: this.newNumNumber,
      })
    },

    onOkModalQuestion() {
      this.closeAndClearModalQuestion()
    },

    closeAndClearModalQuestion() {
      this.questionMessage = ''
      this.showQuestion = false
    },

    printRegistrationProtocol() {
      this.$router.push({ name: 'registrationprotocol' })
    },

    printDecisionProtocol() {
      this.$router.push({ name: 'decisionprotocol' })
    },

    printMileageProtocol() {
      this.$router.push({ name: 'mileageprotocol' })
    },

    printRemovalProtocol() {
      this.$router.push({ name: 'removalprotocol' })
    },

    printServiceProtocol() {
      this.$router.push({ name: 'serviceprotocol' })
    },

    getFormatedDate(curDate) {
      return moment(curDate).format('DD.MM.YYYY')
    },

    async closeView() {
      this.$destroy()
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)
      await this.$router.push({ name: 'reclamations' })
    },
  },
}
</script>

<template>
  <div>
    <b-row class="align-items-center m-1 toggle-btns-group flex-nowrap">
      <b-button variant="success" @click="writeObject(true)" class="mr-1" size="sm">
        <i class="ri-file-add-line mr-1"></i>
        {{ $t('commands.writeAndClose') }}
      </b-button>
      <b-button variant="outline-secondary" @click="writeObject" class="mr-1" size="sm">
        <i class="ri-file-add-line mr-1"></i>
        {{ $t('commands.write') }}
      </b-button>
      <b-button variant="outline-secondary" @click="beforeEditReclamationNumber" class="mr-1" size="sm">
        <i class="ri-pencil-fill"></i>
      </b-button>
      <b-button variant="outline-secondary" class="mr-1" @click="closeView" size="sm">
        <i class="ri-file-excel-line mr-1"></i>
        {{ $t('commands.close') }}
      </b-button>
      <b-button variant="outline-secondary" class="mr-1" size="sm">
        <i class="ri-history-line"></i>
        {{ $t('components.historyOfChanges') }}
      </b-button>
    </b-row>
    <!-- <div class="col-sm-3">
      <h4 v-if="openReclamation.id === null">Nowa reklamacja</h4>
      <b-link href="javascript:void(0);" @click="beforeEditReclamationNumber()"
        ><h4 v-if="openReclamation.id !== null">Nr {{ openReclamation.number }} od {{ getFormatedDate(openReclamation.createddAt) }}</h4></b-link
      >
    </div> -->
    <!-- <div class="col-sm-3" v-if="openReclamation.id !== null">
      <b-button variant="danger" class="btn ml-1 mb-1">
        <i class="ri-delete-bin-7-line"></i> Usuń
      </b-button>
    </div> -->

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

    <b-modal v-model="editReclamationNumber" title="Edycja numeru reklamacji!">
      <div>
        <label for="reclamationNumber">Numer reklamacji</label>
        <b-form-input id="reclamationNumber" v-model="number" type="text" placeholder="Wprowadż numer reklamacji"></b-form-input>
      </div>

      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button-toolbar class="float-right">
            <b-button variant="success" size="sm" @click="confirmReclamationNumberModification"> OK </b-button>
          </b-button-toolbar>
        </div>
      </template>
    </b-modal>

    <b-sidebar id="sidebar-info" body-class="sidebar-body" header-class="toggle-header" title="Dodatkowe dane dokumentu" width="30%" right shadow>
      <template v-slot:header="{ hide }">
        <!-- <div class="bg-dark text-light align-items-center border-0 mb-0 px-3 py-2"> -->
        <strong class="mr-auto">Dodatkowe informacje</strong>
        <b-button class="mr-2" size="sm" @click="hide">X</b-button>
        <!-- </div> -->
      </template>

      <b-tabs content-class="mt-3">
        <b-tab active>
          <template v-slot:title>
            <span class="d-inline-block d-sm-none">
              <i class="ri-home-4-fill d-md-none d-block"></i>
            </span>
            <span class="d-none d-sm-inline-block">Zadania</span>
          </template>
          <RecentActivity :activity-data="openReclamation.tasks" />
        </b-tab>
        <!-- <b-tab>
          <template v-slot:title>
            <span class="d-inline-block d-sm-none">
              <i class="ri-home-4-fill d-md-none d-block"></i>
            </span>
            <span class="d-none d-sm-inline-block">Historia zmian</span>
          </template>

        </b-tab> -->
      </b-tabs>
    </b-sidebar>
  </div>
</template>

<style>
.sidebar-body {
  background-color: white;
}
</style>
