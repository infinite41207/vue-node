<template>
  <b-modal id="modal-tracking" size="xl" :title="$t('components.historyOfChanges')" ok-only no-close-on-backdrop @ok="handleOk" @close="handelClose">
    <b-row>
      <b-col>
        <b-table
          ref="trackingTable"
          no-border-collapse
          responsive="sm"
          selectable
          select-mode="single"
          sticky-header="400px"
          lazy
          :fields="trackingFields"
          :items="trackingTable"
          :per-page="perPage"
          :current-page="currentPage"
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
import moment from 'moment'

export default {
  props: {
    timeTrackingHistoryTable: {
      type: Array,
      required: true,
    },
    objectId: {
      type: String,
      required: true,
    },
    objectName: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      trackingFields: [
        { key: 'id', label: this.$t('table.sort') },
        { key: 'user', label: this.$t('table.user') },
        { key: 'startDate', label: this.$t('table.startDate') },
        { key: 'endDate', label: this.$t('table.endDate') },
        { key: 'comment', label: this.$t('table.description') },
      ],
      trackingTable: [],

      totalRows: 1,
      currentPage: 1,
      perPage: 10,
    }
  },

  async mounted() {
    this.$bvModal.show('modal-tracking')
    let i = 0
    for (const timeTrackingRecord of this.timeTrackingHistoryTable) {
      this.trackingTable.push({
        id: ++i,
        startDate: moment(timeTrackingRecord.startDate).format('DD.MM.YYYY HH:mm:ss'),
        endDate: moment(timeTrackingRecord.endDate).format('DD.MM.YYYY HH:mm:ss'),
        user: timeTrackingRecord.user ? timeTrackingRecord.user.name : '',
        comment: timeTrackingRecord.comment,
      })
    }

    // this.totalRows = this.versionsTable.length
  },

  methods: {
    handleOk() {
      this.$emit('tracking-closed')
    },

    handelClose() {
      this.$emit('tracking-closed')
    },
  },
}
</script>

<style></style>
