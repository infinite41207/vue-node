import axios from 'axios'
import _ from 'lodash'

const initState = {
  currentView: {
    dispositionListFirst: [],
    dispositionListSecond: [],
    total1: 0,
    total2: 0,
    page1: 1,
    page2: 1,
    filters1: {},
    filters2: {},
    sort1: { sortBy: null, sortDesc: false },
    sort2: { sortBy: null, sortDesc: false },
    weightType: '',
    currentWeight: 0,
    isSecondWeighting: false,
    tabIndex: 0,
    userId: '',
    scaleId: '',
    currentDisposition: null,
    currentDeliveryNote: null,
    currentBarCode: '',
    eqal: 0,
    showDetails: false,
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

  setDispositionListFirst(state, dispositions) {
    state.currentView.dispositionListFirst = dispositions
  },

  setDispositionListSecond(state, dispositions) {
    state.currentView.dispositionListSecond = dispositions
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

  async findAllForScalesCars({ commit }, payload) {
    let dispositionListFirst = []
    let dispositionListSecond = []
    let total1 = 0
    let total2 = 0
    let page1 = 1
    let page2 = 1

    if (!(payload && payload.scaleId && payload.scaleId.trim() !== '')) {
      commit('setListViewProperty', { dispositionListFirst, dispositionListSecond, page1, page2, total1, total2 })
      return
    }

    let arrayStatusIds = []
    let params = {
      params: {
        filter: {
          key: 'NaTerminalu',
        },
      },
    }
    let response = await axios.get('/disposition_statuses', params)
    if (response) {
      for (const item of response.data) {
        arrayStatusIds.push(item.id)
      }
    }

    params = {
      params: {
        filter: {
          typeOfDocument: 'Automobile',
          statusId: arrayStatusIds,
        },
        noCommit: true,
      },
    }

    if (payload && payload.scaleId && payload.scaleId.trim() !== '') {
      params.params.filter.scaleId = payload.scaleId
    }

    response = await actions.findAll({ commit }, params)
    if (response) {
      dispositionListFirst = response.data
      total1 = dispositionListFirst.length
      page1 = state.currentView.page1
    }

    arrayStatusIds = []
    params = {
      params: {
        filter: {
          key: ['Loaded', 'Unloaded', 'RemoveWeight'],
        },
      },
    }
    response = await axios.get('/disposition_statuses', params)
    if (response) {
      for (const item of response.data) {
        arrayStatusIds.push(item.id)
      }
    }

    params = {
      params: {
        filter: {
          typeOfDocument: 'Automobile',
          statusId: arrayStatusIds,
        },
        noCommit: true,
      },
    }

    if (payload && payload.scaleId && payload.scaleId.trim() !== '') {
      params.params.filter.scaleTwoId = payload.scaleId
    }

    response = await actions.findAll({ commit }, params)
    if (response) {
      dispositionListSecond = response.data
      total2 = dispositionListSecond.length
      page2 = state.currentView.page2
    }

    commit('setListViewProperty', { dispositionListFirst, dispositionListSecond, page1, page2, total1, total2 })
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

  dispositionListFirst(state) {
    return state.currentView.dispositionListFirst
  },

  dispositionListSecond(state) {
    return state.currentView.dispositionListSecond
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
  currentBarCode(state) {
    return state.currentView.currentBarCode
  },
  isSecondWeighting(state) {
    return state.currentView.isSecondWeighting
  },
  eqal(state) {
    return state.currentView.equal
  },
  weightType(state) {
    return state.currentView.weightType
  },
  showDetails(state) {
    return state.currentView.showDetails
  },
}
