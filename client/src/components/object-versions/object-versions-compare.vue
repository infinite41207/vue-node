<template>
  <b-modal id="object-versions-compare" v-model="showDlg" size="xl" :title="$t('components.versionsCompare')" ok-only no-close-on-backdrop>
    <b-row>
      <b-col>
        <h4>{{ $t(`enums.changedTypes.${changeTypeL}`) }}: {{ changedByL }}</h4>
        <h5>{{ $t('table.changeDate') }}: {{ changedDateL }}</h5>
      </b-col>
      <b-col>
        <h4>{{ $t(`enums.changedTypes.${changeTypeR}`) }}: {{ changedByR }}</h4>
        <h5>{{ $t('table.changeDate') }}: {{ changedDateR }}</h5>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <CodeDiff :old-string="changedDataL" :new-string="changedDataR" output-format="side-by-side" :context="20" />
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
    versions: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      changedByL: '',
      changedDateL: '',
      changedDataL: '',
      changeTypeL: 'update',
      changedByR: '',
      changedDateR: '',
      changedDataR: '',
      changeTypeR: 'update',
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
    this.initObjectVersions()
  },

  methods: {
    async initObjectVersions() {
      if (this.versions) {
        this.$store.dispatch('objectVersions/findByPk', { params: { id: this.versions[0].id }, noCommit: true }).then((response) => {
          this.changedByL = response.data.user?.name
          this.changedDateL = moment(response.data.createdAt).format('DD.MM.YYYY HH:mm:ss')
          this.changedDataL = JSON.stringify(JSON.parse(response.data.objectData), null, 2)
        })

        this.$store.dispatch('objectVersions/findByPk', { params: { id: this.versions[1].id }, noCommit: true }).then((response) => {
          this.changedByR = response.data.user?.name
          this.changedDateR = moment(response.data.createdAt).format('DD.MM.YYYY HH:mm:ss')
          this.changedDataR = JSON.stringify(JSON.parse(response.data.objectData), null, 2)
        })
      }
    },
  },
}
</script>

<style>
</style>