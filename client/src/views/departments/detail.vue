<template>
  <Layout>
    <PageHeader :title="title" />
    <b-card>
      <b-row class="mb-3">
        <b-col>
          <b-button-toolbar>
            <b-btn-group>
              <b-button variant="success" :disabled="readOnly" class="btn-sm" @click="writeObject">
                <i class="ri-save-2-fill"></i>
                {{ $t('commands.writeAndClose') }}
              </b-button>
              <b-button variant="outline-secondary" class="btn-sm ml-1" @click="closeView">
                <i class="ri-close-line"></i>
                {{ $t('commands.close') }}
              </b-button>
            </b-btn-group>
          </b-button-toolbar>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col cols="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.name')" label-for="item-name">
            <b-form-input id="item-name" v-model="name" name="item-name" size="sm" :state="!$v.name.$invalid" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.leader')" label-for="leader">
            <f-select
              v-model="leader"
              select-btn
              open-btn
              required
              value-type="users"
              detail-view="user-detail"
              label="presentation"
              placeholder="Wyszukaj kierownika..."
            ></f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.deputy')" label-for="deputy">
            <f-select
              v-model="deputy"
              select-btn
              open-btn
              required
              value-type="users"
              detail-view="user-detail"
              label="presentation"
              placeholder="Wyszukaj kierownika..."
            ></f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button-toolbar>
            <b-btn-group>
              <b-button variant="outline-secondary" size="sm" @click="addRow">
                <i class="ri-add-line"></i>
                {{ $t('commands.add') }}
              </b-button>
            </b-btn-group>
          </b-button-toolbar>
          <b-modal
            id="modal-select-employee"
            :cancel-title="$t('commands.cancel')"
            :title="$t('common.selectEmployee')"
            @ok="handleOk"
            @cancel="handelCancel"
            @close="handelCancel"
          >
            <b-form-group horizontal :label-cols="3" :label="$t('table.employee')" label-for="employee">
              <f-select v-model="employee" select-btn open-btn required value-type="users" detail-view="user-detail" label="presentation" placeholder="Wyszukaj..."></f-select>
            </b-form-group>
          </b-modal>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col>
          <b-table striped hover :items="object.employees" :fields="employeesFields" small>
            <template v-slot:cell(index)="{ index }">
              <span>{{ ++index }}</span>
            </template>
            <template v-slot:cell(name)="{ index, item }">
              <b-link href="javascript:void(0);" @click="editRow(item, index)">{{ item.employee.name }} </b-link>
            </template>
            <template v-slot:cell(actions)="{ index, item }">
              <div class="table-button-container">
                <b-row inline>
                  <a href="javascript:void(0);" class="action-icon" @click="deleteRow(index, item)">
                    <i class="ri-delete-bin-7-fill ml-2 text-danger"></i>
                  </a>
                </b-row>
              </div>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-card>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import _ from 'lodash'

const namespace = 'departments'

export default {
  name: 'ObjectDetail',

  page() {
    return {
      title: this.$t('route.department'),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },

  components: { Layout, PageHeader },

  data() {
    return {
      title: this.$t('route.department'),
      viewId: this.$route.params.id,
      readOnly: this.$route.meta.isReadOnly,
      employee: null,
      employeesFields: [
        { key: 'index', label: this.$t('table.sort') },
        { key: 'name', label: this.$t('table.name') },
        { key: 'actions', label: this.$t('table.actions') },
      ],
      rowIndex: null,
    }
  },

  validations: {
    name: {
      required,
    },
  },

  computed: {
    ...mapGetters({
      getObjectView: `${namespace}/objectView`,
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    id: {
      get() {
        return this.objectView ? this.objectView.object.id : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'id', value })
      },
    },

    name: {
      get() {
        return this.objectView ? this.objectView.object.name : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'name', value })
      },
    },

    leader: {
      get() {
        return this.object.leader
      },
      async set(value) {
        this.setObjectProperties({ viewId: this.viewId, props: { leader: value, leaderId: value ? value.id : value } })
      },
    },
    deputy: {
      get() {
        return this.object.deputy
      },
      async set(value) {
        this.setObjectProperties({ viewId: this.viewId, props: { deputy: value, deputyId: value ? value.id : value } })
      },
    },
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: `${namespace}/setObjectViewProperty`,
      setObjectProperty: `${namespace}/setObjectProperty`,
      setObjectProperties: `${namespace}/setObjectProperties`,
      addObjectTableRow: `${namespace}/addObjectTableRow`,
      setObjectTableRow: `${namespace}/setObjectTableRow`,
      deleteObjectTableRow: `${namespace}/deleteObjectTableRow`,
      delObjectView: `${namespace}/delObjectView`,
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    addRow() {
      this.employee = null
      this.rowIndex = null

      this.$bvModal.show('modal-select-employee')
    },

    editRow(item, index) {
      this.employee = item.employee
      this.rowIndex = index

      this.$bvModal.show('modal-select-employee')
    },

    deleteRow(index) {
      this.deleteObjectTableRow({ viewId: this.viewId, table: 'employees', index })
    },

    handleOk() {
      if (this.employee) {
        if (this.rowIndex === null) {
          this.addObjectTableRow({ viewId: this.viewId, table: 'employees', row: { employee: this.employee, employeeId: this.employee.id } })
        } else {
          const newRow = _.cloneDeep(this.object.employees[this.rowIndex])
          newRow.employee = this.employee
          newRow.employeeId = this.employee.id

          this.setObjectTableRow({ viewId: this.viewId, table: 'employees', index: this.rowIndex, row: newRow })
        }
      }
    },

    handelCancel() {
      this.employee = null
      this.rowIndex = null
    },

    async writeObject() {
      if (this.$v.$invalid === true) {
        this.$bvToast.toast(this.$t('msg.filingError'), {
          title: this.$t('common.msg'),
          variant: 'danger',
          solid: true,
          autoHideDelay: 2000,
        })
        return
      }

      try {
        let response

        if (this.object.isNew) {
          response = await this.$store.dispatch(`${namespace}/create`, this.object)
        } else {
          response = await this.$store.dispatch(`${namespace}/update`, this.object)
        }

        if (response) {
          this.closeView()

          this.$bvToast.toast(this.$t('msg.catalogWriteSuccess'), {
            title: this.$t('common.msg'),
            variant: 'success',
            solid: true,
            autoHideDelay: 2000,
          })
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message

        this.$bvToast.toast(errorMessage || this.$t('msg.catalogWriteError'), {
          title: this.$t('common.msg'),
          variant: 'danger',
          solid: true,
          autoHideDelay: 2000,
        })
      }
    },

    async closeView() {
      this.$destroy()
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)

      await this.$router.push({ name: 'departments' })
    },
  },
}
</script>

<style>
</style>
