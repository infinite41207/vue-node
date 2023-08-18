import ProxyUrl from '../../constants/ProxyUrls'
import axios from 'axios'
import _ from 'lodash'

const initState = {
  histories: [],
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const mutations = {
  addHistory(state, history) {
    state.histories.push(history)
  },

  emptyHistory(state, histories) {
    state.histories = histories
  },

  setHistories(state, histories) {
    state.histories = histories
  },

  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const getters = {
  histories(state) {
    return state.histories
  },
}

export const actions = {
  async findAllByPk({ commit }, payload) {
    try {
      const response = await axios.get(`${ProxyUrl.getallbphistories}`, payload)
      const result = response.data.responseData
      let histories
      if (result) {
        histories = result.filter((e) => e.exemplarId === payload.id)
      }
      commit('setHistories', histories)
      return histories
    } catch {
      commit('emptyHistory', [])
    }
  },

  async addHistory({ commit }, data) {
    const saveData = _.cloneDeep(data)

    const resItem = await axios.post(`${ProxyUrl.createbphistory}`, saveData)
    if (Number(resItem.data.httpStatus) === 200) {
      const history = resItem.data.responseData
      commit('addHistory', history)
      return true
    } else return false
  },

  resetState({ commit }) {
    commit('resetState')
  },
}
