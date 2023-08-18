import axios from 'axios'
import _ from 'lodash'

const initState = {
  currentView: {
    currentBarCode: '',
    weightType: '',
    stabilityInfo: '',
    currentWeight: 0,
    isSecondWeighting: false,
    userId: '',
    scaleId: '',
    currentDisposition: null,
    currentDeliveryNote: null,
    eqal: 0,
  },
  objectViews: [],
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const mutations = {
  setListViewProperty(state, payload) {
    Object.keys(payload).forEach((key) => {
      state.currentView[key] = payload[key]
    })
  },

  setFilters(state, filter) {
    Object.keys(filter).forEach((key) => {
      state.listView.filters[key] = filter[key]
    })
  },

  setSort(state, sort) {
    Object.keys(sort).forEach((key) => {
      state.listView.sort[key] = sort[key]
    })
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

  setCurrentView(state, currentView) {
    state.currentView = currentView
  },

  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const actions = {
  async findAll({ commit }, payload) {
    const list = []

    return axios
      .get(`/disposition`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async getDispositionByTicket({ commit }, payload) {
    return await axios
      .get(`/disposition_by_ticket`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async getNumberOfWeighted({ dispatch }, payload) {
    return await axios
      .get(`/disposition_number_of_weighted`, { params: payload })
      .then((response) => {
        return response.data
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

export const getters = {
  currentView(state) {
    return state.currentView
  },

  objectView: (state) => (viewId) => {
    return state.objectViews.find((el) => el.viewId === viewId)
  },

  userId(state) {
    return state.currentView.userId
  },

  scaleId(state) {
    return state.currentView.scaleId
  },

  currentDisposition(state) {
    return state.currentView.currentDisposition
  },

  currentDeliveryNote(state) {
    return state.currentView.currentDeliveryNote
  },

  isSecondWeighting(state) {
    return state.currentView.isSecondWeighting
  },
  eqal(state) {
    return state.currentView.equal
  },
  currentBarCode(state) {
    return state.currentView.equal
  },
  weightType(state) {
    return state.currentView.weightType
  },
  stabilityInfo(state) {
    return state.currentView.stabilityInfo
  },
}
