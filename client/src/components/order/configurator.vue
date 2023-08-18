<template>
  <b-card>
    <b-row>
      <b-col md="4">
        <b-form-group horizontal :label-cols="3" :label="$t('table.product')" label-for="product_select">
          <b-form-select id="product_select" :value.sync="productData.product.id" text-field="name" value-field="id" :options="products" disabled size="sm"></b-form-select>
        </b-form-group>
      </b-col>
      <b-col md="2">
        <b-form-group horizontal :label-cols="4" :label="$t('table.quantity')" label-for="product_quantity">
          <b-form-input id="product_quantity" v-model="quantity" type="number" :min="1" :state="quantity > 0" size="sm"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col md="3">
        <b-form-group horizontal :label-cols="4" :label="$t('table.reference')" label-for="product_reference">
          <b-form-input id="product_reference" v-model="reference" type="text" size="sm"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col md="3">
        <b-button-group>
          <b-button variant="success" size="sm" @click="endParametrization">
            <i class="ri-logout-circle-r-line"></i>
            {{ $t('commands.confirm') }}
          </b-button>
          <b-button class="ml-2" variant="danger" size="sm" @click="cancelParametrization">
            <i class="ri-close-line"></i>
            {{ $t('commands.cancel') }}
          </b-button>
          <a v-if="!externalUser" v-b-toggle.sidebar-note href="javascript:void(0);" class="btn btn-info btn-sm ml-4">
            <i class="ri-file-text-line"></i>
          </a>
        </b-button-group>
      </b-col>
    </b-row>

    <b-sidebar id="sidebar-note" :title="$t('table.note')" width="30%" right shadow>
      <div class="px-3 py-2">
        <b-form-textarea
          id="note-text"
          v-model="customerData.note"
          plaintext
          disabled
          max-rows="40"
          :placeholder="$t('common.emptyField')"
          style="overflow: hidden"
          no-resize
        ></b-form-textarea>
      </div>
    </b-sidebar>

    <!-- products patameters -->
    <b-row class="mt-2" cols="1" cols-sm="1" cols-md="2" cols-lg="2">
      <b-col>
        <b-card :title="$t('configurator.selectedParameters')">
          <b-list-group>
            <b-list-group-item
              v-for="(choosenParameter, index) in choosenParameters"
              :key="index"
              href="javascript:void(0);"
              :variant="choosenParameter.errorValue ? 'danger' : currentParameterIndex === index && !choosenParameter.errorValue ? 'info' : ''"
              :active="currentParameterIndex === index && !choosenParameter.errorValue"
              @click="selectChoosenParameterValue(choosenParameter, index)"
            >
              <b-row>
                <b-col
                  ><strong>{{ choosenParameter.param.name }}</strong>
                </b-col>
                <b-col
                  ><div>{{ choosenParameter.valueLabel }}</div>
                  <div>{{ choosenParameter.addDescription }}</div>
                </b-col>
              </b-row>
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </b-col>
      <b-col>
        <b-card :title="currentParameter.name">
          <!-- parameter values panel -->
          <div v-if="valueViewMode === 'values'">
            <!-- if value type is string -->
            <b-row v-if="currentParameterType === 'string'">
              <b-col>
                <b-form>
                  <b-form-input v-model="currentManualValue" :label="$t('table.description')" horizontal @keyup.enter.prevent="selectParameterValue(currentManualValue, true)" />
                  <b-button class="mt-2 btn_success" variant="success" @click="selectParameterValue(currentManualValue, true)">
                    {{ $t('commands.add') }}
                  </b-button>
                </b-form>
              </b-col>
            </b-row>

            <!-- if value type is number -->
            <b-row v-if="currentParameterType === 'number'">
              <b-col>
                <b-form>
                  <b-form-input
                    v-model="currentManualValue"
                    type="number"
                    class="mb-2"
                    :state="inputPropertyState"
                    autofocus
                    :min="1"
                    :disabled="currentParameterValues.length > 0"
                    :formatter="onManualNumberValueFormat"
                    @keydown.enter.prevent="selectParameterValue(currentManualValue, true)"
                  />
                  <p v-if="currentParameter.minValue !== '' || currentParameter.maxValue !== ''" class="min-max-descr">{{ getMinMaxDescription(currentParameter) }} </p>
                  <b-button v-if="currentParameterValues.length === 0" class="btn_success" variant="success" @click="selectParameterValue(currentManualValue, true)">
                    {{ $t('commands.add') }}
                  </b-button>
                </b-form>
              </b-col>
            </b-row>

            <!-- if value type is dictionary -->
            <b-row v-if="currentParameterType === 'dictionary' || (currentParameterType === 'number' && currentParameterValues.length > 0)">
              <b-col>
                <b-row
                  ><b-col md="3">
                    <b-form>
                      <b-input-group>
                        <b-input-group-prepend class="search-group" is-text>
                          <i class="ri-search-line" aria-hidden="true"></i>
                        </b-input-group-prepend>
                        <b-form-input
                          id="search-id"
                          v-model="searchId"
                          ref="searchById"
                          :placeholder="$t('configurator.byNumber')"
                          type="text"
                          :autofocus="valueIndex < 0"
                          @update="filterParameterValuesById"
                          @keydown.enter.prevent="selectFilteredValue"
                        ></b-form-input>
                      </b-input-group>
                    </b-form> </b-col
                  ><b-col class="pl-0">
                    <b-form>
                      <b-input-group>
                        <b-input-group-prepend class="search-group" is-text>
                          <i class="ri-search-line" aria-hidden="true"></i>
                        </b-input-group-prepend>
                        <b-form-input
                          id="search-values"
                          v-model="searchValue"
                          :placeholder="$t('configurator.byName')"
                          @update="filterParameterValuesByName"
                          @keydown.enter.prevent="selectFilteredValue"
                        />
                      </b-input-group>
                    </b-form> </b-col
                ></b-row>
                <b-row class="mt-2">
                  <b-col>
                    <b-table
                      ref="valuesTable"
                      hover
                      :items="filteredParameterValues"
                      :fields="valueFields"
                      selectable
                      sticky-header="500px"
                      select-mode="single"
                      selected-variant="info"
                      :tbody-tr-class="valueRowClass"
                      fixed
                      small
                      @row-dblclicked="onValueRowDblClicked"
                      @row-clicked="onValueRowClicked"
                      @row-selected="onValueRowSelected"
                    >
                      <template v-slot:table-colgroup="scope">
                        <col v-for="field in scope.fields" :key="field.key" :style="{ width: setValueColumnWidth(field.key) }" />
                      </template>
                      <template v-slot:cell(name)="data">
                        <span>{{ data.item.name }}</span>
                        <div v-if="data.item.descr.length > 0">{{ data.item.descr }}</div>
                      </template>
                      <template v-slot:cell(props)="data">
                        <span v-if="data.item.properties && data.item.properties.length > 0">
                          <b-button size="sm" variant="outline-info" @click="showValueProperties(data.item)">
                            <i class="ri-menu-line"></i>
                          </b-button>
                        </span>
                      </template>
                    </b-table>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </div>

          <!-- value properties panel -->
          <div v-if="valueViewMode === 'properties_edit' || valueViewMode === 'properties_show'">
            <b-row>
              <b-col>
                <h5>{{ editParameterValue.name }}</h5>
              </b-col></b-row
            >
            <b-row>
              <b-col>
                <b-list-group>
                  <div v-for="(el, index) in editParameterValue.properties" :key="index">
                    <b-list-group-item
                      v-if="!el.hidden"
                      :class="el.property.confirmed ? 'bg-warning' : ''"
                      :disabled="!el.property.confirmed && !el.property.fillingRequires"
                      href="javascript:void(0);"
                    >
                      <b-row>
                        <b-col>
                          {{ el.property.name }}
                        </b-col>
                        <b-col v-if="el.property.dataType === 'dictionary'">
                          <b-form-select
                            v-model="el.propValueUuid"
                            :disabled="!el.property.confirmed && !el.property.fillingRequires"
                            size="sm"
                            text-field="name"
                            value-field="uuid"
                            :options="el.property.values"
                            class="select-prop"
                            @change="onChangePropertyValue(el)"
                          >
                          </b-form-select>
                        </b-col>
                        <b-col v-else-if="el.property.dataType === 'boolean'">
                          <b-form-checkbox id="check-prop" v-model="el.propValue" class="check-prop" :disabled="!el.property.confirmed"> </b-form-checkbox>
                        </b-col>
                        <b-col v-else>
                          <b-form-input
                            id="input-prop"
                            v-model="el.propValue"
                            size="sm"
                            :type="el.property.dataType === 'number' ? 'number' : 'text'"
                            :disabled="!el.property.confirmed && !el.property.fillingRequires"
                            :state="!(el.property.fillingRequires && el.propValue === '')"
                            class="'input-prop'"
                          ></b-form-input>
                        </b-col>
                      </b-row>
                    </b-list-group-item>
                  </div>
                </b-list-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form>
                  <b-button ref="valuePropertiesConfirm" class="mt-2 btn_success" variant="success" autofocus @click="confirmValueProperties">
                    <i class="ri-check-fill"></i>
                    {{ $t('commands.ok') }}
                  </b-button>
                </b-form>
              </b-col>
            </b-row>
          </div>
          <!-- </b-card-body> -->

          <!-- modal message -->
          <b-modal id="danger-message" hide-footer :title="$t('common.modalTitle')">
            <p class="my-4">{{ $t('common.incorrectData') }}</p>
          </b-modal>

          <!-- load card -->
          <b-card-body v-if="valueViewMode === 'values_loading'">
            <b-row class="b-spin">
              <b-col>
                <b-spinner variant="info" />
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import _ from 'lodash'

export default {
  name: 'ProductConfigurator',

  props: {
    viewId: {
      type: String,
      default: null,
    },
    externalUser: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      valueViewMode: 'values',
      valueFields: [
        { key: 'sortNumber', label: this.$t('table.sortNumber') },
        { key: 'name', label: `${this.$t('table.name')} / ${this.$t('table.description')}` },
        { key: 'props', label: '' },
      ],
      newParametrization: true,
      parameters: [],
      availableParameterValues: [],
      currentParameter: '',
      currentParameterValues: [],
      filteredParameterValues: [],
      currentParameterIndex: 0,
      currentParameterType: '',
      choosenParameterValue: '',
      editParameterValue: '',
      currentManualValue: '',
      showParameterPropertyValues: false,
      endOfParametrization: false,
      searchValue: '',
      valueIndex: -1,
      searchId: '',
      previousProduct: null,
      productParamsSettings: [],
      recalcParamsState: false,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'orders/objectView',
      products: 'products/configProductList',
      expressionVariables: 'parameters/expressionVariables',
      currentLanguage: 'auth/currentLanguage',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    orderData() {
      return this.objectView.object
    },

    customerData() {
      return this.objectView.customerData
    },

    productData() {
      return this.objectView.currentProduct
    },

    choosenParameters() {
      return this.objectView.currentProduct.choosenParameters
    },

    choosenParametersLength() {
      return this.objectView.currentProduct.choosenParameters.length
    },

    reference: {
      get() {
        return this.productData.reference
      },
      set(value) {
        this.setProductProperty({ viewId: this.viewId, property: 'reference', value: value })
      },
    },
    quantity: {
      get() {
        return this.productData.quantity
      },
      set(value) {
        this.setProductProperty({ viewId: this.viewId, property: 'quantity', value: value })
      },
    },

    inputPropertyState() {
      if (this.currentParameter.minValue !== '') {
        if (Number(this.currentParameter.minValue) > 0 && Number(this.currentParameter.minValue) > Number(this.currentManualValue)) {
          return false
        }
      }
      if (this.currentParameter.maxValue !== '') {
        if (Number(this.currentParameter.maxValue) > 0 && Number(this.currentParameter.maxValue) < Number(this.currentManualValue)) {
          return false
        }
      }

      if (this.currentManualValue < 1) {
        return false
      }

      return true
    },
  },

  async mounted() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      setObjectViewProperties: 'orders/setObjectViewProperties',
      setProductProperty: 'orders/setProductProperty',
      setChoosenParameter: 'orders/setChoosenParameter',
      setChoosenParameters: 'orders/setChoosenParameters',
      deleteChoosenParameters: 'orders/deleteChoosenParameters',
      setChoosenParameterProperty: 'orders/setChoosenParameterProperty',
      setChoosenParameterParamProperty: 'orders/setChoosenParameterParamProperty',
    }),

    async initialize() {
      if (this.choosenParametersLength > 0) {
        this.newParametrization = false

        if (this.products.length === 0) {
          await this.$store.dispatch('products/getConfigProducts', { lang: this.currentLanguage.code })
        }
      }

      await this.$store.dispatch('parameters/getExpressionVariables', {
        productId: this.productData.product.id,
      })

      await this.getProductParameters()

      this.initProductParamsSettings()

      await this.getPreviousProductParameters()
      if (this.newParametrization === true) {
        await this.fillFirstParameterValues()
      } else {
        await this.udateCurrentParametrizationData()
      }
    },

    async initProductParamsSettings() {
      if (this.externalUser === true) {
        await this.$store
          .dispatch('parameters/getProductParamsSettings', {
            params: {
              filter: { customerId: this.orderData.customerId, productId: this.productData.product.id, hidden: true },
            },
          })
          .then((response) => {
            if (response.status === 200) {
              this.productParamsSettings = response.data
            }
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },

    valueRowClass(item, type) {
      if (!item || type !== 'row') return

      let rowClass = ''

      if (item.default === true) rowClass = 'table-success'
      if (item.prev === true) rowClass += ' font-weight-bold'

      return rowClass
    },

    endParametrization() {
      if (this.quantity < 1) {
        return
      }

      const lastParam = this.choosenParameters[this.choosenParameters.length - 1]

      if (lastParam) {
        if (!lastParam.paramValue) {
          this.setProductProperty({ viewId: this.viewId, property: 'incompliteParams', value: true })
        } else {
          this.setProductProperty({ viewId: this.viewId, property: 'incompliteParams', value: false })
        }
      }

      this.$store.dispatch('orders/updateProductDescription', { viewId: this.viewId })

      this.cleanInitialData()

      this.setObjectViewProperties({
        viewId: this.viewId,
        props: { initCalcPrices: true, viewMode: 'calculate_prices' },
      })
    },

    cancelParametrization() {
      this.cleanInitialData()
      this.setObjectViewProperties({
        viewId: this.viewId,
        props: { currentProduct: null, viewMode: 'order_modification' },
      })
    },

    cleanInitialData() {
      this.parameters = []
      this.availableParameterValues = []
      this.currentParameterValues = []
      this.filteredParameterValues = []
      this.currentParameter = ''
      this.currentParameterType = ''
      this.choosenParameterValue = ''
      this.editParameterValue = ''
      this.currentManualValue = ''
      this.showParameterPropertyValues = false
      this.endOfParametrization = false
    },

    async getPreviousProductParameters() {
      if (this.orderData && this.orderData.products && this.productData) {
        this.previousProduct = this.orderData.products.find((el) => {
          return el.product.id === this.productData.product.id
        })
      }
    },

    initPreviousProductValue() {
      if (this.previousProduct) {
        if (this.currentParameter && this.currentParameter.dataType === 'dictionary') {
          const prevValue = this.previousProduct.choosenParameters.find((el) => {
            return el.param.id === this.currentParameter.id
          })

          if (prevValue && prevValue.paramValue) {
            const prevValueId = prevValue.paramValue.id

            const currIndex = this.currentParameterValues.findIndex((el) => el.id === prevValueId)
            if (currIndex > -1) {
              this.currentParameterValues[currIndex].prev = true
            }
          }
        }
      }
    },

    setPreviousProductValue() {
      if (this.previousProduct) {
        if (this.currentParameter && this.currentParameter.dataType === 'dictionary') {
          const currValue = this.filteredParameterValues.find((el) => el.prev === true)
          if (currValue) {
            this.valueIndex = this.filteredParameterValues.indexOf(currValue)
            this.onRefreshValueTable()
          }
        }
      }
    },

    focusRow(rowIndex) {
      if (this.valueIndex > -1 && this.$refs.valuesTable) {
        this.$refs.searchById.$el.blur()
        const vTable = this.$refs.valuesTable.$el
        const tableBody = vTable.getElementsByTagName('tbody')[0]
        const tableRows = tableBody.getElementsByTagName('tr')

        if (tableRows[rowIndex]) {
          tableRows[rowIndex].focus()
        }
      }
    },

    async getProductParameters() {
      const queryParams = {
        productId: this.productData.product.id,
        lang: this.currentLanguage.code,
      }

      this.parameters = await this.$store.dispatch('parameters/getProductParameters', queryParams)
    },

    async fillFirstParameterValues() {
      this.availableParameterValues = []
      this.currentParameterValues = []
      this.filteredParameterValues = []

      if (this.parameters) {
        this.currentParameter = this.parameters[0]
        this.currentParameterType = this.currentParameter.dataType

        const choosenParameter = {
          param: this.currentParameter,
          paramValue: undefined,
          valueLabel: '',
          errorValue: false,
        }
        this.addChoosenParameter(choosenParameter)

        const parameterFilter = {
          paramId: this.currentParameter.id,
          productId: this.productData.product.id,
          lang: this.currentLanguage.code,
          customerId: this.orderData.customerId,
          hasDepended: this.currentParameter.hasDepended,
          hasExpression: this.currentParameter.hasExpression,
        }
        if (this.currentParameter.dataType === 'dictionary') {
          const parameterValues = await this.$store.dispatch('parameters/getParameterValues', parameterFilter)

          this.choosenParameterValue = ''

          if (parameterValues) {
            let sortNumber = 1
            parameterValues.forEach((el) => {
              if (el.state !== -1 && el.hidden !== true) {
                const hiddenEl = this.productParamsSettings.find((settingEl) => {
                  return settingEl.parameterId === this.currentParameter.id && settingEl.parameterValueId === el.id && settingEl.parameterPropertyId === null
                })

                if (!hiddenEl) {
                  this.currentParameterValues.push({
                    sortNumber: el.strNumber ? el.strNumber : sortNumber,
                    paramId: this.currentParameter.id,
                    id: el.id,
                    uuid: el.uuid,
                    name: el.name,
                    descr: el.descr,
                    nextParamUuid: el.nextParamUuid,
                    state: el.state,
                    hidden: el.hidden,
                    default: false,
                    prev: false,
                    properties: el.properties,
                  })

                  if (!el.strNumber) {
                    sortNumber++
                  }
                }
              }
            })

            this.initPreviousProductValue()
            this.filterParameterValues()

            this.$nextTick(() => {
              this.setPreviousProductValue()
            })

            this.availableParameterValues.push(...this.currentParameterValues)
          }
        }
      }
    },

    setValueColumnWidth(key) {
      if (key === 'sortNumber') {
        return '8%'
      } else if (key === 'props') {
        return '12%'
      } else {
        return '80%'
      }
    },

    onValueRowSelected(items) {
      this.onRefreshValueTable()
    },

    onValueRowClicked(item, index, event) {
      if (event.type === 'keydown' && event.key === 'Enter') {
        this.valueIndex = index
        this.selectParameterValue(item, false)
      }
    },

    onValueRowDblClicked(item, index, event) {
      this.valueIndex = index
      this.selectParameterValue(item, false)
    },

    onRefreshValueTable() {
      if (this.$refs.valuesTable) {
        this.$refs.valuesTable.clearSelected()
        if (this.choosenParameterValue !== undefined && this.valueIndex > -1) {
          this.$refs.valuesTable.selectRow(this.valueIndex)
          this.focusRow(this.valueIndex)
        }
      }
    },

    addChoosenParameter(choosenParameter) {
      this.setChoosenParameter({ viewId: this.viewId, choosenParameter })
    },

    getParameterValueColor(parameterValue) {
      let color = ''

      if (parameterValue.state === 2) {
        color = 'bg-dark'
      } else if (parameterValue.default) {
        color = 'bg-default'
      }

      return color
    },

    onChangePropertyValue(valueProperty) {
      const propertyValue = valueProperty.property.values.find((el) => el.uuid === valueProperty.propValueUuid)

      if (propertyValue !== undefined) {
        valueProperty.propValue = propertyValue.name
      }
    },

    async filterParameterValues() {
      if (this.searchValue !== '') {
        this.filteredParameterValues = this.currentParameterValues.filter((el) => {
          return el.name.toUpperCase().includes(this.searchValue.toUpperCase()) || el.descr.toUpperCase().includes(this.searchValue.toUpperCase())
        })
      } else if (this.searchId !== '') {
        this.filteredParameterValues = this.currentParameterValues.filter((el) => {
          // eslint-disable-next-line
          return this.searchId === el.sortNumber
        })
      } else {
        this.filteredParameterValues = this.currentParameterValues
      }

      if (this.choosenParameterValue !== undefined) {
        const currValue = this.filteredParameterValues.find((el) => el.id === this.choosenParameterValue.id)
        if (currValue) {
          this.valueIndex = this.filteredParameterValues.indexOf(currValue)
        } else {
          this.valueIndex = -1
        }
      }
    },

    filterParameterValuesById() {
      this.searchValue = ''
      this.filterParameterValues()
    },

    filterParameterValuesByName() {
      this.searchId = ''
      this.filterParameterValues()
    },

    selectFilteredValue() {
      if (this.filteredParameterValues.length === 1) {
        this.selectParameterValue(this.filteredParameterValues[0], false)
      }
    },

    async confirmValueProperties() {
      if (this.valueViewMode === 'properties_edit') {
        const hasRequared = await this.checkRequared()
        if (hasRequared) {
          this.$bvModal.show('danger-message')
          return
        }

        this.valueViewMode = 'values'
        this.selectParameterValue(this.choosenParameterValue, false, true)
      } else {
        this.valueViewMode = 'values'
      }

      this.editParameterValue = ''
    },

    async selectParameterValue(currentValue, manual, confirmed = false) {
      if (!manual && currentValue.state === 2) {
        return
      }

      if (manual && !this.inputPropertyState) {
        this.$bvModal.show('danger-message')
        return
      }

      this.searchValue = ''
      this.searchId = ''
      if (!confirmed) {
        this.choosenParameterValue = currentValue

        const hasRequared = await this.checkRequared()

        if (this.currentParameter.hasConfirmed || hasRequared) {
          this.editParameterValue = this.choosenParameterValue

          if (this.externalUser === true) {
            for (const property of this.editParameterValue.properties) {
              const hiddenEl = this.productParamsSettings.find((settingEl) => {
                return settingEl.parameterPropertyId === property.propId && settingEl.propertyValueId === null
              })

              property.hidden = !!hiddenEl
            }
          } else {
            for (const property of this.editParameterValue.properties) {
              property.hidden = false
            }
          }

          this.valueViewMode = 'properties_edit'

          this.$nextTick(() => {
            this.$refs.valuePropertiesConfirm.focus()
          })

          return
        }
      }

      let addDescription = ''

      if (this.currentParameter.hasInformation || this.currentParameter.hasConfirmed || this.currentParameter.hasRequared) {
        for (const property of currentValue.properties) {
          if (property.property.information || property.property.confirmed || property.property.fillingRequires) {
            addDescription += (addDescription === '' ? '' : ', ') + property.property.name + ': ' + property.propValue
          }
        }
      }

      const choosenParameter = {
        param: this.currentParameter,
        paramValue: this.currentParameterType === 'number' && this.currentParameterValues.length > 0 ? Number(this.choosenParameterValue.name) : this.choosenParameterValue,
        valueLabel: manual ? this.choosenParameterValue : this.choosenParameterValue.name.replace(' ...', '').replace(' ....', ''),
        addDescription: addDescription,
        errorValue: false,
      }

      this.currentManualValue = ''

      this.addChoosenParameter(choosenParameter)

      if (this.currentParameterIndex < this.choosenParametersLength - 1) {
        this.recalculatePamametrization(choosenParameter)
      } else {
        this.fillNextParameter(choosenParameter)
      }
    },

    async checkRequared() {
      let hasRequared = false
      if (this.currentParameter.hasRequared) {
        for (const propertyData of this.choosenParameterValue.properties) {
          if (propertyData.property.fillingRequires && propertyData.propValue === '') {
            if (propertyData.property.fillFrom && propertyData.property.fillFrom !== '') {
              const collectedParameters = await this.getCollectParameters(this.choosenParameters)
              const propertyValue = collectedParameters[propertyData.property.fillFrom]

              if (propertyValue === undefined || propertyValue === '') {
                hasRequared = true
                break
              } else {
                propertyData.propValue = propertyValue
              }
            } else {
              hasRequared = true
              break
            }
          }
        }
      }

      return hasRequared
    },

    async recalcExpressions(notCalculated = false) {
      const collectedParameters = await this.getCollectParameters(this.choosenParameters)

      for (const parameterData of this.choosenParameters) {
        if (parameterData.param.uuid === this.currentParameter.uuid) {
          break
        }

        const choosenParameter = _.cloneDeep(parameterData)

        if (choosenParameter.paramValue !== undefined && Object.prototype.hasOwnProperty.call(choosenParameter.paramValue, 'properties')) {
          let changed = false
          for (const propertyValue of choosenParameter.paramValue.properties) {
            if (propertyValue.property.expression !== '') {
              if (notCalculated && propertyValue.calculated) {
                continue
              }

              const calcValue = await this.calculateExpression(propertyValue.property.expression, collectedParameters)

              if (propertyValue.propValue !== calcValue.result) {
                propertyValue.propValue = calcValue.result
                propertyValue.calculated = calcValue.calculated
                changed = true
              }
            }
          }
          if (changed) {
            choosenParameter.addDescription = this.generateAddDescription(choosenParameter)
            this.addChoosenParameter(choosenParameter)
          }
        }
      }
    },

    generateAddDescription(choosenParameter) {
      let addDescription = ''
      for (const valueProp of choosenParameter.paramValue.properties) {
        if (valueProp.property.information || valueProp.property.confirmed) {
          addDescription += (addDescription === '' ? '' : ', ') + valueProp.property.name + ': ' + valueProp.propValue
        }
      }

      return addDescription
    },

    async recalculatePamametrization(choosenParameter) {
      this.recalcParamsState = true
      this.recalcExpressions()

      let prevChoosenParameter = choosenParameter

      for (let i = this.currentParameterIndex + 1; i < this.choosenParametersLength; i++) {
        this.currentParameterIndex = i

        const nextParamUuid = prevChoosenParameter.paramValue.nextParamUuid || prevChoosenParameter.param.nextParamUuid

        const currChoosenParameter = this.choosenParameters[i]
        this.choosenParameterValue = ''
        this.currentManualValue = ''

        if (currChoosenParameter.param.uuid !== nextParamUuid) {
          this.deleteChoosenParameters({
            viewId: this.viewId,
            index: i,
            count: this.choosenParametersLength - i,
          })
          this.fillNextParameter(prevChoosenParameter)
          break
        } else {
          this.currentParameter = this.choosenParameters[i].param
          this.currentParameterType = this.currentParameter.dataType

          if (this.currentParameterType === 'dictionary') {
            await this.recalcCurrentParameterValues()

            if (this.choosenParameters[i].paramValue) {
              this.choosenParameterValue = this.choosenParameters[i].paramValue

              const currentValue = this.currentParameterValues.find((el) => {
                return el.uuid === this.choosenParameterValue.uuid
              })

              if (currentValue === undefined) {
                this.setChoosenParameterProperty({
                  viewId: this.viewId,
                  index: this.currentParameterIndex,
                  property: 'errorValue',
                  value: true,
                })
                break
              }
            } else {
              if (this.currentParameterValues.length > 0) {
                const filteredValues = this.currentParameterValues.filter((vEl) => vEl.default)
                if (filteredValues.length === 0) {
                  this.$nextTick(() => {
                    this.setPreviousProductValue()
                  })
                } else if (filteredValues.length === 1) {
                  this.valueIndex = this.currentParameterValues.indexOf(filteredValues[0])
                  this.$nextTick(() => {
                    this.onRefreshValueTable()
                  })
                } else {
                  this.valueIndex = this.currentParameterValues.indexOf(filteredValues[0])
                  this.$nextTick(() => {
                    this.onRefreshValueTable()
                  })
                }
              }
            }
          } else {
            this.currentParameterValues = []
            this.filteredParameterValues = []
            this.currentManualValue = this.choosenParameters[i].paramValue

            const minMax = await this.calcMinMaxValues(this.currentParameter, this.choosenParameters)

            if (minMax) {
              if (minMax.minValue !== this.currentParameter.minValue) {
                this.setChoosenParameterParamProperty({
                  viewId: this.viewId,
                  index: this.currentParameterIndex,
                  property: 'minValue',
                  value: minMax.minValue,
                })
              }

              if (minMax.maxValue !== this.currentParameter.maxValue) {
                this.setChoosenParameterParamProperty({
                  viewId: this.viewId,
                  index: this.currentParameterIndex,
                  property: 'maxValue',
                  value: minMax.maxValue,
                })
              }
            }
          }

          prevChoosenParameter = currChoosenParameter
        }
      }
      this.recalcParamsState = false
    },

    async fillNextParameter(choosenParameter) {
      const nextParamUuid = choosenParameter.paramValue.nextParamUuid || choosenParameter.param.nextParamUuid

      this.recalcExpressions(true)

      if (nextParamUuid) {
        const foundIndex = this.parameters.findIndex((el) => el.uuid === nextParamUuid)

        if (foundIndex >= 0) {
          this.currentParameter = this.parameters[foundIndex]
          this.currentParameterType = this.currentParameter.dataType
          this.currentParameterIndex = this.choosenParametersLength

          const nextParameterId = this.currentParameter.id

          if (nextParameterId) {
            const sendParameters = []
            for (const cParamValue of this.choosenParameters) {
              const clValue = cParamValue.paramValue
              if (clValue) {
                if (clValue.uuid) {
                  const arrLength = sendParameters.push({
                    param: {
                      uuid: cParamValue.param.uuid,
                    },
                    paramValue: {
                      uuid: clValue.uuid,
                      name: clValue.name,
                      properties: [],
                    },
                  })

                  if (clValue.properties) {
                    clValue.properties.forEach((clValueProp) => {
                      sendParameters[arrLength - 1].paramValue.properties.push({
                        propUuid: clValueProp.property.uuid,
                        propDataType: clValueProp.property.dataType,
                        value: clValueProp.propValue,
                        valueUuid: clValueProp.propValueUuid,
                      })
                    })
                  }
                } else {
                  sendParameters.push({
                    param: {
                      uuid: cParamValue.param.uuid,
                    },
                    paramValue: clValue,
                  })
                }
              }
            }

            this.valueViewMode = 'values_loading'

            await this.$store
              .dispatch('parameters/getNextParameterValues', {
                customerId: this.orderData.customerId,
                productId: this.productData.product.id,
                lang: this.currentLanguage.code,
                nextParam: {
                  id: nextParameterId,
                  hasDepended: this.currentParameter.hasDepended,
                  hasExpression: this.currentParameter.hasExpression,
                },
                choosenParameters: sendParameters,
              })
              .then(async (responceData) => {
                const nextParameterValues = responceData.values

                if (this.currentParameterType === 'number' && nextParameterValues.length === 0) {
                  const minMax = await this.calcMinMaxValues(this.currentParameter, this.choosenParameters)

                  if (minMax) {
                    this.currentParameter.minValue = minMax.minValue
                    this.currentParameter.maxValue = minMax.maxValue
                  }
                }

                this.valueViewMode = 'values'
                this.choosenParameterValue = ''

                const choosenParameter = {
                  param: this.currentParameter,
                  paramValue: undefined,
                  valueLabel: '',
                  valueError: false,
                }
                this.addChoosenParameter(choosenParameter)

                if (nextParameterValues) {
                  this.currentParameterValues = []
                  this.filteredParameterValues = []

                  let sortNumber = 1
                  nextParameterValues.forEach((el) => {
                    if (el.state !== -1 && el.hidden !== true) {
                      const hiddenEl = this.productParamsSettings.find((settingEl) => {
                        return settingEl.parameterId === this.currentParameter.id && settingEl.parameterValueId === el.id && settingEl.parameterPropertyId === null
                      })

                      if (!hiddenEl) {
                        this.currentParameterValues.push({
                          sortNumber: el.strNumber ? el.strNumber : sortNumber,
                          paramId: nextParameterId,
                          id: el.id,
                          name: el.name,
                          uuid: el.uuid,
                          descr: el.descr,
                          nextParamUuid: el.nextParamUuid,
                          state: el.state,
                          hidden: el.hidden,
                          default: el.default,
                          prev: false,
                          properties: el.properties,
                        })

                        if (!el.strNumber) {
                          sortNumber++
                        }
                      }
                    }
                  })

                  this.initPreviousProductValue()

                  await this.filterParameterValues()
                  this.availableParameterValues.push(...this.currentParameterValues)

                  if (this.currentParameterValues.length === 1) {
                    await this.selectParameterValue(this.currentParameterValues[0])
                  } else {
                    const filteredValues = this.currentParameterValues.filter((vEl) => vEl.default)
                    if (filteredValues.length === 0) {
                      this.$nextTick(() => {
                        this.setPreviousProductValue()
                      })
                    } else if (filteredValues.length === 1) {
                      if (this.currentParameter.confirmDefault !== true) {
                        await this.selectParameterValue(filteredValues[0])
                      } else {
                        this.valueIndex = this.currentParameterValues.indexOf(filteredValues[0])
                        this.$nextTick(() => {
                          this.onRefreshValueTable()
                        })
                      }
                    } else {
                      this.valueIndex = this.currentParameterValues.indexOf(filteredValues[0])
                      this.$nextTick(() => {
                        this.onRefreshValueTable()
                      })
                    }
                  }
                }
              })
            // }
          }
        } else {
          this.filterParameterValues()
        }
      } else {
        this.filterParameterValues()
      }
    },

    showValueProperties(currentValue) {
      this.editParameterValue = currentValue

      if (this.externalUser === true) {
        for (const property of this.editParameterValue.properties) {
          const hiddenEl = this.productParamsSettings.find((settingEl) => {
            return settingEl.parameterPropertyId === property.propId && settingEl.propertyValueId === null
          })

          property.hidden = !!hiddenEl
        }
      } else {
        for (const property of this.editParameterValue.properties) {
          property.hidden = false
        }
      }

      if (this.editParameterValue === this.choosenParameterValue) {
        this.valueViewMode = 'properties_edit'
      } else {
        this.valueViewMode = 'properties_show'
      }
    },

    async selectChoosenParameterValue(choosenParameter, index) {
      if (this.valueViewMode === 'properties_edit' || this.recalcParamsState === true) {
        return
      }

      this.valueViewMode = 'values'
      this.currentParameter = choosenParameter.param
      this.currentParameterIndex = index
      this.currentParameterType = this.currentParameter.dataType
      this.choosenParameterValue = ''
      this.currentManualValue = ''

      if (this.currentParameterType !== 'dictionary') {
        this.currentManualValue = choosenParameter.paramValue
      } else {
        this.choosenParameterValue = _.cloneDeep(choosenParameter.paramValue)
        const index = this.availableParameterValues.indexOf(choosenParameter.paramValue)

        if (index !== -1) {
          this.availableParameterValues[index] = this.choosenParameterValue
        }
      }

      this.currentParameterValues = this.availableParameterValues.filter((el) => el.paramId === this.currentParameter.id)

      this.filterParameterValues()

      if (!this.newParametrization && this.currentParameterValues.length === 0) {
        await this.recalcCurrentParameterValues()
      }

      this.$nextTick(() => {
        this.onRefreshValueTable()
      })
    },

    async calcMinMaxValues(currentParameter, choosenParameters) {
      if (currentParameter.minValue !== '' || currentParameter.maxValue !== '') {
        const collectParameters = await this.getCollectParameters(choosenParameters)

        const result = { minValue: 0, maxValue: 0 }

        const sourceParam = this.parameters.find((el) => el.id === currentParameter.id)

        const sourceMinValue = sourceParam ? sourceParam.minValue : currentParameter.minValue
        const sourceMaxValue = sourceParam ? sourceParam.maxValue : currentParameter.maxValue

        if (typeof sourceMinValue === 'number') {
          result.minValue = sourceMinValue
        } else {
          const minValue = await this.calculateExpression(sourceMinValue, collectParameters)

          result.minValue = minValue.result
        }

        if (typeof sourceMaxValue === 'number') {
          result.maxValue = sourceMaxValue
        } else {
          const maxValue = await this.calculateExpression(sourceMaxValue, collectParameters)

          result.maxValue = maxValue.result
        }

        return result
      } else {
        return undefined
      }
    },

    async recalcCurrentParameterValues() {
      if (this.currentParameterType === 'dictionary') {
        const sendParameters = []

        for (const curParamValue of this.choosenParameters) {
          const clValue = curParamValue.paramValue
          if (clValue) {
            if (clValue.uuid) {
              const arrLength = sendParameters.push({
                param: {
                  uuid: curParamValue.param.uuid,
                },
                paramValue: {
                  uuid: clValue.uuid,
                  name: clValue.name,
                  properties: [],
                },
              })

              if (clValue.properties) {
                clValue.properties.forEach((clValueProp) => {
                  sendParameters[arrLength - 1].paramValue.properties.push({
                    propUuid: clValueProp.property.uuid,
                    propDataType: clValueProp.property.dataType,
                    value: clValueProp.propValue,
                    valueUuid: clValueProp.propValueUuid,
                  })
                })
              }
            } else {
              sendParameters.push({
                param: {
                  uuid: curParamValue.param.uuid,
                },
                paramValue: clValue,
              })
            }
          }
        }

        this.valueViewMode = 'values_loading'

        await this.$store
          .dispatch('parameters/getNextParameterValues', {
            customerId: this.orderData.customerId,
            productId: this.productData.product.id,
            lang: this.currentLanguage.code,
            nextParam: {
              id: this.currentParameter.id,
              hasDepended: this.currentParameter.hasDepended,
              hasExpression: this.currentParameter.hasExpression,
            },
            choosenParameters: sendParameters,
          })
          .then(async (responceData) => {
            this.valueViewMode = 'values'

            if (responceData) {
              this.currentParameterValues = []
              this.filteredParameterValues = []

              let sortNumber = 1
              responceData.values.forEach((el) => {
                if (el.state !== -1 && el.hidden !== true) {
                  const hiddenEl = this.productParamsSettings.find((settingEl) => {
                    return settingEl.parameterId === this.currentParameter.id && settingEl.parameterValueId === el.id && settingEl.parameterPropertyId === null
                  })

                  if (!hiddenEl) {
                    this.currentParameterValues.push({
                      sortNumber: el.strNumber ? el.strNumber : sortNumber,
                      paramId: this.currentParameter.id,
                      id: el.id,
                      name: el.name,
                      uuid: el.uuid,
                      descr: el.descr,
                      nextParamUuid: el.nextParamUuid,
                      state: el.state,
                      hidden: el.hidden,
                      default: el.default,
                      prev: false,
                      properties: el.properties,
                    })

                    if (!el.strNumber) {
                      sortNumber++
                    }
                  }
                }
              })

              this.initPreviousProductValue()

              this.filterParameterValues()

              this.availableParameterValues = this.availableParameterValues.filter((el) => {
                return el.paramId !== this.currentParameter.id
              })
              this.availableParameterValues.push(...this.currentParameterValues)
            }
          })
      }
    },

    async getCollectParameters(choosenParameters) {
      const collectParameters = {}

      choosenParameters.forEach((el) => {
        if (el.paramValue === undefined) {
          return
        }

        if (Object.prototype.hasOwnProperty.call(el.paramValue, 'uuid')) {
          collectParameters[el.param.uuid] = el.paramValue.uuid
          collectParameters[el.param.uuid + '.name'] = String(el.paramValue.name)

          if (Object.prototype.hasOwnProperty.call(el.paramValue, 'properties')) {
            el.paramValue.properties.forEach((elValue) => {
              if (elValue.property.dataType === 'dictionary') {
                collectParameters[elValue.property.uuid] = elValue.propValueUuid
                collectParameters[elValue.property.uuid + '.name'] = String(elValue.propValue)
              } else {
                collectParameters[elValue.property.uuid] = String(elValue.propValue)
              }
            })
          }
        } else {
          collectParameters[el.param.uuid] = el.paramValue
        }
      })

      collectParameters['client'] = this.customerData.uuid
      collectParameters['client.country'] = this.customerData.country ? this.customerData.country.id : ''
      collectParameters['client.packingMaterialType'] = this.customerData.packageMaterial

      return collectParameters
    },

    getMinMaxDescription(currentParameter) {
      let minMaxDescription = ''

      if (!currentParameter.minValue) {
        minMaxDescription = `${this.capitalize(this.$t('common.to'))} ${currentParameter.maxValue}`
      } else if (!currentParameter.maxValue) {
        minMaxDescription = `${this.capitalize(this.$t('common.from'))} ${currentParameter.minValue}`
      } else {
        minMaxDescription = `${this.capitalize(this.$t('common.from'))} ${currentParameter.minValue} ${this.$t('common.to')} ${currentParameter.maxValue}`
      }

      return minMaxDescription
    },

    async calculateExpression(expression, collectParameters) {
      let curExpression = expression
      let calculated = false
      let result = 0

      for (const key in collectParameters) {
        const parValue = collectParameters[key]
        if (parValue.length === undefined) {
          console.warn('key', key, 'value', collectParameters[key])
        }

        const regExp = new RegExp('#' + key + '#', 'g')

        if (parValue.length === 36) {
          curExpression = curExpression.replace(regExp, '"' + parValue + '"')
        } else {
          curExpression = curExpression.replace(regExp, parValue)
        }
      }

      for (const variable of this.expressionVariables) {
        if (curExpression.includes('$' + variable.name + '$')) {
          const variableValue = variable.value

          if (Array.isArray(variableValue)) {
            console.warn('isArray', variableValue, ' for param ', variable.name)
          } else {
            // curExpression = curExpression.replace('= $' + variable.name + '$', '=== ' + variable.value)
            curExpression = curExpression.replace('$' + variable.name + '$', variable.value)
          }
        }
      }

      const regExpToFixed = new RegExp('\\)\\.toFixed\\(\\)')
      if (curExpression.search(regExpToFixed) !== -1) {
        const stringExtractor = this.extractSubstring(['Number(', ').toFixed()'])
        const expressionParts = stringExtractor(curExpression)

        for (const expressionPart of expressionParts) {
          if (expressionPart !== '') {
            const partValue = 0
            try {
              // eslint-disable-next-line
              partValue = eval(expressionPart)
            } catch (error) {
              return { result: 0, calculated: false }
            }

            curExpression = curExpression.replace(expressionPart, String(partValue))
          }
        }
      }

      try {
        // eslint-disable-next-line
        result = Number(eval(curExpression))
        calculated = true
        return { result, calculated }
      } catch (error) {
        const regExp = /#[0-9a-f-]{36}#/g

        if (regExp.test(curExpression)) {
          curExpression = curExpression.replace(regExp, 0)

          try {
            // eslint-disable-next-line
            result = Number(eval(curExpression))
            return { result: result, calculated: false }
          } catch {
            console.error('err after repl', curExpression)
            return { result: 0, calculated: false }
          }
        } else {
          console.error('not exp', curExpression)
          return { result: 0, calculated: false }
        }
      }
    },

    extractSubstring([beg, end]) {
      const matcher = new RegExp(`${beg}(.*?)${end}`, 'gm')
      const normalise = (str) => str.slice(beg.length, (end.length - 2) * -1)
      return function (str) {
        return str.match(matcher).map(normalise)
      }
    },

    capitalize(s) {
      return s[0].toUpperCase() + s.slice(1)
    },

    onManualNumberValueFormat(value) {
      if (value > 9999999) {
        return Number(value.toString().slice(0, 7))
      }

      return value
    },

    async udateCurrentParametrizationData() {
      if (this.choosenParameters[0].param.uuid) {
        return
      }

      const choosenParameters = _.cloneDeep(this.choosenParameters)

      const valuesId = []
      for (const choosenParameter of choosenParameters) {
        const productParam = this.parameters.find((el) => el.id === choosenParameter.param.id)

        if (productParam) {
          choosenParameter.param = productParam
        } else {
          choosenParameter.param = {
            name: this.$t('common.noFound'),
            id: choosenParameter.param.id,
          }
        }

        if (choosenParameter.paramValue !== undefined) {
          valuesId.push(choosenParameter.paramValue.id)
        }
      }

      const updatedValues = await this.$store.dispatch('parameters/getSelectedValues', {
        valuesId,
        lang: this.currentLanguage.code,
      })

      if (updatedValues) {
        for (const choosenParameter of choosenParameters) {
          if (choosenParameter.paramValue === undefined) {
            continue
          }

          if (!Object.prototype.hasOwnProperty.call(choosenParameter.paramValue, 'id')) {
            continue
          }

          const paramValue = updatedValues.find((el) => el.id === choosenParameter.paramValue.id)

          if (paramValue) {
            for (const propertyValue of paramValue.properties) {
              const choosenValueProperty = choosenParameter.paramValue.properties.find((el) => el.id === propertyValue.id)

              if (choosenValueProperty) {
                propertyValue.propValue = choosenValueProperty.propValue
                propertyValue.propValueUuid = choosenValueProperty.propValueUuid

                if (choosenValueProperty.calculated) {
                  propertyValue.calculated = choosenValueProperty.calculated
                }
              }
            }

            choosenParameter.paramValue = paramValue
          }
        }
      }

      for (const choosenParameter of choosenParameters) {
        if (choosenParameter.param.dataType === 'number') {
          const minMax = await this.calcMinMaxValues(choosenParameter.param, choosenParameters)

          if (minMax) {
            choosenParameter.param.minValue = minMax.minValue
            choosenParameter.param.maxValue = minMax.maxValue
          }
        }
      }

      this.setChoosenParameters({ viewId: this.viewId, choosenParameters })

      this.currentParameter = this.choosenParameters[0].param
      this.currentParameterType = this.currentParameter.dataType

      if (this.currentParameterType === 'dictionary') {
        this.choosenParameterValue = this.choosenParameters[0].paramValue
      } else {
        this.currentManualValue = this.choosenParameters[0].paramValue
      }

      await this.recalcCurrentParameterValues()
    },
  },
}
</script>

<style>
.select-prop {
  margin-bottom: 0rem;
}

.b-spin {
  text-align: center;
}

.min-max-descr {
  color: cornflowerblue;
}

.search-group .input-group-text {
  padding: 0 0.3rem;
}

.bg-default {
  background-color: lightblue;
}

.bg-default:hover {
  background-color: lightblue;
}

.table-success .btn-outline-info {
  color: #fff;
  border-color: #fff;
}
</style>
