<template>
  <div>
    <b-modal id="select-product-dlg" size="xl" :title="$t('common.selectProductTitle')" hide-footer no-close-on-backdrop>
      <b-row>
        <b-col>
          <b-form-group :label="$t('common.filter')" label-for="filter-input" label-cols-sm="1">
            <b-input-group>
              <b-form-input id="filter-input" v-model="filter" type="search" autofocus :placeholder="$t('common.search')" @input="onChangeFilter"></b-form-input>

              <b-input-group-append>
                <b-button :disabled="!filter" @click="clearFilter">{{ $t('commands.clear') }}</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col>
          <b-table
            ref="selectProductsTable"
            hover
            outlined
            :items="products"
            :fields="productFields"
            selectable
            no-local-sorting
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            select-mode="single"
            class="mb-2"
            small
            :per-page="perPage"
            :current-page="1"
            @row-selected="onRowSelected"
            @sort-changed="onSortingChanged"
          >
            <template v-slot:cell(index)="{ index }">
              <span>{{ ++index }}</span>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button v-b-toggle.selected-products variant="outline-primary">{{ $t('common.selected') }}: {{ selectedProducts.length }}</b-button>
        </b-col>
        <b-col>
          <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right" class="my-0" @change="onChangePage"></b-pagination>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col>
          <b-collapse id="selected-products" class="mt-2">
            <b-table hover outlined :items="selectedProducts" :fields="selProductFields" small>
              <template v-slot:cell(index)="{ index }">
                <span>{{ ++index }}</span>
              </template>
              <template v-slot:cell(actions)="{ index }">
                <a href="javascript:void(0);" class="action-icon ri-delete-bin-7-fill" @click="deleteSelected(index)"> </a>
              </template>
            </b-table>
          </b-collapse>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col>
          <b-button-toolbar class="float-right">
            <b-btn-group>
              <b-button id="b-cancel" class="mr-2" variant="danger" @click="cancelSelection">{{ $t('commands.cancel') }}</b-button>
              <b-button id="b-confirm" variant="primary" @click="confirmSelection">{{ $t('commands.confirmSelected') }}</b-button></b-btn-group
            >
          </b-button-toolbar>
        </b-col>
      </b-row>
    </b-modal>

    <!-- modal message -->
    <b-modal id="input-modal" :title="$t('common.enterQuantity')" no-close-on-backdrop ok-only @ok="handleOkQuantity">
      <b-row align-v="center">
        <b-col>
          <h4>{{ currentProduct.product.name }}</h4>
        </b-col>
      </b-row>
      <b-row class="mt-2" align-v="center">
        <b-col md="2">
          <label for="quantity-input"> {{ $t('table.quantity') }}</label>
        </b-col>
        <b-col>
          <b-form-input id="quantity-input" v-model="currentProduct.quantity" autofocus type="number" />
        </b-col>
        <b-col md="2">
          <h5>{{ currentProduct.product.unitOfMeasureStr }}</h5>
        </b-col>
      </b-row>
      <b-row class="mt-2" align-v="center">
        <b-col>
          <strong>{{ $t('common.addinDimensions') }}</strong>
        </b-col>
      </b-row>
      <b-row class="mt-2" align-v="center">
        <b-col md="4">
          <label for="number-of-pieces-input"> {{ $t('common.numberOfPieces') }}:</label>
        </b-col>
        <b-col>
          <b-form-input id="number-of-pieces-input" v-model="currentProduct.numberOfPieces" type="number" />
        </b-col>
      </b-row>
      <b-row class="mt-2" align-v="center">
        <b-col md="4">
          <label for="length-input">{{ $t('common.lengthWidth') }}:</label>
        </b-col>
        <b-col>
          <b-form-input id="length-input" v-model="currentProduct.length" type="number" />
        </b-col>
      </b-row>
      <b-row class="mt-2" align-v="center">
        <b-col md="4">
          <label for="height-input">{{ $t('common.height') }}:</label>
        </b-col>
        <b-col>
          <b-form-input id="height-input" v-model="currentProduct.height" type="number" />
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import _ from 'lodash'
import moment from 'moment'

export default {
  props: {
    viewId: {
      type: String,
      default: null,
    },

    priceType: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      selectedProducts: [],
      products: [],
      currentProduct: this.initCurrentProduct(),
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      filter: '',
      sortBy: null,
      sortDesc: null,
      productFields: [
        { key: 'index', label: this.$t('table.sort') },
        { key: 'article', label: this.$t('table.article'), sortable: true },
        { key: 'name', label: this.$t('table.name'), sortable: true },
        { key: 'code', label: this.$t('table.code'), sortable: true },
        { key: 'unitOfMeasureStr', label: this.$t('table.jOM') },
      ],
      selProductFields: [
        { key: 'index', label: this.$t('table.sort') },
        { key: 'product.article', label: this.$t('table.article'), sortable: true },
        { key: 'product.name', label: this.$t('table.name'), sortable: true },
        { key: 'description', label: this.$t('table.description') },
        { key: 'unitOfMeasureStr', label: this.$t('table.jOM') },
        { key: 'quantity', label: this.$t('table.quantity') },
        { key: 'price', label: this.$t('table.price') },
        { key: 'actions', label: '' },
      ],
    }
  },

  computed: {},

  async mounted() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      addExtraProductsToObject: 'orders/addExtraProducts',
    }),

    async initialize() {
      await this.updateList()
      this.initCurrentProduct()
    },

    onChangeFilter() {
      this.updateList()
    },

    clearFilter() {
      this.filter = ''
      this.updateList()
    },

    async onSortingChanged(ctx) {
      this.sortBy = ctx.sortBy
      this.sortDesc = ctx.sortDesc

      this.updateList()
    },

    onChangePage(page) {
      this.currentPage = page
      this.updateList()
    },

    async updateList() {
      const filterStr = {
        noCommit: true,
        params: {
          filter: { configProduct: false },
          pagination: { page: this.currentPage, limit: this.perPage },
          sort: { sortBy: this.sortBy, sortDesc: this.sortDesc },
        },
      }

      if (this.filter) {
        filterStr.params.filter.searchStr = this.filter
      }

      let list = []
      let page = this.currentPage
      let total = 0

      await this.$store
        .dispatch('products/findAll', filterStr)
        .then((response) => {
          if (response.status === 200) {
            const result = response.data

            list = result.rows
            total = result.count

            if (total > 0) {
              const pages = Math.ceil(total / this.perPage)
              if (pages < page) {
                page = pages
              }
            } else {
              page = 1
            }
          } else {
            page = 1
          }
        })
        .catch((error) => {
          console.error(error)
          page = 1
        })

      this.products = list
      this.totalRows = total
      this.currentPage = page
    },

    onRowSelected(items) {
      if (items.length > 0) {
        const selectedProduct = _.cloneDeep(items[0])

        const checkRow = this.selectedProducts.find((el) => el.product.id === selectedProduct.id)

        if (!checkRow) {
          this.currentProduct.product = selectedProduct
          this.currentProduct.unitOfMeasureStr = selectedProduct.unitOfMeasureStr
          this.$bvModal.show('input-modal')
        }

        this.$refs.selectProductsTable.clearSelected()
      }
    },

    deleteSelected(index) {
      this.selectedProducts.splice(index, 1)
    },

    handleOkQuantity(bvModalEvt) {
      bvModalEvt.preventDefault()
      this.handleSubmitQuantity()
    },

    async handleSubmitQuantity() {
      const selectedRow = {
        index: -1,
        ...this.currentProduct,
        configProduct: false,
        choosenParameters: [],
        prices: [],
        reference: '',
        discountPercent: '0.00',
        discountSum: '0.00',
        sumNetto: 0,
        sumBrutto: 0,
        vat: 0,
        colour: '',
        deleted: false,
      }

      if (selectedRow.height > 0 || selectedRow.length > 0) {
        if (selectedRow.numberOfPieces === 0) {
          selectedRow.numberOfPieces = 1
        }

        let quantity = selectedRow.numberOfPieces

        if (selectedRow.length > 0) {
          quantity *= selectedRow.length
        }

        if (selectedRow.height > 0) {
          quantity *= selectedRow.height
        }

        selectedRow.quantity = quantity
      }

      this.generateDescription(selectedRow)

      await this.getProductPrice(selectedRow)

      this.selectedProducts.push(selectedRow)

      this.currentProduct = this.initCurrentProduct()

      this.$nextTick(() => {
        this.$bvModal.hide('input-modal')
      })
    },

    generateDescription(selectedRow) {
      if (selectedRow.length === 0 && selectedRow.height === 0) {
        selectedRow.description = ''
        return
      }

      let description = ''
      description += selectedRow.numberOfPieces

      if (selectedRow.length > 0) {
        description += ' x ' + selectedRow.length
      }

      if (selectedRow.height > 0) {
        description += ' x ' + selectedRow.height
      }

      selectedRow.description = description
    },

    async getProductPrice(selectedRow) {
      const today = moment()
      const currentDate = today.toISOString()

      const response = await this.$store.dispatch('products/getPrice', {
        productId: selectedRow.product.id,
        priceType: this.priceType,
        date: currentDate,
      })

      if (response) {
        selectedRow.price = response.price
        selectedRow.sumNetto = (selectedRow.quantity * selectedRow.price).toFixed(2)
        selectedRow.sumBrutto = selectedRow.sumNetto
      }
    },

    async confirmSelection() {
      if (this.selectedProducts.length !== 0) {
        this.addExtraProductsToObject({ viewId: this.viewId, products: this.selectedProducts })
      }

      this.$root.$emit('bv::hide::modal', 'select-product-dlg', '#btnShow')
    },

    cancelSelection() {
      this.$root.$emit('bv::hide::modal', 'select-product-dlg', '#btnShow')
    },

    initCurrentProduct() {
      return {
        product: { name: '' },
        unitOfMeasureStr: '',
        quantity: 1,
        numberOfPieces: 0,
        length: 0,
        height: 0,
      }
    },
  },
}
</script>

<style></style>
