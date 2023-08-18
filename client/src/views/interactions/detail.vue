<template>
  <Layout>
    <PageHeader :title="title" />
    <div v-if="editMode === 'NEW'">
      <NewItem />
    </div>
    <div v-else>
      <b-row>
        <b-col cols="12" lg="3">
          <LeftSideBar />
        </b-col>
        <b-col cols="12" lg="9">
          <MainInfo />
        </b-col>
      </b-row>
    </div>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import LeftSideBar from './form-components/side-bar.vue'
import MainInfo from './form-components/main-info.vue'
import NewItem from './form-components/new-item.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'InteractionDetail',

  page() {
    return {
      title: this.$t('route.interaction'),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },

  components: {
    Layout,
    PageHeader,
    LeftSideBar,
    MainInfo,
    NewItem,
  },

  data() {
    return {
      title: this.$t('interaction.new'),
      viewId: this.$route.params.id,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'interactions/objectView',
      currentLanguage: 'auth/currentLanguage',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    editMode() {
      return this.objectView ? this.objectView.editMode : 'NEW'
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },
  },

  async mounted() {
    if (this.$route.query.load) {
      const response = await this.$store.dispatch('interactions/findByPk', {
        params: {
          id: this.viewId,
        },
      })
    }

    if (this.editMode != 'NEW') {
      this.title = this.$t('interaction.edit') + ' ' + this.object.numberStr
    }
  },
}
</script>
