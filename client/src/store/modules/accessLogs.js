import axios from 'axios'

export const actions = {
  async getAllFiles({ commit }, payload) {
    return axios
      .get(`/access_log`, payload)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async getFileInfo({ commit }, payload) {
    return axios
      .get(`/access_log/${payload}`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },
}
