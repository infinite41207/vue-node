import axios from 'axios'
import orderActions from '../../utils/order-actions'
import CustomerData from '@/dto/Customer.json'
import moment from 'moment'
import Vue from 'vue'
import _ from 'lodash'

const initState = {
  listView: {
    list: [],
    total: 0,
    page: 1,
    limit: 20,
    filters: {
      searchStr: '',
      period: [null, null],
      customer: null,
      status: null,
      multiplyStatus: false,
    },
    sort: { sortBy: null, sortDesc: false },
  },
  objectViews: [],
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const mutations = {
  setListViewProperty(state, payload) {
    Object.keys(payload).forEach((key) => {
      state.listView[key] = payload[key]
    })
  },

  setFilters(state, filter) {
    Object.keys(filter).forEach((key) => {
      state.listView.filters[key] = filter[key]
    })
  },

  setSort(state, sort) {
    Object.keys(sort).forEach((key) => {
      state.listView.sort[key] = sort[key]
    })
  },

  addObjectView(state, view) {
    const existView = state.objectViews.find((el) => el.viewId === view.viewId)

    if (existView === undefined) {
      state.objectViews.push(view)
    }
  },

  setObjectViewProperty(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      state.objectViews[index][payload.property] = payload.value
    }
  },

  setObjectViewProperties(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      Object.keys(payload.props).forEach((key) => {
        state.objectViews[index][key] = payload.props[key]
      })
    }
  },

  setObjectProperty(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      Vue.set(state.objectViews[index].object, payload.property, payload.value)
    }
  },

  delObjectView(state, viewId) {
    for (const [i, v] of state.objectViews.entries()) {
      if (v.viewId === viewId) {
        state.objectViews.splice(i, 1)
        break
      }
    }
  },

  setProductProperty(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      Vue.set(state.objectViews[index].currentProduct, payload.property, payload.value)
    }
  },

  setProductPrices(state, { viewId, prices, addinParameters }) {
    const index = state.objectViews.findIndex((el) => el.viewId === viewId)
    if (index > -1) {
      if (!state.objectViews[index].currentProduct.configProduct) {
        state.objectViews[index].currentProduct.quantity = addinParameters.quantity
        state.objectViews[index].currentProduct.description = addinParameters.description
        state.objectViews[index].currentProduct.numberOfPieces = addinParameters.numberOfPieces
        state.objectViews[index].currentProduct.length = addinParameters.length
        state.objectViews[index].currentProduct.height = addinParameters.height
      }

      for (const priceRow of prices) {
        priceRow.price = Number(priceRow.price).toFixed(2)
        priceRow.sum = Number(priceRow.sum).toFixed(2)
        priceRow.discountSum = Number(priceRow.discountSum).toFixed(2)
        priceRow.discountPercent = Number(priceRow.discountPercent).toFixed(2)
      }

      state.objectViews[index].currentProduct.prices = prices

      let totalPrice = 0
      let totalSum = 0
      let totalDiscountSum = 0
      let totalDiscountPercent = 0

      for (const price of prices) {
        totalSum += Number(price.sum)
        totalDiscountSum += Number(price.discountSum)
      }

      totalPrice = (totalSum + totalDiscountSum / state.objectViews[index].currentProduct.quantity).toFixed(2)

      if (totalPrice !== '0.00') {
        totalDiscountPercent = ((totalDiscountSum / Number(totalPrice)) * 100).toFixed(2)
      } else {
        totalDiscountPercent = totalDiscountPercent.toFixed(2)
      }

      state.objectViews[index].currentProduct.price = totalPrice
      state.objectViews[index].currentProduct.sumBrutto = totalSum.toFixed(2)
      state.objectViews[index].currentProduct.sumNetto = totalSum.toFixed(2)
      state.objectViews[index].currentProduct.vat = 0
      state.objectViews[index].currentProduct.discountSum = totalDiscountSum.toFixed(2)
      state.objectViews[index].currentProduct.discountPercent = totalDiscountPercent
    }
  },

  setChoosenParameter(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      const paramIndex = state.objectViews[index].currentProduct.choosenParameters.findIndex((el) => el.param.uuid === payload.choosenParameter.param.uuid)
      if (paramIndex >= 0) {
        Vue.set(state.objectViews[index].currentProduct.choosenParameters, paramIndex, payload.choosenParameter)
      } else {
        state.objectViews[index].currentProduct.choosenParameters.push(payload.choosenParameter)
      }
    }
  },

  setChoosenParameterProperty(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      const foundParam = state.objectViews[index].currentProduct.choosenParameters[payload.index]

      if (foundParam) {
        foundParam[payload.property] = payload.value
      }
    }
  },

  setChoosenParameterParamProperty(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      const foundParam = state.objectViews[index].currentProduct.choosenParameters[payload.index]

      if (foundParam) {
        foundParam.param[payload.property] = payload.value
      }
    }
  },

  setChoosenParameters(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      state.objectViews[index].currentProduct.choosenParameters = payload.choosenParameters
    }
  },

  deleteChoosenParameters(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      state.objectViews[index].currentProduct.choosenParameters.splice(payload.index, payload.count)
    }
  },

  setProductDescription(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      state.objectViews[index].currentProduct.description = payload.description
    }
  },

  addObjectProduct(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      const productIndex = state.objectViews[index].currentProduct.index
      delete state.objectViews[index].currentProduct.index

      if (productIndex >= 0) {
        state.objectViews[index].object.products[productIndex] = state.objectViews[index].currentProduct
      } else {
        state.objectViews[index].object.products.push(state.objectViews[index].currentProduct)
      }

      orderActions.calcTotalSum(state.objectViews[index].object)
    }
  },

  addExtraProducts(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      for (const extraProduct of payload.products) {
        extraProduct.prices.push({
          priceDescription: `Podstawowy: ${extraProduct.product.name}`,
          priceType: 'main',
          description: extraProduct.description,
          quantity: extraProduct.quantity,
          price: extraProduct.price,
          discountPercent: 0,
          discountSum: 0,
          sum: extraProduct.sumBrutto,
          discountId: null,
          pricelistId: null,
          priceCode: '',
          maxDiscount: '0.00',
          discountPriority: 0,
        })

        state.objectViews[index].object.products.push(_.cloneDeep(extraProduct))
      }

      orderActions.calcTotalSum(state.objectViews[index].object)
    }
  },

  copyProduct(state, payload) {
    const copyProduct = payload.productRow

    delete copyProduct.id

    for (const proceRow of copyProduct.prices) {
      delete proceRow.id
    }

    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      state.objectViews[index].object.products.push(copyProduct)
      orderActions.calcTotalSum(state.objectViews[index].object)
    }
  },

  deleteProduct(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      state.objectViews[index].object.products.splice(payload.index, 1)
      orderActions.calcTotalSum(state.objectViews[index].object)
    }
  },

  setObjectFiles(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      state.objectViews[index].object.files = payload.files
    }
  },

  deleteObjectFile(state, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      state.objectViews[index].object.files.splice(payload.index, 1)
    }
  },

  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const getters = {
  listView(state) {
    return state.listView
  },

  objectView: (state) => (viewId) => {
    return state.objectViews.find((el) => el.viewId === viewId)
  },

  presentation: (state) => (viewId) => {
    const objectView = state.objectViews.find((el) => el.viewId === viewId)

    let presentation = ''
    if (objectView) {
      presentation = objectView.object.numberStr
    }

    return presentation
  },
}

export const actions = {
  async findAll({ commit, state }, payload) {
    return axios
      .get(`/sales_order`, payload)
      .then((response) => {
        const result = response.data

        let list = []
        if (result.rows) {
          list = result.rows
        } else {
          list = result
        }

        list.forEach((el) => {
          el.createdAt = moment(el.createdAt).format('DD.MM.YYYY HH:mm:ss')
          if (!el.deliveryDate) {
            el.deliveryDate = ''
          } else {
            el.deliveryDate = moment(el.deliveryDate).format('DD.MM.YYYY')
          }
          if (el.numberStr === null) {
            el.numberStr = el.prefix + '-' + el.number.toString().padStart(6, '0')
          }
          el.presentation = `Zlecenie nr ${el.numberStr} od ${el.createdAt}`
        })

        if (!payload.noCommit) {
          commit('setListViewProperty', { list })
        }

        let total = 0
        if (result.count) {
          total = result.count
        } else {
          total = list.length
        }

        if (total > 0) {
          const pages = Math.ceil(total / state.listView.limit)

          if (pages >= state.listView.page) {
            commit('setListViewProperty', { total })
          } else {
            commit('setListViewProperty', { total, page: pages })
          }
        } else {
          commit('setListViewProperty', { total, page: 1 })
        }

        return response
      })
      .catch((error) => {
        console.error(error)
        commit('setListViewProperty', { list: [], total: 0, page: 1 })
        return error
      })
  },

  async findByPk({ commit, state, getters }, payload) {
    if (!payload.noCommit) {
      if (state.objectViews.some((v) => v.viewId === payload.params.id)) {
        return { status: 200 }
      }
    }

    return axios
      .get(`/sales_order/${payload.params.id}`)
      .then((response) => {
        if (!payload.noCommit && response.status === 200) {
          const object = response.data
          commit('addObjectView', {
            viewId: payload.params.id,
            object,
            customerData: _.cloneDeep(CustomerData),
            currentProduct: null,
            viewMode: 'order_modification',
            initCalcPrices: false,
            referenceDouble: false,
            tabIndex: 0,
          })
        }

        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async createObject(context, payload) {
    const writeObject = _.cloneDeep(payload)
    orderActions.convertProducts(writeObject)

    return axios.post(`/sales_order`, writeObject).then((response) => {
      return response
    })
  },

  async updateObject(context, payload) {
    const updateObject = _.cloneDeep(payload)
    orderActions.convertProducts(updateObject)

    return axios.put(`/sales_order/${updateObject.id}`, updateObject).then((response) => {
      return response
    })
  },

  async changeDeletionMark({ commit }, payload) {
    return axios.post(`/sales_order/change_deletion_mark`, { orderId: payload.id }).then((response) => {
      return response
    })
  },

  async getCustomerData({ commit }, payload) {
    return axios
      .get(`/customer/${payload.params.id}`)
      .then((response) => {
        const customerData = response.data
        commit('setObjectViewProperty', {
          viewId: payload.params.viewId,
          property: 'customerData',
          value: customerData,
        })
        return response
      })
      .catch((error) => {
        commit('setObjectViewProperty', {
          viewId: payload.params.viewId,
          property: 'customerData',
          value: _.cloneDeep(CustomerData),
        })
        console.error(error)
        return error
      })
  },

  updateProductDescription({ commit, state }, payload) {
    let currentDescription = ''

    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      if (state.objectViews[index].currentProduct.configProduct) {
        state.objectViews[index].currentProduct.choosenParameters.forEach((el) => {
          currentDescription += currentDescription !== '' ? '\r\n' : ''
          currentDescription = `${currentDescription}  ${el.param.name}: ${el.valueLabel}`
        })

        commit('setProductDescription', { viewId: payload.viewId, description: currentDescription })
      }
    }
  },

  async checkDouble({ commit }, params) {
    return axios
      .post(`/sales_order/check_double`, { ...params })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async getDoubleData({ commit }, params) {
    return axios
      .post(`/sales_order/get_double_data`, { ...params })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async uploadFiles({ commit, getters }, payload) {
    const formData = new FormData()
    payload.files.map((file) => formData.append('files', file))
    formData.append('data', JSON.stringify({ id: payload.viewId }))

    return axios
      .post(`/sales_order/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async getFiles({ commit }, payload) {
    return axios
      .post(`/sales_order/object_file`, { objectId: payload.objectId })
      .then((response) => {
        commit('setObjectFiles', { viewId: payload.viewId, files: response.data })
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async getSubordination(context, payload) {
    return axios
      .get(`/sales_order/subordination/${payload.objectId}`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async openFile({ commit }, payload) {
    return axios
      .get(`/sales_order/file/${payload.id}`, { responseType: 'blob' })
      .then((response) => {
        if (response.status === 200) {
          const blob = new Blob([response.data], { type: payload.type })
          const fileLink = document.createElement('a')
          fileLink.href = window.URL.createObjectURL(blob)

          if (payload.open === true && (payload.type === 'application/pdf' || payload.type === 'image/jpeg' || payload.type === 'image/png')) {
            fileLink.target = '_blank'
            fileLink.rel = 'noopener noreferrer'
          } else {
            fileLink.setAttribute('download', payload.name)
          }

          document.body.appendChild(fileLink)
          fileLink.click()
        }
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async deleteFile({ commit }, payload) {
    return axios
      .delete(`/sales_order/file/${payload.id}`, {})
      .then((response) => {
        if (response.status === 200) {
          commit('deleteObjectFile', { viewId: payload.viewId, index: payload.index })
        }
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },

  async calculatePrices({ state }, payload) {
    const index = state.objectViews.findIndex((el) => el.viewId === payload.viewId)
    if (index > -1) {
      const productData = state.objectViews[index].currentProduct
      const orderData = state.objectViews[index].object

      const reqData = {
        productId: productData.product.id,
        quantity: productData.quantity,
        choosenParameters: productData.choosenParameters,
        customerId: orderData.customerId,
      }

      return axios
        .post(`/pricelist/calculate_prices`, reqData)
        .then((response) => {
          return response
        })
        .catch((error) => {
          console.error(error)
          return error
        })
    } else {
      return { status: 400 }
    }
  },

  resetState({ commit }) {
    commit('resetState')
  },
}
