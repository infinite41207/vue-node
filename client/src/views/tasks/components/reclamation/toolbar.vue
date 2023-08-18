<template>
  <div class="row">
    <div class="col-sm-6">
      <b-button variant="success" class="btn ml-2 mb-1" @click="beforeSavingReclamation(true)"> <i class="ri-save-2-line"></i> Ok </b-button>
      <!-- <b-button variant="secondary" class="btn ml-2 mb-1" @click="goBack()">
        <i class=" ri-delete-back-2-line"></i> Zamknij
      </b-button> -->
    </div>
    <div class="col-sm-3">
      <h4 v-if="openReclamation.id === null">Nowa reklamacja</h4>
      <b-link href="javascript:void(0);"
        ><h4 v-if="openReclamation.id !== null">Nr {{ openReclamation.number }} od {{ getFormatedDate(openReclamation.createddAt) }}</h4></b-link
      >
    </div>
    <div class="col-sm-3" v-if="openReclamation.id !== null">
      <!-- <b-button variant="danger" class="btn ml-1 mb-1">
        <i class="ri-delete-bin-7-line"></i> Usuń
      </b-button> -->
    </div>
    <!-- end col-->

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
        <b-form-input id="reclamationNumber" v-model="newNumNumber" type="number" placeholder="Wprowadż numer reklamacji"></b-form-input>
      </div>

      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button-toolbar class="float-right">
            <b-button variant="success" size="sm" @click="confirmReclamationNumberModification"> OK </b-button>
          </b-button-toolbar>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'ReclamationToolbar',

  props: {
    mode: {
      type: String,
      default: 'vertical',
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

      activityData: [
        {
          id: 1,
          icon: 'ri-upload-line',
          title: 'You sold an item',
          text: 'Paul Burgess just purchased “Hyper - Admin Dashboard”!',
          subtext: '5 minutes ago',
          color: 'info',
        },
        {
          id: 2,
          icon: 'ri-flight-takeoff-line',
          title: 'Product on the Bootstrap Market',
          text: 'Dave Gamache added',
          subtext: '30 minutes ago',
          boldText: 'Admin Dashboard',
          color: 'primary',
        },
        {
          id: 3,
          icon: 'ri-mic-fill',
          title: 'Robert Delaney',
          text: 'Send you message',
          boldText: '"Are you there?"',
          subtext: '2 hours ago',
          color: 'info',
        },
        {
          id: 4,
          icon: 'ri-flight-takeoff-line',
          title: 'Audrey Tobey',
          text: 'Uploaded a photo',
          subtext: '14 hours ago',
          boldText: '"Error.jpg"',
          color: 'primary',
        },
        {
          id: 5,
          icon: 'ri-upload-line',
          title: 'You sold an item',
          text: 'Paul Burgess just purchased “Hyper - Admin Dashboard”!',
          subtext: '16 hours ago',
          color: 'info',
        },
        {
          id: 6,
          icon: 'ri-flight-takeoff-line',
          title: 'Product on the Bootstrap Market',
          text: 'Dave Gamache added',
          subtext: '22 hours ago',
          boldText: 'Admin Dashboard',
          color: 'primary',
        },
        {
          id: 7,
          icon: 'ri-mic-fill',
          title: 'Robert Delaney',
          text: 'Send you message',
          subtext: '30 minutes ago',
          boldText: '"Are you there?"',
          color: 'info',
        },
        {
          id: 8,
          icon: 'ri-flight-takeoff-line',
          title: 'Audrey Tobey',
          text: 'Uploaded a photo',
          subtext: '14 hours ago',
          boldText: '"Error.jpg"',
          color: 'primary',
        },
        {
          id: 9,
          icon: 'ri-upload-line',
          title: 'You sold an item',
          text: 'Paul Burgess just purchased “Hyper - Admin Dashboard”!',
          subtext: '16 hours ago',
          color: 'info',
        },
        {
          id: 10,
          icon: 'ri-flight-takeoff-line',
          title: 'Product on the Bootstrap Market',
          text: 'Dave Gamache added',
          subtext: '22 hours ago',
          boldText: 'Admin Dashboard',
          color: 'primary',
        },
        {
          id: 11,
          icon: 'ri-mic-fill',
          title: 'Robert Delaney',
          text: 'Send you message',
          subtext: '30 minutes ago',
          boldText: '"Are you there?"',
          color: 'info',
        },
      ],
      activityWindowHeight: '430px',
    }
  },
  computed: {
    ...mapGetters({
      openReclamation: 'reclamations/openReclamation',
    }),
  },

  methods: {
    ...mapMutations({
      setReclamationProperty: 'reclamations/setReclamationProperty',
      setOpenTask: 'tasks/setOpenTask',
      setTaskProperty: 'tasks/setTaskProperty',
      setTaskProperties: 'tasks/setTaskProperties',
    }),

    ...mapActions({
      delView: 'tagsViews/delView',
      createTask: 'tasks/createTask',
    }),

    showInfoPanel() {
      // this.sidebar-info = true;
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

    async beforeSavingReclamation(closeForm) {
      this.saveChanges()
      this.$root.$emit('bv::hide::modal', 'reclamation-dlg', '#btnShow')
    },

    async beforeEditReclamationNumber(closeForm) {
      this.questionMessage = 'Edycja numeru reklamacji!'
      this.editReclamationNumber = true
      this.newNumNumber = this.openReclamation.numNumber
    },

    hasEmptyObligatoryAttributes() {
      const attributesArray = ['salesDate', 'salesOrder', 'customer', 'telephone', 'postCode', 'city', 'address']
      if (this.openReclamation.invAddress) {
        attributesArray.push('postCodeInv', 'cityInv', 'addressInv')
      }

      let hasErrors = false

      attributesArray.forEach((el) => {
        if (!this.openReclamation[el] || this.openReclamation[el] === '') {
          hasErrors = true
        }
      })

      return hasErrors
    },

    async saveChanges() {
      let res

      if (this.openReclamation.id !== null) {
        res = await this.$store.dispatch('reclamations/updateReclamation', this.openReclamation)
      } else {
        res = await this.$store.dispatch('reclamations/create', this.openReclamation)
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

    goBack() {
      this.$router.push({ name: 'reclamations' })
      this.delView({ name: this.$route.name, path: this.$route.path })
    },

    getFormatedDate(curDate) {
      return moment(curDate).format('DD.MM.YYYY')
    },
  },
}
</script>