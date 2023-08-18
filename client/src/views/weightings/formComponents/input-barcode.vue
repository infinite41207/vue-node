<template>
  <b-modal
    v-model="value"
    title="Zeskanuj kod kreskowy"
    header-class="pr-4 pl-4 border-bottom-0"
    title-class="text-black font-18"
    body-class="pt-3 pr-4 pl-4"
    centered
    @ok.prevent="onScanBarcodeOK"
    @cancel="onCancel"
    @close="onClose"
  >
    <b-form>
      <b-form-input id="barCode" v-model="currentBarCode" type="text" class="form-control" placeholder="Zeskanuj kod kreskowy" autofocus />
    </b-form>
  </b-modal>
</template>


<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      currentBarCode: '',
    }
  },

  methods: {
    onScanBarcodeOK(event) {
      if (this.currentBarCode !== '') {
        this.$emit('on-input-barcode', this.currentBarCode)
      }

      this.currentBarCode = ''
      this.$emit('input', false)
    },
    onClose() {
      this.currentBarCode = ''
      this.$emit('input', false)
    },
    onCancel() {
      this.currentBarCode = ''
      this.$emit('input', false)
    },
  },
}
</script>

<style>
</style>
