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
      <b-row class="mt-2">
        <b-col>
          <b-tabs v-model="tabIndex" content-class="mt-2">
            <b-tab :title="$t('common.mainData')" active>
              <b-row class="mt-2">
                <b-col>
                  <b-row>
                    <b-col>
                      <b-form-group horizontal :label-cols="2" :label="$t('table.name')" label-for="item-name">
                        <b-form-input id="item-name" v-model="name" type="text" name="item-name" size="sm"></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-form-group horizontal :label-cols="4" :label="$t('table.code')" label-for="item-code">
                        <b-form-input id="item-code" v-model="code" type="text" name="item-code" size="sm"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <b-col>
                      <b-form-group horizontal :label-cols="3" :label="$t('table.article')" label-for="item-article">
                        <b-form-input id="item-article" v-model="article" type="text" name="item-article" size="sm"></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-form-group horizontal :label-cols="4" :label="$t('table.jOM')" label-for="item-unit-of-measure">
                        <f-select v-model="unitOfMeasure" select-btn value-type="unitsOfMeasure"></f-select>
                      </b-form-group>
                    </b-col>
                    <b-col>
                      <b-form-group horizontal :label-cols="3" :label="$t('table.sortNumberFull')" label-for="item-sort-number">
                        <b-form-input id="item-sort-number" v-model="sortNumber" type="number" name="item-sort-number" size="sm"></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>

                  <b-row>
                    <b-col>
                      <b-form-group horizontal :label-cols="2" :label="$t('table.description')" label-for="item-article">
                        <b-form-textarea id="item-description" v-model="description" :placeholder="$t('common.describeProduct')" rows="6" max-rows="10"></b-form-textarea>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col cols="4">
                  <a href="javascript: void(0);" class="text-center d-block mb-4">
                    <img :src="object.img" class="img-fluid" style="max-width: 380px" alt="Product-img" />
                  </a>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab :title="$t('common.prices')">
              <b-row>
                <b-col>
                  <b-table striped bordered hover :items="object.prices" :fields="priceFields" small>
                    <template v-slot:cell(index)="{ index }">
                      <span>{{ ++index }}</span>
                    </template>
                  </b-table>
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
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'ProductsDetail',

  page() {
    return {
      title: this.$t('common.productData'),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },
  components: { Layout, PageHeader },

  data() {
    return {
      title: this.$t('common.productData'),
      priceFields: [
        { key: 'index', label: this.$t('table.sort') },
        { key: 'date', label: this.$t('table.date') },
        { key: 'priceType', label: this.$t('table.priceType') },
        { key: 'price', label: this.$t('table.price') },
        { key: 'currency', label: this.$t('table.currency') },
      ],

      viewId: this.$route.params.id,
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'products/objectView',
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

    sortNumber: {
      get() {
        return this.objectView ? this.objectView.object.sortNumber : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'sortNumber', value })
      },
    },

    imgUrl: {
      get() {
        return this.objectView ? this.objectView.object.imgUrl : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'imgUrl', value })
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

    article: {
      get() {
        return this.objectView ? this.objectView.object.article : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'article', value })
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

    unitOfMeasure: {
      get() {
        return this.objectView ? this.objectView.object.unitOfMeasure : {}
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'unitOfMeasure', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'unitOfMeasureId', value: value?.id })
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
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'products/setObjectViewProperty',
      setObjectProperty: 'products/setObjectProperty',
      delObjectView: 'products/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async writeObject() {
      let response

      if (this.object.isNew) {
        response = await this.$store.dispatch('products/create', this.object).catch((error) => {
          console.error(error)
        })
      } else {
        response = await this.$store.dispatch('products/update', this.object).catch((error) => {
          console.error(error)
        })
      }

      if (response && response.status === 200) {
        this.closeView()

        this.$bvToast.toast(this.$t('msg.catalogWriteSuccess'), {
          title: this.$t('common.msg'),
          variant: 'success',
          solid: true,
          autoHideDelay: 2000,
        })
      } else {
        this.$bvToast.toast(response.data?.message || this.$t('msg.catalogWriteError'), {
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
      await this.$router.push({ name: 'products' })
    },
  },
}
</script>
