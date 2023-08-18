<template>
  <div class="mb-3">
    <b-row class="padding-default">
      <b-col>
        <b-row>
          <b-col class="d-print-none">
            <div class="text-right">
              <a href="javascript:window.print()" class="btn btn-primary">
                <i class="ri-printer-fill"></i>
                Drukuj
              </a>
            </div>
          </b-col>
          <b-col class="d-print-none">
            <b-button variant="outline-secondary">Importuj do programu exel</b-button>
          </b-col>
          <b-col class="d-print-none">
            <b-button variant="outline-secondary">Wyślij</b-button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'PrintFormToolbar',

  page: {
    title: 'Toolbar',
  },
}
</script>
<style>
</style>