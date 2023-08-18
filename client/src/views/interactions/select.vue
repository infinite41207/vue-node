<template>
  <b-modal
    id="interaction-select"
    size="xl"
    :title="`${$t('common.selectForm')}!`"
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
            <b-input-group-prepend>
              <b-form-input
                id="list-search-order"
                v-model="orderNumber"
                type="search"
                debounce="50"
                placeholder="Szukaj wg zamówienia"
                @change="updateList"
                @keyup.enter="selectItem"
              >
              </b-form-input>
            </b-input-group-prepend>
            <b-form-input id="list-search" v-model="filter" type="search" debounce="50" placeholder="Szukaj wg numeru lub referencji" @keyup.enter="selectItem"> </b-form-input>
          </b-input-group>
        </b-form-group>
        <b-table
          ref="searchTable"
          v-model="filteredRows"
          no-border-collapse
          responsive="sm"
          selectable
          select-mode="single"
          sticky-header="400px"
          lazy
          :filter-included-fields="filterFields"
          :fields="fields"
          :filter="filter"
          :items="list"
          :per-page="perPage"
          :current-page="currentPage"
          small
          @row-selected="rowSelected"
          @filtered="onFiltered"
        >
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right" class="my-0"></b-pagination>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'InteractionSelect',

  props: {
    userId: {
      type: Number,
      default: -1,
    },
  },

  data() {
    return {
      fields: [
        { key: 'numberStr', label: this.$t('table.number') },
        { key: 'version', label: this.$t('table.version') },
        { key: 'status', label: this.$t('table.status') },
        { key: 'createdAt', label: this.$t('table.createdAt') },
        { key: 'customer', label: this.$t('table.customer') },
        { key: 'reference', label: this.$t('table.reference') },
        { key: 'author', label: this.$t('table.author') },
      ],
      list: [],
      filter: '',
      orderNumber: '',
      itemId: '',
      filteredRows: [],
      filterFields: ['numberStr', 'reference', 'customer'],
      totalRows: 1,
      currentPage: 1,
      perPage: 15,
      isConstructor: false,
    }
  },

  computed: {
    ...mapGetters({
      userList: 'users/getUsers',
    }),
  },

  watch: {
    filteredRows(newVal, oldVal) {
      this.$refs.searchTable.refresh()
    },
  },

  async mounted() {
    this.$bvModal.show('interaction-select')

    this.initUsers()
    this.updateList()
  },

  methods: {
    async initUsers() {
      if (this.userList.length === 0) {
        await this.$store.dispatch('users/findAll', {})
      }
    },

    async updateList() {
      const filterStr = { filter: { state: 'Active' } }

      if (this.orderNumber && this.orderNumber !== '') {
        filterStr.filter.orderNumber = this.orderNumber
      }

      const response = await this.$store.dispatch('interactions/findAll', {
        noCommit: true,
        params: filterStr,
      })

      this.list = []

      if (response) {
        for (const row of response.data) {
          this.list.push({
            id: row.id,
            numberStr: row.numberStr,
            customer: row.customer ? row.customer.name : '',
            version: row.version,
            reference: row.reference,
            status: row.status ? row.status.description : '',
            createdAt: row.createdAt,
            author: row.author ? row.author.name : '',
          })
        }
      }

      this.totalRows = this.list.length
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    selectItem() {
      if (this.filteredRows.length === 1) {
        this.$refs.searchTable.selectRow(0)
      }
    },

    rowSelected(rowArray) {
      if (rowArray.length === 1) {
        this.itemId = rowArray[0].id
      }
    },

    handleOk() {
      if (this.itemId !== '') {
        this.$emit('select-end', this.itemId)
      } else {
        this.$emit('select-end', undefined)
      }

      this.clearData()
    },

    handleCancel() {
      this.$emit('select-end', undefined)
      this.clearData()
    },

    handelClose() {
      this.$emit('select-end', undefined)
      this.clearData()
    },

    clearData() {
      this.filter = ''
      this.itemId = ''
    },
  },
}
</script>

<style></style>
