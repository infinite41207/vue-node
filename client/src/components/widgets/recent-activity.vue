<script>
import simplebar from 'simplebar-vue'

/**
 * Recent-activity component
 * 1. User specifies the title of window using the 'title' input property.
 * 2. Window height set using the 'activityWindowHeight' input property. Height would count in pixel.
 * 3. Activitydata array specify the id, icon, title, text, subtext, boldText, color
 *    id - Unique id of activity
 *    icon - Activity icon name
 *    title - Activity name specified in title.
 *    text - Activity description specify in text.
 *    subtext - Activity performed on which time, that specified in subtext.
 *    boldText - From activity description the highlight words of text specified using boldText
 *    color - Activity icon color specify using the color
 */
export default {
  components: {
    simplebar,
  },
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
  mounted() {
    this.$refs.simplebar.$el.style.height = this.activityWindowHeight + 'px'
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
    <simplebar ref="simplebar">
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
    </simplebar>
    <!-- end card-body -->
  </div>
  <!-- end card -->
</template>
