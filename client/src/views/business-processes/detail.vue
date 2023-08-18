<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
// import Stages from './components/stages-list.vue'
// import Toolbar from './form_components/toolbar.vue'
import VueMermaid from '@/components/mermaid/vue-mermaid.vue'
// import VueMermaid from "vue-mermaid/src";
import _ from 'lodash'
import { uuid } from 'vue-uuid'

import draggable from 'vuedraggable'

import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'BusinessProcessDetail',
  page: {
    title: 'Business process definition form',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    VueMermaid,
    draggable,
    // Toolbar,
  },
  data() {
    return {
      selected: '1',
      selectedlg: '1',
      selectedsm: '1',

      tempBpText: [],

      newUuidIteration: 0,
      bpDefinitionsArray: [],
      openStageIndex: -1,
      openStage: {},
      openStageConditionIndex: -1,
      openStageCondition: {},

      showModalStageEditor: false,
      showModalStageConditionEditor: false,

      stageSettingsList: [],
    }
  },

  computed: {
    ...mapGetters({
      openBpDefinitions: 'bpDefinitions/openItem',
      executorsList: 'users/userList',
      executorRolesList: 'executorRoles/executorRolesList',
    }),

    description: {
      get() {
        return this.openBpDefinitions.description
      },
      set(value) {
        this.setOpenItemProperty({
          property: 'description',
          value: value,
        })
      },
    },

    isActive: {
      get() {
        return this.openBpDefinitions.isActive
      },
      set(value) {
        this.setOpenItemProperty({
          property: 'isActive',
          value: value,
        })
      },
    },

    // executionTerm: {
    //     get() {
    //       return this.openBpDefinitions.executionTerm
    //     },
    //     set(value) {
    //       this.setOpenItemProperty({
    //         property: 'executionTerm',
    //         value: value,
    //       })
    //     },
    //   },

    // onExecution: {
    //     get() {
    //       return this.openBpDefinitions.onExecution
    //     },
    //     set(value) {
    //       this.setOpenItemProperty({
    //         property: 'onExecution',
    //         value: value,
    //       })
    //     },
    //   },

    // stageSettingsList: {
    //     get() {
    //       return this.openBpDefinitions.stageSettingsList
    //     },
    //     set(value) {
    //       this.setOpenItemProperty({
    //         property: 'stageSettingsList',
    //         value: value,
    //       })
    //     },
    //   },
  },

  async mounted() {
    await this.initialize()
    this.fillTempBpText()
  },

  methods: {
    ...mapMutations({
      setOpenItemProperty: 'bpDefinitions/setOpenItemProperty',
    }),

    async initialize() {
      this.stageSettingsList = _.cloneDeep(this.openBpDefinitions.stageSettingsList)
    },

    getNextStageId(uuid) {
      const found = this.stageSettingsList.find((el) => el.uuid === uuid)
      if (found) {
        return this.stageSettingsList.indexOf(found)
      } else return -1
    },

    generateBusinessProcessJSON() {
      const bpSettingsArray = []
      const stageIndex = 1
      for (let i = 0; i < this.stageSettingsList.length; i++) {
        const stageItem = this.stageSettingsList[i]
        const res = _.cloneDeep(stageItem)
        res.id = i + 1
        if (stageItem.isCondition === true) {
          // if (stageItem.conditions.length > 0) {
          const nextConditionArray = []
          const linkConditionArray = []
          const conditionsArray = []
          for (let c = 0; c < stageItem.conditions.length; c++) {
            let nextStageId = this.getNextStageId(stageItem.conditions[c].nextStage)
            if (nextStageId >= 0) {
              nextStageId++
              nextConditionArray.push(String(nextStageId))
            }
            linkConditionArray.push('--' + stageItem.conditions[c].link + '-->')
            conditionsArray.push(stageItem.conditions[c].conditionCode)
          }
          res.edgeType = 'rhombus'
          res.next = nextConditionArray
          res.link = linkConditionArray
          res.editable = true
          res.style = 'fill:#f9f,stroke:#333,stroke-width:4px'
          bpSettingsArray.push(_.cloneDeep(res))
          // }
        } else {
          if (stageItem.nextStage) {
            let nextStageId = this.getNextStageId(stageItem.nextStage)
            if (nextStageId >= 0) {
              nextStageId++
              res.next = [String(nextStageId)]
            }
          }
          bpSettingsArray.push(_.cloneDeep(res))
        }
      }
      this.setOpenItemProperty({
        property: 'stages',
        value: bpSettingsArray,
      })
    },

    editStage(stageIndex) {
      console.log('open stage index', stageIndex)
      if (stageIndex >= 0) {
        this.openStageIndex = stageIndex
        this.openStage = _.cloneDeep(this.stageSettingsList[stageIndex])
        this.showModalStageEditor = true
      }
    },

    editStageCondition(stageConditionIndex) {
      if (stageConditionIndex >= 0) {
        this.openStageConditionIndex = stageConditionIndex
        this.openStageCondition = _.cloneDeep(this.openStage.conditions[stageConditionIndex])
        this.showModalStageConditionEditor = true
      }
    },

    enptyStage() {
      return {
        id: null,
        text: '',
        isCondition: false,
        conditions: [],
      }
    },

    emptyStageCondition() {
      return {
        id: null,
        conditionCode: '',
        link: '',
        next: '',
      }
    },

    getNewUuid() {
      const newUuid = uuid.v4()
      const found = this.stageSettingsList.find((el) => el.uuid === newUuid)
      if (!found) {
        this.newUuidIteration = 0
        return newUuid
      } else {
        this.newUuidIteration++
        if (this.newUuidIteration < 15) {
          this.getNewUuid()
        }
      }
    },

    addStage() {
      this.openStage = _.cloneDeep(this.enptyStage())
      this.openStage.uuid = this.getNewUuid()
      this.showModalStageEditor = true
    },

    closeModalStageEditor() {
      this.openStage = _.cloneDeep(this.enptyStage())
      this.openStageIndex = -1
      this.showModalStageEditor = false
    },

    closeModalStageConditionEditor() {
      this.openStageCondition = _.cloneDeep(this.emptyStageCondition())
      this.showModalStageConditionEditor = false
    },

    acceptStageModifications() {
      const modifiedItem = _.cloneDeep(this.openStage)
      console.log('open stage index', this.openStageIndex)
      if (this.openStageIndex < 0) {
        this.stageSettingsList.push(modifiedItem)
      } else {
        this.stageSettingsList[this.openStageIndex] = modifiedItem
      }
      this.generateBusinessProcessJSON()
      console.log('bp definitions', this.openBpDefinitions)
      this.closeModalStageEditor()
    },

    deleteStage() {
      this.stageSettingsList.splice(this.openStageIndex, 1)
      this.closeModalStageEditor()
    },

    cancelStageModifications() {
      this.closeModalStageEditor()
    },

    addStageCondition() {
      this.openStageCondition = _.cloneDeep(this.emptyStageCondition())
      this.showModalStageConditionEditor = true
    },

    acceptStageConditionModifications() {
      const modifiedItem = _.cloneDeep(this.openStageCondition)

      if (modifiedItem) {
        modifiedItem.next = this.getNextStageId(modifiedItem.nextStage)
      }
      if (this.openStageConditionIndex < 0) {
        this.openStage.conditions.push(modifiedItem)
      } else {
        this.openStage.conditions[this.openStageConditionIndex] = modifiedItem
      }
      this.closeModalStageConditionEditor()
    },

    deleteStageCondition() {
      if (this.openStageIndex >= 0) {
        this.stageSettingsList[this.openStageIndex].conditions.splice(this.openStageConditionIndex, 1)
        this.closeModalStageConditionEditor()
      }
    },

    cancelStageConditionModifications() {
      this.closeModalStageConditionEditor()
    },

    getStageName(uuid) {
      const foundStage = this.stageSettingsList.find((el) => el.uuid === uuid)
      if (foundStage) {
        return foundStage.text
      } else return ''
    },

    async saveChanges(closeForm) {
      let res

      this.setOpenItemProperty({
        property: 'stageSettingsList',
        value: _.cloneDeep(this.stageSettingsList),
      })

      if (this.openBpDefinitions.id !== null) {
        res = await this.$store.dispatch('bpDefinitions/updateItem', this.openBpDefinitions)
      } else {
        res = await this.$store.dispatch('bpDefinitions/addItem', this.openBpDefinitions)
      }

      if (res && closeForm === true) {
        this.$router.push({ name: 'bp-definitions' })
      }
    },

    goBack() {
      this.$router.push({ name: 'bp-definitions' })
    },

    editNode(nodeId) {
      alert(nodeId)
    },

    fillTempBpText() {
      this.tempBpText = [
        // {
        //   "id":1,
        //   "text":"W drodze",
        //   "isCondition":false,
        //   "next":["2"],
        //   "index":1
        // },
        // {
        //   "id":2,
        //   "text":"Parking wjazd",
        //   "isCondition":false,
        //   "next":["3"],
        // },
        {
          id: 3,
          text: 'Jest oczekiwanie',
          isCondition: true,
          next: ['4', '5'],
          conditionCode: '1==1',
          edgeType: 'rhombus',
          link: ['-- yes -->', '-- no -->'],
          editable: true,
          style: 'fill:#f9f,stroke:#333,stroke-width:4px',
          index: 2,
        },
        // {
        //   "id":3,
        //   "text":"Jest oczekiwanie",
        //   "isCondition":true,
        //   "next":["4"],
        //   "conditionCode":"1==0",
        //   "edgeType":"rhombus",
        //   link:"Tak",
        //   "editable":true,
        //   "style":"fill:#f9f,stroke:#333,stroke-width:4px",
        //   "index":3
        // },
        // {
        //   "id":3,
        //   "text":"Jest oczekiwanie",
        //   "isCondition":true,
        //   "next":["5"],
        //   "conditionCode":"1==0",
        //   "edgeType":"rhombus",
        //   "link":"Nie",
        //   "editable":true,
        //   "style":"fill:#f9f,stroke:#333,stroke-width:4px",
        //   "index":3
        // },
        {
          id: 4,
          text: 'Parking oczekiwanie',
          isCondition: false,
          conditions: [],
          executorId: null,
          executorRoleId: null,
          uuid: 'e6e8e881-0d1d-48ae-a6c2-e3d38d19e5c4',
        },
        {
          id: 5,
          text: 'Parking wyjazd',
          isCondition: false,
          conditions: [],
          executorId: null,
          executorRoleId: null,
          uuid: '511c417e-b8d2-4768-894a-16bf03dc44cc',
        },
      ]
    },
  },
}
</script>

<template>
  <Layout>
    <b-card class="mt-1">
      <template v-slot:header>
        <div class="w-100">
          <b-button-toolbar class="float-left">
            <h4 class="mb-2"> {{ $t('businessProcess.definitionsFormTitle') }} </h4>
          </b-button-toolbar>

          <b-button-toolbar class="float-right">
            <b-button variant="success" class="btn ml-2 mb-1 btn-sm" @click="saveChanges(true)"> <i class="ri-save-2-line"></i> Zapisz i zamknij </b-button>
            <b-button variant="success" class="btn ml-2 mb-1 btn-sm" @click="saveChanges(false)"> <i class="ri-save-2-line"></i> Zapisz </b-button>
            <b-button variant="secondary" class="btn ml-2 mb-1 btn-sm" @click="goBack"> <i class="ri-delete-back-2-line"></i> Zamknij </b-button>
          </b-button-toolbar>
        </div>
      </template>

      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="description">Nazwa procesu</label>
            <b-form-input id="description" v-model="description" placeholder="Opis"> </b-form-input>
          </div>
        </div>
        <div class="col-md-4">
          <b-form-group label="Aktywny" label-for="isActive">
            <b-form-checkbox id="isActive" v-model="isActive" name="is_active" switch> </b-form-checkbox>
          </b-form-group>
        </div>
      </div>

      <div class="row">
        <b-button-toolbar class="float-left">
          <b-button variant="secondary" class="btn ml-2 mb-1" @click="addStage"> <i class="ri-delete-back-2-line"></i> Dodaj etap </b-button>
        </b-button-toolbar>
      </div>

      <div class="row">
        <div class="col-md-4">
          <div class="bg-dragula p-1 p-lg-2">
            <div id="company-list-left" class="py-2">
              <draggable class="list-group" group="tasks" :list="stageSettingsList" @change="generateBusinessProcessJSON">
                <div v-for="(stage, index) of stageSettingsList" :key="index" class="card mb-2 mt-0">
                  <b-card-body>
                    <a href="javascript:void(0);" @click="editStage(index)"
                      ><h5> {{ stage.text }}</h5></a
                    >
                  </b-card-body>
                </div>
              </draggable>
            </div>
          </div>
        </div>

        <div class="col-md-8">
          <VueMermaid :nodes="openBpDefinitions.stages" type="graph TD" @nodeClick="editNode"></VueMermaid>
        </div>
      </div>
    </b-card>

    <b-modal id="modal-1" v-model="showModalStageEditor" centered size="lg" title="Edycja etapu procesu biznesowego" title-tag="h4" title-class="modal-title">
      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button-toolbar class="float-left">
            <b-button variant="success" size="sm" class="mr-2" @click="acceptStageModifications"> OK </b-button>
            <b-button variant="secondary" size="sm" class="mr-2" @click="cancelStageModifications"> Anuluj </b-button>
          </b-button-toolbar>

          <b-button-toolbar class="float-right">
            <b-button variant="danger" size="sm" class="mr-2" @click="deleteStage"> Usun </b-button>
          </b-button-toolbar>
        </div>
      </template>

      <form class="p-2">
        <div class="row">
          <div class="col-md-6 mb-3">
            <div class="form-group">
              <label for="surname">Opis etapu</label>
              <b-form-input id="surname" v-model="openStage.text" placeholder="Opis"> </b-form-input>
            </div>
          </div>
          <div class="col-md-3">
            <b-form-group label="Termin wykonania" label-for="executionTerm" class="mb-3">
              <b-form-input id="executionTerm" v-model="openStage.executionTerm" type="number" />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3">
            <b-form-group label="Warunek" label-for="isCondition">
              <b-form-checkbox id="isCondition" v-model="openStage.isCondition" name="is_condition" switch> </b-form-checkbox>
            </b-form-group>
          </div>
          <div v-if="openStage.isCondition === true" class="col-md-5">
            <b-form-group label="Ręczny wybór następnego etapu" label-for="manualStageDefinition">
              <b-form-checkbox id="manualStageDefinition" v-model="openStage.manualStageDefinition" name="manualStageDefinition_name" switch> </b-form-checkbox>
            </b-form-group>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <b-form-group label="Przed wykonaniem" label-for="beforeExecution" class="mb-3">
              <b-form-textarea id="beforeExecution" v-model="openStage.beforeExecution" rows="5"> </b-form-textarea>
            </b-form-group>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <b-form-group label="Podczas wykonania" label-for="onExecution" class="mb-3">
              <b-form-textarea id="onExecution" v-model="openStage.onExecution" rows="5"> </b-form-textarea>
            </b-form-group>
          </div>
        </div>

        <div v-if="openStage.isCondition !== true" class="row">
          <div class="col-md-4">
            <b-form-group label="Następny etap" label-for="nextStage">
              <b-input-group class="mb-2">
                <b-form-select id="nextStage" v-model="openStage.nextStage" :options="stageSettingsList" name="nextStageName" text-field="text" value-field="uuid" />
              </b-input-group>
            </b-form-group>
          </div>
          <div class="col-md-4">
            <b-form-group label="Rola wykonawcy" label-for="executorRole">
              <b-input-group class="mb-2">
                <b-form-select id="executorRole" v-model="openStage.executorRoleId" :options="executorRolesList" name="executorRoleName" text-field="name" value-field="id" />
              </b-input-group>
            </b-form-group>
          </div>
          <div class="col-md-4">
            <b-form-group label="Wykonawca" label-for="executor">
              <b-input-group class="mb-2">
                <b-form-select id="executor" v-model="openStage.executorId" :options="executorsList" name="executorListName" text-field="name" value-field="id" />
              </b-input-group>
            </b-form-group>
          </div>
        </div>
        <div v-if="openStage.isCondition === true" class="row">
          <b-button variant="outline-secondary" class="btn mb-1" @click="addStageCondition"> <i class="ri-delete-back-2-line"></i> Dodaj warunek </b-button>

          <div class="table-responsive">
            <table class="table table-centered mb-0">
              <thead class="thead-light">
                <tr>
                  <th>link</th>
                  <th v-if="openStage.manualStageDefinition !== true">Warunek</th>
                  <th>Następny etap</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(condition, index) of openStage.conditions" :key="index">
                  <td>
                    <a href="javascript:void(0);" @click="editStageCondition(index)"> {{ condition.link }}</a>
                  </td>
                  <td v-if="openStage.manualStageDefinition !== true">
                    {{ condition.conditionCode }}
                  </td>
                  <td>
                    {{ getStageName(condition.nextStage) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </b-modal>

    <b-modal id="modal-1" v-model="showModalStageConditionEditor" centered size="lg" title="Edycja warunku" title-tag="h4" title-class="modal-title">
      <form class="p-2">
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label for="surname">Link</label>
              <b-form-input id="surname" v-model="openStageCondition.link" placeholder="Opis"> </b-form-input>
            </div>
          </div>
        </div>
        <div v-if="openStage.manualStageDefinition !== true" class="row">
          <div class="col-md-12">
            <b-form-group label="Warunek wykonania" label-for="conditionCode" class="mb-3">
              <b-form-textarea id="conditionCode" v-model="openStageCondition.conditionCode" rows="5"> </b-form-textarea>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <b-form-group label="Następny etap" label-for="nextStage">
              <b-input-group class="mb-2">
                <b-form-select id="nextStage" v-model="openStageCondition.nextStage" :options="stageSettingsList" name="nextStageName" text-field="text" value-field="uuid" />
              </b-input-group>
            </b-form-group>
          </div>
        </div>
      </form>
      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button-toolbar class="float-left">
            <b-button variant="success" size="sm" class="mr-2" @click="acceptStageConditionModifications"> OK </b-button>
            <b-button variant="secondary" size="sm" class="mr-2" @click="cancelStageConditionModifications"> Anuluj </b-button>
          </b-button-toolbar>

          <b-button-toolbar class="float-right">
            <b-button variant="danger" size="sm" class="mr-2" @click="deleteStageCondition"> Usun </b-button>
          </b-button-toolbar>
        </div>
      </template>
    </b-modal>
  </Layout>
</template>
