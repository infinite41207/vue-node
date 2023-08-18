<template>
  <Layout>
    <b-row class="mt-2">
      <b-col cols="12" lg="3">
        <LeftSideBar />
      </b-col>
      <b-col cols="12" lg="9">
        <MainInfo />
      </b-col>
    </b-row>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import LeftSideBar from './form-components/side-bar.vue'
import MainInfo from './form-components/main-info.vue'
import { mapGetters } from 'vuex'


export default {
  name: 'CRDetail',
  data() {
    return {
      title: this.$t('interaction.new'),
      viewId: this.$route.params.id,
    }
  },  
  page() {
    return {
      title: 'Zapytanie oferty',
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },
  
  computed: {
    ...mapGetters({
      getObjectView: 'customerRequests/objectView',
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

  components: {
    Layout,
    LeftSideBar,
    MainInfo,
  },
}
</script>
