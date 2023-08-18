<template>
  <div>
    <Draggable v-bind="dragOptions" tag="div" class="item-container" :list="list" :value="value" @input="onInputItem">
      <div :el-type="elType" v-for="(el, idx) in realValue" :key="el.id">
        <div class="item-group">
          <div class="item">
            <b-row>
              <b-col>
                <a
                  v-if="el.list || el.columns"
                  v-b-toggle="`collapse-nav-${el.key}`"
                  class="float-left btn btn-sm action-icon ri-arrow-down-s-line a-collapse-nested"
                  name="a-collapse-nested"
                  size="sm"
                  switch
                >
                </a>
                <a v-else class="float-left btn btn-sm action-icon ri-drag-move-fill a-collapse-nested" name="a-collapse-nested" size="sm" switch> </a>
                <a href="javascript:void(0)" class="ml-1 text-secondary" @click="editItem(el)">
                  <strong class="item-title">{{ el.name }}</strong>
                </a>
              </b-col>
              <b-col>
                <span>{{ el.key }}</span>
                <i class="ri-close-line text-danger float-right" @click="deleteAt(idx)"></i>
              </b-col>
            </b-row>
          </div>
          <template v-if="el.columns">
            <b-collapse :id="`collapse-nav-${el.key}`">
              <div v-for="(column, index) of el.columns" :key="index">
                <div class="item-sub mb-1 mt-1">
                  <strong class="item-title">column {{ ++index }}</strong>
                </div>
                <NestedList class="item-sub" :list="column.list" el-type="nested" />
              </div>
            </b-collapse>
          </template>
          <template v-if="el.list">
            <b-collapse :id="`collapse-nav-${el.key}`">
              <NestedList class="item-sub" :list="el.list" el-type="nested" />
            </b-collapse>
          </template>
        </div>
      </div>
    </Draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  name: 'NestedList',

  components: {
    Draggable,
  },

  props: ['value', 'list', 'elType'],

  data() {
    return {
      currentItem: null,
    }
  },

  // this.value when input = v-model
  // this.list  when input !== v-model
  computed: {
    realValue() {
      return this.value ? this.value : this.list
    },

    dragOptions() {
      return {
        animation: 200,
        group: 'title',
        disabled: false,
        ghostClass: 'ghost',
      }
    },
  },

  mounted() {},

  methods: {
    onInputItem(value) {
      this.$emit('input', value)
    },

    deleteAt(idx) {
      if (this.list) {
        this.list.splice(idx, 1)
      } else {
        this.$emit('remove-item', idx)
      }
    },
  },
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
  padding: 0.2rem;
  border: solid #2d2d2e 1px;
  background-color: #fefefe;
  border-radius: 0.25rem;
}
.item-sub {
  margin: 0 0 0 1rem;
}

.a-collapse-nested {
  padding: 0.1rem 0.5rem 0.1rem 0.1rem;
}
</style>