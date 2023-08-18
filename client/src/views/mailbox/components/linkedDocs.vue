<template>
  <b-modal id="linked-docs" size="xl" :title="$t('components.linkedDocs')" ok-only no-close-on-backdrop @ok="handleOk" @close="handelClose">
    <b-row>
      <b-col>
        <b-table
          ref="linkedDocsTable"
          no-border-collapse
          responsive="sm"
          selectable
          select-mode="single"
          sticky-header="400px"
          lazy
          :fields="fields"
          :items="items"
          :per-page="perPage"
          :current-page="currentPage"
          small
        >
          <template v-slot:cell(numberStr)="data">
            <a href="javascript:void(0);" @click="editDocument(data.item)"
              ><span :class="data.item.markedToDelete ? 'text-danger' : 'text-info'">{{ data.item.numberStr }}</span>
            </a>
          </template>
          <template v-slot:cell(delete)="data">
            <a href="javascript:void(0);" class="text-danger" @click="deleteRestoreItem(data.item)">
              <i class="ri-delete-bin-7-fill"></i>
            </a>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right" class="my-0"></b-pagination>
      </b-col>
    </b-row>
    <Question :question="questionMessage" @on-question-end="onQuestionEnd" />
    <Message :message="modalMessage" />
  </b-modal>
</template>

<script>
import { mapMutations } from 'vuex'
import Question from '@/components/common/question'

export default {
  name: 'MailboxLinkedDocs',

  components: {
    Question,
  },

  props: {
    email: {
      type: Object,
      required: true,
    },
    emailType: {
      type: String,
      required: true,
    },
    emailAccountId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      fields: [
        { key: 'numberStr', label: this.$t('table.numberStr') },
        {
          key: 'documentType',
          label: this.$t('table.documentType'),
          formatter: (value) => {
            return value === 'Reclamation' ? 'Reklamacja' : value === 'Interaction' ? 'Interakcja' : 'Zapytanie ofertowe'
          },
        },
        { key: 'createdAt', label: this.$t('table.createdAt') },
        { key: 'delete', label: '-' },
      ],
      items: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      questionAction: null,
      questionParams: null,
      questionMessage: '',
    }
  },

  async mounted() {
    this.$bvModal.show('linked-docs')

    await this.updateList()
  },

  methods: {
    ...mapMutations({
      setNewDocumentMode: 'reclamations/setNewDocumentMode',
      setPossitionsEditionMode: 'reclamations/setPossitionsEditionMode',
    }),

    async updateList() {
      let response
      this.items = []

      if (this.emailType === 'INCOMING') {
        response = await this.$store.dispatch('mailbox/getLinkedDocs', {
          params: {
            filter: {
              emailId: this.email.id,
              emailUid: this.email.uid,
              emailAccountId: this.emailAccountId,
            },
          },
        })
      } else {
        response = await this.$store.dispatch('outgoingEmails/getLinkedDocs', {
          params: {
            filter: {
              emailId: this.email.id,
            },
          },
        })
      }

      if (response && response.status === 200) {
        for (const documentRow of response.data) {
          this.items.push({
            id: documentRow.id,
            numberStr: documentRow.numberStr,
            documentType: documentRow.documentType,
            documentId: documentRow.documentId,
            createdAt: documentRow.createdAt,
            markedToDelete: documentRow.markedToDelete,
          })
        }
      }

      this.totalRows = this.items.length
    },

    handleOk() {
      this.$emit('linked-docs-closed')
    },

    handelClose() {
      this.$emit('linked-docs-closed')
    },

    async editDocument(item) {
      if (item.documentType === 'CustomerRequest') {
        const dataObject = await this.$store.dispatch('customerRequests/findByPk', {
          params: {
            id: item.documentId,
          },
        })
        if (dataObject) {
          this.$router.push({ name: 'customer-request-detail' })
        }
      } else if (item.documentType === 'Reclamation') {
        this.setNewDocumentMode(false)
        const dataObject = await this.$store.dispatch('reclamations/findByPk', {
          params: {
            id: item.documentId,
          },
        })
        if (dataObject) {
          this.setPossitionsEditionMode(true)
          this.$router.push({ name: 'reclamation-detail' })
        }
      } else if (item.documentType === 'Interaction') {
        const response = await this.$store.dispatch('interactions/findByPk', {
          params: {
            id: item.documentId,
          },
        })
        if (response.status === 200) {
          this.$router.push({ name: 'interaction-detail', params: { id: item.documentId } })
        }
      }
    },

    // async deleteLink(item) {
    //   let response

    //   if (this.emailType === 'INCOMING') {
    //     response = await this.$store.dispatch('mailbox/deleteLinkedDoc', {
    //       params: {
    //         id: item.id,
    //       },
    //     })
    //   } else {
    //     response = await this.$store.dispatch('outgoingEmails/deleteLinkedDoc', {
    //       params: {
    //         id: item.id,
    //       },
    //     })
    //   }

    //   if (response.status === 200) {
    //     this.updateList()
    //   }
    // },

    async deleteRestoreItem(itemData) {
      if (itemData.markedToDelete) {
        this.questionMessage = this.$t('interaction.msg.return')
      } else {
        this.questionMessage = this.$t('interaction.msg.delete')
      }

      this.questionAction = this.deleteRestoreItemEnd(itemData.id)
      this.questionParams = itemData.id

      this.$bvModal.show('modal-question')
    },

    async deleteRestoreItemEnd(itemId) {

      console.log('deleteItemEnd2' , itemId)

      await this.$store.dispatch('interactions/changeDeletionMark', {
        id: itemId,
      })
    },

    onQuestionEnd(result) {
      if (result === true) {
        if (this.questionAction) {
          if (this.questionParams) {
            this.questionAction(this.questionParams)
          } else {
            this.questionAction()
          }
        }
      }

      this.questionAction = null
      this.questionParams = null
      this.questionMessage = null
    },
  },
}
</script>

<style></style>
