<template>
  <!-- start page title -->
  <div class="row">
    <div class="col-12">
      <div class="page-title-box">
        <b-button-group class="mr-3">
          <b-button variant="outline-success" :disabled="firstView" size="sm" @click="moveNext"><i class="ri-arrow-left-s-line"></i></b-button>
          <b-button variant="outline-success" :disabled="lastView" size="sm" @click="movePrev"><i class="ri-arrow-right-s-line"></i></b-button>
        </b-button-group>
        <h4 class="page-title">{{ title }}</h4>
      </div>
    </div>
  </div>
  <!-- end page title -->
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {},
  props: {
    title: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      currViewIndex: null,
    }
  },

  computed: {
    ...mapGetters({
      visitedViews: 'tagsViews/visitedViewList',
    }),

    path() {
      return this.$route.path
    },

    firstView() {
      return this.currViewIndex === 0
    },

    lastView() {
      return this.currViewIndex === this.visitedViews.length - 1
    },
  },

  watch: {
    path() {
      this.getCurrentIndexView()
    },
  },

  created() {
    this.getCurrentIndexView()
  },

  methods: {
    moveNext() {
      if (this.currViewIndex > -1) {
        const nextView = this.visitedViews[this.currViewIndex - 1]
        if (nextView) {
          this.$router.push(nextView.fullPath)
        }
      }
    },

    movePrev() {
      if (this.currViewIndex > -1) {
        const nextView = this.visitedViews[this.currViewIndex + 1]
        if (nextView) {
          this.$router.push(nextView.fullPath)
        }
      }
    },

    getCurrentIndexView() {
      this.currViewIndex = this.visitedViews.findIndex((el) => el.path == this.path)
    },
  },
}
</script>