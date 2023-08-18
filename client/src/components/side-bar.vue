<template>
  <div class="left-side-menu">
    <a href="/" class="logo">
      <img :src="logoUrl" alt />
    </a>
    <div class="sidebar-menu">
      <div class="sidebar-scroll-wrapper">
        <div class="menu-list">
          <div class="menu-item" v-for="(menu, i) in menuItems" v-bind:key="i">
            <router-link :to="menu.href" class="item-link" v-if="!menu.children || menu.children.length <= 0">
              <i :class="menu.icon + ' item-icon'"></i>
              <span class="item-title">
                {{ menu.title }}
              </span>
            </router-link>
            <a href="javascript: void(0);" v-if="menu.children?.length > 0" @click="(e) => handleShowSubmenu(e)" class="item-link">
              <i :class="menu.icon + ' item-icon'"></i>
              <span class="item-title">
                {{ menu.title }}
              </span>
            </a>
            <div v-if="menu.children?.length >= 0" class="child-menu-wrapper">
              <div class="child-menu-header d-flex justify-content-between align-items-center py-3 d-block d-md-none">
                <div class="d-flex text-white align-items-center">
                  <b-link role="button" class="text-white" @click="handleSubmenuClose">
                    <i class="ri-arrow-left-s-line font-28 mr-2"></i>
                  </b-link>
                  <span class="font-18 font-weight-bold">
                    {{ menu.title }}
                  </span>
                </div>
                <b-link role="button" class="text-white" @click="handleSubmenuClose">
                  <i class="ri-close-fill font-22"></i>
                </b-link>
              </div>
              <b-row class="search-group align-items-center">
                <b-col md="10">
                  <div class="input-group">
                    <i class="ri-search-2-line input-group-addon"></i>
                    <input class="form-control" placeholder="Search" @keyup="(e) => handleSearchMenu(e, i)" />
                  </div>
                </b-col>
                <b-col md="2" class="text-md-right d-none d-md-inline-block">
                  <div class="certifi-group">
                    <i class="ri-question-line mr-2"></i>
                    <span>Pomoc</span>
                  </div>
                </b-col>
              </b-row>
              <div class="child-lists">
                <template v-for="(children, i) in menu.children">
                  <router-link class="child-link" :key="i" :to="`${menu.href}/${children.path}`" v-if="!children.meta.isSubsystem">
                    {{ children.meta.title }}
                  </router-link>

                  <div class="child-item-list" :key="i" v-if="children.meta.isSubsystem">
                    <div class="child-title">
                      {{ children.meta.title }}
                    </div>
                    <ul>
                      <li v-for="childItem in getMenuRoutes(children.children)" v-bind:key="childItem.name">
                        <router-link :to="`${menu.href}/${children.path}/${childItem.path}`">
                          {{ childItem.meta.title }}
                        </router-link>
                      </li>
                    </ul>
                    <div>
                      <router-link class="child-link" :to="`${menu.href}`" v-if="children.meta.hasOther">{{ $t('common.showMore') }} ...</router-link>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="bg-transparent toggle-btn border-0" @click="toggleSidebar">
        <i class="ri-arrow-right-s-line text-white"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      logoUrl: require('@/assets/images/logo/logo.png'),
      menuItems: [],
      collapsed: false,
      allMenuItems: [],
      selectedItem: '',
      activeRouter: '',
    }
  },

  computed: {
    ...mapGetters({
      navRoutes: 'app/navRoutes',
    }),
  },

  watch: {
    async navRoutes() {
      await this.updateMenuItems()
    },
  },

  created: async function () {
    await this.updateMenuItems()
    if (document.body.classList.contains('collapsed-side-menu')) {
      this.collapsed = true
    }
    document.body.addEventListener('click', (e) => this.clickOutside(e))
  },

  methods: {
    clickOutside(e) {
      const activeItem = document.querySelector('.menu-item.active')
      if (activeItem && !activeItem.contains(e.target)) {
        activeItem.classList.remove('active')
        this.activeRouter.classList.add('router-link-active')
      }
    },

    handleShowSubmenu(e) {
      if (!this.activeRouter) {
        this.activeRouter = document.querySelector('.router-link-active')
      }
      this.activeRouter.classList.toggle('router-link-active')
      const childLists = e.currentTarget.parentNode
      this.selectedItem = childLists
      const currentActiveItem = document.querySelector('.menu-item.active')

      if (currentActiveItem && currentActiveItem !== this.selectedItem) {
        currentActiveItem.classList.remove('active')
      }

      childLists.classList.toggle('active')
    },

    handleSubmenuClose() {
      this.selectedItem.classList.remove('active')
    },

    toggleSidebar() {
      this.collapsed = !this.collapsed
      document.body.classList.toggle('collapsed-side-menu')
    },

    async updateMenuItems() {
      this.menuItems = []
      this.allMenuItems = []

      this.navRoutes.map((route) => {
        const menuItem = this.makeMenuItem(route)
        this.menuItems.push(menuItem)
        this.allMenuItems.push(menuItem)
      })
    },

    handleSearchMenu(e, i) {
      const newData = {
        href: this.allMenuItems[i].href,
        icon: this.allMenuItems[i].icon,
        name: this.allMenuItems[i].name,
        title: this.allMenuItems[i].title,
        children: this.updateChildren(this.allMenuItems[i].children, e.target.value),
      }

      const newMenuItems = [...this.menuItems.slice(0, i), newData, ...this.menuItems.slice(i + 1)]
      this.menuItems = newMenuItems
    },

    updateChildren(items, typingVal) {
      const newItems = []
      items.map((e) => {
        if (e.meta.isSubsystem) {
          const cchild = {
            meta: e.meta,
            name: e.name,
            path: e.path,
            children: [],
          }
          e.children.map((el) => {
            if (el.meta.title.toLowerCase().indexOf(typingVal) > -1) {
              cchild.children.push(el)
            }
          })
          newItems.push(cchild)
        } else {
          if (e.meta.title.toLowerCase().indexOf(typingVal) > -1) {
            newItems.push(e)
          }
        }
      })

      return newItems
    },

    makeMenuItem(route) {
      return {
        href: route.path,
        title: route.meta.title ? (route.meta.isDynamic ? route.meta.title : this.$t(`route.${route.meta.title}`)) : this.$t(`route.${route.name}`),
        icon: route.meta ? route.meta.icon : '',
        name: route.name,
        children: route.children,
      }
    },

    getMenuRoutes(items) {
      return items.filter((el) => {
        return el.meta.placing !== 'other'
      })
    },
  },
}
</script>
