<template>
  <b-modal
    id="select-task-files"
    size="lg"
    :title="`${$t('interaction.selectFiles')}`"
    :cancel-title="$t('commands.cancel')"
    no-close-on-backdrop
    :ok-title="`${$t('commands.write')}`"
    @ok="handleOk"
    @cancel="handleCancel"
    @close="handelClose"
  >
    <b-card>
      <b-row>
        <b-col>
          <b-button-group class="mb-2">
            <b-button variant="outline-secondary" size="sm" @click="checkAll">
              <i class="ri-check-linebox-multiple-marked-outline"></i>
              Oznacz wszystkie
            </b-button>
            <b-button variant="outline-secondary" class="ml-2" size="sm" @click="uncheckAll">
              <i class="ri-check-linebox-multiple-blank-outline"></i>
              Odznacz wszystkie
            </b-button>
          </b-button-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-row v-for="(file, index) in selectedFiles" :key="index">
            <b-col cols="1" class="p-2">
              <b-form-checkbox :id="`check-file${index}`" v-model="file.check" size="lg" name="check-file" />
            </b-col>
            <b-col>
              <div class="card mb-2 shadow-none border" :class="{ 'border-success': file.processed }">
                <div class="p-1">
                  <div class="row align-items-center">
                    <div class="col-auto">
                      <div class="avatar-sm">
                        <span class="avatar-title bg-primary-lighten text-primary rounded">.{{ getFileExtension(file.originalname) }}</span>
                      </div>
                    </div>
                    <div class="col pl-0">
                      <a href="javascript:void(0);" class="text-muted font-weight-bold">{{ file.originalname }}</a>
                      <p class="mb-0">{{ getFileSizeDescription(file.size) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import fileService from '@/utils/file-service'

export default {
  name: 'InteractionSelectTaskFiles',

  mixins: [fileService],

  props: {
    files: {
      type: Array,
      default() {
        return []
      },
    },
  },

  data() {
    return {
      selectedFiles: [],
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'interactions/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },
  },

  async mounted() {
    for (const file of this.files) {
      const check = file.processed !== true

      this.selectedFiles.push({ ...file, check })
    }

    this.$bvModal.show('select-task-files')
  },

  methods: {
    async handleOk() {
      this.$emit('select-files-end', this.selectedFiles)
    },

    checkAll() {
      for (const file of this.selectedFiles) {
        file.check = true
      }
    },

    uncheckAll() {
      for (const file of this.selectedFiles) {
        file.check = false
      }
    },

    handleCancel() {
      this.$emit('select-files-end', undefined)
    },

    handelClose() {
      this.$emit('select-files-end', undefined)
    },
  },
}
</script>

<style></style>
