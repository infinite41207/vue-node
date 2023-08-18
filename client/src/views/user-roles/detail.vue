<template>
  <Layout>
    <PageHeader :title="title" />
    <div>
      <b-card>
        <b-card-header>
          <b-button-toolbar>
            <b-btn-group>
              <b-button variant="success" class="btn-sm" @click="writeObject">
                <i class="ri-close-line"></i>
                {{ $t('commands.writeAndClose') }}
              </b-button>
              <b-button variant="outline-secondary" class="btn-sm ml-1" @click="closeView">
                <i class="ri-close-line"></i>
                {{ $t('commands.close') }}
              </b-button>
            </b-btn-group>
          </b-button-toolbar>
        </b-card-header>
        <b-card-body>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.parent')">
                <f-select v-model="parent" select-btn open-btn value-type="userRoles" detail-view="user-role-detail"></f-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.name')" label-for="object-name">
                <b-form-input id="object-name" v-model="name" name="object-name" size="sm" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.key')" label-for="object-key">
                <b-form-input id="object-key" v-model="key" name="object-key" size="sm" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.readOnly')" label-for="object-read-only">
                <b-form-checkbox id="object-read-only" v-model="readOnly" name="object-read-only" switch />
              </b-form-group>
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

const storeName = 'userRoles'

export default {
  name: 'UserRoleDetail',

  page() {
    return { title: this.$t('route.userRole'), meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: this.$t('route.userRole'),
      viewId: this.$route.params.id,
      // readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: `${storeName}/objectView`,
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    name: {
      get() {
        return this.object ? this.object?.name : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'name', value })
      },
    },

    key: {
      get() {
        return this.object ? this.object?.key : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'key', value })
      },
    },

    readOnly: {
      get() {
        return this.object ? this.object?.readOnly : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'readOnly', value })
      },
    },

    parent: {
      get() {
        return this.object ? this.object?.parent : {}
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'parent', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'parentId', value: value ? value.id : null })
      },
    },

    nameState() {
      return this.name !== ''
    },

    keyState() {
      return this.key !== ''
    },
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: `${storeName}/setObjectViewProperty`,
      setObjectProperty: `${storeName}/setObjectProperty`,
      delObjectView: `${storeName}/delObjectView`,
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async writeObject() {
      try {
        let response

        if (this.object.isNew) {
          response = await this.$store.dispatch(`${storeName}/create`, this.object)
        } else {
          response = await this.$store.dispatch(`${storeName}/update`, this.object)
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
        if (error.response) {
          const errorMessage = error.response.data?.message

          this.$bvToast.toast(errorMessage || this.$t('msg.catalogWriteError'), {
            title: this.$t('common.msg'),
            variant: 'danger',
            solid: true,
            autoHideDelay: 2000,
          })
        } else {
          console.error(error)
        }
      }
    },

    async closeView() {
      this.$destroy()
      this.delObjectView(this.viewId)
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      await this.$router.push({ name: 'user-roles' })
    },
  },
}
</script>
