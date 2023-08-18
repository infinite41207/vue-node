import axios from 'axios'
import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { IAuthState, ICurrentUserData, ICurrentLanguageData } from '../types/AuthType'
import _ from 'lodash'

const dafaultLanguage: ICurrentLanguageData = { code: 'pl', name: 'Polski' }

export const state: IAuthState = {
  currentUser: getCookiesCurrentUser(),
  currentLanguage: getCookiesCurrentLanguage() || dafaultLanguage,
}

export const mutations: MutationTree<IAuthState> = {
  setCurrentUser(state: IAuthState, payload: ICurrentUserData) {
    state.currentUser = payload
    saveState('auth.currentUser', payload)
  },

  setCurrentLanguage(state: IAuthState, payload: ICurrentLanguageData) {
    state.currentLanguage = payload
    saveState('auth.currentLanguage', payload)
  },
}

export const getters: GetterTree<IAuthState, any> = {
  // Whether the user is currently logged in.
  loggedIn(state: IAuthState) {
    return !!state.currentUser
  },

  currentUser(state: IAuthState) {
    return state.currentUser
  },

  currentLanguage(state: IAuthState) {
    return state.currentLanguage
  },
}

export const actions: ActionTree<IAuthState, any> = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init({ state, dispatch }) {
    dispatch('validate')
  },

  async getUserRoles() {
    try {
      const response = await axios.get(`/user_roles`)
      if (response.status === 200) {
        return response.data.userModules
      } else return []
    } catch (error) {
      console.error(error)
      return []
    }
  },

  // Logs in the current user.
  async logIn({ commit, dispatch, getters }, { username, password, remember } = {}) {
    if (getters.loggedIn) return dispatch('validate')

    return axios({
      method: 'POST',
      url: `/auth/login`,
      data: { email: username, password, remember },
      withCredentials: true,
    })
      .then((response) => {
        const user = response.data
        commit('setCurrentUser', user)
        return user
      })
      .catch((err) => {
        throw err
      })
  },

  // Logs out the current user.
  async logOut({ commit }) {
    axios.get(`/auth/logout`).catch((error) => {
      throw error
    })

    commit('setCurrentUser', null)
  },

  // register the user
  async register({ commit, dispatch, getters }, { name, email, login, password } = {}) {
    if (getters.loggedIn) return dispatch('validate')
    return axios
      .post(`/auth/register`, {
        name: name,
        login: login,
        email: email,
        password: password,
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  // register the user
  async resetPassword({ commit, dispatch, getters }, { email } = {}) {
    if (getters.loggedIn) return dispatch('validate')
    return axios.post(`/auth/forgot_password`, { email }).then((response) => {
      return response
    })
  },

  async validate({ commit, state }) {
    if (!state.currentUser) return Promise.resolve(null)

    axios.defaults.withCredentials = true

    return axios
      .get(`/auth/session`)
      .then((response) => {
        const user = response.data.result
        commit('setCurrentUser', user)
        return user
      })
      .catch((error) => {
        console.error(error)
        commit('setCurrentUser', null)
        return null
      })
  },
}

// ===
// Private helpers
// ===

function getCookiesCurrentUser(): ICurrentUserData {
  const currentUser = window.localStorage.getItem('auth.currentUser')
  return currentUser ? JSON.parse(currentUser) : null
}

function getCookiesCurrentLanguage(): ICurrentLanguageData | null {
  const currentLanguage = window.localStorage.getItem('auth.currentLanguage')
  return currentLanguage ? JSON.parse(currentLanguage) : null
}

function saveState(key: string, state: ICurrentUserData | ICurrentLanguageData) {
  window.localStorage.setItem(key, JSON.stringify(state))
}
