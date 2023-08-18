<template>
  <Layout>
    <PageHeader :title="title" />

    <b-row>
      <b-col>
        <b-card>
          <b-row class="mb-2">
            <b-col>
              <b-button id="add-btn" variant="success" size="sm" @click="addNewObject">
                <i class="ri-add-line"></i>
                {{ $t('commands.add') }}
              </b-button>
            </b-col>
            <b-col cols="3">
              <b-form-input id="search-input" v-model="filter" type="search" autofocus size="sm" :placeholder="$t('common.search')"></b-form-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                ref="itemsList"
                hover
                responsive
                :items="itemsListView.items"
                :fields="fields"
                :filter="filter"
                :filter-included-fields="filterOn"
                selectable
                select-mode="single"
                class="mb-2"
                :per-page="itemsListView.pagination.limit"
                :current-page="1"
                :tbody-tr-class="rowClass"
                @filtered="onFiltered"
              >
                <template v-slot:cell(id)="data">
                  <a href="javascript:void(0);" @click="editItem(data.item.id)"
                    ><span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ data.item.id }}</span>
                  </a>
                </template>
                <template v-slot:cell(delete)="data">
                  <a
                    id="del-res-btn"
                    href="javascript:void(0);"
                    :class="data.item.markedToDelete ? 'ri-arrow-up-circle-fill text-primary' : 'ri-delete-bin-7-fill text-danger'"
                    @click="deleteBpDefinition(data.item)"
                  >
                  </a>
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-pagination v-model="currentPage" :total-rows="itemsListView.pagination.total" :per-page="itemsListView.pagination.limit" align="right" class="my-0"></b-pagination>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- modal question -->
    <b-modal id="modal-question" :title="$t('common.modalTitle')">
      <p class="my-4">{{ questionMessage }}</p>
      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button-toolbar class="float-right">
            <b-button variant="danger" size="sm" class="mr-2" @click="onCancelModalQuestion">
              {{ $t('commands.cancel') }}
            </b-button>

            <b-button variant="success" size="sm" @click="onOkModalQuestion">
              {{ $t('commands.ok') }}
            </b-button>
          </b-button-toolbar>
        </div>
      </template>
    </b-modal>

    <!-- modal message -->
    <b-modal id="modal-message" hide-footer title="Uwaga!">
      <p class="my-4">{{ modalMessage }}</p>
    </b-modal>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations } from 'vuex'
import { uuid } from 'vue-uuid'
/**
 * Orders component
 */
export default {
  name: 'BusinessProcessList',
  components: {
    Layout,
    PageHeader,
  },

  page() {
    return {
      title: this.title,
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },

  data() {
    return {
      title: this.$t('businessProcess.definitionsListTitle'),
      fields: [
        { key: 'id', label: this.$t('table.number'), sortable: true },
        { key: 'description', label: this.$t('table.description'), sortable: true },
        { key: 'createdAt', label: this.$t('table.createdAt'), sortable: true },
        { key: 'delete', label: '-' },
      ],
      filterOn: ['description', 'status'],
      questionAction: null,
      questionParams: null,
      questionMessage: '',
      historyShowMode: false,
      tasksShowMode: false,
      selectedOrder: null,
      modalMessage: '',
    }
  },

  computed: {
    ...mapGetters({
      itemsListView: 'bpDefinitions/itemsListView',
    }),

    currentPage: {
      get() {
        return this.itemsListView.pagination.page
      },
      set(value) {
        this.setCurrentPage(value)
        this.initialize()
      },
    },

    filter: {
      get() {
        return this.itemsListView.filter
      },
      set(value) {
        this.updateFilter(value)
      },
    },
  },

  watch: {
    'itemsListView.items'(newVal, oldVal) {
      this.$refs.itemsList.refresh()
    },
  },

  async created() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      setOpenItem: 'bpDefinitions/setOpenItem',
      updatePagination: 'bpDefinitions/updatePagination',
      setCurrentPage: 'bpDefinitions/setCurrentPage',
      updateFilter: 'bpDefinitions/updateFilter',
    }),

    async initialize() {
      const filterStr = {
        params: {
          filter: {},
          pagination: { page: this.currentPage, limit: this.itemsListView.pagination.limit },
        },
      }
      await this.$store.dispatch('bpDefinitions/findAllItems', filterStr)
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },

    onFiltered(filteredItems, total) {
      this.updatePagination({ total: total, page: 1, limit: 10 })
    },

    addNewObject() {
      const viewId = uuid.v4()
      this.setOpenItem()
      this.$router.push({ name: 'bp-definition-detail', params: { id: viewId } })
    },

    async editItem(itemId) {
      const dataObject = await this.$store.dispatch('bpDefinitions/findByPk', {
        params: {
          id: itemId,
        },
      })
      if (dataObject) {
        this.$router.push({ name: 'bp-definition-detail', params: { id: itemId } })
      }
    },

    async deleteItem(itemData) {
      if (itemData.markedToDelete) {
        this.questionMessage = this.$t('order.msg.return')
      } else {
        this.questionMessage = this.$t('order.msg.delete')
      }

      this.questionAction = this.deleteItemEnd
      this.questionParams = itemData.id

      this.$bvModal.show('modal-question')
    },

    async deleteItemEnd(orderId) {
      await this.$store.dispatch('bpDefinitions/changeDeletionMark', {
        id: orderId,
      })

      this.initialize()
    },

    onCancelModalQuestion() {
      this.closeAndClearModalQuestion()
    },

    onOkModalQuestion() {
      if (this.questionAction) {
        if (this.questionParams) {
          this.questionAction(this.questionParams)
        } else {
          this.questionAction()
        }
      }

      this.closeAndClearModalQuestion()
    },

    closeAndClearModalQuestion() {
      this.questionAction = null
      this.questionParams = null
      this.questionMessage = ''
      this.$bvModal.hide('modal-question')
    },
  },
}
</script>

<style></style>
