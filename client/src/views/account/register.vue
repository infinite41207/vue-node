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
            <h1 class="text-center">{{ $t('register.title') }}</h1>
            <p class="text-center mb-4">{{ $t('register.titleDescription') }}</p>
            <b-alert v-model="isRegisterError" variant="danger" dismissible>{{ regError }}</b-alert>

            <b-form @submit.prevent="tryToRegisterIn">
              <b-form-group id="fullname-group" :label="$t('register.firstLastName')" label-for="fullname">
                <b-form-input
                  id="fullname"
                  v-model="fullname"
                  type="text"
                  required
                  :state="fullnameState"
                  :placeholder="$t('register.enterDetailsPh')"
                  @change="onChangeFullname"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="login-group" :label="$t('register.login')" label-for="login">
                <b-form-input id="login" v-model="login" type="text" required autocomplete="false" :state="loginState" :placeholder="$t('register.loginPh')"></b-form-input>
              </b-form-group>

              <b-form-group id="email-group" :label="$t('register.email')" label-for="email">
                <b-form-input id="email" v-model="email" type="email" required :state="emailState" :placeholder="$t('register.emailPh')"></b-form-input>
              </b-form-group>

              <b-form-group id="password-group" :label="$t('login.password')" label-for="password">
                <b-form-input id="password" v-model="password" type="password" required :state="passwordState" :placeholder="$t('login.passwordPh')"></b-form-input>
              </b-form-group>
              <div class="form-group">
                <div class="custom-control custom-checkbox">
                  <input id="checkbox-signup" type="checkbox" class="custom-control-input" />
                  <label class="custom-control-label" for="checkbox-signup">
                    {{ $t('commands.accept') }}
                    <a href="javascript:void(0);" class="text-muted">{{ $t('register.terms') }}</a>
                  </label>
                </div>
              </div>

              <div class="form-group mb-0 text-center">
                <b-button type="submit" variant="primary">{{ $t('register.register') }}</b-button>
              </div>
            </b-form>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->

        <b-row class="mt-3">
          <b-col cols="12" class="text-center">
            <p class="text-muted">
              {{ $t('register.haveAccount') }}
              <router-link tag="a" to="/login" class="text-muted ml-1">
                <b>{{ $t('login.logIn') }}</b>
              </router-link>
            </p>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </Layout>
</template>

<script>
import Layout from '@/layouts/default'
import { authMethods } from '@/store/helpers'
import appConfig from '@/app.config'

export default {
  name: 'RegisterUser',
  page: {
    title: 'Register',
    meta: [{ name: 'description', content: `Register to ${appConfig.title}` }],
  },
  components: { Layout },
  data() {
    return {
      fullname: '',
      login: '',
      email: '',
      password: '',
      regError: null,
      tryingToRegister: false,
      isRegisterError: false,
      logoUrl: require('@/assets/images/logo/logo-green.png'),
    }
  },
  computed: {
    fullnameState() {
      return this.fullname !== ''
    },
    loginState() {
      return this.login !== ''
    },
    emailState() {
      if (this.email.length === 0) return null
      return this.validEmail(this.email)
    },
    passwordState() {
      return this.password !== ''
    },
  },
  methods: {
    ...authMethods,

    validEmail(email) {
      // eslint-disable-next-line
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },

    onChangeFullname() {
      this.login = this.fullname.toLowerCase().replace(' ', '.')
    },

    // Try to register the user in with the email, fullname
    // and password they provided.
    tryToRegisterIn() {
      // Reset the regError if it existed.
      this.regError = null
      this.isRegisterError = false

      if (!this.fullnameState || !this.loginState || !this.emailState || !this.passwordState) {
        this.regError = this.$t('register.notFilledAllFilds')
        this.isRegisterError = true
        return
      }

      this.tryingToRegister = true

      return this.register({
        name: this.fullname,
        login: this.login,
        email: this.email,
        password: this.password,
      })
        .then((response) => {
          this.tryingToRegister = false
          this.isRegisterError = false

          if (response.status === 200) {
            // Redirect to the originally requested page, or to the confirm-account page
            this.$router.push(this.$route.query.redirectFrom || { name: 'confirm-account', query: { email: this.email } })
          } else {
            this.regError = response.data.message !== undefined ? response.data.message : this.$t('login.unexpectedError')
            this.isRegisterError = true
          }
        })
        .catch((error) => {
          this.tryingToRegister = false
          this.regError = error.response && error.response.data.message !== undefined ? error.response.data.message : this.$t('login.unexpectedError')
          this.isRegisterError = true
        })
    },
  },
}
</script>

<style lang="scss" module></style>
