import axios from 'axios'

export const actions = {
  async findAll(context, payload) {
    return await axios
      .get(`/interaction_status`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async findByPk(context, payload) {
    return axios
      .get(`/interaction_status/${payload.id}`, payload)
      .then((response) => {
        const responseData = response.data.responseData
        return responseData
      })
      .catch((error) => {
        console.error(error)
        return {}
      })
  },

  async addItem(context, payload) {
    return await axios
      .post(`/interaction_status`, payload)
      .then((response) => {
        if (response === 200) {
          return true
        } else return false
      })
      .catch((error) => {
        console.error(error)
        return false
      })
  },

  async updateItem(context, payload) {
    return await axios
      .put(`/interaction_status`, payload)
      .then((response) => {
        if (response === 200) {
          return true
        } else return false
      })
      .catch((error) => {
        console.error(error)
        return false
      })
  },

  async deleteItem(context, payload) {
    return await axios
      .delete(`/interaction_status/${payload.id}`, payload)
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
}
