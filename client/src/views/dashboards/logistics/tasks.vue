<script>
export default {
  name: 'DashboardProjectsTasks',
  data() {
    return {
      tasksData: [
        {
          name: 'Coffee detail page - Main Page',
          day: 3,
          status: 'In-progress',
          assigned: 'Logan R. Cohn',
          time: '3h 20min',
        },
        {
          name: 'Drinking bottle graphics',
          day: 27,
          status: 'Outdated',
          assigned: 'Jerry F. Powell',
          time: '12h 21min',
        },
        {
          name: 'App design and development',
          day: 7,
          status: 'Completed',
          assigned: 'Scot M. Smith',
          time: '78h 05min',
        },
        {
          name: 'Poster illustation design',
          day: 5,
          status: 'In-progress',
          assigned: 'John P. Ritter',
          time: '26h 58min',
        },
      ],
      fields: [
        { key: 'name', label: '' },
        { key: 'status', label: '' },
        { key: 'assigned', label: '' },
        { key: 'time', label: '' },
        { key: 'actions', label: '' },
      ],
    }
  },
}
</script>

<template>
  <b-card>
    <div class="d-flex justify-content-between mb-3">
      <h4 class="header-title">Tasks</h4>
      <b-dropdown toggle-class="card-drop p-0" variant="black" no-caret right>
        <template v-slot:button-content>
          <i class="ri-more-2-fill"></i>
        </template>
        <b-dropdown-item>Weekly Report</b-dropdown-item>
        <b-dropdown-item>Monthly Report</b-dropdown-item>
        <b-dropdown-item>Action</b-dropdown-item>
        <b-dropdown-item>Settings</b-dropdown-item>
      </b-dropdown>
    </div>
    <p class="text-center">
      <b>107</b>
      Tasks completed out of 195
    </p>

    <b-table responsive :items="tasksData" :fields="fields" class="products-table">
      <template v-slot:cell(name)="data">
        <h5 class="font-14 my-1">
          <a href="#" class="text-body">{{ data.item.name }}</a>
        </h5>
        <span class="text-muted font-13">Due in {{ data.item.day }} days</span>
      </template>
      <template v-slot:cell(status)="data">
        <p class="text-muted font-13 m-0">Status</p>
        <b-badge variant="success-lighten" v-if="data.item.status === 'Completed'">{{ data.item.status }}</b-badge>
        <b-badge variant="danger-lighten" v-if="data.item.status === 'Outdated'">{{ data.item.status }}</b-badge>
        <b-badge variant="warning-lighten" v-if="data.item.status === 'In-progress'">{{ data.item.status }}</b-badge>
      </template>
      <template v-slot:cell(assigned)="data">
        <span class="text-muted font-13">Assigned to</span>
        <h5 class="font-14 mt-1 font-weight-normal">{{ data.item.assigned }}</h5>
      </template>
      <template v-slot:cell(time)="data">
        <span class="text-muted font-13">Total time spend</span>
        <h5 class="font-14 mt-1 font-weight-normal">{{ data.item.time }}</h5>
      </template>
      <template v-slot:cell(actions)>
        <b-button variant="light" class="p-1">
          <i class="ri-pencil-fill"></i>
        </b-button>
        <b-button variant="light" class="p-1">
          <i class="ri-delete-bin-7-fill"></i>
        </b-button>
      </template>
    </b-table>
  </b-card>
</template>

<style lang="scss">
.products-table {
  td {
    border-top-color: #dee2e6;
  }
}
</style>
