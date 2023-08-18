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
              <button type="button" class="btn btn-success btn-block" @click="sendEmailMode = true">{{ $t('email.newMessage') }}</button>

              <div class="email-menu-list mt-3">
                <a href="javascript: void(0);" class="text-danger font-weight-bold" @click="goToRecievedMessages"> <i class="ri-mail-line mr-2"></i>{{ $t('email.inbox') }} </a>
                <a href="javascript: void(0);" class="text-success font-weight-bold" @click="goToSentMessages"> <i class="ri-send-plane-line mr-2"></i>{{ $t('email.sended') }} </a>
              </div>
            </div>
            <!-- End Left sidebar -->

            <div class="page-aside-right">
              <Toolbar />
              <div class="mt-3">
                <h3 class="mb-2">{{ objectView.object.subject }}</h3>
                <div>
                  <small class="float-right font-16">{{ objectView.object.date }}</small>
                  <small class="text-muted font-16">{{ $t('email.to') }}: {{ objectView.object.to }}</small>
                </div>
                <div>
                  <small v-show="showCC" class="text-muted font-16">{{ $t('email.cc') }}: {{ objectView.object.cc }}</small>
                </div>
                <div>
                  <small v-show="showBCC" class="text-muted font-16">{{ $t('email.bcc') }}: {{ objectView.object.bcc }}</small>
                </div>

                <form class="p-1">
                  <div class="form-group write-mdg-box mb-3">
                    <hr />
                    <div id="task-email-body" class="task-email-body" v-html="objectView.object.body"></div>
                  </div>

                  <hr />

                  <h5 class="mb-3">{{ $t('email.attachments') }}</h5>

                  <div class="row">
                    <div v-for="(attachment, index) of objectView.object.attachments" :key="index" class="col-xl-4">
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
                </form>
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

    <NewEmail v-if="sendEmailMode" @send-email-end="sendEmailEnd" />
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import Toolbar from './toolbar'
import NewEmail from '@/views/mailbox/outgoing-email/new-email'
import { mapGetters } from 'vuex'
import fileService from '@/utils/file-service'

/**
 * Email Read component
 */
export default {
  name: 'OutgoingEmail',
  page: {
    title: 'Email wysłany',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader, Toolbar, NewEmail },

  mixins: [fileService],
  data() {
    return {
      title: 'Email wysłany',
      sendEmailMode: false,
      viewId: this.$route.params.id,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'outgoingEmails/objectView',
      userList: 'users/getUsers',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    showCC() {
      return this.objectView.object.cc
    },

    showBCC() {
      return this.objectView.object.bcc
    },
  },

  methods: {
    goToRecievedMessages() {
      this.$router.push({ name: 'mailbox' })
    },

    goToSentMessages() {
      this.$router.push({ name: 'mailbox' })
    },

    newInternalMessage() {
      this.$router.push({ name: 'new-email' })
    },

    async sendEmailEnd(emailData) {
      this.sendEmailMode = false
    },

    async downloadFile(fileData, open) {
      // let content
      // if (!fileData.content && this.openEmail.id) {
      //   let response
      //   if (this.openEmail.attachmentsAtHardDrive === true) {
      //     response = await this.$store
      //       .dispatch('mailbox/getFile', {
      //         id: fileData.id,
      //       })
      //       .catch((error) => {
      //         console.error(error)
      //       })
      //   } else {
      //     response = await this.$store
      //       .dispatch('mailbox/getAttachment', {
      //         emailId: this.openEmail.id,
      //         filename: fileData.filename,
      //         checksum: fileData.checksum,
      //       })
      //       .catch((error) => {
      //         console.error(error)
      //       })
      //   }
      //   if (response && response.status === 200) {
      //     content = response.data
      //   }
      // } else {
      //   content = fileData.content
      // }
      // if (content) {
      //   let fileBuffer = content
      //   if (this.openEmail.attachmentsAtHardDrive !== true) {
      //     fileBuffer = new Uint8Array(content.data).buffer
      //   }
      //   const blob = new Blob([fileBuffer], { type: fileData.contentType })
      //   let fileLink = document.createElement('a')
      //   fileLink.href = window.URL.createObjectURL(blob)
      //   if (open === true && this.canOpenFileAtTab(fileData.contentType)) {
      //     fileLink.target = '_blank'
      //     fileLink.rel = 'noopener noreferrer'
      //   } else {
      //     fileLink.setAttribute('download', fileData.filename)
      //   }
      //   document.body.appendChild(fileLink)
      //   fileLink.click()
      // }
    },
  },
}
</script>
