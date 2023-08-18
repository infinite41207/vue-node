<script>
import { h } from 'vue'
export default {
  name: 'TableItem',
  props: ['tableData', 'details', 'funcs', 'groupFields', 'groupTotals'],

  data() {
    return {
      defaultPdd: 18,
      tdHeight: 50,
      rowdata: this.tableData,
    }
  },

  render() {
    const tbodys = []

    for (let index = 0; index < this.rowdata.length; index++) {
      this.groupLines = []
      let level = 1
      const jsondata = this.rowdata[index]
      const tdsHead = this.makeTrHead(jsondata, 0)
      const parentTr = h(
        'tr',
        {
          class: 'font-bold',
          attrs: {
            pos: 0,
            level,
          },
        },
        [tdsHead]
      )

      this.trData = []
      this.trHeadLeng = 0
      this.groupLeng = 0
      this.trNum = 0

      this.calcGroupLeng(jsondata)
      const groupLeng = this.groupLeng

      this.calcLeng(jsondata)
      const length = this.trHeadLeng + groupLeng - 1

      const groupLine = this.makeGroupLine(this.trNum, length, 1, null)
      this.groupLines.push(groupLine)

      this.makeTrdata(jsondata.children, ++level, 0)

      const ctr = this.trData
      const groups = this.groupLines
      const groupDiv = h(
        'div',
        {
          class: 'group-lines',
        },
        [groups]
      )

      const tbody = h('tbody', [groupDiv, parentTr, ctr])
      tbodys.push(tbody)
    }

    //calculate total for all data
    let totalTr
    let totalLeng = 0
    this.groupTotals.map((e) => {
      if (e.use) totalLeng += 1
    })

    if (totalLeng > 0) {
      const totalTd = h(
        'td',
        {
          class: 'font-bold',
          attrs: {
            colspan: this.details.length,
          },
        },
        'Total'
      )
      const sumTds = []
      for (let i = 0; i < this.groupTotals.length; i++) {
        let allTotals = 0
        this.rowdata.map((data) => {
          this.calcFuncVal = 0
          this.calcFunc(data, this.groupTotals[i].property, 'sum')
          allTotals += this.calcFuncVal
        })
        const sumTd = h(
          'td',
          {
            class: 'text-right font-bold',
          },
          this.groupTotals[i].use ? allTotals.toFixed(3) : ''
        )
        sumTds.push(sumTd)
      }
      totalTr = h('tr', [totalTd, sumTds])
    }
    const totalTb = h('tbody', [totalTr])
    //
    const root = h(
      'tbody',
      {
        class: 'parent-tbody',
      },
      [tbodys, totalTb]
    )
    return root
  },
  watch: {
    tableData: function () {
      this.rowdata = this.tableData
      this.refreshTable()
    },
  },
  mounted() {
    if (this.tableData) {
      this.rowdata = this.tableData
      this.$nextTick(function () {
        this.refreshTable()
      })
    }
  },
  methods: {
    refreshTable() {
      const tbodys = document.querySelectorAll('tbody')
      const groupLines = document.querySelectorAll('.group-lines')

      Array.from(tbodys).map((tbody) => {
        const trs = tbody.querySelectorAll('tr')

        Array.from(trs).map((tr) => {
          const tdHasChild = tr.querySelectorAll('td.grouped')
          tr.classList.remove('d-none')
          tr.removeAttribute('expanded')

          Array.from(tdHasChild).map((td) => {
            td.classList.remove('grouped')
          })
        })

        const groupTr = tbody.querySelectorAll('tr:not(.child-tr)')

        Array.from(groupTr).map((grTr) => {
          grTr.setAttribute('expanded', true)
        })
      })

      Array.from(groupLines).map((line) => {
        const items = line.querySelectorAll('.group-item')
        Array.from(items).map((item) => {
          const id = item.getAttribute('id') * 1
          const top = id * this.tdHeight
          const staticLeng = item.getAttribute('dleng')

          item.setAttribute('length', staticLeng)
          item.setAttribute('expanded', true)
          item.style.top = top + 'px'
          item.classList.remove('d-none')

          const plusBtn = item.querySelector('.ri-add-box-line').parentNode
          const minusBtn = item.querySelector('.ri-checkbox-indeterminate-line').parentNode
          const itemLine = item.querySelector('.item-line')
          const staticH = itemLine.getAttribute('height')

          itemLine.style.height = `${staticH}px`

          const itemHLine = item.querySelector('.item-h-line')

          plusBtn.classList.add('d-none')
          minusBtn.classList.remove('d-none')
          itemLine.classList.remove('h-0')
          itemHLine.classList.remove('h-0')
        })
      })
    },

    makeTrdata(data, level, ppid) {
      if (!data[0].children) {
        this.makeDetailTr(data, this.defaultPdd, level)
      } else {
        data.map((li) => {
          if (li.hasSub) {
            const padding = this.defaultPdd * level
            const tdsHead = this.makeTrHead(li, padding)
            this.trHeadLeng = 0
            this.groupLeng = 0
            this.calcLeng(li)

            if (this.trHeadLeng > 0) {
              this.trNum += 1
              this.calcGroupLeng(li)
              const groupLeng = this.groupLeng
              const length = this.trHeadLeng + groupLeng - 1
              const groupLine = this.makeGroupLine(this.trNum, length, level, ppid)
              this.groupLines.push(groupLine)

              const tr = h(
                'tr',
                {
                  attrs: {
                    pos: this.trNum,
                    length: length,
                    parentId: ppid,
                    level,
                  },
                },
                [tdsHead]
              )
              this.trData.push(tr)
              this.makeTrdata(li.children, ++level, this.trNum)
            }
          } else {
            const padding = this.defaultPdd * level
            if (li.children.length > 0) {
              const tdsHead = this.makeTrHead(li, padding)
              this.trNum += 1
              const trhead = h(
                'tr',
                {
                  attrs: {
                    pos: this.trNum,
                    level: level,
                    length: li.children.length,
                    parentId: ppid,
                  },
                },
                [tdsHead]
              )
              //make group line
              const groupLine = this.makeGroupLine(this.trNum, li.children.length, level, ppid)
              this.groupLines.push(groupLine)
              this.trData.push(trhead)
            }
            this.makeDetailTr(li.children, padding, level + 1)
          }
        })
      }
    },

    makeDetailTr(data, padding, level) {
      data.map((item) => {
        const detailTds = []
        const sumTds = []
        for (let i = 0; i < this.details.length; i++) {
          let text
          const tdClass = this.details[i].valueType === 'object' ? 'object-field' : ''
          if (this.details[i].valueType === 'object') {
            text = item[this.details[i].property].name
          } else {
            text = item[this.details[i].property]
          }
          const textDiv = h(
            'div',
            {
              class: 'detail-text',
            },
            text
          )
          const detailIco = h('i', {
            class: 'ri-external-link-line',
          })
          const detailBtn = h(
            'b-button',
            {
              class: 'detail-view-btn',
              attrs: {
                variant: 'outline-secondary',
              },
              on: {
                click: () => {
                  this.handleDetailView(item, this.details[i].property)
                },
              },
            },
            [detailIco]
          )
          const td = h(
            'td',
            {
              class: `detail ${tdClass}`,
              attrs: {
                height: '50px',
              },
              style: i === 0 ? `padding-left: ${padding}px;` : '',
              on: {
                click: (e) => {
                  this.handleClickTd(e)
                },
              },
            },
            this.details[i].valueType === 'object' ? [textDiv, detailBtn] : [textDiv]
          )
          detailTds.push(td)
        }
        for (let j = 0; j < this.funcs.length; j++) {
          const td = h(
            'td',
            {
              class: 'sum text-right',
              on: {
                click: (e) => {
                  this.handleClickTd(e)
                },
              },
            },
            item[this.funcs[j].property]
          )
          sumTds.push(td)
        }
        this.trNum += 1
        const tr = h(
          'tr',
          {
            attrs: {
              pos: this.trNum,
              level,
              class: 'child-tr',
            },
          },
          [detailTds, sumTds]
        )
        this.trData.push(tr)
      })
    },

    makeTrHead(data, padding) {
      const groupTd = h(
        'td',
        {
          style: padding !== 0 ? `padding-left:${padding}px` : '',
          attrs: {
            colspan: this.details.length,
            height: '50px',
          },
        },
        data.label
      )
      const sumTds = []
      for (let i = 0; i < this.funcs.length; i++) {
        this.calcFuncVal = 0
        this.calcFunc(data, this.funcs[i].property, this.funcs[i].functionVal)
        const sumTd = h(
          'td',
          {
            class: 'text-right',
          },
          this.calcFuncVal.toFixed(3)
        )
        sumTds.push(sumTd)
      }
      return [groupTd, sumTds]
    },

    calcFunc(data, field, value) {
      if (data.hasSub) {
        data.children.map((li) => {
          this.calcFunc(li, field, value)
        })
      } else {
        let sum = 0
        let items
        let flag
        switch (value) {
          case 'sum':
            data.children.map((item) => {
              this.calcFuncVal += item[field] * 1
            })
            break
          case 'average':
            data.children.map((item) => {
              sum += item[field] * 1
            })
            this.calcFuncVal += sum / data.children.length
            break
          case 'max':
            items = data.children
            if (items.length > 0) {
              flag = items[0][field] * 1
              for (let i = 1; i < items?.length; i++) {
                if (flag <= items[i][field] * 1) flag = items[i][field] * 1
              }
              if (this.calcFuncVal <= flag) this.calcFuncVal = flag
            }
            break
          case 'min':
            items = data.children
            flag = parseInt(items[0][field])
            for (let i = 1; i < items?.length; i++) {
              if (flag >= parseInt(items[i][field])) flag = items[i][field]
            }
            this.calcFuncVal = flag
            break

          default:
            break
        }
      }
    },

    calcGroupLeng(data) {
      if (data.children && data.children.length > 0) {
        this.childLength = 0
        this.calcChildLeng(data)
        if (this.childLength > 0) {
          this.groupLeng += 1
        }
        data.children.map((li) => {
          this.calcGroupLeng(li)
        })
      } else {
        data = []
      }
    },

    calcLeng(data) {
      if (data.hasSub) {
        data.children.map((li) => {
          this.calcLeng(li)
        })
      } else {
        const length = data.children.length
        this.trHeadLeng += length
      }
    },

    calcChildLeng(data) {
      if (data.hasSub) {
        data.children.map((li) => {
          this.calcChildLeng(li)
        })
      } else {
        const length = data.children.length
        this.childLength += length
      }
    },

    makeGroupLine(pos, length, leftNum, parentId) {
      const top = this.tdHeight * pos
      const left = (this.groupFields.length - leftNum) * -12
      const height = (length === 0 ? 1 : length) * this.tdHeight + 30

      const plusIco = h('i', {
        class: 'ri-add-box-line',
      })

      const minusIco = h('i', {
        class: 'ri-checkbox-indeterminate-line',
      })

      const plusBtn = h(
        'b-button',
        {
          class: 'd-none btn-sm group-active-btn',
          attrs: {
            variant: 'outline-secondary',
          },
          on: {
            click: (e) => {
              this.handleGroupToggle(e, pos, 'plus')
            },
          },
        },
        [plusIco]
      )

      const minusBtn = h(
        'b-button',
        {
          class: 'btn-sm group-active-btn',
          attrs: {
            variant: 'outline-secondary',
          },
          on: {
            click: (e) => {
              this.handleGroupToggle(e, pos, 'minus')
            },
          },
        },
        [minusIco]
      )

      const line = h('span', {
        class: 'item-line',
        style: {
          height: height + 'px',
        },
        attrs: {
          height: height,
        },
      })

      const horizLine = h('span', {
        class: 'item-h-line',
      })

      const groupItem = h(
        'div',
        {
          class: 'group-item',
          attrs: {
            id: pos,
            level: leftNum,
            parentId: parentId,
            length: length,
            dleng: length,
            expanded: true,
          },
          style: {
            top: `${top}px`,
            left: `${left}px`,
          },
        },
        [plusBtn, minusBtn, line, horizLine]
      )
      return groupItem
    },

    handleGroupToggle(e, pos, action) {
      const parentDiv = e.currentTarget.parentNode
      const line = parentDiv.querySelector('.item-line')
      const hLine = parentDiv.querySelector('.item-h-line')
      const plusBtn = parentDiv.querySelector('.ri-add-box-line').parentNode
      const minusBtn = parentDiv.querySelector('.ri-checkbox-indeterminate-line').parentNode

      plusBtn.classList.toggle('d-none')
      minusBtn.classList.toggle('d-none')
      line.classList.toggle('h-0')
      hLine.classList.toggle('h-0')

      const length = parentDiv.getAttribute('length') * 1
      const level = parentDiv.getAttribute('level') * 1

      this.handleToggleTrs(e, pos, level, action)

      const tbody = e.currentTarget.closest('tbody')
      const trs = tbody.querySelectorAll('tr')
      const posTds = trs[pos].querySelectorAll('td')

      Array.from(posTds).map((td) => {
        td.classList.toggle('grouped')
      })

      if (action === 'minus') {
        parentDiv.setAttribute('expanded', false)
        trs[pos].setAttribute('expanded', false)
      } else {
        parentDiv.setAttribute('expanded', true)
        trs[pos].setAttribute('expanded', true)
      }

      this.changeGroupLine(e, pos, length, action)
    },

    changeGroupLine(e, pos, length, action) {
      const currentLevel = e.currentTarget.closest('.group-item').getAttribute('level') * 1
      const parentId = e.currentTarget.closest('.group-item').getAttribute('parentid') * 1
      const reduceH = this.tdHeight * length
      const groupLines = e.currentTarget.closest('.group-lines').querySelectorAll('.group-item')

      //change group lines height
      this.handleChangeHeight(groupLines, parentId, length, action)

      //change group lines top
      this.handleChangePos(groupLines, pos, reduceH, action)

      //change old parent height
      const line = groupLines[0].querySelector('.item-line')
      const groupLeng = groupLines[0].getAttribute('length') * 1
      const height = parseInt(line.style.height)

      if (!groupLines[0].contains(e.currentTarget)) {
        if (action === 'minus') {
          line.style.height = `${height - reduceH}px`
          groupLines[0].setAttribute('length', groupLeng - length)
        } else {
          line.style.height = `${height + reduceH}px`
          groupLines[0].setAttribute('length', groupLeng + length)
        }
      }

      this.handleHideChildLine(e, groupLines, pos, action, currentLevel)
    },

    handleChangeHeight(groupLines, parentId, length, action) {
      const reduceH = this.tdHeight * length

      Array.from(groupLines).map((group) => {
        const id = group.getAttribute('id') * 1
        if (id !== 0) {
          if (id === parentId) {
            const line = group.querySelector('.item-line')
            const groupLeng = group.getAttribute('length') * 1
            const height = parseInt(line.style.height)

            if (action === 'minus') {
              line.style.height = `${height - reduceH}px`
              group.setAttribute('length', groupLeng - length)
            } else {
              line.style.height = `${height + reduceH}px`
              group.setAttribute('length', groupLeng + length)
            }
            const ppid = group.getAttribute('parentid') * 1
            this.handleChangeHeight(groupLines, ppid, length, action)
          }
        }
      })
    },

    handleHideChildLine(e, groupLines, id, action, level) {
      Array.from(groupLines).map((group) => {
        if (!group.contains(e.currentTarget)) {
          if (level !== this.groupFields.length) {
            const parentId = group.getAttribute('parentid') * 1
            const groupId = group.getAttribute('id') * 1
            const level = group.getAttribute('level') * 1
            const expanded = group.getAttribute('expanded')

            if (parentId === id) {
              if (action === 'minus') {
                group.classList.add('d-none')
              } else {
                group.classList.remove('d-none')
              }
              if (expanded !== 'false') {
                this.handleHideChildLine(e, groupLines, groupId, action, level)
              }
            }
          }
        }
      })
    },

    handleChangePos(groupLines, pos, reduceH, action) {
      Array.from(groupLines).map((group) => {
        const id = group.getAttribute('id') * 1
        if (id > pos) {
          const top = parseInt(group.style.top)
          if (action === 'minus') {
            group.style.top = `${top - reduceH}px`
          } else {
            group.style.top = `${top + reduceH}px`
          }
        }
      })
    },

    handleClickTd(e) {
      const focusTd = document.querySelector('td.focus')
      if (focusTd) {
        focusTd.classList.remove('focus')
      }
      const currentTd = e.currentTarget
      currentTd.classList.add('focus')
    },

    handleToggleTrs(e, id, level, action) {
      const tbody = e.currentTarget.closest('tbody')
      const trs = tbody.querySelectorAll('tr:not(.child-tr)')

      Array.from(trs).map((tr, i) => {
        const pos = tr.getAttribute('pos') * 1
        const parentId = tr.getAttribute('parentid') * 1
        const trLevel = tr.getAttribute('level') * 1
        const expanded = tr.getAttribute('expanded')
        const length = tr.getAttribute('length') * 1
        const allTrs = tbody.querySelectorAll('tr')

        if (i !== 0) {
          if (level !== this.groupFields.length) {
            if (parentId === id) {
              if (action === 'minus') {
                tr.classList.add('d-none')
              } else {
                tr.classList.remove('d-none')
              }
              if (expanded !== 'false') {
                this.handleToggleTrs(e, pos, trLevel, action)
              }
            }
          } else {
            if (pos === id) {
              for (let i = pos + 1; i <= pos + length; i++) {
                if (action === 'minus') {
                  allTrs[i].classList.add('d-none')
                } else {
                  allTrs[i].classList.remove('d-none')
                }
              }
            }
          }
        } else {
          if (this.groupFields.length === 1) {
            for (let i = pos + 1; i <= allTrs.length - 1; i++) {
              if (action === 'minus') {
                allTrs[i].classList.add('d-none')
              } else {
                allTrs[i].classList.remove('d-none')
              }
            }
          }
        }
      })
    },

    handleDetailView(data, property) {
      this.$emit('handleDetail', data, property)
    },
  },
}
</script>