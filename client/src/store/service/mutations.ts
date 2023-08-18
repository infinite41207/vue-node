import { MutationTree } from 'vuex'
import { IState, commonState } from './state'
import Vue from 'vue'
import _ from 'lodash'

export const commonMutations: MutationTree<IState> = {
  setListViewProperty(state: IState, payload: any) {
    Object.keys(payload).forEach((key) => {
      Vue.set(state.listView, key, payload[key])
    })
  },

  setFilters(state: IState, filter: any) {
    Object.keys(filter).forEach((key) => {
      Vue.set(state.listView.filters, key, filter[key])
    })
  },

  setSort(state: IState, sort: any) {
    Object.keys(sort).forEach((key) => {
      Vue.set(state.listView.sort, key, sort[key])
    })
  },

  addObjectView(state: IState, view: any) {
    const existView = state.objectViews.find((el) => el.viewId === view.viewId)

    if (existView === undefined) {
      state.objectViews.push(view)
    }
  },

  setObjectViewProperty(state: IState, payload: any) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      Vue.set(state.objectViews[index], payload.property, payload.value)
    }
  },

  setObjectViewProperties(state: IState, payload: any) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      Object.keys(payload.props).forEach((key) => {
        Vue.set(state.objectViews[index], key, payload.props[key])
      })
    }
  },

  setObjectProperty(state: IState, payload: any) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      Vue.set(state.objectViews[index].object, payload.property, payload.value)
    }
  },

  setObjectProperties(state: IState, payload: any) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      Object.keys(payload.props).forEach((key) => {
        Vue.set(state.objectViews[index].object, key, payload.props[key])
      })
    }
  },

  addObjectTableRow(state: IState, payload: any) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      state.objectViews[index].object[payload.table].push(_.cloneDeep(payload.row))
    }
  },

  deleteObjectTableRow(state: IState, payload: any) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      state.objectViews[index].object[payload.table].splice(payload.index, 1)
    }
  },

  setObjectTableRow(state: IState, payload: any) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      Vue.set(state.objectViews[index].object[payload.table], payload.index, payload.row)
    }
  },

  delObjectView(state: IState, viewId: string) {
    for (const [i, v] of state.objectViews.entries()) {
      if (v.viewId === viewId) {
        state.objectViews.splice(i, 1)
        break
      }
    }
  },

  resetState(state: IState) {
    state = _.cloneDeep(commonState)
  },
}
