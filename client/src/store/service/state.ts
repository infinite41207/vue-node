export interface IListView {
  list: Array<any>
  total: number
  page: number
  limit: number
  filters: object
  sort: { sortBy: string | null; sortDesc: boolean }
}

export interface IObjectView {
  viewId: string | null
  object: any
  attrs?: any
}

export interface IState {
  listView: IListView
  objectViews: Array<IObjectView>
}

export const commonState: IState = {
  listView: {
    list: [],
    total: 0,
    page: 1,
    limit: 20,
    filters: {
      searchStr: '',
    },
    sort: { sortBy: null, sortDesc: false },
  },
  objectViews: [],
}
