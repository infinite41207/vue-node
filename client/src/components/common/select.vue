<template>
  <b-input-group>
    <v-select
      ref="fromSelectRef"
      v-model="localValue"
      :options="options"
      :loading="false"
      :clearable="true"
      class="with-append"
      :class="{ 'is-valid': required && valueState, 'is-invalid': required && !valueState }"
      :label="label"
      :disabled="disabled"
      :placeholder="placeholder"
      @search="onSearchValue"
    >
    </v-select>
    <template v-slot:append>
      <template v-if="selectBtn">
        <b-button
          id="customer-search"
          :variant="required ? (valueState ? 'outline-success' : 'outline-danger') : 'outline-secondary fs-button'"
          :state="valueState"
          class="customer-search"
          size="sm"
          :disabled="disabled"
          @click="openSelectView"
        >
          <i class="ri-list-check"></i>
        </b-button>
      </template>
      <template v-if="openBtn">
        <b-button
          id="f-select-open"
          :variant="required ? (valueState ? 'outline-success' : 'outline-danger') : 'outline-secondary fs-button'"
          :state="valueState"
          size="sm"
          :disabled="disabled"
          @click="openDetailView"
        >
          <i class="ri-search-line"></i>
        </b-button>
      </template>
    </template>
    <SelectView v-if="valueSelectMode" :value-type="valueType" @value-selected="valueSelectedEnd" :label="label" :filter="filter" :add-btn="addBtn" :detailView="detailView" />
  </b-input-group>
</template>

<script>
import SelectView from '@/components/common/select-view'

export default {
  name: 'SelectDlg',

  components: {
    SelectView,
  },

  props: {
    value: {
      type: Object,
      default: null,
    },
    valueType: {
      type: String,
      default: null,
      require: true,
    },
    label: {
      type: String,
      default: 'name',
    },
    placeholder: {
      type: String,
      default: null,
    },
    detailView: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    selectBtn: {
      type: Boolean,
      default: false,
    },
    openBtn: {
      type: Boolean,
      default: false,
    },
    addBtn: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    filter: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      options: [],
      valueSelectMode: false,
    }
  },

  computed: {
    valueState() {
      return this.localValue !== null
    },

    localValue: {
      get() {
        return this.value
      },
      set(value) {
        if (value) {
          const currOption = this.options.find((el) => el.id === value.id)

          if (currOption) {
            this.options = [{ ...currOption }]
          }
        } else {
          this.options = []
        }

        this.$emit('input', value)
      },
    },
  },

  mounted() {
    this.initialize()
  },

  methods: {
    async initialize() {
      this.initOptions()
    },

    async initOptions() {
      if (this.localValue) {
        this.options.push({ ...this.localValue })
      }
    },

    async onSearchValue(text) {
      if (text === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: false },
          limit: 50,
          filter: {
            searchStr: text,
          },
        },
      }

      if (this.filter) {
        for (const filterProperty in this.filter) {
          reqParams.params.filter[filterProperty] = this.filter[filterProperty]
        }
      }
      const response = await this.$store.dispatch(`${this.valueType}/findAll`, {
        ...reqParams,
        noCommit: true,
      })
      if (response.status === 200) {
        this.options = response.data
      } else {
        this.options = []
      }
      if (this.localValue) {
        const existOption = this.options.find((el) => el.id === this.localValue.id)
        if (!existOption) {
          this.options.push({ ...this.localValue })
        }
      }
    },

    async openSelectView() {
      this.valueSelectMode = true
    },

    async openDetailView() {
      if (!this.localValue) {
        return
      }

      await this.$store
        .dispatch(`${this.valueType}/findByPk`, {
          params: {
            id: this.localValue.id,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            this.$router.push({ name: this.detailView, params: { id: this.localValue.id } })
          }
        })
    },

    valueSelectedEnd(value) {
      if (value !== undefined) {
        const existOption = this.options.find((el) => el.id === value.id)
        if (!existOption) {
          this.options.push({ ...value })
        }
        this.$emit('input', value)
      }

      this.valueSelectMode = false
    },
  },
}
</script>

<style>
.input-group-append .btn-sm {
  padding: 0 0.5rem !important;
}

.fs-button {
  border-color: #adb5bd;
}

.vs__dropdown-toggle,
.vs__dropdown-toggle,
.vs__dropdown-menu {
  border-color: #adb5bd;
}
</style>