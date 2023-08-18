<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col>
        <b-card>
          <b-row class="mb-2">
            <b-col>
              <b-button-toolbar>
                <b-button-group>
                  <b-button id="add-btn" :disabled="readOnly" variant="success" size="sm" @click="addNewObject">
                    <i class="ri-add-line"></i>
                    {{ $t('commands.add') }}
                  </b-button>
                </b-button-group>
              </b-button-toolbar>
            </b-col>
            <b-col cols="3">
              <b-form-input id="search-input" v-model="searchStr" type="search" autofocus size="sm" :placeholder="$t('common.search')"></b-form-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                ref="taskTemplatesList"
                hover
                striped
                :items="taskTemplates"
                :fields="fields"
                :filter="filter"
                :filter-included-fields="filterOn"
                class="mb-2"
                small
                :per-page="perPage"
                :current-page="currentPage"
                :tbody-tr-class="rowClass"
              >
                <template v-slot:cell(code)="data">
                  <template>
                    <span class="mr-1 text-info" aria-hidden="true">
                      <i class="ri-arrow-right-s-line"></i>
                    </span>
                  </template>
                  <a href="javascript:void(0);" @click="editTaskTemplate(data.item.id)"
                    ><span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ data.item.code }}</span>
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
                <template v-slot:cell(actions)="data">
                  <div class="table-button-container">
                    <a href="javascript:void(0);" class="action-icon text-success" @click="editObject(data.item.id)">
                      <i class="ri-edit-box-line"></i>
                    </a>
                  </div>
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
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations } from 'vuex'
import TaskTemplate from '@/dto/TaskTemplate'
import _ from 'lodash'

/**
 * Tasks component
 */
export default {
  name: 'TasksTemplatesList',

  page() {
    return { title: this.$t('route.taskTemplates'), meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: {
    Layout,
    PageHeader,
  },

  data() {
    return {
      title: this.$t('route.taskTemplates'),
      perPage: 15,
      currentPage: 1,
      totalRows: 1,
      fields: [
        { key: 'code', label: this.$t('table.code'), sortable: true },
        { key: 'name', label: this.$t('table.name'), sortable: true },
        {
          key: 'importance',
          label: this.$t('table.importance'),
          sortable: true,
        },
        { key: 'executorRole.name', label: this.$t('table.executorRole'), sortable: true },
        { key: 'actions', label: this.$t('table.actions'), sortable: false },
      ],
      filter: null,
      filterOn: [],
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      taskTemplates: 'taskTemplates/taskTemplatesList',
    }),
  },

  watch: {
    taskTemplates(newVal, oldVal) {
      this.$refs.taskTemplatesList.refresh()
    },
  },

  async created() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      setOpenTaskTemplate: 'tasks/setOpenTaskTemplate',
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

      await this.$store.dispatch('taskTemplates/findAll', filterStr)

      this.totalRows = this.taskTemplates.length
      this.currentPage = 1
    },

    addNewObject() {
      this.setOpenTaskTemplate(_.cloneDeep(TaskTemplate))
      this.$router.push({ name: 'task-template-detail' })
    },

    async editObject(objectId) {
      const response = await this.$store.dispatch('taskTemplates/findByPk', {
        params: {
          id: objectId,
        },
      })
      if (response.status === 200) {
        this.$router.push({ name: 'task-template-detail' })
      }
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },
  },
}
</script>

<style></style>
