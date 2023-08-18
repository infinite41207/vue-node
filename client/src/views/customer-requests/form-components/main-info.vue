<template>
  <div>
    <b-row>
      <b-col cols="12" md="8">
        <!-- start comments -->
        <div v-for="(comment, commentIndex) of object.comments" :key="comment.id" class="card">
          <div class="card-body pb-1">
            <b-media>
              <template v-slot:aside>
                <img class="mr-2 rounded" src="@/assets/images/users/default.png" height="32" />
              </template>

              <b-dropdown class="float-right text-muted" variant="black" right toggle-class="arrow-none card-drop p-0">
                <template v-slot:button-content>
                  <i class="ri-more-line"></i>
                </template>
                <b-link href="javascript:void(0);" class="dropdown-item" @click="editComment(comment, commentIndex)"> {{ $t('commands.edit') }}</b-link>
                <b-link href="javascript:void(0);" class="dropdown-item" :disabled="object.sended" @click="deleteComment(comment, commentIndex)">
                  {{ $t('commands.delete') }}</b-link
                >
              </b-dropdown>
              <h5 class="m-0">{{ comment.author ? comment.author.name : '' }}</h5>
              <p class="text-muted">
                <small>
                  {{ getCommentDate(comment.createdAt) }}
                  <span class="mx-1">⚬</span>
                  <span>Public</span>
                </small>
              </p>
            </b-media>

            <hr class="m-0" />

            <div v-if="comment.byEmail" class="my-1">
              <p>
                {{ comment.emailType === 'INCOMING' ? 'E-mail odebrany:' : 'E-mail wysłany:' }}
                <a href="javascript:void(0);" @click="openEmail(comment.emailAccountId, comment.emailUid, comment.emailType, comment.emailId)">{{ comment.emailTitle }}</a>
              </p>
            </div>

            <p class="my-1">
              {{ comment.text }}
            </p>

            <hr class="m-0" />
            <div v-for="(file, index) in comment.files" :key="index" class="card mb-2 shadow-none border">
              <div class="p-1">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <div class="avatar-sm">
                      <span class="avatar-title bg-primary-lighten text-primary rounded">.{{ getFileExtension(file.originalname) }}</span>
                    </div>
                  </div>
                  <div class="col pl-0">
                    <a href="javascript:void(0);" class="text-muted font-weight-bold" @click="downloadCommentFile(file, true)">{{ file.originalname }}</a>
                    <p class="mb-0">{{ getFileSizeDescription(file.size) }}</p>
                  </div>
                  <div class="col-auto">
                    <!-- Button -->
                    <a
                      v-b-tooltip.hover.bottom
                      href="javascript:void(0);"
                      :title="$t('commands.download')"
                      class="btn btn-link text-muted btn-lg p-0"
                      @click="downloadCommentFile(file, false)"
                    >
                      <i class="ri-download-cloud-2-line"></i>
                    </a>
                    <b-link
                      v-b-tooltip.hover.bottom
                      href="javascript:void(0);"
                      :title="$t('commands.delete')"
                      class="btn btn-link text-danger btn-lg p-0"
                      :disabled="object.sended"
                      @click="deleteCommentFile(comment, file, index)"
                    >
                      <i class="ri-close-line"></i>
                    </b-link>
                  </div>
                </div>
              </div>
            </div>
            <!-- end attachments -->
          </div>
        </div>
      </b-col>

      <b-col cols="12" md="4">
        <div class="card">
          <div class="card-body">
            <b-row>
              <b-col>
                <b-button variant="outline-secondary" @click="editResult"> <i class="ri-edit-box-line"></i> Dodaj / Aktualizuj wynik </b-button>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col>
                <span>
                  Kwota oferty: <br />
                  <b>{{ object.sumBrutto }}</b>
                </span>
              </b-col>
              <b-col>
                <span>
                  Waluta: <br />
                  <b>{{ object.currency }}</b>
                </span>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col>
                <span>
                  Zamówienie klienta: <br />
                  <b>{{ object.orderNumber ? object.orderNumber : 'brak' }}</b>
                </span>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col>
                <b-button variant="outline-secondary" @click="sendResult">
                  <i class="ri-save-2-line"></i>
                  {{ $t('commands.sendResult') }}
                </b-button>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col>
                <b-dropdown class="btn-group" toggle-class="arrow-none" variant="outline-secondary">
                  <template slot="button-content">
                    <i class="ri-add-line font-16"></i>
                    Dodaj załączniki
                    <i class="ri-arrow-down-s-line"></i>
                  </template>
                  <b-dropdown-item href="javascript: void(0);" @click="addResultFiles('FOR_CUSTOMER')">Dla wysłania do klienta</b-dropdown-item>
                  <b-dropdown-item href="javascript: void(0);" @click="addResultFiles('CALCULATION')">Rozrachunek ALICAD</b-dropdown-item>
                  <b-dropdown-item href="javascript: void(0);" @click="addResultFiles('FROM_CUSTOMER')">Podpisane przez klienta</b-dropdown-item>
                  <b-dropdown-item href="javascript: void(0);" @click="addResultFiles('OTHER')">Pozostałe</b-dropdown-item>
                </b-dropdown>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col>
                <p>
                  Email wysłany: <br />
                  <a href="javascript:void(0);" @click="openResultEmail(object.resultEmail)">{{ object.resultEmail ? object.resultEmail.subject : '' }}</a>
                </p>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col>
                <span>
                  Data wysłania: <br />
                  <b>{{ formatDate(object.sendingDate) }}</b>
                </span>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col>
                <span>
                  <b>Załączniki do wysłania:</b>
                </span>
              </b-col>
            </b-row>
            <div v-for="file in object.forCustomerFiles" :key="file.id">
              <div class="card mb-2 shadow-none border">
                <div class="p-1">
                  <div class="row align-items-center">
                    <div class="col-auto">
                      <div class="avatar-sm">
                        <span class="avatar-title bg-primary-lighten text-primary rounded">.{{ getFileExtension(file.originalname) }}</span>
                      </div>
                    </div>
                    <div class="col pl-0">
                      <a href="javascript:void(0);" class="text-muted font-weight-bold" @click="downloadFile(file, true)">{{ file.originalname }}</a>
                      <p class="mb-0">{{ getFileSizeDescription(file.size) }}</p>
                    </div>
                    <div class="col-auto">
                      <!-- Button -->
                      <a v-b-tooltip.hover.bottom href="javascript:void(0);" title="Download" class="btn btn-link text-muted btn-lg p-0" @click="downloadFile(file, false)">
                        <i class="ri-download-cloud-2-line"></i>
                      </a>
                      <a
                        v-b-tooltip.hover.bottom
                        href="javascript:void(0);"
                        title="Delete"
                        class="btn btn-link text-danger btn-lg p-0"
                        :disabled="object.sended"
                        @click="deleteFile(file)"
                      >
                        <i class="ri-close-line"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <b-row class="mt-2">
              <b-col>
                <span>
                  <b>Załączniki podpisane:</b>
                </span>
              </b-col>
            </b-row>
            <div v-for="file in object.fromCustomerFiles" :key="file.id">
              <div class="card mb-2 shadow-none border">
                <div class="p-1">
                  <div class="row align-items-center">
                    <div class="col-auto">
                      <div class="avatar-sm">
                        <span class="avatar-title bg-primary-lighten text-primary rounded">.{{ getFileExtension(file.originalname) }}</span>
                      </div>
                    </div>
                    <div class="col pl-0">
                      <a href="javascript:void(0);" class="text-muted font-weight-bold" @click="downloadFile(file, true)">{{ file.originalname }}</a>
                      <p class="mb-0">{{ getFileSizeDescription(file.size) }}</p>
                    </div>
                    <div class="col-auto">
                      <!-- Button -->
                      <a v-b-tooltip.hover.bottom href="javascript:void(0);" title="Download" class="btn btn-link text-muted btn-lg p-0" @click="downloadFile(file, false)">
                        <i class="ri-download-cloud-2-line"></i>
                      </a>
                      <a
                        v-b-tooltip.hover.bottom
                        href="javascript:void(0);"
                        title="Delete"
                        class="btn btn-link text-danger btn-lg p-0"
                        :disabled="object.sended"
                        @click="deleteFile(file)"
                      >
                        <i class="ri-close-line"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <b-row class="mt-2">
              <b-col>
                <span>
                  <b>Załączniki pozostałe:</b>
                </span>
              </b-col>
            </b-row>
            <div v-for="file in object.files" :key="file.id">
              <div class="card mb-2 shadow-none border">
                <div class="p-1">
                  <div class="row align-items-center">
                    <div class="col-auto">
                      <div class="avatar-sm">
                        <span class="avatar-title bg-primary-lighten text-primary rounded">.{{ getFileExtension(file.originalname) }}</span>
                      </div>
                    </div>
                    <div class="col pl-0">
                      <a href="javascript:void(0);" class="text-muted font-weight-bold" @click="downloadFile(file, true)">{{ file.originalname }}</a>
                      <p class="mb-0">{{ getFileSizeDescription(file.size) }}</p>
                    </div>
                    <div class="col-auto">
                      <!-- Button -->
                      <a v-b-tooltip.hover.bottom href="javascript:void(0);" title="Download" class="btn btn-link text-muted btn-lg p-0" @click="downloadFile(file, false)">
                        <i class="ri-download-cloud-2-line"></i>
                      </a>
                      <a
                        v-b-tooltip.hover.bottom
                        href="javascript:void(0);"
                        title="Delete"
                        class="btn btn-link text-danger btn-lg p-0"
                        :disabled="object.sended"
                        @click="deleteFile(file)"
                      >
                        <i class="ri-close-line"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <b-row class="mt-2">
              <b-col>
                <b>Załącznik z wyliczenia:</b>
              </b-col>
            </b-row>
            <div v-for="file in object.calculationFiles" :key="file.id">
              <div class="card mb-2 shadow-none border">
                <div class="p-1">
                  <div class="row align-items-center">
                    <div class="col-auto">
                      <div class="avatar-sm">
                        <span class="avatar-title bg-primary-lighten text-primary rounded">.{{ getFileExtension(file.originalname) }}</span>
                      </div>
                    </div>
                    <div class="col pl-0">
                      <a href="javascript:void(0);" class="text-muted font-weight-bold" @click="downloadFile(file, true)">{{ file.originalname }}</a>
                      <p class="mb-0">{{ getFileSizeDescription(file.size) }}</p>
                    </div>
                    <div class="col-auto">
                      <!-- Button -->
                      <a v-b-tooltip.hover.bottom href="javascript:void(0);" title="Download" class="btn btn-link text-muted btn-lg p-0" @click="downloadFile(file, false)">
                        <i class="ri-download-cloud-2-line"></i>
                      </a>
                      <a
                        v-b-tooltip.hover.bottom
                        href="javascript:void(0);"
                        title="Delete"
                        class="btn btn-link text-danger btn-lg p-0"
                        :disabled="object.sended"
                        @click="deleteFile(file)"
                      >
                        <i class="ri-close-line"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <FabButton />
          </div>
        </div>
      </b-col>
      <!-- end col -->
    </b-row>

    <Loading v-if="loading" @closed-loading="closedLoading" />
    <EditResult v-if="editResultMode" @edit-result-end="editResultEnd" />
    <AddResultFiles
      v-if="addResultFilesMode"
      :files-destination="filesDestination"
      :types-filter="fileTypesFilter"
      :multiple-selection="multipleFileSelection"
      @add-files-end="addResultFilesEnd"
    />
    <Message :message="message" />

    <NewEmail
      v-if="sendEmailMode"
      :parent-obj-id="object.id"
      parent-obj-type="CustomerRequest"
      :email-to="customerEmail"
      :email-lanuage="customerLanguage"
      :attachments="emailAttachments"
      @send-email-end="sendEmailEnd"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import EditResult from '@/views/customer-requests/form-components/edit-result'
import Loading from '@/components/common/loading'
import AddResultFiles from '@/views/customer-requests/form-components/add-result-files'
import fileService from '@/utils/file-service'
import Message from '@/components/common/message'
import NewEmail from '@/views/mailbox/outgoing-email/new-email'
import FabButton from './fab-button'

export default {
  name: 'CRMainInfo',
  components: {
    EditResult,
    AddResultFiles,
    Loading,
    Message,
    NewEmail,
    FabButton,
  },

  mixins: [fileService],

  props: {
    mode: {
      type: String,
      default: 'vertical',
    },
  },
  data() {
    return {
      viewId: this.$route.params.id,
      editResultMode: false,
      addResultFilesMode: false,
      filesDestination: 'OTHER',
      loading: false,
      message: '',
      fileTypesFilter: '',
      multipleFileSelection: true,
      notSigned: false,
      statusesList: [],
      customerEmail: '',
      customerLanguage: 'pl',
      emailAttachments: [],
      sendEmailMode: false,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'customerRequests/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      console.log('object view object', this.objectView)
      return this.objectView ? this.objectView.object : {}
    },
  },

  mounted() {
    if (this.object) {
      this.notSigned = this.object.fromCustomerFiles.length === 0
    }
  },

  methods: {
    getCommentDate(createdAt) {
      if (createdAt) {
        return moment(createdAt).format('DD.MM.YYYY hh:mm:ss')
      }
      return ''
    },

    editResult() {
      this.editResultMode = true
    },

    editResultEnd() {
      this.editResultMode = false
    },

    addResultFiles(filesDestination) {
      if (filesDestination === 'CALCULATION') {
        if (this.object.calculationFiles.length > 0) {
          this.message = 'Dla tej kategorii plik może być tylko jeden!!!'
          this.$bvModal.show('modal-message')
          return
        }

        this.fileTypesFilter = 'text/xml'
        this.multipleFileSelection = false
      }

      this.filesDestination = filesDestination
      this.addResultFilesMode = true
    },

    async addResultFilesEnd() {
      this.fileTypesFilter = ''
      this.multipleFileSelection = true
      this.addResultFilesMode = false

      if (this.notSigned === true && this.object.fromCustomerFiles.length > 0) {
        await this.setSignedStatus()
      }
    },

    async sendResult() {
      this.emailAttachments = []

      for (const file of this.object.forCustomerFiles) {
        const response = await this.$store.dispatch('customerRequests/getCRFile', {
          id: file.id,
          type: file.type,
          name: file.originalname,
        })

        if (response !== undefined && response.status === 200) {
          const blob = new Blob([response.data])
          const itemFile = new File([blob], file.originalname, { type: file.type })
          this.emailAttachments.push(itemFile)
        }
      }

      if (this.emailAttachments.length === 0) {
        return
      }

      if (this.object.customer) {
        this.customerEmail = this.object.customer.email
        this.customerLanguage = this.object.customer.language
      }

      this.sendEmailMode = true
    },

    async sendEmailEnd(emailData) {
      if (emailData === undefined) {
        this.sendEmailMode = false
        return
      }

      if (emailData !== undefined) {
        const response = await this.$store.dispatch('customerRequests/update', {
          id: this.object.id,
          updateData: { sendingDate: new Date(), sended: true, resultEmailId: emailData.id },
        })
        if (response.status === 200) {
          await this.$store.dispatch('customerRequests/findByPk', {
            params: {
              id: this.object.id,
            },
          })
        }
      }

      this.sendEmailMode = false
    },

    async setSignedStatus() {
      if (this.statusesList.length === 0) {
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
      }

      const signedStatus = this.statusesList.find((el) => el.predefinedName === 'signed')

      if (signedStatus) {
        const response = await this.$store.dispatch('customerRequests/update', {
          id: this.object.id,
          updateData: { statusId: signedStatus.id },
        })
        if (response.status === 200) {
          await this.$store.dispatch('customerRequests/findByPk', {
            params: {
              id: this.object.id,
            },
          })
        }
      }
    },

    closedLoading() {
      this.loading = false
    },

    getFileExtension(filename) {
      const re = /(?:\.([^.]+))?$/
      const ext = re.exec(filename)[1]

      return ext === undefined ? '' : ext
    },

    async downloadCommentFile(fileData, open) {
      if (this.loading === true) {
        return
      }

      this.loading = true

      await this.$store.dispatch('customerRequests/openCRCommentFile', {
        id: fileData.id,
        type: fileData.type,
        name: fileData.originalname,
        open,
      })

      this.loading = false
    },

    async downloadFile(fileData, open) {
      if (this.loading === true) {
        return
      }

      this.loading = true
      await this.$store.dispatch('customerRequests/openCRFile', {
        id: fileData.id,
        type: fileData.type,
        name: fileData.originalname,
        open,
      })

      this.loading = false
    },

    async editComment(comment, index) {
      // no actions
    },

    async deleteComment(comment, index) {
      await this.$store.dispatch('customerRequests/deleteComment', {
        id: comment.id,
        index,
      })
    },

    async openEmail(emailAccountId, emailUid, emailType, emailId) {
      if (this.loading === true) {
        return
      }

      this.loading = true

      if (emailType === 'INCOMING') {
        const response = await this.$store.dispatch('mailbox/findByUid', {
          params: {
            uid: Number(emailUid),
            emailAccountId: emailAccountId,
          },
        })

        if (response) {
          this.$router.push({ name: 'incoming-email-details' })
        }
      } else {
        const response = await this.$store.dispatch('outgoingEmails/findByPk', {
          params: {
            id: emailId,
          },
        })

        if (response.status === 200) {
          this.$router.push({ name: 'outgoing-email-details', params: { id: emailId } })
        }
      }

      this.loading = false
    },

    async openResultEmail(emailData) {
      if (this.loading === true) {
        return
      }

      this.loading = true

      const response = await this.$store.dispatch('outgoingEmails/findByPk', {
        params: {
          id: emailData.id,
        },
      })

      if (response.status === 200) {
        this.$router.push({ name: 'outgoing-email-details', id: emailData.id })
      }

      this.loading = false
    },

    async deleteCommentFile(comment, file, index) {
      await this.$store.dispatch('customerRequests/deleteCRCommentFile', {
        id: file.id,
        commentId: comment.id,
        index,
      })
    },

    formatDate(date) {
      if (date) {
        return moment(date).format('DD.MM.YYYY HH:mm:ss')
      }

      return ''
    },

    async deleteFile(file) {
      const response = await this.$store.dispatch('customerRequests/deleteCRFile', {
        id: file.id,
      })

      if (response.status === 200) {
        await this.$store.dispatch('customerRequests/findByPk', {
          params: {
            id: this.object.id,
          },
        })
      }
    },
  },
}
</script>
