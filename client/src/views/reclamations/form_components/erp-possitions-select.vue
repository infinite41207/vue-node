<template>
  <b-modal
    id="cr-select"
    size="xl"
    :title="`${$t('common.selectPossition')}!`"
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
            <b-form-input id="cr-search" v-model="filter" type="search" debounce="50" :placeholder="`${$t('common.searchItem')}...`" @keyup.enter="selectItem"> </b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">{{ $t('commands.clear') }}</b-button>
            </b-input-group-append>
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
          :items="table"
          :per-page="perPage"
          :current-page="currentPage"
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
import moment from 'moment'

export default {
  name: 'ReclERPPosSelect',

  data() {
    return {
      fields: [
        { key: 'code', label: this.$t('table.code') },
        { key: 'article', label: this.$t('table.article') },
        { key: 'description', label: this.$t('table.description') },
      ],
      table: [],
      filter: '',
      itemId: '',
      filteredRows: [],
      filterFields: ['article', 'description'],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
    }
  },

  async mounted() {
    this.$bvModal.show('cr-select')
    const orderProducts = await this.$store.dispatch('products/getConfigProducts', {
      lang: this.currentLanguage.code,
    })

    if (orderProducts) {
      for (const row of orderProducts) {
        this.table.push({
          id: row.id,
          number: row.number,
          customer: row._customer.name,
          status: row._status.description,
          createdAt: moment(row.createdAt).format('DD.MM.YYYY hh.mm.ss'),
        })
      }
    }

    this.totalRows = this.table.length
  },

  methods: {
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
        this.filter = rowArray[0].name
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
