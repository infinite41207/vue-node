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
        <b-card>
          <b-card-body>
            <h1 class="text-center">{{ $t('login.logIn') }}</h1>
            <p class="text-center mb-4">{{ $t('login.description') }}</p>
            <b-alert v-model="isAuthError" variant="danger" dismissible>{{ authError }}</b-alert>

            <b-form @submit.prevent="tryToLogIn">
              <b-form-group :label="$t('login.username')" label-for="username">
                <b-form-input id="username" v-model="username" type="text" required :placeholder="$t('login.usernamePh')"></b-form-input>
              </b-form-group>

              <b-form-group class="relative">
                <div class="d-flex justify-content-between mt-2">
                  <label for="password">{{ $t('login.password') }}</label>
                  <router-link to="/forget-password">
                    <strong>{{ $t('login.forgotPassword') }}</strong>
                  </router-link>
                </div>
                <b-form-input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="pr-4"
                  required
                  :placeholder="$t('login.passwordPh')"
                ></b-form-input>
                <a href="javascript:void(0);" class="absolute bottom-5 right-10 text-muted" @click="showPassword = !showPassword">
                  <i v-show="showPassword" class="ri-eye-line"></i>
                  <i v-show="!showPassword" class="ri-eye-close-line"></i>
                </a>
              </b-form-group>

              <b-form-checkbox id="remember" v-model="remember" class="my-3" name="remember">
                {{ $t('login.rememberMe') }}
              </b-form-checkbox>

              <div class="form-group mb-0">
                <b-button type="submit" variant="primary" block>{{ $t('login.logIn') }}</b-button>
              </div>
            </b-form>
          </b-card-body>
          <!-- end card-body -->
        </b-card>
        <!-- end card -->

        <div class="text-center">
          <p>
            <span class="text-muted">{{ $t('login.noHaveAccount') }} </span>
            <router-link tag="a" to="/register">
              <b>{{ $t('login.register') }}</b>
            </router-link>
          </p>
        </div>
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
import { mapGetters, mapMutations } from 'vuex'
import Languages from '@/dto/Languages.json'

/**
 * Login component
 */
export default {
  name: 'UserLogin',
  page: {
    title: 'Log in',
    meta: [{ name: 'description', content: `Log in to ${appConfig.title}` }],
  },
  components: { Layout },
  data() {
    return {
      username: '',
      password: '',
      remember: false,
      showPassword: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
      logoUrl: require('@/assets/images/logo/logo-green.png'),
    }
  },

  computed: {
    ...mapGetters({
      desktopMode: 'app/desktopMode',
      desktopName: 'app/desktopName',
    }),

    placeholders() {
      return process.env.NODE_ENV === 'production'
        ? {}
        : {
            username: 'Use "admin" to log in with the mock API',
            password: 'Use "password" to log in with the mock API',
          }
    },
  },

  methods: {
    ...authMethods,

    ...mapMutations({
      setCurrentLanguage: 'auth/setCurrentLanguage',
    }),

    // Try to log the user in with the username
    // and password they provided.
    async tryToLogIn() {
      this.tryingToLogIn = true

      // Reset the authError if it existed.
      this.authError = null

      await this.logIn({
        username: this.username,
        password: this.password,
        remember: this.remember,
      })
        .then(async (loginResult) => {
          if (loginResult) {
            this.tryingToLogIn = false
            this.isAuthError = false

            if (loginResult.language) {
              const language = Languages.find((el) => el.code === loginResult.language)
              if (language) {
                this.setCurrentLanguage(language)
                this.$i18n.locale = language.code
              }
            }

            await this.$store.dispatch('app/init').catch((error) => {
              console.error(error)
            })

            // Redirect to the originally requested page, or to the home page
            if (this.desktopMode === true && this.desktopName) {
              this.$router.push({
                name: this.desktopName,
              })
            } else {
              this.$router.push(
                this.$route.query.redirectFrom || {
                  path: `./main`,
                }
              )
            }
          }
        })
        .catch((error) => {
          console.error(error)
          this.tryingToLogIn = false
          this.isAuthError = true

          if (error.response && error.response.status === 401) this.authError = this.$t('login.invalidLogin')
          else this.authError = this.$t('login.unexpectedError')
        })
    },
  },
}
</script>

<style lang="scss" module>
</style>
