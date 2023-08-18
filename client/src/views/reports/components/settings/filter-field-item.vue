<template>
  <b-card :class="`bg-${filter.id}`" class="mb-1" body-class="pt-2 pb-2">
    <div class="d-flex align-items-start">
      <b-button v-b-toggle="'f-' + filter.id" variant="outline-secondary" size="sm">
        <i class="ri-pencil-fill"></i>
      </b-button>
      <div class="w-100 ml-2">
        <b-row>
          <b-col class="d-flex">
            <b-form-checkbox v-model="use" class="mt-1 ml-2 mr-1" switch> </b-form-checkbox>
            <h5 class="mb-0">
              {{ description }}
            </h5>
          </b-col>
        </b-row>
        <b-collapse :id="'f-' + filter.id" class="mt-2">
          <div>
            <b-form>
              <b-row>
                <b-col md="3">
                  <b-form-select v-model="operator" :options="filter.operators" size="sm"> </b-form-select>
                </b-col>
                <b-col md="9">
                  <div v-if="filter.valueType === 'object'">
                    <f-select v-model="value" select-btn open-btn :value-type="filter.type"> </f-select>
                  </div>
                  <div v-else-if="filter.valueType === 'enum'">
                    <b-form-select v-model="value" :options="options" :multiple="filter.operator === 'inList' || filter.operator === 'notInList'" size="sm"> </b-form-select>
                  </div>
                  <div v-else>
                    <b-form-input v-model="value" :type="filter.valueType" size="sm" />
                  </div>
                </b-col>
              </b-row>
            </b-form>
          </div>
        </b-collapse>
      </div>
      <i class="ri-arrow-up-down-line mt-1"></i>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'ReportFilterField',

  props: {
    filter: {
      type: Object,
      require: true,
      default: null,
    },
  },

  data() {
    return {
      options: [],
      description: '',
    }
  },

  computed: {
    use: {
      get() {
        return this.filter.use
      },
      set(value) {
        this.onChangeFilterProperty({ use: value })
      },
    },

    operator: {
      get() {
        return this.filter.operator
      },
      set(value) {
        this.onChangeFilterProperty({ operator: value })
        this.$nextTick(() => {
          this.updateFilterDescription()
        })
      },
    },

    value: {
      get() {
        return this.filter.value
      },
      set(value) {
        this.onChangeFilterProperty({ value })
        this.$nextTick(() => {
          this.updateFilterDescription()
        })
      },
    },
  },

  mounted() {
    this.updateFilterDescription()
  },

  methods: {
    onChangeFilterProperty(propValue) {
      const filter = { ...this.filter }

      Object.keys(propValue).forEach((key) => {
        filter[key] = propValue[key]
      })

      this.$emit('change', filter)
    },

    updateFilterDescription() {
      this.description = `"${this.filter.description}" ${this.$tc(`operators['${this.filter.operator}']`)} `

      let value = ''
      if (this.filter.value) {
        if (this.filter.valueType === 'object') {
          value = Array.isArray(this.filter.value) ? `[${this.filter.value[0].presentation.substring(0, 38)}...]` : this.filter.value.presentation
        } else if (this.filter.valueType === 'enum') {
          value = Array.isArray(this.filter.value) ? `[${this.filter.value[0].substring(0, 36)}...]` : this.filter.value
        } else {
          value = this.filter.value
        }
      }

      this.description += `"${value}"`
    },
  },
}
</script>

<style>
</style>