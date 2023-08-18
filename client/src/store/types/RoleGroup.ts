export interface IRoleGroupItem {
  id: string | null
  name: string
  markedToDelete: boolean
  lang?: object | null
  presentation?: string
  settings: Array<any>
  users: Array<any>
}

export const RoleGroup: IRoleGroupItem = {
  id: null,
  name: '',
  markedToDelete: false,
  lang: null,
  settings: [],
  users: [],
}
