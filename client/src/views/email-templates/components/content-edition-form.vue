<template>
  <b-modal v-model="showModal" title="Edycja treści maila" title-class="font-18" no-close-on-backdrop hide-footer size="xl" @close="handelClose">
    <b-row>
      <b-col md="8">
        <b-row>
          <b-col md="8">
            <b-form-group label="Tytuł" label-for="item-tittle">
              <b-form-input id="item-tittle" ref="itemTittle" v-model="currentLanguageVariantTitle" type="text" name="item-tittle" size="sm"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Język" label-for="language-list">
              <b-form-select
                id="language-list"
                v-model="currentLanguageVariantLanguage"
                :options="languagesList"
                text-field="name"
                value-field="code"
                name="language-list"
                size="sm"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <div class="form-group write-mdg-box mb-3">
              <label>Wiadomość</label>
              <quill-editor ref="tBodyEditor" v-model="currentLanguageVariantContent" class="tbody-editor" :options="editorOption" />
            </div>
          </b-col>
        </b-row>
      </b-col>
      <b-col>
        <b-card>
          <b-row
            ><b-col>
              <v-jstree
                ref="metadataTree"
                :data="baseDocumentAttributes"
                value-field-name="value"
                draggable
                allow-batch
                whole-row
                class="param-tree"
                :async="loadData"
                @item-click="paramItemClick"
              ></v-jstree> </b-col
          ></b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="12">
        <div class="text-left pt-2 pb-2">
          <b-button type="submit" variant="success" class="mr-2 ml-2" @click="saveContentModifications">Zapisz zmiany</b-button>
          <b-button variant="light" @click="cancelContentModifications">{{ $t('commands.cancel') }}</b-button>
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import Languages from '@/dto/Languages.json'
import { mapGetters, mapMutations } from 'vuex'
import _ from 'lodash'
import VJstree from 'vue-jstree'
import Quill from 'quill'
import editorColors from '@/constants/editorColors'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

const Block = Quill.import('blots/block')
class DivBlock extends Block {}

DivBlock.tagName = 'DIV'

// true means we overwrite
Quill.register('blots/block', DivBlock, true)

const sizeStyle = Quill.import('attributors/style/size')
sizeStyle.whitelist = ['10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '32px', '36px']
Quill.register(sizeStyle, true)

export default {
  components: { quillEditor, VJstree },

  props: {
    viewId: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [
              {
                size: [false, '10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '32px', '36px'],
              },
            ],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: editorColors }, { background: editorColors }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image', 'video'],
          ],
        },
      },
      showModal: true,
      languagesList: [],
      baseDocumentAttributes: [],
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'emailTemplates/objectView',
    }),

    bodyEditor() {
      return this.$refs.tBodyEditor.quill
    },

    objectView() {
      return this.getObjectView(this.viewId)
    },

    currentLanguageVariant: {
      get() {
        return this.objectView ? this.objectView.currentLanguageVariant : {}
      },
      set(value) {
        this.setObjectViewProperty({ viewId: this.viewId, property: 'currentLanguageVariant', value })
      },
    },

    currentLanguageVariantTitle: {
      get() {
        return this.objectView ? this.objectView.currentLanguageVariant.title : ''
      },
      set(value) {
        this.setCurrentContentVariantProperty({ viewId: this.viewId, property: 'title', value })
      },
    },

    currentLanguageVariantLanguage: {
      get() {
        return this.objectView ? this.objectView.currentLanguageVariant.language : ''
      },
      set(value) {
        this.setCurrentContentVariantProperty({ viewId: this.viewId, property: 'language', value })
      },
    },

    currentLanguageVariantContent: {
      get() {
        return this.objectView ? this.objectView.currentLanguageVariant.content : ''
      },
      set(value) {
        this.setCurrentContentVariantProperty({ viewId: this.viewId, property: 'content', value })
      },
    },
  },

  async mounted() {
    this.languagesList = _.cloneDeep(Languages)
    this.showModal = true
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'emailTemplates/setObjectViewProperty',
      setCurrentContentVariantProperty: 'emailTemplates/setCurrentContentVariantProperty',
      setObjectContentVariant: 'emailTemplates/setObjectContentVariant',
    }),

    saveContentModifications() {
      if (typeof this.currentLanguageVariantLanguage !== 'undefined') {
        this.setObjectContentVariant({ viewId: this.viewId })

        this.setObjectViewProperty({
          viewId: this.viewId,
          property: 'currentLanguageVariant',
          value: { title: '', language: '', content: '' },
        })

        this.$emit('edit-content-end')
      } else alert('Najpierw wybierz język szablonu!!!')
    },

    cancelContentModifications() {
      this.setObjectViewProperty({
        viewId: this.viewId,
        property: 'currentLanguageVariant',
        value: { title: '', language: '', content: '' },
      })

      this.$emit('edit-content-end')
    },

    handelClose() {
      this.$emit('edit-content-end')
    },

    paramItemClick(node, item, e) {
      if (item.value) {
        let cursorPosition = 0
        this.bodyEditor.focus()
        const range = this.bodyEditor.getSelection()
        if (range) {
          if (range.length === 0) {
            cursorPosition = range.index
          } else {
            cursorPosition = range.index + range.length
          }
        }

        this.bodyEditor.insertText(cursorPosition, `[${item.value}]`)
      }
    },

    loadData: function (node, resolve) {
      setTimeout(async () => {
        let itemAttributes = []
        if (this.baseDocumentAttributes.length === 1) {
          const response = await this.$store.dispatch('app/getObjectMeta', {
            params: { objectType: this.objectView.object.baseDocument },
          })

          if (response.status === 200) {
            itemAttributes = response.data

            for (const attrib of itemAttributes) {
              attrib.text = this.$t(`table.${attrib.field}`)
              attrib.value = attrib.field
              if (attrib.model) {
                attrib.isLeaf = false
                attrib.icon = 'ri-arrow-down-s-line text-primary'
              } else {
                attrib.isLeaf = true
                attrib.icon = 'ri-subtract-line text-primary'
              }
            }
          }
        } else if (node.data.model) {
          const response = await this.$store.dispatch('app/getObjectMeta', {
            params: { tableName: node.data.model },
          })

          if (response.status === 200) {
            itemAttributes = response.data

            for (const attrib of itemAttributes) {
              attrib.text = this.$t(`table.${attrib.field}`)
              attrib.value = `${node.data.value}.${attrib.field}`
              if (attrib.model) {
                attrib.isLeaf = false
                attrib.icon = 'ri-arrow-down-s-line text-primary'
              } else {
                attrib.isLeaf = true
                attrib.icon = 'ri-subtract-line text-primary'
              }
            }
          }
        }

        resolve(itemAttributes)
      }, 500)
    },
  },
}
</script>

<style>
.param-tree {
  height: 560px;
  overflow-y: scroll;
}

.tbody-editor {
  height: 400px;
}

ql-picker-item[data-value='10px']::before,
.ql-picker-label[data-value='10px']::before {
  content: '10px' !important;
}

.ql-picker-item[data-value='11px']::before,
.ql-picker-label[data-value='11px']::before {
  content: '11px' !important;
}

.ql-picker-item[data-value='12px']::before,
.ql-picker-label[data-value='12px']::before {
  content: '12px' !important;
}

.ql-picker-item[data-value='14px']::before,
.ql-picker-label[data-value='14px']::before {
  content: '14px' !important;
}

.ql-picker-item[data-value='16px']::before,
.ql-picker-label[data-value='16px']::before {
  content: '16px' !important;
}

.ql-picker-item[data-value='18px']::before,
.ql-picker-label[data-value='18px']::before {
  content: '18px' !important;
}

.ql-picker-item[data-value='20px']::before,
.ql-picker-label[data-value='20px']::before {
  content: '20px' !important;
}

.ql-picker-item[data-value='24px']::before,
.ql-picker-label[data-value='24px']::before {
  content: '24px' !important;
}

.ql-picker-item[data-value='30px']::before,
.ql-picker-label[data-value='30px']::before {
  content: '30px' !important;
}

.ql-picker-item[data-value='32px']::before,
.ql-picker-label[data-value='32px']::before {
  content: '32px' !important;
}

.ql-picker-item[data-value='36px']::before,
.ql-picker-label[data-value='36px']::before {
  content: '36px' !important;
}

.ql-editor.ql-blank::before {
  content: 'Wpisz tekst tutaj...' !important;
}
</style>
