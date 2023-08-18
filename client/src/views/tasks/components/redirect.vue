<template>
  <b-modal
    id="task-redirection"
    size="xl"
    :title="`${$t('task.redirection')}`"
    :cancel-title="$t('commands.cancel')"
    no-close-on-backdrop
    :ok-title="`${$t('commands.redirect')}`"
    @ok="handleOk"
    @cancel="handleCancel"
    @close="handelClose"
  >
    <b-card>
      <b-row class="mb-2">
        <b-col md="3"
          ><b-form-checkbox v-model="forExecutor" name="for-executor" switch @change="forExecutorRole = !forExecutor">
            {{ $t('task.forExecutor') }}
          </b-form-checkbox>
        </b-col>
        <b-col>
          <b-form-select
            id="task-executor"
            v-model="executor"
            :options="executors"
            text-field="name"
            value-field="id"
            name="task-executor"
            :state="executorState"
            :placeholder="$t('common.selectExecutor')"
            aria-describedby="task-executor-feedback"
            :disabled="!forExecutor"
            size="sm"
          ></b-form-select>
          <b-form-invalid-feedback id="task-executor-feedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            {{ $t('common.notEmptyField') }}
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
      <b-row class="mb-2">
        <b-col md="3">
          <b-form-checkbox
            v-model="forExecutorRole"
            name="for-executor-role"
            switch
            @change="forExecutor = !forExecutorRole"
          >
            {{ $t('task.forExecutorRole') }}
          </b-form-checkbox>
        </b-col>
        <b-col>
          <b-form-select
            id="task-executor-role"
            v-model="executorRole"
            :options="executorRoles"
            text-field="name"
            value-field="id"
            name="task-executor-role"
            :placeholder="$t('common.selectExecutorRole')"
            :state="executorRoleState"
            aria-describedby="task-executor-role-feedback"
            :disabled="!forExecutorRole"
            size="sm"
          ></b-form-select>
          <b-form-invalid-feedback id="task-executor-role-feedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            {{ $t('common.notEmptyField') }}
          </b-form-invalid-feedback>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-form-textarea
            id="item-comment"
            v-model="comment"
            rows="6"
            name="item-comment"
            placeholder="Wpisz komentarz ..."
          ></b-form-textarea>
        </b-col>
      </b-row>
    </b-card>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'RedirectTask',
  props: {
    taskId: {
      type: Number,
      require: true,
      default: null,
    },
    history: {
      type: String,
      require: true,
      default: '',
    },
    fromObject: {
      type: Boolean,
      require: true,
      default: false,
    },
  },

  data() {
    return {
      forExecutorRole: false,
      forExecutor: true,
      executorRole: null,
      executor: null,
      comment: '',
      executorRoles: [],
      executors: [],
    }
  },

  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
    }),

    executorState() {
      return this.forExecutor === true ? this.executor !== null : true
    },

    executorRoleState() {
      return this.forExecutorRole === true ? this.executorRole !== null : true
    },
  },

  async mounted() {
    this.$bvModal.show('task-redirection')

    this.initialize()
  },

  methods: {
    async initialize() {
      await this.initExecutorRoles()
      await this.initExecutors()
    },

    async initExecutorRoles() {
      await this.$store
        .dispatch('executorRoles/findAll', { noCommit: true })
        .then((response) => {
          if (response.status === 200) {
            this.executorRoles = response.data
          } else {
            this.executorRoles = []
          }
        })
        .catch((error) => {
          console.error(error)
          this.executorRoles = []
        })
    },
    async initExecutors() {
      await this.$store
        .dispatch('executors/findAll', { noCommit: true })
        .then((executors) => {
          this.executors = executors
        })
        .catch((error) => {
          console.error(error)
          this.executors = []
        })
    },

    async handleOk(event) {
      event.preventDefault()

      if (this.forExecutor === true && this.executor === null) {
        this.$bvToast.toast('Nie wypełniony Wykonawca!!!', {
          title: this.$t('common.msg'),
          variant: 'danger',
          solid: true,
          autoHideDelay: 2000,
        })
        this.$bvModal.show('task-redirection')
        return
      }

      if (this.forExecutorRole === true && this.executorRole === null) {
        this.$bvToast.toast('Nie wypełniono Roli wykonawcy!!!', {
          title: this.$t('common.msg'),
          variant: 'danger',
          solid: true,
          autoHideDelay: 2000,
        })
        this.$bvModal.show('task-redirection')

        return
      }

      let updateData = { executionAccepted: false, executionAcceptanceDate: null }

      let newExecutor

      if (this.forExecutor === true) {
        updateData = { executorId: this.executor }

        newExecutor = this.executors.find((el) => {
          return el.id === this.executor
        })
      } else {
        updateData = { executorRoleId: this.executorRole, executorId: null }

        newExecutor = this.executorRoles.find((el) => {
          return el.id === this.executorRole
        })
      }

      let history = `${!this.history ? '' : `${this.history}\n\n`}[${moment().format('DD.MM.YYYY HH:MM')}] ${
        this.currentUser.name
      }:\nPrzekierował zadanie do ${newExecutor ? newExecutor.name : ''}`

      if (this.comment !== '') {
        history += `\nKomentarz:\n${this.comment}`
      }

      updateData.executionHistory = history

      await this.$store
        .dispatch('tasks/update', { id: this.taskId, updateData })
        .then(async (response) => {
          if (response.status === 200) {
            if (this.fromObject === true) {
              await this.$store.dispatch('tasks/findByPk', {
                params: {
                  id: this.taskId,
                },
              })
            }

            this.$emit('redirect-end', undefined)

            this.$nextTick(() => {
              this.$bvModal.hide('task-redirection')
            })
          } else {
            this.$bvToast.toast(response.data.message, {
              title: this.$t('common.msg'),
              variant: 'danger',
              solid: true,
              autoHideDelay: 2000,
            })
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },

    handleCancel() {
      this.$emit('redirect-end', undefined)
    },

    handelClose() {
      this.$emit('redirect-end', undefined)
    },
  },
}
</script>

<style></style>
