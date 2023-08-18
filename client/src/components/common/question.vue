<template>
  <b-modal id="modal-question" :title="$t('common.modalTitle')" no-close-on-backdrop @hidden="onHiddenQuestion">
    <p class="my-4">{{ question }}</p>
    <template v-slot:modal-footer>
      <div class="w-100">
        <b-button-toolbar class="float-right">
          <b-button variant="outline-danger" size="sm" class="mr-2" @click="onCancelQuestion">
            {{ $t('commands.cancel') }}
          </b-button>

          <b-button variant="success" size="sm" @click="onOkQuestion">
            {{ $t('commands.ok') }}
          </b-button>
        </b-button-toolbar>
      </div>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: 'QuestionDlg',
  props: {
    question: {
      type: String,
      default: '',
    },
  },

  methods: {
    onCancelQuestion() {
      this.$emit('on-question-end', false)
      this.$bvModal.hide('modal-question')
    },

    onOkQuestion() {
      this.$emit('on-question-end', true)
      this.$bvModal.hide('modal-question')
    },

    onHiddenQuestion() {
      this.$emit('on-question-end', false)
    },
  },
}
</script>

<style></style>
