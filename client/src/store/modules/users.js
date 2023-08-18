import ProxyUrl from '@/constants/ProxyUrls'
import newUser from '@/dto/User.json'
import moment from 'moment'
import axios from 'axios'
import _ from 'lodash'

const initState = {
  openUser: _.cloneDeep(newUser),
  users: [],
  listView: {
    list: [],
    total: 0,
    page: 1,
    limit: 20,
    filters: {
      searchStr: '',
    },
    sort: { sortBy: null, sortDesc: false },
  },
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const mutations = {
  setUsers(state, payload) {
    state.users = payload
  },
  setOpenUser(state, payload) {
    state.openUser = payload
  },

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
  async getSelectFields() {
    return [{ key: 'name', label: 'table.name', sortable: true }]
  },

  async findAll({ commit }, payload) {
    const list = []

    return axios
      .get(`/user`, payload)
      .then((response) => {
        if (response.status === 200) {
          const result = response.data

          let list = []
          if (result.rows) {
            list = result.rows
          } else {
            list = result
          }

          for (const user of list) {
            user.createdAt = moment(user.createdAt).format('DD.MM.YYYY hh:mm:ss')
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

          if (!payload.noCommit) {
            commit('setListViewProperty', { list, total, page })
            commit('setUsers', list)
          }
        } else {
          if (!payload.noCommit) {
            commit('setListViewProperty', { list, total: list.length, page: 1 })
            commit('setUsers', list)
          }
        }
        return response
      })
      .catch((error) => {
        console.error(error)
        if (!payload.noCommit) {
          commit('setListViewProperty', { list, total: list.length, page: 1 })
          commit('setUsers', list)
        }
        return error
      })
  },

  async findByPk({ commit, dispatch, getters }, payload) {
    return axios
      .get(`${ProxyUrl.userDetails}/${payload.id}`, payload)
      .then((response) => {
        const currentUser = response.data
        if (!payload.noCommit) {
          commit('setOpenUser', currentUser)
        }

        return response
      })
      .catch((error) => {
        console.error(error)

        if (!payload.noCommit) {
          commit('setOpenUser', _.cloneDeep(newUser))
        }
        return _.cloneDeep(newUser)
      })
  },

  async addUser({ commit }, userData) {
    try {
      const response = await axios.post(`${ProxyUrl.addUser}`, userData)
      if (response && response.status === 200) {
        commit('setOpenUser', _.cloneDeep(newUser))
      }

      return response
    } catch (error) {
      return null
    }
  },

  async clearOpenUser({ commit }) {
    try {
      commit('setOpenUser', _.cloneDeep(newUser))
      return true
    } catch (error) {
      return false
    }
  },

  async editUser({ commit, dispatch }, payload) {
    try {
      const response = await axios.put(`${ProxyUrl.updateUser}/${payload.id}`, payload)
      if (response && response.status === 200) {
        commit('setOpenUser', _.cloneDeep(newUser))
      }

      return response
    } catch (error) {
      console.error(error)
      return null
    }
  },

  async delete({ dispatch }, userData) {
    try {
      const resUser = await axios.post(`${ProxyUrl.deleteUser}`, userData)
      if (resUser) {
        return true
      } else return false
    } catch (error) {
      console.error(error)
      return false
    }
  },

  resetState({ commit }) {
    commit('resetState')
  },
}

export const getters = {
  getUsers(state) {
    return state.users
  },
  getOpenUser(state) {
    return state.openUser
  },

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

  userList(state) {
    return state.listView.list
  },
}
