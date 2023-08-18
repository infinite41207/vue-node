import axios from 'axios'
import _ from 'lodash'
import moment from 'moment'
import { ActionContext } from 'vuex'
import { IState } from '@/store/service/state'
import { IState as IStateItem } from '@/store/service/state'
import { commonState } from '../service/state'
import { commonMutations } from '../service/mutations'
import { commonGetters } from '../service/getters'
import { findAll, findByPk, createItem, updateItem, changeDeletionMark, resetState, deleteItem } from '../service/actions'

const apiUrl = 'user_settings'
const apiUrlItem = 'user_setting_item'

export const state = Object.assign({}, _.cloneDeep(commonState))
export const stateItem = { ...commonState }

export const mutations = { ...commonMutations }

export const actions = {
  async findAll(context: ActionContext<IState, any>, payload: any) {
    // await findAll(context, apiUrlItem, payload)
    //   .then((response) => {
    //     if(response.data.length > 0) {
    //       for(let i = 0; i < response.data.length; i++) {
    //         if(response.data[i].global === true) {

    //         }
    //       }
    //     }
    //   })

    return findAll(context, apiUrl, payload)
  },

  async findAllItems(context: ActionContext<IStateItem, any>, payload: any) {
    return findAll(context, apiUrlItem, payload)
  },

  async findByPk(context: ActionContext<IState, any>, payload: any) {
    return findByPk(context, apiUrl, payload, itemHundler)
  },

  async findByPkItem(context: ActionContext<IStateItem, any>, payload: any) {
    return findByPk(context, apiUrlItem, payload, itemHundler)
  },

  async findByKey(context: ActionContext<IStateItem, any>, payload: any) {
    return axios
      .get(`/user_setting`, payload)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async create(context: ActionContext<IState, any>, payload: any) {
    return createItem(context, apiUrl, payload)
  },

  async createItem(context: ActionContext<IStateItem, any>, payload: any) {
    return createItem(context, apiUrlItem, payload)
  },

  async update(context: ActionContext<IState, any>, payload: any) {
    return updateItem(context, apiUrl, payload)
  },

  async updateItem(context: ActionContext<IStateItem, any>, payload: any) {
    return updateItem(context, apiUrlItem, payload)
  },

  async delete(context: ActionContext<IState, any>, payload: any) {
    return deleteItem(context, apiUrl, payload)
  },

  async changeDeletionMark(context: ActionContext<IState, any>, payload: any) {
    return changeDeletionMark(context, apiUrl, payload)
  },

  async getSelectFields() {
    return [{ key: 'description', label: 'table.name', sortable: true }]
  },

  resetState(context: ActionContext<IState, any>) {
    resetState(context)
  },
}

function itemHundler(itemData: any) {
  itemData.object.createdAt = moment(itemData.object.createdAt).format('DD.MM.YYYY HH:mm:ss')
}

export const getters = { ...commonGetters }
