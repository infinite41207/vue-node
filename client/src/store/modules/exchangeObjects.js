import axios from 'axios'
import _ from 'lodash'

const initState = {
  exchangeObjects: [],
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const mutations = {
  setExchangeObjects(state, payload) {
    state.exchangeObjects = payload
  },

  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const actions = {
  async findAll({ commit }, payload) {
    return axios.get(`/exchange_object/all`, payload).then((response) => {
      const exchangeObjects = response.data

      commit('setExchangeObjects', exchangeObjects)
      return exchangeObjects
    })
  },

  async update(context, payload) {
    try {
      const response = await axios.put(`/exchange_object/${payload.id}`, payload)
      return response
    } catch (error) {
      console.error(error)
      return error
    }
  },

  async delete({ commit }, payload) {
    return axios
      .delete(`/exchange_object/${payload.params.id}`, payload.query)
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
  list(state) {
    return state.exchangeObjects
  },
}
