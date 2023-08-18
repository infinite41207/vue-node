import ProxyUrl from '../../constants/ProxyUrls'
import axios from 'axios'

export const actions = {
  async findAll(context, reclamationId) {
    const params = {}
    if (reclamationId) {
      params.reclamationId = reclamationId
    }

    return await axios
      .get(`${ProxyUrl.getallreclamationemails}`, { params })
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
      .get(`/getreclamationemail/${payload.id}`, payload)
      .then((response) => {
        if (response.status === 200) {
          const emailData = response.data.responseData
          return emailData
        } else {
          throw new Error('No Content')
        }
      })
      .catch((error) => {
        throw error
      })
  },

  async addItem(context, payload) {
    return await axios
      .post(`${ProxyUrl.createreclamationemail}`, payload)
      .then((response) => {
        if (response.status === 200) {
          return true
        } else return false
      })
      .catch((error) => {
        throw error
      })
  },

  async updateItem(context, payload) {
    return await axios
      .put(`${ProxyUrl.updatereclamationemail}`, payload)
      .then((response) => {
        if (response.status === 200) {
          return true
        } else return false
      })
      .catch((error) => {
        throw error
      })
  },

  async deleteItem(context, payload) {
    return await axios
      .post(`${ProxyUrl.deletereclamationemail}`, payload)
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
