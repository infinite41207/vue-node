import axios from 'axios'
import moment from 'moment'
import Interaction from '@/dto/Interaction.json'
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
      manager: null,
      executor: null,
      period: [null, null],
      customer: null,
      tags: null,
      multiplyTags: false,
    },
    sort: { sortBy: null, sortDesc: false },
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

  updateFile(state, payload) {
    const viewIndex = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (viewIndex > -1) {
      const existFile = state.objectViews[viewIndex].object.files.find((el) => {
        return el.id === payload.fileId
      })
      if (existFile) {
        existFile[payload.property] = payload.value
      }
    }
  },

  delCommentFile(state, payload) {
    const viewIndex = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (viewIndex > -1) {
      const existComment = state.objectViews[viewIndex].object.comments.find((el) => {
        return el.id === payload.commentId
      })
      if (existComment) {
        existComment.files.splice(payload.index, 1)
      }
    }
  },

  delComment(state, { viewId, index }) {
    const viewIndex = state.objectViews.findIndex((el) => el.viewId === viewId)
    if (viewIndex > -1) {
      state.objectViews[viewIndex].object.comments.splice(index, 1)
    }
  },

  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const actions = {
  async findAll({ commit, state }, payload) {
    return axios
      .get(`/interaction`, payload)
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
      .get(`/interaction/count`, payload)
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
      .get(`/interaction/${payload.params.id}`, payload.query)
      .then((response) => {
        if (!payload.noCommit && response.status === 200) {
          const object = response.data
          object.createdAt = moment(object.createdAt).format('DD.MM.YYYY HH:mm:ss')

          console.log('interations payload', payload);

          // if (!payload.noCommit) {
          //   console.log('updating interation object ');
          //   commit('addObjectView', {
          //     viewId: payload.params.id,
          //     object,
          //     editMode: 'EDIT',
          //   })
          // }
          
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
    return axios.get(`/interaction`, payload).then((response) => {
      let list = []
      if (response.status === 200) {
        list = response.data

        list.forEach((el) => {
          el.createdAt = moment(el.createdAt).format('DD.MM.YYYY HH:mm:ss')
        })
      }
      return list
    })
  },

  async addNew({ commit, dispatch }, payload) {
    const newObject = _.cloneDeep(Interaction)

    newObject.id = payload.viewId

    if (payload.byEmail === true && payload.emailData.title) {
      newObject.reference = `${payload.emailData.title} (${payload.emailData.from})`

      if (payload.emailData.filesAtHardDrive === true) {
        newObject.files = []

        let emailFiles = payload.emailData.files

        if (!emailFiles) {
          await dispatch('mailbox/getFiles', { params: { emailId: payload.emailData.id } }, { root: true })
            .then(async (response) => {
              if (response.status === 200) {
                emailFiles = response.data
              }
            })
            .catch((error) => {
              console.error(error)
            })
        }

        if (emailFiles) {
          for (const file of emailFiles) {
            if (file.contentDisposition === 'attachment' || file.contentType === 'application/pdf') {
              await dispatch('mailbox/getFile', { id: file.id }, { root: true })
                .then((response) => {
                  if (response.status === 200) {
                    const itemFile = new File([response.data], file.filename, { type: file.contentType })
                    newObject.files.push(itemFile)
                  }
                })
                .catch((error) => {
                  throw error
                })
            }
          }
        }
      }
    }

    commit('addObjectView', {
      viewId: payload.viewId,
      editMode: 'NEW',
      nevVersion: payload.nevVersion,
      byEmail: payload.byEmail,
      emailData: payload.emailData,
      object: newObject,
    })

    return true
  },

  async create({ dispatch, getters }, payload) {
    return axios
      .post(`/interaction`, payload)
      .then((response) => {
        if (response.status === 200 && payload.object.files.length > 0) {
          const formData = new FormData()

          payload.object.files.map((file) => formData.append('files', file))

          formData.append('data', JSON.stringify({ id: response.data.id }))

          return axios
            .post(`/interaction/file`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((response) => {
              return response
            })
            .catch((error) => {
              console.error(error)
              throw error
            })
        } else {
          return response
        }
      })
      .catch((error) => {
        throw error
      })
  },

  async update({ commit }, payload) {
    return axios.put(`/interaction/${payload.id}`, payload.updateData).then((response) => {
      return response
    })
  },

  async updateFile({ commit }, payload) {
    return axios.put(`/interaction/file/${payload.id}`, payload.updateData).then((response) => {
      return response
    })
  },

  async addComment(context, payload) {
    console.log('payload', payload);

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
        interactionId: payload.interactionId,
      })
    )
    console.log('interaction comment form data', formData);
    return axios
      .post(`/interaction/comment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        return response
      })
  },

  async deleteComment({ commit }, payload) {
    return axios.delete(`/interaction/comment/${payload.id}`, payload).then((response) => {
      if (response.status === 200) {
        commit('delComment', { viewId: payload.viewId, index: payload.index })
      }
      return response
    })
  },

  async addFiles({ commit }, payload) {
    const formData = new FormData()
    payload.files.map((file) => formData.append('files', file))

    formData.append('data', JSON.stringify({ id: payload.id }))

    return axios
      .post(`/interaction/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        return response
      })
  },

  async changeDeletionMark({ commit }, payload) {
    return axios.post(`/interaction/change_deletion_mark`, { id: payload.id }).then((response) => {
      return response
    })
  },

  async uploadFiles({ commit, getters }, params) {
    const formData = new FormData()

    params.files.map((file) => formData.append('files', file))

    formData.append('data', JSON.stringify({ id: params.id }))

    return axios
      .post(`/interaction/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.log(error)
        return undefined
      })
  },

  async uploadCommentFiles({ commit, getters }, params) {
    const formData = new FormData()

    params.files.map((file) => formData.append('files', file))

    formData.append('data', JSON.stringify({ id: params.id }))

    return axios
      .post(`/interaction/comment/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.log(error)
        return undefined
      })
  },

  async getFiles({ commit }, payload) {
    return axios
      .post(`/interaction/files`, { objectId: payload.objectId })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return undefined
      })
  },

  async getTasks({ commit }, payload) {
    return axios
      .post(`/interaction/tasks`, { objectId: payload.objectId })
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async getCommentFiles({ commit }, params) {
    return axios
      .get(`/interaction/comment/files`, { objectId: params.objectId })
      .then((response) => {
        // commit('setFiles', response.data)
        return response
      })
      .catch((error) => {
        console.error(error)
        return undefined
      })
  },

  async deleteFile({ commit }, params) {
    return axios
      .delete(`/interaction/file/${params.id}`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async deleteCommentFile({ commit }, payload) {
    return axios
      .delete(`/interaction/comment/file/${payload.id}`)
      .then((response) => {
        if (response.status === 200) {
          commit('delCommentFile', payload)
        }
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async openFile({ commit }, params) {
    return axios
      .get(`/interaction/file/${params.id}`, { responseType: 'blob', params: {} })
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
        console.log(error)
        return undefined
      })
  },

  async getFile({ commit }, params) {
    return axios
      .get(`/interaction/file/${params.id}`, { responseType: 'blob', params: {} })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return undefined
      })
  },

  async openCommentFile({ commit }, params) {
    return axios
      .get(`/interaction/comment/file/${params.id}`, { responseType: 'blob', params: {} })
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
        console.log(error)
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
