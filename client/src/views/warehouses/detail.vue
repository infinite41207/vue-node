<template>
  <Layout>
    <PageHeader :title="title" />
    <b-card>
      <b-row class="mb-3">
        <b-col>
          <b-button-toolbar>
            <b-btn-group>
              <b-button variant="success" :disabled="readOnly" class="btn-sm" @click="writeObject">
                <i class="ri-save-2-fill"></i>
                {{ $t('commands.writeAndClose') }}
              </b-button>
              <b-button variant="outline-secondary" class="btn-sm ml-1" @click="closeView">
                <i class="ri-close-line"></i>
                {{ $t('commands.close') }}
              </b-button>
            </b-btn-group>
          </b-button-toolbar>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.name')" label-for="item-name">
            <b-form-input id="item-name" v-model="name" name="item-name" size="sm" :state="!$v.name.$invalid" />
          </b-form-group>
        </b-col>
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.code')" label-for="item-code">
            <b-form-input id="item-code" v-model="code" name="item-code" size="sm" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.capasity')" label-for="item-capasity">
            <b-form-input type="number" id="item-capasity" v-model="capasity" name="item-capasity" size="sm" />
          </b-form-group>
        </b-col>
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.initDate')" label-for="item-initDate">
            <date-picker id="init_date" v-model="initDate" name="initDate" value-type="date" type="datetime" size="sm"></date-picker>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.carsBuffer')" label-for="item-cars-buffer">
            <b-form-input type="number" id="item-cars-buffer" v-model="carsBuffer" name="item-cars-buffer" size="sm" />
          </b-form-group>
        </b-col>
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.externalId')" label-for="item-external-id">
            <b-form-input id="item-externalid" v-model="externalId" name="item-external-id" size="sm" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.notes')" label-for="item-notes">
            <b-form-textarea id="rc-note" v-model="notes" rows="6" name="rc-note" placeholder="Wpisz komentarz ..."></b-form-textarea>
          </b-form-group>
        </b-col>
        <b-col cols="2">
          <b-form-group horizontal :label-cols="5" :label="$t('table.queueOn')" label-for="item-queue-on">
            <b-form-checkbox id="queue-on" v-model="queueOn" class="check-prop"> </b-form-checkbox>
          </b-form-group>
        </b-col>
        <b-col cols="2">
          <b-form-group horizontal :label-cols="5" :label="$t('table.reflect')" label-for="item-reflect">
            <b-form-checkbox id="reflect" v-model="reflect" class="check-prop"> </b-form-checkbox>
          </b-form-group>
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
import { required, maxLength } from 'vuelidate/lib/validators'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import moment from 'moment'

const storeName = 'warehouses'

export default {
  name: 'WarehouseDetail',

  page() {
    return {
      title: this.$t('route.warehouse'),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },

  components: { Layout, PageHeader, DatePicker },

  data() {
    return {
      title: this.$t('route.warehouse'),
      viewId: this.$route.params.id,
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  validations: {
    name: {
      required,
    },
    code: {
      maxLength: maxLength(9),
    },
  },

  computed: {
    ...mapGetters({
      getObjectView: `${storeName}/objectView`,
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

    name: {
      get() {
        return this.objectView ? this.objectView.object.name : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'name', value })
      },
    },

    code: {
      get() {
        return this.objectView ? this.objectView.object.code : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'code', value })
      },
    },

    capasity: {
      get() {
        return this.objectView ? this.objectView.object.capasity : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'capasity', value })
      },
    },

    initDate: {
      get() {
        return this.objectView ? (this.object.initDate ? new Date(this.object.initDate) : null) : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'initDate', value: moment(value).format('YYYY-MM-DD') })
      },
    },

    carsBuffer: {
      get() {
        return this.objectView ? this.objectView.object.carsBuffer : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'carsBuffer', value })
      },
    },

    externalId: {
      get() {
        return this.objectView ? this.objectView.object.externalId : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'externalId', value })
      },
    },

    notes: {
      get() {
        return this.objectView ? this.objectView.object.notes : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'notes', value })
      },
    },

    queueOn: {
      get() {
        return this.objectView ? this.objectView.object.queueOn : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'queueOn', value })
      },
    },

    reflect: {
      get() {
        return this.objectView ? this.objectView.object.reflect : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'reflect', value })
      },
    },
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: `${storeName}/setObjectViewProperty`,
      setObjectProperty: `${storeName}/setObjectProperty`,
      delObjectView: `${storeName}/delObjectView`,
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async writeObject() {
      if (this.$v.$invalid === true) {
        console.log('object: ', this.object)
        this.$bvToast.toast(this.$t('msg.filingError'), {
          title: this.$t('common.msg'),
          variant: 'danger',
          solid: true,
          autoHideDelay: 2000,
        })
        return
      }

      try {
        let response

        if (this.object.isNew) {
          response = await this.$store.dispatch(`${storeName}/create`, this.object)
        } else {
          response = await this.$store.dispatch(`${storeName}/update`, this.object)
        }

        if (response) {
          this.closeView()

          this.$bvToast.toast(this.$t('msg.catalogWriteSuccess'), {
            title: this.$t('common.msg'),
            variant: 'success',
            solid: true,
            autoHideDelay: 2000,
          })
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message

        this.$bvToast.toast(errorMessage || this.$t('msg.catalogWriteError'), {
          title: this.$t('common.msg'),
          variant: 'danger',
          solid: true,
          autoHideDelay: 2000,
        })
      }
    },

    async closeView() {
      this.$destroy()
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)

      await this.$router.push({ name: 'warehouses-list' })
    },
  },
}
</script>

<style>
</style>
