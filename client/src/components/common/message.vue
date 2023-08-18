<template>
  <b-modal id="modal-message" hide-footer :title="$t('common.modalTitle')">
    <p class="my-4">{{ message }}</p>
  </b-modal>
</template>

<script>
export default {
  name: 'MessageDlg',

  props: {
    message: {
      type: String,
      default: '',
    },
  },
}
</script>

<style></style>
