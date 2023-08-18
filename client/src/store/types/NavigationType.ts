export interface INavigationItem {
  id: string | null
  isMenu: boolean
  name: string
  path?: string | null
  sequence: number
  parentId?: string | null
  title?: string | null
  description?: string | null
  isActive: boolean
  isSubsystem: boolean
  isReadOnly: boolean
  authRequired: boolean
  viewType: string
  viewId: string | null
  accessRoleId: string | null
  component: string
  detailPath?: string | null
  store?: string | null
  model?: string | null
  placing?: string | null
  presentation: boolean
  icon: string
  paramValues?: string | null
  queryParam?: string | null
  hashParam?: string | null
  lang?: object | null

  childs: Array<INavigationItem>
}

export interface INavigationState {
  navigation: Array<INavigationItem>
}
