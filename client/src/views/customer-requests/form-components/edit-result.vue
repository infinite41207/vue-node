<template>
  <b-modal
    id="cr-edit-result"
    size="lg"
    :title="`${$t('customerRequest.editResult')}`"
    :cancel-title="$t('commands.cancel')"
    no-close-on-backdrop
    :ok-title="`${$t('commands.write')}`"
    @ok="handleOk"
    @cancel="handleCancel"
    @close="handelClose"
  >
    <b-card>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="4" :label="`${$t('table.sum')} oferty`" label-for="request-sum">
            <b-form-input
              id="request-sum"
              v-model.number="sumBrutto"
              type="number"
              name="request-sum"
              size="sm"
              aria-describedby="sumFeedback"
              :state="sumState"
              @change="onChangeSum"
            ></b-form-input>
            <b-form-invalid-feedback id="sumFeedback">
              <!-- This will only be shown if the preceeding input has an invalid state -->
              {{ $t('common.notEmptyField') }}
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.currency')" label-for="request-currency">
            <b-form-select id="request-currency" v-model="currency" :options="currencies" name="request-currency" size="sm" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('order.objectTitle')" label-for="request-order">
            <b-form-select
              id="request-order"
              v-model="orderId"
              :options="orders"
              name="request-order"
              text-field="presentation"
              value-field="id"
              size="sm"
              @change="onChangeOrder"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>
  </b-modal>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'CREditItem',
  data() {
    return {
      viewId: this.$route.params.id,
      orders: [],
      currencies: ['EUR', 'USD', 'PLN'],
      orderIsEmpty: false,
      statusesList: [],
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'customerRequests/objectView',
    }),

    orderId: {
      get() {
        return this.objectView ? this.object.orderId : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'orderId', value: value })
      },
    },

    sumBrutto: {
      get() {
        return this.objectView ? this.object.sumBrutto : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'sumBrutto', value: value })
      },
    },
    currency: {
      get() {
        return this.objectView ? this.object.currency : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'currency', value: value ? value : 'EUR' })
      },
    },
    statusId: {
      get() {
        return this.objectView ? this.object.statusId : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'statusId', value: value })
      },
    },
    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },
  
    sumState() {
      return this.object.sumBrutto !== '0.00' && this.object.sumBrutto !== null
    },
  },

  async mounted() {
    this.$bvModal.show('cr-edit-result')

    // const { orderId, statusId, sumBrutto, currency } = this.object
    // this.object.orderId = orderId
    // this.object.sumBrutto = sumBrutto
    // this.object.currency = currency || 'EUR'
    // this.object.statusId = statusId

    if (this.orderId === null) {
      this.orderIsEmpty = true
    }

    if (this.orders.length === 0) {
      const response = await this.$store.dispatch('orders/findAll', {
        params: {
          filter: {
            customerId: this.object.customerId,
          },
        },
      })

      if (response.status === 200) {
        this.orders = response.data
      } else {
        this.orders = []
      }
    }
  },

  methods: {
    ...mapMutations({
      setObjectProperty: 'customerRequests/setObjectProperty',
    }),

    async handleOk() {
      const response = await this.$store.dispatch('customerRequests/update', {
        id: this.object.id,
        updateData: this.object,
      })
      if (response.status === 200) {
        await this.$store.dispatch('customerRequests/findByPk', {
          params: {
            id: this.object.id,
          },
        })

        this.$emit('edit-result-end', undefined)
      }
    },

    onChangeSum() {
      if (this.object.sumBrutto < 0) {
        this.object.sumBrutto = 0
      }

      try {
        this.object.sumBrutto = Number(this.object.sumBrutto.toFixed(2))
      } catch {
        this.object.sumBrutto = '0.00'
      }
    },

    async onChangeOrder() {
      if (this.object.orderId !== null && this.orderIsEmpty === true) {
        await this.setProductionStatus()
      }
    },

    async setProductionStatus() {
      if (this.statusesList.length === 0) {
        await this.$store
          .dispatch('customerRequestsStatuses/findAll', {})
          .then((response) => {
            if (response && response.status === 200) {
              this.statusesList = response.data.responseData
            } else {
              this.statusesList = []
            }
          })
          .catch((err) => {
            console.error(err)
            this.statusesList = []
          })
      }

      const productionStatus = this.statusesList.find((el) => el.predefinedName === 'production')

      if (productionStatus) {
        this.object.statusId = productionStatus.id
      }
    },

    handleCancel() {
      this.$emit('edit-result-end', undefined)
    },

    handelClose() {
      this.$emit('edit-result-end', undefined)
    },
  },
}
</script>

<style></style>
