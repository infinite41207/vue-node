<script>
import _ from 'lodash'

export default {
  name: 'ClientSettlemets',

  data() {
    return {
      channelData: [],
      reclamations: [],
      statusGroupsList: [],
    }
  },

  async mounted() {
    this.initialize()
  },

  methods: {
    async initialize() {
      await this.getStatisticByCustomers()
    },

    async getStatisticByCustomers() {
      let statusGroupFilter = {}

      statusGroupFilter = {
        noCommit: true,
        params: {
          statusgroupfilter: { statusgroupid: 1 },
        },
      }

      const response = await this.$store.dispatch('reclamations/findAllReclamations', statusGroupFilter)

      if (response.status === 200) {
        this.reclamations = response.data
      } else {
        this.reclamations = []
      }

      this.statusGroupsList = await this.$store.dispatch('reclamationStatusGroups/findAll', {})

      if (this.reclamations.length > 0) {
        const groupReclmations = _.groupBy(this.reclamations, (el) => {
          return el.customer
        })

        for (const reclCustomer of Object.keys(groupReclmations)) {
          const customerReclamations = groupReclmations[reclCustomer]

          const customerData = {
            customer: customerReclamations[0]._customer.name,
            statuses: [],
          }

          const groupByStatuses = _.groupBy(customerReclamations, (el) => {
            return el._status.statusgroupid
          })

          for (const statusGroup of this.statusGroupsList) {
            let quantity = 0
            if (Object.prototype.hasOwnProperty.call(groupByStatuses, statusGroup.id) === true) {
              quantity = groupByStatuses[statusGroup.id].length
            }

            customerData.statuses.push({
              id: statusGroup.id,
              quantity: quantity,
            })
          }

          this.channelData.push(customerData)
        }
      }
    },
  },
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <a href class="p-0 float-right mb-3">
        Pobierz
        <i class="ri-download-line ml-1"></i>
      </a>
      <h4 class="header-title mt-1">Analiza wg klientów</h4>

      <b-table-simple responsive centered class="table-sm mb-0 font-14">
        <b-thead head-variant="light">
          <b-tr>
            <b-th>Klient</b-th>
            <b-th v-for="statusGroup of statusGroupsList" :key="statusGroup.id">{{ statusGroup.description }}</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr v-for="channel of channelData" :key="channel.name">
            <b-td>{{ channel.customer }}</b-td>
            <b-td v-for="statusQuantity of channel.statuses" :key="statusQuantity.id">
              {{ statusQuantity.quantity }}
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
      <!-- end table -->
    </div>
    <!-- end card-body-->
  </div>
  <!-- end card-->
</template>
