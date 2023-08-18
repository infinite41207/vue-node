<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Recent Activity',
    },
    activityWindowHeight: {
      type: String,
      default: '424',
    },
    activityData: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  methods: {
    async openTask(activity) {
      const dataObject = await this.$store.dispatch('tasks/findByPk', {
        params: {
          id: activity.id,
        },
      })
      if (dataObject) {
        this.$router.push({ name: 'task-detail' })
      }
    },
  },
}
</script>

<template>
  <div>
    <b-card>
      <div class="timeline-alt pl-3 pt-0 pb-0">
        <div v-for="activity of activityData" :key="activity.id" class="timeline-item">
          <i :class="`${activity.icon} bg-${activity.color}-lighten text-${activity.color} timeline-icon`"></i>
          <div class="timeline-item-info">
            <a href="javascript:void(0);" :class="`text-${activity.color} font-weight-bold mb-1 d-block`" @click="openTask(activity)">{{ activity.title }}</a>
            <small>
              {{ activity.text }}
              <span class="font-weight-bold">{{ activity.boldText }}</span>
            </small>
            <p class="mb-0 pb-2">
              <small class="text-muted">{{ activity.subtext }}</small>
            </p>
          </div>
        </div>
      </div>
    </b-card>
    <!-- end card-body -->
  </div>
  <!-- end card -->
</template>
