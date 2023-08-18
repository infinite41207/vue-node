export interface ICurrentUserData {
  id: string
  email: string
  login: string
  name: string
  externalUser: boolean
  fullRights: boolean
  isAuthenticated: boolean
  language: string
  useCustomerAccess: boolean
}

export interface ICurrentLanguageData {
  code: string
  name: string
}

export interface IAuthState {
  currentUser: ICurrentUserData
  currentLanguage: ICurrentLanguageData
}
