<template>
  <Layout>
    <PageHeader :title="title" />
    <div>
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
            <b-form-group horizontal :label-cols="3" :label="$t('table.priceCode')" label-for="item-price-code">
              <b-form-input id="item-price-code" v-model="priceCode" type="text" name="item-price-code" size="sm"></b-form-input>
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
            <b-form-group horizontal :label-cols="1" :label="$t('table.description')" label-for="item-description">
              <b-form-input id="item-description" v-model="description" type="text" name="item-description" size="sm"></b-form-input>
            </b-form-group>
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
                        <b-form-group horizontal :label-cols="3" :label="$t('table.pricelistKind')" label-for="item-pricelist-kind">
                          <b-form-select id="item-pricelist-kind" v-model="pricelistKind" :options="pricelistKinds" name="item-pricelist-kind" size="sm"></b-form-select>
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col>
                        <b-form-checkbox v-model="includedInMain" disabled name="item-included-in-main" switch>
                          {{ $t('table.includedInMain') }}
                        </b-form-checkbox>
                      </b-col>
                      <b-col>
                        <b-form-checkbox v-model="notUseDiscount" disabled name="item-not-use-discount" switch>
                          {{ $t('table.notUseDiscount') }}
                        </b-form-checkbox>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col>
                        <b-form-group horizontal :label-cols="3" :content-cols="3" :label="$t('table.maxDiscount')" label-for="item-max-discount">
                          <b-form-input id="item-max-discount" v-model="maxDiscount" type="number" name="item-max-discount" size="sm"></b-form-input>
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
                        <b-form-group horizontal :label-cols="3" :label="$t('table.product')" label-for="item-product">
                          <b-form-select
                            id="item-product"
                            v-model="product"
                            :options="productList"
                            text-field="name"
                            value-field="id"
                            name="item-product"
                            size="sm"
                          ></b-form-select>
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
                        <b-form-group horizontal :label-cols="3" :label="$t('table.region')" label-for="item-region">
                          <b-form-input id="item-region" v-model="region" type="text" name="item-region" size="sm"></b-form-input>
                        </b-form-group>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col>
                    <b-table striped hover :items="object.customers" :fields="customerFields" small>
                      <template v-slot:cell(index)="{ index }">
                        <span>{{ ++index }}</span>
                      </template>
                    </b-table>
                  </b-col>
                </b-row>
              </b-tab>
              <b-tab :title="$t('common.prices')">
                <b-row>
                  <b-col>
                    <b-form-group horizontal :label-cols="3" :label="$t('table.pricingMethod')" label-for="item-pricing-method">
                      <b-form-select id="item-pricing-method" v-model="pricingMethod" :options="pricingMethods" name="item-pricing-method" size="sm"></b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col v-if="pricingMethod === 'fixed' || pricingMethod === 'percent'" cols="3">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.price')" label-for="item-price">
                      <b-form-input id="item-price" v-model="price" type="text" name="item-price" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group horizontal :label-cols="3" :label="$t('table.currency')" label-for="item-currency">
                      <b-form-input id="item-currency" v-model="currency" type="text" name="item-currency" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row v-if="pricingMethod === 'formula'">
                  <b-col cols="3">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.price')" label-for="item-factor">
                      <b-form-input id="item-factor" v-model="price" type="text" name="item-factor" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col cols="1"> x </b-col>
                  <b-col>
                    <b-form-group horizontal :label-cols="1" :label="$t('table.formula')" label-for="item-formula">
                      <b-form-input id="item-formula" v-model="priceFormula" type="text" name="item-formula" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row v-if="pricingMethod === 'table' || pricingMethod === 'scale'">
                  <b-col cols="3">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.dimensionX')" label-for="item-dim-x">
                      <b-form-input id="item-dim-x" v-model="dimensionX" type="text" name="item-dim-x" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col cols="2">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.min')" label-for="item-min-x">
                      <b-form-input id="item-min-x" v-model="minX" type="text" name="item-min-x" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col cols="2">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.max')" label-for="item-max-x">
                      <b-form-input id="item-max-x" v-model="maxX" type="text" name="item-max-x" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col cols="2">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.step')" label-for="item-step-x">
                      <b-form-input id="item-step-x" v-model="maxX" type="text" name="item-step-x" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row v-if="pricingMethod === 'table'">
                  <b-col cols="3">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.dimensionY')" label-for="item-dim-y">
                      <b-form-input id="item-dim-y" v-model="dimensionY" type="text" name="item-dim-y" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col cols="2">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.min')" label-for="item-min-y">
                      <b-form-input id="item-min-y" v-model="minY" type="text" name="item-min-y" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col cols="2">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.max')" label-for="item-max-y">
                      <b-form-input id="item-max-y" v-model="maxY" type="text" name="item-max-y" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col cols="2">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.step')" label-for="item-step-y">
                      <b-form-input id="item-step-y" v-model="maxY" type="text" name="item-step-y" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row v-if="pricingMethod === 'table' || pricingMethod === 'scale'">
                  <b-col>
                    <b-container fluid class="price-table">
                      <table>
                        <tr v-for="y of stepsY + 1" :key="y">
                          <td v-for="x of stepsX + 1" :key="x" class="border border-secondary p-1" :class="{ 'bg-secondary text-white': x === 1 || y === 1 }">{{
                            getPrice(x - 1, y - 1)
                          }}</td>
                        </tr>
                      </table>
                    </b-container>
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
    </div>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import PricingMethods from '@/constants/pricingMethods'
import PricelistKinds from '@/constants/pricelistKinds'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'PricelistDetail',
  page() {
    return { title: this.$t('route.pricelist'), meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: this.$t('route.pricelists'),
      viewId: this.$route.params.id,
      pricelistKinds: PricelistKinds.map((el) => {
        return { value: el, text: this.$t(`pricelistKinds.${el}`) }
      }),
      productList: [],
      customerFields: [
        { key: 'index', label: this.$t('table.sort') },
        { key: 'customer.name', label: this.$t('table.customer') },
      ],
      pricingMethods: PricingMethods.map((el) => {
        return { value: el, text: this.$t(`pricingMethods.${el}`) }
      }),
      priceTable: [],
      stepsX: 0,
      stepsY: 0,
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'pricelists/objectView',
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

    description: {
      get() {
        return this.objectView ? this.objectView.object.description : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'description', value })
      },
    },

    pricelistKind: {
      get() {
        return this.objectView ? this.objectView.object.pricelistKind : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'pricelistKind', value })
      },
    },

    pricingMethod: {
      get() {
        return this.objectView ? this.objectView.object.pricingMethod : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'pricingMethod', value })
      },
    },

    includedInMain: {
      get() {
        return this.objectView ? this.objectView.object.includedInMain : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'includedInMain', value })
      },
    },

    notUseDiscount: {
      get() {
        return this.objectView ? this.objectView.object.notUseDiscount : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'notUseDiscount', value })
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

    maxDiscount: {
      get() {
        return this.objectView ? this.objectView.object.maxDiscount : 0
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'maxDiscount', value })
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

    region: {
      get() {
        return this.objectView ? this.objectView.object.region : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'region', value })
      },
    },

    currency: {
      get() {
        return this.objectView ? this.objectView.object.currency : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'currency', value })
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

    priceFormula: {
      get() {
        return this.objectView ? this.objectView.object.priceFormula : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'priceFormula', value })
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

    dimensionX: {
      get() {
        if (this.objectView && this.objectView.object && this.objectView.object.dimensions.length > 0) {
          return this.objectView.object.dimensions[0].dimension.name
        }

        return ''
      },
      set(value) {
        // no change
      },
    },

    minX: {
      get() {
        if (this.objectView && this.objectView.object && this.objectView.object.dimensions.length > 0) {
          return this.objectView.object.dimensions[0].min
        }

        return 0
      },
      set(value) {
        // no change
      },
    },

    maxX: {
      get() {
        if (this.objectView && this.objectView.object && this.objectView.object.dimensions.length > 0) {
          return this.objectView.object.dimensions[0].max
        }

        return 0
      },
      set(value) {
        // no change
      },
    },

    stepX: {
      get() {
        if (this.objectView && this.objectView.object && this.objectView.object.dimensions.length > 0) {
          return this.objectView.object.dimensions[0].step
        }

        return 0
      },
      set(value) {
        // no change
      },
    },

    dimensionY: {
      get() {
        if (this.objectView && this.objectView.object && this.objectView.object.dimensions.length > 1) {
          return this.objectView.object.dimensions[1].dimension.name
        }

        return ''
      },
      set(value) {
        // no change
      },
    },

    minY: {
      get() {
        if (this.objectView && this.objectView.object && this.objectView.object.dimensions.length > 1) {
          return this.objectView.object.dimensions[1].min
        }

        return 0
      },
      set(value) {
        // no change
      },
    },

    maxY: {
      get() {
        if (this.objectView && this.objectView.object && this.objectView.object.dimensions.length > 1) {
          return this.objectView.object.dimensions[1].max
        }

        return 0
      },
      set(value) {
        // no change
      },
    },

    stepY: {
      get() {
        if (this.objectView && this.objectView.object && this.objectView.object.dimensions.length > 1) {
          return this.objectView.object.dimensions[1].step
        }

        return 0
      },
      set(value) {
        // no change
      },
    },
  },

  async mounted() {
    await this.initProducts()

    if (this.pricingMethod === 'scale' || this.pricingMethod === 'table') {
      this.initPrices()
    }
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'pricelists/setObjectViewProperty',
      setObjectProperty: 'pricelists/setObjectProperty',
      delObjectView: 'pricelists/delObjectView',
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

    initPrices() {
      if (!this.object.prices) {
        return
      }

      if (this.pricingMethod === 'table') {
        const stepX = this.stepX

        if (stepX === 0) {
          return
        }

        let minX = this.minX
        if (minX === 0) {
          minX = stepX
        }

        const maxX = this.maxX

        const stepY = this.stepY

        if (stepY === 0) {
          return
        }

        let minY = this.minY
        if (minY === 0) {
          minY = stepY
        }

        const maxY = this.maxY

        this.stepsX = Math.ceil(1 + (maxX - minX) / stepX)
        this.stepsY = Math.ceil(1 + (maxY - minY) / stepY)

        for (let x = 1; x <= this.stepsX; x++) {
          for (let y = 1; y <= this.stepsY; y++) {
            this.priceTable.push({
              coordX: x,
              coordY: y,
              minX: x === 1 ? 0 : minX + (x - 2) * stepX,
              maxX: Math.min(minX + (x - 1) * stepX, maxX),
              minY: y === 1 ? 0 : minY + (y - 2) * stepY,
              maxY: Math.min(minY + (y - 1) * stepY, maxY),
              price: 0,
            })
          }
        }

        for (const priceRow of this.priceTable) {
          const fPrice = this.object.prices.find((el) => {
            return el.coordinateX === priceRow.coordX && el.coordinateY === priceRow.coordY
          })

          if (fPrice) {
            priceRow.price = fPrice.price
          }
        }
      }

      if (this.pricingMethod === 'scale') {
        const stepX = this.stepX

        if (stepX === 0) {
          return
        }

        let minX = this.minX
        if (minX === 0) {
          minX = stepX
        }

        const maxX = this.maxX
        this.stepsX = Math.ceil(1 + (maxX - minX) / stepX)

        this.stepsY = 1

        for (let x = 1; x <= this.stepsX; x++) {
          this.priceTable.push({
            coordX: x,
            coordY: 1,
            minX: x === 1 ? 0 : minX + (x - 2) * stepX,
            maxX: Math.min(minX + (x - 1) * stepX, maxX),
            minY: 0,
            maxY: this.$t('table.price'),
            price: 0,
          })
        }

        for (const priceRow of this.priceTable) {
          const fPrice = this.object.prices.find((el) => {
            return el.coordinateX === priceRow.coordX
          })

          if (fPrice) {
            priceRow.price = fPrice.price
          }
        }
      }
    },

    getPrice(x, y) {
      if (x === 0 && y === 0) {
        return '-'
      }

      if (x === 0) {
        const result = this.priceTable.find((el) => {
          return el.coordY === y
        })

        if (result) {
          return result.maxY
        }
      }

      if (y === 0) {
        const result = this.priceTable.find((el) => {
          return el.coordX === x
        })

        if (result) {
          return result.maxX
        }
      }

      const result = this.priceTable.find((el) => {
        return el.coordX === x && el.coordY === y
      })

      if (result) {
        return result.price
      }

      return ''
    },

    getMaxX(x) {
      const result = this.priceTable.find((el) => {
        return el.coordX === x
      })

      if (result) {
        return result.maxX
      }

      return ''
    },

    getMaxY(y) {
      const result = this.priceTable.find((el) => {
        return el.coordY === y
      })

      if (result) {
        return result.maxY
      }

      return ''
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
      this.$router.push({ name: 'pricelists' })
    },
  },
}
</script>

<style>
.price-table {
  overflow: scroll;
}
</style>
