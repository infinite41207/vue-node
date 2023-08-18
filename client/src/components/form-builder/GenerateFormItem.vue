<template>
  <div>
    <b-form-group v-if="widget.hasLabel" :label="widget.label">
      <template v-if="widget.type === 'input'">
        <b-input
          :type="widget.options.dataType"
          v-model="dataModel"
          :placeholder="widget.options.placeholder"
          :style="{ width: widget.options.width }"
          :disabled="widget.options.disabled"
        ></b-input>
      </template>

      <template v-if="widget.type === 'textarea'">
        <b-textarea
          :rows="5"
          v-model="dataModel"
          :disabled="widget.options.disabled"
          :placeholder="widget.options.placeholder"
          :style="{ width: widget.options.width }"
          :maxlength="widget.options.maxlength"
          :show-word-limit="widget.options.showWordLimit"
        ></b-textarea>
      </template>

      <template v-if="widget.type === 'number'">
        <b-input
          type="number"
          v-model="dataModel"
          :style="{ width: widget.options.width }"
          :step="widget.options.step"
          :disabled="widget.options.disabled"
          :min="widget.options.min"
          :max="widget.options.max"
        ></b-input>
      </template>

      <template v-if="widget.type === 'radio'">
        <b-radio-group v-model="dataModel" :style="{ width: widget.options.width }" :disabled="widget.options.disabled">
          <b-radio
            v-for="(item, index) in widget.options.remote ? widget.options.remoteOptions : widget.options.options"
            :key="index"
            :value="item.value"
            :style="{ display: widget.options.inline ? 'inline-block' : 'block' }"
          >
            <template v-if="widget.options.remote">{{ item.label }}</template>
            <template v-else>{{ widget.options.showLabel ? item.label : item.value }}</template>
          </b-radio>
        </b-radio-group>
      </template>

      <template v-if="widget.type === 'checkbox'">
        <b-checkbox-group v-model="dataModel" :style="{ width: widget.options.width }" :disabled="widget.options.disabled">
          <b-checkbox
            :style="{ display: widget.options.inline ? 'inline-block' : 'block' }"
            :label="item.value"
            v-for="(item, index) in widget.options.remote ? widget.options.remoteOptions : widget.options.options"
            :key="index"
          >
            <template v-if="widget.options.remote">{{ item.label }}</template>
            <template v-else>{{ widget.options.showLabel ? item.label : item.value }}</template>
          </b-checkbox>
        </b-checkbox-group>
      </template>

      <template v-if="widget.type === 'time'">
        <b-timepicker
          v-model="dataModel"
          :placeholder="widget.options.placeholder"
          :readonly="widget.options.readonly"
          :disabled="widget.options.disabled"
          :style="{ width: widget.options.width }"
        ></b-timepicker>
      </template>

      <template v-if="widget.type === 'date'">
        <b-datepicker
          v-model="dataModel"
          :type="widget.options.type"
          :placeholder="widget.options.placeholder"
          :readonly="widget.options.readonly"
          :disabled="widget.options.disabled"
          :style="{ width: widget.options.width }"
        >
        </b-datepicker>
      </template>

      <template v-if="widget.type === 'rate'">
        <b-rating v-model="dataModel" :stars="widget.options.max" :disabled="widget.options.disabled"></b-rating>
      </template>

      <template v-if="widget.type === 'color'">
        <b-form-input v-model="dataModel" :disabled="widget.options.disabled" type="color"></b-form-input>
      </template>

      <template v-if="widget.type === 'select'">
        <b-select
          v-model="dataModel"
          :disabled="widget.options.disabled"
          :multiple="widget.options.multiple"
          :placeholder="widget.options.placeholder"
          :style="{ width: widget.options.width }"
        >
          <b-select-option v-for="item in widget.options.remote ? widget.options.remoteOptions : widget.options.options" :key="item.value" :value="item.value">
            {{ widget.options.showLabel || widget.options.remote ? item.label : item.value }}
          </b-select-option>
        </b-select>
      </template>

      <template v-if="widget.type === 'switch'">
        <b-checkbox v-model="dataModel" switch :disabled="widget.options.disabled"> </b-checkbox>
      </template>

      <template v-if="widget.type === 'slider'">
        <b-input
          type="range"
          v-model="dataModel"
          :min="widget.options.min"
          :max="widget.options.max"
          :disabled="widget.options.disabled"
          :step="widget.options.step"
          :show-input="widget.options.showInput"
          :range="widget.options.range"
          :style="{ width: widget.options.width }"
        ></b-input>
      </template>

      <template v-if="widget.type === 'imgupload'">
        <!-- <fm-upload
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :style="{'width': widget.options.width}"
        :width="widget.options.size.width"
        :height="widget.options.size.height"
        :token="widget.options.token"
        :domain="widget.options.domain"
        :multiple="widget.options.multiple"
        :length="widget.options.length"
        :is-qiniu="widget.options.isQiniu"
        :is-delete="widget.options.isDelete"
        :min="widget.options.min"
        :is-edit="widget.options.isEdit"
        :action="widget.options.action"
      >
      </fm-upload> -->
      </template>

      <template v-if="widget.type === 'editor'">
        <vue-editor v-model="dataModel" :style="{ width: widget.options.width }"> </vue-editor>
      </template>

      <template v-if="widget.type === 'cascader'">
        <el-cascader
          v-model="dataModel"
          :disabled="widget.options.disabled"
          :clearable="widget.options.clearable"
          :placeholder="widget.options.placeholder"
          :style="{ width: widget.options.width }"
          :options="widget.options.remoteOptions"
        >
        </el-cascader>
      </template>

      <template v-if="widget.type === 'text'">
        <span>{{ dataModel }}</span>
      </template>
    </b-form-group>
    <div v-else>
      <template v-if="widget.type === 'button'">
        <b-button
          :variant="widget.options.variant"
          :disabled="widget.options.disabled"
          :pill="widget.options.pill"
          :squared="widget.options.squared"
          :block="widget.options.block"
          :class="widget.options.customClass"
          size="sm"
        >
          {{ widget.options.title }}
        </b-button>
      </template>

      <template v-if="widget.type === 'view-list'">
        <b-table
          ref="itemsList"
          v-model="widget.options.defaultValue"
          :fields="widget.options.fields"
          :hover="widget.options.hover"
          :striped="widget.options.striped"
          :class="widget.options.commonClass"
          :selectable="widget.options.selectable"
          :select-mode="widget.options.selectMode"
          no-local-sorting
          small
          :sort-by.sync="widget.options.sort.sortBy"
          :sort-desc.sync="widget.options.sort.sortDesc"
          :per-page="widget.options.perPage"
          :current-page="1"
          :tbody-tr-class="widget.options.bodyClass"
          :disabled="widget.options.disabled"
        ></b-table>
      </template>

      <template v-if="widget.type === 'pagination'">
        <b-pagination
          v-model="widget.options.defaultValue"
          :total-rows="widget.options.defaultTotal"
          :per-page="widget.options.perPage"
          :align="widget.options.align"
          :class="widget.options.customClass"
          :disabled="widget.options.disabled"
          size="sm"
        ></b-pagination>
      </template>

      <template v-if="widget.type === 'dropdown'">
        <b-dropdown
          :class="widget.options.customClass"
          :disabled="widget.options.disabled"
          :text="widget.options.text"
          :block="widget.options.block"
          :dropleft="widget.options.dropleft"
          :dropright="widget.options.dropright"
          :dropup="widget.options.dropup"
          :noCaret="widget.options.noCaret"
          :noFlip="widget.options.noFlip"
          :offset="widget.options.offset"
          :right="widget.options.right"
          :split="widget.options.split"
          :variant="widget.options.variant"
          size="sm"
        >
          <b-dropdown-item v-for="(ddItem, index) of widget.items" :key="index" :active="ddItem.active" :disabled="ddItem.disabled" :variant="ddItem.variant">
            {{ ddItem.text }}
          </b-dropdown-item>
        </b-dropdown>
      </template>
    </div>
  </div>
</template>

<script>
// import FmUpload from './Upload'

export default {
  props: ['widget', 'models', 'rules', 'remote'],
  components: {
    // FmUpload
  },
  data() {
    console.log(this.models)
    return {
      dataModel: this.models[this.widget.model],
    }
  },
  created() {
    if (this.widget.options.remote && this.remote[this.widget.options.remoteFunc]) {
      this.remote[this.widget.options.remoteFunc]((data) => {
        this.widget.options.remoteOptions = data.map((item) => {
          return {
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
            children: item[this.widget.options.props.children],
          }
        })
      })
    }

    if (this.widget.type === 'imgupload' && this.widget.options.isQiniu) {
      this.remote[this.widget.options.tokenFunc]((data) => {
        this.widget.options.token = data
      })
    }
  },
  methods: {},
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        this.models[this.widget.model] = val
        this.$emit('update:models', {
          ...this.models,
          [this.widget.model]: val,
        })
        this.$emit('input-change', val, this.widget.model)
      },
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModel = val[this.widget.model]
      },
    },
  },
}
</script>
