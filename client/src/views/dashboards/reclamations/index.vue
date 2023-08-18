<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import ClientSettlements from './client_settlements'
import SattlementsStats from './sattlements_stats'

export default {
  name: 'DashboardReclamations',

  page: {
    title: 'Dane reklamacyjne',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    SattlementsStats,
    ClientSettlements,
  },
  data() {
    return {
      state: {
        date: new Date(),
      },
    }
  },
}
</script>

<template>
  <Layout>
    <div class="row">
      <div class="col-12">
        <div class="page-title-box">
          <h4 class="page-title">Reklamacje</h4>
        </div>
      </div>
    </div>
    <div>
      <SattlementsStats />
    </div>

    <div class="row">
      <div class="col-xl-12 col-lg-12">
        <ClientSettlements />
      </div>
    </div>
  </Layout>
</template>
