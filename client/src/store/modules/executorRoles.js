import axios from 'axios'
import ExecutorRole from '../../dto/ExecutorRole.json'
import moment from 'moment'
import _ from 'lodash'

const initState = {
  executorRoles: [],
  openExecutorRole: _.cloneDeep(ExecutorRole),
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const mutations = {
  setExecutorRoles(state, payload) {
    state.executorRoles = payload
  },
  setOpenExecutorRole(state, payload) {
    if (payload === null) {
      state.openExecutorRole = _.cloneDeep(ExecutorRole)
    } else {
      state.openExecutorRole = payload
    }
  },
  setObjectProperty(state, { property, value }) {
    state.openExecutorRole[property] = value
  },
  addObjectExecutor(state, payload) {
    state.openExecutorRole.executors.push(payload)
  },

  removeObjectExecutor(state, payload) {
    const removeIndex = state.openExecutorRole.executors.findIndex((item) => item.executorId === payload.executorId)
    state.openExecutorRole.executors.splice(removeIndex, 1)
  },

  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const actions = {
  async findAll({ commit }, payload) {
    return axios
      .get(`/executor_role`, payload)
      .then((response) => {
        if (!payload.noCommit) {
          if (response.status === 200) {
            commit('setExecutorRoles', response.data)
          } else {
            commit('setExecutorRoles', [])
          }
        }

        return response
      })
      .catch((error) => {
        if (!payload.noCommit) {
          commit('setExecutorRoles', [])
        }
        throw error
      })
  },
  async findByPk({ commit }, payload) {
    return axios
      .get(`/executor_role/${payload.params.id}`, payload.query)
      .then((response) => {
        if (response.status === 200) {
          const executorRole = response.data
          executorRole.createdAt = moment(executorRole.createdAt).format('DD MM YYYY hh:mm:ss')
          commit('setOpenExecutorRole', executorRole)
        } else {
          commit('setOpenExecutorRole', {})
        }

        return response
      })
      .catch((error) => {
        console.error(error)
        commit('setOpenExecutorRole', {})
        return { status: 404 }
      })
  },
  async create({ commit }, payload) {
    return axios.post(`/executor_role`, payload).then((response) => {
      return response
    })
  },

  async update({ commit }, payload) {
    return axios.put(`/executor_role/${payload.id}`, payload).then((response) => {
      return response
    })
  },

  resetState({ commit }) {
    commit('resetState')
  },
}

export const getters = {
  executorRolesList(state) {
    return state.executorRoles
  },
  openExecutorRole(state) {
    return state.openExecutorRole
  },
}
