export interface IViewSettingItem {
  id: string | null
  name: string
  description?: string | null
  template: string
  module: string
  style: string
}

export interface IViewSettingState {
  list: Array<IViewSettingItem>
  objectViews: Array<any>
}

export interface IUserViewSettingItem {
  id: string | null
  name: string
  description?: string | null
  template: string
  module: string
  style: string
  viewId: string
  userId: string
}

export interface IUserViewSettingState {
  list: Array<IUserViewSettingItem>
  objectViews: Array<any>
}
