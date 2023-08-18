<template>
  <Layout>
    <PageHeader :title="title" />
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col">
            <div class="float-left">
              <h4>{{ firm.name }}</h4> <br />
            </div>

            <div class="col">
              <div class="float-sm-right">
                <h4>Data rejestracji: {{ getFormatedDate(openReclamation.inputDate) }}</h4>
              </div>
            </div>
          </div>
        </div>

        <div class="row text-center mb-3">
          <div class="col-12">
            <div class="col-sm-12">
              <h3> <b>PROTOKÓŁ REJESTRACJI</b> <br /> </h3>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-4">
            <!-- end row -->
            <div class="row">
              <div class="col-sm-4 line">
                <h5>ZGŁOSZENIE</h5>
              </div>

              <div class="col-sm-4 line">
                <h5>{{ openReclamation.number }}</h5>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-4 line main-text">
                <h5>Klient</h5>
              </div>

              <div class="col line main-text">
                <h5>{{ getCustomerDescription(openReclamation.customer) }}</h5>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-4 line main-text">
                <h5>UMOWA</h5>
              </div>
              <div class="col line main-text">
                <h5>{{ openReclamation.salesOrder }}</h5>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-4 line main-text">
                <h5>Referencja</h5>
              </div>
              <div class="col-sm-4 line main-text">
                <h5>{{ openReclamation.salesReference }}</h5>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-4 line main-text">
                <h5>Oferta</h5>
              </div>
              <div class="col-sm-4 line main-text">
                <h5>{{ openReclamation.salesRequest }}</h5>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-4 line main-text">
                <h5>SPRZEDAŻ</h5>
              </div>
              <div class="col-sm-4 line main-text">
                <h5>{{ getFormatedDate(openReclamation.salesDate) }}</h5>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-4 line main-text">
                <h5>Wysyłka</h5>
              </div>
              <div class="col-sm-4 line main-text">
                <h5>{{ getFormatedDate(openReclamation.deliveryTerm) }}</h5>
              </div>
            </div>
          </div>

          <!-- NEXT LINE -->
          <div class="col-8">
            <div class="row">
              <div class="col-sm-2 line main-text">
                <h5>ADRES</h5>
              </div>

              <div class="col-sm-4 line main-text">
                <h5>{{ openReclamation.postCode }} {{ openReclamation.address }}</h5>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-2 line main-text">
                <h5>TELEFON</h5>
              </div>

              <div class="col-sm-4 line main-text">
                <h5>{{ openReclamation.telephone }}</h5>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-2 line main-text">
                <h5>EMAIL</h5>
              </div>

              <div class="col-sm-4 line main-text">
                <h5>{{ openReclamation.email }}</h5>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-6">
            <h5>Komentarz</h5>

            <h5>{{ openReclamation.comment }}</h5>
          </div>
          <div class="col-6">
            <h5>Komentarz wewnętrzny</h5>
            <h5>{{ openReclamation.internalComment }}</h5>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table mt-4">
                <thead>
                  <tr>
                    <th>Przedmiot</th>
                    <th>Opis</th>
                    <th>Decyzja</th>
                    <th>Odpowiedzialność</th>
                    <th>Powód</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="possition of openReclamation.possitions" :key="possition.possitionIndex">
                    <td>
                      {{ getSubjectDescription(possition.reclamationSubject) }}
                    </td>
                    <td>{{ possition.comment }}</td>
                    <!-- <td>{{ getExecutionTypeDescription(possition.reclamationExecutionType) }}</td> -->
                    <td>{{ getDecisionDescription(possition.reclamationDecision) }}</td>

                    <td>{{ getPerpetratorDescription(possition.perpetrator) }}</td>
                    <td>{{ getReclamationReasonDescription(possition.reclamationReason) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- end table-responsive-->
          </div>
          <!-- end col -->
        </div>
        <!-- end row -->

        <div class="row">
          <div>
            <div class="clearfix pt-3">
              <p>
                <small> Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb rozpatrzenia i realizacji zgłoszenia. </small>
              </p>
              <p>
                <small> W przypadku nieuzasadnionego zgłoszenia, klient zobowiązany jest do pokrycia kosztów dojazdu serwisu. </small>
              </p>
              <p>
                <small>
                  W przypadku realizacji zgłoszenia przez serwis fabryczny PP OknoPlus klient zobowiązany jest do przedłożenia serwisantowi karty gwarancyjnej dołączonej do
                  zakupionych okien lub drzwi.
                </small>
              </p>
            </div>
          </div>
          <!-- end col -->
        </div>
        <!-- end row-->
        <div class="podpis">
          <div>
            <hr />
            <p>Podpis przyjmującego</p>
          </div>
          <div>
            <hr />
            <p>Podpis zgłaszającego</p>
          </div>
        </div>

        <div class="d-print-none mt-4">
          <div class="text-right">
            <a href="javascript:window.print()" class="btn btn-primary"> <i class="ri-printer-fill"></i> Drukuj </a>
            <!-- <a href="javascript: void(0);" class="btn btn-info ml-1">Submit</a> -->
          </div>
        </div>
        <!-- end buttons -->
      </div>
      <!-- end card-body-->
    </div>
    <!-- end card -->
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  name: 'ReclPFRegistrationProtocol',

  page: {
    title: 'Invoice',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: '',
      reclamationExecutionTypes: [],
      reclamationDecisions: [],
      reclamationSubjects: [],
      firm: {},

      reclamationReasons: [],
      reclamationPerpetrators: [],
    }
  },
  methods: {
    getFormatedDate(curDate) {
      return moment(curDate).format('DD MM YYYY')
    },

    getExecutionTypeDescription(curId) {
      const found = this.reclamationExecutionTypes.find((el) => el.id === curId)
      if (found) {
        return found.description
      } else return 'nie określono'
    },

    getDecisionDescription(curId) {
      const found = this.reclamationDecisions.find((el) => el.id === curId)
      if (found) {
        return found.description
      } else return 'nie określono'
    },

    getPerpetratorDescription(curId) {
      const found = this.reclamationPerpetrators.find((el) => el.id === curId)
      if (found) {
        return found.description
      } else return 'nie określono'
    },

    getReclamationReasonDescription(curId) {
      const found = this.reclamationReasons.find((el) => el.id === curId)
      if (found) {
        return found.description
      } else return 'nie określono'
    },

    getSubjectDescription(curId) {
      const found = this.reclamationSubjects.find((el) => el.id === curId)
      if (found) {
        return found.description
      } else return 'nie określono'
    },

    getCustomerDescription(curId) {
      const found = this.customers.find((el) => el.id === curId)
      if (found) {
        return found.name
      } else return 'nie określono'
    },

    async initialize() {
      this.reclamationSubjects = await this.$store.dispatch('reclamationSubjects/findAll', {})
      this.reclamationExecutionTypes = await this.$store.dispatch('reclamationExecutionTypes/findAll', {})
      this.reclamationDecisions = await this.$store.dispatch('reclamationDecisions/findAll', {})
      this.reclamationReasons = await this.$store.dispatch('reclamationReasons/findAll', {})
      this.reclamationPerpetrators = await this.$store.dispatch('reclamationPerpetrators/findAll', {})
      await this.$store.dispatch('counterparties/findAll', {})
      this.firm = await this.$store.dispatch('firms/getMainItem')
    },
  },

  computed: {
    ...mapGetters({
      openReclamation: 'reclamations/openReclamation',
      customers: 'counterparties/customerList',
    }),
  },

  async mounted() {
    this.initialize()
  },
}
</script>

<style>
.podpis {
  display: flex;
  justify-content: space-around;
}
hr {
  width: 150px;
}
.line {
  display: flex;
  justify-content: space-between;
}
.main-text {
  margin-top: -10px;
}
.barcode {
  position: absolute;
  margin-left: 130px;
  display: flex;
}
</style>