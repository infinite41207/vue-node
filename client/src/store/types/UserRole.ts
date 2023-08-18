export interface IUserRoleItem {
  id: string | null
  name: string
  key: string
  markedToDelete: boolean
  parentId: string | null
  lang?: object | null
  readOnly: boolean
  presentation?: string
}

export const UserRole: IUserRoleItem = {
  id: null,
  name: '',
  key: '',
  parentId: null,
  markedToDelete: false,
  lang: null,
  readOnly: false,
}
