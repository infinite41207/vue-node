<template>
  <div>
    <b-row>
      <b-col cols="12" sm="8" md="7" xl="8">
        <b-tabs>
          <b-tab title="Komentarze / Powiązane e-mail">
            <div v-for="(historyItem, historyItemIndex) of historyList" :key="historyItem.value.id" class="card">
              <div v-if="historyItem.type === 'event'" class="card-body pb-1">
                <b-media>
                  <template v-slot:aside>
                    <i class="ri-calendar-event-line ri-3x"></i>
                  </template>

                  <b-dropdown class="float-right text-muted" variant="black" right toggle-class="arrow-none card-drop p-0">
                    <template v-slot:button-content>
                      <i class="ri-more-line"></i>
                    </template>
                    <b-link href="javascript:void(0);" class="dropdown-item" @click="editComment(historyItem, historyItemIndex)"> {{ $t('commands.edit') }}</b-link>
                    <b-link href="javascript:void(0);" class="dropdown-item" @click="deleteComment(historyItem, historyItemIndex)"> {{ $t('commands.delete') }}</b-link>
                  </b-dropdown>
                  <h5 class="m-0">{{ historyItem.value.eventType ? historyItem.value.eventType.name : '' }}</h5>
                  <p class="text-muted">
                    <small>
                      {{ historyItem.value.name }}
                      <span class="mx-1">⚬</span>
                      <span>{{ historyItem.value.eventStatus ? historyItem.value.eventStatus.name : '' }}</span>
                    </small>
                  </p>
                  <p class="text-muted">
                    <small>
                      <span>{{ getCommentDate(historyItem.value.begin) }} - {{ getCommentDate(historyItem.value.endings) }}</span>
                    </small>
                  </p>
                </b-media>
              </div>
              <div v-if="historyItem.type === 'comment' || historyItem.type === 'email'" class="card-body pb-1">
                <b-media>
                  <template v-slot:aside>
                    <i v-if="historyItem.type === 'comment'" class="ri-message-2-line ri-3x"></i>
                    <i v-if="historyItem.type === 'email'" class="ri-mail-line ri-3x"></i>
                  </template>

                  <b-dropdown class="float-right text-muted" variant="black" right toggle-class="arrow-none card-drop p-0">
                    <template v-slot:button-content>
                      <i class="ri-more-line"></i>
                    </template>
                    <b-link href="javascript:void(0);" class="dropdown-item" @click="editComment(historyItem, historyItemIndex)"> {{ $t('commands.edit') }}</b-link>
                    <b-link href="javascript:void(0);" class="dropdown-item" @click="deleteComment(historyItem, historyItemIndex)"> {{ $t('commands.delete') }}</b-link>
                  </b-dropdown>
                  <h5 class="m-0">{{ historyItem.value.author ? historyItem.value.author.name : '' }}</h5>
                  <p class="text-muted">
                    <small>
                      {{ getCommentDate(historyItem.value.createdAt) }}
                    </small>
                  </p>
                </b-media>

                <hr class="m-0" />

                <div v-if="historyItem.value.byEmail" class="my-1">
                  <p>
                    {{ historyItem.value.emailType === 'INCOMING' ? 'Odebrany emailss :' : 'Wysłany email:' }}
                    <a
                      href="javascript:void(0);"
                      @click="openEmail(historyItem.value.emailAccountId, historyItem.value.emailUid, historyItem.value.emailType, historyItem.value.emailId)"
                      >{{ historyItem.value.emailTitle }}</a
                    >
                  </p>
                </div>

                <p class="my-1">
                  {{ historyItem.value.text }}
                </p>

                <hr class="m-0" />
                <div v-for="(file, index) in historyItem.value.files" :key="index" class="card mb-2 shadow-none border">
                  <div class="p-1">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <div class="avatar-sm">
                          <span class="avatar-title bg-primary-lighten text-primary rounded">.{{ getFileExtension(file.originalname) }}</span>
                        </div>
                      </div>
                      <div class="col pl-0">
                        <a href="javascript:void(0);" class="text-muted font-weight-bold" @click="downloadCommentFile(file, true)">{{ file.originalname }}</a>
                        <p class="mb-0">{{ getFileSizeDescription(file.size) }}</p>
                      </div>
                      <div class="col-auto">
                        <!-- Button -->
                        <a
                          v-b-tooltip.hover.bottom
                          href="javascript:void(0);"
                          :title="$t('commands.download')"
                          class="btn btn-link text-muted btn-lg p-0"
                          @click="downloadCommentFile(file, false)"
                        >
                          <i class="ri-download-cloud-2-line"></i>
                        </a>
                        <b-link
                          v-b-tooltip.hover.bottom
                          href="javascript:void(0);"
                          :title="$t('commands.delete')"
                          class="btn btn-link text-danger btn-lg p-0"
                          @click="deleteCommentFile(historyItem.value, file, index)"
                        >
                          <i class="ri-close-line"></i>
                        </b-link>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- end attachments -->
              </div>
            </div>
          </b-tab>
          <b-tab title="Zadania / Zamówienia">
            <div v-for="task in tasks" :key="task.id">
              <div class="card mb-2 shadow-none border">
                <div class="p-1">
                  <div class="row align-items-center">
                    <b-col cols="1">
                      <i v-if="task.executed" :id="`task-icon-${task.id}`" class="ri-checkbox-multiple-line text-success task-icon p-2"></i>
                      <i v-else class="ri-file-text-line task-icon p-2"></i>
                    </b-col>
                    <div class="col-11">
                      <strong>Zadanie:</strong>
                      <p class="mb-0">
                        <strong>Numer: </strong>
                        <a href="javascript:void(0);" @click="openTask(task.id)">{{ task.number }}</a>
                        <strong class="ml-3">Od: </strong>
                        {{ task.createdAt }}
                      </p>
                      <p class="mb-0">
                        <strong>Autor:</strong>
                        {{ task.authorName }}
                        <strong class="ml-3">Wykonawca:</strong>
                        {{ task.executor ? task.executor.name : '' }}
                      </p>

                      <p class="mb-0"><strong>Temat:</strong> {{ task.name }}</p>
                      <p class="mb-0"><strong>Opis:</strong> {{ task.description }}</p>
                      <p class="mb-0"><strong>Wynik:</strong> {{ task.executionResult }}</p>
                    </div>
                  </div>
                  <div v-for="orderRow in task.orders" :key="orderRow.id">
                    <div class="row align-items-center">
                      <b-col cols="1">
                        <i class="ri-arrow-right-line order-icon ml-2 p-2"></i>
                      </b-col>
                      <div class="col">
                        <div class="card mr-1 mb-1 mt-1 shadow-none border">
                          <div class="p-1">
                            <div class="row align-items-center">
                              <div class="col-auto">
                                <p class="mb-0"><strong>Zamówienie:</strong></p>
                                <a href="javascript:void(0);" @click="openOrder(orderRow.order.id)">{{ orderRow.order.numberStr }}</a>
                                <p class="mb-0">{{ orderRow.order.reference }}</p>
                              </div>
                            </div>
                            <div v-for="orderTask in orderRow.order.tasks" :key="orderTask.id">
                              <div class="row align-items-center">
                                <b-col cols="1">
                                  <i class="ri-arrow-right-line order-icon ml-2 p-2"></i>
                                </b-col>
                                <div class="col">
                                  <div class="card mr-1 mb-1 mt-1 shadow-none border">
                                    <div class="p-1">
                                      <div class="row align-items-center">
                                        <div class="col-auto">
                                          <a href="javascript:void(0);" @click="openTask(orderTask.id)">{{ orderTask.number }}</a>
                                          <p class="mb-0">{{ orderTask.name }}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-for="fileRow in task.files" :key="fileRow.id">
                    <div class="row align-items-center">
                      <b-col cols="1">
                        <i class="ri-attachment-2 order-icon ml-2 p-2"></i>
                      </b-col>
                      <div class="col">
                        <div class="card mr-1 mb-1 mt-1 shadow-none border">
                          <div class="p-1">
                            <div class="row align-items-center">
                              <div class="col-auto">
                                <a href="javascript:void(0);" @click="downloadTaskFile(fileRow, true)">{{ fileRow.originalname }}</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </b-tab>
        </b-tabs>
      </b-col>

      <b-col cols="12" sm="4" md="5" xl="4">
        <b-card>
          <b-row class="mt-0">
            <b-col>
              <span>
                <b>Załączniki interakcji:</b>
              </span>
            </b-col>
          </b-row>
          <div v-for="file in object.files" :key="file.id">
            <div class="card mb-2 shadow-none border">
              <div class="p-1">
                <div class="row align-items-center">
                  <div class="col-2 mr-2">
                    <div class="avatar-sm">
                      <span class="avatar-title bg-primary-lighten text-primary rounded">.{{ getFileExtension(file.originalname) }}</span>
                    </div>
                  </div>
                  <div class="col pl-2">
                    <a href="javascript:void(0);" class="text-muted font-weight-bold" @click="downloadFile(file, true)">{{ file.originalname }}</a>
                    <p class="mb-0">{{ getFileSizeDescription(file.size) }}</p>
                  </div>
                  <div class="col-2">
                    <!-- Button -->
                    <a v-b-tooltip.hover.bottom href="javascript:void(0);" title="Download" class="btn btn-link text-muted btn-lg p-0" @click="downloadFile(file, false)">
                      <i class="ri-download-cloud-2-line"></i>
                    </a>
                    <a v-b-tooltip.hover.bottom href="javascript:void(0);" title="Delete" class="btn btn-link text-danger btn-lg p-0" @click="deleteFile(file)">
                      <i class="ri-close-line"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <FabButton />
        </b-card>
      </b-col>
      <!-- end col -->
    </b-row>

    <Loading v-if="loading" />
    <Message :message="message" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import Loading from '@/components/common/loading'
import fileService from '@/utils/file-service'
import Message from '@/components/common/message'
import FabButton from './fab-button'

export default {
  name: 'InteractionMainInfo',

  components: {
    Loading,
    Message,
    FabButton,
  },

  mixins: [fileService],

  data() {
    return {
      loading: false,
      message: '',
      historyList: [],
      statusesList: [],
      tasks: [],
      viewId: this.$route.params.id,
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
  watch: {
    object: {
      deep: true,
      handler(val) {
        this.updateTasks()
        this.updateHistoryList()
      },
    },
  },
  mounted() {
    this.updateTasks()
    this.updateHistoryList()
  },

  methods: {
    sortEventsByDate() {
      this.historyList.sort((a, b) => {
        return new Date(b.value.createdAt) - new Date(a.value.createdAt)
      })
    },

    getCommentDate(createdAt) {
      if (createdAt) {
        return moment(createdAt).format('DD.MM.YYYY hh:mm:ss')
      }

      return ''
    },

    getFileExtension(filename) {
      const re = /(?:\.([^.]+))?$/
      const ext = re.exec(filename)[1]

      return ext === undefined ? '' : ext
    },

    async downloadCommentFile(fileData, open) {
      if (this.loading === true) {
        return
      }

      this.loading = true

      await this.$store.dispatch('interactions/openCommentFile', {
        viewId: this.viewId,
        id: fileData.id,
        type: fileData.type,
        name: fileData.originalname,
        open,
      })

      this.loading = false
    },

    async downloadFile(fileData, open) {
      if (this.loading === true) {
        return
      }

      this.loading = true

      await this.$store.dispatch('interactions/openFile', {
        viewId: this.viewId,
        id: fileData.id,
        type: fileData.type,
        name: fileData.originalname,
        open,
      })

      this.loading = false
    },

    async downloadTaskFile(fileData, open) {
      if (this.loading === true) {
        return
      }

      this.loading = true

      await this.$store.dispatch('tasks/openFile', {
        id: fileData.id,
        type: fileData.type,
        name: fileData.originalname,
        open,
      })

      this.loading = false
    },

    async editComment(comment, index) {
      // no actions
    },

    async updateTasks() {
      const response = await this.$store.dispatch('interactions/getTasks', {
        viewId: this.viewId,
        objectId: this.object.id,
      })

      if (response.status === 200) {
        this.tasks = response.data
      }
    },

    async updateHistoryList() {
      this.historyList = []
      if (this.object.comments.length > 0) {
        for (let i = 0; i < this.object.comments.length; i++) {
          if (this.object.comments[i].byEmail === true) {
            this.historyList.push({
              type: 'email',
              value: this.object.comments[i],
            })
          } else {
            this.historyList.push({
              type: 'comment',
              value: this.object.comments[i],
            })
          }
        }
      }

      if (this.object.events.length > 0) {
        for (let i = 0; i < this.object.events.length; i++) {
          this.historyList.push({
            type: 'event',
            value: this.object.events[i],
          })
        }
      }

      this.sortEventsByDate()
    },
    async openTask(taskId) {
      const dataObject = await this.$store.dispatch('tasks/findByPk', {
        params: {
          id: taskId,
        },
      })
      if (dataObject) {
        this.$router.push({ name: 'task-detail' })
      }
    },

    async openOrder(itemId) {
      const response = await this.$store.dispatch('orders/findByPk', {
        params: {
          id: itemId,
        },
      })
      if (response.status === 200) {
        this.$router.push({ name: 'sales-order-detail', params: { id: itemId } })
      }
    },

    async deleteComment(comment, index) {
      await this.$store.dispatch('interactions/deleteComment', {
        viewId: this.viewId,
        id: comment.id,
        index,
      })
    },

    async openEmail(emailAccountId, emailUid, emailType, emailId) {
      if (this.loading === true) {
        return
      }

      this.loading = true

      if (emailType === 'INCOMING') {
        let response
        if (emailId) {
          response = await this.$store.dispatch('mailbox/findByPk', {
            params: {
              id: emailId,
              emailAccountId: emailAccountId,
            },
          })
        } else {
          response = await this.$store.dispatch('mailbox/findByUid', {
            params: {
              uid: Number(emailUid),
              emailAccountId: emailAccountId,
            },
          })
        }

        if (response) {
          this.$router.push({ name: 'incoming-email-details' })
        }
      } else {
        const response = await this.$store.dispatch('outgoingEmails/findByPk', {
          params: {
            id: emailId,
          },
        })

        if (response.status === 200) {
          this.$router.push({ name: 'outgoing-email-details', params: { id: emailId } })
        }
      }

      this.loading = false
    },

    async deleteCommentFile(comment, file, index) {
      await this.$store.dispatch('interactions/deleteCommentFile', {
        viewId: this.viewId,
        id: file.id,
        commentId: comment.id,
        index,
      })
    },

    formatDate(date) {
      if (date) {
        return moment(date).format('DD.MM.YYYY HH:mm:ss')
      }

      return ''
    },

    async deleteFile(file) {
      const response = await this.$store.dispatch('interactions/deleteFile', {
        viewId: this.viewId,
        id: file.id,
      })

      if (response.status === 200) {
        await this.$store.dispatch('interactions/findByPk', {
          viewId: this.viewId,
          params: {
            id: this.object.id,
          },
        })
      }
    },
  },
}
</script>

<style>
.task-icon {
  font-size: 24px;
}

.order-icon {
  font-size: 20px;
}
</style>
