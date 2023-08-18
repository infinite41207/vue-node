import axios from 'axios'
import _ from 'lodash'
import moment from 'moment'
import Vue from 'vue'
import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { IReportState, IReportView, IReportSettings } from '../types/ReportType'

const initState: IReportState = {
  reportViews: [],
}

export const state: IReportState = _.cloneDeep(initState)

export const mutations: MutationTree<IReportState> = {
  addReportView(state: IReportState, reportView: IReportView) {
    state.reportViews.push(reportView)
  },

  setReportSettings(state: IReportState, payload) {
    const index = state.reportViews.findIndex((el) => el.reportType === payload.reportType)
    if (index > -1) {
      Vue.set(state.reportViews[index], 'settings', payload.settings)
    }
  },

  setReportSetting(state: IReportState, payload) {
    const index = state.reportViews.findIndex((el) => el.reportType === payload.reportType)
    if (index > -1) {
      Vue.set(state.reportViews[index].settings, payload.property, payload.value)
    }
  },

  setReportResult(state: IReportState, payload) {
    const index = state.reportViews.findIndex((el) => el.reportType === payload.reportType)
    if (index > -1) {
      Vue.set(state.reportViews[index], 'result', payload.result)
    }
  },

  setReportVariants(state: IReportState, payload) {
    const index = state.reportViews.findIndex((el) => el.reportType === payload.reportType)
    if (index > -1) {
      Vue.set(state.reportViews[index], 'reportVariants', payload.reportVariants)
    }
  },

  setReportProperty(state: IReportState, payload) {
    const index = state.reportViews.findIndex((el) => el.reportType === payload.reportType)
    if (index > -1) {
      Vue.set(state.reportViews[index], payload.property, payload.value)
    }
  },

  setReportProperties(state: IReportState, payload) {
    const index = state.reportViews.findIndex((el) => el.reportType === payload.reportType)
    if (index > -1) {
      Object.keys(payload.props).forEach((key) => {
        Vue.set(state.reportViews[index], key, payload.props[key])
      })
    }
  },

  delObjectView(state: IReportState, reportType) {
    for (const [i, v] of state.reportViews.entries()) {
      if (v.reportType === reportType) {
        state.reportViews.splice(i, 1)
        break
      }
    }
  },

  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const actions: ActionTree<IReportState, any> = {
  async getReportSettings({ commit }, payload) {
    if (state.reportViews.some((v) => v.reportType === payload.reportType)) {
      return { status: 200 }
    }

    return await axios
      .get(`/report/settings/${payload.reportType}`)
      .then((response) => {
        if (response.status === 200) {
          const currentDate = new Date()

          const settings: IReportSettings = {
            isOpen: false,
            periodType: response.data.periodType,
            reportName: response.data.reportName,
            reportDate: currentDate,
            periodStart: moment(currentDate).startOf('month').toDate(),
            periodFinish: moment(currentDate).endOf('month').toDate(),
            columns: response.data.columns,
            filters: [],
            groups: [],
            funcs: [],
            sumColumns: response.data.summColumns,
            totals: [],
            showYTotal: false,
            showXTotal: false,
            classes: {},
          }

          if (response.data.showYTotal) {
            settings.showYTotal = response.data.showYTotal
          }

          if (response.data.showXTotal) {
            settings.showXTotal = response.data.showXTotal
          }

          const reportView: IReportView = {
            reportType: payload.reportType,
            settings: settings,
            result: {},
            reportVariants: [],
            selGroupLevel: 0,
          }

          commit('addReportView', reportView)
        }

        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async getReportResult({ commit }, payload) {
    return await axios
      .post(`/report/result/${payload.reportType}`, payload.params)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async getReportVariants({ commit }, payload) {
    return await axios
      .get(`/report_variant`, { params: payload })
      .then((response) => {
        if (response.status === 200) {
          const reportVariants = []
          let rowNumber = 0
          for (const variant of response.data) {
            reportVariants.push({
              id: variant.id,
              index: ++rowNumber,
              name: variant.variantName,
              user: !variant.userId === null,
            })
          }

          commit('setReportVariants', {
            reportType: payload.reportType,
            reportVariants,
          })
        }

        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async getReportVariant(context, payload) {
    return await axios
      .get(`/report_variant/${payload.params.id}`, payload.params)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async createReportVariant(context, payload) {
    return await axios
      .post(`/report_variant`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async updateReportVariant(context, payload) {
    return await axios
      .put(`/report_variant/${payload.id}`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async deleteReportVariant(context, payload) {
    return await axios
      .delete(`/report_variant/${payload.params.id}`, payload.params)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  resetState({ commit }) {
    commit('resetState')
  },
}

export const getters: GetterTree<IReportState, any> = {
  reportView: (state) => (reportType: string) => {
    return state.reportViews.find((el) => el.reportType === reportType)
  },
}
