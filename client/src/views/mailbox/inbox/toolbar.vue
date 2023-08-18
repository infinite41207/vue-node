<template>
  <div>
    <b-row class="mb-2">
      <b-col>
        <b-button-toolbar>
          <b-button-group>
            <b-dropdown id="select-menu" class="btn-group mr-1" size="sm" toggle-class="arrow-none" variant="outline-secondary">
              <template slot="button-content">
                <i v-if="selectedState === 0" class="ri-checkbox-blank-line mr-1"></i>
                <i v-if="selectedState === 1" class="ri-checkbox-line mr-1"></i>
                <i v-if="selectedState === 2" class="ri-checkbox-indeterminate-line mr-1"></i>
                <i class="ri-arrow-down-s-line"></i>
                <b-tooltip target="select-menu" triggers="hover">
                  {{ $t('commands.select') }}
                </b-tooltip>
              </template>

              <b-dropdown-item v-if="!onlineMode" @click="checkEmails('all')">
                {{ $t('email.all') }}
              </b-dropdown-item>
              <b-dropdown-item v-if="!onlineMode" @click="checkEmails('none')">
                {{ $t('email.none') }}
              </b-dropdown-item>
              <b-dropdown-item v-if="!onlineMode" @click="checkEmails('seen')">
                {{ $t('email.seen') }}
              </b-dropdown-item>
              <b-dropdown-item v-if="!onlineMode" @click="checkEmails('unseen')">
                {{ $t('email.unseen') }}
              </b-dropdown-item>
            </b-dropdown>
            <b-button id="move-to-junk" v-if="selectedEmails.length > 0" variant="outline-secondary" class="btn-sm" @click="moveTo('Junk')">
              <i class="ri-spam-line"></i>
              <b-tooltip target="move-to-junk" triggers="hover">
                {{ $t('email.moveToJunk') }}
              </b-tooltip>
            </b-button>
            <b-button id="move-to-trash" v-if="selectedEmails.length > 0" variant="outline-secondary" class="btn-sm" @click="moveTo('Trash')">
              <i class="ri-delete-bin-line"></i>
              <b-tooltip target="move-to-trash" triggers="hover">
                {{ $t('email.moveToTrash') }}
              </b-tooltip>
            </b-button>
            <b-dropdown id="move-to" v-if="selectedEmails.length > 0" toggle-class="arrow-none" size="sm" variant="outline-secondary">
              <template slot="button-content">
                <i class="ri-folder-transfer-line"></i>
              </template>
              <b-dropdown-item v-for="(box, index) of moveToBoxes" :key="index" href="javascript: void(0);" @click="moveTo(box)">{{
                box.title ? $t(`email.${box.title}`) : box.name
              }}</b-dropdown-item>
              <b-tooltip target="move-to" triggers="hover">
                {{ $t('email.moveTo') }}
              </b-tooltip>
            </b-dropdown>
            <b-dropdown id="set-label" v-if="selectedEmails.length > 0" toggle-class="arrow-none" size="sm" variant="outline-secondary">
              <template slot="button-content">
                <i class="ri-price-tag-3-line"></i>
              </template>
              <b-list-group>
                <b-list-group-item class="label-list-item" v-for="(label, index) of selectedLabels" :key="index">
                  <b-form-checkbox v-model="label.value" :indeterminate="label.indeterminate" @change="onChangeLabel(label)">{{ label.name }}</b-form-checkbox>
                </b-list-group-item>
              </b-list-group>
              <b-tooltip target="set-label" triggers="hover">
                {{ $t('email.setLabel') }}
              </b-tooltip>
            </b-dropdown>
            <b-dropdown class="btn-group" toggle-class="arrow-none" size="sm" variant="outline-secondary">
              <template slot="button-content">
                {{ $t('email.setAs') }}
                <i class="ri-arrow-down-s-line"></i>
              </template>
              <b-dropdown-item v-if="!onlineMode" @click="setProcessed">
                <i class="ri-bookmark-line text-success mr-1"></i>
                {{ $t('email.processed') }}
              </b-dropdown-item>
              <b-dropdown-item v-if="!onlineMode" @click="setNotProcessed">
                <i class="ri-bookmark-2-line text-danger mr-1"></i>
                {{ $t('email.notProcessed') }}
              </b-dropdown-item>
              <b-dropdown-item @click="setSeen">
                <i class="ri-eye-line text-success mr-1"></i>
                {{ $t('email.seen') }}
              </b-dropdown-item>
              <b-dropdown-item @click="setUnseen">
                <i class="ri-eye-off-line text-danger mr-1"></i>
                {{ $t('email.unseen') }}
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown class="btn-group ml-1" size="sm" toggle-class="arrow-none" variant="outline-secondary">
              <template slot="button-content">
                <i class="ri-add-line mr-1"></i>
                {{ $t('commands.createFrom') }}
                <i class="ri-arrow-down-s-line"></i>
              </template>
              <b-dropdown-item href="javascript: void(0);" @click="createInteraction">{{ $t('email.create.newInteraction') }}</b-dropdown-item>
              <b-dropdown-item href="javascript: void(0);" @click="createReclamation">{{ $t('email.create.newReclamation') }}</b-dropdown-item>
              <b-dropdown-item href="javascript: void(0);" @click="createCusromerRequest">{{ $t('email.create.newCustomerRequest') }}</b-dropdown-item>
              <b-dropdown-item href="javascript: void(0);" @click="createCusromerRequestCorrection">{{ $t('email.create.customerRequestCorrection') }}</b-dropdown-item>
            </b-dropdown>
            <b-dropdown class="btn-group ml-1" size="sm" toggle-class="arrow-none" variant="outline-secondary">
              <template slot="button-content">
                <i class="ri-attachment-2 mr-1"></i>
                {{ $t('commands.attachTo') }}
                <i class="ri-arrow-down-s-line"></i>
              </template>
              <b-dropdown-item href="javascript: void(0);" @click="addToInteraction">{{ $t('email.attachTo.interaction') }}</b-dropdown-item>
              <b-dropdown-item href="javascript: void(0);" @click="addToReclamation">{{ $t('email.attachTo.reclamation') }}</b-dropdown-item>
              <b-dropdown-item href="javascript: void(0);" @click="addToCusromerRequest">{{ $t('email.attachTo.customerRequest') }}</b-dropdown-item>
            </b-dropdown>

            <b-button v-if="currentBox?.name === 'Drafts'" variant="secondary" :disabled="selectedEmails.length === 0" class="ml-1" size="sm" @click="sendNow">
              <i class="ri-mail-download-line"></i>
              {{ $t('commands.sendNow') }}
            </b-button>
          </b-button-group>

          <b-button-group class="btn-group ml-1">
            <b-dropdown size="sm" toggle-class="arrow-none" variant="outline-secondary">
              <template slot="button-content">
                <i class="ri-settings-3-line mr-1"></i>
                <i class="ri-arrow-down-s-line"></i>
              </template>
              <b-dropdown-item href="javascript: void(0);" @click="goTo('email-labels')">{{ $t('email.manageLabels') }}</b-dropdown-item>
              <b-dropdown-item href="javascript: void(0);" @click="goTo('email-templates')">{{ $t('email.manageTemplates') }}</b-dropdown-item>
            </b-dropdown>
          </b-button-group>
        </b-button-toolbar>

        <!-- <b-button-toolbar> </b-button-toolbar> -->
      </b-col>
    </b-row>

    <NewCRItem
      v-if="createCRMode"
      :nev-version="false"
      :by-email="true"
      :email-uid="currentEmail.uid"
      :email-id="currentEmail.id"
      :email-account-id="emailAccount"
      :email-title="currentEmail.subject"
      :new-version="newCRVersion"
      :base-id="customerRequestId"
      @add-new-end="createCusromerRequestEnd"
    />

    <NewReclamation
      v-if="createReclamationMode"
      :nev-version="false"
      :by-email="true"
      :email-uid="currentEmail.uid"
      :email-id="currentEmail.id"
      :email-account-id="emailAccount"
      :email-tittle="currentEmail.subject"
      :email-from="currentEmail.text"
      :email-to="currentEmail.text"
      :email-date="currentEmail.date"
      @add-new-end="createReclamationEnd"
    />

    <CRSelect v-if="selectCRMode" :user-id="currentUser.id" @select-end="addToCusromerRequestEnd" />
    <InputComment v-if="inputCommentMode" @input-comment-end="inputCommentEnd" />
    <InteractionSelect v-if="selectInteractionMode" @select-end="addToInteractionEnd" />
    <ReclamationSelect v-if="selectReclamationMode" @select-end="addToReclamationEnd" />
    <Message :message="modalMessage" />
  </div>
</template>

<script>
import NewCRItem from '@/views/customer-requests/form-components/new-item'
import NewReclamation from '@/views/reclamations/form_components/new-reclamation'
import InputComment from '@/components/common/input-comment'
import CRSelect from '@/views/customer-requests/select'
import ReclamationSelect from '@/views/reclamations/select'
import InteractionSelect from '@/views/interactions/select'
import Message from '@/components/common/message'
import { authComputed } from '@/store/helpers'
import { mapGetters } from 'vuex'
import { uuid } from 'vue-uuid'

export default {
  name: 'MailboxToolbar',
  components: {
    NewCRItem,
    NewReclamation,
    CRSelect,
    InputComment,
    ReclamationSelect,
    InteractionSelect,
    Message,
  },

  props: {
    selectedEmails: {
      type: Array,
      default() {
        return []
      },
    },
    labels: {
      type: Array,
      default() {
        return []
      },
    },
  },

  data() {
    return {
      createCRMode: false,
      createReclamationMode: false,
      selectCRMode: false,
      selectReclamationMode: false,
      selectInteractionMode: false,
      inputCommentMode: false,
      customerRequestId: null,
      interactionId: null,
      currentEmail: {},
      modalMessage: '',
      newCRVersion: false,
      indeterminate: false,
      selectedLabels: [],
    }
  },

  computed: {
    ...mapGetters({
      emailAccount: 'mailbox/emailAccount',
      currentBox: 'mailbox/mailboxViewCurrentBox',
      mailboxView: 'mailbox/mailboxView',
      boxes: 'mailbox/mailboxViewBoxes',
      list: 'mailbox/mailboxViewList',
    }),

    ...authComputed,

    onlineMode() {
      return this.mailboxView.onlineMode
    },

    selectedState() {
      if (this.selectedEmails.length === 0) {
        return 0
      }
      if (this.selectedEmails.length === this.list.length) {
        return 1
      }

      return 2
    },

    moveToBoxes() {
      return this.boxes.filter((el) => {
        return el.name !== 'Sent' && el.name !== 'Drafts' && el.path !== this.currentBox.path
      })
    },
  },

  watch: {
    selectedEmails() {
      this.updateLabels()
    },

    labels() {
      this.updateLabels()
    },
  },

  methods: {
    checkEmails(param) {
      this.$emit('check-emails', param)
    },

    updateLabels() {
      const currentLabels = []

      for (const email of this.selectedEmails) {
        if (email.labels) {
          for (const label of email.labels) {
            const index = currentLabels.findIndex((el) => {
              return el.name == label
            })

            if (index > -1) {
              currentLabels[index].count++
            } else {
              currentLabels.push({ name: label, count: 1 })
            }
          }
        }
      }

      this.selectedLabels = this.labels.map((el) => {
        const existLabel = currentLabels.find((currEl) => {
          return currEl.name == el.name
        })

        let value = false
        let indeterminate = false

        if (existLabel) {
          value = existLabel.count === this.selectedEmails.length
          indeterminate = existLabel.count < this.selectedEmails.length
        }

        return { name: el.name, value, indeterminate }
      })
    },

    async setFlag(flag) {
      if (this.checkSelected() === false) {
        return
      }

      await this.$store.dispatch('mailbox/setFlag', {
        emailUid: this.selectedEmails.map((el) => {
          return el.uid
        }),
        emailAccountId: this.emailAccount,
        flag,
      })

      this.refreshList()
    },

    checkSelected() {
      if (this.selectedEmails.length === 0) {
        this.modalMessage = this.$t('email.msg.selectEmailFirst')
        this.$bvModal.show('modal-message')
        return false
      } else {
        return true
      }
    },

    refreshList() {
      this.$emit('refresh-list')
    },

    async setUnseen() {
      if (this.checkSelected() === false) {
        return
      }

      await this.$store.dispatch('mailbox/setUnseen', {
        emailUid: this.selectedEmails.map((el) => {
          return el.uid
        }),
        emailAccountId: this.emailAccount,
      })

      this.refreshList()
    },

    async setSeen() {
      await this.$store.dispatch('mailbox/setSeen', {
        emailUid: this.selectedEmails.map((el) => {
          return el.uid
        }),
        emailAccountId: this.emailAccount,
      })

      this.refreshList()
    },

    async setProcessed() {
      await this.$store.dispatch('mailbox/update', {
        id: this.selectedEmails.map((el) => {
          return el.id
        }),
        updateData: { processed: true },
      })

      this.refreshList()
    },

    async setNotProcessed() {
      await this.$store.dispatch('mailbox/update', {
        id: this.selectedEmails.map((el) => {
          return el.id
        }),
        updateData: { processed: false },
      })

      this.refreshList()
    },

    createCusromerRequest() {
      if (this.checkSelected() === false) {
        return
      }

      this.currentEmail = this.selectedEmails[0]
      this.createCRMode = true
    },

    createCusromerRequestCorrection() {
      if (this.checkSelected() === false) {
        return
      }

      this.currentEmail = this.selectedEmails[0]
      this.selectCRMode = true
      this.newCRVersion = true
    },

    createReclamation() {
      if (this.checkSelected() === false) {
        return
      }

      this.currentEmail = this.selectedEmails[0]
      this.createReclamationMode = true
    },

    async createInteraction() {
      if (this.checkSelected() === false) {
        return
      }

      this.currentEmail = this.selectedEmails[0]

      const viewId = uuid.v4()

      await this.$store.dispatch('interactions/addNew', {
        viewId,
        nevVersion: false,
        byEmail: true,
        emailData: {
          uid: this.currentEmail.uid,
          id: this.currentEmail.id,
          title: this.currentEmail.subject,
          from: this.currentEmail.from.text,
          type: 'INCOMING',
          filesAtHardDrive: this.currentEmail.attachmentsAtHardDrive,
          files: null,
          emailAccountId: this.emailAccount,
        },
      })

      this.$router.push({ name: 'interaction-detail', params: { id: viewId } })
    },

    createCusromerRequestEnd() {
      this.createCRMode = false
      this.currentEmail = {}
    },

    createReclamationEnd() {
      this.createReclamationMode = false
      this.currentEmail = {}
    },

    addToInteraction() {
      if (this.checkSelected() === false) {
        return
      }

      this.currentEmail = this.selectedEmails[0]
      this.selectInteractionMode = true
    },

    async addToInteractionEnd(value) {
      this.selectInteractionMode = false
      if (value !== undefined) {
        this.interactionId = value
        this.inputCommentMode = true
      }
    },

    goTo(path) {
      this.$router.push({ name: path })
    },

    onChangeLabel(label) {
      let emailIds = []

      if (this.selectedEmails.length > 0) {
        emailIds = this.selectedEmails.map((el) => el.id)
      }

      this.$store.dispatch('mailbox/setLabel', { emailAccountId: this.emailAccount, emailId: emailIds, label: label.name, setLabel: label.value })
    },

    async moveTo(box) {
      const boxTo = box.id
        ? box
        : this.boxes.find((el) => {
            return el.name === box
          })

      if (!boxTo) {
        return
      }

      await this.$store
        .dispatch('mailbox/moveEmail', {
          emailAccountId: this.emailAccount,
          emailUid: this.selectedEmails.map((el) => {
            return el.uid
          }),
          boxFrom: { name: this.currentBox?.name, path: this.currentBox?.path, id: this.currentBox?.id },
          boxTo: { name: boxTo.name, path: boxTo.path, id: boxTo.id },
        })
        .then((response) => {
          this.$bvToast.toast(this.$t('email.emailMoved'), {
            title: this.$t('common.msg'),
            variant: 'success',
            solid: true,
            autoHideDelay: 2000,
          })
        })
        .catch((error) => {
          console.error(error)
          this.$bvToast.toast(this.$t('common.processingError'), {
            title: this.$t('common.msg'),
            variant: 'danger',
            solid: true,
            autoHideDelay: 2000,
          })
        })

      this.$emit('refresh-list')
    },

    async sendNow() {
      await this.$store
        .dispatch('mailbox/send', {
          emailId: this.selectedEmails.map((el) => {
            return el.id
          }),
          emailAccountId: this.emailAccount,
        })
        .then((response) => {
          if (response.status === 200) {
            this.$bvToast.toast('Zaznaczone e-mail zostały wysłane!', {
              title: this.$t('common.msg'),
              variant: 'danger',
              solid: true,
              autoHideDelay: 2000,
            })
          } else {
            let message = 'Powstał błąd podczas wysłania e-mail. '

            if (response.data.message) {
              message += response.data.message
            }

            this.$bvToast.toast(message, {
              title: this.$t('common.msg'),
              variant: 'danger',
              solid: true,
              autoHideDelay: 2000,
            })
          }
        })
        .catch((error) => {
          console.error(error)
          this.$bvToast.toast('Powstał błąd podczas wysłania e-mail.', {
            title: this.$t('common.msg'),
            variant: 'danger',
            solid: true,
            autoHideDelay: 2000,
          })
        })

      this.$emit('refresh-list')
    },

    addToCusromerRequest() {
      if (this.checkSelected() === false) {
        return
      }

      this.currentEmail = this.selectedEmails[0]
      this.selectCRMode = true
    },

    addToReclamation() {
      if (this.checkSelected() === false) {
        return
      }

      this.currentEmail = this.selectedEmails[0]
      this.selectReclamationMode = true
    },

    async addToCusromerRequestEnd(value) {
      this.selectCRMode = false
      if (value !== undefined) {
        this.customerRequestId = value

        if (this.newCRVersion === true) {
          this.createCRMode = true
        } else {
          this.inputCommentMode = true
        }
      }
    },

    async inputCommentEnd(value) {
      this.inputCommentMode = false

      if (this.customerRequestId !== null) {
        const object = {
          customerRequestId: this.customerRequestId,
          byEmail: true,
          emailTitle: this.currentEmail.subject,
          emailUid: this.currentEmail.uid,
          emailId: this.currentEmail.id,
          emailAccountId: this.emailAccount,
          emailType: 'INCOMING',
          files: [],
          text: value,
        }

        const response = await this.$store.dispatch('customerRequests/addComment', object)

        if (response.status === 200) {
          const result = await this.$store.dispatch('customerRequests/findByPk', {
            params: {
              id: this.customerRequestId,
            },
          })

          if (result) {
            this.$router.push({ name: 'customer-request-detail' })
          }
        }
      } else if (this.interactionId !== null) {
        const object = {
          interactionId: this.interactionId,
          byEmail: true,
          emailTitle: this.currentEmail.subject,
          emailUid: this.currentEmail.uid,
          emailId: this.currentEmail.id,
          emailAccountId: this.emailAccount,
          emailType: 'INCOMING',
          files: [],
          text: value,
        }

        const response = await this.$store.dispatch('interactions/addComment', object)

        if (response.status === 200) {
          const result = await this.$store.dispatch('interactions/findByPk', {
            viewId: this.interactionId,
            params: {
              id: this.interactionId,
            },
          })

          if (result) {
            this.$router.push({ name: 'interaction-detail', params: { id: this.interactionId } })
          }
        }
      }

      this.currentEmail = {}
      this.customerRequestId = null
      this.interactionId = null
    },

    async addToReclamationEnd(value) {
      this.selectReclamationMode = false

      if (value !== undefined) {
        const emailItem = {
          reclamationId: value,
          emailDate: new Date(),
          from: this.currentEmail.from,
          to: this.currentEmail.to,
          tittle: this.currentEmail.subject,
          uid: this.currentEmail.uid,
          emailId: this.currentEmail.id,
          accountId: this.emailAccount,
          type: 'INCOMING',
          action: 1,
        }

        const response = await this.$store.dispatch('reclamationEmails/addItem', emailItem)

        if (response === true) {
          const result = await this.$store.dispatch('reclamations/findByPk', {
            params: {
              id: value,
            },
          })

          if (result) {
            this.$router.push({ name: 'reclamation-detail' })
          }
        }
      }

      this.currentEmail = {}
    },
  },
}
</script>

<style scoped>
.label-list-item {
  padding: 0.35rem 0.75rem;
}
</style>
