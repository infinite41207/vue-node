<script>
import GenetateFormItem from './GenerateFormItem'
import { h } from 'vue'

export default {
  name: 'fm-generate-form',
  components: {
    GenetateFormItem,
  },
  props: ['data', 'remote', 'value', 'insite'],

  render() {
    const dataItemsArray = []
    if (this.data.config.toolbarContentList) {
      for (const currentElement of this.data.config.toolbarContentList) {
        if (currentElement) {
          const curItem = h('a', {
            key: 'tb_' + currentElement.index,
            href: currentElement.href,
            class: 'ml-3 text-secondary ri-file-edit-line',
            attrs: {
              href: currentElement.href,
              class: 'ml-3 text-secondary ri-file-edit-line',
            },
            on: {
              click: () => {
                if (currentElement.method) {
                  this.executeFormMethod(currentElement.method)
                }
              },
            },
          })

          if (curItem) {
            dataItemsArray.push(curItem)
          }
        }
      }
    }

    for (let i = 0; i < this.data.list.length; i++) {
      const currentElement = this.data.list[i]
      if (currentElement && currentElement.key) {
        let curItem
        if (!currentElement.layout) {
          curItem = this.addWidgetItem(currentElement, i)
        } else {
          curItem = this.addLayoutItem(currentElement, i)
        }

        if (curItem) {
          dataItemsArray.push(curItem)
        }
      }
    }

    const formArray = []
    formArray.push(
      h(
        'b-form',
        {
          ref: 'generateForm',
          size: this.data.config.size,
          models: this.models,
          rules: this.rules,
          'label-suffix': ':',
          'label-position': this.data.config.labelPosition,
          'label-width': this.data.config.labelWidth + 'px',
        },
        dataItemsArray
      )
    )

    const rootDiv = h('div', { class: 'fm-style' }, [formArray])

    return rootDiv
  },

  data() {
    return {
      models: {},
      rules: {},
    }
  },
  created() {
    this.generateModle(this.data.list)
  },
  mounted() {},
  methods: {
    executeFormMethod(methodName) {
      const methodList = this.data.config.methodsList

      const foundMethod = methodList.find((el) => el.name === methodName)
      if (foundMethod) {
        this.executeConditionCode(foundMethod.functionBody)
      }
    },

    executeConditionCode(str, args) {
      const conditionFunction = new Function('args', str)
      const conditionRes = conditionFunction(args)
      return conditionRes
    },

    async executeAsyncConditionCode(str, args) {
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

      // Define two named arguments: inValue, delay
      const asyncFn = new AsyncFunction('args', str)

      // resolves to 'hello' after 100ms
      const result = await asyncFn(args)

      console.log('async result', result)
    },

    isLayoutType(curType) {
      if (curType === 'grid' || curType === 'b-card') {
        return true
      } else {
        return false
      }
    },

    addWidgetItem(currentElement, i) {
      const widgetFormItem = h('genetate-form-item', {
        key: 'templ_' + currentElement.key,
        attrs: {
          key: currentElement.key,
          element: currentElement,
          models: this.models,
          // model: currentElement.model,
          select: this.selectWidget,
          index: i,
          data: this.data,
          rules: currentElement.rules,
          widget: currentElement,
        },
        on: {
          'update:select': (val) => {
            this.selectWidget = val
          },
        },
      })
      return widgetFormItem
    },

    renderCommonLayout(currentElement, i) {
      const dataItemsArray = this.renderListItems(currentElement.list)

      let layoutItem
      const classString = 'widget-col widget-view active'

      if (currentElement.type === 'container') {
        layoutItem = h(
          'b-container',
          {
            class: `${classString} ${currentElement.options.customClass}`,
            key: currentElement.key,
            select: this.selectWidget,
            props: {
              fluid: currentElement.options.fluid,
            },

            on: {
              'update:select': (val) => {
                this.selectWidget = val
              },
            },
          },
          [dataItemsArray]
        )
      } else if (currentElement.type === 'card') {
        layoutItem = h(
          'b-card',
          {
            class: `${classString} ${currentElement.options.customClass}`,
            key: currentElement.key,
            select: this.selectWidget,
            props: {
              title: currentElement.options.title,
              subTitle: currentElement.options.subTitle,
            },
            on: {
              'update:select': (val) => {
                this.selectWidget = val
              },
            },
          },
          [dataItemsArray]
        )
      } else if (currentElement.type === 'toolbar') {
        layoutItem = h(
          'b-button-toolbar',
          {
            class: `${classString} ${currentElement.options.customClass}`,
            key: currentElement.key,
            select: this.selectWidget,
            props: {
              keyNav: true,
            },
            on: {
              'update:select': (val) => {
                this.selectWidget = val
              },
            },
          },
          [dataItemsArray]
        )
      } else if (currentElement.type === 'btnGroup') {
        layoutItem = h(
          'b-button-group',
          {
            class: `${classString} ${currentElement.options.customClass}`,
            key: currentElement.key,
            select: this.selectWidget,
            props: {
              vertical: currentElement.options.vertical,
              size: 'sm',
            },
            on: {
              'update:select': (val) => {
                this.selectWidget = val
              },
            },
          },
          [dataItemsArray]
        )
      } else {
        layoutItem = h(
          'b-collapse',
          {
            class: `${classString} ${currentElement.options.customClass}`,
            key: currentElement.key,
            select: this.selectWidget,
            props: {
              visible: currentElement.options.defaultValue,
              accordion: currentElement.options.accordion,
              appear: currentElement.options.appear,
            },
            on: {
              'update:select': (val) => {
                this.selectWidget = val
              },
            },
          },
          [dataItemsArray]
        )
      }

      return layoutItem
    },

    addLayoutItem(currentElement, i) {
      if (currentElement.type === 'grid') {
        return this.renderGridLayout(currentElement, i)
      } else {
        return this.renderCommonLayout(currentElement, i)
      }
    },

    renderGridLayout(currentElement, i) {
      const colItems = []
      for (let col = 0; col < currentElement.columns.length; col++) {
        const currentColumn = currentElement.columns[col]
        const dataItemsArray = this.renderListItems(currentColumn.list)

        const colItem = h(
          'b-col',
          {
            key: col.index,
            select: this.selectWidget,
            class: currentColumn.customClass,
            props: {
              cols: currentColumn.cols ? currentColumn.cols : 0,
              sm: currentColumn.sm !== null ? currentColumn.sm : null,
              md: currentColumn.md !== null ? currentColumn.md : null,
              lg: currentColumn.lg !== null ? currentColumn.lg : null,
              xl: currentColumn.xl !== null ? currentColumn.xl : null,
              offset: currentColumn.offset ? currentColumn.offset : 0,
              offsetSm: currentColumn.offsetSm !== null ? currentColumn.offsetSm : null,
              offsetMd: currentColumn.offsetMd !== null ? currentColumn.offsetMd : null,
              offsetLg: currentColumn.offsetLg !== null ? currentColumn.offsetLg : null,
              offsetXl: currentColumn.offsetXl !== null ? currentColumn.offsetXl : null,
              order: currentColumn.order ? currentColumn.order : 0,
              orderSm: currentColumn.orderSm !== null ? currentColumn.orderSm : null,
              orderMd: currentColumn.orderMd !== null ? currentColumn.orderMd : null,
              orderLg: currentColumn.orderLg !== null ? currentColumn.orderLg : null,
              orderXl: currentColumn.orderXl !== null ? currentColumn.orderXl : null,
              alignSelf: currentColumn.alignSelf,
              tag: currentColumn.tag,
            },
            on: {
              'update:select': (val) => {
                this.selectWidget = val
              },
            },
          },
          [dataItemsArray]
        )
        colItems.push(colItem)
      }

      const classString = 'widget-col widget-view el-row is-align-top el-row--flex active'

      const rowItem = h(
        'b-row',
        {
          class: `${classString} ${currentElement.options.customClass}`,
          key: currentElement.key,
          select: this.selectWidget,
          props: {
            noGutters: currentElement.options.noGutter ? currentElement.options.noGutter : false,
            alignH: currentElement.options.alignH,
            alignV: currentElement.options.alignV,
            alignContent: currentElement.options.alignContent,
            tag: currentElement.options.tag,
            cols: currentElement.options.cols,
            colsSm: currentElement.options.colsSm,
            colsMd: currentElement.options.colsMd,
            colsLg: currentElement.options.colsLg,
            colsXl: currentElement.options.colsXl,
          },

          on: {
            'update:select': (val) => {
              this.selectWidget = val
            },
          },
        },
        colItems
      )

      return rowItem
    },

    renderListItems(list) {
      const dataItemsArray = []

      for (let i = 0; i < list.length; i++) {
        const currentElement = list[i]
        if (currentElement && currentElement.key) {
          let curentItem
          if (!currentElement.layout) {
            curentItem = this.addWidgetItem(currentElement, i)
          } else {
            curentItem = this.addLayoutItem(currentElement, i)
          }
          if (curentItem) {
            dataItemsArray.push(curentItem)
          }
        }
      }

      return dataItemsArray
    },

    generateModle(genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach((item) => {
            this.generateModle(item.list)
          })
        } else {
          if (this.value && Object.keys(this.value).indexOf(genList[i].model) >= 0) {
            this.models[genList[i].model] = this.value[genList[i].model]
          } else {
            if (genList[i].type === 'blank') {
              this.$set(this.models, genList[i].model, genList[i].options.defaultType === 'String' ? '' : genList[i].options.defaultType === 'Object' ? {} : [])
            } else {
              this.models[genList[i].model] = genList[i].options.defaultValue
            }
          }

          if (this.rules[genList[i].model]) {
            this.rules[genList[i].model] = [
              ...this.rules[genList[i].model],
              ...genList[i].rules.map((item) => {
                if (item.pattern) {
                  return { ...item, pattern: new RegExp(item.pattern) }
                } else {
                  return { ...item }
                }
              }),
            ]
          } else {
            this.rules[genList[i].model] = [
              ...genList[i].rules.map((item) => {
                if (item.pattern) {
                  return { ...item, pattern: new RegExp(item.pattern) }
                } else {
                  return { ...item }
                }
              }),
            ]
          }
        }
      }
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate((valid) => {
          if (valid) {
            resolve(this.models)
          } else {
            reject(new Error(this.$t('fm.message.validError')).message)
          }
        })
      })
    },
    reset() {
      this.$refs.generateForm.resetFields()
    },
    onInputChange(value, field) {
      this.$emit('on-change', field, value, this.models)
    },
    refresh() {},
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.generateModle(val.list)
      },
    },
    value: {
      deep: true,
      handler(val) {
        this.models = { ...this.models, ...val }
      },
    },
  },
}
</script>

<style lang="scss">
// @import '../styles/cover.scss';
</style>
