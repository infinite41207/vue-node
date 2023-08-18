<template>
  <b-modal
    id="add-route"
    size="xl"
    :title="`${$t('navigation.newRoute')}`"
    :cancel-title="$t('commands.cancel')"
    no-close-on-backdrop
    :ok-title="`${$t('commands.write')}`"
    @ok="handleOk"
    @cancel="handleCancel"
    @close="handelClose"
  >
    <b-card>
      <b-row>
        <b-col cols="6">
          <b-form-group horizontal :label-cols="6" :label="$t('table.isActive')" label-for="is-active">
            <b-form-checkbox v-model="newRoute.isActive" class="mt-1" name="is-active" switch> </b-form-checkbox>
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <b-form-group horizontal :label-cols="6" :label="$t('table.readOnly')" label-for="is-active">
            <b-form-checkbox v-model="newRoute.isReadOnly" class="mt-1" name="is-read-only" switch> </b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('common.subsystem')" label-for="item-subsystem">
            <b-form-select v-model="newRoute.parentId" :options="subTree" value-field="id" text-field="title" options-field="options" size="sm">
              <template v-slot:first>
                <b-form-select-option :value="null">-- Brak podsystemu narzędnego --</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.placing')" label-for="item-placing">
            <b-form-select v-model="newRoute.placing" :options="placings" value-field="value" text-field="title" size="sm">
              <template v-slot:first>
                <b-form-select-option :value="null">-- Brak rozmieszczenia --</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.name')" label-for="item-name">
            <b-form-input id="item-name" v-model="newRoute.name" type="text" name="item-name" placeholder="items | item-detail" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.path')" label-for="item-path">
            <b-input-group>
              <b-form-input id="item-path" v-model="newRoute.path" type="text" name="item-path" placeholder="items | item-detail/:id | report/:reportType" size="sm"></b-form-input>
              <a v-b-toggle.path-params class="btn btn-sm action-icon ri-arrow-down-s-line" size="sm" switch> </a>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-collapse id="path-params">
        <b-row>
          <b-col>
            <b-form-group horizontal :label-cols="3" :label="$t('table.paramValues')" label-for="item-param-values">
              <b-form-input
                id="item-param-values"
                v-model="newRoute.paramValues"
                type="text"
                name="item-param-values"
                placeholder="{ param1: value1, param2: value2}"
                size="sm"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group horizontal :label-cols="3" :label="$t('table.queryParam')" label-for="item-query-param">
              <b-form-input
                id="item-query-param"
                v-model="newRoute.queryParam"
                type="text"
                name="item-query-param"
                placeholder="param1=value1&param2=value2"
                size="sm"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group horizontal :label-cols="3" :label="$t('table.hashParam')" label-for="item-hash-param">
              <b-form-input id="item-hash-param" v-model="newRoute.hashParam" type="text" name="item-hash-param" placeholder="param1=value1&param2=value2" size="sm"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </b-collapse>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.title')" label-for="item-title">
            <b-input-group>
              <b-form-input id="item-title" v-model="newRoute.title" type="text" name="item-title" size="sm"></b-form-input>
              <b-input-group-append>
                <Translation v-model="newRoute.lang" input="title" />
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.description')" label-for="item-description">
            <b-input-group>
              <b-form-input id="item-description" v-model="newRoute.description" type="text" name="item-description" size="sm"></b-form-input>
              <b-input-group-append>
                <Translation v-model="newRoute.lang" input="description" />
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.accessRole')" label-for="item-access-role">
            <b-select v-model="newRoute.accessRoleId" :options="userRoles" value-field="id" text-field="name" size="sm"> </b-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.viewType')" label-for="item-view-type">
            <b-select v-model="newRoute.viewType" :options="viewTypes" value-field="value" text-field="title" size="sm"> </b-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-if="newRoute.viewType !== 'static'">
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.view')" label-for="item-view">
            <b-select v-model="newRoute.viewId" :options="viewSettings" value-field="id" text-field="name" size="sm"> </b-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-if="newRoute.viewType === 'static'">
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.component')" label-for="item-component">
            <b-form-input id="item-component" v-model="newRoute.component" type="text" name="item-component" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.detailPath')" label-for="item-detail-path">
            <b-form-select id="item-detail-path" v-model="newRoute.detailPath" :options="detailPathList" name="item-detail-path" size="sm"></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.store')" label-for="item-store">
            <b-form-input id="item-store" v-model="newRoute.store" type="text" name="item-store" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.model')" label-for="item-model">
            <b-form-input id="item-model" v-model="newRoute.model" type="text" name="item-model" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="5" :label="$t('navigation.getPrezentation')" label-for="item-prezentation">
            <b-form-checkbox v-model="newRoute.presentation" class="mt-1" name="is-active" switch> </b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="10">
          <b-form-group horizontal :label-cols="3" :label="$t('table.icon')" label-for="item-icon">
            <b-form-input id="item-icon" v-model="newRoute.icon" type="text" class="ml-2" name="item-icon" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <i :class="newRoute.icon" class="ml-1 p-1 prev-icon align-middle"></i>
        </b-col>
      </b-row>
    </b-card>
  </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { INavigationItem } from '@/store/types/NavigationType'
import Translation from '@/components/common/translation.vue'
import { uuid } from 'vue-uuid'
import NavigationPlacings from '@/constants/navigationPlacings'

@Component<NMAddRoute>({
  components: { Translation },
})
export default class NMAddRoute extends Vue {
  @Prop({ required: true, default: [] }) readonly subsystems: Array<INavigationItem>
  @Prop({ required: true, default: [] }) readonly otherRoutes: Array<INavigationItem>

  newRoute = {} as INavigationItem

  viewTypes = [
    { value: 'list', title: 'Lista' },
    { value: 'detail', title: 'Detaliczny' },
    { value: 'static', title: 'Statyczny' },
  ]

  placings = NavigationPlacings.map((el) => {
    return { value: el, title: this.$t(`enums.navigationPlacings.${el}`) }
  })

  viewSettings = []
  userRoles = []
  detailPathList: Array<any> = []
  subTree: Array<any> = []

  mounted() {
    this.$bvModal.show('add-route')
    this.newRoute = {
      id: uuid.v4(),
      isMenu: false,
      name: '',
      path: null,
      title: '',
      description: '',
      isSubsystem: false,
      sequence: 0,
      icon: '',
      isReadOnly: false,
      detailPath: null,
      authRequired: true,
      parentId: null,
      store: null,
      model: null,
      placing: 'usual',
      viewId: null,
      accessRoleId: null,
      presentation: false,
      component: '',
      viewType: this.viewTypes[0].value,
      isActive: false,
      paramValues: null,
      queryParam: null,
      hashParam: null,
      childs: [],
    }

    this.prepareSubsystemOptions()

    this.initDetailPathList()
    this.initViews()
    this.initUserRoles()
  }

  async initViews() {
    await this.$store
      .dispatch('viewSettings/findAll', { noCommit: true })
      .then((response) => {
        if (response && response.status === 200) {
          this.viewSettings = response.data
        } else {
          this.viewSettings = []
        }
      })
      .catch((err) => {
        console.error(err)
        this.viewSettings = []
      })
  }

  async initUserRoles() {
    const queryParams = {
      noCommit: true,
      params: {
        sort: { sortBy: 'name', sortDesc: true },
      },
    }

    await this.$store
      .dispatch('userRoles/findAll', queryParams)
      .then((response) => {
        if (response && response.status === 200) {
          this.userRoles = response.data
        } else {
          this.userRoles = []
        }
      })
      .catch((err) => {
        console.error(err)
        this.userRoles = []
      })
  }

  async handleOk(): Promise<void> {
    this.$emit('add-route-end', this.newRoute)
  }

  initDetailPathList() {
    this.initDetailPathRec(this.otherRoutes)
  }

  initDetailPathRec(navItems: any) {
    for (const navItem of navItems) {
      if (navItem.isSubsystem === true && navItem.childs.length > 0) {
        this.initDetailPathRec(navItem.childs)
      } else {
        this.detailPathList.push(navItem.name)
      }
    }

    this.detailPathList.sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1))
  }

  prepareSubsystemOptions() {
    for (const navSubsystem of this.subsystems) {
      if (navSubsystem.isSubsystem === true) {
        this.subTree.push({ id: navSubsystem.id, title: navSubsystem.title })
        if (navSubsystem.childs.length > 0) {
          for (const option of navSubsystem.childs) {
            if (navSubsystem.isSubsystem === true) {
              this.subTree.push({ id: option.id, title: `${navSubsystem.title} / ${option.title}` })
            }
          }
        }
      }
    }
  }

  handleCancel(): void {
    this.$emit('add-route-end', undefined)
  }

  handelClose(): void {
    this.$emit('add-route-end', undefined)
  }
}
</script>

<style>
</style>