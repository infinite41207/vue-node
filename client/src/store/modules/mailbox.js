import ProxyUrl from '../../constants/ProxyUrls'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
import Vue from 'vue'
import definedBoxes from '@/constants/definedBoxes'

const initState = {
  mailboxView: {
    list: [],
    emailAccount: null,
    onlineMode: false,
    boxes: [],
    currentBox: null,
    currentLabel: null,
    filters: {
      searchStr: '',
      period: [null, null],
      from: '',
      to: '',
      subject: '',
      body: '',
      hasLinks: null,
      processed: null,
      counterparty: null,
    },
    total: 0,
    limit: 20,
    page: 1,
  },
  openEmail: null,
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const mutations = {
  setEmailAccount(state, emailAccount) {
    state.mailboxView.emailAccount = emailAccount
  },
  setBoxes(state, boxes) {
    state.mailboxView.boxes = boxes
  },
  setFilters(state, filter) {
    Object.keys(filter).forEach((key) => {
      Vue.set(state.mailboxView.filters, key, filter[key])
    })
  },
  setMailboxProperty(state, payload) {
    Object.keys(payload).forEach((key) => {
      Vue.set(state.mailboxView, key, payload[key])
    })
  },
  setOpenEmail(state, currentEmail) {
    state.openEmail = currentEmail
  },
  setOpenEmailProperty(state, payload) {
    Vue.set(state.openEmail, payload.property, payload.value)
  },
  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const actions = {
  async getMailboxes({ commit }, payload) {
    try {
      const response = await axios.get(`/mailbox`, payload)

      if (response.status === 200) {
        const boxes = response.data

        for (const box of boxes) {
          const defindBox = definedBoxes.find((el) => el.name === box.name)

          if (defindBox) {
            box.sort = defindBox.sort
            box.icon = defindBox.icon
            box.title = defindBox.title
          } else {
            box.sort = 99
            box.icon = 'ri-folder-2-line'
            box.title = null
          }
        }

        boxes.sort((a, b) => a.sort - b.sort)

        commit('setBoxes', boxes)

        return response
      } else {
        commit('setBoxes', [])
        return response
      }
    } catch (error) {
      commit('setBoxes', [])
      throw new Error(error)
    }
  },

  async findAll({ commit, state }, payload) {
    try {
      let response

      if (state.mailboxView.currentBox.name === 'Sent' || state.mailboxView.currentBox.name === 'Drafts') {
        response = await axios.get(`/outgoing_email`, payload)
      } else {
        response = await axios.get('/email', payload)
      }

      if (response.status === 200) {
        commit('setMailboxProperty', { list: response.data.messages, total: response.data.total })

        return response
      } else {
        commit('setMailboxProperty', { list: [], total: 0, page: 1 })
        return response
      }
    } catch (error) {
      commit('setMailboxProperty', { list: [], total: 0, page: 1 })
      throw error
    }
  },

  async findByPk({ commit, dispatch, getters }, payload) {
    return axios
      .get(`${ProxyUrl.getEmailByPk}/${payload.params.id}`, payload)
      .then((response) => {
        if (!payload.noCommit) {
          if (response.status === 200) {
            const currentEmail = response.data
            currentEmail.date = moment(currentEmail.date).format('DD.MM.YYYY HH:mm:ss')
            commit('setOpenEmail', currentEmail)
            return true
          }

          return false
        } else {
          return response
        }
      })
      .catch((error) => {
        throw error
      })
  },

  async findBySeq({ commit, dispatch, getters }, payload) {
    return axios
      .get(`${ProxyUrl.getEmailBySeq}/${payload.params.id}`, payload)
      .then((response) => {
        if (response.status === 200) {
          const currentEmail = response.data
          currentEmail.date = moment(currentEmail.date).format('DD.MM.YYYY HH:mm:ss')
          commit('setOpenEmail', currentEmail)
          return true
        }

        return false
      })
      .catch((error) => {
        console.error(error)
        return false
      })
  },

  async findByUid({ commit, dispatch, getters }, payload) {
    return axios
      .get(`${ProxyUrl.getEmailByUid}/${payload.params.uid}`, payload)
      .then((response) => {
        if (response.status === 200) {
          const currentEmail = response.data
          currentEmail.date = moment(currentEmail.date).format('DD.MM.YYYY HH:mm:ss')
          commit('setOpenEmail', currentEmail)
          return true
        }

        return false
      })
      .catch((error) => {
        console.error(error)
        return false
      })
  },

  async setFlag(context, payload) {
    return axios
      .post(`/email_flag`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async setLabel(context, payload) {
    return axios
      .post(`/email_label`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async moveEmail(context, payload) {
    return axios
      .post(`/email_move`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async setSeen(context, payload) {
    return axios
      .post(`/email_seen`, payload)
      .then((response) => {
        if (response.status === 200) {
          return true
        }
        return false
      })
      .catch((error) => {
        console.error(error)
        return false
      })
  },

  async setUnseen(context, payload) {
    return axios
      .post(`/email_unseen`, payload)
      .then((response) => {
        if (response.status === 200) {
          return true
        }
        return false
      })
      .catch((error) => {
        console.error(error)
        return false
      })
  },

  async update(context, payload) {
    if (Array.isArray(payload.id)) {
      let result = true
      payload.id.forEach(async (id) => {
        return axios
          .put(`/incoming_email/${id}`, payload.updateData)
          .then((response) => {
            if (response.status !== 200) {
              result = false
            }
          })
          .catch((error) => {
            console.error(error)
            result = false
          })
      })

      return result
    } else {
      return axios
        .put(`/incoming_email/${payload.id}`, payload.updateData)
        .then((response) => {
          if (response.status === 200) {
            return true
          }
          return false
        })
        .catch((error) => {
          console.error(error)
          return false
        })
    }
  },

  async send(context, payload) {
    return axios
      .post(`/outgoing_email/send`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async getLinkedDocs({ commit, state }, payload) {
    try {
      const response = await axios.get(`/incoming_email_linked_doc`, payload)
      return response
    } catch (error) {
      throw new Error(error)
    }
  },

  async deleteLinkedDoc({ commit, state }, payload) {
    try {
      const response = await axios.delete(`/incoming_email/linked_doc/${payload.params.id}`, payload)
      return response
    } catch (error) {
      throw new Error(error)
    }
  },

  async getAttachment({ commit, dispatch, getters }, payload) {
    return axios
      .post(`${ProxyUrl.getIncomingEmailAttachment}`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async getFile(context, payload) {
    return axios
      .get(`/incoming_email/file/${payload.id}`, { responseType: 'blob', params: {} })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        throw error
      })
  },

  async getFiles(context, payload) {
    return axios
      .get(`/incoming_email_files`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        throw error
      })
  },

  resetState({ commit }) {
    commit('resetState')
  },
}

export const getters = {
  emailAccount(state) {
    return state.mailboxView.emailAccount
  },
  mailboxView(state) {
    return state.mailboxView
  },
  mailboxViewList(state) {
    return state.mailboxView.list
  },
  mailboxViewFilters(state) {
    return state.mailboxView.filters
  },
  mailboxViewBoxes(state) {
    return state.mailboxView.boxes
  },
  mailboxViewCurrentBox(state) {
    return state.mailboxView.currentBox
  },
  mailboxViewCurrentLabel(state) {
    return state.mailboxView.currentLabel
  },
  openEmail(state) {
    return state.openEmail
  },
}
