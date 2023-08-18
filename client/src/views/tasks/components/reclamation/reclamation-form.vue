<template>
  <div>
    <p></p>
    <Toolbar></Toolbar>

    <b-tabs v-model="infoTabIndex" nav-class="nav-tabs nav-bordered" content-class="mt-3">
      <b-tab active>
        <template v-slot:title>
          <span class="d-inline-block d-sm-none">
            <i class="ri-home-4-fill d-md-none d-block"></i>
          </span>
          <span class="d-none d-sm-inline-block">Podstawowe dane</span>
        </template>
        <LeftSideBar></LeftSideBar>
        <MainInfo></MainInfo>
      </b-tab>
      <b-tab v-if="stageId !== 9">
        <template v-slot:title>
          <span class="d-inline-block d-sm-none">
            <i class="ri-user-fill d-md-none d-block"></i>
          </span>
          <span class="d-none d-sm-inline-block">Pozycje</span>
        </template>
        <Possitions></Possitions>
      </b-tab>
      <b-tab v-if="stageId !== 9">
        <template v-slot:title>
          <span class="d-inline-block d-sm-none">
            <i class="ri-settings-3-line d-md-none d-block"></i>
          </span>
          <span class="d-none d-sm-inline-block">Pliki</span>
        </template>
        <Files></Files>
      </b-tab>
      <b-tab v-if="stageId !== 9">
        <template v-slot:title>
          <span class="d-inline-block d-sm-none">
            <i class="ri-settings-3-line d-md-none d-block"></i>
          </span>
          <span class="d-none d-sm-inline-block">Wiadomości</span>
        </template>
        <Emails></Emails>
      </b-tab>

      <b-tab>
        <template v-slot:title>
          <span class="d-inline-block d-sm-none">
            <i class="ri-settings-3-line d-md-none d-block"></i>
          </span>
          <span class="d-none d-sm-inline-block">Wysyłka</span>
        </template>
        <Delivery :stageId="stageId"></Delivery>
      </b-tab>
      <!-- <b-tab >
            <template v-slot:title>
              <span class="d-inline-block d-sm-none">
                <i class="ri-settings-3-line d-md-none d-block"></i>
              </span>
              <span class="d-none d-sm-inline-block">Koszty</span>
            </template>
          </b-tab> -->

      <b-tab v-if="stageId !== 9">
        <template v-slot:title>
          <span class="d-inline-block d-sm-none">
            <i class="ri-settings-3-line d-md-none d-block"></i>
          </span>
          <span class="d-none d-sm-inline-block">Zlecenia produkcyjne</span>
        </template>
        <ProductionOrders></ProductionOrders>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import appConfig from '@/app.config'
import LeftSideBar from './side_bar.vue'
import MainInfo from './main_info.vue'
import Possitions from './possitions.vue'
import Files from './files.vue'
import Delivery from './delivery.vue'
import Emails from './emails.vue'
import ProductionOrders from './production_orders.vue'
import Toolbar from './toolbar.vue'

import { mapGetters } from 'vuex'

export default {
  name: 'TaskReclamationForm',

  page: {
    title: 'Reclamation form',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  props: {
    stageId: {
      type: Number,
      default: 0,
    },
  },
  components: {
    LeftSideBar,
    MainInfo,
    Possitions,
    Files,
    Delivery,
    ProductionOrders,
    Toolbar,
    Emails,
  },

  data() {
    return {
      selected: '1',
      selectedlg: '1',
      selectedsm: '1',
      checked: true,
      infoTabIndex: 0,
    }
  },

  computed: {
    ...mapGetters({
      openReclamation: 'reclamations/openReclamation',
      newDocumentMode: 'reclamations/newDocumentMode',
    }),
  },
}
</script>
