<template>
  <b-modal id="object-history" v-model="showDlg" size="xl" :title="$t('components.historyOfChanges')" ok-only no-close-on-backdrop>
    <b-row>
      <b-col>
        <b-button-toolbar class="mb-2">
          <b-button-group>
            <b-button variant="outline-success" size="sm" :disabled="selectedRowsCount === 0" @click="versionDetails = true">
              <i class="ri-search-line mr-1"></i> {{ $t('commands.open') }}
            </b-button>
            <b-button variant="outline-secondary" size="sm" class="ml-1" :disabled="selectedRowsCount !== 2" @click="compareVersions = true">
              <i class="ri-git-merge-line mr-1"></i> {{ $t('commands.compare') }}
            </b-button>
          </b-button-group>
        </b-button-toolbar>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table
          ref="versions"
          no-border-collapse
          responsive="sm"
          selectable
          select-mode="range"
          sticky-header="400px"
          lazy
          small
          :fields="fields"
          :items="versions"
          :per-page="perPage"
          :current-page="1"
          show-empty
          :empty-text="$t('common.emptyHistoryList')"
          @row-selected="onRowSelected"
        >
          <template v-slot:empty="scope">
            <h5>{{ scope.emptyText }}</h5>
          </template>
          <template v-slot:table-colgroup="scope">
            <col v-for="field in scope.fields" :key="field.key" :style="{ width: field.width ? field.width : '' }" />
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right" class="my-0"></b-pagination>
      </b-col>
    </b-row>

    <ObjectVersionDetails v-if="versionDetails" v-model="versionDetails" :version-id="selectedRows[0].id" />
    <ObjectVersionsCompare v-if="compareVersions" v-model="compareVersions" :versions="selectedRows" />
  </b-modal>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import ObjectVersionDetails from './object-version-details.vue'
import ObjectVersionsCompare from './object-versions-compare.vue'

export default {
  components: {
    ObjectVersionDetails,
    ObjectVersionsCompare,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
    objectId: {
      type: String,
      required: true,
    },
    objectType: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      fields: [
        { key: 'idx', label: this.$t('table.sort'), width: '7%' },
        {
          key: 'createdAt',
          label: this.$t('table.changeDate'),
          formatter: (value) => {
            return !value ? '-' : moment(value).format('DD.MM.YYYY HH:mm:ss')
          },
          width: '25%',
        },
        { key: 'user', label: this.$t('table.user') },
        {
          key: 'description',
          label: this.$t('table.description'),
          formatter: (value) => {
            return value == 'create' || value == 'update' ? this.$t(`enums.changeTypes.${value}`) : value
          },
        },
      ],
      versions: [],
      totalRows: 0,
      currentPage: 1,
      perPage: 15,
      selectedRows: null,
      compareVersions: false,
      versionDetails: false,
    }
  },

  computed: {
    showDlg: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },

    selectedRowsCount() {
      return !this.selectedRows ? 0 : this.selectedRows.length
    },
  },

  async mounted() {
    this.totalRows = 0

    await this.$store
      .dispatch('objectVersions/findAll', {
        noCommit: true,
        params: {
          filter: {
            objectId: this.objectId,
            objectType: this.objectType,
          },
          attributes: { exclude: ['objectData'] },
          pagination: { page: this.currentPage, limit: this.perPage },
          sort: { sortBy: 'createdAt', sortDesc: false },
        },
      })
      .then((response) => {
        let i = 0

        for (const version of response.data.rows) {
          this.versions.push({
            idx: ++i,
            id: version.id,
            createdAt: version.createdAt,
            user: version.user ? version.user.name : '',
            description: version.description,
          })
        }

        this.totalRows = response.data.count
      })
  },

  methods: {
    onRowSelected(items) {
      if (items && items.length > 0) {
        this.selectedRows = _.cloneDeep(items)
      } else {
        this.selectedRows = null
      }
    },
  },
}
</script>

<style></style>
