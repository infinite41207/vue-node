import ProxyUrl from '../../constants/ProxyUrls'
import axios from 'axios'

export const actions = {
  async findAll() {
    try {
      const response = await axios.get(`${ProxyUrl.getallreclamationstatusgroups}`)
      if (response) {
        return response.data.responseData
      } else throw new Error('No Content')
    } catch (error) {
      throw new Error(error)
    }
  },

  async countAll({ commit }, payload) {
    return axios
      .get(`/count_reclamation_status_groups`, payload)
      .then((response) => {
        return response
      })
      .catch((err) => {
        console.log('error in create reclamation store: ', err)
      })
  },

  async findByPk({ commit, dispatch, getters }, payload) {
    return axios
      .get(`/getreclamationstatusgroup/${payload.id}`, payload)
      .then((response) => {
        return response.data.responseData
      })
      .catch((error) => {
        throw error
      })
  },

  async addItem(payload, itemData) {
    try {
      const resItem = await axios.post(`${ProxyUrl.createreclamationstatusgroup}`, itemData)
      if (resItem) {
        return true
      } else return false
    } catch (error) {
      return false
    }
  },

  async updateItem({ dispatch }, itemData) {
    try {
      const resUser = await axios.put(`${ProxyUrl.updatereclamationstatusgroup}`, itemData)
      if (resUser) {
        return true
      } else return false
    } catch (error) {
      console.error(error)
      return false
    }
  },

  async deleteItem({ dispatch }, itemData) {
    try {
      const res = await axios.post(`${ProxyUrl.deletereclamationstatusgroup}`, itemData)
      if (res.status === 200) {
        return true
      } else return false
    } catch (error) {
      console.eror(error)
      return false
    }
  },
}
