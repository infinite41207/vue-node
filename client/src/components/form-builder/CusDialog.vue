<template>
  <b-modal class="cus-dialog-container" :title="title" v-model="dialogVisible" centered :size="size" :id="id">
    <span v-if="show">
      <slot></slot>
    </span>

    <span v-if="action" slot="footer" v-loading="loading" :element-loading-text="loadingText">
      <slot name="action">
        <b-button @click="close">{{ $t('fm.actions.cancel') }}</b-button>
        <b-button type="primary" @click="submit">{{ $t('fm.actions.confirm') }}</b-button>
      </slot>
    </span>
  </b-modal>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    loadingText: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'md',
    },
    form: {
      type: Boolean,
      // eslint-disable-next-line
      default: true,
    },
    action: {
      type: Boolean,
      // eslint-disable-next-line
      default: true,
    },
  },
  computed: {
    show() {
      if (this.form) {
        return this.showForm
      } else {
        return true
      }
    },
  },
  data() {
    return {
      loading: false,
      dialogVisible: this.visible,
      id: 'dialog_' + new Date().getTime(),
      showForm: false,
    }
  },
  methods: {
    close() {
      this.dialogVisible = false
    },
    submit() {
      this.loading = true

      this.$emit('on-submit')
    },
    end() {
      this.loading = false
    },
  },
  mounted() {},
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.loading = false
        this.$emit('on-close')
        setTimeout(() => {
          this.showForm = false
        }, 300)
      } else {
        this.showForm = true
      }
    },
    visible(val) {
      this.dialogVisible = val
    },
  },
}
</script>

<style lang="scss">
.cus-dialog-container {
  // .el-dialog__footer{
  //   margin: 0 20px;
  //   // border-top: 1px dashed #ccc;
  //   padding: 15px 0 16px;
  //   text-align: center;
  //   position: relative;

  //   .dialog-footer{
  //     display: block;

  //     .circular{
  //       display: inline-block;
  //       vertical-align: middle;
  //       margin-right: 5px;
  //       width: 24px;
  //       height: 24px;
  //     }

  //     .el-loading-text{
  //       display: inline-block;
  //       vertical-align: middle;
  //     }

  //     .el-loading-spinner{
  //       margin-top: -12px;
  //     }
  //   }
  // }
}
</style>
