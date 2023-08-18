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
      paymentType: null,
      cashFlowItem: null,
      project: null,
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

  setObjectViewProperties(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      Object.keys(payload.props).forEach((key) => {
        state.objectViews[index][key] = payload.props[key]
      })
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
    Object.assign(state, _.cloneDeep(initState))
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

export const actions = {
  async findAll({ commit, state }, payload) {
    return axios
      .get(`/payment_operation`, payload)
      .then((response) => {
        const result = response.data

        let list = []
        if (result.rows) {
          list = result.rows
        } else {
          list = result
        }

        list.forEach((el) => {
          el.createdAt = moment(el.createdAt).format('DD.MM.YYYY HH:mm:ss')
          if (!el.date) {
            el.date = ''
          } else {
            el.date = moment(el.date).format('DD.MM.YYYY')
          }
          if (el.numberStr === null) {
            el.numberStr = el.prefix + '-' + el.number.toString().padStart(6, '0')
          }
          el.presentation = `Operacja płatnośći nr ${el.numberStr} od ${el.createdAt}`
        })

        if (!payload.noCommit) {
          commit('setListViewProperty', { list })
        }

        let total = 0
        if (result.count) {
          total = result.count
        } else {
          total = list.length
        }

        if (total > 0) {
          const pages = Math.ceil(total / state.listView.limit)

          if (pages >= state.listView.page) {
            commit('setListViewProperty', { total })
          } else {
            commit('setListViewProperty', { total, page: pages })
          }
        } else {
          commit('setListViewProperty', { total, page: 1 })
        }

        return response
      })
      .catch((error) => {
        console.error(error)
        commit('setListViewProperty', { list: [], total: 0, page: 1 })
        return error
      })
  },

  async findByPk({ commit, state, getters }, payload) {
    if (!payload.noCommit) {
      if (state.objectViews.some((v) => v.viewId === payload.params.id)) {
        return { status: 200 }
      }
    }

    return axios
      .get(`/payment_operation/${payload.params.id}`)
      .then((response) => {
        if (!payload.noCommit && response.status === 200) {
          const object = response.data
          commit('addObjectView', {
            viewId: payload.params.id,
            object,
            viewMode: 'order_modification',
            referenceDouble: false,
            tabIndex: 0,
          })
        }

        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async createObject(context, payload) {
    const writeObject = _.cloneDeep(payload)

    return axios.post(`/payment_operation`, writeObject).then((response) => {
      return response
    })
  },

  async updateObject(context, payload) {
    const updateObject = _.cloneDeep(payload)
    
    return axios.put(`/payment_operation/${updateObject.id}`, updateObject).then((response) => {
      return response
    })
  },

  async changeDeletionMark({ commit }, payload) {
    return axios.post(`/payment_operation/change_deletion_mark`, { orderId: payload.id }).then((response) => {
      return response
    })
  },

  resetState({ commit }) {
    commit('resetState')
  },
}
