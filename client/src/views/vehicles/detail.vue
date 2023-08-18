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
        <b-col cols="3">
          <b-form-group horizontal :label-cols="4" :label="$t('table.code')" label-for="item-code">
            <b-form-input id="item-code" v-model="code" name="item-code" size="sm" :state="!$v.code.$invalid" />
          </b-form-group>
        </b-col>
        <b-col cols="3">
          <b-form-group horizontal :label-cols="3" :label="$t('table.type')" label-for="item-type">
            <b-form-select id="item-type" v-model="type" :options="transportTypes" size="sm"></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col cols="6">
          <b-form-group horizontal :label-cols="2" :label="$t('table.number')" label-for="item-number">
            <b-form-input id="item-number" v-model="name" name="item-number" size="sm" :state="!$v.name.$invalid" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col cols="6">
          <b-form-group horizontal :label-cols="2" :label="$t('table.carrier')" label-for="item-carrier">
            <v-select
              ref="fromSelectRef"
              v-model="carrier"
              :options="allCarriers"
              :reduce="(option) => option.value"
              :loading="false"
              :clearable="true"
              label="text"
              placeholder="Wybierz przewoźnika..."
              aria-describedby="customerFeedback"
              size="sm"
              @search="onSearchCarrier"
            >
            </v-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col cols="3">
          <b-form-group horizontal :label-cols="4" :label="$t('table.tare')" label-for="item-tare">
            <b-form-input id="item-tare" v-model="tare" name="item-number" size="sm" />
          </b-form-group>
        </b-col>
        <b-col cols="3">
          <b-form-group horizontal :label-cols="3" :label="$t('table.loadCapacity')" label-for="item-load-capacity">
            <b-form-input id="item-load-capacity" v-model="loadCapacity" name="item-load-capacity" size="sm" />
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
import TransportTypes from '../../constants/transportTypes'

const storeName = 'vehicles'

export default {
  name: 'VehiclesDetail',

  page() {
    return { title: this.$t('route.vehicle'), meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: { Layout, PageHeader },

  data() {
    return {
      title: this.$t('route.vehicle'),
      viewId: this.$route.params.id,
      transportTypes: [],
      allCarriers: [],
      readOnly: this.$route.meta.isReadOnly,
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
        return this.objectView ? this.objectView.object.name : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'name', value })
      },
    },

    code: {
      get() {
        return this.objectView ? this.objectView.object.code : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'code', value })
      },
    },

    type: {
      get() {
        return this.objectView ? this.objectView.object.type : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'type', value })
      },
    },

    tare: {
      get() {
        return this.objectView ? this.objectView.object.tare : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'tare', value })
      },
    },

    loadCapacity: {
      get() {
        return this.objectView ? this.objectView.object.loadCapacity : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'loadCapacity', value })
      },
    },

    carrier: {
      get() {
        return this.objectView ? this.objectView.object.carrier : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'carrier', value })
      },
    },
  },

  validations: {
    name: {
      required,
    },
    code: {
      maxLength: maxLength(12),
    },
  },

  async created() {
    await this.initialize()
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

    async initialize() {
      this.getTransportTypes()
    },

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
      await this.$router.push({ name: 'vehicles-list' })
    },

    getTransportTypes() {
      const options = []

      for (let i = 0; i < TransportTypes.length; i++) {
        options.push({ value: TransportTypes[i], text: TransportTypes[i] })
      }

      this.transportTypes = options
    },

    onSearchCarrier(searchValue) {
      this.updateCarrier(searchValue)
    },

    async updateCarrier(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('carriers/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.allCarriers = []
      for (let i = 0; i < response.length; i++) {
        this.allCarriers.push({ text: response[i].name, value: response[i].id })
      }
    },
  },
}
</script>

<style>
</style>
