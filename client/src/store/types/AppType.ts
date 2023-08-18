import { RouteConfig } from 'vue-router'

export interface IAppState {
  allRoutes: RouteConfig[]
  navRoutes: RouteConfig[]
  desktopMode?: boolean
  desktopName?: string | null
}
