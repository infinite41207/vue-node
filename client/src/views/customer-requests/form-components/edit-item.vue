<template>
  <div>
    <b-modal
      id="cr-edit-item"
      size="xl"
      :title="`${$t('customerRequest.edit')}${object.numberStr}`"
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
            <b-form-group horizontal label-cols="12" label-cols-md="3" :label="$t('table.customer')" label-for="request-customer">
              <f-select
                id="request-customer"
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
            <b-form-group horizontal label-cols="12" label-cols-md="3" content-cols-md="9" content-cols-lg="3" :label="$t('table.commission')" label-for="request-commission">
              <b-form-input id="request-commission" v-model="object.commission" type="number" name="request-commission" size="sm" @change="onChangeCommission"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-form-group horizontal label-cols="12" label-cols-md="3" :label="$t('table.constructor')" label-for="request-constructor">
              <f-select
                id="request-constructor"
                v-model="object.constr"
                select-btn
                open-btn
                value-type="users"
                detail-view="user-detail"
                placeholder="Wyszukaj konstruktora..."
              ></f-select>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group horizontal label-cols="12" label-cols-md="3" :label="$t('table.reference')" label-for="request-reference">
              <b-form-input id="request-reference" v-model="object.reference" type="text" name="request-reference" :disabled="object.sended" size="sm"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-form-group horizontal label-cols="12" label-cols-md="3" :label="$t('table.manager')" label-for="request-manager">
              <f-select
                id="request-manager"
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
            <b-form-group horizontal label-cols="12" label-cols-md="3" :label="$t('table.status')" label-for="request-status">
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
            <b-form-group label-cols="12" label-cols-md="3" label="Termin wykonania" label-for="rc-execution-term">
              <b-form-input id="rc-execution-term" v-model="object.executionTerm" type="date" size="sm"> </b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group horizontal label-cols="12" label-cols-md="3" :label="$t('table.subExecutor')" label-for="request-executor">
              <f-select
                id="request-executor"
                v-model="object.executor"
                select-btn
                open-btn
                value-type="users"
                detail-view="user-detail"
                placeholder="Wyszukaj handlowca..."
              ></f-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group horizontal label-cols="12" label-cols-md="1" label="Tagi" label-for="rc-tags">
              <b-input-group>
                <b-form-tags v-model="object.tags" input-id="rc-tags" separator=" ,;" placeholder="Dodaj z listy" no-add-on-enter :disabled="object.sended"></b-form-tags>
                <b-input-group-append>
                  <b-dropdown>
                    <b-dropdown-item v-for="tag of tags" :key="tag.id" @click="onSelectTag(tag)"> {{ tag.name }}</b-dropdown-item>
                  </b-dropdown>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group vertical label-cols="12" label-cols-md="2" :label="$t('table.comment')" label-for="rc-comment">
              <b-form-textarea id="rc-comment" v-model="object.comment" rows="7" name="rc-comment" :placeholder="$t('common.enterComment')"></b-form-textarea>
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>
    </b-modal>

    <SearchCustomer v-if="customerSearchMode" @value-selected="customerSelectedEnd" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import SearchCustomer from '@/views/counterparties/select'

export default {
  name: 'CREditItem',
  components: {
    SearchCustomer,
  },

  data() {
    return {
      viewId: this.$route.params.id,
      statusesList: [],
      employees: [],
      tags: [],
      customerSearchMode: false,
    }
  },

  computed: {
    ...mapGetters({
      //customers: 'counterparties/customerList',
      users: 'users/getUsers',
      currentLanguage: 'auth/currentLanguage',
      getObjectView: 'customerRequests/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    customerState() {
      return this.object.unknownCustomer === true ? this.object.customerName !== '' : this.object.customerId !== null
    },

    constructorState() {
      return this.object.constructorId !== null
    },

    managerState() {
      return this.object.managerId !== null
    },

    executorState() {
      return this.object.executorId !== null
    },

    statusState() {
      return this.object.statusId !== null
    },
  },

  async mounted() {
    this.$bvModal.show('cr-edit-item')

    if (this.object) {
      this.object.executionTerm = moment(this.object.executionTerm).format('YYYY-MM-DD')
    } else {
      this.$emit('edit-end', undefined)
      this.$bvModal.hide('cr-edit-item')
    }

    await this.$store
      .dispatch('customerRequestsStatuses/findAll', {})
      .then((response) => {
        if (response && response.status === 200) {
          this.statusesList = response.data.responseData
        } else {
          this.statusesList = []
        }
      })
      .catch((err) => {
        console.error(err)
        this.statusesList = []
      })

    const employeesResponse = await this.$store.dispatch('employees/findAll', { noCommit: true })

    if (employeesResponse.status === 200) {
      this.employees = employeesResponse.data
    }

    if (this.customers.length === 0) {
      await this.$store.dispatch('counterparties/findAll', {})
    }

    if (this.users.length === 0) {
      await this.$store.dispatch('users/findAll', {})
    }

    const response = await this.$store.dispatch('customerRequestsTags/findAll', {})

    if (response.status === 200) {
      this.tags = response.data
    }
  },

  methods: {
    async handleOk() {
      const updateData = {
        customerId: this.object.customerId,
        unknownCustomer: this.object.unknownCustomer,
        customerName: this.object.customerName,
        managerId: this.object.managerId,
        commission: this.object.commission,
        constructorId: this.object.constructorId,
        reference: this.object.reference,
        statusId: this.object.statusId,
        executorId: this.object.executorId,
        executionTerm: moment(this.object.executionTerm, 'YYYY-MM-DD').toISOString(),
        tags: this.object.tags,
        comment: this.object.comment,
      }
      const response = await this.$store.dispatch('customerRequests/update', { id: this.object.id, updateData })
      if (response.status === 200) {
        await this.$store.dispatch('customerRequests/findByPk', {
          params: {
            id: this.object.id,
          },
        })

        this.$emit('edit-end', undefined)
      }
    },

    handleCancel() {
      this.$emit('edit-end', undefined)
    },

    handelClose() {
      this.$emit('edit-end', undefined)
    },

    onUnknownCustomerChange() {
      if (this.object.unknownCustomer === true) {
        this.object.customerId = null
      } else {
        this.object.customerName = ''
      }
    },

    onChangeCommission() {
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
