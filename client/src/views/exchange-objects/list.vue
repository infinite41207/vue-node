<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col>
        <b-card>
          <b-row class="mb-2">
            <b-col> </b-col>
            <b-col>
              <b-form-group :label="$t('common.filter')" label-for="filter-input" label-cols-sm="2">
                <b-input-group>
                  <b-form-input id="filter-input" v-model="filter" type="search" autofocus :placeholder="$t('common.search')"></b-form-input>

                  <b-input-group-append>
                    <b-button variant="danger" :disabled="!filter" @click="filter = ''">{{ $t('commands.clear') }}</b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                ref="objectList"
                hover
                striped
                :items="list"
                :fields="fields"
                :filter="filter"
                :filter-included-fields="filterOn"
                class="mb-2"
                :per-page="perPage"
                :current-page="currentPage"
                small
              >
                <template v-slot:cell(objectName)="data">
                  <a href="javascript:void(0);" @click="editItem(data.item)">{{ data.item.objectName }} </a>
                </template>
                <template v-slot:cell(actions)="data">
                  <div class="table-button-container">
                    <a href="javascript:void(0);" class="action-icon ri-delete-bin-7-fill text-danger" @click="deleteItem(data.item.id)"> </a>
                  </div>
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right" class="my-0"></b-pagination>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-modal v-model="showItemForm" title="Edycja objektu wymiany" title-class="font-18" hide-footer>
      <b-form-group :label="$t('table.objectType')" label-for="item-object-type">
        <b-form-input id="item-object-type" v-model="currentItem.objectName" type="text" name="item-object-type" size="sm"></b-form-input>
      </b-form-group>
      <b-form-group label="ID objektu" label-for="item-object-id">
        <b-form-input id="item-object-id" v-model="currentItem.objectId" type="number" name="item-object-id" size="sm"></b-form-input>
      </b-form-group>
      <b-form-group :label="$t('table.objectDescription')" label-for="item-object-description">
        <b-form-input id="item-object-description" v-model="currentItem.objectDescription" type="text" name="item-object-description" size="sm"></b-form-input>
      </b-form-group>
      <b-form-group :label="$t('table.changeType')" label-for="item-change-type">
        <b-form-input id="item-change-type" v-model="currentItem.changeType" type="text" name="item-change-type" size="sm"></b-form-input>
        <b-form-checkbox v-model="currentItem.sent" name="item-sent" switch>
          {{ $t('table.sent') }}
        </b-form-checkbox>
      </b-form-group>
      <div class="text-right pt-2 pb-2">
        <b-button type="submit" variant="success" class="mr-2" @click="saveChanges"> {{ $t('commands.write') }}</b-button>
        <b-button variant="light" @click="cancelItemModification">{{ $t('commands.cancel') }}</b-button>
      </div>
    </b-modal>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters } from 'vuex'

export default {
  name: 'ExchangeObjectList',

  page() {
    return { title: this.$t('route.exchangeObjects'), meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: {
    Layout,
    PageHeader,
  },

  data() {
    return {
      title: this.$t('route.exchangeObjects'),
      perPage: 15,
      currentPage: 1,
      totalRows: 1,
      fields: [
        { key: 'id', label: 'Id', sortable: true },
        { key: 'objectName', label: this.$t('table.objectType'), sortable: true },
        { key: 'objectId', label: this.$t('table.objectId'), sortable: true },
        { key: 'objectDescription', label: this.$t('table.objectDescription'), sortable: true },
        {
          key: 'changeType',
          label: this.$t('table.changeType'),
          sortable: true,
          formatter: (value) => {
            return this.getChangeTypeDescription(value)
          },
        },
        {
          key: 'sent',
          label: this.$t('table.sent'),
          sortable: true,
          formatter: (value) => {
            return value === true ? this.$t('common.yes') : this.$t('common.no')
          },
        },
        { key: 'actions', label: this.$t('table.actions'), sortable: false },
      ],
      filter: null,
      filterOn: [],
      currentItem: {},
      showItemForm: false,
    }
  },

  computed: {
    ...mapGetters({
      list: 'exchangeObjects/list',
    }),
  },

  watch: {
    list(newVal, oldVal) {
      this.$refs.objectList.refresh()
    },
  },

  async created() {
    await this.initialize()
  },

  methods: {
    async initialize() {
      await this.updateList()
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    async updateList() {
      const filterStr = {
        params: {
          filter: {},
        },
      }

      await this.$store.dispatch('exchangeObjects/findAll', filterStr)

      this.totalRows = this.list.length
      this.currentPage = 1
    },

    async editItem(itemData) {
      if (itemData) {
        this.currentItem = { ...itemData }
        this.showItemForm = true
      }
    },

    async saveChanges() {
      const saveItem = JSON.parse(JSON.stringify(this.currentItem))

      if (this.currentItem.id !== null) {
        await this.$store.dispatch('currencies/update', saveItem)
        this.currentItem = {}
        this.updateList()
        this.showItemForm = false
      }
    },

    async cancelItemModification() {
      this.currentItem = {}
      this.updateList()
      this.showItemForm = false
    },

    async deleteItem(itemId) {
      const response = await this.$store.dispatch('exchangeObjects/delete', {
        params: {
          id: itemId,
        },
      })

      if (response) {
        this.updateList()
      }
    },

    getChangeTypeDescription(value) {
      if (value === 0) {
        return this.$t('editTypes.created')
      } else if (value === 1) {
        return this.$t('editTypes.edited')
      } else if (value === 2) {
        return this.$t('editTypes.markedToDeleteRestore')
      } else {
        return this.$t('editTypes.deleted')
      }
    },
  },
}
</script>

<style></style>
