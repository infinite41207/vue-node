<template>
  <b-modal v-model="visible" :title="title" hide-footer no-close-on-backdrop @hidden="onHiddenLoading">
    <div class="d-flex justify-content-center">
      <div class="spinner-border" role="status"></div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'LoadingDlg',

  data() {
    return {
      visible: true,
      title: 'Ładowanie...',
    }
  },

  methods: {
    onHiddenLoading() {
      this.$emit('closed-loading')
    },
  },
}
</script>

<style></style>
