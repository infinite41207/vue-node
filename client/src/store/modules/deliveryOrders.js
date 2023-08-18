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
      counterparty: null,
      typeOfOperation: null,
      orderState: null,
    },
    sort: { sortBy: null, sortDesc: false },
  },
  objectViews: [],
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

  resetState(state) {
    state = Object.assign(state, _.cloneDeep(initState))
  },
}

export const actions = {
  async getSelectFields() {
    return [
      { key: 'date', label: 'Data', sortable: true },
      { key: 'number', label: 'Numer', sortable: true },
    ]
  },

  async findAll({ commit }, payload) {
    const list = []

    return axios
      .get(`/delivery_order`, payload)
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
              el.dateIssueDSK = moment(el.dateIssueDSK).format('DD.MM.YYYY HH:mm:ss')
              el.createdAt = moment(el.createdAt).format('DD.MM.YYYY HH:mm:ss')
              el.date = moment(el.date).format('DD.MM.YYYY HH:mm:ss')
              if (el.timeEnd) {
                el.timeEnd = moment(el.timeEnd).format('DD.MM.YYYY HH:mm:ss')
              }
              if (el.timeStart) {
                el.timeStart = moment(el.timeStart).format('DD.MM.YYYY HH:mm:ss')
              }
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
        if (!payload.noCommit) {
          commit('setListViewProperty', { list, total: list.length, page: 1 })
        }
        throw error
      })
  },

  async findByPk({ commit }, payload) {
    if (!payload.noCommit) {
      if (state.objectViews.some((v) => v.viewId === payload.params.id)) return
    }

    return axios
      .get(`/delivery_order/${payload.params.id}`, payload.query)
      .then((response) => {
        if (!payload.noCommit) {
          const object = response.data
          object.createdAt = moment(object.createdAt).format('DD.MM.YYYY HH:mm:ss')
          commit('addObjectView', { viewId: payload.params.id, object, tabIndex: 0 })
        }
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async create({ commit }, payload) {
    return axios.post(`/delivery_order`, payload).then((response) => {
      return response
    })
  },

  async update({ commit }, payload) {
    console.info(payload)
    return axios
      .put(`/delivery_order/${payload.id}`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async changeDeletionMark({ commit }, payload) {
    return axios
      .post(`/delivery_order/change_deletion_mark`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async delete({ commit }, payload) {
    return axios
      .delete(`/delivery_order/${payload.id}`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async getSubordination(context, payload) {
    return axios
      .get(`/delivery_order/subordination/${payload.objectId}`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
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
}
