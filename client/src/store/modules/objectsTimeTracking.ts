import moment from 'moment'
import _ from 'lodash'
import { ActionContext } from 'vuex'
import { IState } from '@/store/service/state'
import { commonState } from '../service/state'
import { commonMutations } from '../service/mutations'
import { commonGetters } from '../service/getters'
import { findAll, findByPk, createItem, updateItem, deleteItem, resetState, changeDeletionMark } from '../service/actions'
import axios from 'axios'

const apiUrl = 'objects_time_tracking'

export const state = Object.assign({}, _.cloneDeep(commonState))

export const mutations = { ...commonMutations }

export const actions = {
  async findAll(context: ActionContext<IState, any>, payload: any) {
    return findAll(context, apiUrl, payload)
  },

  async findByPk(context: ActionContext<IState, any>, payload: any) {
    return findByPk(context, apiUrl, payload, itemHundler)
  },

  async create(context: ActionContext<IState, any>, payload: any) {
    return createItem(context, apiUrl, payload)
  },

  async update(context: ActionContext<IState, any>, payload: any) {
    return updateItem(context, apiUrl, payload)
  },

  async delete(context: ActionContext<IState, any>, payload: any) {
    return deleteItem(context, apiUrl, payload)
  },

  async changeDeletionMark(context: ActionContext<IState, any>, payload: any) {
    return changeDeletionMark(context, apiUrl, payload)
  },

  async getSelectFields() {
    return [{ key: 'name', label: 'table.name', sortable: true }]
  },

  resetState(context: ActionContext<IState, any>) {
    resetState(context)
  },

  async getCurrentObjects(context: ActionContext<IState, any>, payload: any) {
    return axios
      .get(`/${apiUrl}/current_objects`, payload)
      .then((response) => {
        context.commit('setListViewProperty', { list: response.data })
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async updateObjectList(context: ActionContext<IState, any>, payload: any) {
    if (payload.params.list) {
      context.commit('setListViewProperty', { list: payload.params.list })
    }
  },
}

function itemHundler(itemData: any) {
  itemData.object.createdAt = moment(itemData.object.createdAt).format('DD.MM.YYYY HH:mm:ss')
}

export const getters = { ...commonGetters }
