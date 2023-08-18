<template>
  <Layout>
    <PageHeader :title="title" />

    <b-card>
      <b-row>
        <b-col>
          <b-button-toolbar>
            <b-btn-group class="mt-2">
              <a href="javascript:void(0);" :disabled="readOnly" class="btn btn-success btn-sm" @click="writeObject">
                <i class="ri-save-2-fill"></i>
                {{ $t('commands.writeAndClose') }}
              </a>
              <a href="javascript:void(0);" class="btn btn-info btn-sm ml-2" @click="closeView">
                <i class="ri-close-line"></i>
                {{ $t('commands.close') }}
              </a></b-btn-group
            ></b-button-toolbar
          >
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col cols="2">
          <b-form-group horizontal :label-cols="3" :label="$t('table.number')" label-for="number">
            <b-form-input id="item-number" v-model="number" type="text" name="item-number" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col cols="2">
          <b-form-group horizontal :label-cols="3" :label="$t('table.date')" label-for="tem-date">
            <b-form-input id="item-date" v-model="date" type="text" name="item-date" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-checkbox v-model="confirmed" disabled name="item-confirmed" switch>
            {{ $t('table.confirmed') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-tabs v-model="tabIndex" content-class="mt-2">
            <b-tab :title="$t('common.mainData')" active>
              <b-row>
                <b-col cols="6">
                  <b-row>
                    <b-col>
                      <b-form-group horizontal :label-cols="3" :content-cols="3" :label="$t('table.priority')" label-for="item-max-priority">
                        <b-form-input id="item-max-priority" v-model="priority" type="number" name="item-max-priority" size="sm"></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-form-group horizontal :label-cols="3" :label="$t('table.customer')" label-for="item-customer">
                        <b-form-select
                          id="item-customer"
                          v-model="customer"
                          :options="customerList"
                          text-field="name"
                          value-field="id"
                          name="item-customer"
                          size="sm"
                        ></b-form-select>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-form-group horizontal :label-cols="3" :label="$t('table.product')" label-for="item-product">
                        <b-form-select id="item-product" v-model="product" :options="productList" text-field="name" value-field="id" name="item-product" size="sm"></b-form-select>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-form-group horizontal :label-cols="6" :content-cols="6" :label="$t('table.beginDate')" label-for="item-begin-date">
                        <b-form-input id="item-begin-date" v-model="beginDate" type="text" name="item-begin-date" size="sm"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <b-col>
                      <b-form-group horizontal :label-cols="6" :content-cols="6" :label="$t('table.endDate')" label-for="item-end-date">
                        <b-form-input id="item-end-date" v-model="endDate" type="text" name="item-end-date" size="sm"></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-form-group horizontal :label-cols="3" :label="$t('table.belongs')" label-for="item-belongs">
                        <b-form-select id="item-belongs" v-model="belonging" :options="discountBelongs" name="item-belongs" size="sm"></b-form-select>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-form-group horizontal :label-cols="3" :label="$t('table.priceCode')" label-for="item-price-code">
                        <b-form-input id="item-price-code" v-model="priceCode" type="text" name="item-price-code" size="sm"></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-form-group horizontal :label-cols="3" :label="$t('table.priceType')" label-for="item-price-type">
                        <b-form-input id="item-price-type" v-model="priceType" type="text" name="item-price-type" size="sm"></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-form-group horizontal :label-cols="3" :label="$t('table.discountType')" label-for="item-discount-type">
                        <b-form-select id="item-discount-type" v-model="discountType" :options="discountTypes" name="item-discount-type" size="sm"></b-form-select>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-form-group horizontal :label-cols="3" :content-cols="discountType === 'formula' ? 8 : 3" :label="$t('table.discount')" label-for="item-discount">
                        <b-form-input id="item-discount" v-model="price" type="number" name="item-discount" size="sm"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <b-col v-if="discountType === 'formula'">
                      <b-form-group horizontal :label-cols="3" :label="$t('table.formula')" label-for="item-formula">
                        <b-form-input id="item-formula" v-model="priceFormula" type="text" name="item-formula" size="sm"></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-form-checkbox v-model="includeMain" disabled name="item-included-in-main" switch>
                        {{ $t('table.includedInMain') }}
                      </b-form-checkbox>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab :title="$t('common.filters')">
              <b-row>
                <b-col>
                  <b-form-group horizontal :label-cols="3" :label="$t('table.filters')" label-for="item-filters">
                    <b-form-textarea id="item-filters" v-model="filters" type="text" name="item-filters" size="sm" rows="10" max-rows="40"></b-form-textarea>
                  </b-form-group>
                </b-col>
              </b-row>
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
import DiscountTypes from '@/constants/discountTypes'
import DiscountBelongs from '@/constants/discountBelongs'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'DiscountDetail',
  page() {
    return { title: this.$t('route.discount'), meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: this.$t('route.discount'),
      viewId: this.$route.params.id,
      productList: [],
      customerList: [],
      discountTypes: DiscountTypes.map((el) => {
        return { value: el, text: this.$t(`discountTypes.${el}`) }
      }),
      discountBelongs: DiscountBelongs.map((el) => {
        return { value: el, text: this.$t(`discountBelongs.${el}`) }
      }),
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'discounts/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    tabIndex: {
      get() {
        return this.objectView ? this.objectView.tabIndex : 0
      },
      set(value) {
        this.setObjectViewProperty({ viewId: this.viewId, property: 'tabIndex', value })
      },
    },

    number: {
      get() {
        return this.objectView ? this.objectView.object.number : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'number', value })
      },
    },

    date: {
      get() {
        return this.objectView ? this.objectView.object.date : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'date', value })
      },
    },

    priceCode: {
      get() {
        return this.objectView ? this.objectView.object.priceCode : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'priceCode', value })
      },
    },

    confirmed: {
      get() {
        return this.objectView ? this.objectView.object.confirmed : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'confirmed', value })
      },
    },

    priority: {
      get() {
        return this.objectView ? this.objectView.object.priority : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'priority', value })
      },
    },

    customer: {
      get() {
        return this.objectView ? this.objectView.object.customerId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'customerId', value })
      },
    },

    product: {
      get() {
        return this.objectView ? this.objectView.object.productId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'productId', value })
      },
    },

    pricelist: {
      get() {
        return this.objectView ? this.objectView.object.pricelistId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'pricelistId', value })
      },
    },

    beginDate: {
      get() {
        return this.objectView ? this.objectView.object.beginDate : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'beginDate', value })
      },
    },

    endDate: {
      get() {
        return this.objectView ? this.objectView.object.endDate : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'endDate', value })
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

    belonging: {
      get() {
        return this.objectView ? this.objectView.object.belonging : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'belonging', value })
      },
    },

    discountType: {
      get() {
        return this.objectView ? this.objectView.object.discountType : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'discountType', value })
      },
    },

    price: {
      get() {
        return this.objectView ? this.objectView.object.price : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'price', value })
      },
    },

    priceFormula: {
      get() {
        return this.objectView ? this.objectView.object.priceFormula : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'priceFormula', value })
      },
    },

    includeMain: {
      get() {
        return this.objectView ? this.objectView.object.includeMain : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'includeMain', value })
      },
    },

    filters: {
      get() {
        return this.objectView ? this.objectView.object.filters : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'filters', value })
      },
    },
  },

  async mounted() {
    await this.initProducts()
    await this.initCustomers()
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'discounts/setObjectViewProperty',
      setObjectProperty: 'discounts/setObjectProperty',
      delObjectView: 'discounts/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async initProducts() {
      if (this.productList.length === 0) {
        const response = await this.$store.dispatch('products/findAll', {
          params: {
            filter: {
              configProduct: true,
            },
          },
          noCommit: true,
        })

        if (response.status === 200) {
          this.productList = response.data
        } else {
          this.productList = []
        }
      }
    },

    async initCustomers() {
      if (this.customerList.length === 0) {
        const response = await this.$store.dispatch('counterparties/findAll', {
          noCommit: true,
        })

        if (response.status === 200) {
          this.customerList = response.data
        } else {
          this.customerList = []
        }
      }
    },

    async writeObject() {
      if (this.object.id === null) {
        return
      }

      this.closeView()
    },

    async closeView() {
      this.$destroy()
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)
      this.$router.push({ name: 'discounts' })
    },
  },
}
</script>
