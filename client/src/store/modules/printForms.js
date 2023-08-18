import axios from 'axios'
import _ from 'lodash'

const initState = {
  objectViews: [],
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const mutations = {
  addObjectView(state, view) {
    const existView = state.objectViews.find((el) => el.viewId === view.viewId)

    if (existView === undefined) {
      state.objectViews.push(view)
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

export const actions = {
  resetState({ commit }) {
    commit('resetState')
  },

  addPrint({ commit }, payload) {
    const viewId = payload.name + '-' + payload.id
    const newObject = _.cloneDeep(payload.object)
    newObject.id = viewId
    newObject.isNew = true
    newObject.routeOwner = payload.routeOwner
    newObject.isPrintAndClosed = payload.isPrintAndClosed

    commit('addObjectView', { viewId, object: newObject })
  },
}

export const getters = {
  objectView: (state) => (viewId) => {
    return state.objectViews.find((el) => el.viewId === viewId)
  },
}
