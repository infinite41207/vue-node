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
              <b-button variant="outline-secondary" class="btn-sm ml-2" @click="closeView">
                <i class="ri-close-line"></i>
                {{ $t('commands.close') }}
              </b-button></b-btn-group
            ></b-button-toolbar
          >
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.name')">
            <b-form-input v-model="name" size="sm" class="ml-1"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.key')">
            <b-form-input v-model="key" size="sm" class="ml-1"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.color')">
            <b-form-input v-model="color" type="color" size="sm" class="ml-1"></b-form-input>
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

export default {
  name: 'DispositionStatuseDetail',
  page() {
    return { title: this.$t('route.dispositionStatuses'), meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: { Layout, PageHeader },

  async created() {
    this.initialize()
  },

  data() {
    return {
      title: this.$t('route.dispositionStatuses'),
      viewId: this.$route.params.id,
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'dispositionStatuses/objectView',
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

    key: {
      get() {
        return this.objectView ? this.objectView.object.key : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'key', value })
      },
    },

    color: {
      get() {
        return this.objectView ? this.objectView.object.color : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'color', value })
      },
    },

    lang: {
      get() {
        return this.objectView ? this.objectView.object.lang : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'lang', value })
      },
    },
  },

  methods: {
    ...mapMutations({
      addObjectView: `dispositionStatuses/addObjectView`,
      setObjectViewProperty: 'dispositionStatuses/setObjectViewProperty',
      setObjectProperty: 'dispositionStatuses/setObjectProperty',
      delObjectView: 'dispositionStatuses/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async initialize() {},

    async writeObject() {
      let response
      if (this.object.isNew) {
        response = await this.$store.dispatch('dispositionStatuses/create', this.object)
      } else {
        response = await this.$store.dispatch('dispositionStatuses/update', this.object)
      }

      if (response.status === 200) {
        this.$router.push({ name: 'disposition-statuses-list' })
        this.closeView()
      }
    },

    async closeView() {
      this.$destroy()
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)
      await this.$router.push({ name: 'disposition-statuses' })
    },
  },
}
</script>

<style>
.fixed-w {
  width: 100px;
}

.long-table {
  width: 80vw;
}
</style>
