import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'

const initState = {
  notifications: [],
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const mutations = {
  setNotifications(state, notifications) {
    state.notifications = notifications
  },
  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const actions = {
  async getNotifications({ commit }, payload) {
    return axios.get(`/notification`, payload).then((response) => {
      const notifications = response.data

      notifications.forEach((el) => {
        if (el.type === 'INFO') {
          el.icon = 'ri-italic'
          el.iconColor = 'success'
        }

        el.createdAt = moment(el.createdAt).format('DD MM YYYY HH:mm:ss')
      })

      commit('setNotifications', notifications)
      return notifications
    })
  },

  async updateNotification({ state, commit }, payload) {
    try {
      const response = await axios.put(`/notification/${payload.params.id}`, payload.updateData)
      if (response.status === 200) {
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
  notificationList(state) {
    return state.notifications
  },
}
