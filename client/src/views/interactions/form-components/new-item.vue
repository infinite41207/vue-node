<template>
  <div>
    <b-card>
      <b-row class="mb-3">
        <b-col>
          <b-button-toolbar>
            <b-btn-group>
              <a href="javascript:void(0);" class="btn btn-success btn-sm" @click="writeItem">
                <i class="ri-save-2-fill"></i>
                {{ $t('commands.write') }}
              </a>
              <a href="javascript:void(0);" class="btn btn-light btn-sm ml-2" @click="closeItem">
                <i class="ri-close-line"></i>
                {{ $t('commands.close') }}
              </a>
            </b-btn-group>
          </b-button-toolbar>
        </b-col>
      </b-row>
      <b-row v-if="nevVersion">
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.number')" label-for="item-number">
            <b-form-input id="item-number" :value="object.numberStr" size="sm" disabled />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.version')" label-for="item-version">
            <b-form-input id="item-version" :value="object.version" size="sm" disabled />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.customer')" label-for="customer">
            <f-select v-model="customer" required select-btn open-btn value-type="counterparties" detail-view="counterparty-detail" placeholder="Wyszukaj klienta..."></f-select>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.status')" label-for="item-status">
            <b-form-select
              id="item-status"
              v-model="status"
              :options="statusList"
              name="item-status"
              text-field="name"
              value-field="id"
              :state="statusState"
              size="sm"
              aria-describedby="statusFeedback"
            />

            <b-form-invalid-feedback id="statusFeedback">
              <!-- This will only be shown if the preceeding input has an invalid state -->
              {{ $t('common.notEmptyField') }}
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.reference')" label-for="item-reference">
            <b-form-input
              id="item-reference"
              v-model="reference"
              type="text"
              name="item-reference"
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
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.executor')" label-for="executor">
            <f-select v-model="executor" required select-btn open-btn value-type="users" detail-view="user-detail" placeholder="Wyszukaj wykonawcę..."></f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group :label-cols="3" :label="$t('table.executionPeriod')" label-for="item-execution-term">
            <b-form-input id="item-execution-term" v-model="executionTerm" type="date" size="sm"  :state="executionTermState"> </b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.manager')" label-for="manager">
            <f-select v-model="manager" select-btn open-btn value-type="employees" detail-view="employee-detail" placeholder="Wyszukaj handlowca..."></f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-row>
            <b-col>
              <b-form-group horizontal :label-cols="2" label="Tagi" label-for="item-tags">
                <b-input-group>
                  <b-form-tags v-model="tags" input-id="item-tags" separator=" ,;" placeholder="Dodaj z listy" no-add-on-enter></b-form-tags>
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
              <b-form-group vertical :label-cols="2" :label="$t('table.comment')" label-for="item-comment">
                <b-form-textarea id="item-comment" v-model="comment" rows="7" name="item-comment" :placeholder="$t('common.enterComment')"></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col>
          <div>
            <Attachment v-model="files" />
          </div>
        </b-col>
      </b-row>
    </b-card>

  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Attachment from '@/components/common/attachment'

export default {
  name: 'InteractionNewItem',
  components: {
    Attachment,
  },

  data() {
    return {
      viewId: this.$route.params.id,
      tagList: [],
      statusList: [],
      customerSearchMode: false,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'interactions/objectView',
      users: 'users/getUsers',
      currentLanguage: 'auth/currentLanguage',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    status: {
      get() {
        return this.object.statusId
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'statusId', value })
      },
    },

    customer: {
      get() {
        return this.object.customer
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'customer', value })
      },
    },

    reference: {
      get() {
        return this.object.reference
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'reference', value })
      },
    },

    executor: {
      get() {
        return this.object.executor
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'executor', value })
      },
    },

    manager: {
      get() {
        return this.object.manager
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'manager', value })
      },
    },

    executionTerm: {
      get() {
        return this.object.executionTerm
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'executionTerm', value })
      },
    },

    nevVersion() {
      return this.objectView ? this.objectView.nevVersion : false
    },

    byEmail() {
      return this.objectView ? this.objectView.byEmail : false
    },

    emailData() {
      return this.objectView ? this.objectView.emailData : {}
    },

    comment: {
      get() {
        return this.object.comment
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'comment', value })
      },
    },

    tags: {
      get() {
        return this.object.tags || []
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'tags', value })
      },
    },

    files: {
      get() {
        return this.object.files || []
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'files', value })
      },
    },

    referenceState() {
      return this.object.reference !== ''
    },

    executionTermState() {
      return this.object.statusId !== undefined
    },

    statusState() {
      return this.object.statusId !== undefined
    },
  },

  async mounted() {

    this.initStatuses()
    this.initTags()

    // if (this.object.customer) {
    //   this.customerList.push({ ...this.object.customer })
    // }
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'interactions/setObjectViewProperty',
      setObjectViewProperties: 'interactions/setObjectViewProperties',
      setObjectProperty: 'interactions/setObjectProperty',
      delObjectView: 'interactions/delObjectView',
    }),

    ...mapActions({
      delView: 'tagsViews/delView',
    }),

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


    async writeItem() {
      if (this.checkFilling() === false) {
        return
      }

      const response = await this.$store.dispatch('interactions/create', {
        object: this.object,
        newVersion: this.newVersion,
        byEmail: this.byEmail,
        emailData: this.emailData,
      })

      if (response.status === 200) {
        const responseItem = await this.$store.dispatch('interactions/findByPk', {
          params: {
            id: response.data.id,
          },
        })

        if (responseItem.status === 200) {
          this.$router.push({ name: 'interaction-detail', params: { id: response.data.id } })
          this.delView({ name: this.$route.name, path: this.$route.path })
          this.delObjectView(this.viewId)
        }
      }
    },

    closeItem() {
      this.$router.push({ name: 'interactions' })
      this.$destroy()
      this.delView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)
    },

    checkFilling() {
      if (this.customerState === false) {
        this.modalMessage = this.$t('order.msg.emptyCustomer')
        this.$bvModal.show('modal-message')
        return false
      }

      if (this.statusState === false) {
        this.modalMessage = this.$t('order.msg.emptyStatus')
        this.$bvModal.show('modal-message')
        return false
      }

      return true
    },

    // onChangeCustomer() {
    //   if (this.object.customer !== null) {
    //     const customerData = this.customers.find((el) => {
    //       return el.id === this.object.customer.id
    //     })

    //     if (customerData) {
    //       this.object.managerId = customerData.managerId
    //     }
    //   }
    // },

    onSelectTag(item) {
      if (item) {
        const currentTags = [...this.object.tags]

        currentTags.push(item.name)

        this.setObjectProperty({ viewId: this.viewId, property: 'tags', value: currentTags })
      }
    },

  },
}
</script>

<style>
.input-group-append .btn-sm {
  padding: 0 0.8rem;
}
</style>
