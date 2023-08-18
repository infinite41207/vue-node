import moment from 'moment'
import { ActionContext } from 'vuex'
import { IState } from '@/store/service/state'
import { commonState } from '../service/state'
import { commonMutations } from '../service/mutations'
import { commonGetters } from '../service/getters'
import { findAll, findByPk, createItem, updateItem, changeDeletionMark } from '../service/actions'

const apiUrl = 'cash_flow_item'

export const state = { ...commonState }

export const mutations = { ...commonMutations }

export const actions = {
  async findAll(context: ActionContext<IState, any>, payload: any) {
    return findAll(context, apiUrl, payload, listHundler)
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

  // async delete(context: ActionContext<IState, any>, payload: any) {
  //   return deleteItem(context, apiUrl, payload)
  // },

  async changeDeletionMark(context: ActionContext<IState, any>, payload: any) {
    return changeDeletionMark(context, apiUrl, payload)
  },

  async getSelectFields() {
    return [{ key: 'name', label: 'table.name', sortable: true }]
  },
}

function listHundler(listData: any) {}

function itemHundler(itemData: any) {
  itemData.object.createdAt = moment(itemData.object.createdAt).format('DD.MM.YYYY hh:mm:ss')
}

export const getters = { ...commonGetters }
