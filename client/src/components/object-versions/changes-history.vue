<template>
  <b-modal
    id="modal-versions"
    size="xl"
    :title="$t('components.historyOfChanges')"
    ok-only
    no-close-on-backdrop
    @ok="handleOk"
    @close="handelClose"
  >
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
          :per-page="perPage"
          :current-page="currentPage"
        >
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="right"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
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
      versionsFields: [
        { key: 'id', label: this.$t('table.sort') },
        { key: 'createdAt', label: this.$t('table.changeDate') },
        { key: 'user', label: this.$t('table.user') },
        { key: 'description', label: this.$t('table.description') },
      ],
      versionsTable: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
    }
  },

  computed: {
    ...mapGetters({
      versions: 'objectVersions/versionsList',
      order: 'orders/openOrder',
    }),
  },

  async mounted() {
    await this.$store.dispatch('objectVersions/getObjectVersions', {
      params: {
        objectId: this.objectId,
        objectName: this.objectName,
      },
    })

    this.$bvModal.show('modal-versions')
    let i = 0
    for (const version of this.versions) {
      this.versionsTable.push({
        id: ++i,
        createdAt: version.createdAt,
        user: version.user ? version.user.name : '',
        description: version.description,
      })
    }

    this.totalRows = this.versionsTable.length
  },

  methods: {
    handleOk() {
      this.$emit('history-closed')
    },

    handelClose() {
      this.$emit('history-closed')
    },
  },
}
</script>

<style></style>
