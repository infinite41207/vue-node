<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col>
        <b-card>
          <b-row class="mb-2">
            <b-col>
              <b-button id="add-btn" :disabled="readOnly" variant="success" size="sm" @click="addNewObject">
                <i class="ri-add-line"></i>
                {{ $t('commands.add') }}
              </b-button>
            </b-col>
            <b-col cols="3">
              <b-form-input id="search-input" v-model="searchStr" type="search" autofocus size="sm" :placeholder="$t('common.search')"></b-form-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                ref="executorRolesList"
                hover
                striped
                :items="executorRoles"
                :fields="fields"
                :filter="filter"
                :filter-included-fields="filterOn"
                class="mb-2"
                :per-page="perPage"
                :current-page="currentPage"
                :tbody-tr-class="rowClass"
                small
              >
                <template v-slot:cell(name)="data">
                  <template>
                    <span class="ri-arrow-right-s-line mr-1 text-info" aria-hidden="true"></span>
                  </template>
                  <a href="javascript:void(0);" @click="editExecutorRole(data.item.id)"
                    ><span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ data.item.name }}</span>
                  </a>
                </template>
                <template v-slot:cell(actions)="data">
                  <!-- <div class="table-button-container"> -->
                  <a href="javascript:void(0);" class="action-icon ri-edit-box-line text-success" @click="editExecutorRole(data.item.id)"> </a>
                  <!-- </div> -->
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

export default {
  name: 'ExecutorRoleList',
  page() {
    return { title: this.$t('route.executorRoles'), meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: {
    Layout,
    PageHeader,
  },

  data() {
    return {
      title: this.$t('route.executorRoles'),
      perPage: 15,
      currentPage: 1,
      totalRows: 1,
      fields: [
        { key: 'name', label: this.$t('table.name'), sortable: true },
        { key: 'code', label: this.$t('table.code'), sortable: true },
        { key: 'actions', label: this.$t('table.actions'), sortable: false },
      ],
      filter: null,
      filterOn: [],
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      executorRoles: 'executorRoles/executorRolesList',
    }),
  },

  watch: {
    executorRoles(newVal, oldVal) {
      this.$refs.executorRolesList.refresh()
    },
  },

  async created() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      setOpenExecutorRole: 'executorRoles/setOpenExecutorRole',
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

      await this.$store.dispatch('executorRoles/findAll', filterStr)

      this.totalRows = this.executorRoles.length
      this.currentPage = 1
    },

    addNewObject() {
      this.setOpenExecutorRole(null)
      this.$router.push({ name: 'executor-role-detail' })
    },

    async editExecutorRole(executorRoleId) {
      const response = await this.$store.dispatch('executorRoles/findByPk', {
        params: {
          id: executorRoleId,
        },
      })
      if (response.status === 200) {
        this.$router.push({ name: 'executor-role-detail' })
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
