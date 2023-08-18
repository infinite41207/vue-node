<template>
  <b-modal
    id="interaction-add-files"
    size="xl"
    :title="`${$t('interaction.addFiles')}`"
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
            <Attachment v-model="newObject.files" :multiple="multipleSelection" />
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
  name: 'InteractionAddFiles',

  components: {
    Attachment,
  },

  props: {
    viewId: {
      type: String,
      require: true,
      default: null,
    },
    multipleSelection: {
      type: Boolean,
      // eslint-disable-next-line
      default: true,
    },
  },

  data() {
    return {
      newObject: {
        files: [],
      },
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
    this.$bvModal.show('interaction-add-files')
  },

  methods: {
    async handleOk() {
      const response = await this.$store.dispatch('interactions/addFiles', {
        viewId: this.viewId,
        id: this.object.id,
        files: this.newObject.files,
      })

      if (response.status === 200) {
        await this.$store.dispatch('interactions/findByPk', {
          viewId: this.viewId,
          params: {
            id: this.object.id,
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
