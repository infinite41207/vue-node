import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'

const initState = {
  listView: {
    list: [],
    total: 0,
    page: 1,
    limit: 20,
    filter: '',
  },
  objectViews: [],
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const mutations = {
  setListViewProperty(state, payload) {
    Object.keys(payload).forEach((key) => {
      state.listView[key] = payload[key]
    })
  },

  addObjectView(state, view) {
    const existView = state.objectViews.find((el) => el.viewId === view.viewId)

    if (existView === undefined) {
      state.objectViews.push(view)
    }
  },

  setObjectViewProperty(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      state.objectViews[index][payload.property] = payload.value
    }
  },

  setObjectProperty(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      state.objectViews[index].object[payload.property] = payload.value
    }
  },

  delObjectView(state, viewId) {
    for (const [i, v] of state.objectViews.entries()) {
      if (v.viewId === viewId) {
        state.objectViews.splice(i, 1)
        break
      }
    }
  },

  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const actions = {
  async findAll({ commit }, payload) {
    let list = []

    return axios
      .get(`/outgoing_email`, payload)
      .then((response) => {
        if (response.status === 200) {
          list = response.data
        }

        if (!payload.noCommit) {
          commit('setListViewProperty', { list, total: list.length, page: 1 })
        }
        return response
      })
      .catch((error) => {
        console.error(error)
        if (!payload.noCommit) {
          commit('setListViewProperty', { list, total: list.length, page: 1 })
        }
        return error
      })
  },

  async findByPk({ commit }, payload) {
    return axios
      .get(`/outgoing_email/${payload.params.id}`, payload.query)
      .then((response) => {
        if (response.status === 200) {
          const object = response.data
          object.createdAt = moment(object.createdAt).format('DD.MM.YYYY hh:mm:ss')
          object.date = moment(object.date).format('DD.MM.YYYY hh:mm:ss')

          commit('addObjectView', { viewId: payload.params.id, object })
        }

        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async create({ commit }, payload) {
    if (payload.attachments) {
      const convertAttachments = []

      for (const attachment of payload.attachments) {
        const buffer = await attachment.arrayBuffer()
        const data = Array.from(new Uint8Array(buffer))

        const convertAttachment = {
          content: data,
          filename: attachment.name,
          contentType: attachment.type,
        }

        convertAttachments.push(convertAttachment)
      }

      payload.attachments = convertAttachments
    }

    return axios.post(`/outgoing_email`, payload).then((response) => {
      return response
    })
  },

  async update({ commit }, payload) {
    return axios.put(`/outgoing_email/${payload.id}`, payload).then((response) => {
      return response
    })
  },

  async getLinkedDocs({ commit, state }, payload) {
    try {
      const response = await axios.get(`/outgoing_email_linked_doc`, payload)
      return response
    } catch (error) {
      throw new Error(error)
    }
  },

  async deleteLinkedDoc({ commit, state }, payload) {
    try {
      const response = await axios.delete(`/outgoing_email/linked_doc/${payload.params.id}`, payload)
      return response
    } catch (error) {
      throw new Error(error)
    }
  },

  resetState({ commit }) {
    commit('resetState')
  },
}

export const getters = {
  listView(state) {
    return state.listView
  },
  objectView: (state) => (viewId) => {
    return state.objectViews.find((el) => el.viewId === viewId)
  },
}
