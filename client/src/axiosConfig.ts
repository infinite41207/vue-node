import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.VUE_APP_BASE_API_URL ? process.env.VUE_APP_BASE_API_URL : ''
