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
          <b-form-group horizontal :label-cols="3" :label="$t('table.name')" label-for="object-name">
            <b-input-group>
              <b-form-input id="object-name" v-model="name" name="object-name" size="sm" />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.code')" label-for="object-code">
            <b-input-group>
              <b-form-input id="object-code" v-model="code" name="object-code" size="sm" />
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.fullName')" label-for="object-full-name">
            <b-input-group>
              <b-form-input id="object-full-name" v-model="fullName" name="object-full-name" size="sm" />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.numberOfCopies')" label-for="number-of-copies">
            <b-form-input id="object-number-of-copies" v-model="numberOfCopies" type="number" name="number-of-copies" size="sm" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.notUse')" label-for="object-not-use">
            <b-form-checkbox id="object-not-use" v-model="notUse" class="mt-1" switch></b-form-checkbox>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.customer')" label-for="object-is-customer">
            <b-form-checkbox id="object-is-customer" v-model="isCustomer" class="mt-1" switch></b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.useActualWarehouse')" label-for="object-actual-warehouse">
            <b-form-checkbox id="object-actual-warehouse" v-model="useActualWarehouse" class="mt-1" switch></b-form-checkbox>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.vendor')" label-for="object-is-vendor">
            <b-form-checkbox id="object-is-vendor" v-model="isVendor" class="mt-1" switch></b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.sendDriversSms')" label-for="object-send-sms">
            <b-form-checkbox id="object-send-sms" v-model="sendDriversSms" class="mt-1" switch></b-form-checkbox>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.forwarder')" label-for="object-forwarder">
            <b-form-checkbox id="object-forwarder" v-model="isForwarder" switch class="mt-1"></b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.useProductCondition')" label-for="object-prod-condition">
            <b-form-checkbox id="object-prod-condition" v-model="useProductCondition" class="mt-1" switch></b-form-checkbox>
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

const storeName = 'vendorsAndCustomers'

export default {
  name: 'VAndCDetail',

  page() {
    return { title: this.$t('common.vendorsAndCustomersData'), meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: { Layout, PageHeader },

  data() {
    return {
      title: this.$t('common.vendorsAndCustomersData'),
      viewId: this.$route.params.id,
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

    isCustomer: {
      get() {
        return this.objectView ? this.objectView.object.isCustomer : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'isCustomer', value })
      },
    },

    isVendor: {
      get() {
        return this.objectView ? this.objectView.object.isVendor : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'isVendor', value })
      },
    },

    isForwarder: {
      get() {
        return this.objectView ? this.objectView.object.isForwarder : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'isForwarder', value })
      },
    },

    notUse: {
      get() {
        return this.objectView ? this.objectView.object.notUse : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'notUse', value })
      },
    },

    numberOfCopies: {
      get() {
        return this.objectView ? this.objectView.object.numberOfCopies : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'numberOfCopies', value })
      },
    },

    fullName: {
      get() {
        return this.objectView ? this.objectView.object.fullName : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'fullName', value })
      },
    },

    useActualWarehouse: {
      get() {
        return this.objectView ? this.objectView.object.useActualWarehouse : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'useActualWarehouse', value })
      },
    },

    sendDriversSms: {
      get() {
        return this.objectView ? this.objectView.object.sendDriversSms : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'sendDriversSms', value })
      },
    },

    useProductCondition: {
      get() {
        return this.objectView ? this.objectView.object.useProductCondition : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'useProductCondition', value })
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
      await this.$router.push({ name: 'vendors-and-customers' })
    },
  },
}
</script>
