<template>
  <b-row class="justify-content-md-center">
    <b-col md="8">
      <b-card :title="$t('common.selectProductTitle')">
        <b-card-body>
          <b-row class="mb-3">
            <b-col>
              <b-button variant="danger" class="mr-1 float-right" size="sm" @click="cancelSelection">
                <i class="ri-forbid-line"></i>
                {{ $t('commands.cancel') }}
              </b-button>
            </b-col></b-row
          >
          <b-row>
            <b-col>
              <b-list-group>
                <b-list-group-item v-for="(productData, index) in products" :key="index" href="javascript:void(0);">
                  <b-row>
                    <!-- <b-col md="2">
                      <img :src="productData.product.img" block fluid width="60px" height="60px" />
                    </b-col> -->
                    <b-col>
                      <h4>
                        <strong>{{ productData.product.name }}</strong>
                      </h4>
                    </b-col>
                    <b-col md="3">
                      <b-form-group horizontal :label-cols="5" :label="$t('table.quantity')" label-size="sm" label-for="product_quantity" class="mb-0">
                        <b-form-input id="product_quantity" v-model="productData.quantity" :min="1" type="number" :state="productData.quantity > 0" size="sm"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <b-col md="3">
                      <a href="javascript:void(0);" class="btn btn-success btn-sm" @click="configureProduct(productData)">
                        <i class="ri-file-text-line"></i>
                        {{ $t('commands.configProduct') }}
                      </a>
                    </b-col>
                  </b-row>
                </b-list-group-item>
              </b-list-group>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    viewId: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      products: [],
    }
  },

  computed: {
    ...mapGetters({
      currentLanguage: 'auth/currentLanguage',
    }),
  },

  async mounted() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      setObjectViewProperties: 'orders/setObjectViewProperties',
    }),

    async initialize() {
      await this.getProducts()
    },

    async getProducts() {
      const orderProducts = await this.$store.dispatch('products/getConfigProducts', {
        lang: this.currentLanguage.code,
      })

      if (orderProducts) {
        orderProducts.forEach((el) => {
          this.products.push({
            index: -1,
            product: el,
            quantity: 1,
            choosenParameters: [],
            prices: [],
            reference: '',
            unitOfMeasureStr: el.unitOfMeasureStr,
            unitOfMeasureId: el.unitOfMeasureId,
            configProduct: true,
            numberOfPieces: 0,
            description: '',
            discountPercent: 0,
            discountSum: 0,
            sumNetto: 0,
            sumBrutto: 0,
            vat: 0,
            length: 0,
            height: 0,
            colour: '',
            deleted: false,
            incompliteParams: false,
          })
        })
      }
    },

    cancelSelection() {
      this.setObjectViewProperties({
        viewId: this.viewId,
        props: { viewMode: 'order_modification', currentProduct: null },
      })
    },

    configureProduct(product) {
      if (product.quantity < 1) {
        return
      }

      this.setObjectViewProperties({
        viewId: this.viewId,
        props: { viewMode: 'product_parametrization', currentProduct: product },
      })
    },
  },
}
</script>

<style></style>
