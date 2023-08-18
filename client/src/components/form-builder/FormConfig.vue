<template>
  <div class="form-config-container">
    <b-form>
      <b-form-group :label="$t('fm.config.form.title')">
        <b-form-input v-model="data.name" type="text"></b-form-input>
      </b-form-group>

      <b-form-group :label="$t('fm.config.form.labelPosition.title')">
        <b-form-radio-group v-model="data.labelPosition">
          <b-form-radio value="left">{{ $t('fm.config.form.labelPosition.left') }}</b-form-radio>
          <b-form-radio value="right">{{ $t('fm.config.form.labelPosition.right') }}</b-form-radio>
          <b-form-radio value="top">{{ $t('fm.config.form.labelPosition.top') }}</b-form-radio>
        </b-form-radio-group>
      </b-form-group>

      <b-form-group :label="$t('fm.config.form.labelWidth')">
        <b-form-input v-model="data.labelWidth" type="number" :min="0" :max="200" :step="10"></b-form-input>
      </b-form-group>

      <b-form-group :label="$t('fm.config.form.size')">
        <b-form-radio-group v-model="data.size">
          <b-form-radio value="medium">medium</b-form-radio>
          <b-form-radio value="small">small</b-form-radio>
          <b-form-radio value="mini">mini</b-form-radio>
        </b-form-radio-group>
      </b-form-group>

      <b-form-group :label="$t('fm.config.form.dataSource')">
        <b-button variant="outline-secondary" @click="handleDataSource"> Configure data source</b-button>
      </b-form-group>

      <b-form-group :label="$t('fm.config.form.methods')">
        <b-button variant="outline-secondary" @click="handleMethods"> Configure methods</b-button>
      </b-form-group>

      <b-form-group :label="$t('fm.config.form.toolbarContent')">
        <b-button variant="outline-secondary" @click="handleToolbarContent"> Configure toolbar</b-button>
      </b-form-group>
    </b-form>
    <cus-dialog :visible="methodsVisible" @on-close="methodsVisible = false" ref="methodsPreview" size="xl" form>
      <b-button-toolbar key-nav class="mb-2">
        <b-button-group class="mx-1">
          <b-button @click="addMethodsItem">Add new method</b-button>
        </b-button-group>
        <b-button-group class="mx-1 pull-right">
          <b-button @click="saveMethodsItem">Save current method</b-button>
        </b-button-group>
      </b-button-toolbar>
      <b-row>
        <b-col md="4">
          <b-list-group class="mb-2">
            <b-list-group-item
              v-for="(methodsItem, index) in data.methodsList"
              :key="index"
              @click="pickMethodsItem(index)"
              href="#"
              class="d-flex justify-content-between align-items-center"
            >
              {{ methodsItem.name }}
              <b-button variant="outline-secondary" @click="deleteMethodsItem(index)">
                <div class="icon-trash"></div>
              </b-button>
            </b-list-group-item>
          </b-list-group>
        </b-col>

        <b-col>
          <div v-if="currentMethodIndex !== null">
            <b-input-group :label="$t('fm.config.form.functionName')" label-for="methods-name-input" class="mb-1">
              <b-form-input id="methods-name-input" v-model="currentMethodsItem.name" type="text" autofocus :placeholder="$t('fm.config.form.functionName')"></b-form-input>
            </b-input-group>
            <b-input-group :label="$t('fm.config.form.functionDescription')" label-for="Methods-description-input" class="mb-1">
              <b-form-input
                id="methods-description-input"
                v-model="currentMethodsItem.description"
                type="text"
                autofocus
                :placeholder="$t('fm.config.form.description')"
              ></b-form-input>
            </b-input-group>
            <b-form-textarea id="textarea-large" placeholder="Function code" v-model="currentMethodsItem.functionBody" rows="8" max-rows="15" class="mb-1"></b-form-textarea>
          </div>
        </b-col>
      </b-row>
    </cus-dialog>

    <cus-dialog :visible="dataSourceVisible" @on-close="dataSourceVisible = false" ref="dataSourcePreview" size="xl" form>
      <b-form-textarea id="data-source-id" placeholder="Data source function" v-model="data.formDataSource" rows="16" max-rows="24"></b-form-textarea>
    </cus-dialog>

    <cus-dialog :visible="toolbarContentVisible" @on-close="toolbarContentVisible = false" ref="toolbarContentPreview" size="xl" form>
      <b-button-toolbar key-nav class="mb-2">
        <b-button-group class="mx-1">
          <b-button @click="addToolbarContentItem">Add new button</b-button>
        </b-button-group>
        <b-button-group class="mx-1 pull-right">
          <b-button @click="saveToolbarContent">Save</b-button>
        </b-button-group>
      </b-button-toolbar>
      <b-row>
        <b-col md="4">
          <b-list-group class="mb-2">
            <b-list-group-item
              v-for="(toolbarContentItem, index) in data.toolbarContentList"
              :key="index"
              @click="pickToolbarContentItem(index)"
              href="#"
              class="d-flex justify-content-between align-items-center"
            >
              {{ toolbarContentItem.name }}
              <b-button variant="outline-secondary" @click="deleteToolbarContentItem(index)">
                <div class="icon-trash"></div>
              </b-button>
            </b-list-group-item>
          </b-list-group>
        </b-col>
        <b-col>
          <div v-if="currentToolbarContentIndex !== null">
            <b-input-group :label="$t('fm.config.form.toolbarContent')" label-for="toolbarItem-name-input" class="mb-1">
              <b-form-input
                id="toolbarItem-name-input"
                v-model="currentToolbarContentItem.name"
                type="text"
                autofocus
                :placeholder="$t('fm.config.form.buttonName')"
              ></b-form-input>
            </b-input-group>
            <b-input-group :label="$t('fm.config.form.functionName')" label-for="toolbarItem-href-input" class="mb-1">
              <b-form-input id="toolbarItem-href-input" v-model="currentToolbarContentItem.href" type="text" autofocus :placeholder="$t('fm.config.form.href')"></b-form-input>
            </b-input-group>
            <b-input-group :label="$t('fm.config.form.functionName')" label-for="toolbarItem-class-input" class="mb-1">
              <b-form-input id="toolbarItem-class-input" v-model="currentToolbarContentItem.class" type="text" autofocus :placeholder="$t('fm.config.form.class')"></b-form-input>
            </b-input-group>
            <b-input-group :label="$t('fm.config.form.functionName')" label-for="toolbarItem-method-input" class="mb-1">
              <b-form-input
                id="toolbarItem-method-input"
                v-model="currentToolbarContentItem.method"
                type="text"
                autofocus
                :placeholder="$t('fm.config.form.method')"
              ></b-form-input>
            </b-input-group>
            <b-input-group :label="$t('fm.config.form.functionName')" label-for="toolbarItem-icon-input" class="mb-1">
              <b-form-input id="toolbarItem-icon-input" v-model="currentToolbarContentItem.icon" type="text" autofocus :placeholder="$t('fm.config.form.icon')"></b-form-input>
            </b-input-group>
            <b-input-group :label="$t('fm.config.form.functionDescription')" label-for="Methods-description-input" class="mb-1">
              <b-form-input
                id="methods-description-input"
                v-model="currentToolbarContentItem.description"
                type="text"
                autofocus
                :placeholder="$t('fm.config.form.description')"
              ></b-form-input>
            </b-input-group>
          </div>
        </b-col>
      </b-row>
    </cus-dialog>
  </div>
</template>

<script>
import CusDialog from './CusDialog'
import _ from 'lodash'

export default {
  components: {
    CusDialog,
  },

  props: ['data'],

  data() {
    return {
      methodsVisible: false,
      dataSourceVisible: false,
      currentMethodIndex: null,
      toolbarContentVisible: false,
      currentMethodItem: {
        name: '',
        description: '',
        functionBody: '',
      },
      currentToolbarContentItem: {
        name: '',
        description: '',
        methodName: '',
      },
      currentToolbarContentIndex: null,
    }
  },

  async mounted() {
    if (this.data) {
      if (!this.data.methodsList) {
        this.data.methodsList = []
      }
      if (!this.data.toolbarContentList) {
        this.data.toolbarContentList = []
      }
    }
  },

  methods: {
    handleMethods() {
      try {
        this.methodsVisible = true
        console.log('methods visible')
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    handleToolbarContent() {
      try {
        this.toolbarContentVisible = true
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    handleDataSource() {
      try {
        this.dataSourceVisible = true
      } catch (e) {
        this.$message.error(e.message)
      }
    },

    addMethodsItem() {
      const MethodsItem = {
        name: 'newMethod_' + this.data.methodsList.length,
        description: 'New method description',
        functionBody: '',
      }
      this.data.methodsList.push(MethodsItem)
      this.currentMethodsItem = MethodsItem
      this.currentMethodIndex = this.data.methodsList.length - 1
    },
    pickMethodsItem(methodsItemIndex) {
      this.currentMethodIndex = methodsItemIndex
      this.currentMethodsItem = _.cloneDeep(this.data.methodsList[methodsItemIndex])
    },
    deleteMethodsItem(removeIndex) {
      this.data.methodsList.splice(removeIndex, 1)
      this.currentMethodIndex = null
    },
    saveMethodsItem() {
      if (this.currentMethodIndex !== null) {
        this.data.methodsList[this.currentMethodIndex] = _.cloneDeep(this.currentMethodsItem)
      }
    },

    addToolbarContentItem() {
      const toolbarContentItem = {
        name: 'newButton_' + this.data.toolbarContentList.length,
        href: '#',
        class: '',
        method: '',
        icon: '',
        description: '',
      }
      this.data.toolbarContentList.push(toolbarContentItem)
      this.currentToolbarContentItem = toolbarContentItem
      this.currentToolbarContentIndex = this.data.toolbarContentList.length - 1
    },
    pickToolbarContentItem(toolbarContentIndex) {
      this.currentToolbarContentIndex = toolbarContentIndex
      this.currentToolbarContentItem = _.cloneDeep(this.data.toolbarContentList[toolbarContentIndex])
    },

    deleteToolbarContentItem(removeIndex) {
      this.data.toolbarContentList.splice(removeIndex, 1)
      this.currentToolbarContentIndex = null
    },
    saveToolbarContent() {
      if (this.currentToolbarContentIndex !== null) {
        this.data.toolbarContentList[this.currentToolbarContentIndex] = _.cloneDeep(this.currentToolbarContentItem)
      }
    },
  },
}
</script>

