<template>
  <b-card :class="`bg-${column.id}`" class="mb-1" body-class="pt-2 pb-2">
    <div class="d-flex align-items-start">
      <b-button v-b-toggle="'s-' + column.id" variant="outline-secondary" size="sm">
        <i class="ri-pencil-fill"></i>
      </b-button>
      <div class="w-100 overflow-hidden ml-2">
        <b-row>
          <b-col class="d-flex">
            <b-form-checkbox v-model="visible" class="mt-1 ml-2 mr-1" switch size="sm"> </b-form-checkbox>
            <h5 class="mb-0"> {{ column.description }} </h5>
          </b-col>
        </b-row>
        <b-collapse :id="'s-' + column.id" class="mt-2">
          <div>
            <b-form>
              <b-row>
                <b-col>
                  <b-form-group horizontal :label-cols="3" :label="$t('table.title')" label-for="column-title">
                    <b-form-input id="column-title" v-model.trim="title" type="text" size="sm" autofocus />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-form-group horizontal :label-cols="3" :label="`${$t('common.width')} (%)`" label-for="column-width">
                    <b-form-input id="column-width" v-model.number="width" type="number" size="sm" />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row class="mt-1">
                <b-col md="4">
                  <b-form-checkbox v-model="filterable" :disabled="column.filterDisabled" switch size="sm" @change="onChangeFilterable">
                    - {{ $t('report.filtered') }}
                  </b-form-checkbox>
                </b-col>
                <b-col md="4">
                  <b-form-checkbox v-model="groupable" :disabled="functional" switch size="sm" @change="onChangeGroupable"> - {{ $t('report.grouped') }} </b-form-checkbox>
                </b-col>
                <b-col md="4">
                  <b-form-checkbox v-model="functional" :disabled="groupable" switch size="sm" @change="onChangeFunctional"> - {{ $t('report.functional') }} </b-form-checkbox>
                  <div v-if="functional" class="mt-2">
                    <b-form-group>
                      <b-form-radio-group v-model="functionVal" :options="funcValOptions" size="sm"> </b-form-radio-group>
                    </b-form-group>
                    <b-row class="">
                      <b-col>
                        <div class="d-flex">
                          <b-form-checkbox v-model="isTotal" switch @change="onChangeTotal"> </b-form-checkbox>
                          <label class="mb-0">{{ $t('report.total') }}</label>
                        </div>
                      </b-col>
                    </b-row>
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
  name: 'ReportSelectedFieldItem',

  props: {
    column: {
      type: Object,
      require: true,
      default: null,
    },
  },

  data() {
    return {
      funcValOptions: [
        { value: 'sum', text: this.$t('report.functions.sum') },
        { value: 'average', text: this.$t('report.functions.average') },
        { value: 'min', text: this.$t('report.functions.min') },
        { value: 'max', text: this.$t('report.functions.max') },
      ],
    }
  },

  computed: {
    visible: {
      get() {
        return this.column.visible
      },
      set(value) {
        this.onChangeColumnProperty({ visible: value })
      },
    },

    title: {
      get() {
        return this.column.title
      },
      set(value) {
        this.onChangeColumnProperty({ title: value })
      },
    },

    width: {
      get() {
        return this.column.width
      },
      set(value) {
        this.onChangeColumnProperty({ width: value })
      },
    },

    filterable: {
      get() {
        return this.column.filterable
      },
      set(value) {
        this.onChangeColumnProperty({ filterable: value })
      },
    },

    groupable: {
      get() {
        return this.column.groupable
      },
      set(value) {
        this.onChangeColumnProperty({ groupable: value })
      },
    },

    functional: {
      get() {
        return this.column.function
      },
      set(value) {
        this.onChangeColumnProperty({ function: value })
      },
    },

    functionVal: {
      get() {
        return this.column.functionVal
      },
      set(value) {
        this.onChangeColumnProperty({ functionVal: value })
      },
    },

    isTotal: {
      get() {
        return this.column.isTotal
      },
      set(value) {
        this.onChangeColumnProperty({ isTotal: value })
      },
    },
  },

  methods: {
    onChangeColumnProperty(propValue) {
      const column = { ...this.column }

      Object.keys(propValue).forEach((key) => {
        column[key] = propValue[key]
      })

      this.$emit('change', column)
    },

    onChangeFilterable() {
      this.$emit('change-filters')
    },

    onChangeGroupable() {
      this.$emit('change-groups')
    },

    onChangeFunctional() {
      this.$emit('change-functional')
    },

    onChangeTotal() {
      this.$emit('change-totals')
    },
  },
}
</script>

<style>
</style>