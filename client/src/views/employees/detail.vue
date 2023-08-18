<template>
  <Layout>
    <PageHeader :title="title" />
    <div>
      <b-card>
        <b-card-header>
          <b-button-toolbar>
            <b-btn-group class="mt-2">
              <a href="javascript:void(0);" class="btn btn-success btn-sm" :disabled="readOnly" @click="writeObject">
                <i class="ri-close-line"></i>
                {{ $t('commands.writeAndClose') }}
              </a>
              <a href="javascript:void(0);" class="btn btn-info btn-sm ml-2" @click="closeView">
                <i class="ri-close-line"></i>
                {{ $t('commands.close') }}
              </a>
            </b-btn-group>
          </b-button-toolbar>
        </b-card-header>
        <b-card-body>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.name')" label-for="object-name">
                <b-form-input id="object-name" v-model="name" name="object-name" size="sm" />
              </b-form-group>
            </b-col>

            <b-col md="2">
              <b-form-group horizontal :label-cols="3" :label="$t('table.abbreviation')" label-for="object-abbreviation">
                <b-form-input id="object-abbreviation" v-model="abbreviation" name="object-abbreviation" size="sm" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.email')" label-for="object-email">
                <b-form-input id="object-email" v-model="email" name="object-email" size="sm" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.phone')" label-for="object-phone">
                <b-form-input id="object-phone" v-model="phone" name="object-phone" size="sm" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.user')" label-for="object-user">
                <b-form-select id="object-user" v-model="user" :options="userList" text-field="name" value-field="id" name="object-user" size="sm" />
              </b-form-group>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </div>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'EmployeeDetail',
  page() {
    return { title: this.$t('route.employee'), meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: this.$t('route.employee'),
      viewId: this.$route.params.id,
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'employees/objectView',
      userList: 'users/getUsers',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    name: {
      get() {
        return this.objectView ? this.objectView.object.name : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'name', value })
      },
    },

    abbreviation: {
      get() {
        return this.objectView ? this.objectView.object.abbreviation : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'abbreviation', value })
      },
    },

    email: {
      get() {
        return this.objectView ? this.objectView.object.email : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'email', value })
      },
    },

    phone: {
      get() {
        return this.objectView ? this.objectView.object.phone : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'phone', value })
      },
    },

    user: {
      get() {
        return this.objectView ? this.objectView.object.userId : ''
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'userId',
          value,
        })
      },
    },

    nameState() {
      return this.name !== ''
    },
  },

  async mounted() {
    if (this.userList.length === 0) {
      await this.$store.dispatch('users/findAll', {})
    }
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'employees/setObjectViewProperty',
      setObjectProperty: 'employees/setObjectProperty',
      delObjectView: 'employees/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async writeObject() {
      let response
      if (this.objectView.object.id === null) {
        response = await this.$store.dispatch('employees/create', this.objectView.object).catch((error) => {
          console.error(error)
          // console.log("object:", objectView.object)
        })
      } else {
        response = await this.$store.dispatch('employees/update', this.objectView.object).catch((error) => {
          console.error(error)
        })
      }
      if (response && response.status === 200) {
        this.closeView()
      } else {
        console.error(response.data.message)
      }
    },

    async closeView() {
      this.$destroy()
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)
      await this.$router.push({ name: 'employees' })
    },
  },
}
</script>
