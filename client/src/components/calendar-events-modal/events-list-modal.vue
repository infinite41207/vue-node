<script>
import moment from 'moment'

export default {
  name: 'CalendarEventsListModal',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    parentType: {
      type: String,
      default: '',
    },
    parentId: {
      type: String,
      default: '',
    },
  },
  components: {},
  computed: {
    modalVisible: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
        this.filter = ''
        this.currentPage = 1
      },
    },
  },

  data() {
    return {
      fields: [
        { key: 'title', label: this.$t('table.title') },
        { key: 'start', label: this.$t('table.startTime') },
        { key: 'end', label: this.$t('table.endTime') },
        { key: 'notes', label: this.$t('table.notes') },
      ],
      items: [],
      filter: '',
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
    }
  },
  methods: {
    async updateList() {
      const filterStr = {
        noCommit: true,
        params: {
          filter: {
            parentType: this.parentType,
            parentId: this.parentId,
          },
          pagination: { page: this.currentPage, limit: this.perPage },
        },
      }

      if (this.filter) {
        filterStr.params.filter.searchStr = this.filter
      }

      let list = []
      let page = this.currentPage
      let total = 0

      await this.$store
        .dispatch('calendarEvents/findAllEvents', filterStr)
        .then((response) => {
          if (response.status === 200) {
            const result = response.data.responseData

            if (result.rows) {
              list = result.rows
              total = result.count
            } else {
              list = result
              total = result.length
            }
            if (total > 0) {
              const pages = Math.ceil(total / this.perPage)
              if (pages < page) {
                page = pages
              }
            } else {
              page = 1
            }
          } else {
            page = 1
          }
        })
        .catch((error) => {
          console.error(error)
          page = 1
        })

      this.items = list
      this.totalRows = total
      this.currentPage = page
    },

    onChangeFilter() {
      this.updateList()
    },

    clearFilter() {
      this.filter = ''
      this.updateList()
    },

    onChangePage(page) {
      this.currentPage = page
      this.updateList()
    },
    getFormattedDate(curDate) {
      return moment(curDate).format('DD/MM/YYYY HH:mm')
    },
  },
  watch: {
    value(visible) {
      if (!visible) return

      this.updateList()
    },
  },
}
</script>

<template>
  <b-modal id="calendar-event-modal" v-model="modalVisible" hide-footer centered size="lg" title="Wydarzenia" title-tag="h4" title-class="modal-title">
    <b-row>
      <b-col>
        <b-form-group label="Filter" label-for="filter-input" label-cols-sm="1">
          <b-form-input id="search-item" v-model="filter" type="search" debounce="50" size="sm" :placeholder="`${$t('common.search')}...`" @update="onChangeFilter" />
        </b-form-group>
        <b-table no-border-collapse :items="items" :fields="fields" responsive="sm" sticky-header="400px" lazy :per-page="perPage" :current-page="1" small>
          <template v-slot:cell(title)="data">
            <router-link :to="`/sales/crm/calendar/${data.item.id}`">
              {{ data.item.title }}
            </router-link>
          </template>
          <template v-slot:cell(start)="data">
            {{ getFormattedDate(data.item.start) }}
          </template>
          <template v-slot:cell(end)="data">
            {{ getFormattedDate(data.item.end) }}
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right" class="my-0" @change="onChangePage"></b-pagination>
      </b-col>
    </b-row>
  </b-modal>
</template>

<style lang="scss"></style>
