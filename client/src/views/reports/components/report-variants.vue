<template>
  <div>
    <b-card :title="$t('report.variants')">
      <b-row class="mb-2">
        <b-col>
          <b-button-toolbar>
            <b-button variant="outline-secondary" class="mr-1 btn-sm" @click="writeReportVariant">
              <i class="ri-file-download-fill mr-1"></i>
              {{ $tc('commands.write') | upper }}
            </b-button>
            <b-button variant="outline-secondary" class="mr-1 btn-sm" @click="loadReportVariant">
              <i class="ri-server-fill mr-1"></i>
              {{ $tc('commands.select') | upper }}
            </b-button>
            <b-button variant="outline-secondary" class="mr-1 btn-sm" @click="renameReportVariant">
              <i class="ri-pencil-fill mr-1"></i>
              {{ $tc('commands.change') | upper }}
            </b-button>
            <b-button variant="outline-secondary" class="mr-1 btn-sm" @click="deleteReportVariant">
              <i class="ri-delete-bin-line mr-1"></i>
              {{ $tc('commands.delete') | upper }}
            </b-button>
          </b-button-toolbar>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-table
            ref="reportVariants"
            responsive
            hover
            bordered
            :items="reportVariants"
            :fields="tabFields"
            class="mb-0"
            small
            :tbody-tr-class="rowClass"
            primary-key="index"
            select-mode="single"
            selectable
            @row-selected="onRowSelected"
          >
            <template v-slot:cell(user)="data">
              <span> {{ data.item.user === true ? '+' : '-' }} </span>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-card>

    <b-modal v-model="isWriteVariant" :title="$t('report.writeVariant')" centered :cancel-title="$t('commands.cancel')" @ok="onWriteVariantOk">
      <b-card>
        <b-row class="mb-1">
          <b-col>
            <b-form-group horizontal :label-cols="3" :label="$t('table.name')">
              <b-form-input id="cur-variant-name" v-model="variantName" type="text" size="sm" autofocus />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col>
            <b-form-group horizontal :label-cols="7" :label="$t('report.onlyForThisUser')">
              <b-form-checkbox id="only-this-user" v-model="onlyCurrentUser" size="sm"> </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group horizontal :label-cols="7" :label="$t('report.newVariant')">
              <b-form-checkbox id="is-new-variant" v-model="isNewVariant" size="sm"> </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>
    </b-modal>

    <b-modal v-model="isRenameVariant" :title="$t('report.changeVariantName')" centered @ok="onRenameVariantOk">
      <b-card>
        <b-row>
          <b-col>
            <b-form-group horizontal :label-cols="3" :label="$t('table.name')">
              <b-form-input id="change-name" v-model="variantName" type="text" size="sm" autofocus />
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>
    </b-modal>

    <b-modal v-model="isDeleteVariant" :title="$t('common.modalTitle')" :cancel-title="$t('commands.cancel')" :ok-title="$t('commands.ok')" @ok="onDeleteVariantOk">
      <b-card>
        <b-row>
          <b-col>
            <p> {{ `${$t('report.deleteVariant')} ${variantName}` }} ?</p>
          </b-col>
        </b-row>
      </b-card>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import _ from 'lodash'
import { uuid } from 'vue-uuid'

export default {
  name: 'ReportVariants',

  props: {
    reportType: {
      type: String,
      require: true,
      default: null,
    },
  },

  data() {
    return {
      isWriteVariant: false,
      isRenameVariant: false,
      isNewVariant: false,
      isDeleteVariant: false,
      variantId: null,
      variantName: '',
      onlyCurrentUser: false,
      currentUserId: null,
      tabFields: [
        { key: 'index', label: 'Nr', thStyle: { width: '10%' } },
        { key: 'name', label: 'Nazwa', sortable: true, thStyle: { width: '80%' } },
        { key: 'user', label: 'Uż', thStyle: { width: '10%' } },
        { key: 'id', label: 'id', thClass: 'd-none', tdClass: 'd-none' },
      ],
    }
  },

  computed: {
    ...mapGetters({
      getReportView: 'reports/reportView',
    }),

    reportView() {
      return this.getReportView(this.reportType)
    },

    settings() {
      return this.reportView?.settings
    },

    reportVariants() {
      return this.reportView?.reportVariants
    },
  },

  async created() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      setReportSettings: 'reports/setReportSettings',
    }),

    async initialize() {
      this.currentUserId = this.$store.state.auth.currentUser?.id

      await this.getReportVariants()
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },

    writeReportVariant() {
      this.isNewVariant = !this.variantId
      this.isWriteVariant = true
    },

    async loadReportVariant() {
      await this.$store
        .dispatch('reports/getReportVariant', {
          params: {
            id: this.variantId,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const reportVariant = response.data

            this.setReportSettings({
              reportType: this.reportType,
              settings: reportVariant.settings,
            })
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },

    async getReportVariants() {
      const filter = {
        reportType: this.reportType,
        currentUserId: this.currentUserId,
      }
      await this.$store.dispatch('reports/getReportVariants', filter).catch((error) => {
        console.error(error)
      })
    },

    renameReportVariant() {
      this.isRenameVariant = true
    },

    deleteReportVariant() {
      this.isDeleteVariant = true
    },

    async onWriteVariantOk() {
      const settings = _.cloneDeep(this.settings)

      const reportVariantData = {
        id: this.isNewVariant === true ? uuid.v4() : this.variantId,
        reportName: this.reportType,
        variantName: this.variantName,
        userId: this.onlyCurrentUser ? this.currentUserId : null,
        settings: JSON.stringify(settings),
      }

      if (this.isNewVariant === true) {
        await this.$store.dispatch('reports/createReportVariant', reportVariantData)
      } else {
        await this.$store.dispatch('reports/updateReportVariant', reportVariantData)
      }

      this.getReportVariants()
    },

    async onRenameVariantOk() {
      const reportVariantData = {
        id: this.variantId,
        variantName: this.variantName,
      }
      await this.$store.dispatch('reports/updateReportVariant', reportVariantData)

      this.getReportVariants()
    },

    onRowSelected(items) {
      this.selectedList = items

      if (this.selectedList.length > 0) {
        this.variantId = this.selectedList[0].id
        this.variantName = this.selectedList[0].name
        this.onlyCurrentUser = this.selectedList[0].user
      } else {
        this.variantId = null
        this.variantName = ''
        this.onlyCurrentUser = false
      }
    },

    async onDeleteVariantOk() {
      // this.isDeleteVariant = false
      await this.$store.dispatch('reports/deleteReportVariant', {
        params: {
          id: this.variantId,
        },
      })

      this.getReportVariants()
    },
  },
}
</script>

<style>
.top {
  background: #2d9c7b;
}
</style>