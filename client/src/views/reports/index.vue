<template>
  <Layout>
    <PageHeader :title="title" />
    <b-card>
      <div id="command-panel">
        <b-button variant="outline-primary" class="mr-1 btn-sm" @click="generateReport">
          <i class="ri-arrow-right-s-fill mr-1"></i>
          {{ $tc('commands.generate') | upper }}
        </b-button>
        <b-button v-b-toggle.report-settings variant="outline-secondary" :pressed="isOpen" class="mr-1 btn-sm">
          <i class="ri-settings-2-fill mr-1"></i>
          {{ $tc('common.settings') | upper }}
        </b-button>
        <b-button variant="outline-secondary" class="mr-1 btn-sm" @click="printReport">
          <i class="ri-printer-fill mr-1"></i>
          {{ $tc('commands.print') | upper }}
        </b-button>
        <b-button variant="outline-secondary" class="mr-1 btn-sm" @click="printPDF">
          <i class="ri-printer-fill mr-1"></i>
          PDF
        </b-button>

        <label v-if="groupsCount > 0" class="mt-1 ml-5 mr-1">{{ $tc('report.groupLvls') }}</label>
        <b-btn-group v-if="groupsCount > 0" class="ml-5">
          <b-button v-for="n in groupsCount + 1" variant="outline-secondary" size="sm" v-bind:key="n" @click="(e) => onGroupsLevelClick(e, n)">
            {{ n }}
          </b-button>
        </b-btn-group>
      </div>

      <div id="report" class="report overflow-auto mt-2">
        <div v-if="isLoading" class="d-flex justify-content-center mt-3">
          <b-spinner variant="success" class="report-spinner" label="Spinning"></b-spinner>
        </div>
        <result-table :report-type="reportType" @openDetailView="openDetailView" :class="isLoading ? 'd-none' : ''" />
      </div>

      <Settings v-if="!isLoading" :report-type="reportType" />
    </b-card>
  </Layout>
</template>

<script>
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import Settings from './components/settings'
import ResultTable from './components/result-table'
import _ from 'lodash'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'CommonReport',

  components: {
    Layout,
    PageHeader,
    Settings,
    ResultTable,
  },

  data() {
    return {
      reportType: this.$route.params.reportType,
      isLoading: true,
      currentUserId: null,
    }
  },

  computed: {
    ...mapGetters({
      getReportView: 'reports/reportView',
    }),

    reportView() {
      return this.getReportView(this.reportType)
    },

    settings() {
      return this.reportView?.settings
    },

    title() {
      return this.settings?.reportName
    },

    isOpen: {
      get() {
        return this.settings?.isOpen
      },
    },

    columns: {
      get() {
        return this.settings?.columns
      },
      set(value) {
        this.setReportSetting({
          reportType: this.reportType,
          property: 'columns',
          value,
        })
      },
    },

    filters: {
      get() {
        return this.settings?.filters
      },
      set(value) {
        this.setReportSetting({
          reportType: this.reportType,
          property: 'filters',
          value,
        })
      },
    },

    groups: {
      get() {
        return this.settings?.groups
      },
      set(value) {
        this.setReportSetting({
          reportType: this.reportType,
          property: 'groups',
          value,
        })
      },
    },

    funcs: {
      get() {
        return this.settings?.funcs
      },
      set(value) {
        this.setReportSetting({
          reportType: this.reportType,
          property: 'funcs',
          value,
        })
      },
    },

    totals: {
      get() {
        return this.settings?.totals
      },
      set(value) {
        this.setReportSetting({
          reportType: this.reportType,
          property: 'totals',
          value,
        })
      },
    },

    sumColumns: {
      get() {
        return this.settings?.sumColumns
      },
      set(value) {
        this.setReportSetting({
          reportType: this.reportType,
          property: 'sumColumns',
          value,
        })
      },
    },

    selGroupLevel: {
      get() {
        return this.reportView?.selGroupLevel
      },
      set(value) {
        this.setReportProperty({
          reportType: this.reportType,
          property: 'selGroupLevel',
          value,
        })
      },
    },

    groupsCount() {
      if (this.groups) {
        const usedGroups = this.groups.filter((el) => el.use === true)
        return usedGroups.length
      } else {
        return 0
      }
    },
  },

  async created() {
    await this.initReportSettings()
    this.isLoading = false
  },

  methods: {
    ...mapMutations({
      setReportSetting: 'reports/setReportSetting',
      setReportResult: 'reports/setReportResult',
      setReportProperty: 'reports/setReportProperty',
    }),

    async initReportSettings() {
      await this.$store.dispatch('reports/getReportSettings', { reportType: this.reportType }).catch((error) => {
        this.$bvToast.toast(`Błąd otrzymania ustawień raportu: ${error}`, {
          title: this.$tc('common.msg'),
          variant: 'danger',
          solid: true,
          autoHideDelay: 2000,
        })
      })
    },

    printPDF() {
      console.log('TO DO')
    },

    async generateReport() {
      this.isLoading = true

      const params = {
        title: this.title,
        periodType: this.settings?.periodType | 0,
        reportDate: this.settings?.reportDate,
        periodStart: this.settings?.periodStart,
        periodFinish: this.settings?.periodFinish,
        columns: this.columns,
        filters: this.filters,
        groups: this.groups,
      }

      this.$store
        .dispatch('reports/getReportResult', { reportType: this.reportType, params })
        .then((response) => {
          const result = {
            resultData: {},
            filterPresentation: '',
            periodPresentation: '',
            fields: [],
            data: [],
            groups: [],
            details: [],
            funcs: [],
            totals: [],
          }

          if (response.status === 200) {
            result.resultData = response.data.resultData
            result.filterPresentation = response.data.filterPresentation
            result.periodPresentation = response.data.periodPresentation

            this.groups.map((el) => {
              if (el.use === true) {
                result.groups.push(el)
              }
            })

            this.columns.map((el) => {
              if (!el.groupable && !el.function && el.visible) {
                result.details.push(el)
              }
            })

            this.funcs.map((sum) => {
              this.columns.map((col) => {
                if (col.id === sum.id && sum.use === true) {
                  result.funcs.push(col)
                }
              })
            })

            this.totals.map((total) => {
              result.totals.push({
                property: total.property,
                use: total.use,
              })
            })

            this.setReportProperty({
              reportType: this.reportType,
              property: 'selGroupLevel',
              value: result.groups.length > 0 ? result.groups.length + 1 : 0,
            })

            const uniqueList = []
            this.groups.map((group) => {
              if (group.use) {
                if (group.valueType === 'string') {
                  const uniqueVal = [...new Set(result.resultData.map((e) => e[group.property]))]
                  uniqueList.push(uniqueVal)
                } else {
                  const dataList = [...new Set(result.resultData.map((e) => e[group.property]))]
                  const uniqueVal = [...new Set(dataList.map((e) => e.name))]
                  uniqueList.push(uniqueVal)
                }
              }
            })

            const list = []
            for (let i = 0; i < result.groups.length; i++) {
              uniqueList[i].map((item) => {
                const listItem = {
                  id: i + 1,
                  label: item,
                  parentId: i,
                  hasSub: true,
                  field: result.groups[i].property,
                  valueType: result.groups[i].valueType,
                  children: [],
                }

                list.push(listItem)
              })
            }

            const fieldsTree = this.listToTree(list)

            for (let j = 0; j < fieldsTree.length; j++) {
              this.getGroupData(fieldsTree[j], result.resultData)
            }

            if (fieldsTree.length <= 0) {
              result.data = result.resultData
            } else {
              result.data = fieldsTree
            }
          }

          this.setReportResult({
            reportType: this.reportType,
            result: Object.freeze(result),
          })

          this.isLoading = false
        })
        .catch((error) => {
          console.error(error)
          this.isLoading = false
        })
    },

    getGroupData(data, filterData) {
      let arr
      if (data.valueType === 'object') {
        arr = filterData.filter((e) => e[data.field].name === data.label)
      } else {
        arr = filterData.filter((e) => e[data.field] === data.label)
      }
      if (data.children && data.children?.length > 0) {
        data.children.map((e) => {
          this.getGroupData(e, arr)
        })
      } else {
        if (data.children) {
          data.hasSub = false
          data.children = arr
        }
      }
    },

    listToTree(list) {
      let node
      const roots = []
      for (let i = list.length - 1; i >= 0; i--) {
        node = list[i]
        if (node.parentId !== 0) {
          const arr = list.filter((e) => e.id === node.parentId)
          arr.map((item) => {
            item.children.push(JSON.parse(JSON.stringify(node)))
          })
        } else {
          roots.push(node)
        }
      }
      return roots
    },

    openDetailView(data, property) {
      const dataIndex = this.resultData.findIndex((e) => JSON.stringify(e) === JSON.stringify(data))
    },

    onGroupsLevelClick(e, groupLevel) {
      this.setReportProperty({
        reportType: this.reportType,
        property: 'selGroupLevel',
        value: groupLevel,
      })

      const groupLines = document.querySelectorAll('.group-item')

      Array.from(groupLines).map((group) => {
        const level = group.getAttribute('level') * 1
        const expanded = JSON.parse(group.getAttribute('expanded') || 'false')

        if (expanded === true) {
          if (groupLevel === level) {
            const button = group.querySelector('button:not(.d-none)')
            button.click()
          }
        } else {
          if (groupLevel > level) {
            const button = group.querySelector('button:not(.d-none)')
            button.click()
          }
        }
      })
    },

    async printReport() {
      await this.$htmlToPaper('report')
    },
  },
}
</script>

<style lang="scss">
.report {
  height: 72vh;
  border: 1px solid #adb5bd;
}

.filter-presentation {
  font-size: 22px;
  margin-left: 30px;
}

.report-spinner {
  width: 3rem;
  height: 3rem;
}

.vue-html2pdf {
  .layout-container {
    opacity: 0 !important;
    width: auto !important;
    height: auto !important;
    background: transparent !important;
  }
}

.leftAlign {
  text-align: left;
}

.rightAlign {
  text-align: right;
}

.centerAlign {
  text-align: center;
}

.wrapText {
  white-space: pre-line;
}

.backgroundColor {
  background-color: lightblue;
}

.backgroundColorGroup {
  background-color: lightcyan;
}

.fontSize16 {
  font-size: 16px;
}

.fontSettings {
  font-family: sans-serif, 'Nunito';
  color: #6c757d;
}

.fontBold {
  font-weight: bold;
}

.width3 {
  width: 3%;
}

.width5 {
  width: 5%;
}

.width8 {
  width: 8%;
}

.width10 {
  width: 10%;
}

.width12 {
  width: 12%;
}

.width15 {
  width: 15%;
}

.width20 {
  width: 20%;
}

.width25 {
  width: 25%;
}

.width30 {
  width: 30%;
}

.width35 {
  width: 35%;
}

.width40 {
  width: 40%;
}

.isDeleteble {
  margin-bottom: 0px;
}

.isGroupStyle {
  margin-bottom: 0px;
}

@media print {
  .tr,
  .td {
    border-top: 1px solid lightgrey;
    border-bottom: 1px solid lightgrey;
  }
}
</style>
