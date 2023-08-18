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
            <b-col class="overflow-x-auto">
              <b-table
                ref="usersList"
                hover
                :items="userData"
                :fields="fields"
                :filter="searchStr"
                :filter-included-fields="filterOn"
                class="mb-2 min-w-800"
                :per-page="perPage"
                :current-page="currentPage"
                :tbody-tr-class="rowClass"
                small
              >
                <template v-slot:cell(isActive)="row">
                  <span
                    class="badge"
                    :class="{
                      'badge-success': row.item.isActive === true,
                    }"
                    >{{ row.item.isActive === true ? 'Aktywny' : 'Nieaktywny' }}</span
                  >
                </template>
                <template v-slot:cell(name)="row">
                  <a href="javascript:void(0);" @click="editUser(row.item.id)"
                    ><span :class="'text-info'">{{ row.item.name }}</span>
                  </a>
                </template>
                <template v-slot:cell(delete)="row">
                  <a
                    href="javascript:void(0);"
                    :class="row.item.markedToDelete ? 'ri-arrow-up-circle-fill text-primary' : 'ri-delete-bin-7-fill text-danger'"
                    @click="beforeDeleteUser(row.item.id)"
                  >
                  </a>
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col>
              <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right" class="my-0"></b-pagination>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- modal question -->
    <b-modal id="modal-question" title="Uwaga!">
      <p class="my-4">{{ questionMessage }}</p>
      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button-toolbar class="float-right">
            <b-button variant="danger" size="sm" class="mr-2" @click="onCancelModalQuestion"> Nie </b-button>

            <b-button variant="success" size="sm" @click="onOkModalQuestion"> Tak </b-button>
          </b-button-toolbar>
        </div>
      </template>
    </b-modal>
  </Layout>
</template>

<script>
import { mapGetters } from 'vuex'
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'

export default {
  name: 'UserList',

  page: {
    title: 'Lista użytkowników',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: 'Lista użytkowników',
      data: [],
      showUserModalForm: false,
      totalRows: 1,
      currentPage: 1,
      perPage: 15,
      pageOptions: [10, 15, 25, 50, 100],
      searchStr: null,
      filterOn: [],
      sortBy: 'age',
      sortDesc: false,
      questionMessage: '',
      questionAction: null,
      questionParams: null,
      fields: [
        { key: 'name', label: 'Imię i nazwisko', sortable: true },
        { key: 'login', label: 'Login', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'isActive', label: 'Status', sortable: false },
        { key: 'createdAt', label: 'Utworzono', sortable: true },
        { key: 'delete', label: '-' },
      ],
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      userData: 'users/getUsers',
    }),
  },

  watch: {
    userData(newVal, oldVal) {
      this.$refs.usersList.refresh()
    },
  },

  async mounted() {
    await this.initialize()
  },

  methods: {
    async addNewObject() {
      await this.$store.dispatch('users/clearOpenUser')
      this.$router.push({ path: 'user-detail' })
    },

    async editUser(userId) {
      const dataObject = await this.$store.dispatch('users/findByPk', {
        id: userId,
      })
      if (dataObject) {
        this.$router.push({ path: 'user-detail' })
      }
    },

    async deleteUser(userId) {
      await this.$store.dispatch('users/delete', {
        id: userId,
      })

      this.initialize()
    },

    async beforeDeleteUser(userId) {
      if (this.readOnly === true) {
        return
      }
      this.questionMessage = 'Czy napewno chcesz usunąć tego użytkownika z bazy danych?'

      this.questionAction = this.deleteUser
      this.questionParams = userId

      this.$bvModal.show('modal-question')
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    async initialize() {
      await this.$store.dispatch('users/findAll', {})
      this.totalRows = this.userData.length
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
