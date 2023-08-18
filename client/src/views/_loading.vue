<template>
  <Layout>
    <div class="preloader">
      <div id="status">
        <b-spinner style="width: 3rem; height: 3rem" label="Large Spinner" variant="primary"></b-spinner>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/layouts/main'

export default {
  name: 'PageLoading',

  page: {
    title: 'Loading page...',
    meta: [{ name: 'description', content: 'Loading page...' }],
  },

  components: { Layout },
}
</script>