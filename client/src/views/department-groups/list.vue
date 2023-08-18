<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'

export default {
  name: 'DepartmentGroupsList',
  page: {
    title: 'Reclamations',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: 'Decyzja',
      showNewItemForm: false,
      tableData: [
        { name: 'Magazyn', lp: '1' },
        { name: 'Handel', lp: '2' },
        { name: 'Reklamacje', lp: '3' },
        { name: 'Przedstawiciel', lp: '4' },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: 'age',
      sortDesc: false,
      fields: [
        { key: 'name', label: 'Nazwa', sortable: true },
        { key: 'lp', label: 'Lp', sortable: true },
      ],
    }
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.tableData.length
    },
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length
  },
  methods: {
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
  },
}
</script>
<template>
  <Layout>
    <PageHeader :title="title" />
    <div class="input-group-append">
      <b-button variant="outline-secondary" class="ml-1" @click="showNewItemForm = true"> <i class="ri-edit-box-line"></i> Zmień status </b-button>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <!-- <h4 class="header-title">Data Table</h4> -->
            <!-- <p class="text-muted font-13 mb-4"></p> -->
            <div class="row mb-md-2">
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_length" class="dataTables_length">
                  <label class="d-inline-flex align-items-center">
                    Show&nbsp;
                    <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
                  </label>
                </div>
              </div>
              <!-- Search -->
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                  <label class="d-inline-flex align-items-center">
                    Search:
                    <b-form-input v-model="filter" type="search" placeholder="Search..." class="form-control form-control-sm ml-2"></b-form-input>
                  </label>
                </div>
              </div>
              <!-- End search -->
            </div>
            <!-- Table -->
            <div class="table-responsive mb-0">
              <b-table
                :items="tableData"
                :fields="fields"
                responsive="sm"
                :per-page="perPage"
                :current-page="currentPage"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :filter="filter"
                :filter-included-fields="filterOn"
                @filtered="onFiltered"
              ></b-table>
            </div>
            <div class="row">
              <div class="col">
                <div class="dataTables_paginate paging_simple_numbers float-right">
                  <ul class="pagination pagination-rounded mb-0">
                    <!-- pagination -->
                    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->
    <b-modal v-model="showNewItemForm" title="Zmiana statusu" title-class="font-18" hide-footer>
      <b-form-group label="Wybierz nowy status" label-for="newReclStatus">
        <select id="newReclStatus" class="form-control custom-select">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>
      </b-form-group>
      <b-form-group label="Komentarz" label-for="comment" class="mb-3">
        <b-form-textarea id="comment" rows="5"></b-form-textarea>
      </b-form-group>

      <div class="text-right pt-2 pb-2">
        <b-button type="submit" variant="success" class="ml-1">Zmień status</b-button>
        <b-button variant="light" @click="showChangeStatusForm = false">Anuluj</b-button>
      </div>
    </b-modal>
  </Layout>
</template>
