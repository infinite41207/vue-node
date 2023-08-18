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

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import moment from 'moment'

import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'ReclamationsWievForm',

  page: {
    title: 'Invoice',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader },

  data() {
    return {
      title: '',
      viewId: this.$route.params.id,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'reclamations/objectView',
      openReclamation: 'reclamations/openReclamation',
      // customers: 'counterparties/customerList',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },
  },

  methods: {
    ...mapMutations({
      setOpenReclamation: 'reclamations/setOpenReclamation',
      setNewDocumentMode: 'reclamations/setNewDocumentMode',
      setPossitionsEditionMode: 'reclamations/setPossitionsEditionMode',
    }),

    ...mapActions({
      delView: 'tagsViews/delView',
    }),

    getFormatedDate(curDate) {
      return moment(curDate).format('DD MM YYYY')
    },

    async editReclamation() {
      this.setNewDocumentMode(false)
      const dataObject = await this.$store.dispatch('reclamations/findByPk', {
        params: {
          id: this.object.id,
        },
      })
      if (dataObject) {
        this.setPossitionsEditionMode(true)
        this.$router.push({ name: 'reclamation-detail', params: { id: this.viewId } })
        this.delView({ name: this.$route.name, path: this.$route.path })
      }
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" />
    <div class="card">
      <div class="card-body">
        <div class="d-print-none mb-3">
          <div class="text-left">
            <a href="javascript:void(0);" @click="editReclamation" class="btn btn-info"> <i class="ri-file-text-line"></i> Przejść do edycji </a>
            <!-- <a href="javascript: void(0);" class="btn btn-info ml-1">Submit</a> -->
          </div>
        </div>

        <div class="row">
          <div class="col-3">
            <h5>ZGŁOSZENIE: {{ this.object.number }}</h5>
          </div>
          <div class="col-3">
            <h5>Klient: {{ this.object._customer ? this.object._customer.name : 'Nie określono' }}</h5>
          </div>
        </div>
        <div class="row">
          <h5></h5>
        </div>
        <div class="row">
          <div class="col-4">
            <!-- end row -->
            <div class="row">
              <div class="col-sm-4 line main-text">
                <h5>UMOWA</h5>
              </div>
              <div class="col-sm-4 line main-text">
                <h5>{{ this.object.salesOrder }}</h5>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-4 line main-text">
                <h5>Referencja</h5>
              </div>
              <div class="col-sm-4 line main-text">
                <h5>{{ this.object.salesReference }}</h5>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-4 line main-text">
                <h5>Oferta</h5>
              </div>
              <div class="col-sm-4 line main-text">
                <h5>{{ this.object.salesRequest }}</h5>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-4 line main-text">
                <h5>SPRZEDAŻ</h5>
              </div>
              <div class="col-sm-4 line main-text">
                <h5>{{ this.object.salesDate ? getFormatedDate(this.object.salesDate) : 'Nie określono' }}</h5>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-4 line main-text">
                <h5>Wysyłka</h5>
              </div>
              <div class="col-sm-4 line main-text">
                <h5>{{ this.object.deliveryTerm ? getFormatedDate(this.object.deliveryTerm) : 'Nie określono' }}</h5>
              </div>
            </div>
          </div>

          <div class="col-2">
            <div class="row">
              <p class="font-13">
                <strong>Data rejestracji:</strong> &nbsp;&nbsp;&nbsp;
                {{ this.object.inputDate ? getFormatedDate(this.object.inputDate) : 'Nie określono' }}
              </p>
            </div>
            <div class="row">
              <p class="font-13">
                <strong>Termin wykonania:</strong> &nbsp;&nbsp;&nbsp;
                {{ this.object.executionTerm ? getFormatedDate(this.object.executionTerm) : 'Nie określono' }}
              </p>
            </div>

            <div class="row">
              <p class="font-13">
                <strong>Status:</strong> &nbsp;&nbsp;&nbsp;
                {{ this.object._status ? this.object._status.description : 'Nie określono' }}
              </p>
            </div>

            <div class="row">
              <p class="font-13">
                <strong>Decyzja:</strong> &nbsp;&nbsp;&nbsp;
                {{ this.object._decision ? this.object._decision.description : 'Nie określono' }}
              </p>
            </div>
          </div>

          <!-- NEXT LINE -->
          <div class="col-6">
            <div class="row">
              <div class="col-sm-2 line main-text">
                <h5>ADRES</h5>
              </div>

              <div class="col-sm-4 line main-text">
                <h5>{{ this.object.postCode }} {{ this.object.address }}</h5>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-2 line main-text">
                <h5>TELEFON</h5>
              </div>

              <div class="col-sm-4 line main-text">
                <h5>{{ this.object.telephone }}</h5>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-2 line main-text">
                <h5>EMAIL</h5>
              </div>

              <div class="col-sm-4 line main-text">
                <h5>{{ this.object.email }}</h5>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="row">
          <div class="col-6">
            <h5>Komentarz</h5>

            <h5>{{ openReclamation.comment }}</h5>
          </div>
          <div class="col-6">
            <h5>Komentarz wewnętrzny</h5>
            <h5>{{ openReclamation.internalComment }}</h5>
          </div>
        </div> -->

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
                  <tr v-for="possition of object.reclamation_items" :key="possition.possitionIndex">
                    <td>
                      {{ possition._reclamationSubject ? possition._reclamationSubject.description : 'Nie określono' }}
                    </td>
                    <td>{{ possition.comment }}</td>
                    <!-- <td>{{ possition.reclamationExecutionType }}</td> -->
                    <td>{{ possition._reclamationDecision ? possition._reclamationDecision.description : 'Nie określono' }}</td>

                    <td>{{ possition._perpetrator ? possition._perpetrator.description : 'Nie określono' }}</td>
                    <td>{{ possition._reclamationReason ? possition._reclamationReason.description : 'Nie określono' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- end table-responsive-->
          </div>
          <!-- end col -->
        </div>

        <!-- end buttons -->
      </div>
      <!-- end card-body-->
    </div>
    <!-- end card -->
  </Layout>
</template>
