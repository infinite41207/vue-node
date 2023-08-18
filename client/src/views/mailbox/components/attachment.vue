<script>
import vue2Dropzone from 'vue2-dropzone'

export default {
  name: 'MailboxAttachment',
  components: { vueDropzone: vue2Dropzone },
  data() {
    return {
      dropzoneOptions: {
        url: 'https://httpbin.org/post',
        previewTemplate: this.template(),
        previewsContainer: '.dropzone-previews',
      },
    }
  },
  methods: {
    template: function () {
      return `
      <div class="card mt-1 mb-0 shadow-none border">
          <div class="p-2">
              <div class="row align-items-center">
                  <div class="col-auto">
                      <img data-dz-thumbnail-bg src="#" class="avatar-sm rounded bg-light" alt="">
                  </div>
                  <div class="col pl-0">
                      <a href="javascript:void(0);" class="text-muted font-weight-bold" data-dz-name></a>
                      <p class="mb-0" data-dz-size></p>
                  </div>
                  <div class="col-auto">
                      <!-- Button -->
                      <a href="" class="btn btn-link btn-lg text-muted" data-dz-remove>
                          <i class="ri-close-line"></i>
                      </a>
                  </div>
              </div>
          </div>
      </div>
      `
    },
  },
}
</script>
<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title mb-3">Załączniki</h5>

      <vue-dropzone id="customdropzone" ref="myVueDropzone" class="dropzone" :use-custom-slot="true" :include-styling="false" :options="dropzoneOptions">
        <div class="dropzone-custom-content">
          <i class="h3 text-muted ri-upload-cloud-2-line"></i>
          <h4>Przeciągnij plik tutaj aby załączyć go ...</h4>
        </div>
      </vue-dropzone>
      <div id="file-previews" class="dropzone-previews mt-3"></div>
    </div>
  </div>
</template>