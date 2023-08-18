<template>
  <div class="btn-group">
    <b-button variant="outline-secondary" class="btn-sm">
      <i class="ri-archive-fill"></i>
    </b-button>
    <b-button variant="outline-secondary" class="btn-sm">
      <i class="ri-spam-2-fill"></i>
    </b-button>
    <b-button variant="outline-secondary" class="btn-sm">
      <i class="ri-delete-bin-line"></i>
    </b-button>
    <b-dropdown id="set-label" toggle-class="arrow-none" size="sm" variant="outline-secondary">
      <template slot="button-content">
        <i class="ri-price-tag-3-line"></i>
      </template>
      <b-list-group>
        <b-list-group-item class="label-list-item" v-for="(label, index) of selectedLabels" :key="index">
          <b-form-checkbox v-model="label.value" @change="onChangeLabel(label)">{{ label.name }}</b-form-checkbox>
        </b-list-group-item>
      </b-list-group>
      <b-tooltip target="set-label" triggers="hover">
        {{ $t('email.setLabel') }}
      </b-tooltip>
    </b-dropdown>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import _ from 'lodash'

export default {
  name: 'IncomingEmailToolbar',

  data() {
    return {
      selectedLabels: [],
    }
  },

  computed: {
    ...mapGetters({
      openEmail: 'mailbox/openEmail',
      emailAccount: 'mailbox/emailAccount',
    }),
  },

  async mounted() {
    await this.initLabels()
  },

  methods: {
    ...mapMutations({
      setEmailProperty: 'mailbox/setOpenEmailProperty',
    }),

    async initLabels() {
      this.$store
        .dispatch('emailLabels/findAll', { noCommit: true })
        .then((response) => {
          this.selectedLabels = response.data.map((el) => {
            const value = this.openEmail.labels.includes(el.name)

            return { name: el.name, value }
          })
        })
        .catch((error) => {
          console.error(error)
        })
    },

    onChangeLabel(label) {
      this.$store.dispatch('mailbox/setLabel', { emailAccountId: this.emailAccount, emailId: this.openEmail.id, label: label.name, setLabel: label.value }).then((result) => {
        const labels = _.cloneDeep(this.openEmail.labels)
        if (label.value === true) {
          if (!labels.includes(`${label.name}`)) {
            labels.push(`${label.name}`)
          }
        } else {
          const labelIndex = labels.indexOf(`${label.name}`)
          if (labelIndex > -1) {
            labels.splice(labelIndex, 1)
          }
        }

        this.setEmailProperty({ property: 'labels', value: labels })
      })
    },
  },
}
</script>

<style scoped>
.label-list-item {
  padding: 0.35rem 0.75rem;
}
</style>
