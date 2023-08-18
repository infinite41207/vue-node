<template>
  <b-card :title="$t('order.priceDetails')">
    <b-card-body>
      <b-row>
        <b-col>
          <b-button variant="success" size="sm" class="mr-2" @click="confirmPrices">
            <i class="ri-check-line"></i>
            {{ $t('commands.confirmPrices') }}
          </b-button>
          <b-button variant="danger" size="sm" class="mr-2" @click="cancelPrices">
            <i class="ri-forbid-line"></i>
            {{ $t('commands.cancel') }}
          </b-button>
          <b-button v-if="currentProduct.configProduct" variant="info" size="sm" @click="calculatePrices">
            <i class="ri-calculator-line"></i>
            {{ $t('commands.calculate') }}
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-row class="mt-2">
            <b-col>
              <b-table hover :items="prices" :fields="priceFields" :busy="isBusy" :tbody-tr-class="rowClass" small foot-clone>
                <template v-slot:table-colgroup="scope">
                  <col v-for="field in scope.fields" :key="field.key" :style="setValueColumnWidth(field.key)" />
                </template>
                <template v-slot:table-busy>
                  <div class="text-center text-info my-2">
                    <b-spinner class="align-middle mr-2"></b-spinner>
                    <strong>{{ $t('common.recalculation') }}...</strong>
                  </div>
                </template>
                <template v-slot:cell(index)="{ index }">
                  <p>{{ ++index }}</p>
                </template>
                <template v-slot:cell(description)="data">
                  <b-link v-if="!currentProduct.configProduct" href="javascript:void(0);" @click="changeConfiguration(data)">{{ data.item.description }} </b-link>
                  <p v-else @contextmenu.prevent="openAddinMenu(data.item, $event)">{{ data.item.description }} </p>
                </template>
                <template v-if="!currentProduct.configProduct" v-slot:cell(quantity)="data">
                  <b-form-input
                    id="row-quantity"
                    v-model="data.item.quantity"
                    type="number"
                    name="row-quantity"
                    :disabled="currentProduct.configProduct"
                    size="sm"
                    @change="onChangeQuantity(data)"
                  ></b-form-input>
                </template>
                <template v-slot:cell(price)="data">
                  <b-form-input
                    id="row-price"
                    v-model="data.item.price"
                    type="number"
                    name="row-price"
                    :disabled="externalUser"
                    size="sm"
                    @change="onChangePrice(data)"
                  ></b-form-input>
                </template>
                <template v-slot:cell(discountPercent)="data">
                  <b-form-input
                    id="row-discount-percent"
                    v-model="data.item.discountPercent"
                    type="number"
                    name="row-discount-percent"
                    :disabled="externalUser"
                    size="sm"
                    @change="onChangeDiscountPercent(data)"
                  ></b-form-input>
                </template>
                <template v-slot:cell(discountSum)="data">
                  <b-form-input
                    id="row-discount-sum"
                    v-model="data.item.discountSum"
                    type="number"
                    name="row-discount-sum"
                    :disabled="externalUser"
                    size="sm"
                    @change="onChangeDiscountSum(data)"
                  ></b-form-input>
                </template>
                <template v-slot:cell(sum)="data">
                  <b-form-input id="row-sum" v-model="data.item.sum" type="number" name="row-sum" size="sm" disabled></b-form-input>
                </template>
                <template v-slot:foot()><strong></strong> </template>
                <template v-slot:foot(quantity)>
                  <strong>{{ $t('common.total') }}, {{ currentOrder.currency ? currentOrder.currency.name : '' }} :</strong>
                </template>
                <template v-slot:foot(price)
                  ><strong class="ml-2">{{ totalPrice }}</strong>
                </template>
                <template v-slot:foot(discountPercent)><strong class="ml-2"> - </strong> </template>
                <template v-slot:foot(discountSum)>
                  <strong class="ml-2">{{ totalDiscount }}</strong>
                </template>
                <template v-slot:foot(sum)>
                  <strong class="ml-2">{{ totalSum }}</strong>
                </template>
                ></b-table
              >
              <ul v-show="visibleMenu" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
                <li @click="openPricelist"> Otwórz cennik </li>
                <li @click="openDiscount"> Otwórz rabat </li>
              </ul>
            </b-col>
          </b-row>
          <b-row v-if="!externalUser">
            <b-col>
              <b-form-textarea id="customer-note" :value="customerData.note" plaintext disabled max-rows="40" style="overflow: hidden" no-resize></b-form-textarea>
            </b-col>
          </b-row>
        </b-col>
        <b-col v-if="currentProduct.choosenParameters.length > 0" md="3">
          <h4>{{ currentProduct.product.name }}</h4>
          <b-form-textarea id="product-description" :value="currentProduct.description" size="sm" no-resize disabled plaintext style="overflow: hidden" max-rows="30">
          </b-form-textarea>
        </b-col>
      </b-row>

      <!-- modal message -->
      <b-modal id="edit-addin-param" :title="'common.addinDimensions'" no-close-on-backdrop ok-only @ok="handleOkQuantity">
        <b-row class="mt-2" align-v="center">
          <b-col md="4">
            <label for="number-of-pieces-input">{{ $t('common.numberOfPieces') }}:</label>
          </b-col>
          <b-col>
            <b-form-input id="number-of-pieces-input" v-model="addinParameters.numberOfPieces" :min="1" :state="addinParameters.numberOfPieces < 1" type="number" />
          </b-col>
        </b-row>
        <b-row class="mt-2" align-v="center">
          <b-col md="4">
            <label for="length-input">{{ $t('common.lengthWidth') }}:</label>
          </b-col>
          <b-col>
            <b-form-input id="length-input" v-model="addinParameters.length" type="number" />
          </b-col>
        </b-row>
        <b-row class="mt-2" align-v="center">
          <b-col md="4">
            <label for="height-input">{{ $t('common.height') }}:</label>
          </b-col>
          <b-col>
            <b-form-input id="height-input" v-model="addinParameters.height" type="number" />
          </b-col>
        </b-row>
      </b-modal>
    </b-card-body>
  </b-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import _ from 'lodash'

export default {
  props: {
    viewId: {
      type: String,
      default: null,
    },
    externalUser: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      parameters: [],
      prices: [],
      totalPrice: '0,00',
      totalDiscount: '0,00',
      totalSum: '0,00',
      selectedValues: [],
      addinParameters: {
        numberOfPieces: 0,
        length: 0,
        height: 0,
        quantity: 0,
        description: '',
      },
      isBusy: false,
      visibleMenu: false,
      top: 0,
      left: 0,
      currentRow: {},
      priceFields: [
        { key: 'index', label: this.$t('table.sort') },
        { key: 'priceDescription', label: this.$t('table.priceCode') },
        { key: 'description', label: this.$t('table.description') },
        { key: 'unitOfMeasureStr', label: this.$t('table.jOM') },
        { key: 'quantity', label: this.$t('table.quantity') },
        { key: 'price', label: this.$t('table.price') },
        { key: 'discountPercent', label: this.$t('table.discountPercent') },
        { key: 'discountSum', label: this.$t('table.discountSum') },
        { key: 'sum', label: this.$t('table.sum') },
      ],
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'orders/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    currentOrder() {
      return this.objectView.object
    },

    customerData() {
      return this.objectView.customerData
    },

    currentProduct() {
      return this.objectView.currentProduct
    },

    initCalcPrices() {
      return this.objectView.initCalcPrices
    },
  },

  watch: {
    visibleMenu(newValue, oldValue) {
      if (newValue) {
        document.body.addEventListener('click', this.closeAddinMenu)
      } else {
        document.body.removeEventListener('click', this.closeAddinMenu)
      }
    },
  },

  async mounted() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      setObjectViewProperties: 'orders/setObjectViewProperties',
      setProductPrices: 'orders/setProductPrices',
      addObjectProduct: 'orders/addObjectProduct',
      setChoosenParameters: 'orders/setChoosenParameters',
    }),

    async initialize() {
      if (this.initCalcPrices) {
        await this.calculatePrices()
        this.setObjectViewProperties({
          viewId: this.viewId,
          props: { initCalcPrices: false },
        })
      } else {
        this.prices = _.cloneDeep(this.currentProduct.prices)

        for (const priceRow of this.prices) {
          priceRow.unitOfMeasureStr = this.currentProduct.product.unitOfMeasureStr
        }

        this.calcTotalSum()
      }

      this.addinParameters = {
        description: this.currentProduct.description,
        numberOfPieces: this.currentProduct.numberOfPieces,
        length: this.currentProduct.length,
        height: this.currentProduct.height,
        quantity: this.currentProduct.quantity,
      }
    },

    setValueColumnWidth(key) {
      if (key === 'quantity' || key === 'price' || key === 'sum' || key === 'discountPercent' || key === 'discountSum') {
        return 'width: 10%'
      } else {
        return ''
      }
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.priceType === 'main') return 'table-success'
    },

    openAddinMenu(rowData, e) {
      if (this.externalUser === true) {
        return
      }

      this.currentRow = { ...rowData }
      this.left = e.layerX + 10
      this.top = e.layerY
      this.visibleMenu = true
    },

    closeAddinMenu() {
      this.visibleMenu = false
    },

    async openPricelist() {
      if (this.currentRow.pricelistId) {
        const response = await this.$store.dispatch('pricelists/findByPk', {
          params: {
            id: this.currentRow.pricelistId,
          },
        })
        if (response.status === 200) {
          this.$router.push({ name: 'pricelist-detail', params: { id: this.currentRow.pricelistId } })
        }
      }
    },

    async openDiscount() {
      if (this.currentRow.discountId) {
        await this.$store
          .dispatch(`discounts/findByPk`, {
            params: {
              id: this.currentRow.discountId,
            },
          })
          .then((response) => {
            if (response.status === 200) {
              this.$router.push({ name: 'discounts-detail', params: { id: this.currentRow.discountId } })
            }
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },

    async calculatePrices() {
      this.isBusy = true

      await this.convertChoosenParameters()

      const response = await this.$store.dispatch('orders/calculatePrices', { viewId: this.viewId })
      if (response.status === 200) {
        this.prices = response.data
      }

      for (const priceRow of this.prices) {
        priceRow.unitOfMeasureStr = this.currentProduct.product.unitOfMeasureStr
        this.setRowToFixed(priceRow)
      }

      this.calcTotalSum()

      this.isBusy = false
    },

    onChangeQuantity(data) {
      this.addinParameters.quantity = data.item.quantity

      this.calcRowSum(data.item)
    },

    onChangePrice(data) {
      this.calcRowSum(data.item)
    },

    onChangeDiscountPercent(data) {
      this.calcRowSum(data.item)
    },

    onChangeDiscountSum(data) {
      this.calcRowSum(data.item)
    },

    changeConfiguration(data) {
      this.$bvModal.show('edit-addin-param')
    },

    handleOkQuantity(bvModalEvt) {
      bvModalEvt.preventDefault()
      this.handleSubmitQuantity()
    },

    async handleSubmitQuantity() {
      if (this.addinParameters.height > 0 || this.addinParameters.length > 0) {
        if (this.addinParameters.numberOfPieces === 0) {
          this.addinParameters.numberOfPieces = 1
        }

        let quantity = this.addinParameters.numberOfPieces

        if (this.addinParameters.length > 0) {
          quantity *= this.addinParameters.length
        }

        if (this.addinParameters.height > 0) {
          quantity *= this.addinParameters.height
        }

        this.addinParameters.quantity = quantity
      }

      this.generateDescription()

      this.prices[0].description = this.addinParameters.description
      this.prices[0].quantity = this.addinParameters.quantity

      this.calcRowSum(this.prices[0])

      this.$nextTick(() => {
        this.$bvModal.hide('edit-addin-param')
      })
    },

    generateDescription() {
      if (this.addinParameters.length === 0 && this.addinParameters.height === 0) {
        this.addinParameters.description = ''
        return
      }

      let description = ''
      description += this.addinParameters.numberOfPieces

      if (this.addinParameters.length > 0) {
        description += ' x ' + this.addinParameters.length
      }

      if (this.addinParameters.height > 0) {
        description += ' x ' + this.addinParameters.height
      }

      this.addinParameters.description = description
    },

    calcRowSum(priceRow) {
      priceRow.sum = priceRow.quantity * priceRow.price

      if (Number(priceRow.discountPercent) > 0) {
        priceRow.discountSum = ((priceRow.sum * priceRow.discountPercent) / 100).toFixed(2)
        priceRow.sum -= priceRow.discountSum
      } else if (Number(priceRow.discountSum) > 0) {
        priceRow.sum -= priceRow.discountSum
      }

      this.calcTotalSum()
      this.setRowToFixed(priceRow)
    },

    calcTotalSum() {
      this.totalPrice = 0
      this.totalDiscount = 0
      this.totalSum = 0

      for (const price of this.prices) {
        this.totalPrice += Number(price.price)
        this.totalSum += Number(price.sum)
        this.totalDiscount += Number(price.discountSum)
      }

      this.totalPrice = this.totalPrice.toFixed(2)
      this.totalSum = this.totalSum.toFixed(2)
      this.totalDiscount = this.totalDiscount.toFixed(2)
    },

    setRowToFixed(priceRow) {
      priceRow.price = Number(priceRow.price).toFixed(2)
      priceRow.sum = Number(priceRow.sum).toFixed(2)
      priceRow.discountSum = Number(priceRow.discountSum).toFixed(2)
      priceRow.discountPercent = Number(priceRow.discountPercent).toFixed(2)
    },

    async convertChoosenParameters() {
      if (this.currentProduct.choosenParameters.length === 0) {
        return
      }

      if (this.currentProduct.choosenParameters[0].param.uuid) {
        return
      }

      const choosenParameters = _.cloneDeep(this.currentProduct.choosenParameters)
      const valuesId = []

      if (this.parameters.length === 0) {
        const queryParams = {
          productId: this.currentProduct.product.id,
        }

        this.parameters = await this.$store.dispatch('parameters/getProductParameters', queryParams)

        for (const choosenParameter of choosenParameters) {
          const productParam = this.parameters.find((el) => el.id === choosenParameter.param.id)

          if (productParam) {
            choosenParameter.param = productParam
          } else {
            choosenParameter.param = {
              name: this.$t('common.noFound'),
              id: choosenParameter.param.id,
            }
          }

          if (choosenParameter.paramValue && Object.prototype.hasOwnProperty.call(choosenParameter.paramValue, 'id')) {
            valuesId.push(choosenParameter.paramValue.id)
          }
        }

        this.selectedValues = await this.$store.dispatch('parameters/getSelectedValues', { valuesId })
      }

      if (this.selectedValues) {
        for (const choosenParameter of choosenParameters) {
          if (choosenParameter.paramValue && Object.prototype.hasOwnProperty.call(choosenParameter.paramValue, 'id')) {
            const paramValue = this.selectedValues.find((el) => el.id === choosenParameter.paramValue.id)

            if (paramValue) {
              for (const propertyValue of paramValue.properties) {
                const choosenValueProperty = choosenParameter.paramValue.properties.find((el) => el.id === propertyValue.id)

                if (choosenValueProperty) {
                  propertyValue.propValue = choosenValueProperty.propValue
                  propertyValue.propValueUuid = choosenValueProperty.propValueUuid

                  if (choosenValueProperty.calculated) {
                    propertyValue.calculated = choosenValueProperty.calculated
                  }
                }
              }

              choosenParameter.paramValue = paramValue
            }
          }
        }

        this.setChoosenParameters({ viewId: this.viewId, choosenParameters })
      }
    },

    confirmPrices() {
      this.setProductPrices({ viewId: this.viewId, prices: this.prices, addinParameters: this.addinParameters })
      this.addObjectProduct({ viewId: this.viewId, currentProduct: this.currentProduct })

      this.setObjectViewProperties({
        viewId: this.viewId,
        props: { currentProduct: null, viewMode: 'order_modification' },
      })
    },

    cancelPrices() {
      this.setObjectViewProperties({
        viewId: this.viewId,
        props: { currentProduct: null, viewMode: 'order_modification' },
      })
    },
  },
}
</script>

<style lang="scss">
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;

    &:hover {
      background: #eee;
    }
  }
}
</style>
