import axios from 'axios'
import _ from 'lodash'

const initState = {
  expressionVariables: [],
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const mutations = {
  setExpressionVariables(state, expressionVariables) {
    state.expressionVariables = expressionVariables
  },
  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const actions = {
  async getProductParameters({ commit }, payload) {
    return axios
      .post(`/product_parameter`, payload)
      .then((response) => {
        const parameters = response.data
        return parameters
      })
      .catch((error) => {
        console.log(error)
        return []
      })
  },

  async getProductParamsSettings({ commit }, payload) {
    return axios
      .get(`/product_param_setting`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        throw error
      })
  },

  async getParameterValues({ commit }, payload) {
    return axios
      .post(`/parameter_value`, payload)
      .then((response) => {
        const parameterValues = response.data
        return parameterValues
      })
      .catch((error) => {
        console.log(error)
        return []
      })
  },

  async getSelectedValues({ commit }, payload) {
    return axios
      .post(`/selected_value`, payload)
      .then((response) => {
        const parameterValues = response.data
        return parameterValues
      })
      .catch((error) => {
        console.log(error)
        return []
      })
  },

  async getNextParameterValues({ commit }, payload) {
    return axios
      .post(`/next_param_value`, payload)
      .then((response) => {
        const parameterValues = response.data
        return parameterValues
      })
      .catch((error) => {
        console.log(error)
        return []
      })
  },

  async getExpressionVariables({ commit }, payload) {
    return axios
      .post(`/expression_variables`, payload)
      .then((response) => {
        const expressionVariables = response.data
        commit('setExpressionVariables', expressionVariables)
        return expressionVariables
      })
      .catch((error) => {
        console.log(error)
        return []
      })
  },

  resetState({ commit }) {
    commit('resetState')
  },
}

export const getters = {
  expressionVariables(state) {
    return state.expressionVariables
  },
}
