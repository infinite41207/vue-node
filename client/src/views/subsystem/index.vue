<template>
  <div>
    <template v-if="$route.meta.isSubsystem">
      <panel />
    </template>
    <template v-else><router-view></router-view></template>
  </div>
</template>

<script>
import Panel from '../menu-panel'

export default {
  name: 'SubsystemPage',

  components: {
    Panel,
  },
}
</script>
