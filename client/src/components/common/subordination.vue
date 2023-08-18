<template>
  <b-modal id="modal-subordination" size="xl" :title="$t('components.subordination')" ok-only no-close-on-backdrop @ok="handleOk" @close="handelClose">
    <b-row>
      <b-col>
        <v-jstree :data="objectsTree" allow-batch whole-row @item-click="itemClick"></v-jstree>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import VJstree from 'vue-jstree'

export default {
  name: 'DocumentsSubordination',

  components: { VJstree },

  props: {
    objectId: {
      type: String,
      required: true,
    },
    objectType: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      objectsTree: [],
      loading: false,
    }
  },

  async mounted() {
    this.$bvModal.show('modal-subordination')

    this.fillObjectSubordination()
  },

  methods: {
    async fillObjectSubordination() {
      if (this.objectType && this.objectId) {
        this.loading = true
        await this.$store
          .dispatch(`${this.objectType}/getSubordination`, {
            objectId: this.objectId,
          })
          .then((response) => {
            if (response.status === 200) {
              this.objectsTree = response.data
            }
          })
          .catch((error) => {
            console.error(error)
          })

        this.loading = false
      }
    },

    async itemClick(node) {
      if (node.model) {
        if (node.model.objectType) {
          const response = await this.$store.dispatch(`${node.model.objectType}/findByPk`, {
            params: {
              id: node.model.objectId,
            },
          })

          const route = node.model.detailRoute

          if (response) {
            if (route.name && route.params) {
              this.$router.push({ name: route.name, params: route.params })
            } else if (route.name) {
              this.$router.push({ name: route.name })
            }

            this.$emit('subordination-closed')
          }
        }
      }
    },

    handleOk() {
      this.$emit('subordination-closed')
    },

    handelClose() {
      this.$emit('subordination-closed')
    },
  },
}
</script>

<style>
.tree-icon {
  font-size: 18px;
}
</style>
