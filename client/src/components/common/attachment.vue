<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <b-col
          ><h5 class="mb-2">{{ $t('email.attachments') }}</h5></b-col
        >
        <div class="col-auto">
          <input ref="selectedFiles" type="file" hidden :multiple="multiple" :accept="accept" @change="uploadFile" />
          <a v-b-tooltip.hover.bottom href="javascript:void(0);" :title="$t('commands.addFile')" class="btn btn-link" @click="addFile">
            <i class="ri-add-line"></i> {{ $t('commands.add') }}
          </a>
        </div>
      </div>
      <div class="row">
        <div v-for="(attachment, index) in value" :key="attachment.cid" class="col-12">
          <div class="card mb-1 shadow-none border">
            <div class="p-2">
              <div class="row align-items-center">
                <div class="col-auto">
                  <div class="avatar-sm">
                    <span class="avatar-title bg-primary-lighten text-primary rounded">.{{ getFileExtension(attachment.name) }}</span>
                  </div>
                </div>
                <div class="col pl-0">
                  <a href="javascript:void(0);" class="text-muted font-weight-bold" @click="downloadFile(attachment, true)">{{ attachment.name }}</a>
                  <p class="mb-0">{{ getFileSizeDescription(attachment.size) }}</p>
                </div>
                <div class="col-auto">
                  <!-- Button -->
                  <a href="javascript:void(0);" :title="$t('commands.download')" class="btn btn-link btn-lg text-muted">
                    <i class="ri-download-cloud-2-line" @click="downloadFile(attachment)"></i>
                  </a>
                  <a v-b-tooltip.hover.bottom href="javascript:void(0);" :title="$t('commands.delete')" class="btn btn-link text-danger btn-lg p-0" @click="deleteFile(index)">
                    <i class="ri-close-line"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fileService from '@/utils/file-service'

export default {
  name: 'FileAttachment',

  mixins: [fileService],

  props: {
    value: {
      type: Array,
      default: () => {
        return []
      },
    },
    accept: {
      type: String,
      default: '',
    },
    multiple: {
      type: Boolean,
      // eslint-disable-next-line
      default: true,
    },
  },

  methods: {
    addFile() {
      this.$refs.selectedFiles.click()
    },

    deleteFile(index) {
      this.value.splice(index, 1)
      this.$emit('update:value', this.value)
    },

    uploadFile(e) {
      for (const file of e.target.files) {
        this.value.push(file)
      }

      this.$emit('update:value', this.value)
    },

    downloadFile(fileData, open) {
      const blob = new Blob([fileData], { type: fileData.type })
      const fileLink = document.createElement('a')
      fileLink.href = window.URL.createObjectURL(blob)

      if (open === true && this.canOpenFileAtTab(fileData.type)) {
        fileLink.target = '_blank'
        fileLink.rel = 'noopener noreferrer'
      } else {
        fileLink.setAttribute('download', fileData.name)
      }
      document.body.appendChild(fileLink)
      fileLink.click()
    },
  },
}
</script>
