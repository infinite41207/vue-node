<script>
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem'

import { h } from 'vue'

export default {
  components: {
    Draggable,
    WidgetFormItem,
  },
  props: ['data', 'select'],
  data() {
    return {
      selectWidget: this.select,
      selectElement: '',
      selectVal: false,
    }
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

  mounted() {
    document.body.ondrop = function (event) {
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isFirefox) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },

  render() {
    const formArray = []
    if (this.data.list.length === 0) {
      formArray.push(h('div', { class: 'form-empty' }, this.$t('fm.description.containerEmpty')))
    }

    const dataItemsArray = []

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

    const transitionGroupItem = h(
      'transition-group',
      {
        class: 'widget-form-list',
        name: 'fade',
        tag: 'div',
      },
      dataItemsArray
    )

    const draggableItem = h(
      'draggable',
      {
        class: '',
        attrs: {
          group: 'form-widget',
          ghostClass: 'ghost',
          animation: 200,
          handle: '.ri-drag-move-2-fill',
        },
        props: {
          value: this.data.list,
        },
        on: {
          input: (newValue) => {
            this.data.list = newValue
          },
          end: () => {
            this.handleMoveEnd()
          },
          add: (event) => {
            this.handleWidgetAdd(event, this.data)
          },
        },
      },
      [transitionGroupItem]
    )

    formArray.push(
      h(
        'b-form',
        {
          size: this.data.config.size,
          'label-suffix': ':',
          'label-position': this.data.config.labelPosition,
          'label-width': this.data.config.labelWidth + 'px',
        },
        [draggableItem]
      )
    )

    const rootDiv = h('div', { class: 'widget-form-container' }, [formArray])
    return rootDiv
  },

  methods: {
    getWidgetAction(index, element) {
      const div_i = h('i', {
        class: `ri-delete-bin-line ${this.selectWidget?.key === element.key ? '' : 'd-none'}`,
        attrs: {
          id: element.key,
        },
        on: {
          click: () => {
            this.handleWidgetDelete(index, element)
          },
        },
      })

      const drag_div = h(
        'div',
        {
          class: 'widget-view-action widget-col-action',
        },
        [div_i]
      )
      return drag_div
    },

    getWidgetDrag(index, element) {
      const div_i = h('i', {
        class: `ri-drag-move-2-fill ${this.selectWidget.key === element.key ? '' : 'd-none'}`,
      })

      const drag_div = h(
        'div',
        {
          class: 'widget-view-drag widget-col-drag',
        },
        [div_i]
      )
      return drag_div
    },

    addWidgetItem(currentElement, i) {
      const widgetFormItem = h('widget-form-item', {
        key: 'templ_' + currentElement.key,
        props: {
          key: currentElement.key,
          element: currentElement,
          select: this.selectWidget,
          index: i,
          data: this.data,
        },
        on: {
          'update:select': (val) => {
            this.selectWidget = val
          },
        },
      })
      return widgetFormItem
    },

    addLayoutItem(currentElement, i) {
      if (currentElement.type === 'grid') {
        return this.renderGridLayout(currentElement, i)
      }
      if (currentElement.type === 'inputGroup') {
        return this.renderInputGroupLayout(currentElement, i)
      } else {
        return this.renderCommonLayout(currentElement, i)
      }
    },

    renderGridLayout(currentElement, i) {
      const colItems = []
      for (let col = 0; col < currentElement.columns.length; col++) {
        const currentColumn = currentElement.columns[col]
        const dataItemsArray = this.renderListItems(currentColumn.list)
        const transitionGroupItem = this.renderTransitionGroupItem(dataItemsArray)

        const draggableItem = h(
          'draggable',
          {
            class: '',
            attrs: {
              group: 'form-widget',
              ghostClass: 'ghost',
              animation: 200,
              handle: '.ri-drag-move-2-fill',
            },
            props: {
              'no-transition-on-drag': true,
              value: currentColumn.list,
            },
            on: {
              input: function (newValue) {
                currentColumn.list = newValue
              },
              end: () => {
                this.handleMoveEnd()
              },
              add: (event) => {
                this.handleWidgetColAdd(event, currentElement, col)
              },
            },
          },
          [transitionGroupItem]
        )

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
          [draggableItem]
        )
        colItems.push(colItem)
      }

      colItems.push(this.getWidgetAction(i, currentElement))
      colItems.push(this.getWidgetDrag(i, currentElement))

      const classString = `widget-col widget-view ${this.selectWidget.key === currentElement.key ? 'active' : ''}`

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
            click: () => {
              this.handleSelectWidget(currentElement)
            },
          },
        },
        colItems
      )

      return rowItem
    },

    renderInputGroupLayout(currentElement, i) {
      const mainItemsArray = this.renderListItems(currentElement.list)
      const horizontalItems = this.isHorizontalItems(currentElement)
      const transitionMainGroupItem = this.renderTransitionGroupItem(mainItemsArray, horizontalItems)

      const containerItems = []

      const draggableItem = h(
        'draggable',
        {
          class: '',
          attrs: {
            group: 'form-widget',
            ghostClass: 'ghost',
            animation: 200,
            handle: '.ri-drag-move-2-fill',
          },
          props: {
            'no-transition-on-drag': true,
            value: currentElement.list,
          },
          on: {
            input: function (newValue) {
              currentElement.list = newValue
            },
            end: () => {
              this.handleMoveEnd()
            },
            add: (event) => {
              this.handleWidgetAdd(event, currentElement)
            },
          },
        },
        [transitionMainGroupItem]
      )

      // const prependItem = h(
      //   'b-input-group-prepend',
      //   {
      //     class: `${classString} ${currentElement.options.customClass}`,
      //     key: currentElement.key,
      //     select: this.selectWidget,
      //     props: {},
      //     on: {
      //       'update:select': (val) => {
      //         this.selectWidget = val
      //       },
      //       click: () => {
      //         this.handleSelectWidget(currentElement, 'prepend')
      //       },
      //     },
      //   },
      //   [draggableItem]
      // )

      containerItems.push(draggableItem)
      containerItems.push(this.getWidgetAction(i, currentElement))
      containerItems.push(this.getWidgetDrag(i, currentElement))

      const classString = `widget-view ${this.selectWidget.key === currentElement.key ? 'active' : ''}`

      const layoutItem = h(
        'b-input-group',
        {
          class: `${classString} ${currentElement.options.customClass}`,
          key: currentElement.key,
          select: this.selectWidget,
          props: {},
          on: {
            'update:select': (val) => {
              this.selectWidget = val
            },
            click: () => {
              this.handleSelectWidget(currentElement)
            },
          },
        },
        [containerItems]
      )

      return layoutItem
    },

    renderCommonLayout(currentElement, i) {
      const dataItemsArray = this.renderListItems(currentElement.list)
      const horizontalItems = this.isHorizontalItems(currentElement)
      const transitionGroupItem = this.renderTransitionGroupItem(dataItemsArray, horizontalItems)

      const containerItems = []

      const draggableItem = h(
        'draggable',
        {
          class: '',
          attrs: {
            group: 'form-widget',
            ghostClass: 'ghost',
            animation: 200,
            handle: '.ri-drag-move-2-fill',
          },
          props: {
            'no-transition-on-drag': true,
            value: currentElement.list,
          },
          on: {
            input: function (newValue) {
              currentElement.list = newValue
            },
            end: () => {
              this.handleMoveEnd()
            },
            add: (event) => {
              this.handleWidgetAdd(event, currentElement)
            },
          },
        },
        [transitionGroupItem]
      )

      containerItems.push(draggableItem)
      containerItems.push(this.getWidgetAction(i, currentElement))
      containerItems.push(this.getWidgetDrag(i, currentElement))

      let layoutItem
      const classString = `widget-view ${this.selectWidget.key === currentElement.key ? 'active' : ''}`

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
              click: () => {
                this.handleSelectWidget(currentElement)
              },
            },
          },
          [containerItems]
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
              click: () => {
                this.handleSelectWidget(currentElement)
              },
            },
          },
          [containerItems]
        )
      } else if (currentElement.type === 'toolbar') {
        const toolbarItem = h(
          'b-button-toolbar',
          {
            class: `${currentElement.options.customClass}`,
            key: `${currentElement.key}${i}`,
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
          [containerItems]
        )

        layoutItem = h(
          'div',
          {
            class: `${classString}`,
            key: currentElement.key,
            select: this.selectWidget,
            on: {
              'update:select': (val) => {
                this.selectWidget = val
              },
              click: () => {
                this.handleSelectWidget(currentElement)
              },
            },
          },
          [toolbarItem]
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
              click: () => {
                this.handleSelectWidget(currentElement)
              },
            },
          },
          [containerItems]
        )
      } else if (currentElement.type === 'collapse') {
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
              click: () => {
                this.handleSelectWidget(currentElement)
              },
            },
          },
          [containerItems]
        )
      }

      return layoutItem
    },

    isHorizontalItems(currentElement) {
      if (currentElement.type === 'toolbar' || currentElement.type === 'inputGroup') {
        return true
      }

      if (currentElement.type === 'btnGroup') {
        return currentElement.options.vertical === false
      }

      return false
    },

    handleMoveEnd() {},

    handleSelectWidget(element) {
      if (this.selectVal === false) {
        this.selectWidget = element
        this.selectVal = true
        setTimeout(() => {
          this.selectVal = false
        }, 100)
      }
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

    renderTransitionGroupItem(dataItemsArray, horizontalItems = false) {
      return h(
        'transition-group',
        {
          class: `widget-form-list-child ${horizontalItems === true ? 'row' : ''}`,
          name: 'fade',
          tag: 'div',
        },
        dataItemsArray
      )
    },

    handleWidgetAdd(evt, currentItem) {
      const newIndex = evt.newIndex

      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      this.$set(currentItem.list, newIndex, {
        ...currentItem.list[newIndex],
        options: {
          ...currentItem.list[newIndex].options,
        },
        key,
        name: this.getItemName(currentItem.list[newIndex].type),
        model: currentItem.list[newIndex].hasModel ? currentItem.list[newIndex].type + '_' + key : null,
        rules: [],
      })

      if (currentItem.list[newIndex].type === 'radio' || currentItem.list[newIndex].type === 'checkbox' || currentItem.list[newIndex].type === 'select') {
        this.$set(currentItem.list, newIndex, {
          ...currentItem.list[newIndex],
          options: {
            ...currentItem.list[newIndex].options,
            options: currentItem.list[newIndex].options.options.map((item) => ({
              ...item,
            })),
          },
        })
      }

      if (currentItem.list[newIndex].type === 'grid') {
        this.$set(currentItem.list, newIndex, {
          ...currentItem.list[newIndex],
          columns: currentItem.list[newIndex].columns.map((item) => ({ ...item })),
        })
      }

      this.selectWidget = currentItem.list[newIndex]
    },

    handleWidgetColAdd($event, row, colIndex) {
      const newIndex = $event.newIndex
      const oldIndex = $event.oldIndex
      const item = $event.item

      if (item.className.indexOf('data-grid') >= 0) {
        item.tagName === 'DIV' && this.data.list.splice(oldIndex, 0, row.columns[colIndex].list[newIndex])
        row.columns[colIndex].list.splice(newIndex, 1)

        return false
      }

      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)

      this.$set(row.columns[colIndex].list, newIndex, {
        ...row.columns[colIndex].list[newIndex],
        options: {
          ...row.columns[colIndex].list[newIndex].options,
        },
        key,
        name: this.getItemName(row.columns[colIndex].list[newIndex].type),
        model: row.columns[colIndex].list[newIndex].hasModel ? row.columns[colIndex].list[newIndex].type + '_' + key : null,
        rules: [],
      })

      if (
        row.columns[colIndex].list[newIndex].type === 'radio' ||
        row.columns[colIndex].list[newIndex].type === 'checkbox' ||
        row.columns[colIndex].list[newIndex].type === 'select'
      ) {
        this.$set(row.columns[colIndex].list, newIndex, {
          ...row.columns[colIndex].list[newIndex],
          options: {
            ...row.columns[colIndex].list[newIndex].options,
            options: row.columns[colIndex].list[newIndex].options.options.map((item) => ({
              ...item,
            })),
          },
        })
      }

      if (row.columns[colIndex].list[newIndex].type === 'grid') {
        this.$set(row.columns[colIndex].list, newIndex, {
          ...row.columns[colIndex].list[newIndex],
          columns: row.columns[colIndex].list[newIndex].columns.map((item) => ({ ...item })),
        })
      }

      this.selectWidget = row.columns[colIndex].list[newIndex]
    },

    handleWidgetDelete(index, celement) {
      this.getElement(this.data, celement)
      const element = this.selectElement
      if (element.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = element.list[index - 1]
        }
      } else {
        this.selectWidget = element.list[index + 1]
      }
      this.$nextTick(() => {
        element.list.splice(index, 1)
      })
    },

    getElement(data, celement) {
      data.list.map((li) => {
        if (li.key === celement.key) {
          this.selectElement = data
        } else if (li.columns && li.columns.length > 0) {
          li.columns.map((c) => {
            this.getElement(c, celement)
          })
        } else if (li.list) {
          this.getElement(li, celement)
        }
      })
    },

    getItemName(itemType, index = 1) {
      const itemName = itemType + '_' + index

      if (this.existItemName(itemName, this.data.list) === true) {
        return this.getItemName(itemType, ++index)
      } else {
        return itemName
      }
    },

    existItemName(itemName, list) {
      for (const item of list) {
        if (item.name === itemName) {
          return true
        }

        if (item.list) {
          const result = this.existItemName(itemName, item.list)
          if (result === true) {
            return result
          }
        }
      }

      return false
    },
  },
}
</script>
