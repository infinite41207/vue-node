<template>
  <div class="wrapper">
    <side-bar v-if="!desktopMode || currentUser.fullRights" />
    <div class="content-page">
      <div class="content">
        <div v-if="!desktopMode || currentUser.fullRights" class="navbar-custom">
          <topbar :user="user" />
        </div>
        <div class="container-fluid">
          <slot />
        </div>
      </div>
      <footer-vue />
    </div>
    <right-sidebar />
  </div>
</template>

<script>
import Topbar from '@/components/topbar'
import SideBar from '@/components/side-bar'
import RightSidebar from '@/components/right-sidebar'
import FooterVue from '@/components/footer'
import { mapGetters } from 'vuex'

export default {
  name: 'MainLayout',

  components: { Topbar, SideBar, RightSidebar, FooterVue },

  data() {
    return {
      user: this.$store ? this.$store.state.auth.currentUser : {} || {},
      elem: document.documentElement,
    }
  },

  computed: {
    ...mapGetters({
      desktopMode: 'app/desktopMode',
      currentUser: 'auth/currentUser',
    }),
  },

  watch: {
    desktopMode() {
      this.updateDesktopMode()
    },

    currentUser() {
      this.updateDesktopMode()
    },
  },

  mounted() {
    this.updateDesktopMode()
  },

  methods: {
    updateDesktopMode() {
      if (this.desktopMode === true && this.currentUser?.fullRights !== true) {
        document.body.classList.add('desktop-mode')
      } else {
        document.body.classList.remove('desktop-mode')
      }
    },
  },
}
</script>

<style scoped>
.container-fluid {
  padding-right: 0px;
  padding-left: 0px;
}
</style>