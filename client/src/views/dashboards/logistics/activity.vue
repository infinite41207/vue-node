<script>
export default {
  name: 'DashboardProjejctsActivity',
  data() {
    return {
      activities: [
        {
          image: require('@/assets/images/users/user.png'),
          name: 'Soren Drouin',
          date: '18 Jan 2019 11:28 pm',
          text: 'Completed "Design new idea"...',
          project: 'Hyper Mockup',
        },
        {
          image: require('@/assets/images/users/user.png'),
          name: 'Anne Simard',
          date: '18 Jan 2019 11:09 pm',
          text: 'Assigned task "Poster illustation design"...',
          project: 'Hyper Mockup',
        },
        {
          image: require('@/assets/images/users/user.png'),
          name: 'Nicolas Chartier',
          date: '15 Jan 2019 09:29 pm',
          text: 'Completed "Drinking bottle graphics"...',
          project: 'Web UI Design',
        },
        {
          image: require('@/assets/images/users/user.png'),
          name: 'Gano Cloutier',
          date: '10 Jan 2019 08:36 pm',
          text: 'Completed "Design new idea"...',
          project: 'UBold Admin',
        },
        {
          image: require('@/assets/images/users/user.png'),
          name: 'Francis Achin',
          date: '08 Jan 2019 12:28 pm',
          text: 'Assigned task "Hyper app design"...',
          project: 'Website Mockup',
        },
      ],
      fields: [
        { key: 'name', label: '' },
        { key: 'project', label: '' },
        { key: 'actions', label: '' },
      ],
    }
  },
}
</script>
<template>
  <b-card>
    <b-row no-gutters class="justify-content-between mb-3">
      <h4 class="header-title">Recent Activities</h4>
      <b-dropdown toggle-class="card-drop p-0" variant="black" no-caret right>
        <template v-slot:button-content>
          <i class="ri-more-2-fill"></i>
        </template>
        <b-dropdown-item>Weekly Report</b-dropdown-item>
        <b-dropdown-item>Monthly Report</b-dropdown-item>
        <b-dropdown-item>Action</b-dropdown-item>
        <b-dropdown-item>Settings</b-dropdown-item>
      </b-dropdown>
    </b-row>
    <b-table responsive :items="activities" :fields="fields" class="products-table">
      <template v-slot:cell(name)="data">
        <b-media>
          <template #aside>
            <img class="rounded-circle" :src="`${data.item.image}`" width="40" alt="Generic placeholder image" />
          </template>
          <h5 class="mt-0 mb-1">
            {{ data.item.name }}
            <small class="font-weight-normal ml-3">{{ data.item.date }}</small>
          </h5>
          <span class="font-13">{{ data.item.text }}</span>
        </b-media>
      </template>
      <template v-slot:cell(project)="data">
        <span class="text-muted font-13">Project</span>
        <p class="mb-0">{{ data.item.project }}</p>
      </template>
      <template v-slot:cell(actions)>
        <b-dropdown toggle-class="card-drop p-0" variant="black" no-caret right>
          <template v-slot:button-content>
            <i class="ri-more-fill"></i>
          </template>
          <b-dropdown-item>Settings</b-dropdown-item>
          <b-dropdown-item>Action</b-dropdown-item>
        </b-dropdown>
      </template>
    </b-table>
  </b-card>
</template>
