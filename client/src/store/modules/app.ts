import router from '@/router'
import axios from 'axios'
import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { RouteConfig } from 'vue-router'
import { INavigationItem } from '@/store/types/NavigationType'
import { IAppState } from '@/store/types/AppType'
import { getRouteFromNavItem, prepareRouteForRouter } from '@/utils/routes-service'
import { allRoutes, navRoutes } from '@/router/staticRoutes'
import _ from 'lodash'
import Vue from 'vue'

const initState: IAppState = {
  allRoutes: allRoutes,
  navRoutes: navRoutes,
  desktopMode: getCookiesDesktopMode(),
  desktopName: getCookiesDesktopName(),
}

export const state: IAppState = Object.assign({}, _.cloneDeep(initState))

export const mutations: MutationTree<IAppState> = {
  setAllRoutes(state: IAppState, payload: RouteConfig[]) {
    state.allRoutes = allRoutes.concat(payload)
  },

  setNavRoutes(state: IAppState, payload: RouteConfig[]) {
    state.navRoutes = navRoutes.concat(payload)
  },

  setDesktopMode(state: IAppState, payload: boolean) {
    state.desktopMode = payload
    saveState('app.desktopMode', payload)
  },

  setDesktopName(state: IAppState, payload: string) {
    Vue.set(state, 'desktopName', payload)
    saveState('app.desktopName', payload)
  },

  resetState(state: IAppState) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const getters: GetterTree<IAppState, any> = {
  allRoutes(state: IAppState) {
    return state.allRoutes
  },

  navRoutes(state: IAppState) {
    return state.navRoutes
  },

  desktopMode(state: IAppState) {
    return state.desktopMode
  },

  desktopName(state: IAppState) {
    return state.desktopName
  },
}

export const actions: ActionTree<any, any> = {
  async init({ dispatch }) {
    await dispatch('getNavigation')
    await dispatch('setSessionParams')
  },

  async getObjects(context, payload: any) {
    return axios
      .get(`/app/objects`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        return error
      })
  },

  async getObjectMeta(context, payload: any) {
    return axios
      .get(`/app/object_meta`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        return error
      })
  },

  async getNavigation({ commit }) {
    return axios
      .get(`/navigation`, { params: { filter: { isActive: true } } })
      .then((response) => {
        const allRoutes: RouteConfig[] = []
        const navRoutes: RouteConfig[] = []

        if (response.status === 200) {
          response.data.forEach((navElement: INavigationItem) => {
            const optionNavigation = getRouteFromNavItem(navElement, 1)

            if (navElement.isMenu === true) {
              navRoutes.push(optionNavigation)
            }

            allRoutes.push(optionNavigation)
          })
        }

        commit('setAllRoutes', allRoutes)
        commit('setNavRoutes', navRoutes)

        const routerRoutes = _.cloneDeep(allRoutes) as Array<RouteConfig>

        for (const rote of routerRoutes) {
          prepareRouteForRouter(rote)
        }

        routerRoutes.forEach((route) => {
          const link = router.resolve({ path: route.path })
          if (link.route.name === '404') {
            router.addRoute(route)
          }
        })

        return allRoutes
      })
      .catch((error) => {
        throw error
      })
  },

  async setSessionParams({ commit, dispatch }) {
    if (process.env.IS_ELECTRON) {
      console.log('init session params')
      const clientIdSerial = await window.ipcRenderer.invoke('getSerialIdClient', '')

      if (clientIdSerial) {
        await dispatch(
          'workingPlaces/findAll',
          {
            params: {
              filter: {
                clientIdSerial,
              },
            },
          },
          { root: true }
        ).then((response: any) => {
          if (response.status === 200 && response.data[0]) {
            const workingPlace = response.data[0]

            if (workingPlace?.desktopMode !== null) {
              commit('setDesktopMode', workingPlace.desktopMode)
            }

            if (workingPlace?.desktopName) {
              commit('setDesktopName', workingPlace.desktopName)
            }
          }
        })
      }
    }
  },

  resetState({ commit }) {
    commit('resetState')
  },
}

function getCookiesDesktopMode(): boolean {
  const desktopMode = window.localStorage.getItem('app.desktopMode')
  return desktopMode ? JSON.parse(desktopMode) : false
}

function getCookiesDesktopName(): string | null {
  const desktopName = window.localStorage.getItem('app.desktopName')
  return desktopName ? JSON.parse(desktopName) : null
}

function saveState(key: string, state: string | boolean | null) {
  window.localStorage.setItem(key, JSON.stringify(state))
}
