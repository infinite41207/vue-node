import ProxyUrl from '../../constants/ProxyUrls'
import axios from 'axios'
import _ from 'lodash'

const initState = {
  calendars: [],
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const getters = {
  calendars: (state) => state.calendars,
}

export const mutations = {
  createCalendar(state, calendar) {
    state.calendars.push(calendar)
  },

  updateCalendar(state, calendar) {
    const index = state.calendars.findIndex((e) => e.id === calendar.id)
    return state.calendars.splice(index, 1, {
      ...state.calendars[index],
      ...calendar,
    })
  },

  deleteCalendar(state, calendar) {
    const index = state.calendars.findIndex((e) => e.id === calendar.id)
    return state.calendars.splice(index, 1)
  },

  setCalendars(state, calendars) {
    return (state.calendars = calendars)
  },

  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const actions = {
  async findAllCalendars({ commit }) {
    const res = await axios.get(`${ProxyUrl.getAllCalendars}`)
    if (Number(res.data.httpStatus) === 200) {
      commit('setCalendars', res.data.responseData)
      return true
    } else return false
  },

  async createCalendar({ commit }, data) {
    const saveData = _.cloneDeep(data)
    const resItem = await axios.post(`${ProxyUrl.createCalendar}`, saveData)
    if (Number(resItem.data.httpStatus) === 200) {
      commit('createCalendar', resItem.data.responseData)
      return true
    } else return false
  },

  async updateCalendar({ commit }, data) {
    const saveData = _.cloneDeep(data)
    const resItem = await axios.put(`${ProxyUrl.updateCalendar}`, saveData)
    if (Number(resItem.data.httpStatus) === 200) {
      const event = resItem.data.responseData
      commit('updateCalendar', event)
      return true
    } else return false
  },

  async deleteCalendar({ commit }, data) {
    try {
      const res = await axios.delete(`${ProxyUrl.deleteCalendar}`, { data })
      if (res.status === 200) {
        commit('deleteCalendar', data)
      } else return false
    } catch (error) {
      console.error(error)
      return false
    }
  },
}
