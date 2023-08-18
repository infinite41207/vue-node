<template>
  <b-modal
    id="modal-user"
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
              id="search-user"
              v-model="filter"
              type="search"
              debounce="50"
              :placeholder= "modalTitle"
              @keyup.enter="selectUser"
            >
            </b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">{{ $t('commands.clear') }}</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
        <b-table
          ref="userTable"
          v-model="userFilteredRows"
          no-border-collapse
          responsive="sm"
          selectable
          select-mode="single"
          sticky-header="400px"
          lazy
          :filter-included-fields="userFilterFields"
          :fields="userFields"
          :filter="filter"
          :items="userTable"
          :per-page="perPage"
          :current-page="currentPage"
          small
          @row-selected="userRowSelected"
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
     userFields: [
        { key: 'abbreviation', label: this.$t('table.abbreviation') },
        { key: 'name', label: this.$t('table.name') },
        { key: 'email', label: this.$t('table.email') },
      ],
      userTable: [],
      filter: '',
      userId: '',
      userFilteredRows: [],
      userFilterFields: ['abbreviation', 'name', 'email'],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,

      modalTitle: 'Wyszukaj użytkownika!',
    }
  },

  computed: {
    ...mapGetters({
      users: 'users/userList',
    }),
  },

  async mounted() {
    if (this.users.length === 0) {
      await this.$store.dispatch('users/findAll', {})
    }

    this.$bvModal.show('modal-user')
    for (const user of this.users) {
      this.userTable.push({
        id: user.id,
        name: user.name,
        abbreviation: user.abbreviation,
        email: user.email,
      })
    }

    this.totalRows = this.userTable.length
  },

  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    selectUser() {
      if (this.userFilteredRows.length === 1) {
        this.$refs.userCollapsibleTable.selectRow(0)
      }
    },

    userRowSelected(rowArray) {
      if (rowArray.length === 1) {
        this.filter = rowArray[0].name
        this.userId = rowArray[0].id
      }
    },

    handleOk() {
      if (this.userId !== '') {
        this.$emit(
          'user-selected',
          this.returnName === true ? { id: this.userId, name: this.filter } : this.userId
        )
      } else {
        this.$emit('user-selected', undefined)
      }

      this.clearData()
    },

    handleCancel() {
      this.$emit('user-selected', undefined)

      this.clearData()
    },

    handelClose() {
      this.$emit('user-selected', undefined)
      this.clearData()
    },

    clearData() {
      this.filter = ''
      this.userId = ''
    },
  },
}
</script>

<style></style>
