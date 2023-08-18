<template>
  <Layout>
    <div>
      <title-and-help :title="title" />
      <div class="row g-5">
        <template v-for="(item, key) in optionList">
          <sub-menu v-if="$route.name !== item.name" :key="key" :item="item" />
        </template>
      </div>
    </div>
  </Layout>
</template>

<script>
import SubMenu from './components/sub-menu'
import TitleAndHelp from './components/title-and-help'
import Layout from '@/layouts/main'
import { mapGetters } from 'vuex'

export default {
  name: 'MenuPanel',

  page() {
    return {
      title: this.title,
      meta: [{ name: 'description', content: '' }],
    }
  },

  components: {
    Layout,
    SubMenu,
    TitleAndHelp,
  },

  data() {
    return {
      optionList: [],
      userAccess: [],
      title: '',
    }
  },

  computed: {
    ...mapGetters({
      navRoutes: 'app/navRoutes',
    }),
  },

  created() {
    if (this.$route.meta.isDynamic) {
      this.title = this.$route.meta.title
    } else {
      if (this.$route.meta.title) {
        this.title = this.$tc(`route.${this.$route.meta.title}`)
      } else {
        this.title = this.$tc(`route.${this.$route.name}`)
      }
    }

    if (this.$route.meta.description) {
      this.help = this.$route.meta.description
    }
  },

  async beforeMount() {
    await this.generateRoutesPool()
  },

  methods: {
    async generateRoutesPool() {
      const currentRoute = this.navRoutes.find((el) => el.path === this.$route.path)

      if (currentRoute && currentRoute.children.length) {
        for (const routeItem of currentRoute.children) {
          this.optionList.push({
            name: routeItem.name,
            path: `${this.$route.path}/${routeItem.path}`,
            icon: routeItem.meta.icon,
            title: routeItem.meta.title,
            isDynamic: routeItem.meta.isDynamic,
            isSubsystem: routeItem.meta.isSubsystem,
            meta: routeItem.meta,
            children: routeItem.children,
          })
        }
      }
    },
  },
}
</script>

<style>
.description {
  text-align: center;
  cursor: default;
}
</style>
