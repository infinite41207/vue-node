<template>
  <div class="card widget-inline">
    <div class="card-body p-0">
      <div class="row no-gutters">
        <div v-for="data of statData" :key="data.text" class="col-sm-6 col-xl-3">
          <div class="card shadow-none m-0 border-left">
            <div class="card-body text-center">
              <i :class="`${data.icon} text-muted`" style="font-size: 24px"></i>
              <h3>
                <span>{{ data.value }}</span>
              </h3>
              <p class="text-muted font-15 mb-0">{{ data.text }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- end row -->
    </div>
    <!-- end card-body -->
  </div>
  <!-- end card-->
</template>

<script>
export default {
  name: 'SettlementsStats',
  data() {
    return {
      statData: [
        {
          icon: 'ri-list-check-2',
          value: 0,
          text: 'Otwarte',
        },
        {
          icon: 'ri-todo-line',
          value: 0,
          text: 'W trakcie',
        },
        {
          icon: 'ri-lightbulb-line',
          value: 0,
          text: 'Zbliżające się',
        },
        {
          icon: 'ri-alert-line',
          value: 0,
          text: 'w tym przeterminowane',
        },
      ],

      reclamations: [],
      opened: 0,
    }
  },

  async mounted() {
    this.initialize()
  },

  methods: {
    async initialize() {
      await this.getMainStatistic()
    },

    async getMainStatistic() {
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

      // all opened
      this.statData[0].value = this.reclamations.length

      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)

      // expired status
      const expired = 0

      const expiredReclamations = this.reclamations.filter((el) => {
        return new Date(el.executionTerm) < currentDate
      })

      this.statData[3].value = expiredReclamations.length

      // comming
      const commingReclamations = this.reclamations.filter((el) => {
        const reclDate = new Date(el.executionTerm)

        if (reclDate < currentDate) {
          return false
        } else {
          reclDate.setDate(reclDate.getDate() - 4)
          return reclDate <= currentDate
        }
      })

      this.statData[2].value = commingReclamations.length

      // other
      this.statData[1].value = this.statData[0].value - this.statData[2].value - this.statData[3].value
    },
  },
}
</script>
