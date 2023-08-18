<template>
  <div id="table-wrapper" :style="`padding-left: ${pleft}px;`" class="report-table">
    <b-row v-if="filterPresentation?.length > 0">
      <b-col>
        <p class="filter-presentation"> {{ filterPresentation }}</p>
      </b-col>
    </b-row>

    <table class="custom-excel-grid" v-if="rowdata.length > 0">
      <thead>
        <!-- first group and sum field -->
        <tr v-if="groups.length > 0">
          <!-- start first group fields -->
          <th :colspan="details.length" v-if="groups.length !== 0">
            {{ groups[0]?.title }}
          </th>
          <!-- end first group fields -->

          <!-- start func fields -->
          <th :rowspan="groups.length + 1" v-for="func in funcs" v-bind:key="func.title">
            {{ func.title }}
          </th>
          <!-- end func fields -->
        </tr>

        <!-- rest of groups -->
        <tr v-for="group in groups.slice(1)" v-bind:key="group.title">
          <th :colspan="details.length">
            {{ group.title }}
          </th>
        </tr>

        <!--start detail fields -->
        <tr>
          <th v-for="detail in details" v-bind:key="detail.title">
            {{ detail.title }}
          </th>
        </tr>
        <!-- end detail fields -->
      </thead>

      <table-item v-if="groups.length > 0" :tableData="rowdata" :details="details" :funcs="funcs" :groupFields="groups" :groupTotals="groupTotals" @handleDetail="handleDetail" />

      <tbody v-if="groups.length === 0">
        <tr v-for="(data, i) in rowdata" v-bind:key="i" class="child-tr">
          <td v-for="detail in details" v-bind:key="detail.title" class="detail" @click="(e) => handleClickTd(e)">
            {{ detail.valueType === 'object' ? data[detail.property].name : data[detail.property] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import tableItem from './tableItem.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'ResultTable',

  components: { tableItem },

  props: {
    reportType: {
      type: String,
      require: true,
      default: null,
    },
  },

  computed: {
    ...mapGetters({
      getReportView: 'reports/reportView',
    }),

    reportView() {
      return this.getReportView(this.reportType)
    },

    result() {
      return this.reportView?.result
    },

    fields() {
      return this.result?.fields || []
    },

    groups() {
      return this.result?.groups || []
    },

    details() {
      return this.result?.details || []
    },

    funcs() {
      return this.result?.funcs
    },

    rowdata() {
      return this.result?.data || []
    },

    groupTotals() {
      return this.result?.totals || []
    },

    pleft() {
      return 15 * this.groups?.length + 5
    },

    filterPresentation() {
      return this.result?.filterPresentation || ''
    },
  },

  created() {
    window.addEventListener('keydown', (e) => {
      this.handleKeyPress(e)
    })
    document.body.addEventListener('click', (e) => this.clickOutside(e))
  },

  methods: {
    clickOutside(e) {
      const table = document.querySelector('table.custom-excel-grid')
      if (!table?.contains(e.target)) {
        const focusTd = document.querySelector('td.focus')
        focusTd?.classList.remove('focus')
      }
    },

    handleClickTd(e) {
      const focusTd = document.querySelector('td.focus')
      if (focusTd) {
        focusTd.classList.remove('focus')
      }
      const currentTd = e.currentTarget
      currentTd.classList.add('focus')
    },

    handleKeyPress(e) {
      const focusTd = document.querySelector('td.focus')

      let index
      let nextTd = null
      let nextTr = null
      let nextTds = null
      let nextFTr = null

      if (focusTd) {
        const allTds = focusTd.parentNode.children
        Array.from(allTds).map((td, i) => {
          if (td === focusTd) {
            index = i
          }
        })

        switch (e.keyCode) {
          case 37:
            nextTd = focusTd.previousSibling
            break
          case 38:
            this.hasChildTr = null
            nextFTr = focusTd.parentNode.previousSibling
            this.findNextTr(nextFTr, 'up')
            nextTr = this.hasChildTr
            if (nextTr) {
              nextTds = nextTr.children
              nextTd = nextTds[index]
            }
            break
          case 39:
            nextTd = focusTd.nextSibling
            break
          case 40:
            this.hasChildTr = null
            nextFTr = focusTd.parentNode.nextSibling
            if (!focusTd.parentNode.nextSibling) {
              nextFTr = focusTd.parentNode.parentNode.nextSibling?.children[1]
            }
            this.findNextTr(nextFTr, 'down')
            nextTr = this.hasChildTr
            if (nextTr) {
              nextTds = nextTr.children
              nextTd = nextTds[index]
            }
            break

          default:
            break
        }

        if (nextTd) {
          focusTd.classList.remove('focus')
          nextTd?.classList.add('focus')
        }
      }
    },

    findNextTr(element, direction) {
      if (element) {
        if (element.classList.contains('child-tr')) {
          this.hasChildTr = element
        } else {
          if (direction === 'up') {
            const previous = element.previousSibling
            if (previous) {
              this.findNextTr(previous, 'up')
            } else {
              const index = element.parentNode.previousSibling?.children.length - 1
              this.findNextTr(element.parentNode.previousSibling?.children[index], 'up')
            }
          } else {
            this.findNextTr(element.nextSibling, 'down')
          }
        }
      }
    },

    handleDetail(data, property) {
      this.$emit('openDetailView', data, property)
    },
  },
}
</script>

<style lang="scss">
@import './styles/table.scss';
@import './styles/groups.scss';

.report-table {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>