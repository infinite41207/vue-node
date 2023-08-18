<template>
  <b-modal
    id="modal-customer"
    size="xl"
    :title="`${$t('common.searchCustomer')}!`"
    :cancel-title="$t('commands.cancel')"
    no-close-on-backdrop
    @ok="handleOk"
    @cancel="handleCancel"
    @close="handelClose"
  >
    <b-row>
      <b-col>
        <b-form-group label="Filter" label-for="filter-input" label-cols-sm="1">
          <b-input-group>
            <b-form-input id="search-customer" v-model="filter" type="search" debounce="50" :placeholder="`${$t('common.searchCustomer')}...`" @keyup.enter="selectCustomer">
            </b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">{{ $t('commands.clear') }}</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
        <b-table
          ref="customerTable"
          v-model="customerFilteredRows"
          no-border-collapse
          responsive="sm"
          selectable
          select-mode="single"
          sticky-header="400px"
          lazy
          :filter-included-fields="customerFilterFields"
          :fields="customerFields"
          :filter="filter"
          :items="customerTable"
          :per-page="perPage"
          :current-page="currentPage"
          small
          @row-selected="customerRowSelected"
          @filtered="onFiltered"
        >
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right" class="my-0"></b-pagination>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CustomerSelect',
  props: {
    returnName: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      customerFields: [
        { key: 'abbreviation', label: this.$t('table.abbreviation') },
        { key: 'name', label: this.$t('table.name') },
        { key: 'email', label: this.$t('table.email') },
        { key: 'country', label: this.$t('table.country') },
        { key: 'address', label: this.$t('table.address') },
      ],
      customerTable: [],
      filter: '',
      customerId: '',
      customerFilteredRows: [],
      customerFilterFields: ['abbreviation', 'name', 'email'],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
    }
  },

  computed: {
    ...mapGetters({
      counterparties: 'counterparties/customerList',
    }),
  },

  async mounted() {
    if (this.counterparties.length === 0) {
      await this.$store.dispatch('counterparties/findAll', { status: 'Active' })
    }

    this.$bvModal.show('modal-customer')
    for (const customer of this.counterparties) {
      this.customerTable.push({
        id: customer.id,
        name: customer.name,
        abbreviation: customer.abbreviation,
        email: customer.email,
        country: customer.country ? customer.country.name : customer.countryStr,
        address: customer.address,
      })
    }

    this.totalRows = this.customerTable.length
  },

  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    selectCustomer() {
      if (this.customerFilteredRows.length === 1) {
        this.$refs.customerCollapsibleTable.selectRow(0)
      }
    },

    customerRowSelected(rowArray) {
      if (rowArray.length === 1) {
        this.filter = rowArray[0].name
        this.customerId = rowArray[0].id
      }
    },

    handleOk() {
      if (this.customerId !== '') {
        this.$emit('value-selected', this.returnName === true ? { id: this.customerId, name: this.filter } : this.customerId)
      } else {
        this.$emit('value-selected', undefined)
      }

      this.clearData()
    },

    handleCancel() {
      this.$emit('value-selected', undefined)

      this.clearData()
    },

    handelClose() {
      this.$emit('value-selected', undefined)
      this.clearData()
    },

    clearData() {
      this.filter = ''
      this.customerId = ''
    },
  },
}
</script>

<style></style>
