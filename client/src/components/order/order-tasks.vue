<template>
  <b-modal id="modal-tasks" size="xl" :title="$t('components.relatedTasks')" ok-only no-close-on-backdrop @ok="handleOk" @close="handelClose">
    <b-row>
      <b-col>
        <b-table
          ref="tasksTable"
          no-border-collapse
          responsive="sm"
          selectable
          select-mode="single"
          sticky-header="400px"
          lazy
          :fields="fields"
          :items="items"
          :per-page="perPage"
          :current-page="currentPage"
          small
        >
          <template v-slot:cell(number)="data">
            <template v-if="data.item.executed">
              <span class="ri-checkbox-circle-fill mr-1 text-info" aria-hidden="true"></span>
            </template>
            <template v-else>
              <span class="ri-checkbox-blank-circle-line mr-1 text-info" aria-hidden="true"></span>
            </template>
            <a href="javascript:void(0);" @click="editTask(data.item.id)"
              ><span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ data.item.number }}</span>
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
  props: {
    orderId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      fields: [
        { key: 'number', label: this.$t('table.number') },
        { key: 'createdAt', label: this.$t('table.createdAt') },
        { key: 'user', label: this.$t('table.author') },
        { key: 'executor', label: this.$t('table.executor') },
        { key: 'executionPeriod', label: this.$t('table.executionPeriod') },
        { key: 'description', label: this.$t('table.description') },
      ],
      items: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
    }
  },

  async mounted() {
    this.$bvModal.show('modal-tasks')

    const tasks = await this.$store.dispatch('tasks/getOrderTasks', {
      params: {
        filter: {
          orderId: this.orderId,
          ownerType: 'Order',
        },
      },
    })

    for (const task of tasks) {
      this.items.push({
        id: task.id,
        number: task.number,
        createdAt: task.createdAt,
        user: task.authorName,
        description: task.description,
        executor: task.executorRole ? task.executorRole.name : task.executor ? task.executor.name : '',
        executionPeriod: task.executionPeriod,
        executed: task.executed,
      })
    }

    this.totalRows = this.items.length
  },

  methods: {
    handleOk() {
      this.$emit('tasks-closed')
    },

    handelClose() {
      this.$emit('tasks-closed')
    },

    async editTask(taskId) {
      const response = await this.$store.dispatch('tasks/findByPk', {
        params: {
          id: taskId,
        },
      })
      if (response) {
        this.$router.push({ name: 'task-detail' })
      }
    },
  },
}
</script>

<style></style>
