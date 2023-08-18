<template>
  <b-modal
    id="cr-edit-result"
    size="xl"
    :title="`${$t('customerRequest.editResult')}`"
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
          <div>
            <Attachment v-model="object.files" :accept="typesFilter" :multiple="multipleSelection" />
          </div>
        </b-col>
      </b-row>
    </b-card>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import Attachment from '@/components/common/attachment'

export default {
  name: 'CRAddResultFiles',
  components: {
    Attachment,
  },

  props: {
    filesDestination: {
      type: String,
      default: 'OTHER',
    },
    typesFilter: {
      type: String,
      default: '',
    },
    multipleSelection: {
      type: Boolean,
      // eslint-disable-next-line
      default: true,
    },
  },

  data() {
    return {
      viewId: this.$route.params.id,
      object: {
        files: [],
      },
    }
  },

  async mounted() {
    this.$bvModal.show('cr-edit-result')
  },

  methods: {
    async handleOk() {
      const response = await this.$store.dispatch('customerRequests/addFiles', {
        id: this.viewId,
        files: this.object.files,
        fileDestination: this.filesDestination,
      })

      if (response.status === 200) {
        await this.$store.dispatch('customerRequests/findByPk', {
          viewId: this.viewId,
          params: {
            id: this.viewId,
          },
        })

        this.$emit('add-files-end', undefined)
      }
    },

    handleCancel() {
      this.$emit('add-files-end', undefined)
    },

    handelClose() {
      this.$emit('add-files-end', undefined)
    },
  },
}
</script>

<style></style>
