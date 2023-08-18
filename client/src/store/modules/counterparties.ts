import moment from 'moment'
import _ from 'lodash'
import axios from 'axios'
import { ActionContext } from 'vuex'
import { IState } from '@/store/service/state'
import { commonState } from '../service/state'
import { commonMutations } from '../service/mutations'
import { commonGetters } from '../service/getters'
import { findAll, findByPk, createItem, updateItem, changeDeletionMark, resetState, deleteItem } from '../service/actions'

const apiUrl = 'counterparties'

export const state = Object.assign({}, _.cloneDeep(commonState))

export const mutations = { ...commonMutations }

export const actions = {
  async findAll(context: ActionContext<IState, any>, payload: any) {
    return findAll(context, apiUrl, payload)
  },
  async getCount(context: ActionContext<IState, any>, payload: any) {
    return axios
      .get(`/${apiUrl}/count`, payload)
      .catch((error) => {
        throw error
      })
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

  async getEmails(context: ActionContext<IState, any>, payload: any) {
    return axios
      .get(`/${apiUrl}/email`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async getSelectFields() {
    return [
      { key: 'abbreviation', label: 'table.abbreviation', sortable: true },
      { key: 'name', label: 'table.name', sortable: true },
    ]
  },

  resetState(context: ActionContext<IState, any>) {
    resetState(context)
  },
}

function itemHundler(itemData: any) {
  itemData.object.createdAt = moment(itemData.object.createdAt).format('DD.MM.YYYY HH:mm:ss')
}

export const getters = {
  ...commonGetters,

  customerList(state: IState) {
    return state.listView.list
  },
}
