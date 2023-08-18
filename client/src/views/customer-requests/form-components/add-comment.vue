<template>
  <b-modal
    id="cr-add-comment"
    size="xl"
    :title="`${$t('customerRequest.addComment')}`"
    :cancel-title="$t('commands.cancel')"
    no-close-on-backdrop
    :ok-title="`${$t('commands.add')}`"
    @ok="handleOk"
    @cancel="handleCancel"
    @close="handelClose"
  >
    <b-card>
      <b-row>
        <b-col>
          <b-form-textarea id="rc-comment" v-model="object.text" rows="6" name="rc-comment" placeholder="Wpisz komentarz ..."></b-form-textarea>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-2" md="6">
          <Attachment v-model="object.files" />
        </b-col>
      </b-row>
    </b-card>
  </b-modal>
</template>

<script>
import Attachment from '@/components/common/attachment'

export default {
  name: 'CRAddComponent',
  components: {
    Attachment,
  },

  data() {
    return {
      viewId: this.$route.params.id,
      object: {
        text: '',
        files: [],
        customerRequestId: null,
        byEmail: false,
        emailUid: null,
        emailId: null,
        emailTitle: '',
        emailType: 'INCOMING',
        emailAccountId: null,
      },
    }
  },

  computed: {
    textState() {
      return this.object.text !== ''
    },
  },

  async mounted() {
    this.$bvModal.show('cr-add-comment')

    if (this.object) {
      this.object.customerRequestId = this.viewId
    }
  },

  methods: {
    async handleOk() {
      const response = await this.$store.dispatch('customerRequests/addComment', this.object)
      if (response.status === 200) {
        await this.$store.dispatch('customerRequests/findByPk', {
          viewId: this.viewId,
          params: {
            id: this.viewId,
          },
        })

        this.$emit('add-comment-end', undefined)
      }
    },

    handleCancel() {
      this.$emit('add-comment-end', undefined)
    },

    handelClose() {
      this.$emit('add-comment-end', undefined)
    },
  },
}
</script>

<style></style>
