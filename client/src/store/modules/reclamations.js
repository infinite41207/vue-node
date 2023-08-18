import ProxyUrl from '../../constants/ProxyUrls'
import axios from 'axios'
import Pagination from '../../dto/Pagination.json'
import newReclamation from '../../dto/NewReclamation.json'
import Vue from 'vue'
import moment from 'moment'
import _ from 'lodash'

const initState = {
  reclamations: [],
  pagination: _.cloneDeep(Pagination),
  openReclamation: _.cloneDeep(newReclamation),
  openPossitionIndex: 0,
  openCostsIndex: 0,
  showModalPossitionForm: false,
  showModalCostsForm: false,
  tabIndex: 0,
  newDocumentMode: true,
  listView: {
    list: [],
    toolBar: [],
    total: 0,
    page: 1,
    limit: 20,
    filters: {
      searchStr: '',
      period: [null, null],
      customer: null,
      responsible: null,
      manager: null,
      executor: null,
      status: null,
      multiplyStatus: false,
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
      Vue.set(state.objectViews[index].object, payload.property, payload.value)
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

  setReclamations(state, reclamations) {
    state.reclamations = reclamations
  },

  setNewDocumentMode(state, newDocumentMode) {
    state.newDocumentMode = newDocumentMode
  },

  setOpenReclamation(state, reclamation) {
    if (!reclamation) {
      state.openReclamation = _.cloneDeep(newReclamation)
    } else {
      state.openReclamation = reclamation
    }
  },

  setOpenPossitionIndex(state, openPossitionIndex) {
    state.openPossitionIndex = openPossitionIndex
  },

  setOpenCostsIndex(state, openCostsIndex) {
    state.openCostsIndex = openCostsIndex
  },

  setShowModalPossitionForm(state, showModalPossitionForm) {
    state.showModalPossitionForm = showModalPossitionForm
  },

  setShowModalCostsForm(state, showModalCostsForm) {
    state.showModalCostsForm = showModalCostsForm
  },

  setReclamationProperty(state, { property, value }) {
    Vue.set(state.openReclamation, property, value)
    // state.openReclamation[property] = value
  },

  setViewMode(state, value) {
    state.reclamationViewMode = value
  },

  setTabIndex(state, value) {
    state.tabIndex = value
  },

  addFiles(state, files) {
    for (const file of files) {
      state.openReclamation.files.push({
        description: file.name,
        type: file.type,
        size: file.size,
      })
    }
  },

  setReclamationFiles(state, files) {
    state.openReclamation.files = files
  },

  setPossitionsEditionMode(state, editPossitions) {
    state.openReclamation.editPossitions = editPossitions
  },

  deleteReclamationFile(state, index) {
    state.openReclamation.files.splice(index, 1)
  },
}

export const getters = {
  reclamationsList(state) {
    return state.reclamations
  },
  newDocumentMode(state) {
    return state.newDocumentMode
  },
  openReclamation(state) {
    return state.openReclamation
  },
  openPossitionIndex(state) {
    return state.openPossitionIndex
  },
  openCostsIndex(state) {
    return state.openCostsIndex
  },
  getModalPossitionFormValue(state) {
    return state.showModalPossitionForm
  },
  getModalCostsFormValue(state) {
    return state.showModalCostsForm
  },
  viewMode(state) {
    return state.reclamationViewMode
  },
  tabIndex(state) {
    return state.tabIndex
  },

  listView(state) {
    return state.listView
  },

  objectView: (state) => (viewId) => {
    return state.objectViews.find((el) => el.viewId === viewId)
  },
}

export const actions = {
  async findAllReclamations({ commit }, payload) {
    try {
      let list = []

      const response = await axios.get(`/reclamation`, payload)

      if (response) {
        const result = response.data

        if (result.rows) {
          list = result.rows
        } else {
          list = result
        }

        for (let r = 0; r < list.length; r++) {
          const reclamation = list[r]
          let possitionsDescription = ''
          for (let i = 0; i < reclamation.reclamation_items.length; i++) {
            const curSubject = reclamation.reclamation_items[i]._reclamationSubject
            if (curSubject) {
              possitionsDescription = possitionsDescription + curSubject.code + ', '
            }
          }
          reclamation.possitionsDescription = possitionsDescription

          let productionOrderDescription = ''
          if (reclamation.prodorder_reclamations) {
            for (let p = 0; p < reclamation.prodorder_reclamations.length; p++) {
              productionOrderDescription = productionOrderDescription + reclamation.prodorder_reclamations[p].orderNumber + ', '
            }
          }
          reclamation.productionOrderDescription = productionOrderDescription
        }

        if (!payload.noCommit) {
          commit('setListViewProperty', { list })

          let total = 0
          if (result.count) {
            total = result.count
          } else {
            total = list.length
          }

          if (total > 0) {
            const pages = Math.ceil(total / state.listView.limit)
            if (pages >= state.listView.page) {
              commit('setListViewProperty', { total })
            } else {
              commit('setListViewProperty', { total, page: pages })
            }
          } else {
            commit('setListViewProperty', { total, page: 1 })
          }
        }

        return response
      } else {
        if (!payload.noCommit) {
          commit('setListViewProperty', { list: [], total: 0, page: 1 })
        }
        throw new Error('No Content')
      }
    } catch (error) {
      if (!payload.noCommit) {
        commit('setListViewProperty', { list: [], total: 0, page: 1 })
      }
      throw new Error(error)
    }
  },

  async findReclamationTasks({ commit }, reclamationId) {
    const filterStr = {
      params: {
        filter: {
          ownerType: 'reclamation',
          ownerId: reclamationId,
        },
        getAllTasks: true,
      },
    }

    await axios.get(`/task`, filterStr).then((response) => {
      const tasks = response.data
      tasks.forEach((el) => {
        el.createdAt = moment(el.createdAt).format('DD.MM.YYYY HH:mm:ss')
        el.date = moment(el.date).format('DD.MM.YYYY HH:mm:ss')
        el.executionPeriod = moment(el.executionPeriod).format('DD.MM.YYYY HH:mm')

        el.icon = 'ri-upload-line'
        el.title = el.name
        el.text = 'Wykonawca ' + el.executorName
        el.subtext = 'Utworzono: ' + el.date
        if (el.executed) {
          el.color = 'success'
          el.subtext = el.subtext + ' wykonano: ' + moment(el.executionDate).format('DD.MM.YYYY HH:mm')
        } else {
          el.color = 'info'
        }
      })
      commit('setReclamationProperty', { property: 'tasks', value: tasks })
    })
  },

  async findByPk({ commit }, payload) {
    // const response = await axios.get(`/reclamation/${payload.params.id}`, payload.params)
    // console.log(response)
    // if (response && response.status === 200) {
    //   const responseData = response.data

    //   if (!payload.noCommit) {
    //     commit('setOpenReclamation', responseData)
    //     const itemParams = {
    //       reclamationId: responseData.id,
    //     }
    //     const reclamationItemsRes = await axios.get(`${ProxyUrl.getallreclamationitems}`, {
    //       params: itemParams,
    //     })
    //     if (reclamationItemsRes && reclamationItemsRes.status === 200 && reclamationItemsRes.data.responseData) {
    //       let possitionIndex = 1
    //       reclamationItemsRes.data.responseData.forEach((item) => {
    //         item.possitionIndex = possitionIndex
    //         possitionIndex = possitionIndex + 1
    //       })
    //       commit('addObjectView', { viewId: payload.params.id, object: responseData, tabIndex: 0 })
    //     }

    //     dispatch('findReclamationTasks', responseData.id)
    //   }
    //   return responseData
    // } else return false

    return axios
      .get(`/reclamation/${payload.params.id}`, payload.query)
      .then((response) => {
        const object = response.data
        object.createdAt = moment(object.createdAt).format('DD.MM.YYYY hh:mm:ss')

        if (!payload.noCommit) {
          commit('addObjectView', { viewId: payload.params.id, object, tabIndex: 0 })
        }
        // console.log(object)
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async getReclamationActionTypes() {
    const actionTypes = [
      {
        id: 0,
        description: '-Nie wybrano-',
      },
      {
        id: 1,
        description: 'Zmiana statusu',
      },
      {
        id: 2,
        description: 'Dodanie komentarza',
      },
      {
        id: 3,
        description: 'Dodanie pliku',
      },
      {
        id: 4,
        description: 'Decyzja',
      },
      {
        id: 5,
        description: 'Dodanie zlecenia serwisowego',
      },
      {
        id: 6,
        description: 'Monit',
      },
    ]

    return actionTypes
  },

  async create({ commit, dispatch }, payload) {
    return axios
      .post(`/reclamation`, payload)
      .then((response) => {
        return response
      })
      .catch((err) => {
        console.log('error in create reclamation store: ', err)
      })
    // const resItem = await axios.post(`/reclamation`, itemData)

    // if (Number(resItem.data.httpStatus) === 200) {
    //   const openReclamationData = resItem.data.responseData
    //   openReclamationData.editPossitions = true

    //   commit('setOpenReclamation', openReclamationData)

    //   let resPossition
    //   let errorPossition = ''
    //   for await (const possition of itemData.possitions) {
    //     possition.reclamationId = resItem.data.responseData.id
    //     resPossition = await axios.post(`${ProxyUrl.createreclamationitem}`, possition)
    //     if (!Number(resPossition.data.httpStatus) === 200) {
    //       if (!resPossition.data.responseData) {
    //         errorPossition = 'pos. nr ' + possition.possitionIndex + ': ' + resPossition.data.errorDetails
    //         break
    //       }
    //     }
    //   }

    //   commit('setReclamationProperty', { property: 'id', value: resItem.data.responseData.id })

    //   if (itemData.files) {
    //     dispatch('uploadFiles', { files: itemData.files, description: '', verification_protocol: false })
    //   }

    //   if (errorPossition === '') return resItem
    //   else return { httpStatus: 400, errorDetails: errorPossition }
    // } else
    //   return { httpStatus: 400, errorDetails: resItem.data.errorDetails }.catch((error) => {
    //     console.error(error)
    //     return { httpStatus: 400, errorDetails: error }
    //   })
  },

  async update({ commit }, payload) {
    return axios
      .put(`/reclamation/${payload.id}`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })

    // if (resUpdate && resUpdate.status === 200) {
    //   await axios.post(`${ProxyUrl.deleteallreclamationitems}`, { reclamationId: itemData.id })

    //   let resPossition
    //   let errorPossition = ''

    //   for await (const possition of itemData.possitions) {
    //     possition.reclamationId = itemData.id
    //     resPossition = await axios.post(`${ProxyUrl.createreclamationitem}`, possition)
    //     if (!Number(resPossition.data.httpStatus) === 200) {
    //       if (!resPossition.data.responseData) {
    //         errorPossition = 'pos. nr ' + possition.possitionIndex + ': ' + resPossition.data.errorDetails
    //         break
    //       }
    //     }
    //   }

    //   if (errorPossition === '') return resUpdate
    //   else return { httpStatus: 400, errorDetails: errorPossition }
    // } else
    //   return { httpStatus: 400, errorDetails: resUpdate.data.errorDetails }.catch((error) => {
    //     console.error(error)
    //     return { httpStatus: 400, errorDetails: error }
    //   })
  },

  async changeDeletionMark({ commit }, payload) {
    return axios
      .post(`/reclamation/change_deletion_mark`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async uploadFiles({ commit, getters }, payload) {
    // const formData = new FormData()
    // payload.files.map((file) => formData.append('files', file))

    // const dataParams = {
    //   reclamationId: getters.openReclamation.id,
    //   description: payload.description,
    //   verification_protocol: payload.verification_protocol,
    // }
    // formData.append('data', JSON.stringify(dataParams))
    return axios
      // .post(`reclamation_file`, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // })
      .post(`reclamation_file`, payload)
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
      .get(`reclamation_file`, payload)
      .then((response) => {
        // commit('setOrderFiles', response.data)
        return response.data
      })
      .catch((error) => {
        console.log(error)
        return undefined
      })
  },

  async deleteFile({ commit }, params) {
    return axios
      .delete(`/file/${params.id}`)
      .then((response) => {
        if (response.status === 200) {
          commit('deleteOrderFile', params.index)
        }
        return response
      })
      .catch((error) => {
        console.log(error)
        return undefined
      })
  },

  async openFile({ commit }, params) {
    return axios
      .get(`/reclamation/file/${params.id}`, { responseType: 'blob' })
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
