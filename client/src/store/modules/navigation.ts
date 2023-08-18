import axios from 'axios'
import _ from 'lodash'
import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { INavigationState, INavigationItem } from '../types/NavigationType'

export const initState: INavigationState = {
  navigation: [],
}

export const state: INavigationState = Object.assign({}, _.cloneDeep(initState))

export const mutations: MutationTree<INavigationState> = {
  setNavigation(state: INavigationState, payload: Array<INavigationItem>) {
    state.navigation = payload
  },
  resetState(state: INavigationState) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const getters: GetterTree<INavigationState, any> = {
  navigation(state: INavigationState): Array<INavigationItem> {
    return state.navigation
  },
}

export const actions: ActionTree<INavigationState, any> = {
  // Logs in the current user.
  async findAll({ commit }, pyload) {
    return axios
      .get('/navigation')
      .then((response) => {
        if (response.status === 200 && !pyload.noCommit) {
          commit('setNavigation', response.data)
        }

        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async update({ commit }, pyload: object) {
    return axios
      .post('/navigation', pyload)
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
