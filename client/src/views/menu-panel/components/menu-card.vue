<template>
  <div class="card-wrapper">
    <b-card class="custom-card" @click="redirect(item)">
      <div class="icon-wrapper">
        <i v-if="item.meta.icon" :class="item.meta.icon"></i>
      </div>
      <div class="text-wrapper">
        <div :class="titleClass"
          ><b>{{ getTitle(item) }}</b></div
        >
        <div :class="mediumSize ? 'description-medium' : ''">{{ item.meta.description }}</div>
      </div>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'MenuCard',

  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      },
    },
    size: {
      type: String,
      default: 'medium',
    },
    parentPath: {
      type: String,
      default: '',
      require: false,
    },
  },

  computed: {
    mediumSize() {
      return this.size === 'medium'
    },

    titleClass() {
      //if (this.item.meta.description && this.item.meta.description !== '') {
      return ''
      //}
      //return this.mediumSize ? 'title-medium' : 'title-small'
    },
  },

  methods: {
    redirect(item) {
      this.$router.push({
        path: this.parentPath !== '' ? `${this.parentPath}/${item.path}` : item.path,
      })
    },

    getTitle(item) {
      if (item.meta.isDynamic) {
        return item.meta.title
      }

      return this.$tc(`route.${item.meta.title}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.card-wrapper {
  height: 120px;
  margin-bottom: 24px;
}

.custom-card {
  cursor: pointer;
  border: 1px solid #eeefef;
  border-radius: 4px;
  height: 100%;
  margin-bottom: 0px;
}

.card-body {
  display: flex;
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #32ae8920;
  min-width: 40px;
  min-height: 40px;
  width: 40px;
  height: 40px;
  font-size: 24px;
  line-height: 1;
  transition: all 0.38s ease-out;
  border-radius: 50%;
  color: #32ae89;

  i {
    font-size: 24px;
  }
}

.custom-card:hover {
  background-color: #eaf5fe;
  border: 1px solid #32ae89;
}

.text-wrapper {
  padding-left: 15px;
  height: 100%;
  font-size: 13px;
}

.description-medium {
  margin-top: 14px;
}

.title-small {
  margin-top: 28px;
}

.title-medium {
  margin-top: 33px;
}
</style>
