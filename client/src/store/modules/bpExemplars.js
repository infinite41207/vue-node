import ProxyUrl from '../../constants/ProxyUrls'
import axios from 'axios'
import newItem from '../../dto/newBpExemplar.json'
import Pagination from '../../dto/Pagination.json'
import Vue from 'vue'
import _ from 'lodash'

const initState = {
  itemsListView: {
    items: [],
    pagination: _.cloneDeep(Pagination),
    filter: '',
  },
  openStageIndex: 0,
  showModalStageForm: false,
  itemsList: [],
  pagination: _.cloneDeep(Pagination),
  openItem: _.cloneDeep(newItem),
  tabIndex: 0,
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const mutations = {
  setOpenItemProperty(state, { property, value }) {
    Vue.set(state.openItem, property, value)
  },

  setOpenItemIndex(state, openStageIndex) {
    state.openItemIndex = openStageIndex
  },

  setShowModalItemForm(state, showModalStageForm) {
    state.showModalItemForm = showModalStageForm
  },

  setItems(state, items) {
    state.itemsListView.items = items
  },

  updatePagination(state, pagination) {
    state.itemsListView.pagination = pagination
  },

  setCurrentPage(state, page) {
    state.itemsListView.pagination.page = page
  },

  setListTotal(state, total) {
    state.itemsListView.pagination.total = total
  },

  setListLimit(state, limit) {
    state.itemsListView.pagination.limit = limit
  },

  updateFilter(state, filter) {
    state.itemsListView.filter = filter
  },

  async setOpenItem(state, item) {
    if (!item) {
      state.openItem = _.cloneDeep(newItem)
    } else {
      if (item.stages) {
        const parsedObject = JSON.parse(item.stages)
        item.stages = parsedObject.array
      }
      if (item.stageSettingsList) {
        const parsedObject = JSON.parse(item.stageSettingsList)
        item.stageSettingsList = parsedObject.array
      }
      state.openItem = item
    }
  },

  setTabIndex(state, value) {
    state.tabIndex = value
  },

  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const getters = {
  itemsList(state) {
    return state.itemsListView.items
  },
  itemsListView(state) {
    return state.itemsListView
  },
  openItem(state) {
    return state.openItem
  },
  tabIndex(state) {
    return state.tabIndex
  },
  openItemIndex(state) {
    return state.openItemIndex
  },
  getModalItemFormValue(state) {
    return state.showModalItemForm
  },
}

export const actions = {
  async findAllItems({ commit, state }, payload) {
    try {
      const response = await axios.get(`${ProxyUrl.getallbpexemplars}`, payload)
      const result = response.data.responseData
      let items = null
      if (result.rows) {
        items = result.rows
      } else {
        items = result
      }
      commit('setItems', items)
      let total = 0
      if (result.count) {
        total = result.count
      } else {
        total = items.length
      }
      if (total > 0) {
        const pages = Math.ceil(total / state.itemsListView.pagination.limit)
        if (pages >= state.itemsListView.pagination.page) {
          commit('setListTotal', total)
        } else {
          commit('updatePagination', { total, page: pages, limit: 10 })
        }
      } else {
        commit('updatePagination', { total, page: 1, limit: 10 })
      }
      return response
    } catch {
      commit('setItems', [])
      commit('updatePagination', { total: 0, page: 1, limit: 10 })
    }
  },

  async findByPk({ commit }, payload) {
    const response = await axios.get(`/bp_exemplar/${payload.params.id}`, payload.params)
    if (response) {
      const responseData = response.data.responseData
      commit('setOpenItem', responseData)
      return responseData
    } else return false
  },

  async addItem({ commit }, itemData) {
    const saveData = _.cloneDeep(itemData)

    const resItem = await axios.post(`${ProxyUrl.createbpexemplar}`, saveData)
    if (Number(resItem.data.httpStatus) === 200) {
      return true
    } else return false
  },

  async updateItem({ dispatch }, itemData) {
    const resUpdate = await axios.put(`${ProxyUrl.updatebpexemplar}`, itemData)
    if (resUpdate) {
      return true
    } else return false
  },

  async deleteItem({ dispatch }, itemData) {
    try {
      const res = await axios.post(`${ProxyUrl.deletebpexemplar}`, itemData)
      if (res.status === 200) {
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
