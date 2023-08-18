<template>
  <Layout>
    <PageHeader :title="title" />
    <generate-form insite="true" @on-change="handleDataChange" :data="viewData" :value="object" ref="generateForm">
      <template v-slot:blank="scope">
        Width <b-input v-model="scope.model.blank.width" style="width: 100px"></b-input> Height <b-input v-model="scope.model.blank.height" style="width: 100px"></b-input>
      </template>
    </generate-form>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import GenerateForm from '@/components/form-builder/GenerateForm.vue'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters } from 'vuex'

export default {
  name: 'DynamicView',

  page() {
    return { title: this.title, meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: {
    Layout,
    PageHeader,
    GenerateForm,
  },

  data() {
    return {
      title: this.$route.meta.title,
      viewData: {},
      object: {},
      viewId: this.$route.meta.viewId,
      viewModel: this.$route.meta.model,
    }
  },

  computed: {
    ...mapGetters({
      getListView: `dynamicViews/listView`,
    }),

    listView() {
      return this.getListView(this.viewId)
    },
  },

  async created() {
    if (this.viewId) {
      await this.initViewData()
    }
  },

  async mounted() {
    this.$store.dispatch('dynamicViews/findAll', { model: this.viewModel, viewId: this.viewId }).catch((error) => {
      console.error(error)
    })
  },

  methods: {
    handleDataChange() {
      console.log('handleDataChange')
    },

    async initViewData() {
      this.$store
        .dispatch('viewSettings/findByPk', { noCommit: true, params: { id: this.viewId } })
        .then(async (response) => {
          if (response.status === 200) {
            this.viewData = JSON.parse(response.data.template)

            this.object = { input: { name: 'test' } }

            // if (this.viewData) {
            //   await this.$store.dispatch('dynamicViews/initialize', {
            //     params: {
            //       sourceCode: this.viewData.formDataSource,
            //     },
            //   })
            // }
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
  },
}
</script>

<style>
</style>