import axios from 'axios'

export const actions = {
  async runSyncData({ commit }, filterParams) {
    const response = await axios.get(`/get_from_1c`, filterParams)

    if (response) {
      return response
    } else throw new Error('No Content')
  },

  async sendTo1C({ commit }, filterParams) {
    const response = await axios.get(`/send_to_1c`)
    if (response) {
      return response
    } else throw new Error('No Content')
  },
}
