<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col>
        <b-card>
          <b-row class="mb-2">
            <b-col>
              <b-button-toolbar>
                <b-btn-group>
                  <b-button class="ml-2" size="sm" @click="showHideFilters">
                    <i class="ri-filter-line"></i>
                  </b-button>
                </b-btn-group>
              </b-button-toolbar>
            </b-col>
            <b-col>
              <b-form-group :label="$t('common.filter')" label-for="filter-input" label-cols-sm="2">
                <b-input-group>
                  <b-form-input id="filter-input" v-model="searchStr" type="search" autofocus size="sm" :placeholder="$t('common.search')"></b-form-input>

                  <b-input-group-append>
                    <b-button variant="danger" :disabled="!searchStr" size="sm" @click="searchStr = ''">{{ $t('commands.clear') }}</b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-collapse id="list-filters" v-model="visibleFilters">
                <b-row>
                  <b-col>
                    <b-form-group horizontal :label-cols="3" label="Okres" label-for="filter-period">
                      <date-picker v-model="period" range type="date" range-separator="-" format="DD.MM.YYYY" :lang="dateLang" show-week-number size="sm"></date-picker>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group horizontal :label-cols="3" :label="$t('table.pricelistKind')" label-for="filter-pricelist-kind">
                      <b-form-select id="filter-pricelist-kind" v-model="pricelistKind" :options="pricelistKinds" name="filter-pricelist-kind" size="sm">
                        <template v-slot:first>
                          <b-form-select-option :value="null">-- Brak filtru --</b-form-select-option>
                        </template></b-form-select
                      >
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group horizontal :label-cols="3" :label="$t('table.product')" label-for="filter-product">
                      <b-form-select id="filter-product" v-model="product" :options="productList" name="filter-product" text-field="name" value-field="id" size="sm">
                        <template v-slot:first>
                          <b-form-select-option :value="null">-- Brak filtru --</b-form-select-option>
                        </template></b-form-select
                      >
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-collapse>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                ref="itemsList"
                hover
                striped
                class="mb-2"
                small
                selectable
                select-mode="single"
                no-local-sorting
                :items="listView.list"
                :fields="fields"
                :sort-by.sync="listView.sort.sortBy"
                :sort-desc.sync="listView.sort.sortDesc"
                :per-page="listView.limit"
                :current-page="1"
                :tbody-tr-class="rowClass"
                @sort-changed="onSortingChanged"
              >
                <template v-slot:cell(number)="data">
                  <template>
                    <span class="ri-arrow-right-s-line mr-1 text-info" aria-hidden="true"></span>
                  </template>
                  <a href="javascript:void(0);" @click="editObject(data.item.id)"
                    ><span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ data.item.number }}</span>
                  </a>
                </template>
                <template v-slot:cell(pricelistKind)="data">
                  <span>{{ $t(`pricelistKinds.${data.item.pricelistKind}`) }}</span>
                </template>
                <template v-slot:cell(pricingMethod)="data">
                  <span>{{ $t(`pricingMethods.${data.item.pricingMethod}`) }}</span>
                </template>
                <template v-slot:cell(actions)="data">
                  <div class="table-button-container">
                    <a href="javascript:void(0);" class="action-icon ri-edit-box-line text-success" @click="editObject(data.item.id)"> </a>
                    <a href="javascript:void(0);" class="action-icon ml-1 ri-delete-bin-7-fill text-danger" @click="deleteObject(data.item.id)"> </a>
                  </div>
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-pagination v-model="currentPage" :total-rows="listView.total" :per-page="listView.limit" align="right" class="my-0"></b-pagination>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </Layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import DatePicker from 'vue2-datepicker'
import PricelistKinds from '@/constants/pricelistKinds'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/pl'

/**
 * List component
 */
export default {
  name: 'PricelistList',
  page() {
    return {
      title: this.$t(`route.pricelists`),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },
  components: {
    Layout,
    PageHeader,
    DatePicker,
  },
  data() {
    return {
      title: this.$t(`route.pricelists`),
      fields: [
        { key: 'number', label: this.$t('table.number'), sortable: true },
        { key: 'date', label: this.$t('table.createdAt'), sortable: true },
        { key: 'product.name', label: this.$t('table.product'), sortable: true },
        { key: 'priceCode', label: this.$t('table.priceCode'), sortable: true },
        { key: 'description', label: this.$t('table.description'), sortable: false },
        { key: 'pricelistKind', label: this.$t('table.pricelistKind'), sortable: true },
        { key: 'pricingMethod', label: this.$t('table.pricingMethod'), sortable: true },
        { key: 'beginDate', label: this.$t('table.from'), sortable: true },
        { key: 'endDate', label: this.$t('table.to'), sortable: true },
        { key: 'actions', label: this.$t('table.actions') },
      ],
      dateLang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: false,
      },
      namespace: this.$route.meta.store,
      detailPath: this.$route.meta.detailPath,
      visibleFilters: false,
      productList: [],
      pricelistKinds: PricelistKinds.map((el) => {
        return { value: el, text: this.$t(`pricelistKinds.${el}`) }
      }),
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      listView: `pricelists/listView`,
    }),

    currentPage: {
      get() {
        return this.listView.page
      },
      set(value) {
        this.setListViewProperty({ page: value })
        this.updateList()
      },
    },

    searchStr: {
      get() {
        return this.listView.filters.searchStr
      },
      set(value) {
        this.updateFilter({ searchStr: value })
      },
    },

    period: {
      get() {
        return this.listView.filters.period
      },
      set(value) {
        this.updateFilter({ period: value })
      },
    },

    pricelistKind: {
      get() {
        return this.listView.filters.pricelistKind
      },
      set(value) {
        this.updateFilter({ pricelistKind: value })
      },
    },

    product: {
      get() {
        return this.listView.filters.product
      },
      set(value) {
        this.updateFilter({ product: value })
      },
    },
  },

  watch: {
    'listView.list'(newVal, oldVal) {
      this.$refs.itemsList.refresh()
    },
  },

  async created() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      addObjectView: `pricelists/addObjectView`,
      setListViewProperty: `pricelists/setListViewProperty`,
      setFilter: `pricelists/setFilters`,
      setSort: `pricelists/setSort`,
    }),

    async initialize() {
      await this.initProducts()

      await this.updateList()
    },

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

    async onSortingChanged(ctx) {
      this.setSort({ sortBy: ctx.sortBy, sortDesc: ctx.sortDesc })
      this.updateList()
    },

    showHideFilters() {
      this.visibleFilters = !this.visibleFilters
    },

    updateFilter(filter) {
      this.setFilter(filter)
      this.updateList()
    },

    async updateList() {
      const filterStr = {
        params: {
          filter: {},
          pagination: { page: this.currentPage, limit: this.listView.limit },
          sort: { sortBy: this.listView.sort.sortBy, sortDesc: this.listView.sort.sortDesc },
        },
      }

      if (this.searchStr) {
        filterStr.params.filter.searchStr = this.searchStr
      }

      if (this.period.length === 2 && this.period[0] !== null) {
        filterStr.params.filter.period = this.period
      }

      if (this.pricelistKind) {
        filterStr.params.filter.pricelistKind = this.pricelistKind
      }

      if (this.product) {
        filterStr.params.filter.productId = this.product
      }

      await this.$store.dispatch(`${this.namespace}/findAll`, filterStr)
    },

    async editObject(objectId) {
      const response = await this.$store.dispatch(`${this.namespace}/findByPk`, {
        params: {
          id: objectId,
        },
      })
      if (response.status === 200) {
        this.$router.push({ name: this.detailPath, params: { id: objectId } })
      }
    },

    async deleteObject(objectId) {
      if (this.readOnly === true) {
        return
      }
      // to do
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.markedToDelete) return 'table-danger text-danger striped'
    },
  },
}
</script>
