import { ActionContext } from 'vuex'
import { IState } from './state'
import axios from 'axios'
import _ from 'lodash'

type HundlerFunction = (...args: any[]) => void

export async function findAll(context: ActionContext<IState, any>, apiUrl: string, payload: any, listHundler: HundlerFunction | undefined = undefined) {
  const listView = { list: [], total: 0, page: 1 }

  return axios
    .get(`/${apiUrl}`, payload)
    .then((response) => {
      if (!payload.noCommit) {
        const result = response.data

        if (result.rows) {
          listView.list = result.rows
        } else {
          listView.list = result
        }

        listView.total = result.count ? result.count : listView.list.length
        let page = context.state.listView.page

        if (listView.total > 0) {
          const pages = Math.ceil(listView.total / context.state.listView.limit)
          if (pages < context.state.listView.page) {
            page = pages
          }
        } else {
          page = 1
        }

        listView.page = page

        if (listHundler) {
          listHundler(listView)
        }

        context.commit('setListViewProperty', listView)
      }

      return response
    })
    .catch((error) => {
      if (!payload.noCommit) {
        if (listHundler) {
          listHundler(listView)
        }
        context.commit('setListViewProperty', listView)
      }
      throw error
    })
}

export async function findByPk(context: ActionContext<IState, any>, apiUrl: string, payload: any, itemHundler: HundlerFunction | undefined = undefined) {
  if (!payload.noCommit) {
    if (context.state.objectViews.some((v) => v.viewId === payload.params.id)) return
  }

  return axios
    .get(`/${apiUrl}/${payload.params.id}`, payload.query)
    .then((response) => {
      if (!payload.noCommit) {
        const viewObject = { viewId: payload.params.id, object: response.data }

        if (itemHundler) {
          itemHundler(viewObject)
        }
        context.commit('addObjectView', viewObject)
      }

      return response
    })
    .catch((error) => {
      throw error
    })
}

export async function addNewItem(context: ActionContext<IState, any>, BasicObject: any, payload: any) {
  const viewId = payload
  const object = _.cloneDeep(BasicObject)
  object.id = viewId
  object.isNew = true

  context.commit('addObjectView', { viewId, object })
}

export async function createItem(context: ActionContext<IState, any>, apiUrl: string, payload: any) {
  return axios
    .post(`/${apiUrl}`, payload)
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw error
    })
}

export async function updateItem(context: ActionContext<IState, any>, apiUrl: string, payload: any) {
  return axios
    .put(`/${apiUrl}/${payload.id}`, payload)
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw error
    })
}

export async function changeDeletionMark(context: ActionContext<IState, any>, apiUrl: string, payload: any) {
  return axios
    .post(`/${apiUrl}/change_deletion_mark`, payload)
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw error
    })
}

export async function deleteItem(context: ActionContext<IState, any>, apiUrl: string, payload: any) {
  return axios
    .delete(`/${apiUrl}/${payload.id}`, payload)
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw error
    })
}

export function resetState(context: ActionContext<IState, any>) {
  context.commit('resetState')
}
