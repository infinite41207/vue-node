<template>
  <b-dropdown variant="primary" class="fab-container" toggle-class="fab-toggle" menu-class="fab-menu" dropup right no-caret>
    <template #button-content>
      <i class="ri-add-fill"></i>
    </template>
    <b-dropdown-item-button v-for="(item, i) in data" :key="i" :disabled="item.disabled" @click="item.click" button-class="btn-lg">
      <i v-if="item.icon" :class="item.icon"></i>
      {{ item.title }}
    </b-dropdown-item-button>
  </b-dropdown>
</template>

<script>
export default {
  name: 'FabButton',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss">
.fab-container {
  position: fixed;
  bottom: 50px;
  @media (max-width: 768px) {
    right: 50px;
  }
}

.fab-toggle {
  border-radius: 50% !important;
  padding: 12px !important;
  font-size: 32px !important;
  line-height: 1 !important;
  transition: transform 0.3s;

  .ri-add-fill {
    font-size: inherit !important;
  }
}

.dropdown.show .fab-toggle {
  transform: rotate(135deg);
}

.fab-menu {
  top: 30px !important;
  left: -60px !important;

  i {
    font-size: inherit;
    line-height: inherit;
  }
}
</style>
