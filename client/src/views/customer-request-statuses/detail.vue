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
          <b-form-group horizontal :label-cols="3" content-cols="3" :label="$t('table.code')" label-for="item-code">
            <b-form-input id="item-code" v-model="code" name="item-code" size="sm" :state="!$v.code.$invalid" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col cols="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.name')" label-for="item-name">
            <b-form-input id="item-name" v-model="name" name="item-name" size="sm" :state="!$v.name.$invalid" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col cols="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.color')" label-for="item-color">
            <b-form-select id="item-color" v-model="color" :options="colorList" name="item-color" text-field="description" value-field="id" size="sm" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col cols="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.isClosed')" label-for="item-is-closed">
            <b-form-checkbox id="item-is-closed" v-model="isClosed" name="item-is-closed" switch />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col cols="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.predefinedName')" label-for="item-predefined-name">
            <b-form-input id="item-predefined-name" v-model="predefinedName" type="text" name="item-item-predefined-name" size="sm"></b-form-input>
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
import { required, maxLength } from 'vuelidate/lib/validators'
import ColorList from '@/constants/colorList'
import _ from 'lodash'

const storeName = 'customerRequestsStatuses'

export default {
  name: 'CRStatusesDetail',

  page() {
    return {
      title: this.$t('route.crStatuse'),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },

  components: { Layout, PageHeader },

  data() {
    return {
      title: this.$t('route.crStatuse'),
      viewId: this.$route.params.id,
      readOnly: this.$route.meta.isReadOnly,
      colorList: _.cloneDeep(ColorList),
    }
  },

  validations: {
    name: {
      required,
    },
    code: {
      maxLength: maxLength(9),
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

    name: {
      get() {
        return this.object ? this.object.name : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'name', value })
      },
    },

    code: {
      get() {
        return this.object ? this.object.code : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'code', value })
      },
    },

    color: {
      get() {
        return this.object ? this.object.color : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'color', value })
      },
    },

    isClosed: {
      get() {
        return this.object ? this.object.isClosed : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'isClosed', value })
      },
    },

    predefinedName: {
      get() {
        return this.object ? this.object.predefinedName : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'predefinedName', value })
      },
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

      await this.$router.push({ name: 'cr-statuses' })
    },
  },
}
</script>

<style>
</style>
