<template>
  <Layout>
    <PageHeader :title="title" />
    <div>
      <b-card v-if="viewMode === 'order_modification'">
        <b-row>
          <b-col>
            <b-button-toolbar>
              <b-btn-group>
                <b-button class="btn-success" size="sm" :disabled="lockObject || readOnly" @click="writeAndCloseOrder">
                  <i class="ri-save-2-fill-move"></i>
                  {{ $t('commands.writeAndClose') }}
                </b-button>
                <b-button variant="outline-secondary" class="ml-1" size="sm" :disabled="lockObject || readOnly" @click="writeOrder(false)">
                  <i class="ri-save-2-fill"></i>
                  {{ $t('commands.write') }}
                </b-button>
                <b-button variant="outline-secondary" class="ml-1" size="sm" @click="closeOrder">
                  <i class="ri-close-line"></i>
                  {{ $t('commands.close') }}
                </b-button>
                <b-button v-if="!externalUser" v-b-toggle.sidebar-note variant="outline-secondary" class="btn-sm ml-4">
                  <i class="ri-file-text-line"></i>
                </b-button>
                <b-button variant="outline-secondary" class="btn-sm ml-1" @click="openItemSubordination">
                  <i class="ri-node-tree"></i>
                </b-button>
                <b-button v-if="object.id" variant="outline-secondary" class="btn-sm ml-1" @click="openOrderHistory">
                  <i class="ri-history-line"></i>
                </b-button>
                <b-button variant="outline-secondary" class="btn-sm ml-1" @click="createTask">
                  <i class="ri-add-line"></i>
                  {{ $t('order.createTask') }}
                </b-button>
              </b-btn-group>
            </b-button-toolbar>
            <b-sidebar id="sidebar-note" :title="$t('table.note')" width="30%" right shadow>
              <div class="px-3 py-2">
                <b-form-textarea
                  id="note-text"
                  v-model="customerData.note"
                  plaintext
                  disabled
                  max-rows="40"
                  :placeholder="$t('common.emptyField')"
                  style="overflow-y: auto"
                  no-resize
                ></b-form-textarea>
              </div>
            </b-sidebar>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col>
            <b-tabs v-model="tabIndex" content-class="mt-2">
              <b-tab :title="$t('common.mainData')" active @click="updateTabIndex(0)">
                <b-row>
                  <b-col md="6">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.status')" label-for="status">
                      <b-input-group>
                        <b-form-select
                          id="order_status"
                          v-model="status"
                          :options="statusList"
                          text-field="name"
                          value-field="id"
                          name="status"
                          :disabled="lockObject"
                          :state="statusState"
                          size="sm"
                          aria-describedby="statusFeedback"
                        />
                        <b-input-group-append>
                          <b-form-checkbox class="ml-3 mt-1" v-model="offer" switch>
                            {{ $t('table.offer') }}
                          </b-form-checkbox>
                        </b-input-group-append>
                      </b-input-group>

                      <b-form-invalid-feedback id="statusFeedback">
                        <!-- This will only be shown if the preceeding input has an invalid state -->
                        {{ $t('common.notEmptyField') }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>

                  <b-col md="6">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.reference')" label-for="reference">
                      <b-form-input
                        id="reference"
                        v-model="reference"
                        type="text"
                        name="reference"
                        :state="referenceState && !referenceDouble"
                        :placeholder="$t('order.enterReference')"
                        aria-describedby="referenceFeedback"
                        size="sm"
                        @blur="checkReference"
                      ></b-form-input>

                      <b-form-invalid-feedback id="referenceFeedback">
                        <!-- This will only be shown if the preceeding input has an invalid state -->
                        <a href="javascript:void(0);" @click="showDoubles"> {{ referenceErrorMessage }} </a>
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="6">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.customer')" label-for="customer">
                      <f-select
                        v-model="customer"
                        select-btn
                        open-btn
                        required
                        value-type="counterparties"
                        detail-view="counterparties-detail"
                        label="presentation"
                        placeholder="Wyszukaj klienta..."
                      ></f-select>
                    </b-form-group>
                  </b-col>

                  <b-col md="6">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.paymentTerms')" label-for="terms-of-payment">
                      <b-form-select
                        id="terms-of-payment"
                        v-model="termOfPayment"
                        :options="termOfPaymentList"
                        text-field="name"
                        value-field="id"
                        name="terms-of-payment"
                        :disabled="externalUser"
                        size="sm"
                      />
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="6">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.project')" label-for="project">
                      <b-form-input id="project" v-model="project" type="text" name="project" :placeholder="$t('order.enterProject')" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.currency')" label-for="currency">
                      <b-form-select
                        id="currency"
                        v-model="currency"
                        :options="currencyList"
                        text-field="name"
                        value-field="value"
                        name="currency"
                        :disabled="lockObject"
                        :state="currencyState"
                        size="sm"
                        aria-describedby="currencyFeedback"
                      />

                      <b-form-invalid-feedback id="currencyFeedback">
                        <!-- This will only be shown if the preceeding input has an invalid state -->
                        {{ $t('common.notEmptyField') }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="6">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.deliveryMethod')" label-for="delivery_method">
                      <b-form-select
                        id="delivery_method"
                        v-model="deliveryMethod"
                        :options="deliveryMethodsList"
                        name="delivery_method"
                        :disabled="lockObject"
                        :state="deliveryMethodState"
                        size="sm"
                        :placeholder="$t('order.enterDeliveryMethod')"
                        aria-describedby="deliveryMethodFeedback"
                      />

                      <b-form-invalid-feedback id="deliveryMethodFeedback">
                        <!-- This will only be shown if the preceeding input has an invalid state -->
                        {{ $t('common.notEmptyField') }}
                      </b-form-invalid-feedback>
                      <b-form-valid-feedback id="deliveryMethodFeedback">
                        <!-- This will only be shown if the preceeding input has an invalid state -->
                        {{ deliverySettingsDescription }}
                      </b-form-valid-feedback>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.packageMaterial')" label-for="package-material">
                      <b-form-select
                        id="package-material"
                        v-model="packageMaterial"
                        :options="packageMaterialList"
                        :disabled="lockObject"
                        name="package-material"
                        size="sm"
                        :placeholder="$t('order.enterMaterial')"
                      />
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="6">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.deliveryDate')" label-for="deliwery-date">
                      <date-picker
                        id="delivery-date"
                        v-model="deliveryDate"
                        type="date"
                        format="DD.MM.YYYY"
                        :lang="dateLang"
                        show-week-number
                        :disabled="lockObject"
                        :placeholder="$t('common.selectDate')"
                        :disabled-date="deliveryDateDisabled"
                        size="sm"
                      ></date-picker>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.shipmentDate')" label-for="shipment-date">
                      <date-picker
                        id="shipment-date"
                        v-model="shipmentDate"
                        type="date"
                        format="DD.MM.YYYY"
                        :lang="dateLang"
                        show-week-number
                        :disabled="lockObject"
                        :placeholder="$t('common.selectDate')"
                        :disabled-date="shipmentDateDisabled"
                        size="sm"
                      ></date-picker>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row class="mt-1">
                  <b-col md="6">
                    <b-row>
                      <b-col md="3">
                        <label>{{ $t('table.author') }}</label>
                      </b-col>
                      <b-col>
                        <p
                          ><strong>{{ object.author ? object.author.name : '' }}</strong></p
                        >
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row>
                      <b-col md="3">
                        <label>{{ $t('table.sumWithoutVAT') }}</label>
                      </b-col>
                      <b-col>
                        <strong>{{ object.sumNetto }}</strong>
                      </b-col>
                      <b-col md="2">
                        <label>{{ $t('table.sumVAT') }}</label>
                      </b-col>
                      <b-col>
                        <strong>{{ object.sumVat }}</strong>
                      </b-col>
                      <b-col md="2">
                        <label>{{ $t('table.sumWithVAT') }}</label>
                      </b-col>
                      <b-col>
                        <strong>{{ object.sumBrutto }}</strong>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="12">
                    <b-form-group vertical :label-cols="1" :label="$t('table.comment')" label-for="comment">
                      <b-form-textarea id="order-comment" v-model="comment" rows="6" name="order-comment" :placeholder="$t('common.enterComment')"></b-form-textarea>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-tab>
              <b-tab :title="$t('common.products')" @click="updateTabIndex(1)">
                <b-button-toolbar>
                  <b-btn-group>
                    <b-button variant="outline-secondary" size="sm" :disabled="lockObject" @click="addConfigProduct">
                      <i class="ri-add-line"></i>
                      {{ $t('commands.addProduct') }}
                    </b-button>
                    <b-button variant="outline-secondary" class="ml-2" size="sm" :disabled="lockObject" @click="addExtraProduct">
                      <i class="ri-add-line"></i>
                      {{ $t('commands.addExtraProduct') }}
                    </b-button>
                  </b-btn-group>
                </b-button-toolbar>
                <b-row class="mt-2">
                  <b-table hover :items="object.products" :fields="productFields" foot-clone>
                    <template v-slot:cell(index)="{ index }">
                      <p>{{ ++index }}</p>
                    </template>
                    <template v-slot:cell(product)="{ item, index }">
                      <div class="table-button-container">
                        <b-row inline>
                          <b-link href="javascript:void(0);" @click="editProductRow(item, index)">
                            <h5
                              ><strong>{{ item.product.name }}</strong></h5
                            ></b-link
                          ></b-row
                        ></div
                      >
                    </template>
                    <template v-slot:cell(description)="{ item }">
                      <b-form-textarea id="product-description" :value="item.description" size="sm" no-resize disabled plaintext style="overflow: hidden" max-rows="30">
                      </b-form-textarea>
                    </template>
                    <template v-slot:cell(actions)="{ item, index }">
                      <div class="table-button-container">
                        <b-row inline>
                          <a href="javascript:void(0);" class="action-icon text-success" :disabled="lockObject" @click="copyProductRow(item)">
                            <i class="ri-file-copy-line-copy"></i>
                          </a>
                          <a href="javascript:void(0);" class="action-icon text-primary" @click="calculateItemPrices(item, index)">
                            <i class="ri-calculator-fill"></i>
                          </a>
                          <a href="javascript:void(0);" class="action-icon text-danger" @click="deleteProductRow(index)">
                            <i class="ri-delete-bin-7-fill"></i>
                          </a>
                        </b-row>
                      </div>
                    </template>
                    <template v-slot:foot()><strong></strong> </template>
                    <template v-slot:foot(quantity)>
                      <strong>{{ $t('common.total') }}, {{ object.currency ? object.currency.name : '' }} :</strong>
                    </template>
                    <template v-slot:foot(price)
                      ><strong>{{ totalPrice }}</strong>
                    </template>
                    <template v-slot:foot(discountPercent)><strong> - </strong> </template>
                    <template v-slot:foot(discountSum)>
                      <strong>{{ totalDiscount }}</strong>
                    </template>
                    <template v-slot:foot(sumNetto)>
                      <strong>{{ object.sumNetto }}</strong>
                    </template>
                  </b-table>
                </b-row></b-tab
              >

              <b-tab :title="$t('common.files')" @click="updateTabIndex(2)">
                <b-button-toolbar>
                  <b-btn-group>
                    <b-button variant="outline-secondary" size="sm" :disabled="lockObject" @click="addFile">
                      <i class="ri-add-line"></i>
                      {{ $t('commands.addFile') }}
                    </b-button>
                  </b-btn-group>
                </b-button-toolbar>

                <b-modal id="modal-select-file" ok-only :title="$t('common.selectFileTitle')" @ok="handleOkFile">
                  <b-form-file v-model="selectedFiles" class="mt-2" :browse-text="$t('commands.select')" :placeholder="$t('common.noSelectedFiles')" multiple></b-form-file>
                </b-modal>

                <b-row class="mt-2">
                  <b-table striped hover :items="object.files" :fields="filesFields" small>
                    <template v-slot:cell(index)="{ index }">
                      <span>{{ ++index }}</span>
                    </template>
                    <template v-slot:cell(originalname)="{ item }">
                      <b-link href="javascript:void(0);" @click="downloadFile(item, true)">{{ item.originalname }} </b-link>
                    </template>
                    <template v-slot:cell(actions)="{ index, item }">
                      <div class="table-button-container">
                        <b-row inline>
                          <a href="javascript:void(0);" class="action-icon" @click="downloadFile(item, false)">
                            <i class="ri-download-cloud-2-line"></i>
                          </a>
                          <a href="javascript:void(0);" class="action-icon" @click="deleteFileRow(index, item)">
                            <i class="ri-delete-bin-7-fill ml-2 text-danger"></i>
                          </a>
                        </b-row>
                      </div> </template
                  ></b-table> </b-row
              ></b-tab>
            </b-tabs>
          </b-col>
        </b-row>
        <!-- </b-card-body> -->
      </b-card>

      <!-- modal message -->
      <b-modal id="modal-message" hide-footer title="Uwaga!">
        <p class="my-4">{{ modalMessage }}</p>
      </b-modal>

      <!-- modal question -->
      <b-modal id="m-question" title="Uwaga!">
        <p class="my-4">{{ questionMessage }}</p>
        <template v-slot:modal-footer>
          <div class="w-100">
            <b-button-toolbar class="float-right">
              <b-button variant="danger" size="sm" class="mr-2" @click="onCancelModalQuestion">
                {{ $t('commands.cancel') }}
              </b-button>

              <b-button variant="success" size="sm" @click="onOkModalQuestion">
                {{ $t('commands.ok') }}
              </b-button>
            </b-button-toolbar>
          </div>
        </template>
      </b-modal>

      <!-- Products selection -->
      <SelectProduct v-if="viewMode === 'product_selection'" :view-id="viewId" />

      <!-- Extra products selection -->
      <SelectExtraProduct :view-id="viewId" :price-type="customerData.priceType" />

      <!-- Product parametrization -->
      <Configurator v-if="viewMode === 'product_parametrization'" :view-id="viewId" :external-user="externalUser" />

      <!-- Calculate prices -->
      <CalculatePrices v-if="viewMode === 'calculate_prices'" :view-id="viewId" :external-user="externalUser" />

      <ChangesHistory v-if="historyShowMode && object.id" :object-id="object.id" object-name="order" @history-closed="historyViewEnd" />
      <DoublesList v-if="showDoublesMode" :doubles-id="doublesId" @doubles-list-closed="doublesListClosed" />

      <Subordination v-if="subordinationShowMode" :object-id="object.id" object-type="orders" @subordination-closed="subordinationViewEnd" />
    </div>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import SelectProduct from '@/components/order/select-product'
import SelectExtraProduct from '@/components/order/select-extra-product'
import Configurator from '@/components/order/configurator'
import CalculatePrices from '@/components/order/calculate-prices'
import deliveryMethods from '../../constants/deliveryMethods'
import PackageMaterialList from '../../constants/packageMaterialList'
import Subordination from '@/components/common/subordination'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'
import DoublesList from '@/components/order/doubles-list'
import ChangesHistory from '@/components/object-versions/changes-history'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/pl'

export default {
  name: 'SalesOrderDetail',

  page: {
    title: 'Zlecenie',
    meta: [{ name: 'description', content: appConfig.description }],
  },

  components: {
    Layout,
    PageHeader,
    SelectProduct,
    SelectExtraProduct,
    Configurator,
    CalculatePrices,
    DoublesList,
    ChangesHistory,
    DatePicker,
    Subordination,
  },
  data() {
    return {
      title: this.$t('order.new'),
      viewId: this.$route.params.id,
      dateLang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: false,
      },
      deliveryMethodsList: Object.keys(deliveryMethods).map((key) => {
        return { value: key, text: this.$t(`order.deliveryMethods.${key}`) }
      }),
      packageMaterialList: PackageMaterialList.map((el) => {
        return { value: el, text: this.$t(`order.packageMaterial.${el}`) }
      }),
      calculateDatesProcess: false,
      deliverySettings: '',
      deliverySettingsDescription: '',
      minShipmentDate: null,
      maxShipmentDate: null,
      minDeliveryDate: null,
      externalUser: this.$attrs.user ? this.$attrs.user.externalUser : false,
      useCustomerAccess: this.$attrs.user ? this.$attrs.user.useCustomerAccess : false,
      modalMessage: '',
      tabIndex: 0,
      storeTabIndex: 0,
      selectedFiles: null,
      questionAction: null,
      questionParams: null,
      questionMessage: '',
      showDoublesMode: false,
      historyShowMode: false,
      productFields: [
        { key: 'index', label: 'Lp' },
        { key: 'product', label: this.$t('table.product') },
        { key: 'description', label: this.$t('table.description') },
        { key: 'unitOfMeasureStr', label: this.$t('table.jOM') },
        { key: 'quantity', label: this.$t('table.quantity') },
        { key: 'price', label: this.$t('table.price') },
        { key: 'discountPercent', label: this.$t('table.discountPercent') },
        { key: 'discountSum', label: this.$t('table.discountSum') },
        { key: 'sumNetto', label: this.$t('table.sum') },
        { key: 'actions', label: this.$t('table.actions') },
      ],
      filesFields: [
        { key: 'index', label: this.$t('table.sort') },
        { key: 'originalname', label: this.$t('table.name') },
        { key: 'type', label: this.$t('table.type') },
        { key: 'size', label: this.$t('table.fileSize') },
        { key: 'actions', label: this.$t('table.actions') },
      ],
      loading: false,
      referenceErrorMessage: this.$t('common.notEmptyField'),
      doublesId: [],
      totalPrice: 0,
      totalDiscount: 0,
      statusList: [],
      termOfPaymentList: [],
      currencyList: [],
      modified: false,
      lockObject: false,
      subordinationShowMode: false,
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'orders/objectView',
      currentLanguage: 'auth/currentLanguage',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    customerData() {
      return this.objectView ? this.objectView.customerData : {}
    },

    viewMode() {
      return this.objectView ? this.objectView.viewMode : 'order_modification'
    },

    status: {
      get() {
        return this.object.statusId
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'statusId', value })
      },
    },

    offer: {
      get() {
        return this.object.offer
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'offer', value })
      },
    },

    customer: {
      get() {
        return this.object.customer
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'customer', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'customerId', value: value ? value.id : value })

        if (value) {
          this.setCustomer(value.id)
        } else {
          this.setCustomer(value)
        }
      },
    },

    reference: {
      get() {
        return this.object.reference
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'reference', value })
      },
    },

    deliveryMethod: {
      get() {
        return this.object.deliveryMethod
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'deliveryMethod', value })

        this.deliveryDate = null
        this.shipmentDate = null
      },
    },

    deliveryDate: {
      get() {
        return this.object.deliveryDate
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'deliveryDate', value })
        this.calculateShipmentDate()
        this.calculateDatesAvailability()
      },
    },

    shipmentDate: {
      get() {
        return this.object.shipmentDate
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'shipmentDate', value })
      },
    },

    currency: {
      get() {
        return this.object.currency
      },
      set(value) {
        if (value) {
          this.setObjectProperty({ viewId: this.viewId, property: 'currencyId', value: value.id })
          this.setObjectProperty({ viewId: this.viewId, property: 'currency', value })
        }
      },
    },

    termOfPayment: {
      get() {
        return this.object.termOfPaymentId
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'termOfPaymentId', value })
      },
    },

    packageMaterial: {
      get() {
        return this.object.packageMaterial
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'packageMaterial', value })
      },
    },

    project: {
      get() {
        return this.object.project
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'project', value })
      },
    },

    comment: {
      get() {
        return this.object.comment
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'comment', value })
      },
    },

    referenceDouble: {
      get() {
        return this.objectView.referenceDouble
      },
      set(value) {
        this.setObjectViewProperty({ viewId: this.viewId, property: 'referenceDouble', value })
      },
    },

    productsCount() {
      return this.object.products ? this.object.products.length : 0
    },

    statusState() {
      return this.object.statusId !== null
    },

    currencyState() {
      return this.object.currency && this.object.currency.id !== null
    },
    customerState() {
      return this.object.customer && this.object.customer.id !== null
    },

    referenceState() {
      return this.object.reference ? this.object.reference.length > 0 : false
    },

    deliveryMethodState() {
      return this.object.deliveryMethod ? this.object.deliveryMethod.length > 0 : false
    },
  },

  watch: {
    customerName(newVal, oldVal) {
      if (newVal === '') {
        this.setObjectProperty({ viewId: this.viewId, property: 'customerId', value: null })
      }
    },

    productsCount(newVal, oldVal) {
      if (newVal > oldVal) {
        this.writeOrder()
      }
    },
  },

  updated() {
    if (this.storeTabIndex !== this.tabIndex) {
      this.tabIndex = this.storeTabIndex
    }

    if (this.storeTabIndex === 1) {
      this.updeteProductTotals()
    }
  },

  async mounted() {
    if (!this.objectView) {
      this.closeOrder()
      return
    }

    this.setOrderTitle()
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'orders/setObjectViewProperty',
      setObjectViewProperties: 'orders/setObjectViewProperties',
      setObjectProperty: 'orders/setObjectProperty',
      copyProduct: 'orders/copyProduct',
      deleteProduct: 'orders/deleteProduct',
      delObjectView: 'orders/delObjectView',
      setOpenTask: 'tasks/setOpenTask',
      setTaskProperty: 'tasks/setTaskProperty',
      setTaskProperties: 'tasks/setTaskProperties',
    }),

    ...mapActions({
      delView: 'tagsViews/delView',
    }),

    async initialize() {
      if (this.viewMode === 'product_selection') {
        this.setObjectViewProperties({
          viewId: this.viewId,
          props: { viewMode: 'order_modification' },
        })
      }

      this.initStatuses()
      this.initTermsOfPayment()
      this.initCurrencies()

      if (this.object.isNew && this.object.customerId === null && this.useCustomerAccess) {
        await this.setAccessCustomer()
      }

      if (this.object.customerId !== null) {
        await this.$store.dispatch('orders/getCustomerData', {
          params: {
            id: this.object.customerId,
            viewId: this.viewId,
          },
        })

        if (this.customerData) {
          this.customerName = this.customerData.name
          this.deliverySettings = this.customerData.deliverySettings

          this.updateDeliverySettingsDescription()
        }
      }

      if (this.object.isNew && this.referenceDouble === true) {
        this.checkReference()
      }

      this.calculateDatesAvailability()
    },

    async initStatuses() {
      const inputParams = {
        params: {
          filter: {},
          lang: this.currentLanguage.code,
        },
        noCommit: true,
      }

      await this.$store
        .dispatch('salesOrderStatuses/findAll', inputParams)
        .then((response) => {
          if (response && response.status === 200) {
            if (this.useCustomerAccess === true) {
              for (const status of response.data) {
                if (status.id === this.status) {
                  this.statusList.push({ ...status })
                  this.lockObject = status.customerLockOrder === true
                  continue
                }

                if (status.customerAccess === true) {
                  this.statusList.push({ ...status })
                }
              }
            } else {
              this.statusList = response.data
            }
          } else {
            this.statusList = []
          }
        })
        .catch((err) => {
          console.error(err)
          this.statusList = []
        })
    },

    async initTermsOfPayment() {
      await this.$store
        .dispatch('termsOfPayment/findAll', { noCommit: true, params: { lang: this.currentLanguage.code } })
        .then((response) => {
          if (response && response.status === 200) {
            this.termOfPaymentList = response.data
          } else {
            this.termOfPaymentList = []
          }
        })
        .catch((err) => {
          console.error(err)
          this.termOfPaymentList = []
        })
    },

    async initCurrencies() {
      await this.$store
        .dispatch('currencies/findAll', { noCommit: true })
        .then((response) => {
          if (response && response.status === 200) {
            this.currencyList = response.data

            for (const currencyRow of this.currencyList) {
              currencyRow.value = { id: currencyRow.id, name: currencyRow.name }
            }
          }
        })
        .catch((err) => {
          console.error(err)
          this.currencyList = []
        })
    },

    setOrderTitle() {
      if (!this.object.isNew) {
        this.title = this.$t('order.presentation', [
          `${this.object.prefix}-${this.object.number.toString().padStart(6, '0')}`,
          moment(this.object.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        ])
      }
    },

    async setAccessCustomer() {
      const response = await this.$store.dispatch('counterparties/findAll', { noCommit: true })

      if (response.status === 200) {
        if (response.data.length === 1) {
          this.setCustomer(response.data[0].id)
        }
      }
    },

    openOrderHistory() {
      this.historyShowMode = true
    },

    showDoubles() {
      this.showDoublesMode = true
    },

    async setCustomer(value) {
      this.setObjectProperty({ viewId: this.viewId, property: 'customerId', value })

      if (value) {
        await this.fillCustomerData(value)
      }
    },

    deliveryDateDisabled(date) {
      return date < this.minDeliveryDate
    },

    shipmentDateDisabled(date) {
      return date < this.minShipmentDate || date > this.maxShipmentDate
    },

    async fillCustomerData(customerId) {
      await this.$store.dispatch('orders/getCustomerData', {
        params: {
          id: customerId,
          viewId: this.viewId,
        },
      })

      if (this.customerData) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'customer',
          value: {
            id: this.customerData.id,
            name: this.customerData.name,
            presentation: this.customerData.presentation,
          },
        })

        this.deliverySettings = this.customerData.deliverySettings

        if (this.customerData.currencyId !== null) {
          const currency = this.currencyList.find((el) => {
            return el.id === this.customerData.currencyId
          })

          if (currency) {
            this.currency = { id: currency.id, name: currency.name }
          }
        }

        this.termOfPayment = this.customerData.termOfPaymentId
        this.packageMaterial = this.customerData.packageMaterial

        if (this.deliverySettings) {
          this.updateDeliveryMethod()
          this.updateDeliverySettingsDescription()
          this.deliveryDate = null
          this.shipmentDate = null

          this.calculateDatesAvailability()
        }
      }
    },

    historyViewEnd() {
      this.historyShowMode = false
    },

    doublesListClosed() {
      this.showDoublesMode = false
    },

    async writeAndCloseOrder() {
      if (this.checkDocumentFilling() === false) {
        return
      }

      const result = this.writeOrder(true)

      if (result) {
        this.$router.push({ name: 'sales-orders' })
        this.$destroy()
        this.delView({ name: this.$route.name, path: this.$route.path })
        this.delObjectView(this.viewId)
      }
    },

    async writeOrder(closeOnWrite) {
      if (this.checkDocumentFilling() === false) {
        return
      }

      let response

      if (this.object.isNew) {
        response = await this.$store.dispatch('orders/createObject', this.object)
      } else {
        response = await this.$store.dispatch('orders/updateObject', this.object)
      }

      if (response.status === 200) {
        if (!closeOnWrite) {
          if (this.viewId !== response.data.id) {
            const newItemId = response.data.id
            response = await this.$store.dispatch('orders/findByPk', { params: { id: newItemId } })

            if (response.status === 200) {
              this.$router.push({ name: 'sales-order-detail', params: { id: newItemId } })
              this.delView({ name: this.$route.name, path: this.$route.path })
              this.delObjectView(this.viewId)
            }
          }
        }
      }

      this.$bvToast.toast(this.$t('order.msg.writed'), {
        title: this.$t('common.msg'),
        variant: 'success',
        solid: true,
        autoHideDelay: 2000,
      })
    },

    closeOrder() {
      this.$router.push({ name: 'sales-orders' })
      this.$destroy()
      this.delView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)
    },

    checkDocumentFilling() {
      if (this.customerState === false) {
        this.modalMessage = this.$t('order.msg.emptyCustomer')
        this.$bvModal.show('modal-message')
        return false
      }

      if (this.referenceState === false) {
        this.modalMessage = this.$t('order.msg.emptyReference')
        this.$bvModal.show('modal-message')
        return false
      }

      if (this.statusState === false) {
        this.modalMessage = this.$t('order.msg.emptyStatus')
        this.$bvModal.show('modal-message')
        return false
      }

      if (this.currencyState === false) {
        this.modalMessage = this.$t('order.msg.emptyCurrency')
        this.$bvModal.show('modal-message')
        return false
      }

      if (this.deliveryMethodState === false) {
        this.modalMessage = this.$t('order.msg.emptyDeliveryMethod')
        this.$bvModal.show('modal-message')
        return false
      }

      return true
    },

    updateDeliveryMethod() {
      if (this.customerData !== '' && this.deliverySettings !== '') {
        if (this.deliverySettings.vip) {
          this.deliveryMethod = 'VIP'
        } else if (this.deliveryMethod === 'VIP') {
          this.deliveryMethod = 'STANDARD'
        }
      }
    },

    async checkReference() {
      if (this.referenceState) {
        this.doublesId = []

        const response = await this.$store.dispatch('orders/checkDouble', {
          params: { reference: this.reference, customerId: this.customer.id, orderId: this.object.id },
        })

        if (response) {
          if (response.status === 200 && response.data.double) {
            let orderNumbers = ''

            for (const orderData of response.data.orders) {
              this.doublesId.push(orderData.id)
              orderNumbers += (orderNumbers !== '' ? ', ' : '') + orderData.prefix + '-' + orderData.number.toString().padStart(6, '0')
            }

            this.setObjectViewProperty({ viewId: this.viewId, property: 'referenceDouble', value: true })
            this.referenceErrorMessage = this.$t('order.msg.orderAvailable', [orderNumbers])
          } else {
            this.setObjectViewProperty({ viewId: this.viewId, property: 'referenceDouble', value: false })
            this.referenceErrorMessage = this.$t('common.notEmptyField')
          }
        }
      } else {
        this.setObjectViewProperty({ viewId: this.viewId, property: 'referenceDouble', value: false })
        this.referenceErrorMessage = this.$t('common.notEmptyField')
      }
    },

    updateDeliverySettingsDescription() {
      const deliveryDaysArray = []
      deliveryDaysArray.push(this.deliverySettings.Mo)
      deliveryDaysArray.push(this.deliverySettings.Tu)
      deliveryDaysArray.push(this.deliverySettings.We)
      deliveryDaysArray.push(this.deliverySettings.Th)
      deliveryDaysArray.push(this.deliverySettings.Fr)
      deliveryDaysArray.push(this.deliverySettings.Sa)
      deliveryDaysArray.push(this.deliverySettings.Su)

      let shipmentDays = ''

      for (let i = 0; i < deliveryDaysArray.length; i++) {
        if (deliveryDaysArray[i] === true) {
          shipmentDays += shipmentDays === '' ? '' : ', '
          if (i === 0) {
            shipmentDays += this.$t('weekDays.Mo')
          } else if (i === 1) {
            shipmentDays += this.$t('weekDays.Tu')
          } else if (i === 2) {
            shipmentDays += this.$t('weekDays.We')
          } else if (i === 3) {
            shipmentDays += this.$t('weekDays.Th')
          } else if (i === 4) {
            shipmentDays += this.$t('weekDays.Fr')
          } else if (i === 5) {
            shipmentDays += this.$t('weekDays.Sa')
          } else if (i === 6) {
            shipmentDays += this.$t('weekDays.Su')
          }
        }
      }

      if (shipmentDays !== '') {
        shipmentDays = this.$t('order.shipmentDays') + shipmentDays
      }

      let roadDays = ''

      if (this.deliverySettings.roadDays > 0) {
        roadDays = this.$t('order.roadDays') + this.deliverySettings.roadDays
      }

      let deliveryDays = ''
      if (this.deliveryMethod === 'VIP') {
        if (!this.deliverySettings.byOrderPeriod && this.deliverySettings.shipmentDays > 0) {
          deliveryDays = this.$t('order.deliveryDays') + this.deliverySettings.deliveryDays
        } else if (this.deliverySettings.byOrderPeriod) {
          deliveryDays = this.$t('order.deliveryDays') + this.$t('order.byOrderPeriod')
        }
      }

      this.deliverySettingsDescription = shipmentDays
      if (roadDays !== '') {
        this.deliverySettingsDescription += this.deliverySettingsDescription === '' ? '' : '; ' + roadDays
      }

      if (deliveryDays !== '') {
        this.deliverySettingsDescription += this.deliverySettingsDescription === '' ? '' : '; ' + deliveryDays
      }
    },

    calculateDatesAvailability() {
      let now = new Date()

      if (!this.object.isNew && this.object.createdAt) {
        now = new Date(this.object.createdAt)
      }

      const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      this.minDeliveryDate = new Date(minDate)
      this.minShipmentDate = new Date(minDate)

      if (this.deliverySettings && this.deliverySettings.roadDays > 0) {
        this.minDeliveryDate.setDate(minDate.getDate() + this.deliverySettings.roadDays)
      }
      if (this.deliveryDate !== null) {
        this.maxShipmentDate = new Date(this.object.deliveryDate)
      }
    },

    calculateShipmentDate() {
      if (this.deliveryDate) {
        const shipmentDate = new Date(this.object.deliveryDate)

        if (this.deliverySettings.roadDays > 0) {
          shipmentDate.setDate(shipmentDate.getDate() - this.deliverySettings.roadDays)
        } else {
          shipmentDate.setDate(shipmentDate.getDate() - 2)
        }

        this.setObjectProperty({ viewId: this.viewId, property: 'shipmentDate', value: shipmentDate })
      }
    },

    updeteProductTotals() {
      this.totalPrice = 0
      this.totalDiscount = 0

      if (this.object.products) {
        for (const product of this.object.products) {
          this.totalPrice += Number(product.price)
          this.totalDiscount += Number(product.discountSum)
        }
      }

      this.totalPrice = this.totalPrice.toFixed(2)
      this.totalDiscount = this.totalDiscount.toFixed(2)
    },

    updateTabIndex(index) {
      if (index === 1) {
        if (this.customerState !== true || this.referenceState !== true) {
          this.storeTabIndex = 0
          console.log('customerState', this.customerState)
          console.log('referenceState', this.referenceState)

          this.$bvToast.toast(this.$t('order.msg.emptyFields'), {
            title: this.$t('common.msg'),
            variant: 'danger',
            solid: true,
            autoHideDelay: 2000,
          })
          return
        }

        if (this.referenceDouble === true) {
          this.questionAction = this.confirmDouble
          this.questionParams = index
          this.questionMessage = this.$t('order.msg.confirmDouble')

          this.$bvModal.show('m-question')

          return
        }
      }

      this.storeTabIndex = index
    },

    confirmDouble(index) {
      this.storeTabIndex = index
    },

    copyProductRow(item) {
      if (this.lockObject === true) {
        return
      }

      this.copyProduct({ viewId: this.viewId, productRow: { ...item } })
    },

    deleteProductRow(index) {
      if (this.lockObject === true) {
        return
      }

      this.questionAction = this.deleteProduct
      this.questionParams = { index, viewId: this.viewId }
      this.questionMessage = this.$t('order.msg.confirmRemoveProduct')

      this.$bvModal.show('m-question')
    },

    async deleteFileRow(index, item) {
      await this.$store.dispatch('orders/deleteFile', {
        viewId: this.viewId,
        index: index,
        id: item.id,
      })
    },

    calculateItemPrices(productRow, index) {
      this.setObjectViewProperties({
        viewId: this.viewId,
        props: { currentProduct: { ...productRow, index }, viewMode: 'calculate_prices' },
      })
    },

    editProductRow(productRow, index) {
      if (productRow.configProduct) {
        this.setObjectViewProperties({
          viewId: this.viewId,
          props: { currentProduct: { ...productRow, index }, viewMode: 'product_parametrization' },
        })
      }
    },

    addConfigProduct() {
      if (this.customerState !== true) {
        this.modalMessage = this.$t('order.msg.emptyCustomer')
        this.$bvModal.show('modal-message')
        return
      }

      if (this.referenceState !== true) {
        this.modalMessage = this.$t('order.msg.emptyReference')
        this.$bvModal.show('modal-message')
        return
      }

      this.setObjectViewProperty({ viewId: this.viewId, property: 'viewMode', value: 'product_selection' })
    },

    async addExtraProduct() {
      if (this.customerState !== true) {
        this.modalMessage = this.$t('order.msg.emptyCustomer')
        this.$bvModal.show('modal-message')
        return
      }

      if (this.referenceState !== true) {
        this.modalMessage = this.$t('order.msg.emptyReference')
        this.$bvModal.show('modal-message')
        return
      }

      this.$bvModal.show('select-product-dlg')
    },

    addFile() {
      if (this.object.isNew) {
        this.modalMessage = this.$t('order.msg.writeOrder')
        this.$bvModal.show('modal-message')
        return
      }

      this.$bvModal.show('modal-select-file')
    },

    createTask() {
      this.setOpenTask(null)
      this.setTaskProperties({
        orderId: this.object.id,
        ownerId: this.object.id,
        ownerType: 'Order',
        subjectString: this.title,
        customerId: this.object.customerId,
      })
      this.$router.push({ name: 'task-detail' })
    },

    async handleOkFile(bvModalEvt) {
      bvModalEvt.preventDefault()
      await this.handleSubmitFile()

      this.$nextTick(() => {
        this.$bvModal.hide('modal-select-file')
      })
    },

    async handleSubmitFile() {
      await this.$store.dispatch('orders/uploadFiles', { viewId: this.viewId, files: this.selectedFiles }).then(async (response) => {
        await this.$store.dispatch('orders/getFiles', {
          viewId: this.viewId,
          objectId: this.object.id,
        })
      })
    },

    async downloadFile(item, open) {
      if (this.loading === true) {
        return
      }

      this.loading = true

      await this.$store.dispatch('orders/openFile', {
        id: item.id,
        type: item.type,
        name: item.originalname,
        open,
      })

      this.loading = false
    },

    onCancelModalQuestion() {
      this.closeAndClearModalQuestion()
    },

    onOkModalQuestion() {
      if (this.questionAction) {
        if (this.questionParams) {
          this.questionAction(this.questionParams)
        } else {
          this.questionAction()
        }
      }

      this.closeAndClearModalQuestion()
    },

    closeAndClearModalQuestion() {
      this.questionAction = null
      this.questionParams = null
      this.questionMessage = ''
      this.$bvModal.hide('m-question')
    },

    openItemSubordination() {
      if (this.object.isNew) {
        this.modalMessage = this.$t('order.msg.selectOrderFirst')
        this.$bvModal.show('modal-message')
        return
      }

      this.subordinationShowMode = true
    },

    subordinationViewEnd() {
      this.subordinationShowMode = false
    },
  },
}
</script>

<style>
</style>
