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
            <div v-if="value" class="mt-3 text-center">
              <h3><i class="mr-2 ri-checkbox-circle-fill text-success"></i> {{ $t('register.emailConfirmed') }}.</h3>
            </div>
            <div v-else-if="value === false">
              <h4 class="mt-3"><i class="mr-2 ri-close-circle-line text-danger"></i>{{ $t('register.emailNotConfirmed') }}.</h4>
              <br />
              <div>
                <b-form-group>
                  <b-form-input
                    id="email"
                    v-model="email"
                    type="email"
                    name="email"
                    :state="emailState"
                    :placeholder="$t('register.resendYourEmail')"
                    aria-describedby="emailFeedback"
                  ></b-form-input>
                  <b-form-invalid-feedback id="emailFeedback" style="font-size: 12px; text-align: left">
                    <!-- This will only be shown if the preceeding input has an invalid state -->
                    {{ $t('register.enterValidEmail') }}
                  </b-form-invalid-feedback>
                </b-form-group>

                <div class="form-group mb-0 text-center">
                  <b-button variant="primary" @click="resendEmail">
                    <i class="ri-arrow-right-s-line"></i>
                    {{ $t('commands.resend') }}
                  </b-button>
                </div>
              </div>
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
import axios from 'axios'
import Message from '@/components/common/message'

export default {
  name: 'EmailConfirmation',
  page: {
    title: 'Email confirmation',
    meta: [{ name: 'description', content: `Confirm email` }],
  },
  components: { Layout, Message },
  props: {
    token: {
      type: String,
      required: true,
      default: '',
    },
  },

  data() {
    return {
      logoUrl: require('@/assets/images/logo/logo-green.png'),
      value: null,
      resendHit: false,
      email: '',
      modalMessage: '',
    }
  },

  computed: {
    emailState() {
      if (this.email.length === 0) return null
      return this.validEmail(this.email)
    },
  },

  async created() {
    if (this.token) {
      try {
        const response = await axios.get(`/auth/confirm_email_address/${this.token}`)

        if (response.status === 200) {
          this.value = true
        } else {
          this.value = false
        }
      } catch (error) {
        console.error('There was an error', error)
        this.value = false
      }
    }
  },

  methods: {
    validEmail(email) {
      // eslint-disable-next-line
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },

    async resendEmail() {
      if (this.emailState) {
        try {
          const response = await axios.get(`/auth/resend_email_address_confirmation_link?email=` + this.email)

          if (response.status === 200) {
            this.modalMessage = this.$t('register.emailSent')
          } else {
            this.modalMessage = this.$t('register.emailSentError')
          }
        } catch (err) {
          this.modalMessage = this.$t('register.emailSentError')
        }

        this.$bvModal.show('modal-message')
      }
    },
  },
}
</script>

<style lang="scss"></style>
