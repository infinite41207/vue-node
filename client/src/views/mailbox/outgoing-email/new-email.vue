<template>
  <b-modal id="modal-email-form" v-model="modalShow" :title="$t('email.newMessage')" size="xl" hide-footer @close="handelClose">
    <div class="card">
      <div class="card-body">
        <b-tabs content-class="mt-1" pills justified nav-class="bg-nav-pills">
          <b-tab active :title="$t('email.contents')" title-link-class="rounded-0">
            <b-form-group size="sm" horizontal :label-cols="1" label-size="sm" :label="$t('email.from')" label-for="msgfrom">
              <b-input-group size="sm">
                <b-form-select
                  id="msgfrom"
                  v-model="email.fromId"
                  :options="emailAccounts"
                  name="msgfrom"
                  text-field="name"
                  value-field="id"
                  :state="emailFromState"
                  aria-describedby="msgfromFeedback"
                  @change="updateEmailBody"
                />
                <b-input-group-append>
                  <b-button variant="outline-secondary" @click="useCC = !useCC">DW</b-button>
                  <b-button variant="outline-secondary" @click="useBCC = !useBCC">UDW</b-button>
                </b-input-group-append>
                <b-form-invalid-feedback id="msgfromFeedback">
                  <!-- This will only be shown if the preceeding input has an invalid state -->
                  {{ $t('common.notEmptyField') }}
                </b-form-invalid-feedback>
              </b-input-group>

              <!-- <b-button>DW</b-button> -->
            </b-form-group>
            <b-form-group horizontal :label-cols="1" label-size="sm" :label="$t('email.to')" size="sm" label-for="msgto">
              <b-form-input id="msgto" v-model="email.to" type="text" list="email-to-list" class="form-control" size="sm" placeholder="example@email.com"> </b-form-input>
              <datalist id="email-to-list">
                <option v-for="(emailToEl, index) in emailToList" :key="index">{{ emailToEl }}</option>
              </datalist>
            </b-form-group>
            <b-form-group v-show="useCC" horizontal label-size="sm" :label-cols="1" :label="$t('email.cc')" label-for="msgcc">
              <b-form-input id="msgcc" v-model="email.cc" type="text" size="sm" class="form-control" placeholder="example@email.com" />
            </b-form-group>
            <b-form-group v-show="useBCC" horizontal label-size="sm" :label-cols="1" :label="$t('email.bcc')" label-for="msgbcc">
              <b-form-input id="msgbcc" v-model="email.bcc" type="text" size="sm" class="form-control" placeholder="example@email.com" />
            </b-form-group>
            <div class="form-group mb-2">
              <label for="mailsubject">{{ $t('email.subject') }}</label>
              <input id="mailsubject" v-model="email.subject" type="text" class="form-control" :placeholder="$t('email.subjectPh')" />
            </div>
            <div class="form-group write-mdg-box mb-3">
              <label>{{ $t('email.body') }}</label>
              <quill-editor ref="emailBodyEditor" v-model="email.body" :options="editorOption" />
            </div>
          </b-tab>
          <b-tab :title="`${$t('email.attachments')} (${attachmentsCount})`" title-link-class="rounded-0">
            <Attachment v-model="email.attachments" />
          </b-tab>
        </b-tabs>

        <button type="button" class="btn btn-success" @click="sendEmail">
          <b-spinner v-if="sending" class="mr-1" small></b-spinner>
          <i v-else class="ri-send-plane-2-fill mr-1"></i> {{ $t('commands.send') }}
        </button>
        <button type="button" class="btn btn-light ml-1" @click="handelCancel">{{ $t('commands.cancel') }}</button>
      </div>
    </div>
  </b-modal>
</template>

<script>
// import moment from 'moment'
import Attachment from '@/components/common/attachment'
import _ from 'lodash'
import OutgoingEmail from '@/dto/OutgoingEmail.json'
import Quill from 'quill'
import editorColors from '@/constants/editorColors'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

const Block = Quill.import('blots/block')
class DivBlock extends Block {}

DivBlock.tagName = 'DIV'

// true means we overwrite
Quill.register('blots/block', DivBlock, true)

const sizeStyle = Quill.import('attributors/style/size')
sizeStyle.whitelist = ['10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '32px', '36px']
Quill.register(sizeStyle, true)

export default {
  name: 'OutgoingEmailNew',
  components: { Attachment, quillEditor },

  props: {
    mode: {
      type: String,
      default: 'vertical',
    },
    emailTo: {
      type: String,
      default: '',
    },
    emailSubject: {
      type: String,
      default: '',
    },
    emailQuote: {
      type: String,
      default: '',
    },
    attachments: {
      type: Array,
      default() {
        return []
      },
    },
    template: {
      type: Object,
      default() {
        return {}
      },
    },
    parentObjId: {
      type: String,
      default: '',
    },
    parentObjType: {
      type: String,
      default: '',
    },
    emailLanuage: {
      type: String,
      default: 'pl',
    },
  },

  data() {
    return {
      sending: false,
      modalShow: true,
      emailAccounts: [],
      email: _.cloneDeep(OutgoingEmail),
      emailToList: ['dmytry.didenko@gmail.com'],
      useCC: false,
      useBCC: false,
      emailTemplate: null,
      templateBody: '',
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: [false, '10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '32px', '36px'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: editorColors }, { background: editorColors }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image', 'video'],
          ],
        },
      },
    }
  },

  computed: {
    bodyEditor() {
      return this.$refs.emailBodyEditor.quill
    },

    emailFromState() {
      return this.email.fromId !== null
    },

    attachmentsCount() {
      return this.email.attachments.length
    },
  },

  async mounted() {
    await this.initialize()
  },

  methods: {
    async initialize() {
      const payload = {
        noCommit: true,
        params: {
          filter: {
            isActive: true,
            forSend: true,
          },
        },
      }

      if (this.emailQuote !== '') {
        this.email.body = this.emailQuote
      }

      const response = await this.$store.dispatch('emailAccounts/findAll', payload)

      if (response.status === 200) {
        this.emailAccounts = response.data
        if (this.emailAccounts.length === 1) {
          this.email.fromId = this.emailAccounts[0].id
          await this.updateSignature()
        }
      }

      if (this.emailSubject !== '') {
        this.email.subject = this.emailSubject
      }

      if (this.emailTo !== '') {
        this.email.to = this.emailTo
      }

      this.email.date = new Date()

      for (const attachment of this.attachments) {
        this.email.attachments.push(attachment)
      }

      this.fillEmailToList()

      if (this.parentObjType !== '') {
        await this.selectEmailTemplate()
      }
    },

    async selectEmailTemplate() {
      const baseDocument = this.parentObjType
      await this.$store
        .dispatch('emailTemplates/findAll', {
          params: { baseDocument },
          noCommit: true,
        })
        .then((response) => {
          if (response.status === 200) {
            const emailTemplates = response.data.responseData
            
            if (emailTemplates) {
              if (emailTemplates.length === 1) {
                this.emailTemplate = emailTemplates[0]
                this.fillByEmailTemplate()
              }
            }
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },

    async fillByEmailTemplate() {
      if (this.emailTemplate.cc && this.emailTemplate.cc !== '') {
        this.useCC = true
        this.email.cc = this.emailTemplate.cc
      }

      if (this.emailTemplate.bcc && this.emailTemplate.bcc !== '') {
        this.useBCC = true
        this.email.bcc = this.emailTemplate.bcc
      }

      const templateLangVariants = JSON.parse(this.emailTemplate.contentVariantsList).item
      const contentVariant = templateLangVariants.find((el) => el.language === this.emailLanuage)

      if (contentVariant) {
        this.email.subject = contentVariant.title
        this.templateBody = contentVariant.content
        await this.fillTemplateParameters()
      }
    },

    async fillTemplateParameters() {
      const regex = /\[[a-zA-Z\\.]+\]/gm
      const params = []
      let m

      while ((m = regex.exec(this.email.subject)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++
        }

        m.forEach((match) => {
          params.push(match)
        })
      }

      while ((m = regex.exec(this.templateBody)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++
        }

        m.forEach((match) => {
          params.push(match)
        })
      }

      if (params.length > 0) {
        if (this.parentObjType === 'CustomerRequest') {
          await this.fillByCustomerRequest(params)
        } else if (this.parentObjType === 'Reclamation') {
          await this.fillByReclamation(params)
        } else if (this.parentObjType === 'Order') {
          await this.fillByOrder(params)
        } else if (this.parentObjType === 'Task') {
          await this.fillByTask(params)
        }
      }
    },

    async fillByCustomerRequest(params) {
      await this.$store
        .dispatch(`customerRequests/findByPk`, {
          params: { id: this.parentObjId },
          noCommit: true,
        })
        .then((response) => {
          if (response.status === 200) {
            this.fillParamsByData(params, response.data)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },

    async fillByReclamation(params) {
      await this.$store
        .dispatch(`reclamations/findByPk`, {
          params: { id: this.parentObjId },
          noCommit: true,
        })
        .then((response) => {
          if (response !== false) {
            this.fillParamsByData(params, response)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },

    async fillByOrder(params) {
      await this.$store
        .dispatch(`orders/findByPk`, {
          params: { id: this.parentObjId },
          noCommit: true,
        })
        .then((response) => {
          if (response.status === 200) {
            this.fillParamsByData(params, response.data)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },

    async fillByTask(params) {
      await this.$store
        .dispatch(`tasks/findByPk`, {
          params: { id: this.parentObjId },
          noCommit: true,
        })
        .then((response) => {
          if (response) {
            this.fillParamsByData(params, response)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },

    fillParamsByData(params, baseDocumentData) {
      for (const param of params) {
        const paramKey = param.replace('[', '').replace(']', '')
        const paramValue = this.getProp(baseDocumentData, paramKey)
        if (paramValue) {
          this.email.subject = this.email.subject.replace(param, paramValue)
          this.templateBody = this.templateBody.replace(param, paramValue)
        }
      }

      this.email.body = `${this.templateBody}${this.email.body ? this.email.body : ''}`
    },

    getProp(obj, is, value) {
      if (typeof is === 'string') return this.getProp(obj, is.split('.'), value)
      else if (is.length === 1 && value !== undefined) return (obj[is[0]] = value)
      else if (is.length === 0) return obj
      else return obj ? this.getProp(obj[is[0]], is.slice(1), value) : ''
    },

    async updateEmailBody() {
      await this.updateSignature()

      if (this.emailTemplate) {
        this.fillByEmailTemplate()
      }
    },

    async updateSignature() {
      if (this.email.fromId) {
        const response = await this.$store.dispatch('emailAccounts/getSignature', { params: { id: this.email.fromId } })

        if (response.status === 200) {
          const signature = response.data

          if (signature) {
            if (this.emailQuote !== '') {
              this.email.body = `${this.emailQuote} ${signature}`
            } else {
              this.email.body = signature
            }
          }
        }
      }
    },

    async sendEmail() {
      if (this.email.subject === '') {
        this.$bvToast.toast('Temat nie może być pusty!!!', {
          title: this.$t('common.msg'),
          variant: 'danger',
          solid: true,
          autoHideDelay: 2000,
        })
        return
      }

      this.sending = true
      const email = { ...this.email }
      const response = await this.$store.dispatch('outgoingEmails/create', email)
      if (response.status === 200) {
        this.$emit('send-email-end', response.data)
      } else {
        this.$emit('send-email-end', undefined)
      }
      this.sending = false
    },

    async fillEmailToList() {
      const response = await this.$store.dispatch('counterparties/getEmails', {})

      if (response.status === 200) {
        this.emailToList = response.data
      }
    },

    handelCancel() {
      this.$emit('send-email-end', undefined)
    },

    handelClose() {
      this.$emit('send-email-end', undefined)
    },
  },
}
</script>

<style>
.ql-picker-item[data-value='10px']::before,
.ql-picker-label[data-value='10px']::before {
  content: '10px' !important;
}

.ql-picker-item[data-value='11px']::before,
.ql-picker-label[data-value='11px']::before {
  content: '11px' !important;
}

.ql-picker-item[data-value='12px']::before,
.ql-picker-label[data-value='12px']::before {
  content: '12px' !important;
}

.ql-picker-item[data-value='14px']::before,
.ql-picker-label[data-value='14px']::before {
  content: '14px' !important;
}

.ql-picker-item[data-value='16px']::before,
.ql-picker-label[data-value='16px']::before {
  content: '16px' !important;
}

.ql-picker-item[data-value='18px']::before,
.ql-picker-label[data-value='18px']::before {
  content: '18px' !important;
}

.ql-picker-item[data-value='20px']::before,
.ql-picker-label[data-value='20px']::before {
  content: '20px' !important;
}

.ql-picker-item[data-value='24px']::before,
.ql-picker-label[data-value='24px']::before {
  content: '24px' !important;
}

.ql-picker-item[data-value='30px']::before,
.ql-picker-label[data-value='30px']::before {
  content: '30px' !important;
}

.ql-picker-item[data-value='32px']::before,
.ql-picker-label[data-value='32px']::before {
  content: '32px' !important;
}

.ql-picker-item[data-value='36px']::before,
.ql-picker-label[data-value='36px']::before {
  content: '36px' !important;
}

.ql-editor.ql-blank::before {
  content: 'Wpisz tekst tutaj...' !important;
}
</style>
