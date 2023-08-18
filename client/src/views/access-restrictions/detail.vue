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
      <b-row>
        <b-col cols="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.objectType')" label-for="item-object-type">
            <b-form-select
              id="item-object-type"
              v-model="objectType"
              :options="objectTypes"
              name="item-object-type"
              value-field="value"
              text-field="title"
              size="sm"
              :state="!$v.objectType.$invalid"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="6">
          <b-form-group horizontal :label-cols="5" :label="$t('table.useRestriction')" label-for="item-use-restr">
            <b-form-checkbox id="item-use-restr" v-model="useRestriction" name="item-use-restr" switch />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="6">
          <b-form-group horizontal :label-cols="5" :label="$t('table.useDepartmentRestriction')" label-for="item-use-depart-restr">
            <b-form-checkbox id="item-use-depart-restr" v-model="useDepartmentRestriction" name="item-use-depart-restr" switch />
          </b-form-group>
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

const namespace = 'accessRestrictions'

export default {
  name: 'ObjectDetail',

  page() {
    return {
      title: this.$t('route.accessRestriction'),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },

  components: { Layout, PageHeader },

  data() {
    return {
      title: this.$t('route.accessRestriction'),
      viewId: this.$route.params.id,
      readOnly: this.$route.meta.isReadOnly,
      objectTypes: [],
    }
  },

  validations: {
    objectType: {
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

    objectType: {
      get() {
        return this.object ? this.object.objectType : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'objectType', value })
      },
    },

    useRestriction: {
      get() {
        return this.object ? this.object.useRestriction : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'useRestriction', value })
      },
    },

    useDepartmentRestriction: {
      get() {
        return this.object ? this.object.useDepartmentRestriction : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'useDepartmentRestriction', value })
      },
    },
  },

  mounted() {
    this.initObjectTypes()
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: `${namespace}/setObjectViewProperty`,
      setObjectProperty: `${namespace}/setObjectProperty`,
      delObjectView: `${namespace}/delObjectView`,
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async initObjectTypes() {
      await this.$store
        .dispatch('app/getObjects')
        .then((response) => {
          if (response.data) {
            this.objectTypes = response.data.map((object) => {
              return { value: object.model, title: object.name?.plural.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1') }
            })
          }
        })
        .catch((error) => {
          console.error(error)
        })
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

      await this.$router.push({ name: 'access-restrictions' })
    },
  },
}
</script>

<style>
</style>
