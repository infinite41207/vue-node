<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col class="mb-2">
              <b-button-toolbar>
                <b-btn-group>
                  <b-button variant="success" class="btn-sm" @click="writeAndCloseNavigation">
                    <i class="ri-save-2-fill-move"></i>
                    {{ $t('commands.writeAndClose') }}
                  </b-button>
                  <b-button variant="outline-secondary" class="btn-sm ml-1" @click="writeNavigation">
                    <i class="ri-save-2-fill"></i>
                    {{ $t('commands.write') }}
                  </b-button>
                  <b-button variant="outline-secondary" class="btn-sm ml-1" @click="closeNavigation">
                    <i class="ri-close-line"></i>
                    {{ $t('commands.close') }}
                  </b-button>
                  <b-button variant="outline-secondary" class="btn-sm ml-1" @click="updateNavigation">
                    <i class="ri-refresh-line"></i>
                    {{ $t('commands.update') }}
                  </b-button>
                </b-btn-group>
              </b-button-toolbar>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="6">
              <b-card>
                <b-row class="mb-2">
                  <b-col>
                    <h4>Nawigacja dostępna (Menu)</h4>
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col>
                    <b-button-toolbar>
                      <b-btn-group>
                        <b-button variant="outline-secondary" class="btn-sm" @click="addSubsystem">
                          <i class="ri-add-line"></i>
                          {{ $t('common.subsystem') }}
                        </b-button>
                      </b-btn-group>
                    </b-button-toolbar>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col>
                    <NestedList v-model="navigation" :subsystems="navigation" :otherRoutes="otherRoutes" el-type="main" @remove-item="onRemoveListItem" />
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
            <b-col>
              <b-card>
                <b-row>
                  <b-col>
                    <h4>Pozostałe widoki</h4>
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col
                    ><b-button-toolbar>
                      <b-btn-group>
                        <b-button variant="outline-secondary" class="btn-sm" @click="addRoute">
                          <i class="ri-add-line"></i>
                          {{ $t('common.view') }}
                        </b-button>
                      </b-btn-group>
                    </b-button-toolbar>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col>
                    <div class="routes-container">
                      <draggable v-bind="dragOptions" tag="div" class="item-container" :list="otherRoutes" @change="onChangeView">
                        <div v-for="(el, idx) in otherRoutes" :key="idx" class="item-group">
                          <div class="item">
                            <b-row>
                              <b-col>
                                <b-form-checkbox v-model="el.isActive" class="float-left" name="switch-active" size="sm" switch> </b-form-checkbox>
                                <a href="javascript:void(0)" class="ml-1 text-secondary" @click="editRouteItem(el)">
                                  <i v-if="el.icon !== ''" :class="el.icon" class="mr-1"></i><strong>{{ el.title }}</strong>
                                </a>
                              </b-col>
                              <b-col>
                                <span>{{ el.name }}</span>
                                <i class="ri-close-line text-danger float-right" @click="deleteRouteItem(idx)"></i>
                              </b-col>
                            </b-row>
                          </div>
                        </div>
                      </draggable>
                    </div>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <AddSubsystem v-if="viewMode === 'addSubsystem'" :subsystems="navigation" @add-subsystem-end="onAddSubsystemEnd" />
    <AddRoute v-if="viewMode === 'addRoute'" :subsystems="navigation" :otherRoutes="otherRoutes" @add-route-end="onAddRouteEnd" />
    <EditRoute v-if="viewMode === 'editRoute'" v-model="currentRoute" :subsystems="navigation" :otherRoutes="otherRoutes" @edit-route-end="onEditRouteEnd" />
  </Layout>
</template>

<script lang="ts">
import appConfig from '@/app.config.json'
import PageHeader from '@/components/page-header.vue'
import { Component, Vue } from 'vue-property-decorator'
import Layout from '@/layouts/main.vue'
import VJstree from 'vue-jstree'
import { INavigationItem } from '@/store/types/NavigationType'
import AddSubsystem from './components/add-subsystem.vue'
import AddRoute from './components/add-route.vue'
import EditRoute from './components/edit-route.vue'
import NestedList from './components/nested-list.vue'
import { MetaInfo } from 'vue-meta'
import draggable from 'vuedraggable'

@Component<NawigationManager>({
  components: { Layout, PageHeader, VJstree, AddSubsystem, AddRoute, EditRoute, NestedList, draggable },

  page(): MetaInfo {
    return { title: this.$tc('route.navigation'), meta: [{ name: 'description', content: appConfig.description }] }
  },
})
export default class NawigationManager extends Vue {
  viewMode = 'common'
  title: string = this.$tc('route.navigation')

  get dragOptions() {
    return {
      animation: 200,
      group: 'title',
      disabled: false,
      ghostClass: 'ghost',
    }
  }

  get currentLanguage() {
    return this.$store.getters['auth/currentLanguage']
  }

  currentRoute: INavigationItem | null
  navigation: Array<INavigationItem> = []
  otherRoutes: Array<INavigationItem> = []

  created() {
    // Mock: get all routes and roles list from server
    this.initNavigation()
  }

  async initNavigation(): Promise<void> {
    this.navigation = []
    this.otherRoutes = []

    await this.$store
      .dispatch('navigation/findAll', {
        params: {
          filter: {},
          lang: this.currentLanguage.code,
        },
        noCommit: true,
      })
      .then((response) => {
        if (response.status === 200) {
          for (const navItem of response.data) {
            if (navItem.isMenu === true) {
              this.navigation.push(navItem)
            } else {
              this.otherRoutes.push(navItem)
            }
          }
        } else {
          this.navigation = []
          this.otherRoutes = []
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  writeAndCloseNavigation() {
    this.writeNavigation()
    this.closeNavigation()
  }

  writeNavigation() {
    const resultRoutes: Array<INavigationItem> = [...this.navigation]
    this.prepareNavigationBeforeWrite(resultRoutes)

    this.$store
      .dispatch('navigation/update', resultRoutes)
      .then((response) => {
        if (response.status === 200) {
          this.$bvToast.toast('Nawigacja została zapisana', {
            title: this.$tc('common.msg'),
            variant: 'success',
            solid: true,
            autoHideDelay: 2000,
          })
        } else {
          this.$bvToast.toast(`Błąd zapisania nawigacji ${response.data.message}`, {
            title: this.$tc('common.msg'),
            variant: 'danger',
            solid: true,
            autoHideDelay: 2000,
          })
        }
      })
      .catch((error) => {
        console.error(error)
        this.$bvToast.toast('Błąd zapisania nawigacji', {
          title: this.$tc('common.msg'),
          variant: 'danger',
          solid: true,
          autoHideDelay: 2000,
        })
      })
  }

  closeNavigation() {
    this.$router.push({ name: 'administration' })
    this.$destroy()
    this.$store.dispatch('tagsViews/delView', { name: this.$route.name, path: this.$route.path })
  }

  prepareNavigationBeforeWrite(resultRoutes: Array<INavigationItem>) {
    for (const otherRoute of this.otherRoutes) {
      resultRoutes.push(otherRoute)
    }

    this.fillSequenceRecursively(resultRoutes, 0)
  }

  fillSequenceRecursively(items: Array<INavigationItem>, seq: number) {
    for (const navItem of items) {
      navItem.sequence = ++seq

      this.fillSequenceRecursively(navItem.childs, seq)
    }
  }

  updateNavigation() {
    this.initNavigation()
  }

  onRemoveListItem(idx: number) {
    this.navigation.splice(idx, 1)
  }

  addSubsystem(): void {
    this.viewMode = 'addSubsystem'
  }

  addRoute() {
    this.viewMode = 'addRoute'
  }

  deleteRouteItem(idx: number) {
    this.otherRoutes.splice(idx, 1)
  }

  async onAddSubsystemEnd(result: INavigationItem | undefined): Promise<void> {
    this.viewMode = 'common'

    if (result) {
      if (result.parentId && result.parentId !== '') {
        const parentItem = this.navigation.find((el) => el.id === result.parentId)

        if (parentItem) {
          parentItem.childs.push(result)
        } else {
          this.navigation.push(result)
        }
      } else {
        this.navigation.push(result)
      }
    }
  }

  onChangeView(item: any) {
    if (item.added) {
      if (item.added.element.isMenu === true) {
        item.added.element.isMenu = false
        item.added.element.parentId = null
      }
    }
  }

  async onAddRouteEnd(result: INavigationItem | undefined): Promise<void> {
    this.viewMode = 'common'

    if (result) {
      if (result.parentId) {
        result.isMenu = true
        const subIndex = this.navigation.findIndex((el) => el.id === result.parentId)

        if (subIndex > -1) {
          this.navigation[subIndex].childs.push(result)
        } else {
          for (const subItem of this.navigation) {
            const partIndex = subItem.childs.findIndex((el) => el.id === result.parentId)

            if (partIndex > -1) {
              subItem.childs[partIndex].childs.push(result)
            }
          }
        }
      } else {
        result.isMenu = false
        this.otherRoutes.push(result)
      }
    }
  }

  editRouteItem(el: INavigationItem) {
    this.currentRoute = el
    this.viewMode = 'editRoute'
  }

  onEditRouteEnd(result: INavigationItem | undefined) {
    this.viewMode = 'common'
  }
}
</script>

<style scope>
.routes-container {
  height: 68vh;
  overflow-y: auto;
}

.item-container {
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 10px;
  outline: 1px dashed;
}

.item-group {
  margin-bottom: 3px;
}
.item {
  padding: 0.5rem;
  border: solid #2d2d2e 1px;
  background-color: #fefefe;
  border-radius: 0.25rem;
}
</style>