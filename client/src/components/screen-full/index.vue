<template>
  <a class="nav-link toggle-right">
    <i class="icon toggle-right" :class="isFullscreen ? 'ri-fullscreen-exit-line' : ' ri-fullscreen-line'" @click="click"></i>
  </a>
</template>

<script>
export default {
  name: 'ScreenFull',

  data() {
    return {
      isFullscreen: false,
      elem: document.documentElement,
    }
  },

  methods: {
    click() {
      if (this.isFullscreen === true) {
        this.closeFullscreen()
        this.isFullscreen = false
      } else {
        this.openFullscreen()
        this.isFullscreen = true
      }
    },

    openFullscreen() {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen()
      } else if (this.elem.webkitRequestFullscreen) {
        this.elem.webkitRequestFullscreen()
      } else if (this.elem.msRequestFullscreen) {
        this.elem.msRequestFullscreen()
      }
    },

    closeFullscreen() {
      const doc = document
      if (doc.exitFullscreen) {
        doc.exitFullscreen()
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen()
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen()
      }
    },
  },
}
</script>
