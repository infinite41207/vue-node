<template>
  <b-modal
    id="edit-route"
    size="xl"
    :title="`${$t('navigation.editRoute')}`"
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
            <b-form-checkbox v-model="value.isActive" class="mt-1" name="is-active" switch> </b-form-checkbox>
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <b-form-group horizontal :label-cols="6" :label="$t('table.readOnly')" label-for="is-active">
            <b-form-checkbox v-model="value.isReadOnly" class="mt-1" name="is-read-only" switch> </b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.parent')" label-for="item-parent">
            <b-form-select id="item-parent" v-model="value.parentId" :options="subTree" value-field="id" text-field="title" options-field="options" size="sm">
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
            <b-form-select v-model="value.placing" :options="placings" value-field="value" text-field="title" size="sm">
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
            <b-form-input id="item-name" v-model="value.name" type="text" name="item-name" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.path')" label-for="item-path">
            <b-input-group>
              <b-form-input id="item-path" v-model="value.path" type="text" name="item-path" size="sm"></b-form-input>
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
                v-model="value.paramValues"
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
              <b-form-input id="item-query-param" v-model="value.queryParam" type="text" name="item-query-param" placeholder="param1=value1&param2=value2" size="sm"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group horizontal :label-cols="3" :label="$t('table.hashParam')" label-for="item-hash-param">
              <b-form-input id="item-hash-param" v-model="value.hashParam" type="text" name="item-hash-param" placeholder="param1=value1&param2=value2" size="sm"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </b-collapse>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.title')" label-for="item-title">
            <b-input-group>
              <b-form-input id="item-title" v-model="value.title" type="text" name="item-title" size="sm"></b-form-input>
              <b-input-group-append>
                <Translation v-model="value.lang" input="title" />
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.description')" label-for="item-description">
            <b-input-group>
              <b-form-input id="item-description" v-model="value.description" type="text" name="item-description" size="sm"></b-form-input>
              <b-input-group-append>
                <Translation v-model="value.lang" input="description" />
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.accessRole')" label-for="item-access-role">
            <b-select v-model="value.accessRoleId" :options="userRoles" value-field="id" text-field="name" size="sm"> </b-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.viewType')" label-for="item-view-type">
            <b-select v-model="value.viewType" :options="viewTypes" value-field="value" text-field="title" size="sm"> </b-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-if="value.viewType !== 'static'">
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.view')" label-for="item-view">
            <b-select v-model="value.viewId" :options="viewSettings" value-field="id" text-field="name" size="sm"> </b-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-if="value.viewType === 'static'">
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.component')" label-for="item-component">
            <b-form-input id="item-component" v-model="value.component" type="text" name="item-component" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.detailPath')" label-for="item-detail-path">
            <b-form-select id="item-detail-path" v-model="value.detailPath" :options="detailPathList" name="item-detail-path" size="sm"></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.store')" label-for="item-store">
            <b-form-input id="item-store" v-model="value.store" type="text" name="item-store" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.model')" label-for="item-model">
            <b-form-input id="item-model" v-model="value.model" type="text" name="item-model" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="5" :label="$t('navigation.getPrezentation')" label-for="item-prezentation">
            <b-form-checkbox v-model="value.presentation" class="mt-1" name="is-active" switch> </b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="10">
          <b-form-group horizontal :label-cols="3" :label="$t('table.icon')" label-for="item-icon">
            <b-form-input id="item-icon" v-model="value.icon" type="text" class="ml-2" name="item-icon" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <i :class="value.icon" class="ml-1 p-1 prev-icon align-middle"></i>
        </b-col>
      </b-row>
    </b-card>
  </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { INavigationItem } from '@/store/types/NavigationType'
import Translation from '@/components/common/translation.vue'
import NavigationPlacings from '@/constants/navigationPlacings'

@Component<NMEditRoute>({
  components: { Translation },
})
export default class NMEditRoute extends Vue {
  @Prop({ required: true, default: null }) readonly value: INavigationItem
  @Prop({ required: true, default: [] }) readonly subsystems: Array<INavigationItem>
  @Prop({ required: true, default: [] }) readonly otherRoutes: Array<INavigationItem>

  prevParent: string | null | undefined
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
    this.$bvModal.show('edit-route')
    this.prevParent = this.value.parentId
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

  async handleOk(): Promise<void> {
    this.$emit('input', this.value)

    if (this.value.parentId !== this.prevParent) {
      this.deleteFromPrevLocation(this.subsystems)
      this.addToNevLocation()
    }

    this.$emit('edit-route-end', undefined)
  }

  deleteFromPrevLocation(navItems: Array<INavigationItem>, deleted = false) {
    const prevIndex = navItems.findIndex((el) => {
      return el.id === this.value.id
    })

    if (prevIndex > -1) {
      navItems.splice(prevIndex, 1)
      deleted = true
    } else {
      for (const navItem of navItems) {
        if (deleted === true) {
          break
        }
        if (navItem.childs.length > 0) {
          this.deleteFromPrevLocation(navItem.childs, deleted)
        }
      }
    }
  }

  addToNevLocation() {
    if (this.value.parentId === null) {
      this.subsystems.push(this.value)
    } else {
      const nevParent = this.subsystems.find((el) => el.id === this.value.parentId)

      if (nevParent) {
        nevParent.childs.push(this.value)
      } else {
        for (const subItem of this.subsystems) {
          const nevParent = subItem.childs.find((el) => el.id === this.value.parentId)

          if (nevParent) {
            nevParent.childs.push(this.value)
            break
          }
        }
      }
    }
  }

  handleCancel(): void {
    this.$emit('edit-route-end', undefined)
  }

  handelClose(): void {
    this.$emit('edit-route-end', undefined)
  }
}
</script>

<style>
</style>