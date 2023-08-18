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
    lostWeight: 0,
    netto: 0,
    weightAtBeginning: 0,
    weightAtEnd: 0,
    weightOperation: '',
    userId: null,
    weighingStationId: null,
    weighingStation: null,
    scaleId: null,
    scale: null,
    currentDisposition: null,
    currentDeliveryNote: null,
    currentBarCode: '',
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

  async findAllForScalesBunker({ commit }, payload) {
    const dispositionList = []
    let total = 0
    let page = 1
    if (!(payload && payload.weighingStationId && payload.weighingStationId.trim() !== '')) {
      commit('setListViewProperty', { dispositionList, page, total })
      return
    }

    let arrayStatusIds = []
    let params = {
      params: {
        filter: {
          key: ['NaTerminalu', 'SecondWeighing', 'ParkingExit'],
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
    params.params.filter.weighingStationId = payload.weighingStationId

    response = await actions.findAll({ commit }, params)
    if (response) {
      for (const item of response.data) {
        if (item.schemeOfCargo.disableControlOnScales === true) {
          dispositionList.push(item)
        } else {
          if (item.status.key === 'NaTerminalu') {
            dispositionList.push(item)
          }
        }
      }
    }

    arrayStatusIds = []
    params = {
      params: {
        filter: {
          key: 'OnTheWay',
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
          typeOfDocument: 'Railway',
          statusId: arrayStatusIds,
        },
        noCommit: true,
      },
    }
    params.params.filter.weighingStationId = payload.weighingStationId

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

  async setLockedDisposition({ dispatch }, payload) {
    const queryParams = {
      id: payload.dispositionId,
    }
    const response = await actions.getLockedParameters({}, queryParams)
    if (response && response.status === 200) {
      payload.id = response.data.id
      return axios
        .put(`/weighted_dispositions/${payload.id}`, payload)
        .then((response) => {
          return response
        })
        .catch((err) => {
          console.log('error at update lock disposition store: ', err)
        })
    } else {
      return axios
        .post(`/weighted_dispositions`, payload)
        .then((response) => {
          return response
        })
        .catch((err) => {
          console.log('error at create lock disposition store: ', err)
        })
    }
  },

  async deleteLockedDisposition({ dispatch }, payload) {
    const queryParams = {
      id: payload.dispositionId,
    }
    const response = await actions.getLockedParameters({}, queryParams)
    if (response) {
      payload.id = response.data.id
      try {
        const response = await axios.delete(`/weighted_dispositions/${payload.id}`, payload)
        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }
  },

  async getLockedParameters({ dispatch }, payload) {
    return await axios
      .get(`/weighted_find_dispositions`, { params: payload })
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

  weighingStationId(state) {
    return state.currentView.weighingStationId
  },

  weighingStation(state) {
    return state.currentView.weighingStation
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
  lostWeight(state) {
    return state.currentView.lostWeight
  },
  netto(state) {
    return state.currentView.netto
  },
  weightAtBeginning(state) {
    return state.currentView.weightAtBeginning
  },
  weightAtEnd(state) {
    return state.currentView.weightAtEnd
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
}
