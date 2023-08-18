<script>
export default {
  name: 'DashboardEcommerceProducts',
  data() {
    return {
      products: [],
      fields: [
        { key: 'name', label: '' },
        { key: 'price', label: '' },
        { key: 'quantity', label: '' },
        { key: 'amount', label: '' },
      ],
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // customer requests amount by client - sumBrutto
      const params = {
        group: 'customer',
      }

      this.$store
        .dispatch('customerRequests/getAmount', { params })
        .then((res) => res.data?.count)
        .then((data) => {
          const products = []
          data.map((item) => {
            products.push({
              name: item.customerName || item.customer.presentation || item.customer.name,
              price: parseFloat(item.price || item.totalAmount / item.quantity).toFixed(2),
              quantity: item.quantity,
              amount: parseFloat(item.totalAmount).toFixed(2),
            })
          })
          this.products = products
        })
    },
  },
}
</script>

<template>
  <b-card>
    <div class="d-flex justify-content-between">
      <h4 class="header-title mb-2">Amount by clients</h4>
      <b-dropdown toggle-class="card-drop p-0" variant="black" no-caret right>
        <template v-slot:button-content>
          <i class="ri-more-2-fill"></i>
        </template>
        <b-dropdown-item>Sales Report</b-dropdown-item>
        <b-dropdown-item>Export Report</b-dropdown-item>
        <b-dropdown-item>Profit</b-dropdown-item>
        <b-dropdown-item>Action</b-dropdown-item>
      </b-dropdown>
    </div>

    <b-table responsive :items="products" :fields="fields" class="products-table">
      <template v-slot:cell(name)="data">
        <h5 class="font-14 mb-1 font-weight-normal">{{ data.item.name }}</h5>
      </template>
      <template v-slot:cell(price)="data">
        <h5 class="font-14 mb-1 font-weight-normal">{{ data.item.price }}</h5>
        <span class="text-muted font-13">Price</span>
      </template>
      <template v-slot:cell(quantity)="data">
        <h5 class="font-14 mb-1 font-weight-normal">{{ data.item.quantity }}</h5>
        <span class="text-muted font-13">Quantity</span>
      </template>
      <template v-slot:cell(amount)="data">
        <h5 class="font-14 mb-1 font-weight-normal">{{ data.item.amount }}</h5>
        <span class="text-muted font-13">Amount</span>
      </template>
    </b-table>
  </b-card>
</template>

<style lang="scss">
.products-table {
  td {
    border-top-color: #dee2e6;
  }
}
</style>
