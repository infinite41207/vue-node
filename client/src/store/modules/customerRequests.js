import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'

const initState = {
  listView: {
    list: [],
    total: 0,
    page: 1,
    limit: 20,
    filters: {
      searchStr: '',
      showClosed: false,
      status: null,
      multiplyStatus: false,
      constructor: null,
      manager: null,
      period: [null, null],
      customer: null,
      tags: null,
      multiplyTags: false,
    },
    sort: { sortBy: 'numberStr', sortDesc: true },
  },
  objectViews: [],
  openCustomerRequest: null,
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const mutations = {
  setOpenCustomerRequest(state, payload) {
    state.openCustomerRequest = payload
  },
  setCustomerRequestProperty(state, { property, value }) {
    state.openCustomerRequest[property] = value
  },

  delCommentFile(state, payload) {
    const existComment = state.openCustomerRequest.comments.find((el) => {
      return el.id === payload.commentId
    })

    if (existComment) {
      existComment.files.splice(payload.index, 1)
    }
  },

  delComment(state, index) {
    state.openCustomerRequest.comments.splice(index, 1)
  },

  setListViewProperty(state, payload) {
    Object.keys(payload).forEach((key) => {
      state.listView[key] = payload[key]
    })
  },

  setFilters(state, filter) {
    Object.keys(filter).forEach((key) => {
      state.listView.filters[key] = filter[key]
    })
  },

  setSort(state, sort) {
    Object.keys(sort).forEach((key) => {
      state.listView.sort[key] = sort[key]
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

  setObjectViewProperties(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      Object.keys(payload.props).forEach((key) => {
        state.objectViews[index][key] = payload.props[key]
      })
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
  async findAll({ commit, state }, payload) {
    return axios
      .get(`/customer_request`, payload)
      .then((response) => {
        let list = []
        let page = 1
        let total = 0

        if (response.status === 200) {
          const result = response.data

          if (result.rows) {
            list = result.rows
          } else {
            list = result
          }

          list.forEach((el) => {
            el.createdAt = moment(el.createdAt).format('DD.MM.YYYY HH:mm:ss')
            if (el.sendingDate) {
              el.sendingDate = moment(el.sendingDate).format('DD.MM.YYYY HH:mm:ss')
            }

            if (el.order) {
              if (el.order.numberStr) {
                el.orderNumber = el.order.numberStr
              } else {
                el.orderNumber = el.order.prefix + '-' + el.order.number.toString().padStart(6, '0')
              }
            } else {
              el.orderNumber = ''
            }

            el.tags = JSON.parse(el.tags)
          })

          if (result.count) {
            total = result.count
          } else {
            total = list.length
          }

          if (total > 0) {
            const pages = Math.ceil(total / state.listView.limit)

            if (pages < state.listView.page) {
              page = pages
            } else {
              page = state.listView.page
            }
          }
        }

        if (!payload.noCommit) {
          commit('setListViewProperty', { list, page, total })
        }
        return response
      })
      .catch((error) => {
        console.error(error)
        throw error
      })
  },

  async getCount(context, payload) {
    return axios
      .get(`/customer_request/count`, payload)
      .catch((error) => {
        throw error
      })
  },

  async getAmount(context, payload) {
    return axios
      .get(`/customer_request/amount`, payload)
      .catch((error) => {
        throw error
      })
  },

  async findByPk({ commit }, payload) {
    if (!payload.noCommit && !payload.viewId) {
      if (state.objectViews.some((v) => v.viewId === payload.params.id)) {
        return { status: 200 }
      }
    }
    return axios
      .get(`/customer_request/${payload.params.id}`, payload.query)
      .then((response) => {
        if (!payload.noCommit && response.status === 200) {
          const object = response.data
          object.createdAt = moment(object.createdAt).format('DD.MM.YYYY HH:mm:ss')
          if (payload.viewId) {
            commit('setObjectViewProperty', { viewId: payload.viewId, property: 'object', value: object })
          } else {
            commit('addObjectView', {
              viewId: payload.params.id,
              object,
              editMode: 'EDIT',
            })
          }
        }

        return response
      })
      .catch((error) => {
        console.error(error)
        throw error
      })
  },

  async getVersions({ commit }, payload) {
    return axios.get(`/customer_request`, payload).then((response) => {
      let customerRequests = []
      if (response.status === 200) {
        customerRequests = response.data

        customerRequests.forEach((el) => {
          el.createdAt = moment(el.createdAt).format('DD.MM.YYYY HH:mm:ss')
        })
      }
      return customerRequests
    })
  },

  async create({ dispatch, getters }, payload) {
    return axios.post(`/customer_request`, payload).then((response) => {
      if (response.status === 200 && payload.files.length > 0) {
        const formData = new FormData()

        payload.files.map((file) => formData.append('files', file))

        formData.append('data', JSON.stringify({ id: response.data.commentId }))

        axios
          .post(`/customer_request/comment_file`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .catch((error) => {
            console.error(error)
          })
      }
      return response
    })
  },

  async addComment({ dispatch, getters }, payload) {
    const formData = new FormData()
    payload.files.map((file) => formData.append('files', file))

    formData.append(
      'data',
      JSON.stringify({
        text: payload.text,
        byEmail: payload.byEmail,
        emailTitle: payload.emailTitle,
        emailUid: payload.emailUid,
        emailId: payload.emailId,
        emailAccountId: payload.emailAccountId,
        emailType: payload.emailType,
        customerRequestId: payload.customerRequestId,
      })
    )

    return axios
      .post(`/customer_request/add_comment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        return response
      })
  },

  async deleteComment({ commit }, payload) {
    return axios.delete(`/customer_request/comment/${payload.id}`, payload).then((response) => {
      if (response.status === 200) {
        commit('delComment', payload.index)
      }
      return response
    })
  },

  async update({ commit }, payload) {
    return axios.put(`/customer_request/${payload.id}`, payload.updateData).then((response) => {
      return response
    })
  },

  async addFiles({ commit }, payload) {
    const formData = new FormData()
    payload.files.map((file) => formData.append('files', file))

    formData.append('data', JSON.stringify({ fileDestination: payload.fileDestination, id: payload.id }))

    return axios
      .post(`/customer_request/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        return response
      })
  },

  async changeDeletionMark({ commit }, payload) {
    return axios.post(`/customer_request/change_deletion_mark`, { id: payload.id }).then((response) => {
      return response
    })
  },

  async uploadCRFiles({ commit, getters }, params) {
    const formData = new FormData()
    params.files.map((file) => formData.append('files', file))
    formData.append('data', JSON.stringify({ id: params.id }))

    return axios
      .post(`/customer_request/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return undefined
      })
  },

  async uploadCRCommentFiles({ commit, getters }, params) {
    const formData = new FormData()
    params.files.map((file) => formData.append('files', file))
    formData.append('data', JSON.stringify({ id: params.id }))

    return axios
      .post(`/customer_request/comment_file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return undefined
      })
  },

  async getCRFiles({ commit }, params) {
    return axios
      .post(`/customer_request/cr_file`, { objectId: params.objectId })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return undefined
      })
  },

  async getCRCommentFiles({ commit }, params) {
    return axios
      .post(`/customer_request/cr_comment_file`, { objectId: params.objectId })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return undefined
      })
  },

  async deleteCRFile({ commit }, params) {
    return axios
      .delete(`/customer_request/cr_file/${params.id}`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async deleteCRCommentFile({ commit }, params) {
    return axios
      .delete(`/customer_request/cr_comment_file/${params.id}`)
      .then((response) => {
        if (response.status === 200) {
          commit('delCommentFile', params)
        }
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async openCRFile({ commit }, params) {
    return axios
      .get(`/customer_request/cr_file/${params.id}`, { responseType: 'blob', params: {} })
      .then((response) => {
        if (response.status === 200) {
          const blob = new Blob([response.data], { type: params.type })
          const fileLink = document.createElement('a')
          fileLink.href = window.URL.createObjectURL(blob)
          if (
            params.open === true &&
            (params.type === 'application/pdf' || params.type === 'image/jpeg' || params.type === 'image/png' || params.type === 'application/vnd.ms-excel')
          ) {
            fileLink.target = '_blank'
            fileLink.rel = 'noopener noreferrer'
          } else {
            fileLink.setAttribute('download', params.name)
          }
          document.body.appendChild(fileLink)
          fileLink.click()
        }
        return response
      })
      .catch((error) => {
        console.error(error)
        return undefined
      })
  },

  async getCRFile({ commit }, params) {
    return axios
      .get(`/customer_request/cr_file/${params.id}`, { responseType: 'blob', params: {} })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return undefined
      })
  },

  async openCRCommentFile({ commit }, params) {
    return axios
      .get(`/customer_request/cr_comment_file/${params.id}`, { responseType: 'blob', params: {} })
      .then((response) => {
        if (response.status === 200) {
          const blob = new Blob([response.data], { type: params.type })
          const fileLink = document.createElement('a')
          fileLink.href = window.URL.createObjectURL(blob)

          if (
            params.open === true &&
            (params.type === 'application/pdf' || params.type === 'image/jpeg' || params.type === 'image/png' || params.type === 'application/vnd.ms-excel')
          ) {
            fileLink.target = '_blank'
            fileLink.rel = 'noopener noreferrer'
          } else {
            fileLink.setAttribute('download', params.name)
          }

          document.body.appendChild(fileLink)
          fileLink.click()
        }
        return response
      })
      .catch((error) => {
        console.error(error)
        return undefined
      })
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

  presentation: (state) => (viewId) => {
    const objectView = state.objectViews.find((el) => el.viewId === viewId)

    let presentation = ''
    if (objectView) {
      presentation = objectView.object.numberStr
    }

    return presentation
  },
}
