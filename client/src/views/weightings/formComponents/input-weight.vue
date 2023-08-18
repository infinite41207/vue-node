<template>
  <b-modal
    v-model="value"
    title="Wprowadż wagę"
    header-class="pr-4 pl-4 border-bottom-0"
    title-class="text-black font-18"
    body-class="pt-3 pr-4 pl-4"
    centered
    @ok="onInputWeightOK"
    @cancel="onCancel"
    @close="onClose"
  >
    <b-form>
      <b-form-input id="weightValue" v-model="currentWeight" type="number" step="0.01" min="0.00" max="500.00" class="form-control" autofocus />
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
      currentWeight: 0,
    }
  },

  computed: {},

  watch: {},

  mounted() {},

  async created() {},

  methods: {
    onInputWeightOK(event) {
      if (this.currentWeight > 0) {
        this.$emit('on-input-weight', this.currentWeight)
      }

      this.currentWeight = 0

      this.$emit('input', false)
    },
    onClose() {
      console.log('onClose')

      this.currentWeight = 0
      this.value = false
      this.$emit('input', false)
    },
    onCancel() {
      console.log('onCancel')

      this.currentWeight = 0
      this.value = false
      this.$emit('input', false)
    },
  },
}
</script>

<style>
</style>