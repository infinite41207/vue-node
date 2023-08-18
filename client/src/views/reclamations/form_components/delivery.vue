<template>
  <div class="card mb-1">
    <div class="card-body pl-2 pb-0 pr-2 pt-2">
      <div class="d-flex align-items-start">
        <b-button v-b-toggle.collapse-4 size="sm" variant="outline-secondary">
          <i class="ri-pencil-fill"></i>
        </b-button>
        <div class="w-100 overflow-hidden ml-2">
          <b-row>
            <b-col md="4">
              <h5>Wysyłka elementów reklamacyjnych</h5>
            </b-col>
            <b-col md="4">
              <b-input-group>
                <p class="mt-1 mr-4"> Status: </p>
                <b-form-select id="deliveryStatusId" name="deliveryStatusName" size="sm" v-model="deliveryStatus" :options="deliveryStatuses" />
              </b-input-group>
            </b-col>
            <b-col md="4">
              <b-input-group>
                <p class="mt-1 mr-1"> Data wysyłki: </p>
                <b-form-input id="deliveryTermId" size="sm" v-model="deliveryTerm" type="date"> </b-form-input>
              </b-input-group>
            </b-col>
          </b-row>
          <b-collapse id="collapse-4" class="mt-0">
            <b-row>
              <b-col md="4">
                <b-input-group>
                  <p class="mt-1 mr-3"> Typ wysyłki: </p>
                  <b-form-select id="deliveryTypeId" name="deliveryTypeName" size="sm" v-model="deliveryType" :options="deliveryTypes" text-field="description" value-field="id" />
                </b-input-group>
              </b-col>
              <b-col md="4">
                <b-input-group>
                  <p class="mt-1 mr-1"> Numer paczki: </p>
                  <b-form-input id="deliveryNoteId" size="sm" v-model="deliveryNote" placeholder="Numer paczki"></b-form-input>
                </b-input-group>
              </b-col>
              <b-col md="4">
                <b-input-group>
                  <p class="mt-1 mr-4"> Kto płaci: </p>
                  <b-form-select id="deliveryPaymentSideId" name="deliveryPaymentSideName" size="sm" v-model="deliveryPaymentSide" :options="deliveryPaymentSides" />
                </b-input-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <b-input-group>
                  <p class="mt-1 mr-1"> Adres wysyłki: </p>
                  <b-form-input id="deliveryAddressId" size="sm" v-model="deliveryAddress"></b-form-input>
                </b-input-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <b-form-group label="Opis pozycij" label-for="deliveryItemsId">
                  <b-form-textarea id="deliveryItemsId" v-model="deliveryItems" rows="5"> </b-form-textarea>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Komentarz" label-for="deliveryCommentId">
                  <b-form-textarea id="deliveryCommentId" v-model="deliveryComment" rows="5"> </b-form-textarea>
                </b-form-group>
              </b-col>
            </b-row>
          </b-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'

export default {
  name: 'ReclDelivery',

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
      deliveryStatuses: ['Przygotowane', 'Wysłane'],
      deliveryPaymentSides: ['Fabryka', 'Handlowiec', 'Klient'],

      deliveryTypes: [],
    }
  },

  computed: {
    ...mapGetters({
      openReclamation: 'reclamations/openReclamation',
    }),

    deliveryTerm: {
      get() {
        return moment(this.openReclamation.deliveryTerm).format('YYYY-MM-DD')
      },
      set(value) {
        this.setReclamationProperty({
          property: 'deliveryTerm',
          value: moment(value).format('YYYY-MM-DD'),
        })
        this.setReclamationProperty({
          property: 'deliveryStatus',
          value: 'Wysłane',
        })
        this.setReclamationProperty({
          property: 'executionDate',
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
