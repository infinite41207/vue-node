<template>
  <b-modal id="modal-salesOrder" size="xl" title="Wyszukaj umowę!" cancel-title="Anuluj" no-close-on-backdrop @ok="handleOk" @cancel="handleCancel" @close="handelClose">
    <b-row>
      <b-col>
        <b-form-group label="Filter" label-for="filter-input" label-cols-sm="1">
          <b-input-group>
            <b-form-input id="search-salesOrder" v-model="filter" type="search" debounce="50" placeholder="Wyszukaj umowę ..." @keyup.enter="selectSalesOrder"> </b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="clearFilter">Wyczyść</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
        <b-table
          ref="salesOrderTable"
          v-model="salesOrderFilteredRows"
          no-border-collapse
          responsive="sm"
          selectable
          select-mode="single"
          sticky-header="400px"
          lazy
          :filter-included-fields="salesOrderFilterFields"
          :fields="salesOrderFields"
          :filter="filter"
          :items="salesOrderTable"
          :per-page="perPage"
          :current-page="1"
          @row-selected="salesOrderRowSelected"
          @filtered="onFiltered"
        >
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right" class="my-0" @change="onChangePage"></b-pagination>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      salesOrderFields: [
        { key: 'salesOrderNumber', label: 'Nr umowy' },
        { key: 'salesDate', label: 'Data sprzedaży' },
        { key: 'shipmentDate', label: 'Data wysyłki' },
        { key: 'proforma', label: 'Proforma' },
        { key: 'reference', label: 'Referencja' },
      ],
      salesOrders: [],
      salesOrderTable: [],
      filter: '',
      salesOrderSelectedItem: '',
      salesOrderFilteredRows: [],
      salesOrderFilterFields: ['salesOrderNumber', 'proforma', 'reference'],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
    }
  },

  computed: {
    ...mapGetters({
      openReclamation: 'reclamations/openReclamation',
    }),
  },

  async mounted() {
    this.$bvModal.show('modal-salesOrder')

    await this.initialize()
  },

  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    selectSalesOrder() {
      if (this.customerFilteredRows.length === 1) {
        this.$refs.customerCollapsibleTable.selectRow(0)
      }
    },

    salesOrderRowSelected(rowArray) {
      if (rowArray.length === 1) {
        this.filter = rowArray[0].salesOrderNumber
        this.salesOrderSelectedItem = rowArray[0]
      }
    },

    handleOk() {
      if (this.salesOrderNumber !== '') {
        this.$emit('salesOrder-selected', this.salesOrderSelectedItem)
      } else {
        this.$emit('salesOrder-selected', undefined)
      }

      this.clearData()
    },

    handleCancel() {
      this.$emit('salesOrder-selected', undefined)

      this.clearData()
    },

    handelClose() {
      this.$emit('salesOrder-selected', undefined)
      this.clearData()
    },

    clearData() {
      this.filter = ''
      this.salesOrderSelectedItem = ''
    },

    onChangePage(page) {
      this.currentPage = page
      this.initialize()
    },

    clearFilter() {
      this.filter = ''
      this.initialize()
    },

    async initialize() {
      const filterStr = {
        params: {
          filter: {
            customerId: this.openReclamation.customer,
          },
          pagination: { page: this.currentPage, limit: this.perPage },
        },
      }

      const response = await this.$store.dispatch('orders/findAll', filterStr)
      if (response.status === 200) {
        this.salesOrders = response.data.rows
        this.totalRows = response.data.count

        this.salesOrderTable = []
        for (const salesOrder of this.salesOrders) {
          this.salesOrderTable.push({
            salesOrderNumber: salesOrder.numberStr,
            salesDate: salesOrder.deliveryDate,
            shipmentDate: salesOrder.shipmentDate,
            proforma: salesOrder.proforma,
            reference: salesOrder.reference,
            responsible: salesOrder.responsible,
            postCode: salesOrder.postCode,
            address: salesOrder.address,
          })
        }
      }
    },
  },
}
</script>

<style></style>
