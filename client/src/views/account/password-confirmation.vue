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
          <div class="card-body p-4 text-center">
            <div v-if="isReset">
              <h2>{{ $t('register.enterNewPassword') }}</h2>
              <b-form-group>
                <b-form-input
                  id="password"
                  v-model="password"
                  type="password"
                  name="password"
                  :state="passwordState"
                  :placeholder="$t('login.passwordPh')"
                  aria-describedby="passwordFeedback"
                ></b-form-input>
                <b-form-invalid-feedback id="passwordFeedback">{{ $t('register.enterPasswordLimit') }}</b-form-invalid-feedback>
              </b-form-group>

              <b-form-group>
                <b-form-input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  :state="confirmPasswordState"
                  :placeholder="$t('register.reenterPassword')"
                  aria-describedby="confirmPasswordFeedback"
                ></b-form-input>
                <b-form-invalid-feedback id="confirmPasswordFeedback">{{ $t('register.reenterPasswordError') }}</b-form-invalid-feedback>
              </b-form-group>

              <b-button class="primary-button" @click="resetPasswordClick">{{ $t('commands.resetPassword') }}</b-button>
            </div>
            <div v-else>
              <h2>{{ $t('register.reenterEmail') }}</h2>
              <b-form-group>
                <b-form-input
                  id="email"
                  v-model="email"
                  type="email"
                  name="email"
                  :state="emailState"
                  :placeholder="$t('register.emailPh')"
                  aria-describedby="emailFeedback"
                ></b-form-input>
                <b-form-invalid-feedback id="emailFeedback">
                  <!-- This will only be shown if the preceeding input has an invalid state -->
                  {{ $t('register.enterValidEmail') }}
                </b-form-invalid-feedback>
              </b-form-group>
              <b-button class="primary-button" @click="resetButtonClick">{{ $t('register.resendEmail') }}</b-button>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
    <Message :message="modalMessage" />
  </Layout>
</template>

<script>
import Layout from '@/layouts/default'
import { authMethods } from '@/store/helpers'
import appConfig from '@/app.config'
import axios from 'axios'
import Message from '@/components/common/message'

export default {
  name: 'PasswordConfirmation',

  page: {
    title: 'Reset Password',
    meta: [{ name: 'description', content: `Reset Password to ${appConfig.title}` }],
  },

  components: { Layout, Message },

  props: {
    token: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isReset: false,
      password: '',
      confirmPassword: '',
      email: '',
      logoUrl: require('@/assets/images/logo/logo-green.png'),
      modalMessage: '',
    }
  },

  computed: {
    passwordState() {
      if (this.password.length === 0) return null
      return this.password.length > 6
    },

    confirmPasswordState() {
      if (this.confirmPassword.length === 0) return null
      return this.confirmPassword === this.password
    },

    emailState() {
      if (this.email.length === 0) return null
      return this.validEmail(this.email)
    },
  },

  async created() {
    // When created, first confirm if the link is still valid.
    try {
      const response = await axios.get(`/auth/validate_password_reset_token/${this.token}`)

      if (response.status === 200) {
        this.isReset = true
        this.modalMessage = this.$t('register.canResetPasswordMsg')
      } else {
        this.modalMessage = this.$t('register.resetPasswordLate')
      }
    } catch (err) {
      this.modalMessage = this.$t('register.resetPasswordError')
    }

    this.$nextTick(() => {
      this.$bvModal.show('modal-message')
    })
  },

  methods: {
    ...authMethods,

    validEmail(email) {
      // eslint-disable-next-line
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    async resetButtonClick() {
      if (this.emailState) {
        try {
          const response = await this.resetPassword({
            email: this.email,
          })

          if (response.status === 200) {
            this.modalMessage = 'The email was just sent. Please check your email and follow the instructions.'
          } else {
            this.modalMessage = 'The email could not be sent right now. Please try again later'
          }
        } catch (error) {
          this.modalMessage = 'The email could not be sent right now. Please try again later'
        }

        this.$nextTick(() => {
          this.$bvModal.show('modal-message')
        })
      }
    },
    async resetPasswordClick() {
      if (this.passwordState && this.confirmPasswordState) {
        try {
          const response = await axios.post(`/auth/reset_password`, {
            token: this.token,
            newPassword: this.password,
          })
          if (response.status === 200) {
            this.modalMessage = 'You can now go ahead and login.'
            this.$router.push('/')
          } else {
            this.isReset = false
            this.password = ''
            this.confirmPassword = ''

            this.modalMessage = 'Looks like you are a little too late. Please try resending the email.'
          }
        } catch (err) {
          this.modalMessage = 'There was an error fulfilling your request. Please try resending the reset information.'
        }

        this.$nextTick(() => {
          this.$bvModal.show('modal-message')
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#passwordFeedback,
#confirmPasswordFeedback,
#emailFeedback {
  font-size: 12px;
  text-align: left;
}

h2 {
  margin-bottom: 50px;
}
</style>
