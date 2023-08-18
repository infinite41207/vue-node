import axios from 'axios'
import viewService from '@/utils/view-service.js'
import _ from 'lodash'

const initState = {
  listViews: [],
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const mutations = {
  addListView(state, view) {
    const existView = state.listViews.find((el) => el.viewId === view.viewId)

    if (existView === undefined) {
      state.listViews.push(view)
    }
  },

  setListViewProperty(state, payload) {
    const index = state.listViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      Object.keys(payload).forEach((key) => {
        state.listView[key] = payload[key]
      })
      state.objectViews[index][payload.property] = payload.value
    }
  },

  setFilters(state, payload) {
    const index = state.listViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      Object.keys(payload.filter).forEach((key) => {
        state.listView[index].filters[key] = payload.filter[key]
      })
    }
  },

  setSort(state, payload) {
    const index = state.listViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      Object.keys(payload.sort).forEach((key) => {
        state.listView[index].sort[key] = payload.sort[key]
      })
    }
  },

  delListView(state, viewId) {
    for (const [i, v] of state.listViews.entries()) {
      if (v.viewId === viewId) {
        state.objectViews.splice(i, 1)
        break
      }
    }
  },

  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const actions = {
  async initialize({ commit, getters }, payload) {
    if (payload.params) {
      await viewService.executeAsyncConditionCode(payload.params.sourceCode).then((response) => {
        commit('setListViewProperty', { viewId: payload.viewId, property: { list: payload.list, total: payload.total, page: payload.page } })
      })
    }
  },

  async findAll({ commit, getters }, payload) {
    const list = []

    return axios
      .get(`/${payload.route}`, payload)
      .then((response) => {
        if (response.status === 200) {
          const result = response.data

          let list = []
          if (result.rows) {
            list = result.rows
          } else {
            list = result
          }

          const total = result.count ? result.count : list.length
          let page = getters.listViewProperty(payload.viewId, 'page')

          if (total > 0) {
            const pages = Math.ceil(total / getters.listViewProperty(payload.viewId, 'limit'))
            if (pages < page) {
              page = pages
            }
          } else {
            page = 1
          }

          if (!payload.noCommit) {
            commit('setListViewProperty', { viewId: payload.viewId, property: { list, total, page } })
          }
        } else {
          if (!payload.noCommit) {
            commit('setListViewProperty', { viewId: payload.viewId, property: { list, total: list.length, page: 1 } })
          }
        }

        return response
      })
      .catch((error) => {
        console.error(error)
        if (!payload.noCommit) {
          commit('setListViewProperty', { viewId: payload.viewId, property: { list, total: list.length, page: 1 } })
        }
        return error
      })
  },

  resetState({ commit }) {
    commit('resetState')
  },
}

export const getters = {
  listView: (state) => (viewId) => {
    return state.listViews.find((el) => el.viewId === viewId)
  },
  listViewProperty: (state) => (viewId, property) => {
    const listView = state.listViews.find((el) => el.viewId === viewId)
    return listView ? listView[property] : undefined
  },
}
