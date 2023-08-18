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
          <b-form-group horizontal :label-cols="2" content-cols="3" :label="$t('table.code')" label-for="item-code">
            <b-form-input id="item-code" v-model="code" name="item-code" size="sm" :state="!$v.code.$invalid" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col cols="6">
          <b-form-group horizontal :label-cols="2" :label="$t('table.name')" label-for="item-name">
            <b-form-input id="item-name" v-model="name" name="item-name" size="sm" :state="!$v.name.$invalid" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col cols="3">
          <b-form-group horizontal :label-cols="4" :label="$t('table.isCardSerial')" label-for="item-card-serial">
            <b-form-input id="item-card-serial" v-model="idCard" name="item-card-serial" size="sm" />
          </b-form-group>
        </b-col>
        <b-col cols="3">
          <b-form-group horizontal :label-cols="3" :label="$t('table.isCardNumber')" label-for="item-card-number">
            <b-form-input id="item-card-number" v-model="cardNumber" name="item-card-number" size="sm" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col cols="6">
          <b-form-group horizontal :label-cols="2" :label="$t('table.idCard')" label-for="item-id-card">
            <b-form-input id="item-id-card" v-model="idCard" name="item-id-card" size="sm" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col cols="6">
          <b-form-group horizontal :label-cols="4" :label="$t('table.termsOfUse')" label-for="item-terms-of-use">
            <b-form-checkbox id="item-terms-of-use" v-model="termsOfUse" switch class="mt-1"></b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col>
          <b-tabs content-class="mt-3">
            <b-tab title="Adresy , telefony" active>
              <b-row class="mt-1">
                <b-col cols="6">
                  <b-form-group horizontal :label-cols="2" :label="$t('table.phone')" label-for="item-phone">
                    <b-form-input id="item-phone" v-model="phone" name="item-phone" size="sm" />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row class="mt-1">
                <b-col cols="6">
                  <b-form-group horizontal :label-cols="2" :label="$t('table.email')" label-for="item-email">
                    <b-form-input id="item-email" v-model="email" name="item-email" size="sm" />
                  </b-form-group>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab :title="$t('common.forwarders')">
              <b-table striped hover :items="vendorsAndCustomers" :fields="forwardersFileds"></b-table>
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
import { required, maxLength } from 'vuelidate/lib/validators'

const storeName = 'drivers'

export default {
  name: 'DriverDetail',

  page() {
    return { title: this.$t('route.driver'), meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: { Layout, PageHeader },

  data() {
    return {
      title: this.$t('route.driver'),
      forwardersFileds: [
        { key: 'n', label: 'N', sortable: true },
        { key: 'name', label: this.$t('table.forwarder'), sortable: true },
      ],
      viewId: this.$route.params.id,
      vendorsAndCustomers: [],
      cardSerial: '',
      cardNumber: '',
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  validations: {
    name: {
      required,
    },
    code: {
      maxLength: maxLength(12),
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

    idCard: {
      get() {
        return this.objectView ? this.objectView.object.idCard : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'idCard', value })
      },
    },

    termsOfUse: {
      get() {
        return this.objectView ? this.objectView.object.termsOfUse : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'termsOfUse', value })
      },
    },

    phone: {
      get() {
        return this.objectView ? this.objectView.object.phone : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'phone', value })
      },
    },

    email: {
      get() {
        return this.objectView ? this.objectView.object.email : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'email', value })
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
      await this.$router.push({ name: 'drivers-list' })
    },
  },
}
</script>

<style>
</style>
