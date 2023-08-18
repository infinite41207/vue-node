<template>
  <div>
    <Fab :data="tools" />

    <AddComment v-if="addCommentMode" @add-comment-end="addCommentEnd" />

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
import Fab from '@/components/common/fab'
import AddComment from '@/views/customer-requests/form-components/add-comment'
import NewEmail from '@/views/mailbox/outgoing-email/new-email'

export default {
  name: 'CRFabButton',

  components: {
    AddComment,
    NewEmail,
    Fab,
  },
  data() {
    return {
      viewId: this.$route.params.id,
      addCommentMode: false,
      sendEmailMode: false,
      customerEmail: '',
      customerLanguage: 'pl',
      emailAttachments: [],
      tools: [
        { title: this.$t('commands.writeEmail'), icon: 'ri-save-2-line', click: this.sendEmail },
        { title: this.$t('commands.addComment'), icon: 'ri-delete-back-2-line', click: this.addComment },
      ],
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
      return this.objectView ? this.objectView.object : {}
    },
  },

  methods: {
    sendEmail() {
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

      const response = await this.$store.dispatch('customerRequests/addComment', {
        customerRequestId: this.object.id,
        text: '',
        byEmail: true,
        emailTitle: emailData.subject,
        emailUid: 0,
        emailId: emailData.id,
        emailAccountId: emailData.fromId,
        emailType: 'OUTGOING',
        files: [],
      })
      if (response.status === 200) {
        await this.$store.dispatch('customerRequests/findByPk', {
          params: {
            id: this.object.id,
          },
        })
      }
      this.sendEmailMode = false
    },

    addComment() {
      this.addCommentMode = true
    },

    addCommentEnd() {
      this.addCommentMode = false
    },
  },
}
</script>
