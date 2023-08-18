<template>
  <div class="tags-view-component">
    <div ref="scrollWrapper" class="tags-view-container pr-1">
      <div class="d-flex justify-content-between align-items-center pt-1">
        <scroll-pane ref="scrollPane" class="tags-view-wrapper">
          <router-link
            v-for="tag in mainViews"
            ref="tag"
            :key="tag.path"
            :class="isActive(tag) ? 'active' : ''"
            :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
            class="tags-view-item"
            @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
            @contextmenu.prevent.native="openMenu(tag, $event)"
          >
            <span class="d-flex align-items-center">
              {{ getTagTitle(tag) }}
              <i v-if="!isAffix(tag)" class="ri-close-line icon-close" @click.prevent.stop="closeSelectedTag(tag)"></i>
            </span>
          </router-link>
        </scroll-pane>
        <b-dropdown v-if="restOfViews.length > 0" size="sm" variant="link" toggle-class="text-decoration-none" class="tags-view-dropdown mb-md-2" no-caret>
          <template v-slot:button-content>
            <i class="d-md-none d-block ri-menu-line font-24 icon-grey"></i>
            <i class="d-none d-md-block ri-menu-line font-24 text-white"></i>
          </template>
          <b-dropdown-item v-for="tag in restOfViews" :key="tag.path">
            <router-link
              :class="isActive(tag) ? 'active' : ''"
              :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
              class="tags-view-item menu-tags-view-item"
              @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
              @contextmenu.prevent.native="openMenu(tag, $event)"
            >
              <div class="d-flex align-items-center">
                <!-- <i :class="tag.meta.icon" class="mr-1 font-16"></i> -->
                <span class="font-14 flex-grow-1">
                  {{ getTagTitle(tag) }}
                </span>
                <i v-if="!isAffix(tag)" class="ri-close-line icon-close" @click.prevent.stop="closeSelectedTag(tag)"></i>
              </div>
            </router-link>
          </b-dropdown-item>
          <b-dropdown-item @click="closeAllTags"> Close All </b-dropdown-item>
          <!-- <b-dropdown-item>Another action</b-dropdown-item>
          <b-dropdown-item>Something else here...</b-dropdown-item> -->
        </b-dropdown>
        <!-- <b-link role="button" class="icon-grey d-block d-md-none">
          <i class="ri-menu-line font-24"></i>
        </b-link> -->
      </div>
    </div>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">
        {{ $t('tagsView.refresh') }}
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        {{ $t('tagsView.close') }}
      </li>
      <li @click="closeOthersTags">
        {{ $t('tagsView.closeOthers') }}
      </li>
      <li @click="closeAllTags(selectedTag)">
        {{ $t('tagsView.closeAll') }}
      </li>
    </ul>
  </div>
</template>

<script>
import path from 'path'
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import ScrollPane from './scroll-pane.vue'

export default {
  name: 'TagsView',
  components: { ScrollPane },

  data() {
    return {
      mainViews: [],
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      ptotRoutes: [],
      restOfViews: [],
      state: '',
    }
  },

  created: function () {
    this.mainViews = this.visitedViews.filter((el) => el.addMenu === false)
  },

  computed: {
    ...mapGetters({
      visitedViews: 'tagsViews/visitedViewList',
      navRoutes: 'app/navRoutes',
    }),
  },

  watch: {
    $route: {
      handler: 'onRouteChange',
      immediate: true,
      deep: true,
    },

    visible(newValue, oldValue) {
      if (newValue) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    },
  },

  mounted() {
    this.ptotRoutes = _.cloneDeep(this.navRoutes)
    window.addEventListener('resize', this.handleResize)
    this.updateTabs()
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    async fetchData() {
      await this.initTags()
      await this.addTags()
    },

    async updateTabs() {
      const visitedItems = this.visitedViews.filter((el) => el.addMenu === false)
      const currentTab = visitedItems.find((item) => item.path === this.$route.path)
      const currentTabIndex = visitedItems.indexOf(currentTab)
      const padding = 25
      const topRightMenu = window.innerWidth < 768 ? 0 : document.querySelector('.topbar-right-account-menu').clientWidth + padding
      const menuWidth = 35
      const tabContainerWidth = window.innerWidth - topRightMenu
      this.mainViews = this.visitedViews.filter((el) => el.addMenu === false)
      await this.$nextTick()

      const tags = this.$refs.tag
      const mainTags = tags.filter((tag) => {
        const { right } = tag.$el.getBoundingClientRect()
        return right < tabContainerWidth - menuWidth
      })
      let countMainTag = mainTags.length

      const mainViews = visitedItems.slice(0, countMainTag)
      if (!mainViews.includes(currentTab)) {
        const { width: currTabWidth } = tags[currentTabIndex].$el.getBoundingClientRect()

        for (let i = mainTags.length - 1; i >= 0; i--) {
          const { left: lastTabLeft } = mainTags[i].$el.getBoundingClientRect()
          if (currTabWidth > tabContainerWidth - lastTabLeft - menuWidth) {
            countMainTag--
          }
        }

        visitedItems.splice(currentTabIndex, 1)
        visitedItems.splice(countMainTag > 0 ? countMainTag - 1 : 0, 0, currentTab)
        this.updateViews(visitedItems)
      }

      this.mainViews = visitedItems.slice(0, countMainTag)
      this.restOfViews = visitedItems.slice(countMainTag)
    },

    handleResize() {
      this.updateTabs()
    },

    ...mapActions({
      addView: 'tagsViews/addView',
      addVisitedView: 'tagsViews/addVisitedView',
      updateVisitedView: 'tagsViews/updateVisitedView',
      delCachedView: 'tagsViews/delCachedView',
      delOthersViews: 'tagsViews/delOthersViews',
      delView: 'tagsViews/delView',
      delAllViews: 'tagsViews/delAllViews',
      updateViews: 'tagsViews/updateViews',
    }),

    isActive(route) {
      return route.path === this.$route.path
    },

    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },

    filterAffixTags(routes, basePath = '/') {
      let tags = []

      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta },
            addMenu: false,
          })
        }
        if (route.children) {
          const childTags = this.filterAffixTags(route.children, route.path)
          if (childTags.length >= 1) {
            tags = [...tags, ...childTags]
          }
        }
      })
      return tags
    },

    async initTags() {
      this.affixTags = this.filterAffixTags(this.ptotRoutes)
      for (const tag of this.affixTags) {
        // Must have tag name
        if (tag.name) {
          // await this.addVisitedView(tag)
        }
      }
    },

    async addTags() {
      const { name } = this.$route
      if (name) {
        const viewId = this.$route.params.id ? this.$route.params.id : this.$route.params.reportType ? this.$route.params.reportType : null
        let presentation = null
        if (this.$route.meta) {
          if (this.$route.meta.presentation && this.$route.meta.store) {
            presentation = this.$store.getters[`${this.$route.meta.store}/presentation`](viewId)
          }
        }

        const newTag = {
          viewId,
          fullPath: this.$route.path,
          path: this.$route.path,
          name: this.$route.name,
          presentation,
          meta: { ...this.$route.meta },
          addMenu: this.visitedViews.length > 100,
        }

        await this.addView(newTag)
      }
      return false
    },

    refreshSelectedTag(view) {
      this.delCachedView(view)
      const { fullPath } = view
      this.$nextTick(() => {
        this.$router
          .replace({
            path: '/redirect' + fullPath,
          })
          .catch((err) => {
            console.warn(err)
          })
      })
    },

    closeSelectedTag(view) {
      this.delView(view)

      if (view.meta.store && view.meta.store !== '' && view.viewId !== null) {
        this.$store.commit(`${view.meta.store}/delObjectView`, view.viewId)
      }

      if (this.isActive(view)) {
        this.toLastView(this.visitedViews, view)
      }

      if (view.fullPath !== this.$route.path && !this.restOfViews.includes(view)) {
        this.updateTabs()
        return
      }
      //*when remove current visited tab, component will be mounted so don't need to call updateTabs();

      const filteredRests = this.restOfViews.filter((rest) => rest !== view)
      this.restOfViews = filteredRests
    },

    closeOthersTags() {
      if (this.selectedTag.fullPath !== this.$route.path && this.selectedTag.fullPath !== undefined) {
        this.$router.push(this.selectedTag.fullPath).catch((err) => {
          console.warn(err)
        })
      }
      this.delOthersViews(this.selectedTag)
    },

    closeAllTags(view) {
      this.delAllViews()
      if (this.affixTags.some((tag) => tag.path === this.$route.path)) {
        return
      }
      this.toLastView(this.visitedViews, view)
    },

    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView !== undefined && latestView.fullPath !== undefined) {
        try {
          this.$router.push(latestView.fullPath)
        } catch (error) {
          console.warn(error)
        }
      } else {
        // Default redirect to the home page if there is no tags-view, adjust it if you want
        if (view.name === 'main') {
          // to reload home page
          try {
            this.$router.replace({ path: '/redirect' + view.fullPath })
          } catch (error) {
            console.warn(error)
          }
        } else {
          try {
            this.$router.push('/')
          } catch (error) {
            console.warn(error)
          }
        }
      }
    },

    getTagTitle(tag) {
      if (tag.presentation) {
        return tag.presentation
      }

      if (tag.meta && tag.meta.isDynamic) {
        return tag.title
      }

      return this.$tc('route.' + tag.title)
    },

    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary

      const left = e.clientX + 15 - this.$el.getBoundingClientRect().left // 15: margin right
      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY + 14
      this.visible = true
      this.selectedTag = tag
    },

    closeMenu() {
      this.visible = false
    },

    onRouteChange(to) {
      this.addTags()
    },
  },
}
</script>

<style></style>
