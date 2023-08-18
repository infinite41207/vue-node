<template>
  <Layout>
    <PageHeader :title="title" />
    <b-card>
      <b-row class="mb-3">
        <b-col>
          <b-button-toolbar>
            <b-btn-group>
              <b-button variant="success" class="btn-sm" @click="writeObject">
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
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="2" :content-cols="2" :label="$t('table.code')" label-for="item-code">
            <b-form-input id="item-code" v-model="code" type="text" name="item-code" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="2" :content-cols="3" :label="$t('table.name')" label-for="item-name">
            <b-form-input id="item-name" v-model="name" type="text" name="item-name" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="2" :content-cols="3" :label="$t('table.alphaCode2')" label-for="item-alphaCode2">
            <b-form-input id="item-alphaCode2" v-model="alphaCode2" name="item-alphaCode2" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="2" :content-cols="3" :label="$t('table.alphaCode3')" label-for="item-alphaCode3">
            <b-form-input id="item-alphaCode3" v-model="alphaCode3" name="item-alphaCode3" size="sm"></b-form-input>
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

const storeName = 'countries'

export default {
  name: 'CountryDetail',

  page() {
    return { title: this.$t('table.country'), meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: { Layout, PageHeader },

  data() {
    return {
      title: this.$t('table.country'),
      viewId: this.$route.params.id,
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

    id: {
      get() {
        return this.objectView ? this.objectView.object.id : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'id', value })
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

    code: {
      get() {
        return this.objectView ? this.objectView.object.code : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'code', value })
      },
    },

    alphaCode2: {
      get() {
        return this.objectView ? this.objectView.object.alphaCode2 : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'alphaCode2', value })
      },
    },

    alphaCode3: {
      get() {
        return this.objectView ? this.objectView.object.alphaCode3 : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'alphaCode3', value })
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
      await this.$router.push({ name: 'countries' })
    },
  },
}
</script>
