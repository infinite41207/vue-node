<script>
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'

import Stats from './stats'
import ProjectStatus from './project-status'
import Tasks from './tasks'
import TasksOverview from './tasks-overview'
import Activity from './activity'
import Calendar from './calendar'

/**
 * Dashboard-Projects Component
 */
export default {
  name: 'DashboardProjects',
  page() {
    return {
      title: this.title,
      meta: [{ name: 'description' }],
    }
  },
  components: {
    Layout,
    PageHeader,
    Stats,
    ProjectStatus,
    Tasks,
    TasksOverview,
    Activity,
    Calendar,
  },
  data() {
    return {
      title: 'Projects',
    }
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" />

    <div class="row">
      <div class="col-12">
        <Stats />
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4">
        <ProjectStatus />
      </div>
      <div class="col-lg-8">
        <Tasks />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <TasksOverview />
      </div>
    </div>
    <div class="row">
      <div class="col-xl-6">
        <Activity />
      </div>
      <div class="col-xl-6">
        <Calendar />
      </div>
    </div>
  </Layout>
</template>
