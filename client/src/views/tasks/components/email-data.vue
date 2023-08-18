<template>
  <Layout>
    <PageHeader :title="title" />
    <b-card>
      <template v-slot:header>
        <div class="w-100">
          <b-button-toolbar class="float-right">
            <a v-if="!task.executed && task.id" href="javascript:void(0);" class="btn btn-success ml-2" @click="executeTask">
              <i class="ri-check-line"></i>
              {{ $t('commands.execute') }}
            </a>
            <a v-if="!task.executed && task.id" href="javascript:void(0);" class="btn btn-success ml-2" @click="redirectTaskExecution">
              <i class="ri-check-line"></i>
              {{ $t('commands.redirectTaskExecution') }}
            </a>

            <a v-if="task.ownerType === 'reclamation'" href="javascript:void(0);" class="btn btn-info ml-2" @click="openModalReclamationForm">
              <i class="ri-close-line"></i>
              Pokaż szczegóły zadania
            </a>
          </b-button-toolbar>

          <b-button-toolbar class="float-left">
            <a href="javascript:void(0);" class="btn btn-success" @click="writeAndCloseTask">
              <i class="ri-save-2-fill-move"></i>
              {{ btnWriteCloseText }}
            </a>
            <a href="javascript:void(0);" class="btn btn-light ml-2" @click="writeTask(false)">
              <i class="ri-save-2-fill"></i>
              {{ $t('commands.write') }}
            </a>
            <a href="javascript:void(0);" class="btn btn-info ml-2" @click="closeTask">
              <i class="ri-close-line"></i>
              {{ $t('commands.close') }}
            </a>
            <a v-if="fromErp || task.ownerType === 'Interaction'" href="javascript:void(0);" class="btn btn-primary ml-2" @click="createOrder">
              <i class="ri-add-line"></i>
              {{ $t('commands.createOrder') }}
            </a>
          </b-button-toolbar>
        </div>
      </template>

      <b-tabs v-model="tabIndex" content-class="mt-2">
        <b-tab :title="$t('common.mainData')" active @click="updateTabIndex(0)">
          <b-row>
            <b-col md="8">
              <b-card>
                <b-row v-if="!fromErp">
                  <b-col md="6">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.template')" label-for="task-template">
                      <b-form-select
                        id="task-template"
                        v-model="taskTemplate"
                        :options="taskTemplates"
                        text-field="name"
                        value-field="id"
                        name="task-template"
                        :placeholder="$t('common.fillByTemplate')"
                        size="sm"
                      >
                        <template v-slot:first>
                          <b-form-select-option :value="undefined" disabled>{{ $t('common.fillByTemplate') }}</b-form-select-option>
                        </template>
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="6">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.name')" label-for="task-name">
                      <b-form-input
                        id="task-name"
                        v-model="name"
                        type="text"
                        name="task-name"
                        :state="nameState"
                        :placeholder="$t('common.enterName')"
                        aria-describedby="nameFeedback"
                        size="sm"
                      ></b-form-input>

                      <b-form-invalid-feedback id="nameFeedback">
                        <!-- This will only be shown if the preceeding input has an invalid state -->
                        {{ $t('common.notEmptyField') }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.importance')" label-for="task-importance">
                      <b-form-select
                        id="task-importance"
                        v-model="importance"
                        :options="importanceList"
                        name="task-importance"
                        :state="importanceState"
                        :placeholder="$t('common.selectImportance')"
                        aria-describedby="importanceFeedback"
                        size="sm"
                      ></b-form-select>

                      <b-form-invalid-feedback id="importanceFeedback">
                        <!-- This will only be shown if the preceeding input has an invalid state -->
                        {{ $t('common.notEmptyField') }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="6">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.executorRole')" label-for="task-executor-role">
                      <b-form-select
                        id="task-executor-role"
                        v-model="executorRole"
                        :options="executorRoles"
                        text-field="name"
                        value-field="id"
                        name="task-executor-role"
                        :placeholder="$t('common.selectExecutorRole')"
                        :state="executorRoleState"
                        aria-describedby="task-executor-role-feedback"
                        size="sm"
                      ></b-form-select>
                      <b-form-invalid-feedback id="task-executor-role-feedback">
                        <!-- This will only be shown if the preceeding input has an invalid state -->
                        {{ $t('common.notEmptyField') }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.customer')" label-for="task-customer">
                      <b-form-select id="task-customer" :value="customer" :options="customers" name="task-customer" text-field="name" value-field="id" size="sm" />
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="6">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.executor')" label-for="task-executor">
                      <b-form-select
                        id="task-executor"
                        v-model="executor"
                        :options="executors"
                        text-field="name"
                        value-field="id"
                        name="task-executor"
                        :placeholder="$t('common.selectExecutor')"
                        size="sm"
                      ></b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group :label="$t('table.executionPeriod')" :label-cols="3" label-for="task-exec-period">
                      <b-form-input id="task-exec-period" v-model="executionPeriod" :disabled="fromErp" type="datetime-local" name="task-exec-period" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group :label="$t('task.description')" label-for="task-description">
                      <b-form-textarea id="task-description" v-model="description" rows="10" max-rows="30" :disabled="fromErp"> </b-form-textarea>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row v-if="fromErp">
                  <b-col>
                    <b-form-group :label="$t('task.executionResult')" label-for="task-result">
                      <b-form-textarea id="task-result" v-model="executionResult" rows="10" max-rows="30"> </b-form-textarea>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="4">
                    <b-form-group :label="$t('table.author')" :label-cols="3" label-for="task-author">
                      <b-form-input id="task-author" :value="task.authorName" disabled type="text" name="task-author" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col v-if="!fromErp" md="8">
                    <b-form-group horizontal :label-cols="3" :label="$t('table.base')" label-for="base-name">
                      <b-input-group>
                        <b-form-input id="base-name" :value="task.subjectString" type="text" name="base-name" disabled aria-describedby="baseNameFeedback" size="sm"></b-form-input>
                        <template v-slot:append>
                          <b-button id="customer-search" class="customer-search" size="sm" :disabled="!task.subjectString" @click="openSubject">
                            <i class="ri-search-line"></i>
                          </b-button>
                        </template>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
            <b-col md="4">
              <b-card>
                <b-row
                  ><b-col>
                    <b-form-group :label="$t('common.history')" label-for="task-history">
                      <b-form-textarea id="task-history" v-model="task.executionHistory" disabled rows="30" max-rows="30"> </b-form-textarea>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab :title="$t('table.email')" :title-item-class="!task.emailTitle ? 'd-none' : ''" @click="updateTabIndex(1)">
          <b-row>
            <b-col md="8">
              <b-card>
                <b-row>
                  <b-col>
                    <b-form-group :label="$t('table.topic')" label-for="task-email-title">
                      <b-form-input id="task-email-title" :value="task.emailTitle" type="text" disabled name="task-email-title" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group :label="$t('table.contents')" label-for="task-email-body">
                      <b-card>
                        <iframe ref="htmlBody" width="100%" height="500px" frameborder="0"> </iframe>
                        <!-- eslint-disable-next-line -->
                      </b-card>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
            <b-col md="4"
              ><b-card>
                <b-row>
                  <b-col>
                    <b-form-group :label="$t('common.from')" label-for="task-email-from">
                      <b-form-input id="task-email-from" :value="emailFrom" type="text" disabled name="task-email-from" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row v-if="fromErp">
                  <b-col>
                    <b-form-group :label="$t('table.priority')" label-for="task-email-priority">
                      <b-form-input id="task-email-priority" :value="task.emailPriority" type="text" disabled name="task-email-priority" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row v-if="fromErp">
                  <b-col>
                    <b-form-group :label="$t('table.category')" label-for="task-email-category">
                      <b-form-input id="task-email-category" :value="task.emailCategory" type="text" disabled name="task-email-category" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group :label="$t('table.postDate')" label-for="task-email-date">
                      <b-form-input id="task-email-date" :value="emailDate" type="text" disabled name="task-email-date" size="sm"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab :title="$t('common.files')" @click="updateTabIndex(2)">
          <b-button-toolbar>
            <b-btn-group>
              <a href="javascript:void(0);" class="btn btn-light" @click="addFile">
                <i class="ri-add-line"></i>
                {{ $t('commands.addFile') }}
              </a>
            </b-btn-group>
          </b-button-toolbar>

          <b-modal id="modal-select-file" ok-only :title="$t('common.selectFileTitle')" @ok="handleOkFile">
            <b-form-file v-model="selectedFiles" class="mt-2" :browse-text="$t('commands.select')" :placeholder="$t('common.noSelectedFiles')" multiple></b-form-file>
          </b-modal>

          <b-row class="mt-2">
            <b-table striped hover :items="task.files" :fields="filesFields">
              <template v-slot:cell(index)="{ index }">
                <p>{{ ++index }}</p>
              </template>
              <template v-slot:cell(originalname)="{ item }">
                <b-link href="javascript:void(0);" @click="openFile(item)">{{ item.originalname }} </b-link>
              </template>
              <template v-slot:cell(actions)="{ index, item }">
                <div class="table-button-container">
                  <b-row inline>
                    <a href="javascript:void(0);" class="action-icon" @click="deleteFileRow(index, item)">
                      <i class="ri-delete-bin-7-fill" color="red"></i>
                    </a>
                  </b-row>
                </div> </template
            ></b-table>
          </b-row>
        </b-tab>
        <b-tab title="Zamówienia" :title-item-class="!fromErp ? 'd-none' : ''" @click="updateTabIndex(3)">
          <b-row class="mt-2">
            <b-table striped hover :items="task.orders" :fields="orderFields" small> </b-table>
          </b-row>
        </b-tab>
      </b-tabs>
    </b-card>

    <!-- modal message -->
    <b-modal id="modal-message" hide-footer title="Uwaga!">
      <p class="my-4">{{ modalMessage }}</p>
    </b-modal>

    <b-modal v-model="showTaskRedirectionForm" title="Przekierowanie zadania na inny etap" title-class="font-18" ok-only @ok="executeTaskRedirection">
      <b-form-group label="Wybierz etap" label-for="stage_select">
        <b-form-select id="stage_select" v-model="nextStageId" text-field="text" value-field="id" :options="bpDefinitionStages"></b-form-select>
      </b-form-group>

      <b-form-group label="Następny wykonawca" label-for="executor_select">
        <b-form-select
          id="executor_select"
          v-model="nextExecutorId"
          :options="executors"
          text-field="name"
          value-field="id"
          name="task-executor"
          :placeholder="$t('common.selectExecutor')"
          size="sm"
        ></b-form-select>
      </b-form-group>
    </b-modal>

    <b-modal id="reclamation-dlg" v-model="showModalReclamationForm" title="Reklamacja" title-tag="h4" size="xl" header-class="modal-colored-header bg-primary" hide-footer>
      <form class="p-1">
        <reclamationForm :stage-id="task.stage"></reclamationForm>
      </form>
    </b-modal>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'
import taskImportance from '@/constants/taskImportance'
import reclamationForm from './reclamation/reclamation-form.vue'
import SalesOrder from '@/dto/SalesOrder.json'
import CustomerData from '@/dto/Customer.json'
import _ from 'lodash'
import { uuid } from 'vue-uuid'

/**
 * Task Details component
 */
export default {
  page() {
    return { title: this.$t('task.newTask'), meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: { Layout, PageHeader, reclamationForm },
  data() {
    return {
      showModalReclamationForm: false,
      title: this.$t('task.newTask'),
      bpDefinition: '',
      importanceList: Object.keys(taskImportance).map((key) => {
        return { value: key, text: taskImportance[key] }
      }),
      tabIndex: 0,
      storeTabIndex: 0,
      selectedFiles: null,
      filesFields: [
        { key: 'index', label: 'Lp' },
        { key: 'originalname', label: 'Nazwa' },
        { key: 'type', label: 'Typ' },
        { key: 'size', label: 'Rozmiar, kB' },
        { key: 'actions', label: 'Akcje' },
      ],
      orderFields: [
        { key: 'order.numberStr', label: 'Numer' },
        { key: 'order.createdAt', label: 'Data' },
        { key: 'order.reference', label: 'Referencja' },
      ],
      modalMessage: '',
      btnWriteCloseText: this.$t('commands.writeAndClose'),
      fromErp: false,
      showTaskRedirectionForm: false,
      bpDefinitionStages: [],
      nextStageId: 0,
      nextExecutorId: 0,
      emailBody: '',
      emailDate: null,
      emailFrom: '',
    }
  },

  computed: {
    ...mapGetters({
      task: 'tasks/openTask',
      parentView: 'tasks/parentView',
      taskTemplates: 'taskTemplates/taskTemplatesList',
      counterparties: 'counterparties/customerList',
      executorRoles: 'executorRoles/executorRolesList',
      executors: 'executors/executorList',
    }),

    name: {
      get() {
        return this.task.name
      },
      set(value) {
        this.setTaskProperty({
          property: 'name',
          value: value,
        })
      },
    },

    stage: {
      get() {
        return this.task.stage
      },
      set(value) {
        this.setTaskProperty({
          property: 'stage',
          value: value,
        })
      },
    },

    importance: {
      get() {
        return this.task.importance
      },
      set(value) {
        this.setTaskProperty({
          property: 'importance',
          value: value,
        })
      },
    },

    description: {
      get() {
        return this.task.description
      },
      set(value) {
        this.setTaskProperty({
          property: 'description',
          value: value,
        })
      },
    },

    executionResult: {
      get() {
        return this.task.executionResult
      },
      set(value) {
        this.setTaskProperty({
          property: 'executionResult',
          value: value,
        })
      },
    },

    executorRole: {
      get() {
        return this.task.executorRoleId
      },
      set(value) {
        this.setTaskProperty({
          property: 'executorRoleId',
          value: value,
        })
      },
    },

    taskTemplate: {
      get() {
        return this.task.templateId
      },
      set(value) {
        this.setTaskProperty({
          property: 'templateId',
          value: value,
        })

        if (value > 0) {
          this.fillTaskByTemplate(value)
        }
      },
    },

    executor: {
      get() {
        return this.task.executorId
      },
      set(value) {
        this.setTaskProperty({
          property: 'executorId',
          value: value,
        })
      },
    },

    executionPeriod: {
      get() {
        return this.task.executionPeriod
      },
      set(value) {
        this.setTaskProperty({
          property: 'executionPeriod',
          value: value,
        })
      },
    },

    customer: {
      get() {
        return this.task.customerId
      },
      set(value) {
        this.setTaskProperty({
          property: 'customerId',
          value: value,
        })
      },
    },

    nameState() {
      return this.task.name.length > 0
    },

    importanceState() {
      return this.task.importance.length > 0
    },

    executorRoleState() {
      return this.executorRole > 0 || this.executor > 0
    },
  },

  updated() {
    if (this.storeTabIndex !== this.tabIndex) {
      this.tabIndex = this.storeTabIndex
    }
  },

  created() {
    this.initEmailData()
  },

  async mounted() {
    if (this.task.id) {
      this.setTaskTitle()
    } else {
      this.btnWriteCloseText = this.$t('commands.runAndClose')
      this.setTaskProperty({ property: 'authorName', value: this.$attrs.user.name })
    }

    await this.initialize()
  },

  methods: {
    ...mapMutations({
      setTaskProperty: 'tasks/setTaskProperty',
      setTaskProperties: 'tasks/setTaskProperties',
      addObjectView: 'orders/addObjectView',
      setOpenTask: 'tasks/setOpenTask',
      addFiles: 'tasks/addFiles',
      setTaskParentView: 'tasks/setParentView',
    }),

    ...mapActions({
      delView: 'tagsViews/delView',
    }),

    async initialize() {
      await this.getCustomers()
      await this.getExecutorRoles()

      if (this.task) {
        this.fromErp = this.task.fromErp

        if (!this.fromErp) {
          await this.$store.dispatch('taskTemplates/findAll', {})
          await this.$store.dispatch('executors/findAll', {})
        }

        if (this.task.bpDefinition) {
          const bpDefinition = await this.$store.dispatch('bpDefinitions/findByPk', {
            params: {
              id: this.task.bpDefinition,
            },
          })
          if (bpDefinition) {
            this.bpDefinitionStages = _.cloneDeep(bpDefinition.stages)
            for (var i = 0; i < this.bpDefinitionStages.length; i++) {
              if (this.bpDefinitionStages[i].isCondition === true) {
                this.bpDefinitionStages.splice(i, 1)
              }
            }
          }
        }
      }
    },

    async initEmailData() {
      if (this.task.emailId !== null) {
        const response = await this.$store.dispatch('mailbox/findByPk', {
          noCommit: true,
          params: {
            id: this.task.emailId,
          },
        })

        if (response.status === 200) {
          this.emailDate = moment(response.data.date).format('DD.MM.YYYY HH:mm:ss')
          this.emailFrom = response.data.from.text

          this.emailBody = response.data.html
        }
      } else {
        this.emailBody = this.task.emailBody
        this.emailDate = this.task.emailDate
        this.emailFrom = this.task.emailFrom
      }

      const iFrameEl = this.$refs.htmlBody
      const elDocument = iFrameEl.contentWindow.document
      elDocument.open()
      elDocument.write(this.emailBody)
      elDocument.close()
    },

    async writeAndCloseTask() {
      if (!this.task.id) {
        this.setTaskProperty({ property: 'started', value: true })
      }

      const result = this.writeTask(true)

      if (result) {
        if (this.parentView !== '') {
          this.$router.push({ name: this.parentView })
          this.setTaskParentView('')
        } else {
          this.$router.push({ name: 'main' })
          this.delView({ name: this.$route.name, path: this.$route.path })
        }
        this.setOpenTask(null)
      }
    },

    async writeTask(closeOnWrite) {
      let response

      if (!this.task.id) {
        response = await this.$store.dispatch('tasks/createTask')
      } else {
        response = await this.$store.dispatch('tasks/updateTask')
      }

      if (response.status === 200) {
        if (!closeOnWrite) {
          await this.$store.dispatch('tasks/findByPk', { params: { id: response.data.id } })

          this.setTaskTitle()
        }
      }
    },

    setTaskTitle() {
      this.title = `Zadanie nr ${this.task.number} od ${moment(this.task.date).format('YYYY-MM-DD HH:mm:ss')}`
    },

    async openModalReclamationForm() {
      await this.$store.dispatch('reclamations/findByPk', {
        params: {
          id: this.task.ownerId,
        },
      })

      this.showModalReclamationForm = true
    },

    async getCustomers() {
      await this.$store.dispatch('counterparties/findAll', {})
    },

    async getExecutorRoles() {
      await this.$store.dispatch('executorRoles/findAll', {})
    },

    updateTabIndex(index) {
      this.storeTabIndex = index
    },

    async fillTaskByTemplate(value) {
      const response = await this.$store.dispatch('taskTemplates/getTemplateData', { id: value })

      if (response.status === 200) {
        const templateData = { ...response.data }

        this.setTaskProperties({
          name: templateData.name,
          importance: templateData.importance,
          description: templateData.description,
          executorRoleId: templateData.executorRoleId,
          executorId: templateData.executorId,
        })

        if (templateData.executionDays || templateData.executionHours || templateData.executionMinutes) {
          let execDate = new Date()

          if (templateData.executionDays && templateData.executionDays > 0) {
            execDate.setDate(execDate.getDate() + templateData.executionDays)
          }

          if (templateData.executionHours && templateData.executionHours > 0) {
            execDate.setTime(execDate.getTime() + templateData.executionHours * 60 * 60 * 1000)
          }

          if (templateData.executionMinutes && templateData.executionMinutes > 0) {
            execDate.setTime(execDate.getTime() + templateData.executionMinutes * 60 * 1000)
          }

          execDate = moment(execDate).format('YYYY-MM-DDThh:mm')
          this.setTaskProperty({ property: 'executionPeriod', value: execDate })
        }
      }
    },

    async executeTask() {
      const beforeExecutionCheck = await this.$store.dispatch('tasks/checkBeforeExecutionTaskCondition', {})
      if (beforeExecutionCheck === true) {
        await this.$store.dispatch('tasks/executeTask', {
          id: this.task.id,
          executionResult: this.task.executionResult,
        })
        this.$router.push({ name: 'main' })
      }
    },

    async executeTaskRedirection() {
      if (this.bpDefinitionStages) {
        const foundStage = this.bpDefinitionStages.find((stage) => stage.id === this.nextStageId)

        if (foundStage && this.nextExecutorId > 0) {
          await this.$store.dispatch('tasks/executeTask', {
            id: this.task.id,
            nextStageId: foundStage.id,
            nextStage: foundStage.text,
            nextExecutorId: this.nextExecutorId,
            executionResult: this.task.executionResult,
            manualRedirection: true,
          })

          this.$router.push({ name: 'main' })
          this.$destroy()
          this.delView({ name: this.$route.name, path: this.$route.path })
        } else {
          alert('Wybierz następny etap oraz wykonawcę!!!')
        }
      }
    },

    async cancelTaskExecution() {
      await this.$store.dispatch('tasks/cancelTaskExecution', {
        id: this.task.id,
        executionResult: this.task.executionResult,
      })
      this.$router.push({ name: 'main' })
    },

    async redirectTaskExecution() {
      this.showTaskRedirectionForm = true
    },

    async openFile(item) {
      await this.$store.dispatch('tasks/openFile', {
        id: item.id,
        type: item.type,
        name: item.originalname,
      })
    },

    async openSubject() {
      if (this.task.ownerType === 'Interaction' && this.task.ownerId !== null) {
        const response = await this.$store.dispatch('interactions/findByPk', {
          params: {
            id: this.task.ownerId,
          },
        })
        if (response.status === 200) {
          this.$router.push({ name: 'interaction-detail', params: { id: this.task.ownerId } })
        }
      }
    },

    async deleteFileRow(index, item) {
      await this.$store.dispatch('tasks/deleteFile', {
        index: index,
        id: item.id,
      })
    },

    async createOrder() {
      if (!this.task.id) {
        this.modalMessage = 'Zamówienie musi być zapisane!'
        this.$bvModal.show('modal-message')
        return
      }

      if (this.task.customerId) {
        await this.$store.dispatch('orders/getCustomerData', {
          params: {
            viewId: 0,
            id: this.task.customerId,
          },
        })
      }

      const newOrderObject = _.cloneDeep(SalesOrder)
      newOrderObject.customerId = this.customer

      const existCustomer = this.customers.find((el) => el.id === this.customer)

      if (existCustomer) {
        newOrderObject.customer = { id: existCustomer.id, name: existCustomer.name }
        newOrderObject.currencyId = existCustomer.currency.id
        newOrderObject.currency = { id: existCustomer.currency.id, name: existCustomer.currency.name }
        newOrderObject.termOfPaymentId = existCustomer.termOfPaymentId
        newOrderObject.packageMaterial = existCustomer.packageMaterial
      }

      const viewId = uuid.v4()

      this.addObjectView({
        viewId,
        object: newOrderObject,
        customerData: _.cloneDeep(CustomerData),
        currentProduct: null,
        viewMode: 'order_modification',
        initCalcPrices: false,
        tabIndex: 0,
      })

      this.$router.push({ name: 'sales-order-detail/0' })

      this.addObjectView({ order: null, base: this.task })
      this.$router.push({ name: 'sales-order-detail', params: { id: viewId } })
    },

    async closeTask() {
      if (this.parentView !== '') {
        this.$router.push({ name: this.parentView })
        this.setTaskParentView('')
      } else {
        this.$router.push({ name: 'main' })
      }

      this.delView({ name: this.$route.name, path: this.$route.path })
      this.setOpenTask(null)
    },

    addFile() {
      if (!this.task.id) {
        this.modalMessage = 'Zadanie musi być zapisane!'
        this.$bvModal.show('modal-message')
        return
      }

      this.$bvModal.show('modal-select-file')
    },

    async handleOkFile(bvModalEvt) {
      bvModalEvt.preventDefault()
      await this.handleSubmitFile()

      this.$nextTick(() => {
        this.$bvModal.hide('modal-select-file')
      })
    },

    async handleSubmitFile() {
      await this.$store.dispatch('tasks/uploadFiles', { files: this.selectedFiles }).then(async (response) => {
        await this.$store.dispatch('tasks/getFiles', {
          taskId: this.task.id,
        })
      })
    },
  },
}
</script>

<style scoped></style>
