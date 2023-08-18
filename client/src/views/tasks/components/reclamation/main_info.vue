<script>
import { mapGetters, mapMutations } from 'vuex'
import SearchCustomer from '@/views/counterparties/select'
import SearchSalesOrder from '@/components/reclamation/search-salesOrder'

import moment from 'moment'

export default {
  name: 'TaskMainInfo',
  components: {
    SearchCustomer,
    SearchSalesOrder,
  },

  props: {
    mode: {
      type: String,
      default: 'vertical',
    },
    salesOrderStateMessage: {
      type: String,
      default: '',
    },
    showFormatForm: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      showPossitionModalForm: false,
      customerSearchMode: false,
      salesOrderSearchMode: false,
      menuItems: '',
      menuRef: null,
    }
  },

  computed: {
    ...mapGetters({
      openReclamation: 'reclamations/openReclamation',
      sales_points: 'salesPoints/salesPointsList',
      customers: 'counterparties/customerList',
    }),

    sales_point: {
      get() {
        return this.openReclamation.salesPoint
      },
      set(value) {
        const doc_group = this.sales_points.find((el) => el.id === value)
        if (doc_group) {
          this.setReclamationProperty({
            property: 'docGroup',
            value: doc_group.group,
          })
        }
        this.setReclamationProperty({
          property: 'salesPoint',
          value: value,
        })
      },
    },

    customer: {
      get() {
        return this.openReclamation.customer
      },
      set(value) {
        // const doc_group =  this.sales_points.find((el) => el.id === value);
        // if (doc_group) {
        //     this.setReclamationProperty({
        //       property: 'doc_group',
        //       value: doc_group.group,
        //     })
        // }
        this.setReclamationProperty({
          property: 'customer',
          value: value,
        })
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

    salesOrder: {
      get() {
        return this.openReclamation.salesOrder
      },
      set(value) {
        this.setReclamationProperty({
          property: 'salesOrder',
          value: value,
        })
      },
    },

    salesDate: {
      get() {
        return moment(this.openReclamation.salesDate).format('YYYY-MM-DD')
      },
      set(value) {
        this.setReclamationProperty({
          property: 'salesDate',
          value: moment(value).format('YYYY-MM-DD'),
        })
      },
    },

    deliveryDate: {
      get() {
        return moment(this.openReclamation.deliveryDate).format('YYYY-MM-DD')
      },
      set(value) {
        this.setReclamationProperty({
          property: 'deliveryDate',
          value: moment(value).format('YYYY-MM-DD'),
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

    invAddress: {
      get() {
        return this.openReclamation.invAddress
      },
      set(value) {
        this.setReclamationProperty({
          property: 'invAddress',
          value: value,
        })
      },
    },

    clientName: {
      get() {
        return this.openReclamation.clientName
      },
      set(value) {
        this.setReclamationProperty({
          property: 'clientName',
          value: value,
        })
      },
    },

    clientSurname: {
      get() {
        return this.openReclamation.clientSurname
      },
      set(value) {
        this.setReclamationProperty({
          property: 'clientSurname',
          value: value,
        })
      },
    },

    telephone: {
      get() {
        return this.openReclamation.telephone
      },
      set(value) {
        this.setReclamationProperty({
          property: 'telephone',
          value: value,
        })
      },
    },

    email: {
      get() {
        return this.openReclamation.email
      },
      set(value) {
        this.setReclamationProperty({
          property: 'email',
          value: value,
        })
      },
    },

    postCode: {
      get() {
        return this.openReclamation.postCode
      },
      set(value) {
        this.setReclamationProperty({
          property: 'postCode',
          value: value,
        })
      },
    },

    city: {
      get() {
        return this.openReclamation.city
      },
      set(value) {
        this.setReclamationProperty({
          property: 'city',
          value: value,
        })
      },
    },

    address: {
      get() {
        return this.openReclamation.address
      },
      set(value) {
        this.setReclamationProperty({
          property: 'address',
          value: value,
        })
      },
    },

    postCodeInv: {
      get() {
        return this.openReclamation.postCodeInv
      },
      set(value) {
        this.setReclamationProperty({
          property: 'postCodeInv',
          value: value,
        })
      },
    },

    cityInv: {
      get() {
        return this.openReclamation.cityInv
      },
      set(value) {
        this.setReclamationProperty({
          property: 'cityInv',
          value: value,
        })
      },
    },

    salesRequest: {
      get() {
        return this.openReclamation.salesRequest
      },
      set(value) {
        this.setReclamationProperty({
          property: 'salesRequest',
          value: value,
        })
      },
    },

    salesReference: {
      get() {
        return this.openReclamation.salesReference
      },
      set(value) {
        this.setReclamationProperty({
          property: 'salesReference',
          value: value,
        })
      },
    },

    addressInv: {
      get() {
        return this.openReclamation.addressInv
      },
      set(value) {
        this.setReclamationProperty({
          property: 'addressInv',
          value: value,
        })
      },
    },

    comment: {
      get() {
        return this.openReclamation.comment
      },
      set(value) {
        this.setReclamationProperty({
          property: 'comment',
          value: value,
        })
      },
    },

    internalComment: {
      get() {
        return this.openReclamation.internalComment
      },
      set(value) {
        this.setReclamationProperty({
          property: 'internalComment',
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
        return this.openReclamation.zlc
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
        return this.openReclamation.amount
      },
      set(value) {
        this.setReclamationProperty({
          property: 'amount',
          value: value,
        })
      },
    },

    salesPointState() {
      if (this.openReclamation.salesPoint > 0) {
        return true
      }
      return false
    },

    customerState() {
      if (this.openReclamation.customer > 0) {
        return true
      }
      return false
    },

    salesOrderState() {
      // if (this.openReclamation.salesOrder.length === 12) {
      // // X1901YY00001
      // const firstSymbCheck = this.onlyLetters(this.openReclamation.salesOrder.substring(0, 1));
      // const secondSymbCheck = this.onlyLetters(this.openReclamation.salesOrder.substring(5, 7));
      // const firstNumCheck = this.onlyDigits(this.openReclamation.salesOrder.substring(1, 4));
      // const secondNumCheck = this.onlyDigits(this.openReclamation.salesOrder.substring(7, 12));
      // if (firstSymbCheck && secondSymbCheck && firstNumCheck && secondNumCheck) {
      return true
      // } else {
      //   this.salesOrderStateMessage = 'Podaj numer zamówienia w prawidłowym formacie';
      //   return false;
      // }

      // } else if (this.openReclamation.salesOrder.length === 15) {
      //   // ZLC-19/10-00001
      //   const firstSymbCheck = this.onlyLetters(this.openReclamation.salesOrder.substring(0, 3));
      //   const secondSymbCheck = (this.openReclamation.salesOrder.substring(3, 4)==='-');
      //   const thirdSymbCheck = (this.openReclamation.salesOrder.substring(6, 7)==='/');
      //   const fourthSymbCheck = (this.openReclamation.salesOrder.substring(9, 10)==='-');

      //   const firstNumCheck = this.onlyDigits(this.openReclamation.salesOrder.substring(4, 6));
      //   const secondNumCheck = this.onlyDigits(this.openReclamation.salesOrder.substring(7, 9));
      //   const thirdNumCheck = this.onlyDigits(this.openReclamation.salesOrder.substring(10, 15));

      //   if (firstSymbCheck && secondSymbCheck && thirdSymbCheck && fourthSymbCheck && firstNumCheck && secondNumCheck && thirdNumCheck) {
      //     return true;
      //   } else {
      //     this.salesOrderStateMessage = 'Podaj numer zamówienia w prawidłowym formacie';
      //      return false;
      //   }
      // } else {
      //   this.salesOrderStateMessage = 'Podaj numer zamówienia w prawidłowym formacie';
      //   return false;
      // }
    },

    salesDateState() {
      if (Date.parse(this.openReclamation.salesDate)) {
        return true
      }
      return false
    },

    deliveryDateState() {
      if (Date.parse(this.openReclamation.deliveryDate)) {
        return true
      }
      return false
    },

    clientNameState() {
      return this.openReclamation.clientName.length > 0
    },

    clientSurnameState() {
      return this.openReclamation.clientSurname.length > 0
    },

    telephoneState() {
      return this.openReclamation.telephone.length > 0
    },

    postCodeState() {
      return this.openReclamation.postCode.length > 0
    },

    cityState() {
      return this.openReclamation.city.length > 0
    },

    addressState() {
      return this.openReclamation.address.length > 0
    },

    postCodeInvState() {
      return this.openReclamation.postCodeInv.length > 0
    },

    cityInvState() {
      return this.openReclamation.cityInv.length > 0
    },

    addressInvState() {
      return this.openReclamation.addressInv.length > 0
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
      setReclamationProperty: 'reclamations/setReclamationProperty',
    }),

    showSalesOrderFormatRequirements() {
      this.showFormatForm = true
    },

    async initialize() {
      // await this.getSalesPoints();
      await this.getCustomers()

      if (!this.openReclamation.salesPoint) {
        if (this.sales_points.length === 1 && this.openReclamation.id === null) {
          this.setReclamationProperty({
            property: 'salesPoint',
            value: this.sales_points[0].id,
          })
        }
      }
    },

    async getCustomers() {
      await this.$store.dispatch('counterparties/findAll', {})
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
        property: 'customer',
        value: value,
      })
    },

    changeCustomer(value) {
      const customer = this.customers.find((el) => el.id === value)
      if (customer) {
        this.setReclamationProperty({
          property: 'clientName',
          value: '',
        })
        this.setReclamationProperty({
          property: 'clientSurname',
          value: '',
        })
        this.setReclamationProperty({
          property: 'email',
          value: '',
        })
        this.setReclamationProperty({
          property: 'telephone',
          value: '',
        })
        this.setReclamationProperty({
          property: 'postCode',
          value: '',
        })

        this.setReclamationProperty({
          property: 'city',
          value: '',
        })
        this.setReclamationProperty({
          property: 'address',
          value: '',
        })

        this.setReclamationProperty({
          property: 'salesOrder',
          value: '',
        })
        this.setReclamationProperty({
          property: 'salesDate',
          value: '',
        })
        this.setReclamationProperty({
          property: 'deliveryDate',
          value: '',
        })

        if (customer.contactPersonName) {
          this.setReclamationProperty({
            property: 'clientName',
            value: customer.contactPersonName,
          })
        }
        if (customer.contactPersonSurname) {
          this.setReclamationProperty({
            property: 'clientSurname',
            value: customer.contactPersonSurname,
          })
        }
        if (customer.phone) {
          this.setReclamationProperty({
            property: 'email',
            value: customer.phone,
          })
        }
        if (customer.email) {
          this.setReclamationProperty({
            property: 'telephone',
            value: customer.email,
          })
        }

        if (customer.postcode) {
          this.setReclamationProperty({
            property: 'postCode',
            value: customer.postcode,
          })
        }

        if (customer.region) {
          this.setReclamationProperty({
            property: 'city',
            value: customer.region,
          })
        }
        if (customer.address) {
          this.setReclamationProperty({
            property: 'address',
            value: customer.address,
          })
        }
      }
    },

    async setSalesOrder(value) {
      if (value) {
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
        // this.setReclamationProperty({
        //   property: 'postCode',
        //   value: value.postCode,
        // });
        // this.setReclamationProperty({
        //   property: 'city',
        //   value: value.city,
        // });
        // this.setReclamationProperty({
        //   property: 'address',
        //   value: value.address,
        // });
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
  <div class="card">
    <div class="card-body">
      <b-row>
        <b-col md="3">
          <b-form-group label="Klient" label-for="customer">
            <b-input-group class="mb-2">
              <b-form-select
                id="customer"
                v-model="customer"
                :options="customers"
                name="customer"
                text-field="name"
                value-field="id"
                :state="customerState"
                size="sm"
                :disabled="true"
                aria-describedby="customer-feedback"
                @change="changeCustomer(customer)"
              />
            </b-input-group>
            <b-form-invalid-feedback id="customer-feedback">
              <!-- This will only be shown if the preceeding input has an invalid state -->
              To pole nie może być puste
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="Nr umowy" label-for="agreementNumber">
            <b-input-group class="mb-2">
              <b-form-input id="agreementNumber" v-model="salesOrder" :disabled="true" :state="salesOrderState" placeholder="Numer umowy" aria-describedby="salesOrderFeedback">
              </b-form-input>
              <template v-slot:append>
                <b-button
                  id="sales-order-search"
                  :variant="salesOrderState ? 'success' : 'danger'"
                  :state="salesOrderState"
                  :disabled="true"
                  size="sm"
                  @click="openSalesOrderSearch"
                >
                  <i class="ri-search-line"></i>
                </b-button>
              </template>
            </b-input-group>
          </b-form-group>
          <b-form-invalid-feedback id="salesOrderFeedback">
            <b-link href="javascript:void(0);" @click="showSalesOrderFormatRequirements">{{ salesOrderStateMessage }}</b-link>
            <i class="ri-information-line"></i>
          </b-form-invalid-feedback>
        </b-col>
        <b-col v-if="!clientsRestrictions" md="3">
          <label for="salesRequestId">Oferta</label>
          <b-form-input id="salesRequestId" v-model="salesRequest" :disabled="true" placeholder="Nr oferty"></b-form-input>
        </b-col>
        <b-col v-if="!clientsRestrictions" md="3">
          <label for="salesReferenceId">Referencja</label>
          <b-form-input id="salesReferenceId" v-model="salesReference" :disabled="true" placeholder="Nr referencji"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3">
          <b-form-group label="Data sprzedaży" label-for="salesDate">
            <b-form-input id="salesDate" v-model="salesDate" :state="salesDateState" :disabled="true" type="date"> </b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="Data wysyłki" label-for="deliveryDateId">
            <b-form-input id="deliveryDateId" v-model="deliveryDate" :state="deliveryDateState" :disabled="true" type="date"> </b-form-input>
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
        <b-col md="3">
          <b-form-group label="Adres budowy" label-for="invAddress">
            <b-form-checkbox id="invAddress" v-model="invAddress" :disabled="true" name="invAddress-1" switch> </b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row class="mb-2">
        <b-col md="6">
          <label for="name">Imię</label>
          <b-form-input id="name" v-model="clientName" :disabled="true" placeholder="Imię"> </b-form-input>
        </b-col>
        <b-col md="6">
          <label for="surname">Nazwisko</label>
          <b-form-input id="surname" v-model="clientSurname" :disabled="true" placeholder="Nazwisko"> </b-form-input>
        </b-col>
      </b-row>
      <b-row class="mb-2">
        <b-col md="6">
          <label for="telNumer">Numer telefonu</label>
          <b-form-input id="telNumer" v-model="telephone" :disabled="true" placeholder="Numer telefonu"></b-form-input>
        </b-col>
        <b-col md="6">
          <label for="email">Email</label>
          <b-form-input id="email" v-model="email" :disabled="true" placeholder="Email"> </b-form-input>
        </b-col>
      </b-row>
      <b-row class="mb-2">
        <b-col md="3">
          <label for="postCode">Kod poczt.</label>
          <b-form-input id="postCode" v-model="postCode" :disabled="true" :state="postCodeState" placeholder="Kod pocztowy"> </b-form-input>
        </b-col>
        <!-- <b-col md="3">
          <label for="buildingLocation">Miejscowość</label>
          <b-form-input
            id="buildingLocation"
            v-model="city"
            :disabled="true"
            :state="cityState"
            placeholder="Miejscowość budowy"
          ></b-form-input>
        </b-col> -->
        <b-col md="6">
          <label for="korrespAddress">Adres korespondencyjny</label>
          <b-form-input id="korrespAddress" v-model="address" :state="addressState" :disabled="true" placeholder="Adres korespondencyjny"></b-form-input>
        </b-col>
      </b-row>
      <b-row v-if="invAddress" class="mb-2">
        <b-col md="3">
          <label for="postCode">Kod poczt. budowy</label>
          <b-form-input id="postCode" v-model="postCodeInv" :state="postCodeInvState" :disabled="true" placeholder="Kod pocztowy"> </b-form-input>
        </b-col>
        <!-- <b-col md="3">
          <label for="buildingLocation">Miejscowość budowy</label>
          <b-form-input
            id="buildingLocation"
            v-model="cityInv"
            :disabled="true"
            :state="cityInvState"
            placeholder="Miejscowość budowy"
          ></b-form-input>
        </b-col> -->
        <b-col md="6">
          <label for="korrespAddress">Adres budowy</label>
          <b-form-input id="korrespAddress" v-model="addressInv" :disabled="true" :state="addressInvState" placeholder="Adres korespondencyjny"></b-form-input>
        </b-col>
      </b-row>

      <b-row v-if="openReclamation.id !== null">
        <b-col md="6">
          <b-form-group label="Komentarz" label-for="comment" class="mb-3">
            <b-form-textarea id="comment" v-model="comment" :disabled="true" rows="5"> </b-form-textarea>
          </b-form-group>
        </b-col>
        <b-col v-if="!clientsRestrictions" md="6">
          <b-form-group label="Komentarz wewnętrzny" label-for="internalComment" class="mb-3">
            <b-form-textarea id="internalComment" v-model="internalComment" :disabled="true" rows="5"> </b-form-textarea>
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
