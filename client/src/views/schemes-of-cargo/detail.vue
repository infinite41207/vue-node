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
      <b-row class="mt-4">
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.name')" label-for="item-name">
            <b-input-group>
              <b-form-input id="item-name" v-model="name" name="item-name" size="sm" />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.code')" label-for="number">
            <b-input-group>
              <b-form-input id="object-number" v-model="code" name="number" size="sm" />
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.documentType')" label-for="documentType">
            <b-form-select id="documentType" v-model="typeOfDocument" :options="typesOfDocuments" text-field="name" value-field="value" name="documentType" size="sm" />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.operationType')" label-for="operationType">
            <b-form-select id="operationType" v-model="typeOfOperation" :options="typesOfOperations" text-field="name" value-field="value" name="status" size="sm" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.defaultWarehouse')">
            <f-select v-model="defaultWarehouse" select-btn open-btn value-type="warehouses" detail-view="warehouse-detail" placeholder="Wyszukaj magazyn..."></f-select>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.ship')" label-for="ship">
            <b-input-group>
              <b-form-checkbox id="ship" v-model="ship" switch class="mt-1"></b-form-checkbox>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.returnToWarehouse')" label-for="returnToWarehouse">
            <b-input-group>
              <b-form-checkbox id="returnToWarehouse" v-model="returnToWarehouse" switch class="mt-1"></b-form-checkbox>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.reverseOperation')" label-for="reverseOperation">
            <b-input-group>
              <b-form-checkbox id="reverseOperation" v-model="reverseOperation" switch class="mt-1"></b-form-checkbox>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.disableControlOnScales')" label-for="disableControlOnScales">
            <b-input-group>
              <b-form-checkbox id="disableControlOnScales" v-model="disableControlOnScales" switch class="mt-1"></b-form-checkbox>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.disableControlInDispositions')" label-for="disableControlInDispositions">
            <b-input-group>
              <b-form-checkbox id="disableControlInDispositions" v-model="disableControlInDispositions" switch class="mt-1"></b-form-checkbox>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col>
          <b-tabs content-class="mt-3">
            <b-tab :title="$t('common.externalCodes')" active>
              <b-table striped hover :items="outsideCodeItems" :fields="outsideCodeFileds"></b-table>
            </b-tab>
            <b-tab :title="$t('common.forwarders')">
              <b-table striped hover :items="allVendorsAndCustomers" :fields="forwardersFileds"></b-table>
            </b-tab>
          </b-tabs>
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
import TypesOfOperations from '@/constants/operationTypes'
import TypesOfDocuments from '@/constants/documentTypes'

const storeName = 'schemesOfCargo'

export default {
  name: 'SchemasOfCargoDetail',

  page() {
    return { title: this.$t('route.schemeOfCargo'), meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: { Layout, PageHeader },

  data() {
    return {
      title: this.$t('route.schemeOfCargo'),
      outsideCodeFileds: [
        { key: 'n', label: 'N', sortable: true },
        { key: 'externalCode', label: this.$t('table.externalCode'), sortable: true },
      ],
      forwardersFileds: [
        { key: 'n', label: 'N', sortable: true },
        { key: 'name', label: this.$t('table.forwarder'), sortable: true },
      ],
      viewId: this.$route.params.id,
      allVendorsAndCustomers: [],
      outsideCodeItems: [],
      typesOfOperations: [],
      typesOfDocuments: [],
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

    typeOfOperation: {
      get() {
        return this.objectView ? this.objectView.object.typeOfOperation : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'typeOfOperation', value })
      },
    },

    disableControlInDispositions: {
      get() {
        return this.objectView ? this.objectView.object.disableControlInDispositions : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'disableControlInDispositions', value })
      },
    },

    disableControlOnScales: {
      get() {
        return this.objectView ? this.objectView.object.disableControlOnScales : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'disableControlOnScales', value })
      },
    },

    returnToWarehouse: {
      get() {
        return this.objectView ? this.objectView.object.returnToWarehouse : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'returnToWarehouse', value })
      },
    },

    reverseOperation: {
      get() {
        return this.objectView ? this.objectView.object.reverseOperation : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'reverseOperation', value })
      },
    },

    ship: {
      get() {
        return this.objectView ? this.objectView.object.ship : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'ship', value })
      },
    },

    moving: {
      get() {
        return this.objectView ? this.objectView.object.moving : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'moving', value })
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

    defaultWarehouse: {
      get() {
        return this.objectView ? this.object.defaultWarehouse : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'defaultWarehouse', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'defaultWarehouseId', value: value ? value.id : value })
      },
    },
  },

  async created() {
    this.initialize()
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
      this.typesOfOperations = this.loadEnums(TypesOfOperations)
      this.typesOfDocuments = this.loadEnums(TypesOfDocuments)
    },

    loadEnums(enumVar) {
      const finalList = []
      for (let i = 0; i < enumVar.length; i++) {
        finalList.push({ name: enumVar[i], value: enumVar[i] })
      }
      return finalList
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
      await this.$router.push({ name: 'schemes-of-cargo-list' })
    },
  },
}
</script>
