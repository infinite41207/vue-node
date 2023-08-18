import axios from 'axios'
import moment from 'moment'
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
      product: null,
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

export const actions = {
  async findAll({ commit }, payload) {
    const list = []

    return axios
      .get(`/discount`, payload)
      .then((response) => {
        if (response.status === 200) {
          const result = response.data

          let list = []
          if (result.rows) {
            list = result.rows
          } else {
            list = result
          }

          list.forEach((el) => {
            el.createdAt = moment(el.createdAt).format('DD.MM.YYYY HH:mm:ss')
            el.date = moment(el.date).format('DD.MM.YYYY hh:mm:ss')
            if (!el.beginDate) {
              el.beginDate = ''
            } else {
              el.beginDate = moment(el.beginDate).format('DD.MM.YYYY')
            }

            if (!el.endDate) {
              el.endDate = ''
            } else {
              el.endDate = moment(el.endDate).format('DD.MM.YYYY')
            }

            el.presentation = `Rabat nr ${el.number} od ${el.createdAt}`
          })

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

          if (!payload.noCommit) {
            commit('setListViewProperty', { list, total, page })
          }
        } else {
          if (!payload.noCommit) {
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

  async findByPk({ commit }, payload) {
    if (state.objectViews.some((v) => v.viewId === payload.params.id)) return

    return axios
      .get(`/discount/${payload.params.id}`, payload.query)
      .then((response) => {
        const object = response.data
        object.createdAt = moment(object.createdAt).format('DD.MM.YYYY hh:mm:ss')
        object.date = moment(object.date).format('DD.MM.YYYY hh:mm:ss')
        if (!object.beginDate) {
          object.beginDate = ''
        } else {
          object.beginDate = moment(object.beginDate).format('DD.MM.YYYY')
        }

        if (!object.endDate) {
          object.endDate = ''
        } else {
          object.endDate = moment(object.endDate).format('DD.MM.YYYY')
        }

        commit('addObjectView', { viewId: payload.params.id, object, tabIndex: 0 })
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async update({ commit }, payload) {
    return axios
      .put(`/discount/${payload.id}`, payload)
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
      presentation = objectView.object.number
    }

    return presentation
  },

  customerList(state) {
    return state.listView.list
  },
}
