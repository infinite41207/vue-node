<template>
  <div ref="buttonList" class="tool-bar-container mb-3 d-flex flex-row align-items-center" :class="containerClass" v-resize:resize="checkSize">
    <ToolBarItem v-for="(item, i) in shownButtons" :key="i" :item="item" ref="button" />
    <b-dropdown v-if="hiddenButtons.length > 0" right size="sm" variant="link" no-caret>
      <template v-slot:button-content>
        <i class="ri-menu-line font-24 icon-grey"></i>
      </template>
      <b-dropdown-form class="dropdown-form">
        <ToolBarItem v-for="(item, i) in hiddenButtons" :key="i" :item="item" />
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script>
import ToolBarItem from './item.vue'

export default {
  name: 'ToolBar',
  components: { ToolBarItem },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    containerClass: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      shownButtons: [],
      hiddenButtons: [],
    }
  },
  directives: {
    resize: {
      bind(el, binding) {
        window.addEventListener('resize', binding.value)
      },
      unbind(el, binding) {
        window.removeEventListener('resize', binding.value)
      },
    },
  },
  mounted() {
    console.log('items', this.items );
    this.shownButtons = [...this.items]
    this.checkSize()
  },
  methods: {
    async checkSize() {
      await this.$nextTick()
      const containerWidth = this.$refs.buttonList.clientWidth
      let totalButtonWidth = 0
      let hideButton = false

      for (let i = 0; i < this.shownButtons.length; i++) {
        const buttonWidth = this.$refs.button[i].$el.offsetWidth
        totalButtonWidth += buttonWidth + 15

        if (totalButtonWidth > containerWidth) {
          this.hiddenButtons.push({ ...this.shownButtons[i], width: buttonWidth })
          this.shownButtons.splice(i, 1)
          hideButton = true
        }
      }

      if (this.hiddenButtons.length > 0) {
        const lastIndex = this.hiddenButtons.length - 1
        const lastButton = this.hiddenButtons[lastIndex]
        if (!hideButton && totalButtonWidth + lastButton.width + 40 < containerWidth) {
          this.shownButtons.push(lastButton)
          this.hiddenButtons.splice(lastIndex, 1)
        }
      }
    },
  },
}
</script>

<style scoped lang="scss">
.tool-bar-container {
  gap: 12px;
}
.dropdown-form {
  form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    * {
      margin: 0 !important;
    }
  }
}
</style>
