<template>
  <div>
    <div class="bp-analyze-modal" :class="isShow ? 'd-inline' : 'd-none'" v-if="isShow">
      <div class="modal-content">
        <div class="d-flex justify-content-between mb-3">
          <div :class="isProcessing ? 'opacity-100' : 'opacity-0'" class="d-flex align-items-center">
            <b-spinner class="ml-auto" variant="primary"></b-spinner>
            <strong class="ml-2 mt-1">Przetwarzanie...</strong>
          </div>
          <b-button aria-label="Close" class="close" @click="handleClose">×</b-button>
        </div>
        <b-row>
          <b-col md="4">
            <VueMermaid :nodes="nodes" type="graph TD"></VueMermaid>
          </b-col>
          <b-col md="8">
            <div class="mt-4">
              <div class="text-right">
                <b-button size="small mb-2" :disabled="isProcessing" @click="() => this.$emit('handleNext')">Go nextStage</b-button>
              </div>
              <b-card no-body class="py-2 px-3 mb-2 history-card" v-for="history in histories" v-bind:key="history.id">
                <div class="d-flex justify-content-between">
                  <div>{{ JSON.parse(history.stage).text }}</div>
                  <div>{{ dateFormat(history.createdAt) }}</div>
                </div>
              </b-card>
            </div>
          </b-col>
        </b-row>
      </div>
    </div>
    <div v-if="isShow" class="modal-overlay-back"></div>
  </div>
</template>

<script>
import VueMermaid from '@/components/mermaid/vue-mermaid.vue'

export default {
  name: 'bpAnalyze',
  props: {
    nodes: {
      type: Array,
      required: true,
    },
    isShow: {
      type: Boolean,
      required: true,
    },
    activeStage: {
      type: Object,
      required: true,
    },
    histories: {
      type: Array,
    },
    isProcessing: {
      type: Boolean,
    },
  },
  components: {
    VueMermaid,
  },
  created() {
    document.body.addEventListener('click', (e) => this.clickOutside(e))
  },
  methods: {
    clickOutside(e) {
      if (this.isShow) {
        const modalContent = document.querySelector('.modal-content')
        const analyzeBtn = document.querySelector('#analyze-btn')
        if (e.target !== analyzeBtn && !modalContent?.contains(e.target)) {
          this.$emit('onClose')
        }
      }
    },
    handleClose() {
      this.$emit('onClose')
    },
    activateStage() {
      const currentActive = document.querySelector('g.node.active')
      currentActive?.classList.remove('active')
      const elements = document.querySelector('.nodes')?.children
      if (elements) {
        Array.from(elements).map((e) => {
          if (e.textContent === this.activeStage.text) {
            e.classList.add('active')
          }
        })
      }
    },
    dateFormat(value) {
      return this.$options.filters['date'](value, 'datetime')
    },
  },
  watch: {
    isShow() {
      if (this.isShow) {
        this.$nextTick(function () {
          this.activateStage()
        })
      }
    },
    activeStage() {
      this.$nextTick(function () {
        this.activateStage()
      })
    },
  },
}
</script>

<style lang="scss">
.bp-analyze-modal {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 9999;
  padding: 40px;
  animation: slide-up 0.6s ease;

  .modal-content {
    padding: 20px;
    background: #f9f9f9;
    max-width: 1200px;
    margin: auto;
    box-shadow: 1px 1px 14px -1px;
    border-radius: 12px;

    .close {
      box-shadow: none !important;
      background: none;

      &:hover {
        color: black;
        border: 0;
      }

      &:active {
        color: black;
        background: none;
      }
    }
  }
}

.modal-overlay-back {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0.5;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  z-index: 9990;
}

.nodes {
  .node.active {
    transition: outline-offset 1s ease;
    &.active {
      border-radius: 5px;
      outline: 3px solid #32ae89;
      animation-duration: 2s;
      animation-name: pulse;
      animation-iteration-count: infinite;
    }
  }
}

.opacity-0 {
  opacity: 0 !important;
}

.opacity-100 {
  opacity: 100 !important;
}

.history-card {
  animation: slide-up 0.5s ease;
}

@keyframes slide-up {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    outline-offset: 0px;
  }

  50% {
    outline-offset: 4px;
  }

  100% {
    outline-offset: 0px;
  }
}
</style>
