<template>
  <b-card :class="`bg-${func.id}`" class="mb-1" body-class="pt-2 pb-2">
    <div class="d-flex align-items-start">
      <div class="w-100 ml-0">
        <b-row>
          <b-col class="d-flex">
            <b-form-checkbox v-model="use" class="mt-1 ml-2 mr-1" switch> </b-form-checkbox>
            <h5 class="mb-0"> {{ func.description }} </h5>
          </b-col>
        </b-row>
      </div>
      <i class="ri-arrow-up-down-line mt-2"></i>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'ReportResourseItem',

  props: {
    func: {
      type: Object,
      require: true,
      default: null,
    },
  },

  computed: {
    use: {
      get() {
        return this.func.use
      },
      set(value) {
        this.onChangeFuncProperty({ use: value })
      },
    },
  },

  methods: {
    onChangeFuncProperty(propValue) {
      const func = { ...this.func }

      Object.keys(propValue).forEach((key) => {
        func[key] = propValue[key]
      })

      this.$emit('change', func)
    },
  },
}
</script>

<style>
</style>