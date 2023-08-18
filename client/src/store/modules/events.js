import axios from 'axios'
import moment from 'moment'

export const state = {
  listView: {
    list: [],
    total: 0,
    page: 1,
    limit: 20,
    filters: {
      searchStr: '',
      counterparty: null,
      status: null,
      type: null,
      project: null,
    },
    sort: { sortBy: null, sortDesc: false },
    date: null,
    begin: null,
    ending: null,
    contact: '',
    howToContact: '',
    description: '',
    markedToDelete: false,
    counterparty: null,
    employee: null,
    project: null,
    interaction: null,
    author: null,
  },
  objectViews: [],
}

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

  setConfigProducts(state, payload) {
    state.configProducts = payload
  },
}

export const actions = {
  async findAll({ commit }, payload) {
    const list = []

    return axios
      .get(`/events`, payload)
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

  async findByPk({ commit }, payload) {
    if (state.objectViews.some((v) => v.viewId === payload.params.id)) return

    return axios
      .get(`/events/${payload.params.id}`, payload.query)
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
    return axios.post(`/events`, payload).then((response) => {
      return response
    })
  },

  async update({ commit }, payload) {
    return axios
      .put(`/events/${payload.id}`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async getSelectFields() {
    return [
      { key: 'name', label: 'table.name', sortable: true },
      { key: 'date', label: 'table.date', sortable: true },
    ]
  },

  async getPrice({ commit }, payload) {
    return axios.post(`/events/getPrice`, payload).then((response) => {
      if (response.status === 200) {
        return response.data
      } else {
        return undefined
      }
    })
  },

  async changeDeletionMark({ commit }, payload) {
    return axios
      .post(`/events/change_deletion_mark`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
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
      presentation = objectView.object.name
    }

    return presentation
  },

  configProductList(state) {
    return state.configProducts
  },
}
