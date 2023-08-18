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
      <b-row class="mt-1">
        <b-col cols="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.versioningMethod')" label-for="item-versioning-method">
            <b-form-select
              id="item-versioning-method"
              v-model="versioningMethod"
              :options="versioningMethods"
              name="item-versioning-method"
              value-field="value"
              text-field="title"
              size="sm"
              :state="!$v.versioningMethod.$invalid"
            />
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
import VersioningMethods from '@/constants/versioningMethods'

const storeName = 'objectVersioningSettings'

export default {
  name: 'ObjectVersioningSettingsDetail',

  page() {
    return {
      title: this.$t('route.objectVersioningSetting'),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },

  components: { Layout, PageHeader },

  data() {
    return {
      title: this.$t('route.objectVersioningSetting'),
      viewId: this.$route.params.id,
      readOnly: this.$route.meta.isReadOnly,
      versioningMethods: VersioningMethods.map((el) => {
        return { value: el, title: this.$t(`enums.versioningMethods.${el}`) }
      }),
      objectTypes: [],
    }
  },

  validations: {
    objectType: {
      required,
    },
    versioningMethod: {
      required,
    },
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

    objectType: {
      get() {
        return this.object ? this.object.objectType : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'objectType', value })
      },
    },

    versioningMethod: {
      get() {
        return this.object ? this.object.versioningMethod : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'versioningMethod', value })
      },
    },
  },

  mounted() {
    this.initObjectTypes()
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

      await this.$router.push({ name: 'object-versioning-settings' })
    },
  },
}
</script>

<style>
</style>
