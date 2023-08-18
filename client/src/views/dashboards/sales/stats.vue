<script>
import moment from 'moment'
import StatIcon from '@/components/widgets/widget-stat-icon'

export default {
  name: 'DashboardEcommerceStats',
  components: { StatIcon },
  props: {
    period: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      statsData: [
        {
          icon: 'ri-team-line',
          number: '0',
          title: 'Customers',
          tooltip: 'Number of Customers',
          color: 'success',
          subtext: '0',
        },
        {
          icon: 'ri-shopping-cart-2-line',
          number: '0',
          title: 'Interactions',
          tooltip: 'Number of Interactions',
          color: 'success',
          subtext: '0',
        },
        {
          icon: 'ri-money-dollar-circle-line',
          number: '0',
          tooltip: 'Number of Customer Request',
          title: 'Customer Request',
          color: 'success',
          subtext: '0',
        },
        {
          icon: 'ri-pulse-line',
          number: '$0',
          title: 'Amount of Customer Request',
          tooltip: 'Amount of Customer Request',
          color: 'success',
          subtext: '0',
        },
      ],
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const params = {
        filter: {
          period: this.period,
        },
      }

      const lastMonthParams = {
        filter: {
          period: [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],
        },
      }

      // customers
      Promise.all([this.getCount('counterparties/getCount', { params }), this.getCount('counterparties/getCount', { params: lastMonthParams })]).then((counts) => {
        this.updateData(0, counts)
      })
      // interactions
      Promise.all([this.getCount('interactions/getCount', { params }), this.getCount('interactions/getCount', { params: lastMonthParams })]).then((counts) => {
        this.updateData(1, counts)
      })
      // customer requests
      Promise.all([this.getCount('customerRequests/getCount', { params }), this.getCount('customerRequests/getCount', { params: lastMonthParams })]).then((counts) => {
        this.updateData(2, counts)
      })
      // customer requests amount - sumBrutto
      Promise.all([this.getCount('customerRequests/getAmount', { params }), this.getCount('customerRequests/getAmount', { params: lastMonthParams })]).then((counts) => {
        this.updateData(3, [parseFloat(counts[0].totalAmount || 0), parseFloat(counts[1].totalAmount || 0)], '$')
      })
    },
    async getCount(...props) {
      return this.$store.dispatch(...props).then((res) => res.data.count || 0)
    },
    updateData(index, counts, affix = '') {
      this.statsData[index].number = affix + counts[0]
      const { percentage, color } = this.calculatePercentage(counts)
      this.statsData[index].subtext = percentage.toFixed(2)
      this.statsData[index].color = color
    },
    calculatePercentage(counts) {
      const currentMonthCount = counts[0]
      const lastMonthCount = counts[1]
      const data = {
        percentage: 0,
        color: 'success',
      }

      if (lastMonthCount < 1) {
        data.percentage = currentMonthCount * 100
        return data
      }

      if (currentMonthCount > lastMonthCount) {
        data.percentage = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100
        return data
      } else {
        data.percentage = ((lastMonthCount - currentMonthCount) / (currentMonthCount || 1)) * 100
        data.color = 'danger'
        return data
      }
    },
  },
  watch: {
    period() {
      this.fetchData()
    },
  },
}
</script>

<template>
  <div class="row">
    <div v-for="widget of statsData" :key="widget.title" class="col-lg-6">
      <StatIcon :icon="widget.icon" :title="widget.title" :tooltip="widget.tooltip" :number="widget.number" :subtext="widget.subtext" :color="widget.color" />
    </div>
  </div>
</template>
