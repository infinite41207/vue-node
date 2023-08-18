import moment from 'moment'
import _ from 'lodash'
import { ActionContext } from 'vuex'
import { IState } from '@/store/service/state'
import { commonState } from '../service/state'
import { commonMutations } from '../service/mutations'
import { commonGetters } from '../service/getters'
import { findAll, findByPk, createItem, updateItem, deleteItem } from '../service/actions'

const apiUrl = 'role_group'

export const state = Object.assign({}, _.cloneDeep(commonState))

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

  async delete(context: ActionContext<IState, any>, payload: any) {
    return deleteItem(context, apiUrl, payload)
  },

  async getSelectFields() {
    return [{ key: 'name', label: 'table.name', sortable: true }]
  },
}

function listHundler(listData: any) {
  for (const listItem of listData.list) {
    listItem.createdAt = moment(listItem.createdAt).format('DD.MM.YYYY hh:mm:ss')
  }
}

function itemHundler(itemData: any) {
  itemData.object.createdAt = moment(itemData.object.createdAt).format('DD.MM.YYYY HH:mm:ss')
  itemData.settings = []
  itemData.users = []
  itemData.settCurrPage = 1
  itemData.usersCurrPage = 1
  itemData.currTab = 0
}

export const getters = { ...commonGetters }
