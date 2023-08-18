import axios from 'axios'
import moment from 'moment'
import Vue from 'vue'
import _ from 'lodash'

const initState = {
  listView: {
    list: [],
    total: 0,
    page: 1,
    limit: 20,
    filters: {
      searchStr: '',
      period: [null, null],
      schemeOfCargo: null,
      box: null,
      forwarder: null,
      deliveryOrder: null,
      orderState: null,
      carrier: null,
      product: null,
      ship: null,
      customer: null,
      vendor: null,
      warehouse: null,
      status: null,
      position: null,
      typeOfDocument: '',
      type: '',
    },
    sort: { sortBy: null, sortDesc: false },
  },
  objectViews: [],
  dispositionListFirst: [],
  dispositionListSecond: [],
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const mutations = {
  setListViewProperty(state, payload) {
    Object.keys(payload).forEach((key) => {
      state.listView[key] = payload[key]
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
      Vue.set(state.objectViews[index].object, payload.property, payload.value)
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
    state.dispositionListFirst = dispositions
  },

  setDispositionListSecond(state, dispositions) {
    state.dispositionListSecond = dispositions
  },

  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const actions = {
  async getSelectFields() {
    return [
      { key: 'date', label: 'Data', sortable: true },
      { key: 'numberStr', label: 'Numer', sortable: true },
      { key: 'typeOfDocument', label: 'Typ dokumentu', sortable: true },
      { key: 'vehicle.name', label: 'Numer samochodu', sortable: true },
      { key: 'driver.name', label: 'Kierowca', sortable: true },
    ]
  },

  async findAll({ commit }, payload) {
    const list = []

    return axios
      .get(`/disposition`, payload)
      .then((response) => {
        if (!payload.noCommit) {
          if (response.status === 200) {
            const result = response.data

            let list = []
            if (result.rows) {
              list = result.rows
            } else {
              list = result
            }

            for (const el of list) {
              el.date = moment(el.date).format('DD.MM.YYYY HH:mm:ss')
              el.approvedDate = moment(el.approvedDate).format('DD.MM.YYYY')
            }

            const total = result.count ? result.count : list.length
            let page = state.listView.page

            if (total > 0) {
              const pages = Math.ceil(total / state.listView.limit)
              if (pages < state.listView.page) {
                page = pages
              }
            } else {
              page = 1
            }
            commit('setListViewProperty', { list, total, page })
          } else {
            commit('setListViewProperty', { list, total: list.length, page: 1 })
          }
        }

        return response
      })
      .catch((error) => {
        console.error(error)
        if (!payload.noCommit) {
          commit('setListViewProperty', { list, total: list.length, page: 1 })
        }
        return error
      })
  },

  async findAllForScalesCars({ commit }, payload) {
    let dispositionListFirst = []
    let dispositionListSecond = []

    let params = {
      params: {
        filter: {
          typeOfDocument: 'Automobile',
          state: 'NaTerminalu',
        },
      },
    }

    if (payload && payload.scaleId && payload.scaleId.trim() !== '') {
      params.params.filter.scaleId = payload.scaleId
    }

    let response = await actions.findAll({ commit }, params)
    if (response) {
      dispositionListFirst = response.data
    }

    params = {
      params: {
        filter: {
          typeOfDocument: 'Automobile',
          state: ['Loaded', 'Unloaded', 'RemoveWeight'],
        },
      },
    }

    if (payload && payload.scaleId && payload.scaleId.trim() !== '') {
      params.params.filter.scaleTwoId = payload.scaleId
    }

    response = await actions.findAll({ commit }, params)
    if (response) {
      dispositionListSecond = response.data
    }

    commit('setDispositionListFirst', dispositionListFirst)
    commit('setDispositionListSecond', dispositionListSecond)

    // commit('setListViewProperty', { dispositionListFirst, total: dispositionListFirst.length, page: 1, })
    // commit('setListViewProperty', { dispositionListSecond, total: dispositionListSecond.length, page: 1 })
  },

  async findAllForScalesBunker({ commit }, payload) {
    let dispositionListFirst = []

    const params = {
      params: {
        filter: {
          typeOfDocument: 'Automobile',
          state: ['OnTheWay', 'ParkingEntry', 'Accepted', 'ParkingDeparture', 'NaTerminalu'],
        },
      },
    }

    if (payload && payload.weighingStationId && payload.weighingStationId.trim() !== '') {
      params.params.filter.weighingStationId = payload.weighingStationId
    }

    const response = await actions.findAll({ commit }, params)
    if (response) {
      dispositionListFirst = response.data
    }

    commit('setDispositionListFirst', dispositionListFirst)

    // commit('setListViewProperty', { dispositionListFirst, total: dispositionListFirst.length, page: 1, })
    // commit('setListViewProperty', { dispositionListSecond, total: dispositionListSecond.length, page: 1 })
  },

  async findAllForScalesRailway({ commit }, payload) {
    let dispositionListFirst = []

    const params = {
      params: {
        filter: {
          typeOfDocument: 'Railway',
          state: ['OnTheWay', 'NaTerminalu'],
        },
      },
    }

    if (payload && payload.scaleId && payload.scaleId.trim() !== '') {
      params.params.filter.scaleId = payload.scaleId
    }

    const response = await actions.findAll({ commit }, params)
    if (response) {
      dispositionListFirst = response.data
    }

    commit('setDispositionListFirst', dispositionListFirst)

    // commit('setListViewProperty', { dispositionListFirst, total: dispositionListFirst.length, page: 1, })
    // commit('setListViewProperty', { dispositionListSecond, total: dispositionListSecond.length, page: 1 })
  },

  async findByPk({ commit }, payload) {
    // if (state.objectViews.some((v) => v.viewId === payload.params.id)) return

    return axios
      .get(`/disposition/${payload.params.id}`, payload.query)
      .then((response) => {
        const object = response.data
        object.createdAt = moment(object.createdAt).format('DD.MM.YYYY hh:mm:ss')
        commit('addObjectView', { viewId: payload.params.id, object, tabIndex: 0 })
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async create({ commit }, payload) {
    return axios
      .post(`/disposition`, payload)
      .then((response) => {
        return response
      })
      .catch((err) => {
        console.log('error in create disposition store: ', err)
      })
  },

  async update({ commit }, payload) {
    return axios
      .put(`/disposition/${payload.id}`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async getDispositionByTicket({ commit }, payload) {
    return axios
      .get(`/disposition_by_ticket`, payload)
      .then((response) => {
        return response
      })
      .catch((err) => {
        console.error(err)
      })
  },

  async getNumberOfWeighted({ dispatch }, payload) {
    const response = await axios.get(`/get_number_of_weighted/${payload.dispositionId}`, payload)
    return response.data
  },

  async changeDeletionMark({ commit }, payload) {
    return axios
      .post(`/disposition/change_deletion_mark`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async delete({ commit }, payload) {
    return axios
      .delete(`/disposition/${payload.id}`, payload)
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
  listView(state) {
    return state.listView
  },

  objectView: (state) => (viewId) => {
    return state.objectViews.find((el) => el.viewId === viewId)
  },

  presentation: (state) => (viewId) => {
    const objectView = state.objectViews.find((el) => el.viewId === viewId)

    let presentation = ''
    if (objectView) {
      presentation = objectView.object.numberStr
    }

    return presentation
  },

  dispositionListFirst(state) {
    return state.dispositionListFirst
  },

  dispositionListSecond(state) {
    return state.dispositionListSecond
  },
}
