<template>
  <div>
    <b-row class="mb-2">
      <b-col>
        <div class="btn-group">
          <button type="button" class="btn btn-secondary">
            <i class="ri-archive-fill font-16"></i>
          </button>
          <button type="button" class="btn btn-secondary">
            <i class="ri-spam-2-fill font-16"></i>
          </button>
          <button type="button" class="btn btn-secondary">
            <i class="ri-delete-bin-line font-16"></i>
          </button>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'OutgoingEmailToolbar',
}
</script>
