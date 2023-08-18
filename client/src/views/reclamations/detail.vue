<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import LeftSideBar from './form_components/side_bar.vue'
import MainInfo from './form_components/main_info.vue'
import Possitions from './form_components/possitions.vue'
import Files from './form_components/files.vue'
import History from './form_components/history.vue'
import Delivery from './form_components/delivery.vue'
import Costs from './form_components/costs.vue'
import Emails from './form_components/emails.vue'
import ProductionOrders from './form_components/production_orders.vue'
import Toolbar from './form_components/toolbar.vue'
import PageHeader from '@/components/page-header'

import { mapGetters } from 'vuex'

export default {
  name: 'ReclamationDetail',

  page() {
    return { title: 'Reclamation form', meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: {
    Layout,
    LeftSideBar,
    MainInfo,
    Possitions,
    Files,
    Costs,
    Delivery,
    History,
    Emails,
    ProductionOrders,
    Toolbar,
    PageHeader,
  },
  data() {
    return {
      title: 'Dane reklamacji',
      items: [
        {
          text: this.$t('route.main'),
          href: '/',
        },
        {
          text: this.$t('route.reclamations'),
          href: '/reclamations',
        },
        {
          text: 'Dane reklamacji',
          active: true,
        },
      ],

      selected: '1',
      selectedlg: '1',
      selectedsm: '1',
      checked: true,
      infoTabIndex: 0,

      userSettings: [],

      viewId: this.$route.params.id,
    }
  },

  async created() {
    await this.$store
      .dispatch('userSettings/findAllItems', {
        params: {
          filter: {
            global: true,
          },
        },
      })
      .then((response) => {
        if (response.data.length > 0) {
          for (let i = 0; i < response.data.length; i++) {
            this.userSettings.push({ key: response.data[i].key, value: response.data[i].default })
          }
        }
      })

    console.log(this.userSettings)
  },

  methods: {
    showItem(itemKey) {
      if(this.userSettings.find(el => el.key === itemKey) && this.userSettings.find(el => el.key === itemKey).value === true) {
        return true
      } else {
        return false
      }
    },
  },

  computed: {
    ...mapGetters({
      getObjectView: 'reclamations/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    showPossitions() {
      if (this.infoTabIndex === 0 || this.infoTabIndex === 1) {
        return this.showItem('showPossitions')
      } else {
        return false
      }
    },

    showFiles() {
      if ((this.infoTabIndex === 0 || this.infoTabIndex === 2) && this.object.id !== null) {
        return this.showItem('showFiles')
      } else {
        return false
      }
    },

    showDelivery() {
      if ((this.infoTabIndex === 0 || this.infoTabIndex === 3) && this.object.id !== null) {
        return this.showItem('showDelivery')
      } else {
        return false
      }
    },

    showCosts() {
      if ((this.infoTabIndex === 0 || this.infoTabIndex === 4) && this.object.id !== null) {
        return this.showItem('showCosts')
      } else {
        return false
      }
    },

    showHistory() {
      if ((this.infoTabIndex === 0 || this.infoTabIndex === 5) && this.object.id !== null) {
        return this.showItem('showHistory')
      } else {
        return false
      }
    },

    showEmails() {
      // return true
      if ((this.infoTabIndex === 0 || this.infoTabIndex === 6) && this.object.id !== null) {
        return this.showItem('showEmails')
      } else {
        return false
      }
    },

    showProductionOrders() {
      if ((this.infoTabIndex === 0 || this.infoTabIndex === 7) && this.object.id !== null) {
        return this.showItem('showProductionOrders')
      } else {
        return false
      }
    },

    clientsRestrictions() {
      if (this.$attrs.user) {
        return this.$attrs.user.externalUser
      } else {
        return false
      }
    },

    getPageTitle() {
      if (this.object.number) {
        return 'Reklamacja ' + this.object.number
      } else {
        return 'Dane reklamacji'
      }
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="getPageTitle" :items="items" />

    <b-card>
      <Toolbar :viewId="viewId"></Toolbar>
      <div class="row">
        <div class="col-lg-3 pl-1 pr-2">
          <LeftSideBar :viewId="viewId" :sideBarRestrictions="showItem('sideBarRestrictions')" />
        </div>
        <div class="col-lg-9 pl-1 pr-1">
          <MainInfo :viewId="viewId" :mainInfoRestrictions="showItem('mainInfoRestrictions')" />
          <!-- <b-tabs v-model="infoTabIndex" nav-class="nav-tabs nav-bordered" content-class="mt-3">
          <b-tab active>
            <template v-slot:title>
              <span class="d-inline-block d-sm-none">
                <i class="ri-home-4-fill d-md-none d-block"></i>
              </span>
              <span class="d-none d-sm-inline-block">Pokaż wszystkie</span>
            </template>
          </b-tab>
          <b-tab>
            <template v-slot:title>
              <span class="d-inline-block d-sm-none">
                <i class="ri-user-fill d-md-none d-block"></i>
              </span>
              <span class="d-none d-sm-inline-block">Pozycje</span>
            </template>
          </b-tab>
          <b-tab v-if="openReclamation.id !== null">
            <template v-slot:title>
              <span class="d-inline-block d-sm-none">
                <i class="ri-settings-3-line d-md-none d-block"></i>
              </span>
              <span class="d-none d-sm-inline-block">Pliki</span>
            </template>
          </b-tab>
          <b-tab v-if="newDocumentMode === false">
            <template v-slot:title>
              <span class="d-inline-block d-sm-none">
                <i class="ri-settings-3-line d-md-none d-block"></i>
              </span>
              <span class="d-none d-sm-inline-block">Wysyłka</span>
            </template>
          </b-tab>
          <b-tab v-if="newDocumentMode === false">
            <template v-slot:title>
              <span class="d-inline-block d-sm-none">
                <i class="ri-settings-3-line d-md-none d-block"></i>
              </span>
              <span class="d-none d-sm-inline-block">Koszty</span>
            </template>
          </b-tab>

          <b-tab v-if="newDocumentMode === false">
            <template v-slot:title>
              <span class="d-inline-block d-sm-none">
                <i class="ri-settings-3-line d-md-none d-block"></i>
              </span>
              <span class="d-none d-sm-inline-block">Historia</span>
            </template>
          </b-tab>
          <b-tab v-if="newDocumentMode === false">
            <template v-slot:title>
              <span class="d-inline-block d-sm-none">
                <i class="ri-settings-3-line d-md-none d-block"></i>
              </span>
              <span class="d-none d-sm-inline-block">Wiadomości</span>
            </template>
          </b-tab>
          <b-tab v-if="newDocumentMode === false">
            <template v-slot:title>
              <span class="d-inline-block d-sm-none">
                <i class="ri-settings-3-line d-md-none d-block"></i>
              </span>
              <span class="d-none d-sm-inline-block">Zlecenia produkcyjne</span>
            </template>
          </b-tab>
        </b-tabs> -->
          <div class="row">
            <!-- <b-card-group
          display: flex> -->
            <div class="col-lg-4 pl-2 pr-1">
              <Possitions :viewId="viewId" v-if="showPossitions === true"></Possitions>
            </div>
            <div class="col-lg-4 pl-1 pr-1">
              <ProductionOrders :viewId="viewId" v-if="showProductionOrders === true && !clientsRestrictions"></ProductionOrders>
            </div>
            <div class="col-lg-4 pl-1 pr-2">
              <Files :viewId="viewId" v-if="showFiles === true"></Files>
            </div>
            <!-- </b-card-group> -->
          </div>

          <Delivery v-if="showDelivery === true"></Delivery>
          <Costs v-if="showCosts === true" :viewId="viewId"></Costs>
          <History v-if="showHistory === true" :viewId="viewId"></History>
          <Emails v-if="showEmails === true && !clientsRestrictions"></Emails>
        </div>
      </div>
    </b-card>
  </Layout>
</template>

<style>
.cardStyle {
  padding: 0;
}
</style>
