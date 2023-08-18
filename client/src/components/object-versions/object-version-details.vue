<template>
  <b-modal id="object-version-details" v-model="showDlg" size="xl" :title="$t('components.versionDetails')" ok-only no-close-on-backdrop>
    <b-row class="mb-2">
      <b-col>
        <h4>{{ $t(`enums.changedTypes.${changeType}`) }}: {{ changedBy }}</h4>
      </b-col>
      <b-col>
        <h4>{{ $t('table.changeDate') }}: {{ changedDate }}</h4>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-textarea v-model="changedData" disabled rows="15"> </b-form-textarea>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
    versionId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      changedBy: '',
      changedDate: '',
      changedData: '',
      changeType: 'update',
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
  },

  async mounted() {
    this.initObjectVersion()
  },

  methods: {
    async initObjectVersion() {
      if (this.versionId) {
        this.$store.dispatch('objectVersions/findByPk', { params: { id: this.versionId }, noCommit: true }).then((response) => {
          this.changedBy = response.data.user?.name
          this.changedDate = moment(response.data.createdAt).format('DD.MM.YYYY HH:mm:ss')
          this.changeType = response.data.description == 'create' ? 'create' : 'update'
          this.changedData = JSON.stringify(JSON.parse(response.data.objectData), null, 4)
        })
      }
    },
  },
}
</script>

<style>
</style>