<template>
  <div>
    <Fab :data="tools" />

    <AddFiles v-if="addFilesMode" :view-id="viewId" @add-files-end="addFilesEnd" />

    <AddComment v-if="addCommentMode" :view-id="viewId" @add-comment-end="addCommentEnd" />
    <AddEvent v-if="addEventMode" :view-id="viewId" @add-event-end="addEventEnd" />

    <SelectTaskFiles v-if="selectTaskFilesMode" :files="object.files" @select-files-end="addTaskEnd" />

    <NewEmail
      v-if="sendEmailMode"
      :parent-obj-id="object.id"
      parent-obj-type="Interaction"
      :email-to="customerEmail"
      :email-lanuage="customerLanguage"
      :attachments="emailAttachments"
      @send-email-end="sendEmailEnd"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import AddComment from '@/views/interactions/form-components/add-comment'
import AddEvent from '@/views/interactions/form-components/add-event'
import AddFiles from '@/views/interactions/form-components/add-files'
import SelectTaskFiles from '@/views/interactions/form-components/select-task-files'
import NewEmail from '@/views/mailbox/outgoing-email/new-email'
import fileService from '@/utils/file-service'
import Fab from '@/components/common/fab'

export default {
  name: 'InteractionFabButton',

  components: {
    AddComment,
    AddEvent,
    AddFiles,
    SelectTaskFiles,
    NewEmail,
    Fab,
  },

  mixins: [fileService],

  data() {
    return {
      addCommentMode: false,
      addEventMode: false,
      addFilesMode: false,

      selectTaskFilesMode: false,
      sendEmailMode: false,
      customerEmail: '',
      customerLanguage: 'pl',
      emailAttachments: [],
      viewId: this.$route.params.id,
      tools: [
        { title: this.$t('commands.writeEmail'), icon: 'ri-save-2-line', click: this.sendEmail },
        { title: this.$t('commands.addEvent'), icon: 'ri-delete-back-2-line', click: this.addEvent },
        { title: this.$t('commands.addComment'), icon: 'ri-delete-back-2-line', click: this.addComment },
        { title: 'Dodaj pliki', icon: 'ri-delete-back-2-line', click: this.addFiles },
        { title: this.$t('order.createTask'), icon: 'ri-delete-back-2-line', click: this.addTask },
      ],
    }
  },
  computed: {
    ...mapGetters({
      getObjectView: 'interactions/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },
  },

  methods: {
    ...mapMutations({
      updateFile: 'interactions/updateFile',
      setOpenTask: 'tasks/setOpenTask',
      setTaskProperties: 'tasks/setTaskProperties',
      setTaskParentView: 'tasks/setParentView',
    }),

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
        return // user canceled
      }

      const response = await this.$store.dispatch('interactions/addComment', {
        interactionId: this.object.id,
        text: '',
        byEmail: true,
        emailTitle: emailData.subject,
        emailId: emailData.id,
        emailUid: 0,
        emailAccountId: emailData.fromId,
        emailType: 'OUTGOING',
        files: [],
      })

      if (response.status === 200) {
        await this.$store.dispatch('interactions/findByPk', {
          viewId: this.viewId,
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

    addEvent() {
      this.addEventMode = true
    },

    addEventEnd() {
      this.addEventMode = false
    },

    addTask() {
      if (this.object.files.length === 0) {
        this.addTaskEnd([])
      } else {
        this.selectTaskFilesMode = true
      }
    },

    addTaskEnd(files) {
      this.selectTaskFilesMode = false

      if (!files) {
        return
      }

      this.updateFilesProcessed(files)

      this.setOpenTask(null)

      this.setTaskProperties({
        ownerType: 'Interaction',
        ownerId: this.object.id,
        customerId: this.object.customer ? this.object.customer.id : null,
        subjectString: `Interakcja nr ${this.object.numberStr} od ${this.object.createdAt}`,
        files: files.filter((el) => el.check === true),
      })

      if (this.object.comments && this.object.comments.length > 0) {
        if (this.object.comments[0].byEmail === true) {
          this.setTaskProperties({
            emailTitle: this.object.comments[0].emailTitle,
            emailId: this.object.comments[0].emailId,
            emailBodyType: 'html',
          })
        }
      }

      this.setTaskParentView(`sales/interaction-detail/${this.object.id}`)

      this.$router.push({ name: 'task-detail' })
    },
    
    addFiles() {
      this.addFilesMode = true
    },

    async addFilesEnd() {
      this.addFilesMode = false
    },

    async updateFilesProcessed(files) {
      for (const file of files) {
        if (file.processed !== true && file.check === true) {
          await this.$store.dispatch('interactions/updateFile', {
            id: file.id,
            updateData: {
              processed: true,
            },
          })

          this.updateFile({ viewId: this.viewId, fileId: file.id, property: 'processed', value: true })
        }
      }
    },
  },
}
</script>
