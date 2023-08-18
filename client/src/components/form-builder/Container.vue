<template>
  <div class="fm-style">
    <b-row>
      <b-col md="2" class="p-0">
        <b-tabs small>
          <b-tab active>
            <template v-slot:title>
              <i class="ri-layout-grid-line"></i>
            </template>
            <div class="components-list">
              <template v-if="basicFields.length">
                <div class="widget-cate">{{ $t('fm.components.basic.title') }}</div>
                <draggable
                  tag="ul"
                  :list="basicComponents"
                  class="p-0"
                  v-bind="{ group: { name: 'form-widget', pull: 'clone', put: false }, sort: false, ghostClass: 'ghost' }"
                  @end="handleMoveEnd"
                  @start="handleMoveStart"
                  :move="handleMove"
                >
                  <template v-for="(item, index) in basicComponents">
                    <li v-if="basicFields.indexOf(item.type) >= 0" class="form-edit-widget-label" :class="{ 'no-put': item.type === 'divider' }" :key="index">
                      <a>
                        <i class="icon iconfont" :class="item.icon"></i>
                        <span>{{ $t(`fm.components.fields.${item.type}`) }}</span>
                      </a>
                    </li>
                  </template>
                </draggable>
              </template>
              <template v-if="advanceFields.length">
                <div class="widget-cate">{{ $t('fm.components.advance.title') }}</div>
                <draggable
                  tag="ul"
                  class="p-0"
                  :list="advanceComponents"
                  v-bind="{ group: { name: 'form-widget', pull: 'clone', put: false }, sort: false, ghostClass: 'ghost' }"
                  @end="handleMoveEnd"
                  @start="handleMoveStart"
                  :move="handleMove"
                >
                  <template v-for="(item, index) in advanceComponents">
                    <li v-if="advanceFields.indexOf(item.type) >= 0" class="form-edit-widget-label" :class="{ 'no-put': item.type === 'table' }" :key="index">
                      <a>
                        <i class="icon iconfont" :class="item.icon"></i>
                        <span>{{ $t(`fm.components.fields.${item.type}`) }}</span>
                      </a>
                    </li>
                  </template>
                </draggable>
              </template>

              <template v-if="layoutFields.length">
                <div class="widget-cate">{{ $t('fm.components.layout.title') }}</div>
                <draggable
                  tag="ul"
                  class="p-0"
                  :list="layoutComponents"
                  v-bind="{ group: { name: 'form-widget', pull: 'clone', put: false }, sort: false, ghostClass: 'ghost' }"
                  @end="handleMoveEnd"
                  @start="handleMoveStart"
                  :move="handleMove"
                >
                  <template v-for="(item, index) in layoutComponents">
                    <li v-if="layoutFields.indexOf(item.type) >= 0" class="form-edit-widget-label no-put" :key="index">
                      <a>
                        <i class="icon iconfont" :class="item.icon"></i>
                        <span>{{ $t(`fm.components.fields.${item.type}`) }}</span>
                      </a>
                    </li>
                  </template>
                </draggable>
              </template>
            </div>
          </b-tab>
        </b-tabs>
      </b-col>

      <b-col>
        <b-row class="justify-content-between m-0">
          <b-row class="m-0">
            <b-button-group size="sm">
              <b-button variant="light" :pressed="device === 'desktop'">
                <i class="ri-computer-line"></i>
              </b-button>
              <b-button variant="light" :pressed="device === 'tablet'">
                <i class="ri-tablet-line"></i>
              </b-button>
              <b-button variant="light" :pressed="device === 'mobile'">
                <i class="ri-smartphone-line"></i>
              </b-button>
            </b-button-group>
          </b-row>
          <b-button-group size="sm">
            <slot name="action"></slot>
            <b-button variant="light" @click="handleUpload">
              <i class="ri-file-upload-line"></i>
              {{ $t('fm.actions.import') }}
            </b-button>
            <b-button variant="light" @click="handleClear">
              <i class="ri-delete-bin-line"></i>
              {{ $t('fm.actions.clear') }}
            </b-button>
            <b-button variant="light" @click="handlePreview">
              <i class="ri-eye-line"></i>
              {{ $t('fm.actions.preview') }}
            </b-button>
            <b-button variant="light" @click="handleGenerateJson">
              <i class="ri-file-text-line"></i>
              {{ $t('fm.actions.json') }}
            </b-button>
            <!-- <b-button variant="light" @click="handleGenerateCode">
            <i class="ri-file-code-line"></i>
            {{$t('fm.actions.code')}}
          </b-button> -->
            <b-button variant="light" @click="save">
              {{ $t('commands.write') }}
            </b-button>
          </b-button-group>
        </b-row>
        <b-row>
          <widget-list ref="widgetList" :data="widgetForm" :select.sync="widgetFormSelect"></widget-list>
        </b-row>
        <b-row :class="{ 'widget-empty': widgetForm.list.length === 0 }">
          <b-col>
            <widget-form ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect"></widget-form>
          </b-col>
        </b-row>
      </b-col>

      <b-col md="3" class="px-3">
        <b-tabs small>
          <b-tab :title="$t('fm.config.widget.tabTitle')" class="py-2">
            <widget-config :data="widgetFormSelect"></widget-config>
          </b-tab>
          <b-tab :title="$t('fm.config.form.title')" class="py-2">
            <form-config :data="widgetForm.config"></form-config>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>

    <cus-dialog :visible="previewVisible" @on-close="previewVisible = false" ref="widgetPreview" size="xl" form>
      <generate-form insite="true" @on-change="handleDataChange" v-if="previewVisible" :data="widgetForm" :value="widgetModels" ref="generateForm">
        <template v-slot:blank="scope">
          Width <b-input v-model="scope.model.blank.width" style="width: 100px"></b-input> Height <b-input v-model="scope.model.blank.height" style="width: 100px"></b-input>
        </template>
      </generate-form>

      <template slot="action">
        <b-button type="primary" @click="handleTest">{{ $t('fm.actions.getData') }}</b-button>
        <b-button @click="handleReset">{{ $t('fm.actions.reset') }}</b-button>
      </template>
    </cus-dialog>

    <cus-dialog :visible="uploadVisible" @on-close="uploadVisible = false" @on-submit="handleUploadJson" ref="uploadJson" width="800px" form>
      <b-alert variant="info">
        {{ $t('fm.description.uploadJsonInfo') }}
      </b-alert>
      <div id="uploadeditor" style="height: 400px; width: 100%">{{ jsonEg }}</div>
    </cus-dialog>

    <cus-dialog :visible="jsonVisible" @on-close="jsonVisible = false" size="lg" form>
      <div id="jsoneditor" style="height: 400px; width: 100%">{{ jsonTemplate }}</div>
      <template slot="action">
        <b-button type="primary" class="json-btn" :data-clipboard-text="jsonCopyValue">{{ $t('fm.actions.copyData') }}</b-button>
      </template>
    </cus-dialog>

    <cus-dialog :visible="codeVisible" @on-close="codeVisible = false" ref="codePreview" size="lg" form :action="false">
      <b-card no-body>
        <b-tabs card>
          <b-tab title="Vue Component" active>
            <div id="vuecodeeditor" style="height: 500px; width: 100%">{{ vueTemplate }}</div>
          </b-tab>
          <b-tab title="HTML">
            <div id="codeeditor" style="height: 500px; width: 100%">{{ htmlTemplate }}</div>
          </b-tab>
        </b-tabs>
      </b-card>
    </cus-dialog>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
// import Clipboard from 'clipboard'
import WidgetConfig from './WidgetConfig'
import FormConfig from './FormConfig'
import WidgetForm from './WidgetForm'
import WidgetList from './WidgetList'
import CusDialog from './CusDialog'
import GenerateForm from './GenerateForm'
import { basicComponents, layoutComponents, advanceComponents } from './utils/componentsConfig'
import generateCode from './utils/generateCode'
import { mapGetters } from 'vuex'

import './iconfont/iconfont.css'
import './styles/cover.scss'
import './styles/index.scss'

export default {
  name: 'fm-builder',
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    WidgetList,
    CusDialog,
    GenerateForm,
  },
  props: {
    basicFields: {
      type: Array,
      default: () => ['input', 'button', 'textarea', 'number', 'radio', 'checkbox', 'time', 'date', 'rate', 'color', 'select', 'switch', 'slider', 'text', 'dropdown'],
    },
    advanceFields: {
      type: Array,
      default: () => ['blank', 'imgupload', 'editor', 'cascader', 'view-list', 'pagination'],
    },
    layoutFields: {
      type: Array,
      default: () => ['container', 'grid', 'card', 'toolbar', 'btnGroup', 'collapse', 'inputGroup'],
    },
  },
  data() {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,
      widgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small',
        },
      },
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      uploadVisible: false,
      widgetModels: {},
      blank: '',
      htmlTemplate: '',
      vueTemplate: '',
      jsonTemplate: '',
      uploadEditor: null,
      jsonCopyValue: '',
      jsonClipboard: null,
      jsonEg: `{
        "list": [],
        "config": {
          "labelWidth": 100,
          "labelPosition": "top",
          "size": "small"
        }
      }`,
      codeActiveName: 'vue',
      formId: null,
      formObject: null,
      device: 'desktop',
      viewId: this.$route.params.id,
    }
  },
  async mounted() {
    this.formId = this.$route.params.id
    await this.initialize()
  },

  computed: {
    ...mapGetters({
      getObjectView: 'viewSettings/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },

    tabIndex: {
      get() {
        return this.objectView ? this.objectView.tabIndex : 0
      },
      set(value) {
        this.setObjectViewProperty({ viewId: this.viewId, property: 'tabIndex', value })
      },
    },
  },

  methods: {
    async initialize() {
      const initParams = {
        params: {
          id: this.formId,
        },
      }
      await this.$store
        .dispatch('viewSettings/findByPk', initParams)
        .then((res) => {
          console.log('then response', res)
        })
        .catch((error) => {
          console.log('error', error)
        })

      if (this.object) {
        if (this.object.template) {
          this.handleUpload()
        }
      }
    },
    handleMoveEnd(evt) {
      console.log('handleMoveEnd', evt)
    },
    handleMoveStart({ oldIndex }) {
      // TO DO
    },
    handleMove() {
      return true
    },
    handlePreview() {
      // console.log(this.widgetForm)
      this.previewVisible = true
    },
    handleTest() {
      this.$refs.generateForm
        .getData()
        .then((data) => {
          this.$alert(data, '').catch((e) => {})
          this.$refs.widgetPreview.end()
        })
        .catch((e) => {
          this.$refs.widgetPreview.end()
        })
    },
    handleReset() {
      this.$refs.generateForm.reset()
    },

    handleGenerateJson() {
      this.jsonVisible = true
      this.jsonTemplate = this.widgetForm
      // console.log(JSON.stringify(this.widgetForm))
      // this.$nextTick(() => {

      //   // const editor = ace.edit('jsoneditor')
      //   // editor.session.setMode("ace/mode/json")

      //   if (!this.jsonClipboard) {
      //     this.jsonClipboard = new Clipboard('.json-btn')
      //     this.jsonClipboard.on('success', (e) => {
      //       this.$message.success(this.$t('fm.message.copySuccess'))
      //     })
      //   }
      //   this.jsonCopyValue = JSON.stringify(this.widgetForm)
      // })
    },

    handleGenerateCode() {
      this.codeVisible = true
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm), 'html')
      this.vueTemplate = generateCode(JSON.stringify(this.widgetForm), 'vue')
      this.$nextTick(() => {
        // const editor = ace.edit('codeeditor')
        // editor.session.setMode("ace/mode/html")
        // const vueeditor = ace.edit('vuecodeeditor')
        // vueeditor.session.setMode("ace/mode/html")
      })
    },
    // handleUpload () {
    //   this.uploadVisible = true
    //   this.$nextTick(() => {
    //     this.uploadEditor = ace.edit('uploadeditor')
    //     this.uploadEditor.session.setMode("ace/mode/json")
    //   })
    // },

    handleUpload() {
      try {
        this.setJSON(JSON.parse(this.object.template)) // <- json from db
        this.uploadVisible = false
      } catch (e) {
        this.$message.error(e.message)
        this.$refs.uploadJson.end()
      }
    },

    handleUploadJson() {
      try {
        this.setJSON(JSON.parse(this.uploadEditor.getValue()))
        this.uploadVisible = false
      } catch (e) {
        this.$message.error(e.message)
        this.$refs.uploadJson.end()
      }
    },

    handleClear() {
      this.widgetForm = {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small',
          customClass: '',
        },
      }
      this.widgetFormSelect = {}
    },

    clear() {
      this.handleClear()
    },
    getJSON() {
      return this.widgetForm
    },
    getHtml() {
      return generateCode(JSON.stringify(this.widgetForm))
    },
    setJSON(json) {
      if (json.config) {
        json.config.name = this.object.name
        json.config.description = this.object.description
      }
      this.widgetForm = json

      if (json.list.length > 0) {
        this.widgetFormSelect = json.list[0]
      }
    },
    handleInput(val) {
      // console.log(val)
      this.blank = val
    },
    handleDataChange(field, value, data) {
      // console.log(field, value, data)
    },

    async save() {
      const updateItem = {
        id: this.formId,
        template: JSON.stringify(this.widgetForm),
      }
      if (this.widgetForm.config) {
        if (this.widgetForm.config.name) {
          updateItem.name = this.widgetForm.config.name
        }
      }
      await this.$store.dispatch('viewSettings/update', updateItem)
    },
  },
  // watch: {
  //   widgetForm: {
  //     deep: true,
  //     handler: function (val) {
  //       // console.log(this.$refs.widgetForm)
  //     }
  //   },
  // }
}
</script>
