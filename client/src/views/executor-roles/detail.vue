<template>
  <Layout>
    <PageHeader :title="title" />
    <div>
      <b-card>
        <b-card-header>
          <b-button-toolbar>
            <b-btn-group class="mt-2">
              <a href="javascript:void(0);" class="btn btn-success btn-sm" :disabled="readOnly" @click="writeObject">
                <i class="ri-close-line"></i>
                {{ $t('commands.writeAndClose') }}
              </a>
              <a href="javascript:void(0);" class="btn btn-info btn-sm ml-2" @click="closeObject">
                <i class="ri-close-line"></i>
                {{ $t('commands.close') }}
              </a>
            </b-btn-group>
          </b-button-toolbar>
        </b-card-header>
        <b-card-body>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" content-cols="3" :label="$t('table.code')" label-for="role-code">
                <b-form-input id="role-code" v-model="code" name="role-code" size="sm" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="2" :label="$t('table.name')" label-for="role-name">
                <b-form-input id="role-name" v-model="name" name="role-name" size="sm" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12">
              <b-tabs content-class="mt-2">
                <b-tab :title="$t('route.executors')">
                  <b-row class="mt-2">
                    <b-col md="12">
                      <b-table striped hover show-empty :items="executors" :fields="executorFields" :empty-text="$t('common.emptyExecutorList')">
                        <template v-slot:cell(index)="{ index }">
                          <span>{{ ++index }}</span>
                        </template>
                        <template v-slot:cell(isActive)="data">
                          <b-form-checkbox
                            v-if="data.item.isActive !== null"
                            v-model="data.item.isActive"
                            name="check-button"
                            switch
                            @change="changeExecutorSetting(data.item)"
                          ></b-form-checkbox>
                        </template>
                      </b-table>
                    </b-col>
                  </b-row>
                </b-tab>
              </b-tabs>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </div>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'ExecutorRoleDetail',
  page() {
    return {
      title: this.$t('common.executorRoleData'),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: this.$t('common.executorRoleData'),
      executorFields: [
        { key: 'index', label: this.$t('table.sort') },
        { key: 'name', label: this.$t('table.name') },
        { key: 'isActive', label: 'Dołączony', sortable: false },
      ],
      executors: [],
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      object: 'executorRoles/openExecutorRole',
      executorList: 'executors/executorList',
    }),

    code: {
      get() {
        return this.object.code
      },
      set(value) {
        this.setObjectProperty({
          property: 'code',
          value,
        })
      },
    },

    name: {
      get() {
        return this.object.name
      },
      set(value) {
        this.setObjectProperty({
          property: 'name',
          value,
        })
      },
    },
  },

  async mounted() {
    this.fillExecutors()
  },

  methods: {
    ...mapMutations({
      setOpenExecutorRole: 'executorRoles/setOpenExecutorRole',
      setObjectProperty: 'executorRoles/setObjectProperty',
      addExecutor: 'executorRoles/addObjectExecutor',
      removeExecutor: 'executorRoles/removeObjectExecutor',
    }),

    ...mapActions({
      delView: 'tagsViews/delView',
    }),

    async fillExecutors() {
      if (this.executorList.length === 0) {
        await this.$store.dispatch('users/findAll', {})
      }

      this.executors = []

      this.executorList.forEach((executor) => {
        this.executors.push({
          executorId: executor.id,
          name: executor.name,
          isActive: false,
        })
      })

      const executors = this.object.executors

      executors.forEach((executor) => {
        const foundExecutor = this.executors.find((element) => element.executorId === executor.executorId)
        if (foundExecutor) {
          foundExecutor.isActive = true
        }
      })
    },

    changeExecutorSetting(executorData) {
      if (executorData.isActive) {
        this.addExecutor({ executorId: executorData.executorId })
      } else {
        this.removeExecutor({ executorId: executorData.executorId })
      }
    },

    async writeObject() {
      let response
      if (this.object.id === null) {
        response = await this.$store.dispatch('executorRoles/create', this.object)
      } else {
        response = await this.$store.dispatch('executorRoles/update', this.object)
      }
      if (response.status === 200) {
        this.closeObject()
      }
    },

    async closeObject() {
      await this.$router.push({ name: 'executor-roles' })
      this.delView({ name: this.$route.name, path: this.$route.path })
      this.setOpenExecutorRole({})
    },
  },
}
</script>
