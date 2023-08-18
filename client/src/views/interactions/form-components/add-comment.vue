<template>
  <b-modal
    id="interaction-add-comment"
    size="xl"
    :title="`${$t('interaction.addComment')}`"
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
          <b-form-textarea id="item-comment" v-model="newComment.text" rows="6" name="item-comment" placeholder="Wpisz komentarz ..."></b-form-textarea>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-2" md="6">
          <Attachment v-model="newComment.files" />
        </b-col>
      </b-row>
    </b-card>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import Attachment from '@/components/common/attachment'

export default {
  name: 'InteractionAddComponent',

  components: {
    Attachment,
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
      newComment: {
        text: '',
        files: [],
        interactionId: null,
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
    ...mapGetters({
      getObjectView: 'interactions/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    textState() {
      return this.newComment.text !== ''
    },
  },

  async mounted() {
    this.$bvModal.show('interaction-add-comment')

    if (this.object) {
      this.newComment.interactionId = this.object.id
    }
  },

  methods: {
    async handleOk() {
      const response = await this.$store.dispatch('interactions/addComment', this.newComment)
      console.log('updating event list', response );

      if (response.status === 200) {
        await this.$store.dispatch('interactions/findByPk', {
          viewId: this.viewId,
          params: {
            id: this.object.id,
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
