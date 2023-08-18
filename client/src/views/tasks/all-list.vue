<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col>
        <b-card>
          <b-row class="mb-2">
            <b-col md="3">
              <b-button :disabled="!selectedTask || selectedTask.executed || selectedTask.executionAccepted" class="btn btn-primary" @click="acceptToExecutionTask">
                {{ $t('task.executionReceive') }}
              </b-button>
              <b-button :disabled="!selectedTask || selectedTask.executed" class="btn btn-success ml-2" @click="executeTask">
                <i class="ri-check-line"></i>
                {{ $t('commands.execute') }}
              </b-button>
            </b-col>
            <b-col md="2">
              <b-form-checkbox id="filter-executed" v-model="showExecuted" :disabled="true" name="filter-executed" class="mt-2" switch @change="changeExecutedFilter">
                {{ $t('task.showExecuted') }}
              </b-form-checkbox>
            </b-col>
            <b-col md="2">
              <b-form-checkbox id="filter-my-tasks" v-model="showMyTasks" name="filter-my-tasks" class="mt-2" switch @change="changeMyTasksFilter">
                {{ $t('task.showMyne') }}
              </b-form-checkbox>
            </b-col>
            <b-col>
              <b-form-group :label="$t('common.filter')" label-for="filter-input" label-cols-sm="2">
                <b-input-group>
                  <b-form-input id="filter-input" v-model="filter" type="search" autofocus :placeholder="$t('common.search')"></b-form-input>

                  <b-input-group-append>
                    <b-button variant="danger" :disabled="!filter" @click="filter = ''">{{ $t('commands.clear') }}</b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                ref="taskList"
                hover
                :items="tasks"
                :fields="fields"
                :filter="filter"
                :filter-included-fields="filterOn"
                selectable
                select-mode="single"
                class="mb-2"
                :per-page="perPage"
                :current-page="currentPage"
                :tbody-tr-class="rowClass"
                @row-selected="onRowSelected"
              >
                <template v-slot:cell(number)="data">
                  <template v-if="data.rowSelected">
                    <span class="ri-check-line mr-1 text-info" aria-hidden="true"></span>
                  </template>
                  <template v-else>
                    <span class="ri-arrow-right-s-line mr-1 text-info" aria-hidden="true"></span>
                  </template>
                  <a href="javascript:void(0);" @click="editTask(data.item.id)"
                    ><span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ data.item.number }}</span>
                  </a>
                </template>
                <template v-slot:cell(delete)="data">
                  <a
                    href="javascript:void(0);"
                    :class="data.item.markedToDelete ? 'ri-arrow-up-circle-fill text-primary' : 'ri-delete-bin-7-fill text-danger'"
                    @click="deleteTask(data.item.id)"
                  >
                  </a>
                </template>
                <template v-slot:cell(importance)="data">
                  <span
                    class="badge"
                    :class="{
                      'badge-success-lighten': data.item.importance === 'LOW',
                      'badge-primary-lighten': data.item.importance === 'NORMAL',
                      'badge-danger-lighten': data.item.importance === 'HIGHT',
                    }"
                    >{{ $t(`importance.${data.item.importance}`) }}</span
                  >
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right" class="my-0"></b-pagination>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- modal message -->
    <b-modal id="modal-message" hide-footer :title="$t('common.modalTitle')">
      <p class="my-4">{{ modalMessage }}</p>
    </b-modal>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations } from 'vuex'

/**
 * Tasks component
 */
export default {
  name: 'TasksAllList',

  page() {
    return { title: this.$t('route.tasks'), meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: {
    Layout,
    PageHeader,
  },

  data() {
    return {
      title: this.$t('route.tasks'),
      perPage: 10,
      currentPage: 1,
      totalRows: 1,
      fields: [
        { key: 'number', label: this.$t('table.number'), sortable: true },
        { key: 'name', label: this.$t('table.name'), sortable: true },
        {
          key: 'importance',
          label: this.$t('table.importance'),
          sortable: true,
        },
        { key: 'date', label: this.$t('table.createdAt'), sortable: true },
        { key: 'executionPeriod', label: this.$t('table.executionPeriod'), sortable: true },
        { key: 'customer.name', label: this.$t('table.customer'), sortable: true },
        { key: 'baseDocument', label: this.$t('table.baseDocument'), sortable: true },

        { key: 'authorName', label: this.$t('table.author'), sortable: true },
        { key: 'executorName', label: this.$t('table.executor'), sortable: true },
        { key: 'delete', label: '' },
      ],
      filter: null,
      filterOn: [],
      showMyTasks: false,
      showExecuted: false,
      selectedTask: null,
      modalMessage: '',
    }
  },

  computed: {
    ...mapGetters({
      tasks: 'tasks/taskList',
    }),
  },

  watch: {
    tasks(newVal, oldVal) {
      this.$refs.taskList.refresh()
    },
  },

  async created() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      setOpenTask: 'tasks/setOpenTask',
    }),

    async initialize() {
      await this.updateList()
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    async updateList() {
      const filterStr = {
        params: {
          filter: {},
        },
      }

      if (!this.showExecuted) {
        filterStr.params.filter.executed = false
      }

      if (this.showMyTasks) {
        filterStr.params.filter.myTasks = this.showMyTasks
      }

      await this.$store.dispatch('tasks/findAll', filterStr)

      this.totalRows = this.tasks.length
      this.currentPage = 1
    },

    async editTask(taskId) {
      const dataObject = await this.$store.dispatch('tasks/findByPk', {
        params: {
          id: taskId,
        },
      })
      if (dataObject) {
        this.$router.push({ name: 'task-detail' })
      }
    },

    changeExecutedFilter() {
      this.updateList()
    },

    changeMyTasksFilter() {
      this.updateList()
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
      if (item.executed) return 'table-success text-secondary striped'
      if (item.executionAccepted) return 'table-warning striped'
    },

    async deleteTask(taskId) {
      await this.$store.dispatch('tasks/deleteTask', {
        id: taskId,
      })

      this.initialize()
    },

    onRowSelected(items) {
      if (items.length === 1) {
        this.selectedTask = { ...items[0] }
      } else {
        this.selectedTask = null
      }
    },

    async executeTask() {
      await this.$store.dispatch('tasks/executeTask', { id: this.selectedTask.id, executionResult: '' })
      this.updateList()
    },

    async acceptToExecutionTask() {
      await this.$store.dispatch('tasks/acceptToExecutionTask', { id: this.selectedTask.id })
      this.updateList()
    },
  },
}
</script>

<style></style>
