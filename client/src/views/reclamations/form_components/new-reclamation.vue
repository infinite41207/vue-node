<template>
  <div>
    <b-modal
      id="cr-new-item"
      size="xl"
      :title="`${$t('reclamation.new')}!`"
      :cancel-title="$t('commands.cancel')"
      no-close-on-backdrop
      :ok-title="`${$t('commands.write')}`"
      @ok="handleOk"
      @cancel="handleCancel"
      @close="handelClose"
    >
      <b-card>
        <b-row>
          <b-col md="6">
            <b-form-group horizontal :label-cols="3" :label="$t('table.customer')" label-for="request-customer">
              <b-input-group class="mb-2">
                <b-form-select
                  id="request-customer"
                  v-model="object.customerId"
                  :options="customers"
                  name="request-customer"
                  text-field="name"
                  value-field="id"
                  :state="customerState"
                  size="sm"
                  aria-describedby="customerFeedback"
                />
                <template v-slot:append>
                  <b-button
                    id="customer-search"
                    :variant="customerState ? 'success' : 'danger'"
                    :state="customerState"
                    class="customer-search"
                    size="sm"
                    @click="openCustomerSearch"
                  >
                    <i class="ri-search-line"></i>
                  </b-button>
                </template>
              </b-input-group>
              <b-form-invalid-feedback id="customerFeedback">
                <!-- This will only be shown if the preceeding input has an invalid state -->
                {{ $t('common.notEmptyField') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-form-group horizontal :label-cols="3" :label="$t('table.constructor')" label-for="request-constructor">
              <b-form-select
                id="request-constructor"
                v-model="object.constructorId"
                :options="users"
                text-field="name"
                value-field="id"
                name="request-constructor"
                :state="constructorState"
                size="sm"
                aria-describedby="constructorFeedback"
              />
              <b-form-invalid-feedback id="constructorFeedback">
                <!-- This will only be shown if the preceeding input has an invalid state -->
                {{ $t('common.notEmptyField') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-row>
              <b-col>
                <b-form-group vertical :label-cols="2" :label="$t('table.comment')" label-for="rc-comment">
                  <b-form-textarea id="rc-comment" v-model="object.comment" rows="7" name="rc-comment" :placeholder="$t('common.enterComment')"></b-form-textarea>
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
          <b-col>
            <div>
              <Attachment v-model="object.files" />
            </div>
          </b-col>
        </b-row>
      </b-card>
    </b-modal>

    <SearchCustomer v-if="customerSearchMode" @value-selected="customerSelectedEnd" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import SearchCustomer from '@/views/counterparties/select'
import Attachment from './attachment'
import newReclamation from '../../../dto/NewReclamation.json'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'ReclNewReclamation',

  components: {
    SearchCustomer,
    Attachment,
  },

  props: {
    nevVersion: {
      type: Boolean,
      default: false,
      required: true,
    },
    byEmail: {
      type: Boolean,
      default: false,
    },
    emailAccountId: {
      type: Number,
      required: false,
      default: 0,
    },
    emailUid: {
      type: Number,
      required: false,
      default: null,
    },
    emailDate: {
      type: String,
      required: false,
      default: null,
    },
    emailId: {
      type: Number,
      required: false,
      default: null,
    },
    emailTittle: {
      type: String,
      required: false,
      default: '',
    },
    emailFrom: {
      type: String,
      required: false,
      default: '',
    },
    emailTo: {
      type: String,
      required: false,
      default: '',
    },
  },

  data() {
    return {
      object: {
        customerId: null,
        constructorId: null,
        comment: '',
        files: [],
        byEmail: false,
      },
      customerSearchMode: false,
    }
  },

  computed: {
    ...mapGetters({
      customers: 'counterparties/customerList',
      users: 'users/getUsers',
      currentLanguage: 'auth/currentLanguage',
      openMail: 'mailbox/openEmail',
      openReclamation: 'reclamations/openReclamation',
    }),

    customerState() {
      return this.object.customerId !== null
    },

    constructorState() {
      return this.object.constructorId !== null
    },
  },

  async created() {
    if (this.byEmail === true) {
      if (this.openMail) {
        const { subject } = this.openMail
        this.object.comment = subject

        if (this.openMail.attachments) {
          for (const attachment of this.openMail.attachments) {
            if (attachment.filename && attachment.contentDisposition === 'attachment') {
              let content

              if (!attachment.content && this.openMail.id) {
                const response = await this.$store.dispatch('mailbox/getAttachment', {
                  emailId: this.openMail.id,
                  filename: attachment.filename,
                  checksum: attachment.checksum,
                })

                if (response.status === 200) {
                  content = response.data
                }
              } else {
                content = attachment.content
              }

              if (content) {
                const fileBuffer = new Uint8Array(content.data).buffer
                const blob = new Blob([fileBuffer], { type: attachment.contentType })
                const itemFile = new File([blob], attachment.filename, { type: attachment.contentType })
                this.object.files.push(itemFile)
              }
            }
          }
        }
      }
    }
  },

  async mounted() {
    this.$bvModal.show('cr-new-item')

    if (this.counterparties.length === 0) {
      await this.$store.dispatch('counterparties/findAll', {})
    }

    if (this.users.length === 0) {
      await this.$store.dispatch('users/findAll', {})
    }

    this.object.byEmail = this.byEmail
  },

  methods: {
    ...mapMutations({
      setPossitionsEditionMode: 'reclamations/setPossitionsEditionMode',
    }),

    async handleOk() {
      const reclamationObject = _.cloneDeep(newReclamation)

      reclamationObject.customer = this.object.customerId
      reclamationObject.responsible = this.object.constructorId
      reclamationObject.comment = this.object.comment
      reclamationObject.inputDate = new Date()
      reclamationObject.files = this.object.files

      if (this.object.customerId !== null) {
        const customerData = this.customers.find((el) => {
          return el.id === this.object.customerId
        })

        if (customerData) {
          reclamationObject.email = customerData.email
          reclamationObject.telephone = customerData.phone
          reclamationObject.managerId = customerData.managerId
        }
      }

      const response = await this.$store.dispatch('reclamations/addReclamation', reclamationObject)

      if (response.status === 200) {
        if (this.object.byEmail === true && this.openReclamation.id) {
          const emailItem = {
            reclamationId: this.openReclamation.id,
            emailDate: moment(this.emailDate, 'DD.MM.YYYY hh:mm:ss').toISOString(),
            from: this.emailFrom,
            to: this.emailTo,
            tittle: this.emailTittle,
            uid: this.emailUid,
            emailId: this.emailId,
            accountId: this.emailAccountId,
            type: 'INCOMING',
            action: 1,
          }

          await this.$store.dispatch('reclamationEmails/addItem', emailItem)
        }

        const dataObject = await this.$store.dispatch('reclamations/findByPk', {
          params: {
            id: this.openReclamation.id,
          },
        })

        this.$emit('add-new-end', undefined)

        if (dataObject) {
          this.setPossitionsEditionMode(true)
          this.$router.push({ name: 'reclamation-detail' })
        }
      } else {
        this.$bvToast.toast('Błąd założenia reklamacji!!!', {
          title: this.$t('common.msg'),
          variant: 'danger',
          solid: true,
          autoHideDelay: 2000,
        })

        this.$emit('add-new-end', undefined)
      }
    },

    handleCancel() {
      this.$emit('add-new-end', undefined)
    },

    handelClose() {
      this.$emit('add-new-end', undefined)
    },

    openCustomerSearch() {
      this.customerSearchMode = true
    },

    customerSelectedEnd(value) {
      if (value !== undefined) {
        this.object.customerId = value
        this.onChangeCustomer()
      }

      this.customerSearchMode = false
    },
  },
}
</script>

<style>
.input-group-append .btn-sm {
  padding: 0 0.8rem;
}
</style>
