<template>
  <layout>
    <fm-builder></fm-builder>
  </layout>
</template>

<script>
import Layout from '@/layouts/main'
import FmBuilder from '@/components/form-builder/Container'

export default {
  name: 'FormBuilder',

  components: {
    Layout,
    FmBuilder
  },
}
</script>
