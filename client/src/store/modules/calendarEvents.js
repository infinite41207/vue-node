import axios from 'axios'
import _ from 'lodash'
import ProxyUrl from '../../constants/ProxyUrls'

const initState = {
  events: [],
  objectViews: [],
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const getters = {
  events: (state) => state.events,
  presentation: (state) => (viewId) => {
    const objectView = state.objectViews.find((el) => el.viewId === viewId)

    let presentation = ''
    if (objectView) {
      presentation = objectView.object.name
    }

    return presentation
  },
}

export const mutations = {
  createEvent(state, event) {
    event.backgroundColor = event.calendar.color
    state.events.push(event)
  },

  updateEvent(state, event) {
    const index = state.events.findIndex((e) => e.id === event.id)
    event.backgroundColor = event.calendar.color
    return state.events.splice(index, 1, {
      ...state.events[index],
      ...event,
    })
  },

  deleteEvent(state, event) {
    const index = state.events.findIndex((e) => e.id === event.id)
    return state.events.splice(index, 1)
  },

  setEvents(state, events) {
    state.events = events.map((event) => {
      event.backgroundColor = event.calendar.color
      return event
    })
  },

  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const actions = {
  async findAllEvents({ commit }, payload) {
    const res = await axios.get(`${ProxyUrl.getAllCalendarEvents}`, payload)
    if (Number(res.data.httpStatus) === 200) {
      if(!payload?.noCommit) {
        commit('setEvents', res.data.responseData)
      }
      return res
    } else return false
  },

  async createEvent({ commit }, data) {
    const saveData = _.cloneDeep(data)
    const resItem = await axios.post(`${ProxyUrl.createCalendarEvent}`, saveData)
    if (Number(resItem.data.httpStatus) === 200) {
      commit('createEvent', resItem.data.responseData)
      return true
    } else return false
  },

  async updateEvent({ commit }, data) {
    const saveData = _.cloneDeep(data)
    const resItem = await axios.put(`${ProxyUrl.updateCalendarEvent}`, saveData)
    if (Number(resItem.data.httpStatus) === 200) {
      commit('updateEvent', resItem.data.responseData)
      return true
    } else return false
  },

  async deleteEvent({ commit }, data) {
    try {
      const res = await axios.delete(`${ProxyUrl.deleteAllCalendarEvent}`, { data })
      if (res.status === 200) {
        commit('deleteEvent', data)
      } else return false
    } catch (error) {
      console.error(error)
      return false
    }
  },
}
