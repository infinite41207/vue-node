<template>
  <b-modal
    id="cr-add-comment"
    size="xl"
    :title="`${$t('table.comment')}`"
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
          <b-form-textarea
            id="rc-comment"
            v-model="text"
            rows="6"
            name="rc-comment"
            placeholder="Wpisz komentarz ..."
          ></b-form-textarea>
        </b-col>
      </b-row>
    </b-card>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      text: '',
    }
  },

  computed: {
    textState() {
      return this.text !== ''
    },
  },

  async mounted() {
    this.$bvModal.show('cr-add-comment')
  },

  methods: {
    async handleOk() {
      this.$emit('input-comment-end', this.text)
    },

    handleCancel() {
      this.$emit('input-comment-end', '')
    },

    handelClose() {
      this.$emit('input-comment-end', '')
    },
  },
}
</script>

<style></style>
