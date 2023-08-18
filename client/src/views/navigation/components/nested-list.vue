<template>
  <div>
    <Draggable v-bind="dragOptions" tag="div" class="item-container" :list="list" :value="value" @input="onInputItem" @change="onChange">
      <div :el-type="elType" v-for="(el, idx) in realValue" :key="el.id">
        <div class="item-group">
          <div class="item" :class="[el.isSubsystem === true ? (el.parentId === null ? 'subsystem-item' : 'partition-item') : 'route-item']">
            <b-row>
              <b-col>
                <a
                  v-if="el.childs.length > 0"
                  v-b-toggle="`collapse-nav-${el.id}`"
                  class="float-left btn btn-sm action-icon ri-arrow-down-s-line a-collapse-nested"
                  name="a-collapse-nested"
                  size="sm"
                  switch
                >
                </a>
                <a v-else class="float-left btn btn-sm action-icon ri-drag-move-fill a-collapse-nested" name="a-collapse-nested" size="sm" switch> </a>
                <b-form-checkbox v-model="el.isActive" class="float-left" name="switch-active" size="sm" switch> </b-form-checkbox>
                <a href="javascript:void(0)" class="ml-1 text-secondary" @click="editItem(el)">
                  <i v-if="el.icon !== ''" :class="el.icon" class="mr-1"></i>
                  <strong class="item-title">{{ el.title }}</strong>
                </a>
              </b-col>
              <b-col>
                <span>{{ el.name }}</span>
                <i class="ri-close-line text-danger float-right" @click="deleteAt(idx)"></i>
              </b-col>
            </b-row>
          </div>
          <template v-if="el.isSubsystem">
            <b-collapse :id="`collapse-nav-${el.id}`">
              <nested-list class="item-sub" :list="el.childs" :subsystems="subsystems" :otherRoutes="otherRoutes" el-type="nested" />
            </b-collapse>
          </template>
        </div>
      </div>
    </Draggable>
    <EditSubsystem v-if="editSubsystemMode" v-model="currentItem" :subsystems="subsystems" @edit-item-end="onEditSubsystemEnd" />
    <EditRoute v-if="editRouteMode" v-model="currentItem" :subsystems="subsystems" :otherRoutes="otherRoutes" @edit-route-end="onEditRouteEnd" />
  </div>
</template>

<script lang="ts">
import { INavigationItem } from '@/store/types/NavigationType'
import { Component, Prop, Vue } from 'vue-property-decorator'
import EditSubsystem from './edit-subsystem.vue'
import EditRoute from './edit-route.vue'
import Draggable from 'vuedraggable'

@Component<NestedList>({
  components: { Draggable, EditSubsystem, EditRoute },
})
export default class NestedList extends Vue {
  @Prop({ required: false, default: null }) value: Array<any>
  @Prop({ required: false, default: null }) list: Array<any>
  @Prop({ required: false, default: null }) subsystems: Array<INavigationItem>
  @Prop({ required: false, default: null }) otherRoutes: Array<INavigationItem>
  @Prop({ required: false, default: null }) elType: string

  currentItem: INavigationItem | null
  editSubsystemMode = false
  editRouteMode = false

  get dragOptions() {
    return {
      animation: 200,
      group: 'title',
      disabled: false,
      ghostClass: 'ghost',
    }
  }

  // this.value when input = v-model
  // this.list  when input !== v-model
  get realValue() {
    return this.value ? this.value : this.list
  }

  onInputItem(value: any) {
    this.$emit('input', value)
  }

  onChange(item: any) {
    if (item.added) {
      if (item.added.element.isMenu === false) {
        item.added.element.isMenu = true
      }

      this.updateParrentId(item.added.element.id, this.subsystems, null)
    }
  }

  updateParrentId(id: string, items: Array<INavigationItem>, parentId: string | null) {
    for (const navItem of items) {
      if (navItem.id === id) {
        navItem.parentId = parentId
        break
      }
      if (navItem.childs.length > 0) {
        this.updateParrentId(id, navItem.childs, navItem.id)
      }
    }
  }

  deleteAt(idx: number) {
    if (this.list) {
      this.list.splice(idx, 1)
    } else {
      this.$emit('remove-item', idx)
    }
  }

  editItem(el: INavigationItem) {
    this.currentItem = el
    if (el.isSubsystem === true) {
      this.editSubsystemMode = true
    } else {
      this.editRouteMode = true
    }
  }

  onEditSubsystemEnd() {
    this.editSubsystemMode = false
  }

  onEditRouteEnd() {
    this.editRouteMode = false
  }
}
</script>

<style scoped>
.item-container {
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 10px;
  outline: 1px dashed;
}
.item {
  padding: 0.5rem;
  border: solid #2d2d2e 1px;
  background-color: #fefefe;
  border-radius: 0.25rem;
}
.item-sub {
  margin: 0 0 0 1rem;
}

.subsystem-item {
  background-color: #313a46;
}

.subsystem-item .item-title {
  color: rgba(255, 255, 255, 0.5019607843);
}

.partition-item {
  background-color: #ccd5dd;
}

.a-collapse-nested {
  padding: 0.1rem 0.5rem 0.1rem 0.1rem;
}
</style>