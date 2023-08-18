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
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="2" :content-cols="2" :label="$t('table.code')" label-for="item-code">
            <b-form-input id="item-code" v-model="code" type="text" name="item-code" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="2" :content-cols="2" :label="$t('valueTypes.number')" label-for="item-number">
            <b-form-input id="item-number" v-model="number" type="text" name="item-number" size="sm"></b-form-input>
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
          <b-form-group horizontal :label-cols="2" :content-cols="3" :label="$t('common.length')" label-for="item-length">
            <b-form-input id="item-length" v-model="length" type="number" name="item-length" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="2" :content-cols="3" :label="$t('common.width')" label-for="item-width">
            <b-form-input id="item-width" v-model="width" type="number" name="item-width" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="2" :content-cols="3" :label="$t('ships.imo')" label-for="item-imo">
            <b-form-input id="item-imo" v-model="imo" type="text" name="item-imo" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="2" :label="$t('table.comment')" label-for="item-comment">
            <b-form-textarea id="item-comment" v-model="comment" :placeholder="$t('common.enterComment')" rows="6" max-rows="10"></b-form-textarea>
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

const storeName = 'ships'

export default {
  name: 'ShipsDetail',

  page() {
    return { title: this.$t('common.shipData'), meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: { Layout, PageHeader },

  data() {
    return {
      title: this.$t('common.shipData'),
      viewId: this.$route.params.id,
      readOnly: this.$route.meta.isReadOnly,
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

    number: {
      get() {
        return this.objectView ? this.objectView.object.number : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'number', value })
      },
    },

    length: {
      get() {
        return this.objectView ? this.objectView.object.length : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'length', value })
      },
    },

    width: {
      get() {
        return this.objectView ? this.objectView.object.width : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'width', value })
      },
    },

    imo: {
      get() {
        return this.objectView ? this.objectView.object.imo : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'imo', value })
      },
    },

    comment: {
      get() {
        return this.objectView ? this.objectView.object.comment : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'comment', value })
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
      await this.$router.push({ name: 'ships' })
    },
  },
}
</script>
