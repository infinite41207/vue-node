<script>
import { mapGetters, mapMutations } from 'vuex'
import DatePicker from 'vue2-datepicker'
import SearchCustomer from '@/views/counterparties/select'
import SearchSalesOrder from '@/components/reclamation/search-salesOrder'
import moment from 'moment'

export default {
  name: 'ReclMainInfo',

  components: {
    SearchCustomer,
    SearchSalesOrder,
    DatePicker,
  },

  props: {
    mode: {
      type: String,
      default: 'vertical',
    },
    viewId: {
      type: String,
      required: true,
    },
    salesOrderStateMessage: {
      type: String,
      default: '',
    },
    mainInfoRestrictions: {
      type: Boolean,
    },
  },

  data() {
    return {
      showPossitionModalForm: false,
      customerSearchMode: false,
      salesOrderSearchMode: false,
      menuItems: '',
      menuRef: null,
      userSettings: [],
      showFormatForm: false,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'reclamations/objectView',
      openReclamation: 'reclamations/openReclamation',
      counterparties: 'counterparties/customerList',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    customer: {
      get() {
        return this.objectView ? this.object._customer : {}
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: '_customer', value: value })
        this.setObjectProperty({ viewId: this.viewId, property: 'customerId', value: value ? value.id : value })
      },
    },

    salesDate: {
      get() {
        return this.objectView ? (this.object.salesDate ? new Date(this.object.salesDate) : null) : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'salesDate', value })
      },
    },

    deliveryDate: {
      get() {
        return this.objectView ? (this.object.deliveryDate ? new Date(this.object.deliveryDate) : null) : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'deliveryDate', value })
      },
    },

    salesOrder: {
      get() {
        return this.objectView ? this.object.salesOrder : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'salesOrder', value })
      },
    },

    salesRequest: {
      get() {
        return this.objectView ? this.object.salesRequest : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'salesRequest', value: value ? value.numberStr : value })
      },
    },

    salesReference: {
      get() {
        return this.objectView ? this.object.salesReference : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'salesReference', value })
      },
    },

    clientName: {
      get() {
        return this.objectView ? this.object.clientName : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'clientName', value })
      },
    },

    clientSurname: {
      get() {
        return this.objectView ? this.object.clientSurname : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'clientSurname', value })
      },
    },

    telephone: {
      get() {
        return this.objectView ? this.object.telephone : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'telephone', value })
      },
    },

    email: {
      get() {
        return this.objectView ? this.object.email : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'email', value })
      },
    },

    invAddress: {
      get() {
        return this.objectView ? this.object.invAddress : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'invAddress', value })
      },
    },

    postCode: {
      get() {
        return this.objectView ? this.object.postCode : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'postCode', value })
      },
    },

    city: {
      get() {
        return this.objectView ? this.object.city : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'city', value })
      },
    },

    address: {
      get() {
        return this.objectView ? this.object.address : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'address', value })
      },
    },

    postCodeInv: {
      get() {
        return this.objectView ? this.object.postCodeInv : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'postCodeInv', value })
      },
    },

    cityInv: {
      get() {
        return this.objectView ? this.object.cityInv : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'cityInv', value })
      },
    },

    addressInv: {
      get() {
        return this.objectView ? this.object.addressInv : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'addressInv', value })
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

    internalComment: {
      get() {
        return this.objectView ? this.object.internalComment : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'internalComment', value })
      },
    },

    docGroup: {
      get() {
        return this.openReclamation.docGroup
      },
      set(value) {
        this.setReclamationProperty({
          property: 'docGroup',
          value: value,
        })
      },
    },

    guarantyCard: {
      get() {
        return this.openReclamation.guarantyCard
      },
      set(value) {
        this.setReclamationProperty({
          property: 'guarantyCard',
          value: value,
        })
      },
    },

    lw: {
      get() {
        return this.openReclamation.lw
      },
      set(value) {
        this.setReclamationProperty({
          property: 'lw',
          value: value,
        })
      },
    },

    zlc: {
      get() {
        return this.object.zlc
      },
      set(value) {
        this.setReclamationProperty({
          property: 'zlc',
          value: value,
        })
      },
    },

    amount: {
      get() {
        return this.object.amount
      },
      set(value) {
        this.setReclamationProperty({
          property: 'amount',
          value: value,
        })
      },
    },

    salesPointState() {
      if (this.object.salesPoint > 0) {
        return true
      }
      return false
    },

    customerState() {
      if (this.object.customer > 0) {
        return true
      }
      return false
    },

    showHidable() {
      let returnValue = true

      if (this.userSettings) {
        for (let i = 0; i < this.userSettings.length; i++) {
          if (this.userSettings[i].userSettingItem) {
            if (this.userSettings[i].userSettingItem.key === 'mainInfoRestrictions') {
              returnValue = !this.userSettings[i].valueBoolean
            }
          }
        }
      }

      return returnValue
    },

    salesOrderState() {
      if (!this.salesOrder) return false

      if (this.salesOrder.length === 12) {
        // X1901YY00001
        const firstSymbCheck = this.onlyLetters(this.salesOrder.substring(0, 1))
        const secondSymbCheck = this.onlyLetters(this.salesOrder.substring(5, 7))
        const firstNumCheck = this.onlyDigits(this.salesOrder.substring(1, 4))
        const secondNumCheck = this.onlyDigits(this.salesOrder.substring(7, 12))
        if (firstSymbCheck && secondSymbCheck && firstNumCheck && secondNumCheck) {
          return this.salesOrder.length > 0
        } else {
          return false
        }
      } else if (this.salesOrder.length === 15) {
        // ZLC-19/10-00001
        const firstSymbCheck = this.onlyLetters(this.salesOrder.substring(0, 3))
        const secondSymbCheck = this.salesOrder.substring(3, 4) === '-'
        const thirdSymbCheck = this.salesOrder.substring(6, 7) === '/'
        const fourthSymbCheck = this.salesOrder.substring(9, 10) === '-'

        const firstNumCheck = this.onlyDigits(this.salesOrder.substring(4, 6))
        const secondNumCheck = this.onlyDigits(this.salesOrder.substring(7, 9))
        const thirdNumCheck = this.onlyDigits(this.salesOrder.substring(10, 15))

        if (firstSymbCheck && secondSymbCheck && thirdSymbCheck && fourthSymbCheck && firstNumCheck && secondNumCheck && thirdNumCheck) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },

    salesDateState() {
      if (Date.parse(this.object.salesDate)) {
        return true
      }
      return false
    },

    deliveryDateState() {
      if (Date.parse(this.object.deliveryDate)) {
        return true
      }
      return false
    },

    clientNameState() {
      return this.object.clientName ? this.object.clientName.length > 0 : false
    },

    clientSurnameState() {
      return this.object.clientSurname ? this.object.clientSurname.length > 0 : false
    },

    telephoneState() {
      return this.object.telephone ? this.object.telephone.length > 0 : false
    },

    postCodeState() {
      return this.object.postCode ? this.object.postCode.length > 0 : false
    },

    cityState() {
      return this.object.city ? this.object.city.length > 0 : false
    },

    addressState() {
      return this.object.address ? this.object.address.length > 0 : false
    },

    postCodeInvState() {
      return this.object.postCodeInv ? this.object.postCodeInv.length > 0 : false
    },

    cityInvState() {
      return this.object.cityInv ? this.object.cityInv.length > 0 : false
    },

    addressInvState() {
      return this.object.addressInv ? this.object.addressInv.length > 0 : false
    },

    clientsRestrictions() {
      if (this.$attrs.user) {
        return this.$attrs.user.externalUser
      } else {
        return false
      }
    },
  },

  async mounted() {
    await this.initialize()
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'reclamations/setObjectViewProperty',
      setObjectProperty: 'reclamations/setObjectProperty',
      delObjectView: 'reclamations/delObjectView',
      setReclamationProperty: 'reclamations/setReclamationProperty',
    }),

    async initialize() {
      this.userSettings = await this.$store.dispatch('userSettings/findAll', {})
    },

    openCustomerSearch() {
      this.customerSearchMode = true
    },

    openSalesOrderSearch() {
      this.salesOrderSearchMode = true
    },

    customerSelectedEnd(value) {
      if (value !== undefined) {
        this.setCustomer(value)
        this.changeCustomer(value)
      }

      this.customerSearchMode = false
    },

    salesOrderSelectedEnd(value) {
      if (value !== undefined) {
        this.setSalesOrder(value)
      }

      this.salesOrderSearchMode = false
    },

    async setCustomer(value) {
      this.setReclamationProperty({
        property: 'customerId',
        value: value,
      })
    },

    changeCustomer(value) {
      const customer = this.customers.find((el) => el.id === value)
      if (customer) {
        this.setReclamationProperty({
          property: 'managerId',
          value: customer.managerId,
        })
        this.setReclamationProperty({
          property: 'telephone',
          value: customer.phone,
        })
        this.setReclamationProperty({
          property: 'email',
          value: customer.email,
        })
        // this.setReclamationProperty({
        //   property: 'address',
        //   value: customer.address,
        // });
      }
      //   this.setReclamationProperty({
      //     property: 'clientName',
      //     value: '',
      //   });
      //   this.setReclamationProperty({
      //     property: 'clientSurname',
      //     value: '',
      //   });
      //   this.setReclamationProperty({
      //     property: 'email',
      //     value: '',
      //   });
      //   this.setReclamationProperty({
      //     property: 'telephone',
      //     value: '',
      //   });
      //   this.setReclamationProperty({
      //     property: 'postCode',
      //     value: '',
      //   });
      //   this.setReclamationProperty({
      //     property: 'city',
      //     value: '',
      //   });
      //   this.setReclamationProperty({
      //     property: 'address',
      //     value: '',
      //   });
      //   this.setReclamationProperty({
      //     property: 'salesOrder',
      //     value: '',
      //   });
      //   this.setReclamationProperty({
      //     property: 'salesDate',
      //     value: '',
      //   });
      //   this.setReclamationProperty({
      //     property: 'deliveryDate',
      //     value: '',
      //   });
      //   if (customer.contactPersonName) {
      //     this.setReclamationProperty({
      //       property: 'clientName',
      //       value: customer.contactPersonName,
      //     });
      //   }
      //   if (customer.contactPersonSurname) {
      //     this.setReclamationProperty({
      //       property: 'clientSurname',
      //       value: customer.contactPersonSurname,
      //     });
      //   }
      //   if (customer.phone) {
      //     this.setReclamationProperty({
      //       property: 'email',
      //       value: customer.phone,
      //     });
      //   }
      //   if (customer.email) {
      //     this.setReclamationProperty({
      //       property: 'telephone',
      //       value: customer.email,
      //     });
      //   }
      //   if (customer.postcode) {
      //     this.setReclamationProperty({
      //       property: 'postCode',
      //       value: customer.postcode,
      //     });
      //   }
      //   if (customer.region) {
      //     this.setReclamationProperty({
      //       property: 'city',
      //       value: customer.region,
      //     });
      //   }
      //   if (customer.address) {
      //     this.setReclamationProperty({
      //       property: 'address',
      //       value: customer.address,
      //     });
      //   }
      // }
    },

    async setSalesOrder(value) {
      if (value) {
        //console.log('value ', value);
        this.setReclamationProperty({
          property: 'salesOrder',
          value: value.salesOrderNumber,
        })
        this.setReclamationProperty({
          property: 'salesDate',
          value: moment(value.salesDate, 'DD MM YYYY').format('YYYY-MM-DD'),
        })

        this.setReclamationProperty({
          property: 'deliveryDate',
          value: moment(value.shipmentDate).format('YYYY-MM-DD'),
        })

        this.setReclamationProperty({
          property: 'salesRequest',
          value: value.proforma,
        })

        this.setReclamationProperty({
          property: 'salesReference',
          value: value.reference,
        })

        this.setReclamationProperty({
          property: 'responsible',
          value: value.responsible,
        })

        // this.setReclamationProperty({
        //   property: 'clientName',
        //   value: value.name,
        // });
        // this.setReclamationProperty({
        //   property: 'clientSurname',
        //   value: value.surname,
        // });
        // this.setReclamationProperty({
        //   property: 'telephone',
        //   value: value.telephone,
        // });
        // this.setReclamationProperty({
        //   property: 'email',
        //   value: value.email,
        // });
        this.setReclamationProperty({
          property: 'postCode',
          value: value.postCode,
        })
        // this.setReclamationProperty({
        //   property: 'city',
        //   value: value.city,
        // });
        this.setReclamationProperty({
          property: 'address',
          value: value.address,
        })
      }
    },

    onlyLetters(str) {
      return /^[a-zA-Z]+$/.test(str)
    },

    onlyDigits(str) {
      return /^\d+$/.test(str)
    },

    // async getSalesPoints() {
    //   await this.$store.dispatch('salesPoints/findAll', {});
    // },
  },

  // <b-alert show variant="warning">
  //   <strong>UWAGA! Brak protokołu weryfikacji zgłoszenia. </strong>
  //   Protokół możesz dodać na zakładce "Pliki"
  // </b-alert>

  //   <b-form-group label="Punkt sprzedaży" label-for="sales_point2">
  //     <b-input-group class="mb-2">
  //       <b-form-select
  //         id="sales_point2"
  //         v-model="salesPoint"
  //         :options="sales_points"
  //         :state="salesPointState"
  //         name="customer_label"
  //         text-field="name"
  //         value-field="id"
  //         aria-describedby="customer-feedback"
  //       />
  //     </b-input-group>
  //   </b-form-group>
  // </b-col>
}
</script>

<template>
  <div class="card mb-2">
    <div class="card-body pl-2 pb-0 pr-2 pt-2">
      <b-row>
        <b-col md="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.customer')">
            <f-select v-model="customer" size="sm" select-btn open-btn value-type="counterparties" detail-view="counterparties-detail" placeholder="Wyszukaj klienta..."></f-select>
          </b-form-group>
          <b-form-invalid-feedback id="customer-feedback"> To pole nie może być puste </b-form-invalid-feedback>
        </b-col>
        <b-col md="4">
          <!-- <b-form-group label-for="agreementNumber"> -->

          <b-form-group horizontal :label-cols="3" label="Umowa">
            <b-form-input id="salesOrderId" v-model="salesOrder" size="sm" :state="salesOrderState" placeholder="Umowa"></b-form-input>
          </b-form-group>

          <b-form-invalid-feedback id="salesOrderFeedback" :state="salesOrderState">
            <a href="javascript:void(0);" @click="showFormatForm = true"><i class="ri-information-line"></i></a>
          </b-form-invalid-feedback>
          <!-- </b-form-group> -->
        </b-col>
        <b-col md="4">
          <b-form-group horizontal :label-cols="4" label="Data sprzedaży">
            <date-picker id="reclDate" v-model="salesDate" size="sm" value-type="date" type="date"></date-picker>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4" v-if="!mainInfoRestrictions">
          <b-form-group horizontal :label-cols="3" label="Oferta">
            <f-select
              label="numberStr"
              v-model="salesRequest"
              size="sm"
              select-btn
              open-btn
              value-type="customerRequests"
              detail-view="customer-request-detail"
              placeholder="Wyszukaj umowe..."
            ></f-select>
          </b-form-group>
        </b-col>
        <b-col md="4" v-if="!mainInfoRestrictions">
          <b-form-group horizontal :label-cols="3" label="Referencja">
            <b-form-input id="salesReferenceId" v-model="salesReference" size="sm" placeholder="Nr referencji"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="4" v-if="!mainInfoRestrictions">
          <b-form-group horizontal :label-cols="4" label="Data wysyłki">
            <date-picker id="reclDate" v-model="deliveryDate" size="sm" value-type="date" type="date"></date-picker>
          </b-form-group>
        </b-col>
        <!-- <b-col md="3">          
          <b-form-group label="Karta gwarancyjna" label-for="guarantyCard">
            <b-form-checkbox 
              v-model="guarantyCard" 
              id="guarantyCard"
              name="guarantyCard-1"
              switch>
            </b-form-checkbox>
          </b-form-group>
        </b-col> -->
      </b-row>

      <b-row>
        <b-col md="6">
          <b-form-group horizontal :label-cols="2" label="Imie">
            <b-form-input id="clientNameId" v-model="clientName" size="sm" :state="clientNameState" placeholder="Imie"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal :label-cols="2" label="Nazwisko">
            <b-form-input id="clientSurnameId" v-model="clientSurname" size="sm" :state="clientSurnameState" placeholder="Nazwisko"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4">
          <b-form-group horizontal :label-cols="3" label="Nr. tel">
            <b-form-input id="telephoneId" v-model="telephone" size="sm" :state="telephoneState" placeholder="Telefon"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group horizontal :label-cols="3" label="E-mail">
            <b-form-input id="emailId" v-model="email" size="sm" placeholder="Email"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group horizontal :label-cols="6" label="Adres budowy">
            <b-form-checkbox id="invAddress" v-model="invAddress" name="invAddress-1" switch class="mt-1"> </b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="4">
          <b-form-group horizontal :label-cols="5" label="Kod poczt.">
            <b-form-input id="postCode" v-model="postCode" size="sm" :state="postCodeState" placeholder="Kod pocztowy"> </b-form-input>
          </b-form-group>
        </b-col>
        <!-- <b-col md="3">
          <label for="buildingLocation">Miejscowość</label>
          <b-form-input
            id="buildingLocation"
            v-model="city"
            :state="cityState"
            placeholder="Miejscowość budowy"
          ></b-form-input>
        </b-col> -->
        <b-col md="8">
          <b-form-group horizontal :label-cols="3" label="Adres korespondencyjny">
            <b-form-input id="korrespAddress" v-model="address" size="sm" :state="addressState" placeholder="Adres korespondencyjny"> </b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-if="invAddress">
        <b-col md="4">
          <b-form-group horizontal :label-cols="5" label="Kod poczt. budowy">
            <b-form-input id="postCode" size="sm" v-model="postCodeInv" :state="postCodeInvState" placeholder="Kod pocztowy"> </b-form-input>
          </b-form-group>
        </b-col>
        <!-- <b-col md="3">
          <label for="buildingLocation">Miejscowość budowy</label>
          <b-form-input
            id="buildingLocation"
            v-model="cityInv"
            :state="cityInvState"
            placeholder="Miejscowość budowy"
          ></b-form-input>
        </b-col> -->
        <b-col md="8">
          <b-form-group horizontal :label-cols="3" label="Adres budowy">
            <b-form-input id="korrespAddress" size="sm" v-model="addressInv" :state="addressInvState" placeholder="Adres korespondencyjny"> </b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row v-if="object.id !== null">
        <b-col md="6">
          <b-form-group label="Komentarz" label-for="comment">
            <b-form-textarea id="comment" v-model="comment" rows="3"> </b-form-textarea>
          </b-form-group>
        </b-col>
        <b-col v-if="!clientsRestrictions" md="6">
          <b-form-group label="Komentarz wewnętrzny" label-for="internalComment">
            <b-form-textarea id="internalComment" v-model="internalComment" rows="3"> </b-form-textarea>
          </b-form-group>
        </b-col>
      </b-row>
    </div>

    <b-modal v-model="showFormatForm" hide-footer size="lg" title="Format numeru umowy">
      <b-row>
        <b-col>
          Podano błędny numer umowy. Prawidłowy numer umowy powinien być zbudowany w następujący sposób X1901YY00001 lub w przypadku zamówień pojedynczych elementów ZLC-19/10-00001
          gdzie:<br />
          X - rodzaj umowy produkcyjnej (A,B,P)<br />
          YY- symbol Przedstawiciela<br />
        </b-col>
      </b-row>
    </b-modal>

    <SearchCustomer v-if="customerSearchMode" @value-selected="customerSelectedEnd" />

    <SearchSalesOrder v-if="salesOrderSearchMode" @salesOrder-selected="salesOrderSelectedEnd" />
  </div>
</template>
