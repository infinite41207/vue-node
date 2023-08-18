<template>
  <div class="mt-3">
    <b-form-group label="Filter" label-for="filter-input" label-cols-sm="1">
      <b-form-input id="search-item" v-model="filter" type="search" debounce="50" size="sm" :placeholder="`${$t('common.search')}...`" @update="onChangeFilter" />
    </b-form-group>
    <b-table striped hover show-empty :items="usersList" :fields="usersFields" small>
      <template v-slot:cell(isActive)="data">
        <b-form-checkbox v-model="data.item.isActive" @change="handleChange(data.item)"></b-form-checkbox>
      </template>
    </b-table>
    <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right" class="my-0" @change="onChangePage"></b-pagination>
  </div>
</template>

<script>
export default {
  name: 'CalendarUsersTable',
  props: {
    users: {
      type: Array,
      require: true,
    },
    value: {
      type: Array,
      require: true,
      default: null,
    },
  },
  data() {
    return {
      usersList: [],
      usersFields: [
        { key: 'name', label: 'Nazwa', sortable: false },
        { key: 'isActive', label: 'Dołączony', sortable: false },
      ],
      filter: '',
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
    }
  },
  async mounted() {
    this.totalRows = this.users.length
    this.updateList()
  },
  methods: {
    handleCalendarChange(calendarGroup) {
      this.$emit('onCalendarChange', { calendarGroup, selectedCalendar: this.selectedCalendar })
    },
    async updateList() {
      let users = [...this.users]
      if (this.filter) {
        users = users.filter((user) => user.name.includes(this.filter))
      }
      this.usersList = users.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)
    },
    onChangeFilter() {
      this.currentPage = 1
      this.updateList()
    },
    onChangePage(page) {
      this.currentPage = page
      this.updateList()
    },
    handleChange(item) {
      const value = this.value ? [...this.value] : []
      if (item.isActive) {
        value.push(item.userId)
      } else {
        value.splice(
          value.findIndex((val) => val.userId === item.userId),
          1
        )
      }

      this.$emit('input', value)
    },
  },
}
</script>

<style lang="scss"></style>
