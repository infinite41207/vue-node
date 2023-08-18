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
      <b-row class="mt-1">
        <b-col cols="6">
          <b-form-group horizontal :label-cols="3" :label="$t('table.name')" label-for="item-name">
            <b-form-input id="item-name" v-model="name" name="item-name" size="sm" :state="!$v.name.$invalid" />
          </b-form-group>
        </b-col>
      </b-row>

      <b-row class="p-1">
        <b-col>
          <b-tabs card>
            <b-tab title="Protocol setting">
              <b-row>
                <b-form-group :label="$t('table.selectProtocol')">
                  <b-form-radio-group id="radio-group-1" v-model="type" :options="listProtocol" name="radio-options"> </b-form-radio-group>
                </b-form-group>
              </b-row>

              <b-row v-if="type === listProtocol[0]" class="text-center">
                <b-col>
                  <p>This protocol has no settings</p>
                </b-col>
              </b-row>

              <b-col v-if="type === listProtocol[1]" class="mt-3">
                <b-row>
                  <b-col cols="8">
                    <b-form-group label-cols="3" :label="$t('table.server')" label-for="input-default">
                      <b-form-input id="input-default" type="text" v-model="server"> </b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label-cols="3" :label="$t('table.port')" label-for="input-default">
                      <b-form-input id="input-default" type="number" v-model="port"> </b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="8">
                    <b-form-group label-cols="3" :label="$t('table.api')" label-for="input-default">
                      <b-form-input id="input-default" type="text" v-model="api"> </b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-col>

              <b-col v-if="type === listProtocol[2]" class="mt-3">
                <b-row>
                  <b-col cols="8">
                    <b-form-group label-cols="3" :label="$t('table.server')" label-for="input-default">
                      <b-form-input id="input-default" type="text" v-model="server"> </b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label-cols="3" :label="$t('table.port')" label-for="input-default">
                      <b-form-input id="input-default" type="number" v-model="port"> </b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-form-group label-cols="2" content-cols="4" :label="$t('table.sendCommand')" label-for="input-default">
                  <b-form-input id="input-default" type="text" v-model="command"> </b-form-input>
                </b-form-group>

                <b-form-group :label="$t('table.typeParse')">
                  <b-form-radio-group id="radio-group-2" v-model="parserType" :options="parseProtocol" name="radio-options-2"> </b-form-radio-group>
                </b-form-group>
              </b-col>

              <b-col v-if="type === listProtocol[3]" class="mt-3">
                <b-row>
                  <b-col cols="8">
                    <b-form-group label-cols="3" :label="$t('table.server')" label-for="input-default">
                      <b-form-input id="input-default" type="text" v-model="server"> </b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" :label="$t('table.registry')" label-for="input-default">
                      <b-form-input id="input-default" type="text" v-model="register"> </b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label-cols="3" :label="$t('table.port')" label-for="input-default">
                      <b-form-input id="input-default" type="number" v-model="port"> </b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>

                <b-form-group :label="$t('table.typeParse')">
                  <b-form-radio-group id="radio-group-2" v-model="parserType" :options="parseProtocol" name="radio-options-2"> </b-form-radio-group>
                </b-form-group>
              </b-col>
              <b-col v-if="type === listProtocol[4]" class="mt-3">
                <b-row>
                  <b-col cols="5">
                    <b-form-group label-cols="3" :label="$t('table.comPort')" label-for="input-default">
                      <b-form-input id="input-default" type="text" v-model="serialPort"> </b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" :label="$t('table.sendCommand')" label-for="input-default">
                      <b-form-input id="input-default" type="text" v-model="command"> </b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-col>
              <b-col v-if="type === listProtocol[5]" class="mt-3">
                <b-row class="my-2 ml-1">
                  <b-button variant="outline-secondary" size="sm" @click="addNewRow">
                    <i class="ri-add-line"></i>
                    {{ $t('commands.add') }}
                  </b-button>
                </b-row>
                <b-row>
                  <b-col>
                    <b-table striped bordered hover :items="configS7" :fields="configS7Fields" small>
                      <template v-slot:cell(index)="{ index }">
                        <span>{{ ++index }}</span>
                      </template>

                      <template v-slot:cell(key)="{ item }">
                        <b-form-input type="text" v-model="item.key" size="sm" />
                      </template>

                      <template v-slot:cell(server)="{ item }">
                        <b-form-input type="text" v-model="item.server" size="sm" />
                      </template>

                      <template v-slot:cell(valueType)="{ item }">
                        <b-form-input type="text" v-model="item.valueType" size="sm" />
                      </template>

                      <template v-slot:cell(register)="{ item }">
                        <b-form-input type="text" v-model="item.register" size="sm" />
                      </template>

                      <template v-slot:cell(active)="{ item }">
                        <b-form-checkbox v-model="item.active" name="checkbox-1" value="true" unchecked-value="false" class="mt-1"> Active </b-form-checkbox>
                      </template>

                      <template v-slot:cell(actions)="{ index }">
                        <span> <b-button size="sm" @click="removeItem(index)">Remove</b-button></span>
                      </template>
                    </b-table>
                  </b-col>
                </b-row>
              </b-col>
            </b-tab>
          </b-tabs>
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

export default {
  name: 'ScaleProtocolDetail',

  page() {
    return {
      title: this.$t('route.scaleProtocol'),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },

  components: { Layout, PageHeader },

  data() {
    return {
      title: this.$t('route.scaleProtocol'),
      viewId: this.$route.params.id,
      listProtocol: ['Mechanical', 'IoT', 'TCP/IP', 'Modbus', 'COM', 'S7'],
      parseProtocol: ['ToledoSimple', 'ToledoSimpleTwice', 'ToledoModbus'],
      configS7Fields: [
        { key: 'index', label: this.$t('table.sort') },
        { key: 'key', label: this.$t('table.key') },
        { key: 'server', label: this.$t('table.server') },
        { key: 'valueType', label: this.$t('common.valueType') },
        { key: 'register', label: this.$t('common.register') },
        { key: 'active', label: this.$t('common.active') },
        { key: 'actions', label: this.$t('common.actions') },
      ],
      readOnly: this.$route.meta.isReadOnly,
    }
  },
  watch: {
    listProtocol() {
      console.log('listProtocol', this.listProtocol)
    },
    configS7() {
      console.log('configS7', this.configS7)
    },
  },
  async created() {
    console.log(this.objectView)
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
      getObjectView: 'scaleProtocols/objectView',
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
    server: {
      get() {
        return this.objectView ? this.objectView.object.server : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'server', value })
      },
    },
    command: {
      get() {
        return this.objectView ? this.objectView.object.command : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'command', value })
      },
    },
    markedToDelete: {
      get() {
        return this.objectView ? this.objectView.object.markedToDelete : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'markedToDelete', value })
      },
    },
    parserType: {
      get() {
        return this.objectView ? this.objectView.object.parserType : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'parserType', value })
      },
    },
    port: {
      get() {
        return this.objectView ? this.objectView.object.port : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'port', value })
      },
    },
    register: {
      get() {
        return this.objectView ? this.objectView.object.register : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'register', value })
      },
    },
    serialPort: {
      get() {
        return this.objectView ? this.objectView.object.serialPort : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'serialPort', value })
      },
    },
    type: {
      get() {
        return this.objectView ? this.objectView.object.type : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'type', value })
      },
    },
    api: {
      get() {
        return this.objectView ? this.objectView.object.api : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'api', value })
      },
    },
    configS7: {
      get() {
        return this.objectView ? this.objectView.object.configS7 : []
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'configS7', value })
      },
    },
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'scaleProtocols/setObjectViewProperty',
      setObjectProperty: 'scaleProtocols/setObjectProperty',
      delObjectView: 'scaleProtocols/delObjectView',

      addObjectTableRow: 'scaleProtocols/addObjectTableRow',
      deleteObjectTableRow: 'scaleProtocols/deleteObjectTableRow',
      setObjectTableRow: 'scaleProtocols/setObjectTableRow',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    addNewRow() {
      const newRow = {
        key: '',
        server: '',
        valueType: '',
        register: '',
        active: false
      }

      this.addObjectTableRow({ viewId: this.viewId, table: 'configS7', row: newRow })
    },

    removeItem(index) {
      this.deleteObjectTableRow({ viewId: this.viewId, table: 'configS7', index: index })
    },

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
        response = await this.$store.dispatch('scaleProtocols/create', this.object).catch((error) => {
          console.error(error)
        })
      } else {
        response = await this.$store.dispatch('scaleProtocols/update', this.object).catch((error) => {
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

      await this.$router.push({ name: 'scale-protocols' })
    },
  },
}
</script>

<style>
</style>
