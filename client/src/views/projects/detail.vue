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
          <b-form-group horizontal :label-cols="3" :label="$t('table.progressValue')" label-for="item-progressValue">
            <b-form-input id="item-progressValue" type="number" v-model="progressValue" name="item-progressValue" size="sm" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.startDate')" label-for="item-startDate">
            <date-picker id="start_date" v-model="startDate" name="startDate" value-type="date" type="datetime" size="sm"></date-picker>
          </b-form-group>
        </b-col>
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.endDate')" label-for="item-endDate">
            <date-picker id="end_date" v-model="endDate" name="endDate" value-type="date" type="datetime" size="sm"></date-picker>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.tasks')" label-for="item-tasks">
            <b-form-input id="item-tasks" type="number" v-model="tasks" name="item-tasks" size="sm" />
          </b-form-group>
        </b-col>
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.comments')" label-for="item-comments">
            <b-form-input id="item-comments" type="number" v-model="comments" name="item-comments" size="sm" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.description')" label-for="item-description">
            <b-form-textarea id="item-description" v-model="description" rows="6" name="item-description" placeholder="Wpisz opis..."></b-form-textarea>
          </b-form-group>
        </b-col>
        <b-col cols="4">
          <b-form-group horizontal :label-cols="3" :label="$t('table.status')" label-for="item-status">
            <b-form-select size="sm" v-model="status" :options="statuses"></b-form-select>
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

export default {
  name: 'ProjectDetail',

  page() {
    return {
      title: this.$t('route.project'),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },

  components: { Layout, PageHeader, DatePicker },

  data() {
    return {
      title: this.$t('route.project'),
      viewId: this.$route.params.id,
      readOnly: this.$route.meta.isReadOnly,
      statuses: ['Finished', 'Ongoing'],
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
      getObjectView: 'projects/objectView',
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

    progressValue: {
      get() {
        return this.objectView ? this.objectView.object.progressValue : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'progressValue', value })
      },
    },

    startDate: {
      get() {
        return this.objectView ? (this.object.startDate ? new Date(this.object.startDate) : null) : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'startDate', value: value })
      },
    },

    endDate: {
      get() {
        return this.objectView ? (this.object.endDate ? new Date(this.object.endDate) : null) : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'endDate', value: value })
      },
    },

    tasks: {
      get() {
        return this.objectView ? this.objectView.object.tasks : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'tasks', value })
      },
    },

    comments: {
      get() {
        return this.objectView ? this.objectView.object.comments : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'comments', value })
      },
    },

    status: {
      get() {
        return this.objectView ? this.objectView.object.status : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'status', value })
      },
    },

    description: {
      get() {
        return this.objectView ? this.objectView.object.description : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'description', value })
      },
    },
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'projects/setObjectViewProperty',
      setObjectProperty: 'projects/setObjectProperty',
      delObjectView: 'projects/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async writeObject() {
      if (this.$v.$invalid === true) {
        this.$bvToast.toast(this.$t('msg.filingError'), {
          title: this.$t('common.msg'),
          variant: 'danger',
          solid: true,
          autoHideDelay: 2000,
        })
        return
      }

      let response
      if (this.object.isNew) {
        console.log('this.object: ', this.object)
        response = await this.$store.dispatch('projects/create', this.object).catch((error) => {
          console.error(error)
        })
      } else {
        response = await this.$store.dispatch('projects/update', this.object).catch((error) => {
          console.error(error)
        })
      }

      if (response && response.status === 200) {
        this.closeView()

        this.$bvToast.toast(this.$t('msg.catalogWriteSuccess'), {
          title: this.$t('common.msg'),
          variant: 'success',
          solid: true,
          autoHideDelay: 2000,
        })
      } else {
        this.$bvToast.toast(response.data?.message || this.$t('msg.catalogWriteError'), {
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

      await this.$router.push({ name: 'projects-list' })
    },
  },
}
</script>

<style>
</style>
