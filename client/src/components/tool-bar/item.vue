<template>
  <div :class="item.containerClass">
    <b-button class="text-nowrap" :class="item.class" :variant="item.variant" :size="item.size" :disabled="item.disabled" @click="item.click">
      <i v-if="item.icon" :class="item.icon"></i>
      {{ item.title }}
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'ToolBarItem',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>

<style scoped></style>
