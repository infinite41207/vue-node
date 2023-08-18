import ProxyUrl from '../../constants/ProxyUrls'
import axios from 'axios'

export const actions = {
  async findAll(context, payload) {
    try {
      const response = await axios.get(`${ProxyUrl.getAllDocNumerators}`)
      if (response) {
        return response.data.responseData
      } else throw new Error('No Content')
    } catch (error) {
      throw new Error(error)
    }
  },

  async findByPk(context, payload) {
    return axios
      .get(`/${ProxyUrl.getDocNumerator}/${payload.id}`, payload)
      .then((response) => {
        const responseData = response.data.responseData
        return responseData
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async addItem(context, payload) {
    try {
      const response = await axios.post(`${ProxyUrl.createDocNumerator}`, payload)
      if (response.status === 200) {
        return true
      } else return false
    } catch (error) {
      console.error(error)
      return false
    }
  },

  async updateItem(context, payload) {
    try {
      const response = await axios.put(`${ProxyUrl.updateDocNumerator}/${payload.id}`, payload)
      if (response.status === 200) {
        return true
      } else return false
    } catch (error) {
      console.error(error)
      return false
    }
  },

  async deleteItem(context, payload) {
    try {
      const response = await axios.delete(`${ProxyUrl.deleteDocNumerator}/${payload.id}`, payload)
      if (response.status === 200) {
        return true
      } else return false
    } catch (error) {
      console.error(error)
      return false
    }
  },
}
