import axios from 'axios'
import _ from 'lodash'
import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { IViewSettingState, IViewSettingItem } from '../types/ViewSettingType'
import moment from 'moment'

const initState: IViewSettingState = {
  list: [],
  objectViews: [],
}

export const state: IViewSettingState = _.cloneDeep(initState)

export const mutations: MutationTree<IViewSettingState> = {
  setList(state: IViewSettingState, payload: Array<IViewSettingItem>) {
    state.list = payload
  },

  addObjectView(state, view) {
    const existView = state.objectViews.find((el) => el.viewId === view.viewId)

    if (existView === undefined) {
      state.objectViews.push(view)
    }
  },

  setObjectViewProperty(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      state.objectViews[index][payload.property] = payload.value
    }
  },

  setObjectProperty(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      state.objectViews[index].object[payload.property] = payload.value
    }
  },

  delObjectView(state, viewId) {
    for (const [i, v] of state.objectViews.entries()) {
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

export const getters: GetterTree<IViewSettingState, any> = {
  list(state) {
    return state.list
  },

  objectView: (state) => (viewId: string) => {
    return state.objectViews.find((el) => el.viewId === viewId)
  },

  presentation: (state) => (viewId: string) => {
    const objectView = state.objectViews.find((el) => el.viewId === viewId)

    let presentation = ''
    if (objectView) {
      presentation = objectView.object.name
    }

    return presentation
  },
}

export const actions: ActionTree<IViewSettingState, any> = {
  // Logs in the current user.
  async findAll({ commit }, payload) {
    const list: Array<any> = []

    return axios
      .get(`/view_setting`, payload)
      .then((response) => {
        if (!payload.noCommit) {
          if (response.status === 200) {
            const list = response.data
            commit('setList', list)
          } else {
            commit('setList', [])
          }
        }

        return response
      })
      .catch((error) => {
        if (!payload.noCommit) {
          commit('setList', [])
        }
        throw error
      })
  },

  async findByPk({ commit }, payload) {
    if (!payload.noCommit) {
      if (state.objectViews.some((v) => v.viewId === payload.params.id)) return
    }

    return axios
      .get(`/view_setting/${payload.params.id}`, payload.query)
      .then((response) => {
        if (!payload.noCommit) {
          const object = response.data
          object.createdAt = moment(object.createdAt).format('DD.MM.YYYY hh:mm:ss')
          commit('addObjectView', { viewId: payload.params.id, object })
        }

        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async create({ commit }, payload) {
    return axios.post(`/view_setting`, payload).then((response) => {
      return response
    })
  },

  async update({ commit }, payload) {
    return axios
      .put(`/view_setting/${payload.id}`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  resetState({ commit }) {
    commit('resetState')
  },
}
