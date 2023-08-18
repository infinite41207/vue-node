<template>
  <Layout>
    <PageHeader :title="title" />
    <b-card>
      <b-card-header>
        <b-row>
          <b-col>
            <b-button-toolbar>
              <b-btn-group>
                <b-button variant="success" :disabled="readOnly" class="btn-sm" @click="writeObject">
                  <i class="ri-close-line"></i>
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
      </b-card-header>
      <b-card-body>
        <b-row>
          <b-col md="5">
            <b-form-group horizontal :label-cols="3" :label="$t('table.name')" label-for="object-name">
              <b-form-input id="object-name" v-model="name" name="object-name" size="sm" />
            </b-form-group>

            <b-form-group horizontal :label-cols="3" :label="$t('table.nip')" label-for="object-nip">
              <b-form-input id="object-nip" v-model="nip" name="object-nip" size="sm" />
            </b-form-group>

            <b-form-group horizontal :label-cols="3" :label="$t('table.abbreviation')" label-for="object-abbreviation">
              <b-form-input id="object-abbreviation" v-model="abbreviation" name="object-abbreviation" size="sm" />
            </b-form-group>

            <b-form-group horizontal :label-cols="3" :label="$t('table.country')" label-for="object-country">
              <f-select
                class="ml-d"
                id="object-country"
                v-model="country"
                select-btn
                open-btn
                value-type="countries"
                detail-view="countries-list"
                placeholder="Wyszukaj kraj..."
              ></f-select>
            </b-form-group>

            <b-form-group horizontal :label-cols="3" :label="$t('table.region')" label-for="object-region">
              <b-form-input id="object-region" v-model="region" name="object-region" size="sm" />
            </b-form-group>

            <b-form-group horizontal :label-cols="3" :label="$t('table.address')" label-for="object-address">
              <b-form-input id="object-address" v-model="address" name="object-address" size="sm" />
            </b-form-group>

            <b-form-group horizontal :label-cols="3" :label="$t('table.packageMaterial')" label-for="object-packageMaterial">
              <b-form-select id="object-packageMaterial" v-model="packageMaterial" :options="materials" name="object-packageMaterial" size="sm" />
            </b-form-group>

            <b-row>
              <b-col>
                <b-form-group horizontal :label-cols="6" :label="$t('table.customer')" label-for="item-customer">
                  <b-form-checkbox id="item-customer" v-model="customer" name="item-customer" class="mt-1" switch />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group horizontal :label-cols="6" :label="$t('table.supplier')" label-for="item-supplier">
                  <b-form-checkbox id="item-supplier" v-model="supplier" name="item-supplier" class="mt-1" switch />
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
          <b-col md="5">
            <b-form-group horizontal :label-cols="3" :label="$t('table.pricesType')" label-for="object-pricesType">
              <b-form-input id="object-pricesType" v-model="priceType" name="object-pricesType" size="sm" />
            </b-form-group>

            <b-form-group horizontal :label-cols="3" :content-cols="3" :label="$t('table.commission')" label-for="customer-commission">
              <b-form-input id="customer-commission" v-model="commission" type="number" name="customer-commission" size="sm" @change="onChangeCommission" />
            </b-form-group>

            <b-form-group horizontal :label-cols="3" :label="$t('table.manager')" label-for="customer-manager">
              <f-select
                class="ml-d"
                id="object-manager"
                v-model="manager"
                select-btn
                open-btn
                value-type="employees"
                detail-view="employee-detail"
                placeholder="Wyszukaj handlowca..."
              ></f-select>
            </b-form-group>

            <b-form-group horizontal :label-cols="3" :label="$t('table.email')" label-for="object-email">
              <b-form-input id="object-email" v-model="email" name="object-email" size="sm" />
            </b-form-group>

            <b-form-group horizontal :label-cols="3" :label="$t('table.phone')" label-for="object-phone">
              <b-form-input id="object-phone" v-model="phone" name="object-phone" size="sm" />
            </b-form-group>

            <b-form-group horizontal :label-cols="3" :content-cols="5" :label="$t('table.language')" label-for="object-language">
              <b-form-input id="object-language" v-model="language" name="object-language" size="sm" />
            </b-form-group>

            <b-form-group horizontal :label-cols="3" :label="$t('table.currency')" label-for="object-currency">
              <f-select
                class="ml-d"
                v-model="currency"
                id="object-currency"
                select-btn
                open-btn
                value-type="currencies"
                detail-view="currencies-list"
                placeholder="Wyszukaj walutę..."
              ></f-select>
            </b-form-group>

            <b-form-group horizontal :label-cols="3" :label="$t('table.paymentTerms')" label-for="object-paymentTerms">
              <f-select
                class="ml-d"
                id="object-termOfPayments"
                v-model="termOfPayment"
                select-btn
                open-btn
                value-type="termsOfPayment"
                detail-view="terms-of-payment-list"
                placeholder="Wyszukaj terminy płatności..."
              ></f-select>
            </b-form-group>

            <b-form-group horizontal :label-cols="3" :label="$t('table.customersGroup')" label-for="object-customersGroup">
              <b-form-input id="object-customersGroup" v-model="customerGroup" name="object-customersGroup" size="sm" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row v-if="!externalUser" class="mt-2">
          <b-col>
            <div>
              <h6 class="font-16">{{ $t('table.note') }}:</h6>
              <p>{{ object.note }}</p>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <p class="mb-1">{{ $t('common.dateAdded') }}: {{ object.createdAt }}</p>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapActions, mapMutations } from 'vuex'

const storeName = 'counterparties'

export default {
  name: 'CounterpartyDetail',

  page() {
    return { title: this.$t('route.counterparty'), meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: { Layout, PageHeader },

  data() {
    return {
      title: this.$t('route.counterparty'),
      viewId: this.$route.params.id,
      externalUser: this.$attrs.user ? this.$attrs.user.externalUser : false,
      employees: [],
      materials: [
        { value: 'Karton', text: 'Karton' },
        { value: 'Folia', text: 'Folia' },
      ],
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'counterparties/objectView',
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

    commission: {
      get() {
        return this.objectView ? this.objectView.object.commission : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'commission', value })
      },
    },

    nip: {
      get() {
        return this.objectView ? this.objectView.object.nip : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'nip', value })
      },
    },

    abbreviation: {
      get() {
        return this.objectView ? this.objectView.object.abbreviation : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'abbreviation', value })
      },
    },

    region: {
      get() {
        return this.objectView ? this.objectView.object.region : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'region', value })
      },
    },

    address: {
      get() {
        return this.objectView ? this.objectView.object.address : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'address', value })
      },
    },

    email: {
      get() {
        return this.objectView ? this.objectView.object.email : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'email', value })
      },
    },

    phone: {
      get() {
        return this.objectView ? this.objectView.object.phone : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'phone', value })
      },
    },

    language: {
      get() {
        return this.objectView ? this.objectView.object.language : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'language', value })
      },
    },

    paymentTerms: {
      get() {
        return this.objectView ? this.objectView.object.paymentTerms : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'paymentTerms', value })
      },
    },

    customerGroup: {
      get() {
        return this.objectView ? this.objectView.object.customerGroup : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'customerGroup', value })
      },
    },

    priceType: {
      get() {
        return this.objectView ? this.objectView.object.priceType : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'priceType', value })
      },
    },

    packageMaterial: {
      get() {
        return this.objectView ? this.objectView.object.packageMaterial : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'packageMaterial', value })
      },
    },

    country: {
      get() {
        return this.objectView ? this.object.country : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'country', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'countryId', value: value ? value.id : value })
      },
    },

    termOfPayment: {
      get() {
        return this.objectView ? this.object.termOfPayment : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'termOfPayment', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'termOfPaymentId', value: value ? value.id : value })
      },
    },

    currency: {
      get() {
        return this.objectView ? this.object.currency : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'currency', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'currencyId', value: value ? value.id : value })
      },
    },

    manager: {
      get() {
        return this.objectView ? this.object.manager : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'manager', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'managerId', value: value ? value.id : value })
      },
    },

    customer: {
      get() {
        return this.objectView ? this.object.customer : false
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'customer', value })
      },
    },

    supplier: {
      get() {
        return this.objectView ? this.object.customer : false
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'supplier', value })
      },
    },
  },

  async mounted() {
    await this.initEmployees()
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'counterparties/setObjectViewProperty',
      setObjectProperty: 'counterparties/setObjectProperty',
      delObjectView: 'counterparties/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async initEmployees() {
      const response = await this.$store.dispatch('employees/findAll', { noCommit: true })

      if (response.status === 200) {
        this.employees = response.data
      }
    },

    onChangeCommission() {
      try {
        this.commission = Number(this.commission).toFixed(2)
      } catch {
        this.commission = '0.00'
      }
    },

    async writeObject() {
      this.object.deliverySettings = ''

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
      await this.$router.push({ name: 'counterparties' })
    },
  },
}
</script>
