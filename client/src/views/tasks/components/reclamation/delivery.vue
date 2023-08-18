<script>
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'

export default {
  name: 'TaskDelivery',

  props: {
    stageId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      menuItems: '',
      orderData: [],
      menuRef: null,
      deliveryStatuses: ['Przygotowane', 'Wysłane'],
      deliveryPaymentSides: ['Fabryka', 'Handlowiec', 'Klient'],

      deliveryTypes: [],
    }
  },
  computed: {
    ...mapGetters({
      openReclamation: 'reclamations/openReclamation',
    }),

    // deliveryDate: {
    //   get() {
    //     return this.openReclamation.deliveryDate
    //   },
    //   set(value) {
    //     this.setReclamationProperty({
    //       property: 'deliveryDate',
    //       value: value,
    //     })
    //   },
    // },

    deliveryTerm: {
      get() {
        return moment(this.openReclamation.deliveryTerm).format('YYYY-MM-DD')
      },
      set(value) {
        this.setReclamationProperty({
          property: 'deliveryTerm',
          value: moment(value).format('YYYY-MM-DD'),
        })
      },
    },

    deliveryAddress: {
      get() {
        return this.openReclamation.deliveryAddress
      },
      set(value) {
        this.setReclamationProperty({
          property: 'deliveryAddress',
          value: value,
        })
      },
    },

    deliveryItems: {
      get() {
        return this.openReclamation.deliveryItems
      },
      set(value) {
        this.setReclamationProperty({
          property: 'deliveryItems',
          value: value,
        })
      },
    },

    deliveryComment: {
      get() {
        return this.openReclamation.deliveryComment
      },
      set(value) {
        this.setReclamationProperty({
          property: 'deliveryComment',
          value: value,
        })
      },
    },

    deliveryStatus: {
      get() {
        return this.openReclamation.deliveryStatus
      },
      set(value) {
        this.setReclamationProperty({
          property: 'deliveryStatus',
          value: value,
        })
      },
    },

    deliveryPaymentSide: {
      get() {
        return this.openReclamation.deliveryPaymentSide
      },
      set(value) {
        this.setReclamationProperty({
          property: 'deliveryPaymentSide',
          value: value,
        })
      },
    },

    deliveryType: {
      get() {
        return this.openReclamation.deliveryType
      },
      set(value) {
        this.setReclamationProperty({
          property: 'deliveryType',
          value: value,
        })
      },
    },

    deliveryNote: {
      get() {
        return this.openReclamation.deliveryNote
      },
      set(value) {
        this.setReclamationProperty({
          property: 'deliveryNote',
          value: value,
        })
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
      setReclamationProperty: 'reclamations/setReclamationProperty',
    }),

    async initialize() {
      this.deliveryTypes = await this.$store.dispatch('deliveryTypes/findAll', {})
    },
  },
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <b-row>
        <b-col md="4">
          <h4>Wysyłka elementów reklamacyjnych</h4>
        </b-col>

        <b-col v-if="stageId !== 9" md="4">
          <b-form-group label="Status" label-for="deliveryStatusId" label-cols-sm="3">
            <b-input-group class="mb-2">
              <b-form-select id="deliveryStatusId" name="deliveryStatusName" v-model="deliveryStatus" :options="deliveryStatuses" />
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col v-if="stageId !== 9" md="4">
          <b-form-group label="Kto płaci" label-for="deliveryPaymentSideId" label-cols-sm="3">
            <b-input-group class="mb-2">
              <b-form-select id="deliveryPaymentSideId" name="deliveryPaymentSideName" v-model="deliveryPaymentSide" :options="deliveryPaymentSides" />
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col v-if="stageId !== 9" md="4">
          <b-form-group label="Typ wysyłki" label-for="deliveryTypeId">
            <b-input-group class="mb-2">
              <b-form-select id="deliveryTypeId" name="deliveryTypeName" v-model="deliveryType" :options="deliveryTypes" text-field="description" value-field="id" />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <label for="deliveryNoteId">Numer paczki</label>
          <b-form-input id="deliveryNoteId" v-model="deliveryNote" placeholder="Numer paczki"></b-form-input>
        </b-col>
        <b-col md="4">
          <b-form-group label="Data wysyłki" label-for="deliveryTermId">
            <b-form-input id="deliveryTermId" v-model="deliveryTerm" type="date"> </b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mb-2">
        <b-col md="12">
          <label for="deliveryAddressId">Adres wysyłki</label>
          <b-form-input id="deliveryAddressId" v-model="deliveryAddress"></b-form-input>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <b-form-group label="Opis pozycij" label-for="deliveryItemsId" class="mb-3">
            <b-form-textarea id="deliveryItemsId" v-model="deliveryItems" rows="5"> </b-form-textarea>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row class="mb-2">
        <b-col md="12">
          <b-form-group label="Komentarz" label-for="deliveryCommentId" class="mb-3">
            <b-form-textarea id="deliveryCommentId" v-model="deliveryComment" rows="5"> </b-form-textarea>
          </b-form-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
