<template>
  <Layout>
    <PageHeader :title="title" />

    <b-card class="mt-2">
      <b-row class="align-items-center m-1">
        <b-button variant="success" @click="writeObject" class="mr-1" size="sm">
          <i class="ri-file-add-line mr-1"></i>
          {{ $t('commands.writeAndClose') }}
        </b-button>
        <b-button variant="outline-secondary" class="mr-1" size="sm">
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
        <b-button variant="outline-secondary" class="mr-1" size="sm" :disabled="!object.id" @click="subordinationShowMode = true">
          <i class="ri-node-tree"></i>
        </b-button>
        <b-dropdown variant="outline-secondary" :text="$t('commands.createFrom')" size="sm">
          <b-dropdown-item @click="createDisposition">Dyspozycję</b-dropdown-item>
        </b-dropdown>
        <b-dropdown variant="outline-secondary" :text="$t('commands.print')" class="ml-1" size="sm">
          <b-dropdown-item @click="openPrintForm('order-print')">Zlecenie</b-dropdown-item>
        </b-dropdown>
        <!-- <b-dropdown variant="outline-secondary" class="ml-1" :text="$t('commands.more')" size="sm"> </b-dropdown> -->
      </b-row>

      <b-row>
        <b-col>
          <b-row class="m-1">
            <b-input-group>
              <p class="mt-1 mr-1" style="width: 150px"> Numer: </p>
              <b-form-input id="numberId" size="sm" v-model="number" type="text"> </b-form-input>

              <p class="mt-1 mr-1 m-1"> Data: </p>
              <b-form-input id="dateId" size="sm" v-model="date" type="date"> </b-form-input>

              <p class="mt-1 mr-1 m-1"> Typ dokumentu: </p>
              <b-form-select id="typesOfDocumentsId" v-model="typeOfDocument" :options="typesOfDocuments" name="typesOfDocuments" size="sm" />

              <p class="mt-1 mr-1 m-1"> Status: </p>
              <b-form-select id="dispositionStatesId" v-model="state" :options="dispositionStates" name="dispositionStates" size="sm" />
            </b-input-group>
            <b-input-group>
              <p class="mt-1 mr-1" style="width: 150px"> Dyspozycja: </p>
              <b-form-select id="dispositionTypesId" v-model="type" :options="dispositionTypes" name="dispositionTypes" size="sm" />

              <p class="mt-1 mr-1 m-1"> Stanowisko wagowe: </p>
              <b-form-select id="weighingStationsId" v-model="weighingStationId" :options="weighingStations" name="weighingStations" size="sm" />

              <p class="mt-1 mr-1 m-1"> Waga: </p>
              <b-form-select id="scalesId" v-model="scaleId" :options="scales" name="scales" size="sm" />

              <p class="mt-1 mr-1 m-1"> Waga 2 waż: </p>
              <b-form-select id="scalesTwoId" v-model="scaleTwoId" :options="scales" name="scalesTwo" size="sm" />
            </b-input-group>
          </b-row>
          <b-row class="p-1">
            <b-col cols="7">
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Kierowca: </p>
                <v-select
                  v-model="driverId"
                  :options="drivers"
                  :reduce="(option) => option.value"
                  label="text"
                  placeholder="Wybierz kierowce..."
                  size="sm"
                  @search="onSearchDriver"
                >
                </v-select>

                <p class="mt-1 mr-1 m-1"> Stan kolejki samochodów: </p>
                <b-form-select id="carQueueStatusesId" v-model="carsQueueStatus" :options="carQueueStatuses" name="carQueueStatuses" size="sm" />
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Numer samochodu: </p>
                <v-select
                  v-model="vehicleId"
                  :options="vehicles"
                  :reduce="(option) => option.value"
                  label="text"
                  placeholder="Wybierz samochód..."
                  size="sm"
                  @search="onSearchVehicle"
                >
                </v-select>

                <p class="mt-1 mr-1 m-1"> Naczepa: </p>
                <v-select
                  v-model="trailerId"
                  :options="trailers"
                  :reduce="(option) => option.value"
                  label="text"
                  placeholder="Wybierz naczepe..."
                  size="sm"
                  @search="onSearchTrailer"
                >
                </v-select>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Przewoźnik: </p>
                <v-select
                  v-model="carrierId"
                  :options="carriers"
                  :reduce="(option) => option.value"
                  label="text"
                  placeholder="Wybierz przewoźnika..."
                  size="sm"
                  @search="onSearchCarrier"
                >
                </v-select>
              </b-input-group>
            </b-col>
            <b-col cols="5">
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 170px"> Numer telefonu kierowcy: </p>
                <b-form-input id="driverPhoneNumberId" size="sm" v-model="driverPhoneNumber" type="text"> </b-form-input>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 170px"> Numer dowodu: </p>
                <b-form-input id="driverTicketId" size="sm" v-model="driverTicket" type="text"> </b-form-input>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 170px"> Data przyjazdu kierowcy: </p>
                <b-form-input id="arrivalDateDriverId" size="sm" v-model="arrivalDateDriver" type="date"> </b-form-input>
              </b-input-group>
            </b-col>
          </b-row>
          <b-row class="p-1">
            <b-col cols="6">
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Zlecenie: </p>
                <v-select v-model="orderId" :options="orders" :reduce="(option) => option.value" label="text" placeholder="Wybierz zlecenie..." size="sm" @search="onSearchOrder">
                </v-select>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Towar: </p>
                <v-select
                  v-model="productId"
                  :options="products"
                  :reduce="(option) => option.value"
                  label="text"
                  placeholder="Wybierz towar..."
                  size="sm"
                  @search="onSearchProduct"
                >
                </v-select>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Statek: </p>
                <v-select v-model="shipId" :options="ships" :reduce="(option) => option.value" label="text" placeholder="Wybierz statek..." size="sm" @search="onSearchShip">
                </v-select>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Spedytor: </p>
                <v-select
                  v-model="forwarderId"
                  :options="forwarders"
                  :reduce="(option) => option.value"
                  label="text"
                  placeholder="Wybierz spedytora..."
                  size="sm"
                  @search="onSearchForwarder"
                >
                </v-select>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Odbiorca: </p>
                <v-select
                  v-model="customerId"
                  :options="customers"
                  :reduce="(option) => option.value"
                  label="text"
                  placeholder="Wybierz odbiorce..."
                  size="sm"
                  @search="onSearchCustomer"
                >
                </v-select>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Dostawca: </p>
                <v-select
                  v-model="vendorId"
                  :options="vendors"
                  :reduce="(option) => option.value"
                  label="text"
                  placeholder="Wybierz dostawce..."
                  size="sm"
                  @search="onSearchVendor"
                >
                </v-select>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Sektor magazynu: </p>
                <v-select v-model="boxId" :options="boxes" :reduce="(option) => option.value" label="text" placeholder="Wybierz sektor magazynu..." size="sm" @search="onSearchBox">
                </v-select>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Miejsce: </p>
                <v-select
                  v-model="warehouseId"
                  :options="warehouses"
                  :reduce="(option) => option.value"
                  label="text"
                  placeholder="Wybierz miejsce..."
                  size="sm"
                  @search="onSearchWarehouse"
                >
                </v-select>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Numer awiza / składu: </p>
                <b-form-input id="driverPhoneNumberId" size="sm" v-model="barCode" type="text"> </b-form-input>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Nr listu przewozowego: </p>
                <b-form-input id="deliveryNoteNumberId" size="sm" v-model="deliveryNoteNumber" type="text"> </b-form-input>
              </b-input-group>
            </b-col>
            <b-col cols="6">
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Deklarowany tonaż: </p>
                <b-form-input id="quantityId" size="sm" v-model="quantity" type="number"> </b-form-input>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Relacja: </p>
                <v-select
                  v-model="schemeOfCargoId"
                  :options="schemesOfCargo"
                  :reduce="(option) => option.value"
                  label="text"
                  placeholder="Wybierz relacje..."
                  size="sm"
                  @search="onSearchSchemeOfCargo"
                >
                </v-select>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Rodzaj transakcji: </p>
                <b-form-select id="typesOfOperationsId" v-model="typeOfOperation" :options="typesOfOperations" name="typesOfOperations" size="sm" />
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Wielokrotność: </p>
                <b-form-input id="numberOfWeighingsId" size="sm" v-model="numberOfWeighings" type="number"> </b-form-input>

                <p class="mt-1 mr-1 m-1" style="width: 150px"> Wykonane: </p>
                <b-form-input id="numberOfWeightedId" size="sm" v-model="numberOfWeighted" type="number"> </b-form-input>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Stanowisko: </p>
                <v-select
                  v-model="positionId"
                  :options="positions"
                  :reduce="(option) => option.value"
                  label="text"
                  placeholder="Wybierz stanowisko..."
                  size="sm"
                  @search="onSearchPosition"
                >
                </v-select>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Kopalnia: </p>
                <v-select v-model="mineId" :options="mines" :reduce="(option) => option.value" label="text" placeholder="Wybierz kopalnie..." size="sm" @search="onSearchMine">
                </v-select>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Asortyment: </p>
                <v-select
                  v-model="assortmentId"
                  :options="assortments"
                  :reduce="(option) => option.value"
                  label="text"
                  placeholder="Wybierz asortyment..."
                  size="sm"
                  @search="onSearchAssortment"
                >
                </v-select>
              </b-input-group>
              <b-input-group>
                <p class="mt-1 mr-1" style="width: 150px"> Data przyjęcia: </p>
                <b-form-input id="dateIssueDSKId" size="sm" v-model="dateIssueDSK" type="date"> </b-form-input>
              </b-input-group>
            </b-col>
          </b-row>
          <b-row class="p-1">
            <b-col>
              <b-tabs card>
                <b-tab title="Komentarze">
                  <b-row class="p-1">
                    <a href="#" class="d-flex mr-1">
                      <i class="ri-file-add-line mr-1"></i>
                      Dodaj korespondencję
                    </a>
                  </b-row>
                  <b-row>
                    <b-col cols="6">
                      <p class="mt-1 mr-1"> Korespondencja: </p>
                      <b-form-textarea id="correspondenceId" size="sm" v-model="correspondence" type="text"> </b-form-textarea>
                    </b-col>
                    <b-col cols="6">
                      <p class="mt-1 mr-1"> Komentarz: </p>
                      <b-form-textarea id="commentId" size="sm" v-model="comment" type="text"> </b-form-textarea>
                    </b-col>
                  </b-row>
                </b-tab>
                <b-tab title="Usługi"> </b-tab>
              </b-tabs>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import TypesOfDocuments from '@/constants/documentTypes'
import TypesOfOperations from '@/constants/operationTypes'
import DispositionStates from '@/constants/dispositionStates'
import DispositionTypes from '@/constants/dispositionTypes'
import CarQueueStatuses from '@/constants/carQueueStatuses'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'

/**
 * Orders component
 */
export default {
  name: 'DispositionDetailOld',
  page() {
    return { title: this.$t('common.dispositionData'), meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: this.$t('common.dispositionData'),
      orders: [],
      products: [],
      ships: [],
      forwarders: [],
      vendors: [],
      customers: [],
      typesOfDocuments: [],
      typesOfOperations: [],
      dispositionStates: [],
      dispositionTypes: [],
      weighingStations: [],
      scales: [],
      drivers: [],
      schemesOfCargo: [],
      carQueueStatuses: [],
      assortments: [],
      mines: [],
      positions: [],
      vehicles: [],
      trailers: [],
      warehouses: [],
      carriers: [],
      boxes: [],

      services: [
        { key: 'count', label: 'N', sortable: true },
        { key: 'service', label: 'Service', sortable: true },
        { key: 'amount', label: 'Amount', sortable: true },
      ],

      viewId: this.$route.params.id,
    }
  },

  async created() {
    await this.initialize()
  },

  computed: {
    ...mapGetters({
      getObjectView: 'dispositions/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    id: {
      get() {
        return this.objectView ? this.objectView.object.id : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'id', value })
      },
    },

    number: {
      get() {
        return this.objectView ? this.objectView.object.number : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'number', value })
      },
    },

    date: {
      get() {
        return this.objectView ? moment(this.objectView.object.date).format('YYYY-MM-DD') : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'date', value: moment(value).format('YYYY-MM-DD') })
      },
    },

    dateIssueDSK: {
      get() {
        return this.objectView ? moment(this.objectView.object.dateIssueDSK).format('YYYY-MM-DD') : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'dateIssueDSK', value: moment(value).format('YYYY-MM-DD') })
      },
    },

    typeOfDocument: {
      get() {
        return this.objectView ? this.objectView.object.typeOfDocument : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'typeOfDocument', value })
      },
    },

    typeOfOperation: {
      get() {
        return this.objectView ? this.objectView.object.typeOfOperation : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'typeOfOperation', value })
      },
    },

    scaleId: {
      get() {
        return this.objectView ? this.objectView.object.scaleId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'scaleId', value })
      },
    },

    scale: {
      get() {
        return this.objectView ? this.objectView.object.scale : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'scale  ', value })
      },
    },

    scaleTwoId: {
      get() {
        return this.objectView ? this.objectView.object.scaleTwoId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'scaleTwoId', value })
      },
    },

    scaleTwo: {
      get() {
        return this.objectView ? this.objectView.object.scaleTwo : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'scaleTwo', value })
      },
    },

    barCode: {
      get() {
        return this.objectView ? this.objectView.object.barCode : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'barCode  ', value })
      },
    },

    driverTicket: {
      get() {
        return this.objectView ? this.objectView.object.driverTicket : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'driverTicket  ', value })
      },
    },

    quantity: {
      get() {
        return this.objectView ? this.objectView.object.quantity : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'quantity', value })
      },
    },

    deliveryNoteNumber: {
      get() {
        return this.objectView ? this.objectView.object.deliveryNoteNumber : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'deliveryNoteNumber', value })
      },
    },

    state: {
      get() {
        return this.objectView ? this.objectView.object.state : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'state', value })
      },
    },

    assortmentId: {
      get() {
        return this.objectView ? this.objectView.object.assortmentId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'assortmentId', value })
      },
    },

    assortment: {
      get() {
        return this.objectView ? this.objectView.object.assortment : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'assortment', value })
      },
    },

    type: {
      get() {
        return this.objectView ? this.objectView.object.type : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'type', value })
      },
    },

    weighingStationId: {
      get() {
        return this.objectView ? this.objectView.object.weighingStationId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'weighingStationId', value })
      },
    },

    weighingStation: {
      get() {
        return this.objectView ? this.objectView.object.weighingStation : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'weighingStation', value })
      },
    },

    driverId: {
      get() {
        return this.objectView ? this.objectView.object.driverId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'driverId', value })
      },
    },

    driver: {
      get() {
        return this.objectView ? this.objectView.object.driver : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'driver', value })
      },
    },

    carsQueueStatus: {
      get() {
        return this.objectView ? this.objectView.object.carsQueueStatus : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'carsQueueStatus', value })
      },
    },

    driverPhoneNumber: {
      get() {
        return this.objectView ? this.objectView.object.driverPhoneNumber : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'driverPhoneNumber', value })
      },
    },

    arrivalDateDriver: {
      get() {
        return this.objectView ? moment(this.objectView.object.arrivalDateDriver).format('YYYY-MM-DD') : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'arrivalDateDriver', value: moment(value).format('YYYY-MM-DD') })
      },
    },

    vehicleId: {
      get() {
        return this.objectView ? this.objectView.object.vehicleId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'vehicleId', value })
      },
    },

    vehicle: {
      get() {
        return this.objectView ? this.objectView.object.vehicle : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'vehicle', value })
      },
    },

    trailerId: {
      get() {
        return this.objectView ? this.objectView.object.trailerId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'trailerId', value })
      },
    },

    trailer: {
      get() {
        return this.objectView ? this.objectView.object.trailer : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'trailer', value })
      },
    },

    numberOfWeighings: {
      get() {
        return this.objectView ? this.objectView.object.numberOfWeighings : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'numberOfWeighings', value })
      },
    },

    numberOfWeighted: {
      get() {
        return this.objectView ? this.objectView.object.numberOfWeighted : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'numberOfWeighted', value })
      },
    },

    mineId: {
      get() {
        return this.objectView ? this.objectView.object.mineId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'mineId', value })
      },
    },

    mine: {
      get() {
        return this.objectView ? this.objectView.object.mine : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'mine', value })
      },
    },

    position: {
      get() {
        return this.objectView ? this.objectView.object.position : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'position', value })
      },
    },

    positionId: {
      get() {
        return this.objectView ? this.objectView.object.positionId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'positionId', value })
      },
    },

    carrierId: {
      get() {
        return this.objectView ? this.objectView.object.carrierId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'carrierId', value })
      },
    },

    carrier: {
      get() {
        return this.objectView ? this.objectView.object.carrier : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'carrier', value })
      },
    },

    orderId: {
      get() {
        return this.objectView ? this.objectView.object.orderId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'orderId', value })
      },
    },

    order: {
      get() {
        return this.objectView ? this.objectView.object.order : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'order', value })
      },
    },

    productId: {
      get() {
        return this.objectView ? this.objectView.object.productId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'productId', value })
      },
    },

    product: {
      get() {
        return this.objectView ? this.objectView.object.product : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'product', value })
      },
    },

    shipId: {
      get() {
        return this.objectView ? this.objectView.object.shipId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'shipId', value })
      },
    },

    ship: {
      get() {
        return this.objectView ? this.objectView.object.ship : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'ship', value })
      },
    },

    forwarderId: {
      get() {
        return this.objectView ? this.objectView.object.forwarderId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'forwarderId', value })
      },
    },

    forwarder: {
      get() {
        return this.objectView ? this.objectView.object.forwarder : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'forwarder', value })
      },
    },

    customerId: {
      get() {
        return this.objectView ? this.objectView.object.customerId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'customerId', value })
      },
    },

    customer: {
      get() {
        return this.objectView ? this.objectView.object.customer : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'customer', value })
      },
    },

    vendorId: {
      get() {
        return this.objectView ? this.objectView.object.vendorId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'vendorId', value })
      },
    },

    vendor: {
      get() {
        return this.objectView ? this.objectView.object.vendor : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'vendor', value })
      },
    },

    boxId: {
      get() {
        return this.objectView ? this.objectView.object.boxId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'boxId', value })
      },
    },

    box: {
      get() {
        return this.objectView ? this.objectView.object.box : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'box', value })
      },
    },

    warehouseId: {
      get() {
        return this.objectView ? this.objectView.object.warehouseId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'warehouseId', value })
      },
    },

    warehouse: {
      get() {
        return this.objectView ? this.objectView.object.warehouse : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'warehouse', value })
      },
    },

    schemeOfCargoId: {
      get() {
        return this.objectView ? this.objectView.object.schemeOfCargoId : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'schemeOfCargoId', value })
      },
    },

    schemeOfCargo: {
      get() {
        return this.objectView ? this.objectView.object.schemeOfCargo : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'schemeOfCargo', value })
      },
    },

    correspondence: {
      get() {
        return this.objectView ? this.objectView.object.correspondence : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'correspondence', value })
      },
    },

    comment: {
      get() {
        return this.objectView ? this.objectView.object.comment : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'comment', value })
      },
    },
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'dispositions/setObjectViewProperty',
      setObjectProperty: 'dispositions/setObjectProperty',
      delObjectView: 'dispositions/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async initialize() {
      this.typesOfDocuments = this.loadEnums(TypesOfDocuments, null)
      this.typesOfOperations = this.loadEnums(TypesOfOperations, null)
      this.dispositionStates = this.loadEnums(DispositionStates, null)
      this.dispositionTypes = this.loadEnums(DispositionTypes, null)
      this.carQueueStatuses = this.loadEnums(CarQueueStatuses, null)

      this.products = this.loadEnums(this.products, this.product)
      this.ships = this.loadEnums(this.ships, this.ship)
      this.forwarders = this.loadEnums(this.forwarders, this.forwarder)
      this.vendors = this.loadEnums(this.vendors, this.vendor)
      this.customers = this.loadEnums(this.customers, this.customer)
      this.drivers = this.loadEnums(this.drivers, this.driver)
      this.schemesOfCargo = this.loadEnums(this.schemesOfCargo, this.schemeOfCargo)
      this.assortments = this.loadEnums(this.assortments, this.assortment)
      this.mines = this.loadEnums(this.mines, this.mine)
      this.positions = this.loadEnums(this.positions, this.position)
      this.vehicles = this.loadEnums(this.vehicles, this.vehicle)
      this.trailers = this.loadEnums(this.trailers, this.trailer)
      this.warehouses = this.loadEnums(this.warehouses, this.warehouse)
      this.boxes = this.loadEnums(this.boxes, this.box)
      this.carriers = this.loadEnums(this.carriers, this.carrier)
      this.initOrders()

      await this.initWeighingStations()
      await this.initScales()
    },

    loadEnums(enumVar, objectVar) {
      const finalList = []
      for (let i = 0; i < enumVar.length; i++) {
        finalList.push({ text: enumVar[i], value: enumVar[i] })
      }

      if (objectVar) {
        finalList.push({ text: objectVar.name, value: objectVar.id })
      }

      return finalList
    },

    openPrintForm(printName) {
      console.log('Print open: ', printName)
      this.$router.push({ name: printName, params: { id: this.viewId } })
    },

    async initScales() {
      const scales = await this.$store.dispatch('scales/findAll', {})
      for (let i = 0; i < scales.length; i++) {
        this.scales.push({ text: scales[i].name, value: scales[i].id })
      }
    },

    async initWeighingStations() {
      const weighingStations = await this.$store.dispatch('weighingStations/findAll', {})
      for (let i = 0; i < weighingStations.length; i++) {
        this.weighingStations.push({ text: weighingStations[i].name, value: weighingStations[i].id })
      }
    },

    initOrders() {
      if (this.order) {
        this.orders.push({ text: this.order.number, value: this.order.id })
      }
    },

    onSearchAssortment(searchValue) {
      this.updateAssortments(searchValue)
    },

    async updateAssortments(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('assortments/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.assortments = []
      for (let i = 0; i < response.length; i++) {
        this.assortments.push({ text: response[i].name, value: response[i].id })
      }
    },

    onSearchOrder(searchValue) {
      this.updateOrders(searchValue)
    },

    async updateOrders(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const items = await this.$store.dispatch('deliveryOrders/findAll', {
        ...reqParams,
        noCommit: true,
      })

      const response = items.data

      console.log(response)

      this.orders = []
      for (let i = 0; i < response.length; i++) {
        this.orders.push({ text: response[i].number, value: response[i].id })
      }

      console.log(this.orders)
    },

    onSearchShip(searchValue) {
      this.updateShips(searchValue)
    },

    async updateShips(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('ships/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.ships = []
      for (let i = 0; i < response.length; i++) {
        this.ships.push({ text: response[i].name, value: response[i].id })
      }
    },

    onSearchMine(searchValue) {
      this.updateMines(searchValue)
    },

    async updateMines(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('mines/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.mines = []
      for (let i = 0; i < response.length; i++) {
        this.mines.push({ text: response[i].name, value: response[i].id })
      }
    },

    onSearchSchemeOfCargo(searchValue) {
      this.updateSchemeOfCargo(searchValue)
    },

    async updateSchemeOfCargo(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('schemesOfCargo/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.schemesOfCargo = []
      for (let i = 0; i < response.length; i++) {
        this.schemesOfCargo.push({ text: response[i].name, value: response[i].id })
      }
    },

    onSearchWarehouse(searchValue) {
      this.updateWarehouses(searchValue)
    },

    async updateWarehouses(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('warehouse/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.warehouses = []
      for (let i = 0; i < response.length; i++) {
        this.warehouses.push({ text: response[i].name, value: response[i].id })
      }
    },

    async updateVendorsAndCustomers(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('vendorsAndCustomers/findAll', {
        ...reqParams,
        noCommit: true,
      })

      return response
    },

    onSearchVendor(searchValue) {
      this.updateVendors(searchValue)
    },

    async updateVendors(searchValue) {
      const response = await this.updateVendorsAndCustomers(searchValue)
      if (response) {
        this.vendors = []
        for (let i = 0; i < response.length; i++) {
          if (response[i].isVendor === true) {
            this.vendors.push({ text: response[i].name, value: response[i].id })
          }
        }
      }
    },

    onSearchCustomer(searchValue) {
      this.updateCustomers(searchValue)
    },

    async updateCustomers(searchValue) {
      const response = await this.updateVendorsAndCustomers(searchValue)
      if (response) {
        this.customers = []
        for (let i = 0; i < response.length; i++) {
          if (response[i].isCustomer === true) {
            this.customers.push({ text: response[i].name, value: response[i].id })
          }
        }
      }
    },

    onSearchForwarder(searchValue) {
      this.updateForwarders(searchValue)
    },

    async updateForwarders(searchValue) {
      const response = await this.updateVendorsAndCustomers(searchValue)
      if (response) {
        this.forwarders = []
        for (let i = 0; i < response.length; i++) {
          if (response[i].isForwarder === true) {
            this.forwarders.push({ text: response[i].name, value: response[i].id })
          }
        }
      }
    },

    onSearchDriver(searchValue) {
      this.updateDrivers(searchValue)
    },

    async updateDrivers(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('drivers/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.drivers = []
      for (let i = 0; i < response.length; i++) {
        this.drivers.push({ text: response[i].name, value: response[i].id })
      }
    },

    async updateAllVehicles(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('vehicles/findAll', {
        ...reqParams,
        noCommit: true,
      })

      return response
    },

    onSearchVehicle(searchValue) {
      this.updateVehicles(searchValue)
    },

    async updateVehicles(searchValue) {
      const response = await this.updateAllVehicles(searchValue)
      if (response) {
        this.vehicles = []
        for (let i = 0; i < response.length; i++) {
          if (response[i].type === 'Car') {
            this.vehicles.push({ text: response[i].name, value: response[i].id })
          }
        }
      }
    },

    onSearchTrailer(searchValue) {
      this.updateTrailers(searchValue)
    },

    async updateTrailers(searchValue) {
      const response = await this.updateAllVehicles(searchValue)
      if (response) {
        this.trailers = []
        for (let i = 0; i < response.length; i++) {
          if (response[i].type === 'Trailer') {
            this.trailers.push({ text: response[i].name, value: response[i].id })
          }
        }
      }
    },

    onSearchUser(searchValue) {
      this.updateUsers(searchValue)
    },

    async updateUsers(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('users/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.allUsers = []
      for (let i = 0; i < response.length; i++) {
        this.allUsers.push({ text: response[i].name, value: response[i].id })
      }
    },

    onSearchProduct(searchValue) {
      this.updateProducts(searchValue)
    },

    async updateProducts(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('products/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.products = []
      for (let i = 0; i < response.length; i++) {
        this.products.push({ text: response[i].name, value: response[i].id })
      }
    },

    onSearchBox(searchValue) {
      this.updateBoxes(searchValue)
    },

    async updateBoxes(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('boxes/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.boxes = []
      for (let i = 0; i < response.length; i++) {
        this.boxes.push({ text: response[i].name, value: response[i].id })
      }
    },

    onSearchCarrier(searchValue) {
      this.updateCarriers(searchValue)
    },

    async updateCarriers(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('carriers/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.carriers = []
      for (let i = 0; i < response.length; i++) {
        this.carriers.push({ text: response[i].name, value: response[i].id })
      }
    },

    onSearchPosition(searchValue) {
      this.updatePositions(searchValue)
    },

    async updatePositions(searchStr) {
      if (searchStr === '') {
        return
      }

      const reqParams = {
        params: {
          sort: { sortBy: 'name', sortDesc: true },
          filter: { searchStr: searchStr },
          limit: 50,
        },
      }

      const response = await this.$store.dispatch('positions/findAll', {
        ...reqParams,
        noCommit: true,
      })

      this.positions = []
      for (let i = 0; i < response.length; i++) {
        this.positions.push({ text: response[i].name, value: response[i].id })
      }
    },

    async writeObject() {
      let response
      if (this.object.id === null || this.object.id === undefined) {
        response = await this.$store.dispatch('dispositions/create', this.object)
      } else {
        response = await this.$store.dispatch('dispositions/update', this.object)
      }

      if (response.status && response.status === 200) {
        this.$bvToast.toast('Dyspozycja została zapisana', {
          title: this.$tc('common.msg'),
          variant: 'success',
          solid: true,
          autoHideDelay: 2000,
        })
        console.log(response)
        this.closeView()
      } else {
        this.$bvToast.toast(`Błąd zapisu dyspozycji ${response.data.message}`, {
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
      await this.$router.push({ name: 'dispositions-list' })
    },
  },
}
</script>

<style>
.btn-container {
  display: inline-flexbox;
}

.short-input {
  max-width: 70%;
}

.chackbox-box {
  display: flex;
  align-items: center;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
}

a:hover {
  cursor: pointer;
}
</style>
