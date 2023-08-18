<template>
  <Layout>
    <PageHeader :title="title" />
    <div class="row">
      <!-- Right Sidebar -->
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <!-- Left sidebar -->
            <div class="page-aside-left">
              <b-button variant="success" class="btn-block" size="sm" @click="newEmail">{{ $t('email.newMessage') }}</b-button>

              <div class="email-menu-list mt-3">
                <a href="javascript: void(0);" class="text-danger font-weight-bold" @click="goToRecievedEmails"> <i class="ri-mail-line mr-2"></i>{{ $t('email.inbox') }} </a>
              </div>
            </div>
            <!-- End Left sidebar -->

            <div class="page-aside-right">
              <div>
                <b-row class="mb-2">
                  <b-col>
                    <Toolbar />
                    <b-dropdown class="btn-group ml-1" toggle-class="arrow-none" variant="outline-secondary" size="sm">
                      <template slot="button-content">
                        <i class="ri-add-line mr-1"></i>
                        Utwórz na podstawie
                        <i class="ri-arrow-down-s-line"></i>
                      </template>
                      <b-dropdown-item href="javascript: void(0);" @click="createInteraction">Nową interakcję</b-dropdown-item>
                      <b-dropdown-item href="javascript: void(0);" @click="createReclamation">Nową reklamację</b-dropdown-item>
                      <b-dropdown-item href="javascript: void(0);" @click="createCusromerRequest">Nowe zapytanie ofertowe</b-dropdown-item>
                      <b-dropdown-item href="javascript: void(0);" @click="createCusromerRequestCorrection">Korektę zapytania ofertowego</b-dropdown-item>
                    </b-dropdown>
                    <b-dropdown class="btn-group ml-1" toggle-class="arrow-none" variant="outline-secondary" size="sm">
                      <template slot="button-content">
                        <i class="ri-attachment-2 mr-1"></i>
                        Dołącz do
                        <i class="ri-arrow-down-s-line"></i>
                      </template>
                      <b-dropdown-item href="javascript: void(0);" @click="addToInteraction">Interakcji</b-dropdown-item>
                      <b-dropdown-item href="javascript: void(0);" @click="addToReclamation">Reklamacji</b-dropdown-item>
                      <b-dropdown-item href="javascript: void(0);" @click="addToCusromerRequest">Zapytania ofertowego</b-dropdown-item>
                    </b-dropdown>
                  </b-col>
                </b-row>

                <NewCRItem
                  v-if="createCRMode"
                  :nev-version="false"
                  :by-email="true"
                  :email-uid="openEmail.uid"
                  :email-id="openEmail.id"
                  :email-account-id="emailAccount"
                  :email-title="openEmail.subject"
                  :new-version="newCRVersion"
                  :base-id="customerRequestId"
                  @add-new-end="createCusromerRequestEnd"
                />

                <NewReclamation
                  v-if="createReclamationMode"
                  :nev-version="false"
                  :by-email="true"
                  :email-uid="openEmail.uid"
                  :email-id="openEmail.id"
                  :email-account-id="emailAccount"
                  :email-tittle="openEmail.subject"
                  :email-from="openEmail.from.text"
                  :email-to="openEmail.to.text"
                  :email-date="openEmail.date"
                  @add-new-end="createReclamationEnd"
                />

                <CRSelect v-if="selectCRMode" :user-id="$attrs.user.id" @select-end="addToCusromerRequestEnd" />
                <InputComment v-if="inputCommentMode" @input-comment-end="inputCommentEnd" />
                <ReclamationSelect v-if="selectReclamationMode" @select-end="addToReclamationEnd" />
                <InteractionSelect v-if="selectInteractionMode" @select-end="addToInteractionEnd" />
              </div>

              <div>
                <b-row>
                  <b-col cols="6">
                    <f-select
                      v-model="counterparty"
                      select-btn
                      open-btn
                      value-type="counterparties"
                      detail-view="counterparties-detail"
                      placeholder="Wyszukaj kontrahenta..."
                    ></f-select>
                  </b-col>
                  <b-col cols="6">
                    <b-form-tags
                      tagVariant="outline-success"
                      input-id="item-labels"
                      v-model="openEmail.labels"
                      separator=" ,;"
                      placeholder=""
                      size="sm"
                      disabled
                      no-add-on-enter
                    ></b-form-tags>
                  </b-col>
                </b-row>
              </div>

              <div class="mt-3">
                <h5 class="font-18">{{ openEmail.subject }}</h5>

                <hr />

                <div class="media mb-3 mt-1">
                  <img class="d-flex mr-2 rounded-circle" src="@/assets/images/users/user.png" alt="placeholder image" height="32" />
                  <div class="media-body">
                    <small class="float-right font-16">{{ openEmail.date }}</small>
                    <small class="text-muted font-16">{{ capitalize($t('common.from')) }}: {{ openEmail.from.text }}</small>
                    <div
                      ><small class="text-muted font-16">{{ capitalize($t('common.to')) }}: {{ openEmail.to.text }}</small></div
                    >
                    <div v-if="openEmail.cc"
                      ><small class="text-muted font-16">{{ capitalize($t('email.cc')) }}: {{ openEmail.cc ? openEmail.cc.text : '' }}</small></div
                    >
                  </div>
                </div>

                <!-- eslint-disable-next-line -->
                <iframe ref="htmlBody" width="100%" height="100%" frameborder="0" @load="onLoadFrame"> </iframe>
                <!-- <div id="task-email-body" class="task-email-body" v-html="openEmail.html"></div> -->

                <hr />

                <h5 class="mb-3">{{ $t('email.attachments') }}</h5>

                <div class="row">
                  <div v-for="(attachment, index) of openEmail.attachments" :key="index" class="col-xl-4">
                    <div class="card mb-1 shadow-none border">
                      <div class="p-2">
                        <div class="row align-items-center">
                          <div class="col-auto">
                            <div class="avatar-sm">
                              <span class="avatar-title bg-primary-lighten text-primary rounded">.{{ getFileExtension(attachment.filename) }}</span>
                            </div>
                          </div>
                          <div class="col pl-0">
                            <a href="javascript:void(0);" class="text-muted font-weight-bold" @click="downloadFile(attachment, true)">{{ attachment.filename }}</a>
                            <p class="mb-0">{{ getFileSizeDescription(attachment.size) }}</p>
                          </div>
                          <div class="col-auto">
                            <!-- Button -->
                            <a href="javascript:void(0);" class="btn btn-link btn-lg text-muted">
                              <i class="ri-download-2-line" @click="downloadFile(attachment)"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- end row-->

                <div class="mt-5">
                  <b-button variant="outline-secondary" class="mr-2" size="sm" @click="onResponseEmail">
                    <i class="ri-reply-fill mr-1"></i>
                    {{ $t('email.response') }}
                  </b-button>
                  <!-- <a href class="btn btn-light">
                    Forward
                    <i class="ri-arrow-right-fill ml-1"></i>
                  </a> -->
                </div>
              </div>
              <!-- end .mt-4 -->
            </div>
            <!-- end inbox-rightbar-->
          </div>

          <div class="clearfix"></div>
        </div>
        <!-- end card-box -->
      </div>
      <!-- end Col -->
    </div>
    <!-- End row -->
    <NewEmail v-if="sendEmailMode" :email-to="newEmailData.to" :email-subject="newEmailData.subject" :email-quote="newEmailData.quote" @send-email-end="sendEmailEnd" />
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import Toolbar from './toolbar'
import { mapGetters, mapMutations } from 'vuex'
import NewCRItem from '@/views/customer-requests/form-components/new-item'
import NewReclamation from '@/views/reclamations/form_components/new-reclamation'
import InputComment from '@/components/common/input-comment'
import CRSelect from '@/views/customer-requests/select'
import ReclamationSelect from '@/views/reclamations/select'
import InteractionSelect from '@/views/interactions/select'
import fileService from '@/utils/file-service'
import NewEmail from '@/views/mailbox/outgoing-email/new-email'
import moment from 'moment'
import { uuid } from 'vue-uuid'

export default {
  name: 'IncomingEmail',

  page() {
    return {
      title: this.$t('email.title'),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },

  components: {
    Layout,
    PageHeader,
    Toolbar,
    NewCRItem,
    NewReclamation,
    CRSelect,
    InputComment,
    ReclamationSelect,
    InteractionSelect,
    NewEmail,
  },

  mixins: [fileService],

  data() {
    return {
      title: this.$t('email.title'),
      createCRMode: false,
      selectInteractionMode: false,
      createReclamationMode: false,
      selectCRMode: false,
      selectReclamationMode: false,
      sendEmailMode: false,
      inputCommentMode: false,
      customerRequestId: null,
      interactionId: null,
      newCRVersion: false,
      newEmailData: {
        to: '',
        subject: '',
        quote: '',
      },
    }
  },

  computed: {
    ...mapGetters({
      openEmail: 'mailbox/openEmail',
      emailAccount: 'mailbox/emailAccount',
    }),

    counterparty: {
      get() {
        return this.openEmail.counterparty
      },
      set(value) {
        this.onChangeCounterparty(value)
      },
    },
  },

  mounted() {
    const iFrameEl = this.$refs.htmlBody
    const elDocument = iFrameEl.contentWindow.document
    elDocument.open()
    elDocument.write(this.openEmail.html)
    elDocument.close()

    if (this.openEmail.unseen === true) {
      this.setEmailSeen()
    }
  },

  methods: {
    ...mapMutations({
      setEmailProperty: 'mailbox/setOpenEmailProperty',
    }),

    async setEmailSeen() {
      await this.$store.dispatch('mailbox/setSeen', {
        emailUid: Number(this.openEmail.uid),
        emailAccountId: this.emailAccount,
      })
    },

    goToRecievedEmails() {
      this.$router.push({ name: 'mailbox' })
    },

    goToSentEmails() {
      this.$router.push({ name: 'mailbox' })
    },

    async onChangeCounterparty(value) {
      this.setEmailProperty({ property: 'counterparty', value })
      this.setEmailProperty({ property: 'counterpartyId', value: value ? value.id : null })

      this.$store.dispatch('mailbox/update', { id: this.openEmail.id, updateData: { counterpartyId: value ? value.id : null } })
    },

    newEmail() {
      this.sendEmailMode = true
    },

    async sendEmailEnd(emailData) {
      this.sendEmailMode = false
    },

    onLoadFrame(e) {
      const iFrameEl = this.$refs.htmlBody
      const elDocument = iFrameEl.contentWindow.document
      iFrameEl.style.height = elDocument.body.scrollHeight + 'px'
    },

    capitalize(s) {
      return s[0].toUpperCase() + s.slice(1)
    },

    onResponseEmail() {
      const quote = `<br/><div>${this.openEmail.date} ${
        this.openEmail.from.html
      } napisał(a): </div><blockquote style="margin: 0px 0px 0px 0.8ex; border-left: 1px solid rgb(204, 204, 204); padding-left: 1ex;">${
        this.openEmail.textAsHtml ? this.openEmail.textAsHtml : this.openEmail.html
      }</blockquote>`

      this.newEmailData.to = this.openEmail.from.text
      this.newEmailData.subject = `Re: ${this.openEmail.subject}`
      this.newEmailData.quote = quote

      this.sendEmailMode = true
    },

    async downloadFile(fileData, open) {
      let content

      if (!fileData.content && this.openEmail.id) {
        let response
        if (this.openEmail.attachmentsAtHardDrive === true) {
          response = await this.$store
            .dispatch('mailbox/getFile', {
              id: fileData.id,
            })
            .catch((error) => {
              console.error(error)
            })
        } else {
          response = await this.$store
            .dispatch('mailbox/getAttachment', {
              emailId: this.openEmail.id,
              filename: fileData.filename,
              checksum: fileData.checksum,
            })
            .catch((error) => {
              console.error(error)
            })
        }

        if (response && response.status === 200) {
          content = response.data
        }
      } else {
        content = fileData.content
      }

      if (content) {
        let fileBuffer = content

        if (this.openEmail.attachmentsAtHardDrive !== true) {
          fileBuffer = new Uint8Array(content.data).buffer
        }

        const blob = new Blob([fileBuffer], { type: fileData.contentType })

        const fileLink = document.createElement('a')
        fileLink.href = window.URL.createObjectURL(blob)

        if (open === true && this.canOpenFileAtTab(fileData.contentType)) {
          fileLink.target = '_blank'
          fileLink.rel = 'noopener noreferrer'
        } else {
          fileLink.setAttribute('download', fileData.filename)
        }

        document.body.appendChild(fileLink)
        fileLink.click()
      }
    },

    createCusromerRequest() {
      this.createCRMode = true
    },

    createCusromerRequestCorrection() {
      this.selectCRMode = true
      this.newCRVersion = true
    },

    async createInteraction() {
      const viewId = uuid.v4()

      await this.$store.dispatch('interactions/addNew', {
        viewId,
        nevVersion: false,
        byEmail: true,
        emailData: {
          uid: this.openEmail.uid,
          id: this.openEmail.id,
          title: this.openEmail.subject,
          from: this.openEmail.from.text,
          type: 'INCOMING',
          filesAtHardDrive: this.openEmail.attachmentsAtHardDrive,
          files: this.openEmail.attachments,
          emailAccountId: this.emailAccount,
        },
      })

      this.$router.push({ name: 'interaction-detail', params: { id: viewId } })
    },

    createReclamation() {
      this.createReclamationMode = true
    },

    createCusromerRequestEnd() {
      this.createCRMode = false
    },

    createReclamationEnd() {
      this.createReclamationMode = false
    },

    addToCusromerRequest() {
      this.selectCRMode = true
    },

    addToReclamation() {
      this.selectReclamationMode = true
    },

    addToInteraction() {
      this.selectInteractionMode = true
    },

    async addToInteractionEnd(value) {
      this.selectInteractionMode = false
      if (value !== undefined) {
        this.interactionId = value
        this.inputCommentMode = true
      }
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
          emailTitle: this.openEmail.subject,
          emailUid: this.openEmail.uid,
          emailId: this.openEmail.id,
          emailAccountId: this.emailAccount,
          emailType: 'INCOMING',
          files: [],
          text: value,
        }

        let content

        for (const file of this.openEmail.attachments) {
          if (file.filename && file.contentDisposition === 'attachment') {
            if (!file.content && this.openEmail.id) {
              const response = await this.$store.dispatch('mailbox/getAttachment', {
                emailId: this.openEmail.id,
                filename: file.filename,
                checksum: file.checksum,
              })

              if (response.status === 200) {
                content = response.data
              }
            } else {
              content = file.content
            }

            if (content) {
              const fileBuffer = new Uint8Array(content.data).buffer
              const blob = new Blob([fileBuffer], { type: file.contentType })
              const itemFile = new File([blob], file.filename, { type: file.contentType })

              object.files.push(itemFile)
            }
          }
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
          emailTitle: this.openEmail.subject,
          emailUid: this.openEmail.uid,
          emailId: this.openEmail.id,
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

      this.customerRequestId = null
      this.interactionId = null
    },

    async addToReclamationEnd(value) {
      this.selectReclamationMode = false
      if (value !== undefined) {
        const emailItem = {
          reclamationId: value,
          emailDate: moment(this.openEmail.date, 'DD.MM.YYYY hh:mm:ss').toISOString(),
          from: this.openEmail.from.text,
          to: this.openEmail.to.text,
          tittle: this.openEmail.subject,
          uid: this.openEmail.uid,
          emailId: this.openEmail.id,
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
    },
  },
}
</script>
