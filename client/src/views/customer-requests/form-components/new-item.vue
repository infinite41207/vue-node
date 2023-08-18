<template>
  <div>
    <b-modal
      id="cr-new-item"
      size="xl"
      :title="`${newVersion === true ? $t('customerRequest.newVersion') : $t('customerRequest.new')}!`"
      :cancel-title="$t('commands.cancel')"
      no-close-on-backdrop
      :ok-title="`${$t('commands.write')}`"
      @ok="handleOk"
      @cancel="handleCancel"
      @close="handelClose"
    >
      <b-card>
        <b-row v-if="newVersion">
          <b-col md="6">
            <b-form-group horizontal :label-cols="3" :label="$t('table.number')" label-for="request-number">
              <b-form-input id="request-number" :value="object.numberStr" size="sm" disabled />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group horizontal :label-cols="3" :label="$t('table.version')" label-for="request-version">
              <b-form-input id="request-version" :value="object.version" size="sm" disabled />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-form-group horizontal :label-cols="3" :label="$t('table.customer')" label-for="request-customer">
              <f-select
                v-model="object.customer"
                select-btn
                open-btn
                value-type="counterparties"
                detail-view="counterparties-detail"
                placeholder="Wyszukaj kontrahenta..."
              ></f-select>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group horizontal :label-cols="3" :label="$t('table.status')" label-for="request-status">
              <f-select
                id="request-status"
                v-model="object.status"
                select-btn
                open-btn
                value-type="customerRequestsStatuses"
                detail-view="cr-statuses-detail"
                placeholder="Wyszukaj status..."
              ></f-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-form-group horizontal :label-cols="3" :label="$t('table.constructor')" label-for="request-constructor">
              <f-select
                id="request-constructor"
                v-model="object.constr"
                select-btn
                open-btn
                value-type="users"
                detail-view="user-detail"
                placeholder="Wyszukaj handlowca..."
              ></f-select>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group horizontal :label-cols="3" :label="$t('table.reference')" label-for="request-reference">
              <b-form-input
                id="request-reference"
                v-model="object.reference"
                type="text"
                name="request-reference"
                size="sm"
                :state="referenceState"
                aria-describedby="referenceFeedback"
              ></b-form-input>

              <b-form-invalid-feedback id="referenceFeedback">
                <!-- This will only be shown if the preceeding input has an invalid state -->
                {{ $t('common.notEmptyField') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-form-group horizontal :label-cols="3" :label="$t('table.executor')" label-for="request-executor">
              <f-select
                id="request-executor"
                v-model="object.manager"
                select-btn
                open-btn
                value-type="employees"
                detail-view="employee-detail"
                placeholder="Wyszukaj handlowca..."
              ></f-select>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group horizontal :label-cols="3" :label="$t('table.manager')" label-for="request-manager">
              <b-form-select id="request-manager" v-model="object.managerId" :options="employees" text-field="name" value-field="id" name="request-manager" size="sm" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-form-group :label-cols="3" :label="$t('table.executionPeriod')" label-for="rc-execution-term">
              <b-form-input id="rc-execution-term" v-model="object.executionTerm" type="date" size="sm"> </b-form-input> </b-form-group
          ></b-col>
          <b-col md="6">
            <b-form-group horizontal :label-cols="3" :content-cols="4" :label="$t('table.commission')" label-for="request-commission">
              <b-form-input id="request-commission" v-model="object.commission" type="number" name="request-commission" size="sm" @change="onChangeCommission"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-row>
              <b-col>
                <b-form-group horizontal :label-cols="2" label="Tagi" label-for="rc-tags">
                  <b-input-group>
                    <b-form-tags v-model="object.tags" input-id="rc-tags" separator=" ,;" placeholder="Dodaj z listy" no-add-on-enter></b-form-tags>
                    <b-input-group-append>
                      <b-dropdown>
                        <b-dropdown-item v-for="tag of tags" :key="tag.id" @click="onSelectTag(tag)"> {{ tag.new }}</b-dropdown-item>
                      </b-dropdown>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>
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
import { mapGetters } from 'vuex'
import SearchCustomer from '@/views/counterparties/select'
import Attachment from '@/components/common/attachment'

export default {
  name: 'CRNewItem',
  components: {
    SearchCustomer,
    Attachment,
  },

  props: {
    newVersion: {
      type: Boolean,
      default: false,
      required: true,
    },
    baseId: {
      type: Number,
      default: null,
      required: false,
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
      default: 0,
    },
    emailId: {
      type: Number,
      required: false,
      default: null,
    },
    emailTitle: {
      type: String,
      required: false,
      default: '',
    },
  },

  data() {
    return {
      object: {
        statusId: null,
        customerId: null,
        unknownCustomer: false,
        customerName: '',
        version: 1,
        versionUuid: '',
        commission: '0.00',
        constructorId: null,
        reference: '',
        executorId: null,
        executionTerm: Date.now(),
        state: 'Active',
        managerId: null,
        comment: '',
        ordered: false,
        tags: [],
        files: [],
        byEmail: false,
        emailUid: null,
        emailId: null,
        emailTitle: '',
        emailType: 'INCOMING',
        resultEmailId: null,
      },

      // viewId: this.$route.params.id,
      tags: [],
      statusesList: [],
      employees: [],
      customerSearchMode: false,
    }
  },

  computed: {
    ...mapGetters({
      users: 'users/getUsers',
      currentLanguage: 'auth/currentLanguage',
      openMail: 'mailbox/openEmail',
      getObjectView: 'customerRequests/objectView',
    }),

    // objectView() {
    //   return this.getObjectView(this.viewId)
    // },

    // object() {
    //   return this.objectView ? this.objectView.object : {}
    // },

    customerState() {
      return this.object.unknownCustomer === true ? this.object.customerName !== '' : this.object.customerId !== null
    },

    constructorState() {
      return this.object.constructorId !== null
    },

    executorState() {
      return this.object.executorId !== null
    },

    referenceState() {
      return this.object.reference !== ''
    },

    statusState() {
      return this.object.statusId !== null
    },
  },

  async created() {
    console.log('new item object', this.object)
    if (this.byEmail === true) {
      if (this.openMail) {
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
    this.initEmployees()
    this.initTags()

    if (this.newVersion === true) {
      const statusId = this.getCorrectionStatus()

      let customerRequest
      if (this.baseId) {
        const response = await this.$store.dispatch('customerRequests/findByPk', {
          noCommit: true,
          params: {
            id: this.baseId,
          },
        })

        if (response.status === 200) {
          customerRequest = response.data
        }
      } else if (this.customerRequest) {
        customerRequest = this.customerRequest
      }

      if (customerRequest) {
        const { versionUuid, number, numberStr, commission, customerId, unknownCustomer, customerName, constructorId, managerId, reference, tags, sumBrutto, currency } =
          customerRequest

        let { version } = customerRequest

        this.object.statusId = statusId
        this.object.versionUuid = versionUuid
        this.object.version = ++version
        this.object.number = number
        this.object.numberStr = numberStr
        this.object.commission = commission
        this.object.customerId = customerId
        this.object.unknownCustomer = unknownCustomer === null ? false : unknownCustomer
        this.object.customerName = customerName === null ? '' : customerName
        this.object.constructorId = constructorId
        this.object.executorId = constructorId
        this.object.reference = reference
        this.object.tags = tags
        this.object.managerId = managerId
        this.object.sumBrutto = sumBrutto
        this.object.currency = currency
      }
    }

    this.object.byEmail = this.byEmail

    if (this.byEmail === true) {
      this.object.emailTitle = this.emailTitle
      this.object.comment = this.emailTitle
      this.object.emailUid = this.emailUid
      this.object.emailId = this.emailId
      this.object.emailAccountId = this.emailAccountId
    }
  },

  methods: {
    async initEmployees() {
      const response = await this.$store.dispatch('employees/findAll', { noCommit: true })

      if (response.status === 200) {
        this.employees = response.data
      } else {
        this.employees = []
      }
    },

    async initTags() {
      const response = await this.$store.dispatch('customerRequestsTags/findAll', {})

      if (response.status === 200) {
        this.tags = response.data
      }
    },

    async handleOk() {
      if (this.object.status) {
        this.object.statusId = this.object.status.id
      }
      if (this.object.constr) {
        this.object.constructorId = this.object.constr.id
      }
      if (this.object.customer) {
        this.object.customerId = this.object.customer.id
      }

      const response = await this.$store.dispatch('customerRequests/create', this.object)
      if (response.status === 200) {
        this.$emit('add-new-end', undefined)

        const dataObject = await this.$store.dispatch('customerRequests/findByPk', {
          params: {
            id: response.data.id,
          },
        })

        if (dataObject) {
          this.$router.push({ name: 'customer-request-detail', params: { id: response.data.id } })
        }
      }
    },

    getCorrectionStatus() {
      const correctionStatus = this.statusesList.find((el) => el.predefinedName === 'korrection')
      return correctionStatus ? correctionStatus.id : null
    },

    onUnknownCustomerChange() {
      if (this.object.unknownCustomer === true) {
        this.object.customerId = null
      } else {
        this.object.customerName = ''
      }
    },

    handleCancel() {
      this.$emit('add-new-end', undefined)
    },

    handelClose() {
      this.$emit('add-new-end', undefined)
    },

    onChangeConstructor() {
      if (this.object.constructorId > 0) {
        this.object.executorId = this.object.constructorId
      }
    },

    onChangeCustomer() {
      if (this.object.customerId > 0) {
        const customerData = this.customers.find((el) => {
          return el.id === this.object.customerId
        })

        if (customerData) {
          this.object.commission = Number(customerData.commission).toFixed(2)
          this.object.managerId = customerData.managerId
        }
      }
    },

    onChangeCommission() {
      if (this.object.commission < 0) {
        this.object.commission = 0
      }

      try {
        this.object.commission = Number(this.object.commission).toFixed(2)
      } catch {
        this.object.commission = '0.00'
      }
    },

    onSelectTag(item) {
      if (item) {
        this.object.tags.push(item.name)
      }
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

.success-prepend {
  border-color: #0acf97 !important;
}

.danger-prepend .input-group-text {
  border-color: #f9375e !important;
}
</style>
