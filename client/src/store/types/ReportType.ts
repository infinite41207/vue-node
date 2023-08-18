export interface IReportView {
  reportType: string
  settings: IReportSettings
  result: object
  reportVariants: Array<any>
  selGroupLevel: number
}

export interface IReportSettings {
  isOpen: boolean
  periodType: number
  reportName: string
  reportDate: Date
  periodStart: Date
  periodFinish: Date
  columns: Array<any>
  filters: Array<any>
  groups: Array<any>
  funcs: Array<any>
  sumColumns: Array<any>
  totals: Array<any>
  showYTotal: boolean
  showXTotal: boolean
  classes: object
}

export interface IReportState {
  reportViews: Array<IReportView>
}
