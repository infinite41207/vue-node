<template>
  <b-modal id="versions-history" size="xl" :title="$t('components.historyOfChanges')" ok-only no-close-on-backdrop @ok="handleOk" @close="handelClose">
    <b-row>
      <b-col>
        <b-table
          ref="versionTable"
          no-border-collapse
          responsive="sm"
          selectable
          select-mode="single"
          sticky-header="400px"
          lazy
          :fields="versionsFields"
          :items="versionsTable"
          :tbody-tr-class="rowClass"
          :per-page="perPage"
          :current-page="currentPage"
        >
          <template v-slot:cell(numberStr)="data">
            <a href="javascript:void(0);" @click="editItem(data.item.id)"
              ><span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ data.item.numberStr }} w. {{ data.item.version }}</span>
            </a>
          </template>
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
export default {
  name: 'CRVersionsHistory',
  props: {
    versionUuid: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      viewId: this.$route.params.id,
      versionsFields: [
        { key: 'numberStr', label: this.$t('table.number') },
        { key: 'status.name', label: this.$t('table.status') },
        { key: 'createdAt', label: this.$t('table.createdAt') },
        { key: 'customer.name', label: this.$t('table.customer') },
        { key: 'reference', label: this.$t('table.reference') },
        { key: 'constr.name', label: this.$t('table.constructor') },
        { key: 'author.name', label: this.$t('table.author') },
      ],
      versionsTable: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
    }
  },

  async mounted() {
    this.$bvModal.show('versions-history')

    this.versionsTable = await this.$store.dispatch('customerRequests/getVersions', {
      params: {
        filter: {
          versionUuid: this.versionUuid,
        },
      },
    })

    this.totalRows = this.versionsTable.length
  },

  methods: {
    handleOk() {
      this.$emit('version-history-end')
    },

    handelClose() {
      this.$emit('version-history-end')
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
      if (item.state === 'Deactive') return 'table-secondary text-secondary striped'
    },

    async editItem(itemId) {
      const dataObject = await this.$store.dispatch('customerRequests/findByPk', {
        params: {
          id: itemId,
        },
      })
      if (dataObject) {
        this.$router.push({ name: 'customer-request-detail' })

        this.$emit('version-history-end')
      }
    },
  },
}
</script>

<style></style>
