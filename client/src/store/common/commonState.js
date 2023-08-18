import axios from 'axios'
import Pagination from '../../dto/Pagination.json'
import Vue from 'vue'

export const state = {
  items: [],
  pagination: _.cloneDeep(Pagination),
  tabIndex: 0,
}

export const mutations = {
  setItemsList(state, items) {
    state.items = items
  },

  setOpenItem(state, openItem) {
    if (!openItem) {
      state.openBpDefinition = _.cloneDeep(newBpDefinition)
    } else {
      state.openBpDefinition = bpDefinition
    }
  },
}

export const getters = {
  itemsList(state) {
    return state.items
  },
  openItem(state) {
    return state.openItem
  },
}

export const actions = {
  async findAllItems({ commit }, allItemsUrl, filterParams) {
    try {
      const response = await axios.get(`${allItemsUrl}`, { params: filterParams })
      if (response) {
        const resItems = response.data.responseData
        commit('setItemsList', resItems)
        return resItems
      } else {
        commit('setItemsList', [])
        throw new Error('No Content')
      }
    } catch (error) {
      commit('setItemsList', [])
      throw new Error(error)
    }
  },

  async findByPk({ commit }, params) {
    const response = await axios.get(`/getbpdefinition/${params.id}`, params)
    if (response) {
      const responseData = response.data.responseData
      // commit('setBpDefinition', responseData)
      return responseData
    } else return false
  },

  async addItem({ commit }, addItemURL, itemData) {
    const resItem = await axios.post(`${addItemURL}`, itemData)
    if (Number(resItem.data.httpStatus) === 200) {
      const openReclamationData = resItem.data.responseData
      commit('openItem', openReclamationData)
      return true
    } else return false
  },

  async updateItem({ dispatch }, updateItemURL, itemData) {
    // try {
    const resUpdate = await axios.put(`${updateItemURL}`, itemData)
    if (resUpdate) {
      return true
    } else return false
    // } catch (error) {
    //   console.log(error);
    //   return false;
    // }
  },

  async deleteItem({ dispatch }, deleteItemURL, itemData) {
    try {
      const res = await axios.post(`${deleteItemURL}`, itemData)
      if (res.status === 200) {
        return true
      } else return false
    } catch (error) {
      console.log(error)
      return false
    }
  },
}
