<template>
  <div>
    <b-modal
      id="interaction-edit-item"
      size="xl"
      :title="`${$t('interaction.edit')}${editObject.numberStr}`"
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
            <b-form-group horizontal :label-cols="3" :label="$t('table.customer')" label-for="customer">
              <f-select v-model="editObject.customer" required select-btn open-btn value-type="counterparties" detail-view="counterparty-detail" placeholder="Wyszukaj klienta..."></f-select>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group horizontal label-cols="12" label-cols-md="3" :label="$t('table.status')" label-for="item-status">
              <b-form-select
                id="item-status"
                v-model="editObject.statusId"
                :options="statusList"
                name="item-status"
                text-field="name"
                value-field="id"
                :state="statusState"
                size="sm"
                aria-describedby="statusFeedback"
              />

              <b-form-invalid-feedback id="statusFeedback">
                {{ $t('common.notEmptyField') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-form-group horizontal label-cols="12" label-cols-md="3" :label="$t('table.reference')" label-for="item-reference">
              <b-form-input id="item-reference" v-model="editObject.reference" type="text" name="item-reference" size="sm"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group horizontal :label-cols="3" :label="$t('table.manager')" label-for="manager">
              <f-select v-model="editObject.manager" select-btn open-btn value-type="employees" detail-view="employee-detail" placeholder="Wyszukaj handlowca..."></f-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-form-group label-cols="12" label-cols-md="3" label="Termin wykonania" label-for="item-execution-term">
              <b-form-input id="item-execution-term" v-model="editObject.executionTerm" type="date" size="sm"> </b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group horizontal :label-cols="3" :label="$t('table.executor')" label-for="executor">
              <f-select v-model="editObject.executor" required select-btn open-btn value-type="users" detail-view="user-detail" placeholder="Wyszukaj wykonawcę..."></f-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group horizontal label-cols="12" label-cols-md="1" label="Tagi" label-for="item-tags">
              <b-input-group>
                <b-form-tags v-model="editObject.tags" input-id="item-tags" separator=" ,;" placeholder="Dodaj z listy" no-add-on-enter></b-form-tags>
                <b-input-group-append>
                  <b-dropdown>
                    <b-dropdown-item v-for="tag of tagList" :key="tag.id" @click="onSelectTag(tag)"> {{ tag.name }}</b-dropdown-item>
                  </b-dropdown>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group vertical label-cols="12" label-cols-md="2" :label="$t('table.comment')" label-for="item-comment">
              <b-form-textarea id="item-comment" v-model="editObject.comment" rows="7" name="item-comment" :placeholder="$t('common.enterComment')"></b-form-textarea>
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'InteractionEditItem',

  components: {
  },

  props: {
    viewId: {
      type: String,
      require: true,
      default: null,
    },
  },

  data() {
    return {
      editObject: {
        id: null,
        numberStr: '',
        executionTerm: Date.now(),
        executor: null,
        statusId: null,
        customer: null,
        manager: null,
        reference: '',
        tags: [],
        comment: '',
      },
      statusList: [],
      tagList: [],
      customerSearchMode: false,
    }
  },

  computed: {
    ...mapGetters({
      users: 'users/getUsers',
      getObjectView: 'interactions/objectView',
      currentLanguage: 'auth/currentLanguage',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    customerState() {
      return this.editObject.customer !== null
    },

    managerState() {
      return this.editObject.managerId !== null
    },

    executorState() {
      return this.editObject.executorId !== null
    },

    statusState() {
      return this.editObject.statusId !== null
    },
  },

  async mounted() {
    this.$bvModal.show('interaction-edit-item')

    if (this.object) {
      for (const key of Object.keys(this.editObject)) {
        this.editObject[key] = this.object[key]
      }

      this.editObject.executionTerm = moment(this.object.executionTerm).format('YYYY-MM-DD')
    } else {
      this.$emit('edit-end', undefined)
      this.$bvModal.hide('interaction-edit-item')
    }

    this.initStatuses()
    this.initTags()
  },

  methods: {

    async initStatuses() {
      await this.$store
        .dispatch('interactionStatuses/findAll', {})
        .then((response) => {
          if (response && response.status === 200) {
            this.statusList = response.data.responseData
          } else {
            this.statusList = []
          }
        })
        .catch((err) => {
          console.error(err)
          this.statusList = []
        })
    },

    async initTags() {
      const response = await this.$store.dispatch('interactionTags/findAll', {})

      if (response.status === 200) {
        this.tagList = response.data
      } else {
        this.tagList = []
      }
    },


    async handleOk() {

      const updateData = {
        customerId: this.editObject.customer ? this.editObject.customer.id : null,
        managerId: this.editObject.manager ? this.editObject.manager.id : null,
        reference: this.editObject.reference,
        statusId: this.editObject.statusId,
        executorId: this.editObject.executor ? this.editObject.executor.id : null,
        executionTerm: moment(this.editObject.executionTerm, 'YYYY-MM-DD').toISOString(),
        tags: this.editObject.tags,
        comment: this.editObject.comment,
      }
      const response = await this.$store.dispatch('interactions/update', { id: this.object.id, updateData })
      if (response.status === 200) {
        await this.$store.dispatch('interactions/findByPk', {
          viewId: this.viewId,
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

    onSelectTag(item) {
      if (item) {
        this.editObject.tags.push(item.name)
      }
    },

    openCustomerSearch() {
      this.customerSearchMode = true
    },

    customerSelectedEnd(value) {
      if (value !== undefined) {
        this.editObject.customer = value
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
