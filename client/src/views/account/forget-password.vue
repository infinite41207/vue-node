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
            <h1 class="text-center">Odnowienie hasła</h1>
            <p class="text-center mb-4">Wprowadż swój email, wyślemy do ciebie dokładną instrukcję jak zresetować hasło.</p>

            <b-alert v-model="isResetError" variant="danger" dismissible>{{ error }}</b-alert>
            <b-alert v-model="isSuccess" variant="success" dismissible>{{ successMessage }}</b-alert>

            <b-form @submit.prevent="tryToReset">
              <b-form-group id="email-group" :label="$t('register.email')" label-for="email">
                <b-form-input id="email" v-model="email" type="email" required :state="emailState" :placeholder="$t('register.emailPh')"></b-form-input>
              </b-form-group>

              <div class="form-group mb-0 text-center">
                <b-button type="submit" variant="primary">{{ $t('commands.resetPassword') }}</b-button>
              </div>
            </b-form>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->

        <div class="row mt-3">
          <div class="col-12 text-center">
            <p class="text-muted">
              Wróć do
              <router-link tag="a" to="/login" class="text-muted ml-1">
                <b>Strony logowania</b>
              </router-link>
            </p>
          </div>
          <!-- end col -->
        </div>
        <!-- end row -->
      </b-col>
      <!-- end col -->
    </b-row>
    <!-- end row -->
  </Layout>
</template>

<script>
import Layout from '@/layouts/default'
import { authMethods } from '@/store/helpers'
import appConfig from '@/app.config'

export default {
  name: 'FogetPassword',
  page: {
    title: 'Forget Password',
    meta: [{ name: 'description', content: `Forget Password to ${appConfig.title}` }],
  },

  components: { Layout },

  data() {
    return {
      email: '',
      error: null,
      tryingToReset: false,
      isResetError: false,
      isSuccess: false,
      successMessage: null,
      logoUrl: require('@/assets/images/logo/logo-green.png'),
    }
  },
  computed: {
    emailState() {
      if (this.email.length === 0) return null
      return this.validEmail(this.email)
    },
  },

  methods: {
    ...authMethods,

    validEmail(email) {
      // eslint-disable-next-line
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },

    // Try to register the user in with the email, fullname
    // and password they provided.
    tryToReset() {
      this.tryingToReset = true
      // Reset the authError if it existed.
      this.error = null
      return this.resetPassword({
        email: this.email,
      })
        .then((response) => {
          this.tryingToReset = false

          if (response.status === 200) {
            this.isResetError = false
            this.isSuccess = true
            this.successMessage = this.$t('register.passwordLinkSent')
          } else {
            this.isResetError = true
            this.isSuccess = false
            this.error = response.data.message
          }
        })
        .catch((error) => {
          this.tryingToReset = false
          this.error = error ? error.response.data.message : ''
          this.isResetError = true
          this.isSuccess = false
        })
    },
  },
}
</script>

<style lang="scss" module></style>
