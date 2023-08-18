<template>
  <b-card :class="`bg-${column.id}`" class="mb-1" body-class="pt-2 pb-2">
    <div class="d-flex align-items-start">
      <div class="w-100 overflow-hidden ml-0 mr-2">
        <b-row>
          <b-col class="d-flex">
            <b-form-checkbox v-model="use" class="mt-1 ml-2 mr-1" switch> </b-form-checkbox>
            <b-form-input v-model="description" size="sm" />
          </b-col>
        </b-row>
      </div>
      <i class="ri-arrow-up-down-line mt-1"></i>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'ReportGroupFieldItem',

  props: {
    column: {
      type: Object,
      require: true,
      default: null,
    },
  },

  computed: {
    use: {
      get() {
        return this.column.use
      },
      set(value) {
        this.onChangeColumnProperty({ use: value })
      },
    },

    description: {
      get() {
        return this.column.description
      },
      set(value) {
        this.onChangeColumnProperty({ description: value })
      },
    },
  },

  methods: {
    onChangeColumnProperty(propValue) {
      const column = { ...this.column }

      Object.keys(propValue).forEach((key) => {
        column[key] = propValue[key]

        if (key === 'description') {
          column.title = propValue[key]
        }
      })

      this.$emit('change', column)
    },
  },
}
</script>

<style>
</style>