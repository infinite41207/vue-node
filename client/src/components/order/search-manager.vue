<template>
  <b-modal
    id="modal-manager"
    size="xl"
    :title= "modalTitle"
    :cancel-title="$t('commands.cancel')"
    no-close-on-backdrop
    @ok="handleOk"
    @cancel="handleCancel"
    @close="handelClose"
  >
    <b-row>
      <b-col>
        <b-form-group label="Filter" label-for="filter-input" label-cols-sm="1">
          <b-input-group>
            <b-form-input
              id="search-manager"
              v-model="filter"
              type="search"
              debounce="50"
              :placeholder= "modalTitle"
              @keyup.enter="selectManager"
            >
            </b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">{{ $t('commands.clear') }}</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
        <b-table
          ref="managerTable"
          v-model="managerFilteredRows"
          no-border-collapse
          responsive="sm"
          selectable
          select-mode="single"
          sticky-header="400px"
          lazy
          :filter-included-fields="managerFilterFields"
          :fields="managerFields"
          :filter="filter"
          :items="managerTable"
          :per-page="perPage"
          :current-page="currentPage"
          small
          @row-selected="managerRowSelected"
          @filtered="onFiltered"
        >
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="right"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    returnName: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
     managerFields: [
        { key: 'abbreviation', label: this.$t('table.abbreviation') },
        { key: 'name', label: this.$t('table.name') },
        { key: 'email', label: this.$t('table.email') },
        { key: 'phone', label: this.$t('table.phone') },
      ],
      managerTable: [],
      filter: '',
      managerId: '',
      managerFilteredRows: [],
      managerFilterFields: ['abbreviation', 'name', 'email'],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,

      modalTitle: 'Wyszukaj handlowieca!',
    }
  },

  computed: {
    ...mapGetters({
      managers: 'employees/employeeList',
    }),
  },

  async mounted() {
    if (this.managers.length === 0) {
      await this.$store.dispatch('employees/findAll', {})
    }

    this.$bvModal.show('modal-manager')
    for (const manager of this.managers) {
      this.managerTable.push({
        id: manager.id,
        name: manager.name,
        abbreviation: manager.abbreviation,
        email: manager.email,
      })
    }

    this.totalRows = this.managerTable.length
  },

  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    selectUser() {
      if (this.managerFilteredRows.length === 1) {
        this.$refs.managerCollapsibleTable.selectRow(0)
      }
    },

    managerRowSelected(rowArray) {
      if (rowArray.length === 1) {
        this.filter = rowArray[0].name
        this.managerId = rowArray[0].id
      }
    },

    handleOk() {
      if (this.managerId !== '') {
        this.$emit(
          'manager-selected',
          this.returnName === true ? { id: this.managerId, name: this.filter } : this.managerId
        )
      } else {
        this.$emit('manager-selected', undefined)
      }

      this.clearData()
    },

    handleCancel() {
      this.$emit('manager-selected', undefined)

      this.clearData()
    },

    handelClose() {
      this.$emit('manager-selected', undefined)
      this.clearData()
    },

    clearData() {
      this.filter = ''
      this.managerId = ''
    },
  },
}
</script>

<style></style>
