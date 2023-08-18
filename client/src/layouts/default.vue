<template>
  <b-row class="d-flex">
    <b-col cols class="bg-default d-none d-md-flex justify-content-center align-items-center">
      <img src="@/assets/images/bg-auth.png" />
    </b-col>
    <b-col cols class="p-3">
      <slot />
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'DefaultLayout',
}
</script>