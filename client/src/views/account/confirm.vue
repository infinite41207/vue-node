<template>
  <Layout>
    <!-- Logo -->
    <div class="auth-logo">
      <router-link to="/">
        <span>
          <img :src="logoUrl" alt height="24" />
        </span>
      </router-link>
    </div>
    <b-row class="justify-content-center">
      <b-col col xl="6">
        <div class="card">
          <div class="card-body">
            <div class="mt-3 text-center">
              <h3>{{ $t('register.confirm') }}</h3>
              <p class="text-muted mt-2">
                {{ $t('register.sendTo') }}
                <span class="font-weight-medium"> {{ this.$route.query.email }}</span
                >. {{ $t('register.emailCheck') }}
              </p>

              <router-link tag="a" to="/login" class="btn btn-block btn-primary waves-effect waves-light mt-3">
                {{ $t('register.backHome') }}
              </router-link>
            </div>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->
      </b-col>
      <!-- end col -->
    </b-row>
  </Layout>
</template>

<script>
import Layout from '@/layouts/default'
import { authMethods } from '@/store/helpers'
import appConfig from '@/app.config'
export default {
  name: 'AccountConfirm',
  page: {
    title: 'Confirm',
    meta: [{ name: 'description', content: `Confirm account to ${appConfig.title}` }],
  },
  components: { Layout },
  data() {
    return {
      logoUrl: require('@/assets/images/logo/logo-green.png'),
    }
  },
  computed: {},
  methods: {
    ...authMethods,
  },
}
</script>

<style lang="scss" module></style>
