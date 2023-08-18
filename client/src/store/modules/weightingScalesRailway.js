import axios from 'axios'
import _ from 'lodash'

const initState = {
  currentView: {
    dispositionList: [],
    total: 0,
    page: 1,
    filters: {},
    sort: { sortBy: null, sortDesc: false },
    currentWeight: 0,
    userId: null,
    weighingStationId: null,
    weighingStation: null,
    scaleId: null,
    scale: null,
    currentDisposition: null,
    currentDeliveryNote: null,
    currentBarCode: '',
    showDetails: false,
    dispositionFilter: {},
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

  setDispositionList(state, dispositions) {
    state.currentView.dispositionList = dispositions
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

  async findAllForScalesRailway({ commit }, payload) {
    const dispositionList = []
    let total = 0
    let page = 1
    if (!(payload && payload.scaleId && payload.scaleId.trim() !== '')) {
      commit('setListViewProperty', { dispositionList, page, total })
      return
    }

    const arrayStatusIds = []
    let params = {
      params: {
        filter: {
          key: ['OnTheWay', 'NaTerminalu'],
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
          typeOfDocument: 'Railway',
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
      for (const item of response.data) {
        dispositionList.push(item)
      }
    }

    total = dispositionList.length
    page = state.currentView.page

    commit('setListViewProperty', { dispositionList, page, total })
  },

  async getDispositionFilter({ commit }, payload) {
    const dispositionFilter = {
      typeOfDocument: 'Railway',
    }

    const arrayStatusIds = []
    const params = {
      params: {
        filter: {
          key: ['OnTheWay', 'NaTerminalu'],
        },
      },
    }
    const response = await axios.get('/disposition_statuses', params)
    if (response) {
      for (const item of response.data) {
        arrayStatusIds.push(item.id)
      }
    }

    dispositionFilter.statusId = arrayStatusIds

    if (payload && payload.scaleId && payload.scaleId.trim() !== '') {
      dispositionFilter.scaleId = payload.scaleId
    }

    commit('setListViewProperty', { dispositionFilter })
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

  async updateDisposition({ commit }, payload) {
    const params = {
      params: {
        filter: {
          key: payload.newStateDisposition,
        },
      },
    }
    let newStatusId = null
    const response = await axios.get('/disposition_statuses', params)
    if (response) {
      newStatusId = response.data[0].id
    }

    const dispositionData = {
      id: payload.dispositionId,
      state: payload.newStateDisposition,
      statusId: newStatusId,
      numberOfWeighted: payload.numberOfWeighted,
    }
    return await axios
      .put(`/disposition/${dispositionData.id}`, dispositionData)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
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
  dispositionList(state) {
    return state.currentView.dispositionList
  },
  userId(state) {
    return state.currentView.userId
  },
  scaleId(state) {
    return state.currentView.scaleId
  },
  scale(state) {
    return state.currentView.scale
  },
  currentDisposition(state) {
    return state.currentView.currentDisposition
  },
  currentDeliveryNote(state) {
    return state.currentView.currentDeliveryNote
  },
  currentWeight(state) {
    return state.currentView.currentWeight
  },
  weightOperation(state) {
    return state.currentView.weightOperation
  },
  currentBarCode(state) {
    return state.currentView.currentBarCode
  },
  showDetails(state) {
    return state.currentView.showDetails
  },
  dispositionFilter(state) {
    return state.currentView.dispositionFilter
  },
}
