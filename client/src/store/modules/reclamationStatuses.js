import ProxyUrl from '../../constants/ProxyUrls'
import axios from 'axios'

export const actions = {
  async findAll(context, payload) {
    return await axios
      .get(`${ProxyUrl.getallreclamationstatuses}`, payload)
      .then((response) => {
        if (response.status === 200) {
          return response.data.responseData
        } else throw new Error('No content')
      })
      .catch((error) => {
        throw error
      })
  },

  async findByPk(context, payload) {
    return axios
      .get(`/getreclamationstatus/${payload.id}`, payload)
      .then((response) => {
        return response.data.responseData
      })
      .catch((error) => {
        throw error
      })
  },

  async addItem(context, payload) {
    return await axios
      .post(`${ProxyUrl.createreclamationstatus}`, payload)
      .then((response) => {
        if (response.status === 200) {
          return true
        } else return false
      })
      .catch((error) => {
        console.error(error)
        return false
      })
  },

  async updateItem({ dispatch }, payload) {
    return await axios
      .put(`${ProxyUrl.updatereclamationstatus}`, payload)
      .then((response) => {
        if (response.status === 200) {
          return true
        } else return false
      })
      .catch((error) => {
        console.error(error)
        return false
      })
  },

  async deleteItem({ dispatch }, payload) {
    return await axios
      .post(`${ProxyUrl.deletereclamationstatus}`, payload)
      .then((response) => {
        if (response.status === 200) {
          return true
        } else return false
      })
      .catch((error) => {
        throw error
      })
  },
}
