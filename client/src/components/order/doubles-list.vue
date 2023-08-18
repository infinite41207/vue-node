<template>
  <b-modal id="modal-order-doubles" size="xl" :title="$t('common.double')" no-close-on-backdrop ok-only @ok="handelClose" @close="handelClose">
    <b-row>
      <b-col>
        <b-table ref="doublesTable" v-model="ordersTable" no-border-collapse responsive="sm" sticky-header="400px" lazy :fields="ordersFields" :items="ordersTable" small>
          <template v-slot:cell(number)="data">
            <a href="javascript:void(0);" @click="openOrder(data.item.id)"
              ><p :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ data.item.number }}</p>
            </a>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
export default {
  props: {
    doublesId: {
      type: Array,
      default: function () {
        return []
      },
      requaried: true,
    },
  },

  data() {
    return {
      ordersFields: [
        { key: 'number', label: this.$t('table.number') },
        { key: 'createdAt', label: this.$t('table.createdAt') },
        {
          key: 'status.name',
          label: this.$t('table.status'),
        },
        { key: 'author', label: this.$t('table.author') },
      ],
      ordersTable: [],
    }
  },

  async mounted() {
    await this.getDoublesData()
    this.$bvModal.show('modal-order-doubles')
  },

  methods: {
    async getDoublesData() {
      this.ordersTable = []
      const response = await this.$store.dispatch('orders/getDoubleData', {
        params: { id: this.doublesId },
      })

      if (response) {
        if (response.status === 200) {
          for (const orderData of response.data.orders) {
            this.ordersTable.push({
              id: orderData.id,
              number: orderData.prefix + '-' + orderData.number.toString().padStart(6, '0'),
              status: orderData.status,
              createdAt: orderData.createdAt,
              author: orderData.author.name,
            })
          }
        }
      }
    },

    handelClose() {
      this.$emit('doubles-list-closed')
    },

    async openOrder(itemId) {
      if (itemId !== undefined) {
        const response = await this.$store.dispatch('orders/findByPk', {
          params: {
            id: itemId,
          },
        })
        if (response.status === 200) {
          this.$router.push({ name: 'sales-order-detail', params: { id: itemId } })
        }
      }
    },
  },
}
</script>

<style></style>
