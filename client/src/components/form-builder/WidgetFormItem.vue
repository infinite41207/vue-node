<template>
  <div>
    <b-form-group
      class="widget-view"
      v-if="element.hasLabel"
      :class="{ active: selectWidget.key === element.key, 'is-req': element.options.required }"
      :label="element.label"
      @click.native.stop="handleWidgetSelect(element)"
    >
      <template v-if="element.type === 'input'">
        <b-input
          v-model="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :placeholder="element.options.placeholder"
          :disabled="element.options.disabled"
          :maxlength="element.options.maxlength"
          :show-word-limit="element.options.showWordLimit"
        ></b-input>
      </template>

      <template v-if="element.type === 'textarea'">
        <b-textarea
          :rows="5"
          v-model="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :disabled="element.options.disabled"
          :placeholder="element.options.placeholder"
          :maxlength="element.options.maxlength"
          :show-word-limit="element.options.showWordLimit"
        ></b-textarea>
      </template>

      <template v-if="element.type === 'number'">
        <b-input
          type="number"
          v-model="element.options.defaultValue"
          :disabled="element.options.disabled"
          :controls-position="element.options.controlsPosition"
          :style="{ width: element.options.width }"
        ></b-input>
      </template>

      <template v-if="element.type === 'radio'">
        <b-radio-group v-model="element.options.defaultValue" :style="{ width: element.options.width }" :disabled="element.options.disabled">
          <b-radio
            v-for="(item, index) in element.options.options"
            :key="item.value + index"
            :value="item.value"
            :style="{ display: element.options.inline ? 'inline-block' : 'block' }"
          >
            {{ element.options.showLabel ? item.label : item.value }}
          </b-radio>
        </b-radio-group>
      </template>

      <template v-if="element.type === 'checkbox'">
        <b-checkbox-group v-model="element.options.defaultValue" :style="{ width: element.options.width }" :disabled="element.options.disabled">
          <b-checkbox
            v-for="(item, index) in element.options.options"
            :key="'checkbox_' + index"
            :value="item.value"
            :style="{ display: element.options.inline ? 'inline-block' : 'block' }"
          >
            {{ element.options.showLabel ? item.label : item.value }}
          </b-checkbox>
        </b-checkbox-group>
      </template>

      <template v-if="element.type === 'time'">
        <b-timepicker
          v-model="element.options.defaultValue"
          :placeholder="element.options.placeholder"
          :readonly="element.options.readonly"
          :disabled="element.options.disabled"
          :style="{ width: element.options.width }"
        ></b-timepicker>
      </template>

      <template v-if="element.type === 'date'">
        <b-datepicker
          v-model="element.options.defaultValue"
          :type="element.options.type"
          :placeholder="element.options.placeholder"
          :readonly="element.options.readonly"
          :disabled="element.options.disabled"
          :style="{ width: element.options.width }"
        >
        </b-datepicker>
      </template>

      <template v-if="element.type === 'rate'">
        <b-rating v-model="element.options.defaultValue" :stars="element.options.max" :disabled="element.options.disabled"></b-rating>
      </template>

      <template v-if="element.type === 'color'">
        <b-input v-model="element.options.defaultValue" :disabled="element.options.disabled" type="color"></b-input>
      </template>

      <template v-if="element.type === 'select'">
        <b-select
          v-model="element.options.defaultValue"
          :disabled="element.options.disabled"
          :multiple="element.options.multiple"
          :placeholder="element.options.placeholder"
          :style="{ width: element.options.width }"
        >
          <b-select-option v-for="item in element.options.options" :key="item.value" :value="item.value">
            {{ element.options.showLabel ? item.label : item.value }}
          </b-select-option>
        </b-select>
      </template>

      <template v-if="element.type === 'switch'">
        <b-checkbox v-model="element.options.defaultValue" switch :disabled="element.options.disabled"> </b-checkbox>
      </template>

      <template v-if="element.type === 'slider'">
        <b-input
          v-model="element.options.defaultValue"
          :min="element.options.min"
          :max="element.options.max"
          :disabled="element.options.disabled"
          :step="element.options.step"
          :show-input="element.options.showInput"
          :range="element.options.range"
          :style="{ width: element.options.width }"
          type="range"
        ></b-input>
      </template>

      <template v-if="element.type === 'imgupload'">
        <!-- <fm-upload
            v-model="element.options.defaultValue"
            :disabled="element.options.disabled"
            :style="{'width': element.options.width}"
            :width="element.options.size.width"
            :height="element.options.size.height"
            token="xxx"
            domain="xxx"
          >
          </fm-upload> -->
      </template>

      <template v-if="element.type === 'cascader'">
        <el-cascader
          v-model="element.options.defaultValue"
          :disabled="element.options.disabled"
          :clearable="element.options.clearable"
          :placeholder="element.options.placeholder"
          :style="{ width: element.options.width }"
          :options="element.options.remoteOptions"
        >
        </el-cascader>
      </template>

      <template v-if="element.type === 'editor'">
        <vue-editor v-model="element.options.defaultValue" :style="{ width: element.options.width }"> </vue-editor>
      </template>

      <template v-if="element.type === 'blank'">
        <div style="height: 50px; color: #999; background: #eee; line-height: 50px; text-align: center">{{ $t('fm.components.fields.blank') }}</div>
      </template>

      <template v-if="element.type === 'text'">
        <span>{{ element.options.defaultValue }}</span>
      </template>

      <div class="widget-view-action" v-if="selectWidget.key === element.key">
        <i class="ri-file-copy-line" @click.stop="handleWidgetClone(index)"></i>
        <i class="ri-delete-bin-line" @click.stop="handleWidgetDelete(index)"></i>
      </div>
      <div class="widget-view-drag" v-if="selectWidget.key === element.key">
        <i class="ri-drag-move-2-fill"></i>
      </div>
    </b-form-group>
    <div v-else class="widget-view" :class="{ active: selectWidget.key === element.key, 'is-req': element.options.required }" @click.self.stop="handleWidgetSelect(element)">
      <template v-if="element.type === 'button'">
        <b-button
          :variant="element.options.variant"
          :disabled="element.options.disabled"
          :pill="element.options.pill"
          :squared="element.options.squared"
          :block="element.options.block"
          :class="element.options.customClass"
          size="sm"
        >
          {{ element.options.title }}
        </b-button>
      </template>

      <template v-if="element.type === 'view-list'">
        <b-table
          ref="itemsList"
          v-model="element.options.defaultValue"
          :fields="element.options.fields"
          :hover="element.options.hover"
          :striped="element.options.striped"
          :class="element.options.commonClass"
          :selectable="element.options.selectable"
          :select-mode="element.options.selectMode"
          no-local-sorting
          small
          :sort-by.sync="element.options.sort.sortBy"
          :sort-desc.sync="element.options.sort.sortDesc"
          :per-page="element.options.perPage"
          :current-page="1"
          :tbody-tr-class="element.options.bodyClass"
          :disabled="element.options.disabled"
        ></b-table>
      </template>

      <template v-if="element.type === 'pagination'">
        <b-pagination
          v-model="element.options.defaultValue"
          :total-rows="element.options.defaultTotal"
          :per-page="element.options.perPage"
          :align="element.options.align"
          :class="element.options.customClass"
          :disabled="element.options.disabled"
          size="sm"
        ></b-pagination>
      </template>

      <template v-if="element.type === 'dropdown'">
        <b-dropdown
          :class="element.options.customClass"
          :disabled="element.options.disabled"
          :text="element.options.text"
          :block="element.options.block"
          :dropleft="element.options.dropleft"
          :dropright="element.options.dropright"
          :dropup="element.options.dropup"
          :noCaret="element.options.noCaret"
          :noFlip="element.options.noFlip"
          :offset="element.options.offset"
          :right="element.options.right"
          :split="element.options.split"
          :variant="element.options.variant"
          size="sm"
        >
          <b-dropdown-item v-for="(ddItem, index) of element.items" :key="index" :active="ddItem.active" :disabled="ddItem.disabled" :variant="ddItem.variant">
            {{ ddItem.text }}
          </b-dropdown-item>
        </b-dropdown>
      </template>

      <div class="widget-view-action" v-if="selectWidget.key === element.key">
        <i class="ri-file-copy-line" @click.stop="handleWidgetClone(index, element)"></i>
        <i class="ri-delete-bin-line" @click.stop="handleWidgetDelete(index, element)"></i>
      </div>
      <div class="widget-view-drag" v-if="selectWidget.key === element.key">
        <i class="ri-drag-move-2-fill"></i>
      </div>
    </div>
  </div>
</template>

<script>
// import FmUpload from './Upload'

export default {
  props: ['element', 'select', 'index', 'data'],
  components: {
    // FmUpload,
  },
  data() {
    return {
      selectElement: '',
      selectWidget: this.select,
    }
  },
  methods: {
    handleWidgetSelect(element) {
      console.log('select', element.type)
      this.selectWidget = element
    },

    handleWidgetDelete(index, element) {
      this.getElement(this.data, element)
      let parentElement = this.selectElement
      if (!parentElement) {
        parentElement = this.data
      }

      if (parentElement.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = parentElement.list[index - 1]
        }
      } else {
        this.selectWidget = parentElement.list[index + 1]
      }

      this.$nextTick(() => {
        parentElement.list.splice(index, 1)
      })
    },

    getElement(data) {
      data.list.map((li) => {
        if (li.key === this.element.key) {
          this.selectElement = data
        } else if (li.columns && li.columns.length > 0) {
          li.columns.map((c) => {
            this.getElement(c)
          })
        } else if (li.list && li.list.length > 0) {
          this.getElement(li)
        }
      })
    },

    handleWidgetClone(index) {
      let element = this.getElement(index)
      if (!element) {
        element = this.data
      }
      const key = Date.parse(new Date().toString()) + '_' + Math.ceil(Math.random() * 99999)
      let cloneData = {
        ...element.list[index],
        options: {
          ...element.list[index].options,
          remoteFunc: 'func_' + key,
        },
        key,
        model: element.list[index].type + '_' + key,
        rules: element.list[index].rules || [],
      }

      if (element.list[index].type === 'radio' || element.list[index].type === 'checkbox' || element.list[index].type === 'select') {
        cloneData = {
          ...cloneData,
          options: {
            ...cloneData.options,
            options: cloneData.options.options.map((item) => ({ ...item })),
          },
        }
      }

      element.list.splice(index, 0, cloneData)

      this.$nextTick(() => {
        this.selectWidget = element.list[index + 1]
      })
    },
  },
  watch: {
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val)
      },
      deep: true,
    },
  },
}
</script>
