import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'

const initState = {
  taskTemplates: [],
  openTaskTemplate: {},
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const mutations = {
  setTaskTemplates(state, payload) {
    state.taskTemplates = payload
  },
  setOpenTaskTemplate(state, payload) {
    state.openTaskTemplate = payload
  },
  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const actions = {
  async findAll({ commit }, payload) {
    return axios.get(`/task_template`, payload).then((response) => {
      const taskTemplates = response.data

      commit('setTaskTemplates', taskTemplates)
      return taskTemplates
    })
  },

  async findByPk({ commit }, payload) {
    return axios
      .get(`/task_template/${payload.params.id}`, payload.query)
      .then((response) => {
        if (response.status === 200) {
          const taskTemplate = { ...response.data }

          taskTemplate.createdAt = moment(taskTemplate.createdAt).format('DD MM YYYY hh:mm:ss')

          commit('setOpenTaskTemplate', taskTemplate)
        } else {
          commit('setOpenTaskTemplate', {})
        }
        return response
      })
      .catch((error) => {
        console.log(error)
        commit('setOpenTaskTemplate', {})
        return { status: 404 }
      })
  },

  async getTemplateData({ commit }, payload) {
    return axios
      .get(`/task_template/${payload.id}`, payload.query)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.log(error)
        return { status: 404 }
      })
  },

  resetState({ commit }) {
    commit('resetState')
  },
}

export const getters = {
  taskTemplatesList(state) {
    return state.taskTemplates
  },
  openTaskTemplate(state) {
    return state.openTaskTemplate
  },
}
