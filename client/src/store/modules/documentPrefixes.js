import axios from 'axios'

const namespace = 'doc_prefix'

export const actions = {
  async findAll(context, payload) {
    try {
      const response = await axios.get(`/${namespace}`, payload)
      return response
    } catch (error) {
      return error
    }
  },

  async findByPk(context, payload) {
    return axios
      .get(`/${namespace}/${payload.id}`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async create(context, payload) {
    try {
      const response = await axios.post(`/${namespace}`, payload)
      return response
    } catch (error) {
      return error
    }
  },

  async update(context, payload) {
    try {
      const response = await axios.put(`/${namespace}/${payload.id}`, payload)
      return response
    } catch (error) {
      console.error(error)
      return error
    }
  },

  async delete(context, payload) {
    try {
      const response = await axios.delete(`/${namespace}/${payload.id}`, payload)
      return response
    } catch (error) {
      console.error(error)
      return error
    }
  },
}
