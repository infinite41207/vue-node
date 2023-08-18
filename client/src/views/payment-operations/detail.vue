<template>
  <Layout>
    <PageHeader :title="title" />

    <b-card>
      <b-row class="align-items-center m-1">
        <b-button variant="success" @click="writeObject(true)" :disabled="readOnly" class="mr-1" size="sm">
          <i class="ri-file-add-line mr-1"></i>
          {{ $t('commands.writeAndClose') }}
        </b-button>
        <b-button variant="outline-secondary" @click="writeObject" :disabled="readOnly" class="mr-1" size="sm">
          <i class="ri-file-add-line mr-1"></i>
          {{ $t('commands.write') }}
        </b-button>
        <b-button variant="outline-secondary" class="mr-1" @click="closeView" size="sm">
          <i class="ri-file-excel-line mr-1"></i>
          {{ $t('commands.close') }}
        </b-button>
        <b-button variant="outline-secondary" class="mr-1" size="sm">
          <i class="ri-history-line"></i>
          {{ $t('components.historyOfChanges') }}
        </b-button>
        <b-button variant="outline-secondary" class="mr-1" size="sm" @click="subordinationShowMode = true">
          <i class="ri-node-tree"></i>
        </b-button>
        <b-dropdown variant="outline-secondary" :text="$t('commands.createFrom')" size="sm">
          <b-dropdown-item @click="createDisposition">Dyspozycję</b-dropdown-item>
        </b-dropdown>
        <b-dropdown variant="outline-secondary" :text="$t('commands.print')" class="ml-1" size="sm">
          <b-dropdown-item @click="openPrintForm('main-dn-print')">Wydruk kwitu wagowego<!--TODO--></b-dropdown-item>
          <b-dropdown-item @click="openPrintForm('roll')">Wydruk kwitu wagowego (rolka)<!--TODO--></b-dropdown-item>
          <b-dropdown-item @click="openPrintForm('with-turn')">Wydruk kwitu wagowego ze skrętem<!--TODO--></b-dropdown-item>
        </b-dropdown>
        <b-dropdown variant="outline-secondary" class="ml-1" :text="$t('commands.more')" size="sm"> </b-dropdown>
      </b-row>
      <b-row class="mt-4">
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.number')" label-for="numer">
            <b-input-group>
              <b-form-input id="object-number" v-model="numberStr" name="number" size="sm" />
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.date')" label-for="numer">
            <b-input-group>
              <!-- <b-form-datepicker id="order_date" v-model="date" name="date" size="sm"
                aria-describedby="statusFeedback"></b-form-datepicker> -->
              <date-picker id="order_date" v-model="date" name="date" value-type="date" type="datetime" size="sm"></date-picker>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.customer')" label-for="customer">
            <f-select v-model="customer" select-btn open-btn value-type="counterparties" detail-view="counterparties-detail" placeholder="Wyszukaj kontrahenta..."> </f-select>
          </b-form-group>
        </b-col>
        <!-- <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.typeOfMovement')" label-for="typeOfMovement">
            <b-form-input id="typeOfMovement" v-model="typeOfMovement" name="typeOfMovement" size="sm" disabled />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.typeOfPayment')" label-for="typeOfPayment">
            <b-form-input id="typeOfPayment" v-model="typeOfPayment" name="typeOfPayment" size="sm" disabled />
          </b-form-group>
        </b-col> -->
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.paymentType')" label-for="paymentType">
            <f-select v-model="paymentType" select-btn open-btn value-type="paymentTypes" detail-view="payment-types-detail" placeholder="Wyszukaj rodzaj płatnośći..."> </f-select>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.cashFlowItem')" label-for="cashFlowItem">
            <f-select v-model="cashFlowItem" select-btn open-btn value-type="cashFlowItems" detail-view="cash-flow-items-detail" placeholder="Wyszukaj element przepływu środków pieniężnych..."> </f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.project')" label-for="project">
            <f-select v-model="project" select-btn open-btn value-type="projects" detail-view="project-detail" placeholder="Wyszukaj projekt..."></f-select>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.sumPayment')" label-for="quantity">
            <b-input-group>
              <b-form-input id="sumPayment" v-model="sumPayment" name="sumPayment" size="sm" type="number" />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.currency')" label-for="currency">
            <!-- <b-form-input id="currency" v-model="currency" name="currency" size="sm" disabled /> -->
            <f-select v-model="currency" select-btn open-btn value-type="currencies" detail-view="currencies-detail" disabled></f-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-4">
        <b-col>
          <p class="mt-2">{{ $t('table.descComment') }}</p>
          <b-form-textarea id="textarea" v-model="comment" placeholder="Wprowadz komentarz..." rows="3" max-rows="6"></b-form-textarea>
        </b-col>
      </b-row>
    </b-card>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import TypesOfPayment from '@/constants/typesOfPayment'
import TypesOfMovement from '@/constants/typesOfMovement'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import PageHeader from '@/components/page-header.vue'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import moment from 'moment'
import lowerCaseFilter from '@/filters/lower-case-filter'

export default {
  name: 'PaymentOperationDetail',

  page() {
    return { title: this.$t('common.deliveryNoteData'), meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: { Layout, PageHeader, DatePicker },

  data() {
    return {
      typesOfMovement: [],
      typesOfPayment: [],
      
      viewId: this.$route.params.id,

      tareTimeTemp: null,
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  async created() {
    await this.initialize()
  },

  computed: {
    ...mapGetters({
      getObjectView: 'paymentOperations/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    title() {
      return this.$t(`route.${this.typeOfPayment.toLowerCase()}${this.typeOfMovement}`)
    },

    id: {
      get() {
        return this.objectView ? this.objectView.object.id : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'id', value })
      },
    },

    numberStr: {
      get() {
        return this.objectView ? this.objectView.object.numberStr : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'numberStr', value })
      },
    },

    date: {
      get() {
        return this.objectView ? (this.object.date ? new Date(this.object.date) : null) : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'date', value: value })
      },
    },

    typeOfPayment: {
      get() {
        return this.objectView ? this.object.typeOfPayment : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'typeOfPayment', value })
      },
    },

    typeOfMovement: {
      get() {
        return this.objectView ? this.object.typeOfMovement : ''
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'typeOfMovement', value })
      },
    },

    customer: {
      get() {
        return this.objectView ? this.object.customer : ''
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'customer', value })
      },
    },

    sumPayment: {
      get() {
        return this.objectView ? this.object.sumPayment : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'sumPayment', value })
      },
    },

    comment: {
      get() {
        return this.objectView ? this.object.comment : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'comment', value })
      },
    },

    paymentType: {
      get() {
        return this.objectView ? this.object.paymentType : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'paymentType', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'paymentTypeId', value: value ? value.id : value })
        
        this.changePaymentType(value)
      },
    },

    cashFlowItem: {
      get() {
        return this.objectView ? this.object.cashFlowItem : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'cashFlowItem', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'cashFlowItemId', value: value ? value.id : value })
      },
    },

    project: {
      get() {
        return this.objectView ? this.object.project : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'project', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'projectId', value: value ? value.id : value })
      },
    },

    currency: {
      get() {
        return this.objectView ? this.object.currency : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'currency', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'currencyId', value: value ? value.id : value })
      },
    },

    author: {
      get() {
        return this.objectView ? this.object.author : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'author', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'authorId', value: value ? value.id : value })
      },
    },
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'paymentOperations/setObjectViewProperty',
      setObjectProperty: 'paymentOperations/setObjectProperty',
      delObjectView: 'paymentOperations/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async initialize() {
      this.typesOfMovement = this.loadEnums(TypesOfMovement, 'typesOfMovement')
      this.typesOfPayment = this.loadEnums(TypesOfPayment, 'typesOfPayment')
    },

    loadEnums(enumVar, enumName) {
      const finalList = []
      for (let i = 0; i < enumVar.length; i++) {
        finalList.push({ name: this.$t(`enums.${enumName}.${enumVar[i]}`), value: enumVar[i] })
      }
      return finalList
    },

    async changePaymentType(value) {
      if (value) {
        await this.$store
          .dispatch(`paymentTypes/findByPk`, {
            params: {
              id: value.id,
            },
          })
          .then((response) => {
            if (response.status === 200) {
              if (response.data) {
                this.currency = response.data.currency;
              }
            }
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },

    openPrintForm(printName) {
      // this.$router.push({ name: printName, params: { id: this.viewId, object: this.object, routeOwner: 'delivery-note-detail', isPrintAndClosed: true } })

      const queryParams = {
        name: printName,
        id: this.viewId,
        object: this.object,
        routeOwner: 'payment-operations-detail',
        isPrintAndClosed: false,
      }
      this.$store.dispatch('printForms/addPrint', queryParams)
      this.$router.push({ name: printName, params: { id: printName + '-' + this.viewId } })
    },

    async writeObject(close) {
      let response
      if (this.object.isNew) {
        //console.log('create object: ', this.object)
        response = await this.$store.dispatch('paymentOperations/createObject', this.object)
      } else {
        response = await this.$store.dispatch('paymentOperations/updateObject', this.object)
      }

      if (response.status && response.status === 200) {
        this.$bvToast.toast('Operacja płatnica zostala zapisana', {
          title: this.$tc('common.msg'),
          variant: 'success',
          solid: true,
          autoHideDelay: 2000,
        })
        if (close === true) {
          this.closeView()
        }
      } else {
        this.$bvToast.toast(`Błąd zapisania operacji ${response.data.message}`, {
          title: this.$tc('common.msg'),
          variant: 'danger',
          solid: true,
          autoHideDelay: 2000,
        })
      }
    },

    async closeView() {
      this.$destroy()
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)
      
      const pushPath = [];
      pushPath.push('payment-operations')
      pushPath.push(this.typeOfPayment.toLowerCase())
      pushPath.push(this.typeOfMovement.toLowerCase())

      await this.$router.push({ name: pushPath.join('/') })
    },

    createDisposition() {},

    onSortingChanged() {},
  },
}
</script>
