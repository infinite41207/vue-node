<template>
  <div class="d-flex flex-column flex-column-reverse flex-md-row align-items-end">
    <TagsView />

    <div class="px-2 px-md-0 d-flex justify-content-between justify-content-md-end topbar-right-menu">
      <div class="d-flex align-items-center">
        <b-link role="button" class="text-white menu-btn d-inline-block d-md-none mr-1" @click="toggleMenu">
          <i class="ri-menu-3-line" v-if="!this.isToggle"></i>
          <i class="ri-close-line" v-if="this.isToggle"></i>
        </b-link>
        <a href="/" class="logo d-block d-md-none">
          <img :src="logoUrl" alt />
        </a>
      </div>

      <ul class="topbar-right-account-menu align-items-center p-0">
        <b-nav-item-dropdown class="notification-list d-none d-md-flex" right menu-class="dropdown-menu-animated dropdown-lg" toggle-class="nav-link arrow-none">
          <template slot="button-content">
            <i class="ri-notification-3-line icon"></i>
            <span v-if="notificationItems.length > 0" class="noti-icon-badge"></span>
          </template>

          <!-- item-->
          <a href="javascript: void(0);" class="dropdown-item noti-title">
            <h5 class="m-0">
              <!-- <span class="float-right">
                <a href class="text-dark">
                  <small>{{ $t('navbar.clearAll') }}</small>
                </a> </span
              > -->
              Powiadomienia
            </h5>
          </a>
          <simplebar style="max-height: 230px">
            <a v-for="item in notificationItems" :key="item.id" class="dropdown-item notify-item" href="javascript: void(0);" @click="openNotification(item)">
              <div v-if="item.icon" class="notify-icon" :class="`bg-${item.iconColor}`">
                <i :class="`${item.icon}`"></i>
              </div>
              <!-- <div v-if="item.user" class="notify-icon">
                <img :src="`${item.user.name}`" class="img-fluid rounded-circle" alt />
              </div> -->
              <p class="notify-details">{{ item.title }}</p>
              <p class="text-muted mb-0 user-msg">
                <small>{{ item.description }}</small>
              </p>
            </a>
          </simplebar>

          <a href="javascript:void(0);" class="dropdown-item text-center text-primary notify-item notify-all" @click="goToRecievedMessages">
            {{ $t('navbar.checkAll') }}
            <i class="fi-arrow-right"></i>
          </a>
        </b-nav-item-dropdown>

        <li class="d-none d-md-flex">
          <ScreenFull />
        </li>
        <li>
          <a class="nav-link toggle-right" @click="toggleRightSidebar">
            <i class="ri-time-line icon toggle-right"></i>
          </a>
        </li>

        <!-- <b-nav-item-dropdown class="notification-list topbar-dropdown" right toggle-class="arrow-none" menu-class="dropdown-menu-animated topbar-dropdown-menu">
          <template slot="button-content" class="nav-link dropdown-toggle mr-0">
            <img :src="require(`@/assets/images/flags/${currentLanguage.code}.jpg`)" :alt="currentLanguage.name" class="mr-0 mr-sm-1 flag" />
            <i class="ri-arrow-drop-down-line d-none d-sm-inline-block align-middle font-18 ml-1"></i>
          </template>
  
          <template v-for="lang of languages"
            ><a v-if="lang.code !== currentLanguage.code" :key="lang.code" href="#" class="dropdown-item notify-item" @click="changeLanguage(lang)">
              <img :src="require(`@/assets/images/flags/${lang.code}.jpg`)" alt="user-image" class="mr-1 align-middle" height="12" />
              <span class="align-middle">{{ lang.name }}</span>
            </a>
          </template>
        </b-nav-item-dropdown> -->

        <b-nav-item-dropdown class="notification-list" right toggle-class="nav-user arrow-none mr-0" menu-class="dropdown-menu-animated topbar-dropdown-menu profile-dropdown">
          <template slot="button-content">
            <span class="account-user-avatar">
              <img src="@/assets/images/users/user.png" alt="user-image" class="rounded-circle" />
            </span>
            <span class="account-user-name mt-1">{{ user ? user.name : '' }}</span>
          </template>

          <!-- item-->
          <div class="dropdown-header noti-title">
            <h5 class="text-overflow m-0">{{ $t('navbar.hello') }}</h5>
          </div>

          <!-- item-->
          <a href="javascript:void(0);" class="dropdown-item notify-item" @click="logout">
            <i class="ri-logout-box-r-line mr-1"></i>
            <span>{{ $t('navbar.logOut') }}</span>
          </a>
        </b-nav-item-dropdown>
      </ul>
    </div>
  </div>
</template>

<script>
import simplebar from 'simplebar-vue'
import ScreenFull from './screen-full/index'
import Languages from '../dto/Languages.json'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import _ from 'lodash'
import TagsView from './tags-view'
import resetStates from '@/store/service/resetStates'

import { authComputed } from '@/store/helpers'
import { resetRouter } from '@/router'

export default {
  name: 'PageTopbar',

  components: { simplebar, ScreenFull, TagsView },

  props: {
    user: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },

  data() {
    return {
      languages: _.cloneDeep(Languages),
      logoUrl: require('@/assets/images/logo/logo.png'),
      isToggle: false,
    }
  },

  computed: {
    ...mapGetters({
      currentLanguage: 'auth/currentLanguage',
      notificationItems: 'notifications/notificationList',
    }),
    ...authComputed,
  },

  created: async function () {
    this.isToggle = false
    document.body.classList.remove('toggle-side-menu')
  },

  async mounted() {
    await this.$store.dispatch('notifications/getNotifications', { params: { read: false } })
  },

  methods: {
    ...mapMutations({
      setCurrentLanguage: 'auth/setCurrentLanguage',
    }),

    ...mapActions({
      delAllViews: 'tagsViews/delAllViews',
    }),

    goToRecievedMessages() {},

    async openNotification(item) {
      if (item.objectName === 'customer_request' && item.objectId !== null) {
        const response = await this.$store.dispatch('customerRequests/findByPk', {
          params: {
            id: item.objectId,
          },
        })

        if (response.status === 200) {
          await this.$store.dispatch('notifications/updateNotification', {
            params: { id: item.id },
            updateData: {
              read: true,
            },
          })

          this.$router.push({ name: 'CustomerRequest' })
        }
      }
    },

    toggleMenu() {
      // this.$parent.toggleMenu()
      document.body.classList.toggle('toggle-side-menu')
      this.isToggle = !this.isToggle
    },

    async toggleRightSidebar() {
      const objectsList = await this.$store.dispatch('objectsTimeTracking/getCurrentObjects')
      document.body.classList.toggle('right-bar-enabled')
    },

    async logout() {
      await this.$store.dispatch('auth/logOut')
      this.delAllViews()
      resetStates()
      resetRouter()
      this.$router.push({ path: '/' })
    },

    changeLanguage(lang) {
      this.setCurrentLanguage(lang)
      this.$i18n.locale = lang.code
      if (this.$route.path !== '/login') {
        location.reload()
      }
    },
  },
}
</script>
