import moment from 'moment'
import _ from 'lodash'
import { ActionContext } from 'vuex'
import { IState } from '@/store/service/state'
import { commonState } from '../service/state'
import { commonMutations } from '../service/mutations'
import { commonGetters } from '../service/getters'
import { findAll, findByPk, createItem, updateItem, deleteItem, addNewItem, changeDeletionMark, resetState } from '../service/actions'

import BasicObject from '@/dto/WeighingStation.json'
const apiUrl = 'weighing_station'

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

  async addNew(context: ActionContext<IState, any>, payload: any) {
    return addNewItem(context, BasicObject, payload)
  },

  async getListFields() {
    return [
      { key: 'name', label: 'table.name', sortable: true },
      { key: 'code', label: 'table.code', sortable: true, width: '20%' },
      { key: 'delete', label: '-', width: '3%' },
    ]
  },

  async getSelectFields() {
    return [{ key: 'name', label: 'table.name', sortable: true }]
  },

  resetState(context: ActionContext<IState, any>) {
    resetState(context)
  },
}

function itemHundler(itemData: any) {
  itemData.object.createdAt = moment(itemData.object.createdAt).format('DD.MM.YYYY HH:mm:ss')
}

export const getters = { ...commonGetters }
