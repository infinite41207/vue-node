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
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.name')" label-for="item-name">
            <b-form-input id="item-name" v-model="name" name="item-name" size="sm" :state="!$v.name.$invalid" />
          </b-form-group>
        </b-col>
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.code')" label-for="item-code">
            <b-form-input id="item-code" v-model="code" name="item-code" size="sm" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.typeOfDocument')" label-for="type-of-document">
            <b-form-select id="typeOfDocument" v-model="typeOfDocument" text-field="name" value-field="id" :options="typesOfDocument" size="sm"></b-form-select>
          </b-form-group>
        </b-col>
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.scalesType')" label-for="item-scales-type">
            <b-form-select id="scales-type" v-model="scalesType" text-field="name" value-field="id" :options="scaleTypes" size="sm"></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.barCodePrefix')" label-for="bar-code-prefix">
            <b-form-input id="bar-code-prefix" v-model="barCodePrefix" name="bar-code-prefix" size="sm" />
          </b-form-group>
        </b-col>
        <b-col cols="4">
          <b-form-group horizontal :label-cols="4" :label="$t('table.automaticWeightingEnd')" label-for="automatic-weighting-end">
            <b-form-checkbox id="automatic-weighting-end" v-model="automaticWeightingEnd" class="check-prop"> </b-form-checkbox>
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

// Enums

import TypesOfDocuments from '@/constants/documentTypes'
import ScaleTypes from '@/constants/scaleTypes'

export default {
  name: 'WeighingStationDetail',

  page() {
    return {
      title: this.$t('route.weighingStation'),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },

  components: { Layout, PageHeader },

  async created() {
    await this.initialize()
  },

  data() {
    return {
      title: this.$t('route.weighingStation'),
      viewId: this.$route.params.id,
      readOnly: this.$route.meta.isReadOnly,
      typesOfDocument: [],
      scaleTypes: [],
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
      getObjectView: 'weighingStations/objectView',
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

    code: {
      get() {
        return this.objectView ? this.objectView.object.code : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'code', value })
      },
    },

    typeOfDocument: {
      get() {
        return this.objectView ? this.objectView.object.typeOfDocument : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'typeOfDocument', value })
      },
    },

    scalesType: {
      get() {
        return this.objectView ? this.objectView.object.scalesType : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'scalesType', value })
      },
    },

    barCodePrefix: {
      get() {
        return this.objectView ? this.objectView.object.barCodePrefix : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'barCodePrefix', value })
      },
    },

    automaticWeightingEnd: {
      get() {
        return this.objectView ? this.objectView.object.automaticWeightingEnd : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'automaticWeightingEnd', value })
      },
    },
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'weighingStations/setObjectViewProperty',
      setObjectProperty: 'weighingStations/setObjectProperty',
      delObjectView: 'weighingStations/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    loadEnums(enumVar) {
      const finalList = []
      for (let i = 0; i < enumVar.length; i++) {
        finalList.push({ name: enumVar[i], value: enumVar[i] })
      }
      return finalList
    },

    async initialize() {
      this.typesOfDocument = this.loadEnums(TypesOfDocuments)
      this.scaleTypes = this.loadEnums(ScaleTypes)
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

      let response
      if (this.object.isNew) {
        response = await this.$store.dispatch('weighingStations/create', this.object).catch((error) => {
          console.error(error)
        })
      } else {
        response = await this.$store.dispatch('weighingStations/update', this.object).catch((error) => {
          console.error(error)
        })
      }

      if (response && response.status === 200) {
        this.closeView()

        this.$bvToast.toast(this.$t('msg.catalogWriteSuccess'), {
          title: this.$t('common.msg'),
          variant: 'success',
          solid: true,
          autoHideDelay: 2000,
        })
      } else {
        this.$bvToast.toast(response.data?.message || this.$t('msg.catalogWriteError'), {
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

      await this.$router.push({ name: 'weighing-stations-list' })
    },
  },
}
</script>

<style>
</style>
