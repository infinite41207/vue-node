import axios from 'axios'
import newTask from '../../dto/NewTask.json'
import _ from 'lodash'
import moment from 'moment'
import taskActions from '@/utils/task-actions'

const initState = {
  listView: {
    list: [],
    total: 0,
    page: 1,
    limit: 30,
    filters: {
      searchStr: '',
      executed: false,
      myTasks: false,
      tasksByExecutorRole: false,
      executor: null,
      period: [null, null],
      customer: null,
    },
    sort: { sortBy: 'date', sortDesc: false },
  },
  openTask: _.cloneDeep(newTask),
  parentView: '',
}

export const state = Object.assign({}, _.cloneDeep(initState))

export const mutations = {
  setListViewProperty(state, payload) {
    Object.keys(payload).forEach((key) => {
      state.listView[key] = payload[key]
    })
  },

  setFilters(state, filter) {
    Object.keys(filter).forEach((key) => {
      state.listView.filters[key] = filter[key]
    })
  },

  setSort(state, sort) {
    Object.keys(sort).forEach((key) => {
      state.listView.sort[key] = sort[key]
    })
  },
  setOpenTask(state, task) {
    if (!task) {
      state.openTask = _.cloneDeep(newTask)
    } else {
      state.openTask = task
    }
  },
  setTaskProperty(state, { property, value }) {
    state.openTask[property] = value
  },
  setTaskProperties(state, properties) {
    for (const property of Object.keys(properties)) {
      state.openTask[property] = properties[property]
    }
  },
  setTaskFiles(state, files) {
    state.openTask.files = files
  },
  deleteTaskFile(state, index) {
    state.openTask.files.splice(index, 1)
  },
  setParentView(state, view) {
    state.parentView = view
  },
  resetState(state) {
    Object.assign(state, _.cloneDeep(initState))
  },
}

export const actions = {
  async findAll({ commit }, payload) {
    let list = []
    let page = 1
    let total = 0

    return axios
      .get(`/task`, payload)
      .then(async (response) => {
        if (response.status === 200) {
          const result = response.data

          if (result.rows) {
            list = result.rows
          } else {
            list = result
          }

          list.forEach(async (el) => {
            el.createdAt = moment(el.createdAt).format('DD.MM.YYYY HH:mm:ss')
            el.date = moment(el.date).format('DD.MM.YYYY HH:mm:ss')

            if (el.executionPeriod) {
              el.executionPeriod = moment(el.executionPeriod).format('DD.MM.YYYY HH:mm')
            }

            el.ownerData = ''

            if (el.ownerType && el.ownerId) {
              if (el.ownerType === 'reclamation') {
                const response = await axios.get(`/getreclamation/${el.ownerId}`, {})
                if (response) {
                  const reclamationeData = response.data.responseData
                  el.baseDocument = 'Recl. nr ' + reclamationeData.number + ' ref: ' + reclamationeData.salesReference
                }
              }
            }
          })

          if (result.count) {
            total = result.count
          } else {
            total = list.length
          }

          if (total > 0) {
            const pages = Math.ceil(total / state.listView.limit)

            if (pages < state.listView.page) {
              page = pages
            } else {
              page = state.listView.page
            }
          }
        }

        if (!payload.noCommit) {
          commit('setListViewProperty', { list, page, total })
        }

        return response
      })
      .catch((error) => {
        if (!payload.noCommit) {
          commit('setListViewProperty', { list, page, total })
        }
        console.error(error)
        throw error
      })
  },

  async getOrderTasks({ commit }, payload) {
    return axios.get(`/task`, payload).then((response) => {
      const tasks = response.data

      tasks.forEach((el) => {
        el.createdAt = moment(el.createdAt).format('DD.MM.YYYY HH:mm:ss')
        el.date = moment(el.date).format('DD.MM.YYYY HH:mm:ss')
        el.executionPeriod = moment(el.executionPeriod).format('DD.MM.YYYY HH:mm')
      })

      return tasks
    })
  },

  async findByPk({ commit }, payload) {
    return axios
      .get(`/task/${payload.params.id}`, payload.query)
      .then((response) => {
        const task = response.data

        if (task.emailDate) {
          task.emailDate = moment(task.emailDate).format('DD.MM.YYYY HH:mm:ss')
        }

        if (task.executionPeriod) {
          task.executionPeriod = moment(task.executionPeriod).format('YYYY-MM-DDThh:mm')
        }

        for (const taskOrder of task.orders) {
          taskOrder.order.createdAt = moment(taskOrder.order.createdAt).format('DD.MM.YYYY HH:mm:ss')
        }

        if (!payload.noCommit) {
          commit('setOpenTask', task)
        }

        return task
      })
      .catch((error) => {
        console.error(error)
        const openTask = _.cloneDeep(newTask)
        commit('setOpenTask', openTask)
        return openTask
      })
  },

  async createTask({ commit, getters }, payload) {
    const writeTask = _.cloneDeep(getters.openTask)
    return axios.post(`/task`, writeTask).then((response) => {
      return response
    })
  },

  async updateTask({ commit, getters }, payload) {
    const updateTask = _.cloneDeep(getters.openTask)
    return axios.put(`/task/${updateTask.id}`, updateTask).then((response) => {
      return response
    })
  },

  async update({ commit, getters }, payload) {
    return axios.put(`/task/${payload.id}`, payload.updateData).then((response) => {
      return response
    })
  },

  async deleteTask(context, payload) {
    return axios.delete(`/task/${payload.id}`, payload).then((response) => {
      return response
    })
  },

  async checkBeforeExecutionTaskCondition({ dispatch, state }, payload) {
    let executeTask = true
    if (state.openTask.bpDefinition && state.openTask.stage) {
      const bpDefinition = await this.dispatch('bpDefinitions/findByPk', {
        params: {
          id: state.openTask.bpDefinition,
        },
      })
      if (bpDefinition) {
        const currentStage = bpDefinition.stages.find((stage) => stage.id === state.openTask.stage)
        if (currentStage.beforeExecution) {
          const reclamationResponse = await axios.get(`/getreclamation/${state.openTask.ownerId}`, {})
          if (reclamationResponse) {
            const currentReclamationData = reclamationResponse.data.responseData
            const conditionArgs = {
              task: state.openTask,
              reclamation: currentReclamationData,
            }
            executeTask = taskActions.executeConditionCode(currentStage.beforeExecution, conditionArgs)
          }
        }
      }
    }
    return executeTask
  },

  async executeOnStageExecution({ state }, params) {
    const bpDefinitions = await this.dispatch('bpDefinitions/findByPk', {
      params: {
        id: params.bpDefinition,
      },
    })
    if (bpDefinitions) {
      const currentStage = bpDefinitions.stages.find((stage) => stage.id === params.currentStageId)

      const reclamationResponse = await axios.get(`/getreclamation/${params.ownerId}`, {})

      if (currentStage) {
        if (currentStage.onExecution) {
          if (reclamationResponse) {
            const currentReclamationData = reclamationResponse.data.responseData
            const conditionArgs = {
              task: state.openTask,
              reclamation: currentReclamationData,
            }
            taskActions.executeAsyncConditionCode(currentStage.onExecution, conditionArgs)
          }
        }
      }

      if (params.nextStageId) {
        const nextStage = bpDefinitions.stages.find((stage) => stage.id === params.nextStageId)
        if (nextStage.beforeExecution) {
          if (reclamationResponse) {
            const currentReclamationData = reclamationResponse.data.responseData
            const nextStageconditionArgs = {
              task: state.openTask,
              reclamation: currentReclamationData,
            }
            await taskActions.executeAsyncConditionCode(nextStage.beforeExecution, nextStageconditionArgs)
          }
        }
      }
    }
  },

  async checkBeforeExecutionTaskCondition2({ state }, payload) {
    const currentStage = payload.currentStage
    let executeTask = true
    if (currentStage) {
      const conditionArgs = {}
      executeTask = taskActions.executeConditionCode(currentStage.beforeExecution, conditionArgs)
    }

    return executeTask
  },

  async createTaskBasingOnManualRedirection({ dispatch }, params) {
    const bpDefinitions = await this.dispatch('bpDefinitions/findByPk', {
      params: {
        id: params.bpDefinition,
      },
    })

    const executionTerm = new Date()
    executionTerm.setHours(0, 0, 0, 0)
    executionTerm.setDate(executionTerm.getDate() + 1)

    const newTaskParams = _.cloneDeep(newTask)
    newTaskParams.executionPeriod = executionTerm
    newTaskParams.ownerType = params.ownerType
    newTaskParams.ownerId = params.ownerId
    newTaskParams.name = params.nextStage
    newTaskParams.stage = params.nextStageId
    newTaskParams.subjectString = params.nextStage
    newTaskParams.customerId = params.customerId
    newTaskParams.bpDefinition = bpDefinitions.id
    newTaskParams.executorId = params.nextExecutorId
    newTaskParams.executorRoleId = null

    await axios.post(`/task`, newTaskParams)
  },

  async createTaskBasingOnBusinessProcessDefinitions({ dispatch }, params) {
    const bpDefinitions = await this.dispatch('bpDefinitions/findByPk', {
      params: {
        id: params.bpDefinition,
      },
    })
    if (bpDefinitions) {
      const currentStage = bpDefinitions.stages.find((stage) => stage.id === params.currentStageId)

      if (currentStage) {
        if (currentStage.next) {
          const nextStage = bpDefinitions.stages.find((stage) => stage.id === currentStage.next)

          if (nextStage) {
            if (nextStage.isCondition === false) {
              const executionTerm = new Date()
              executionTerm.setHours(0, 0, 0, 0)
              if (nextStage.executionTerm) {
                executionTerm.setDate(executionTerm.getDate() + Number(nextStage.executionTerm))
              }
              const newTaskParams = _.cloneDeep(newTask)
              newTaskParams.executionPeriod = executionTerm
              newTaskParams.ownerType = params.ownerType
              newTaskParams.ownerId = params.ownerId
              newTaskParams.name = nextStage.text
              newTaskParams.stage = nextStage.id
              newTaskParams.subjectString = nextStage.text
              newTaskParams.customerId = params.customerId
              newTaskParams.bpDefinition = bpDefinitions.id
              newTaskParams.executorId = nextStage.executorId > 0 ? nextStage.executorId : null
              newTaskParams.executorRoleId = nextStage.executorRoleId > 0 ? nextStage.executorRoleId : null
              await axios.post(`/task`, newTaskParams)
            } else {
              if (nextStage.conditionCode) {
                const reclamationResponse = await axios.get(`/getreclamation/${params.ownerId}`, {})
                if (reclamationResponse) {
                  const currentReclamationData = reclamationResponse.data.responseData
                  const conditionArgs = {
                    task: params,
                    reclamation: currentReclamationData,
                  }
                  const conditionRes = taskActions.executeConditionCode(nextStage.conditionCode, conditionArgs)
                  if (nextStage.next && conditionRes === true) {
                    params.currentStageId = nextStage.id
                    dispatch('createTaskBasingOnBusinessProcessDefinitions', params)
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  async checkForSimpleCondition({ dispatch }, params) {
    let normalStageFound = false
    // let manualConditionStage

    const bpDefinitions = await this.dispatch('bpDefinitions/findByPk', {
      params: {
        id: params.bpDefinition,
      },
    })
    if (bpDefinitions) {
      const currentStage = bpDefinitions.stages.find((stage) => stage.id === params.currentStageId)
      if (currentStage) {
        if (currentStage.next) {
          const nextStage = bpDefinitions.stages.find((stage) => stage.id === currentStage.next)
          if (nextStage) {
            if (nextStage.isCondition === false) {
              normalStageFound = true
            } else {
              if (nextStage.manualStageDefinition === true && normalStageFound === false) {
                const reclamationResponse = await axios.get(`/getreclamation/${params.ownerId}`, {})
                if (reclamationResponse) {
                  const currentReclamationData = reclamationResponse.data.responseData
                  const conditionArgs = {
                    task: params,
                    reclamation: currentReclamationData,
                  }
                  const conditionRes = taskActions.executeConditionCode(nextStage.conditionCode, conditionArgs)
                  if (nextStage.next && conditionRes === true) {
                    params.currentStageId = nextStage.id
                    dispatch('createTaskBasingOnBusinessProcessDefinitions', params)
                  }
                }

                // manualConditionStage = _.cloneDeep(nextStage)
              }
            }
          }
        }
      }
    }
  },

  async cancelTaskExecution({ commit, dispatch, state }, payload) {
    const updateData = {
      executionResult: payload.executionResult,
    }

    return axios.put(`/execute_task/${payload.id}`, updateData).then((response) => {
      commit('setOpenTask', _.cloneDeep(newTask))
      return response
    })
  },

  async executeTask({ commit, dispatch, state }, payload) {
    const updateData = {
      executionResult: payload.executionResult,
    }

    if (state.openTask.stage) {
      const params = {
        ownerType: state.openTask.ownerType,
        ownerId: state.openTask.ownerId,
        currentStageId: state.openTask.stage,
        bpDefinition: state.openTask.bpDefinition,
        customerId: state.openTask.customerId,
        manualRedirection: payload.manualRedirection,
        nextStageId: payload.nextStageId,
        nextStage: payload.nextStage,
        nextExecutorId: payload.nextExecutorId,
      }
      dispatch('executeOnStageExecution', params)

      if (payload.manualRedirection !== true) {
        dispatch('createTaskBasingOnBusinessProcessDefinitions', params)
      } else {
        dispatch('createTaskBasingOnManualRedirection', params)
      }
    }

    return axios.put(`/execute_task/${payload.id}`, updateData).then((response) => {
      commit('setOpenTask', _.cloneDeep(newTask))
      return response
    })
  },

  async acceptToExecutionTask({ commit, state }, payload) {
    return axios
      .put(`/accept_exec_task/${payload.id}`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  },

  async uploadFiles({ commit, getters }, params) {
    const formData = new FormData()

    params.files.map((file) => formData.append('files', file))

    formData.append('data', JSON.stringify({ id: getters.openTask.id }))

    return axios
      .post(`/task/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return undefined
      })
  },

  async getFiles({ commit }, params) {
    return axios
      .post(`/task/object_file`, { objectId: params.taskId })
      .then((response) => {
        commit('setTaskFiles', response.data)
        return response
      })
      .catch((error) => {
        console.error(error)
        return undefined
      })
  },

  async deleteFile({ commit }, params) {
    return axios
      .delete(`/task/file/${params.id}`, {})
      .then((response) => {
        if (response.status === 200) {
          commit('deleteTaskFile', params.index)
        }
        return response
      })
      .catch((error) => {
        console.error(error)
        return undefined
      })
  },

  async openFile({ commit }, params) {
    return axios
      .get(`/task/file/${params.id}`, { responseType: 'blob' })
      .then((response) => {
        if (response.status === 200) {
          const blob = new Blob([response.data], { type: params.type })
          const fileLink = document.createElement('a')
          fileLink.href = window.URL.createObjectURL(blob)

          if (params.open === true && (params.type === 'application/pdf' || params.type === 'image/jpeg' || params.type === 'image/png')) {
            fileLink.target = '_blank'
            fileLink.rel = 'noopener noreferrer'
          } else {
            fileLink.setAttribute('download', params.name)
          }

          document.body.appendChild(fileLink)
          fileLink.click()
        }
        return response
      })
      .catch((error) => {
        console.error(error)
        return undefined
      })
  },

  resetState({ commit }) {
    commit('resetState')
  },
}

export const getters = {
  listView(state) {
    return state.listView
  },
  openTask(state) {
    return state.openTask
  },
  parentView(state) {
    return state.parentView
  },
}
