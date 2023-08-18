<template>
  <Layout>
    <PageHeader :title="title" />

    <b-card>
      <b-row class="mb-3">
        <b-col>
          <b-button-toolbar>
            <b-btn-group>
              <a href="javascript:void(0);" :disabled="readOnly" class="btn btn-success btn-sm" @click="writeObject">
                <i class="ri-save-2-fill"></i>
                {{ $t('commands.writeAndClose') }}
              </a>
              <a href="javascript:void(0);" class="btn btn-info btn-sm ml-2" @click="closeView">
                <i class="ri-close-line"></i>
                {{ $t('commands.close') }}
              </a></b-btn-group
            ></b-button-toolbar
          >
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col cols="4" class="checkbox-box">
          <div class="fixed-w">Numer</div>
          <b-form-input v-model="number" size="sm" class="ml-1"></b-form-input>
        </b-col>
        <b-col cols="4" class="checkbox-box">
          <div class="fixed-w">Data</div>
          <date-picker id="date" v-model="date" name="date" value-type="date" type="datetime" size="sm"></date-picker>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="8" class="checkbox-box">
          <div class="fixed-w">Dyspozycja</div>
          <f-select v-model="disposition" select-btn open-btn value-type="dispositions" detail-view="disposition" placeholder="Wyszukaj dyspozycje..." label="number"> </f-select>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="8" class="checkbox-box">
          <div class="fixed-w">Waga</div>
          <f-select v-model="scale" select-btn open-btn value-type="scales" detail-view="position" placeholder="Wyszukaj wagę..."> </f-select>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="8" class="checkbox-box">
          <div class="fixed-w">Stanowisko</div>
          <f-select v-model="position" select-btn open-btn value-type="positions" detail-view="position" placeholder="Wyszukaj stanowisko..."> </f-select>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="8" class="checkbox-box">
          <div class="fixed-w">Magazyn</div>
          <f-select v-model="warehouse" select-btn open-btn value-type="warehouses" detail-view="warehouse" placeholder="Wyszukaj magazyn..."> </f-select>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="8" class="checkbox-box">
          <div class="fixed-w">Numer magazynowy</div>
          <f-select v-model="box" select-btn open-btn value-type="boxes" detail-view="box" placeholder="Wyszukaj numer magazynowy..."> </f-select>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="4" class="checkbox-box">
          <div class="fixed-w">Zaczęło ważenia</div>
          <date-picker id="beginWeighting" v-model="beginWeighting" name="beginWeighting" value-type="date" type="datetime" size="sm"></date-picker>
        </b-col>
        <b-col cols="4" class="checkbox-box">
          <div class="fixed-w">Koniec ważenia</div>
          <date-picker id="endWeighting" v-model="endWeighting" name="endWeighting" value-type="date" type="datetime" size="sm"></date-picker>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="3" class="checkbox-box">
          <div class="fixed-w">Netto</div>
          <b-form-input type="number" v-model="netto" size="sm" class="ml-1"></b-form-input>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="4">
          <div class="fixed-w">Komentarz</div>
          <b-form-textarea aria-placeholder="Komentarz" v-model="comment" size="sm" class="mt-1 ml-1"></b-form-textarea>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="3" class="checkbox-box">
          <div class="fixed-w">Autor</div>
          <f-select v-model="author" select-btn open-btn value-type="users" detail-view="author" placeholder="Wyszukaj autora..."> </f-select>
        </b-col>
      </b-row>
    </b-card>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import OperationTypes from '../../constants/operationTypes'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'

export default {
  name: 'ShipsUnloadingDetail',

  page() {
    return { title: 'Rozładunek statku', meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: { Layout, PageHeader, DatePicker },

  async created() {
    this.initialize()
  },

  data() {
    return {
      title: 'Rozładunek statku',
      viewId: this.$route.params.id,
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'shipsUnloading/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    id: {
      get() {
        return this.objectView ? this.objectView.object.id : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'id', value })
      },
    },

    number: {
      get() {
        return this.objectView ? this.objectView.object.number : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'number', value })
      },
    },

    beginWeighting: {
      get() {
        return this.objectView ? new Date(this.objectView.object.beginWeighting) : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'beginWeighting', value })
      },
    },

    endWeighting: {
      get() {
        return this.objectView ? new Date(this.objectView.object.endWeighting) : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'endWeighting', value })
      },
    },

    netto: {
      get() {
        return this.objectView ? this.objectView.object.netto : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'netto', value })
      },
    },

    comment: {
      get() {
        return this.objectView ? this.objectView.object.comment : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'comment', value })
      },
    },

    date: {
      get() {
        // return this.objectView ? moment(this.objectView.object.date).format('YYYY-MM-DD') : ''
        return this.objectView ? new Date(this.objectView.object.date) : null
      },
      set(value) {
        // this.setObjectProperty({ viewId: this.viewId, property: 'date', value: moment(value).format('YYYY-MM-DD') })
        this.setObjectProperty({ viewId: this.viewId, property: 'date', value: value })
      },
    },

    disposition: {
      get() {
        return this.objectView ? this.object.disposition : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'disposition', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'dispositionId', value: value ? value.id : value })
      },
    },

    scale: {
      get() {
        return this.objectView ? this.object.scale : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'scale', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'scaleId', value: value ? value.id : value })
      },
    },

    position: {
      get() {
        return this.objectView ? this.object.position : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'position', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'positionId', value: value ? value.id : value })
      },
    },

    warehouse: {
      get() {
        return this.objectView ? this.object.warehouse : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'warehouse', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'warehouseId', value: value ? value.id : value })
      },
    },

    author: {
      get() {
        return this.objectView ? this.object.author : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'author', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'authorId', value: value ? value.id : value })
      },
    },

    box: {
      get() {
        return this.objectView ? this.object.box : {}
      },
      async set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'box', value })
        this.setObjectProperty({ viewId: this.viewId, property: 'boxId', value: value ? value.id : value })
      },
    },
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'shipsUnloading/setObjectViewProperty',
      setObjectProperty: 'shipsUnloading/setObjectProperty',
      delObjectView: 'shipsUnloading/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async initialize() {
      console.log(this.object)
      await this.getOperationTypes()
    },

    // get enums

    async getOperationTypes() {
      const options = []

      for (let i = 0; i < OperationTypes.length; i++) {
        options.push({ value: OperationTypes[i], text: OperationTypes[i] })
      }

      this.operationTypes = options
    },

    async writeObject() {
      let response
      if (this.object.id === null || this.object.id === undefined) {
        console.log('this.object: ', this.object)
        response = await this.$store.dispatch('shipsUnloading/create', this.object)
        console.log('response: ', response)
      } else {
        response = await this.$store.dispatch('shipsUnloading/update', this.object)
      }

      if (response.status === 200) {
        this.$router.push({ name: 'ships-unloading-list' })
        this.closeView()
      }
    },

    async closeView() {
      this.$destroy()
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)
      await this.$router.push({ name: 'ships-unloading-list' })
    },
  },
}
</script>

<style>
.checkbox-box {
  display: flex;
  align-items: center;
}

.fixed-w {
  width: 100px;
}

.long-table {
  width: 80vw;
}
</style>
