<template>
  <Layout>
    <PageHeader :title="title" />
    <div>
      <b-card>
        <b-card-header>
          <b-button-toolbar>
            <b-btn-group class="mt-2">
              <a href="javascript:void(0);" class="btn btn-success btn-sm" :disabled="readOnly" @click="writeObject">
                <i class="ri-close-line"></i>
                {{ $t('commands.writeAndClose') }}
              </a>
              <a href="javascript:void(0);" class="btn btn-info btn-sm ml-2" @click="closeView">
                <i class="ri-close-line"></i>
                {{ $t('commands.close') }}
              </a>
            </b-btn-group>
          </b-button-toolbar>
        </b-card-header>
        <b-card-body>
          <b-row>
            <b-col md="7">
              <b-form-group :label="$t('table.name')" label-for="item-name">
                <b-form-input id="item-name" v-model="name" type="text" name="item-name" size="sm" :state="nameState" aria-describedby="name-feedback"></b-form-input>
                <b-form-invalid-feedback id="name-feedback">
                  <!-- This will only be shown if the preceeding input has an invalid state -->
                  {{ $t('common.notEmptyField') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col md="3">
              <b-form-group :label="$t('table.baseDocument')" label-for="base-document">
                <b-form-select
                  id="base-document"
                  v-model="baseDocument"
                  name="base-document"
                  :options="baseDocumentList"
                  text-field="label"
                  value-field="value"
                  size="sm"
                  :state="baseDocumentState"
                  aria-describedby="base-document-feedback"
                />
                <b-form-invalid-feedback id="base-document-feedback">
                  <!-- This will only be shown if the preceeding input has an invalid state -->
                  {{ $t('common.notEmptyField') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col md="2">
              <b-form-group :label="$t('table.isActive')" label-for="is-active">
                <b-form-checkbox v-model="isActive" name="is-active" switch> </b-form-checkbox>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group :label="$t('email.cc')" label-for="item-cc">
                <b-form-input id="item-cc" v-model="cc" type="text" name="item-cc" size="sm" placeholder="example@email.com"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :label="$t('email.bcc')" label-for="item-bcc">
                <b-form-input id="item-bcc" v-model="bcc" type="text" name="item-bcc" size="sm" placeholder="example@email.com"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12">
              <b-form-group label="Warunek dla odbiorcy" label-for="recepients-condition" class="mb-2">
                <b-form-textarea id="recepients-condition" v-model="recepientsCondition" rows="3"> </b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12">
              <b-button type="submit" class="btn btn-success mb-2" size="sm" @click="addTemplateContent">
                <i class="ri-add-line"></i>
                Dodaj treść powiadomienia
              </b-button>
              <table class="table table-centered mb-3">
                <tbody>
                  <tr v-for="(contentVariant, index) in contentVariantsList" :key="contentVariant.index">
                    <td class="text-left">
                      <b-button type="submit" variant="light" class="ml-1" @click="editTemplateContent(index)">{{ contentVariant.language }}</b-button>
                    </td>
                    <td class="text-left">{{ contentVariant.title }}</td>
                  </tr>
                </tbody>
              </table>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="12">
              <b-form-group label="Warunek wysyłki" label-for="execution-condition" class="mb-3">
                <b-form-textarea id="execution-condition" v-model="executionCondition" rows="5"> </b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>

      <ContentEdition v-if="showContentEditionForm" :view-id="viewId" @edit-content-end="editTemplateContentEnd" />
    </div>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import ContentEdition from './components/content-edition-form'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import _ from 'lodash'

/**
 * Email template details component
 */
export default {
  name: 'EmailTemplateDetail',

  page() {
    return { title: 'Edycja szablonu email', meta: [{ name: 'description', content: appConfig.description }] }
  },

  components: { Layout, PageHeader, ContentEdition },

  data() {
    return {
      title: 'Edycja szablonu email',
      viewId: this.$route.params.id,
      baseDocumentList: [
        {
          label: 'Reclamacja',
          value: 'Reclamation',
        },
        {
          label: 'Zapytanie ofertowe',
          value: 'CustomerRequest',
        },
        {
          label: 'Zadanie',
          value: 'Task',
        },
        {
          label: 'Zamówienie',
          value: 'Order',
        },
      ],
      showContentEditionForm: false,
      readOnly: this.$route.meta.isReadOnly,
      // sendActions: [],
      // reclamationStatuses: [],
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'emailTemplates/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    name: {
      get() {
        return this.objectView ? this.objectView.object.name : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'name', value })
      },
    },

    baseDocument: {
      get() {
        return this.objectView ? this.objectView.object.baseDocument : null
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'baseDocument', value })
      },
    },

    isActive: {
      get() {
        return this.objectView ? this.objectView.object.isActive : false
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'isActive', value })
      },
    },

    cc: {
      get() {
        return this.objectView ? this.objectView.object.cc : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'cc', value })
      },
    },

    bcc: {
      get() {
        return this.objectView ? this.objectView.object.bcc : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'bcc', value })
      },
    },

    recepientsCondition: {
      get() {
        return this.objectView ? this.objectView.object.recepientsCondition : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'recepientsCondition', value })
      },
    },

    executionCondition: {
      get() {
        return this.objectView ? this.objectView.object.executionCondition : ''
      },
      set(value) {
        this.setObjectProperty({ viewId: this.viewId, property: 'executionCondition', value })
      },
    },

    contentVariantsList: {
      get() {
        return this.objectView ? this.objectView.contentVariantsList : []
      },
      set(value) {
        this.setObjectViewProperty({ viewId: this.viewId, property: 'contentVariantsList', value })
      },
    },

    nameState() {
      return this.name !== ''
    },

    baseDocumentState() {
      return this.baseDocument !== null
    },
  },

  async mounted() {},

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'emailTemplates/setObjectViewProperty',
      setObjectProperty: 'emailTemplates/setObjectProperty',
      delObjectView: 'emailTemplates/delObjectView',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async writeObject() {
      let response

      const languageVariants = { item: this.contentVariantsList }
      this.setObjectProperty({
        viewId: this.viewId,
        property: 'contentVariantsList',
        value: JSON.stringify(languageVariants),
      })

      if (this.objectView.object.id === null) {
        response = await this.$store.dispatch('emailTemplates/create', this.objectView.object)
      } else {
        response = await this.$store.dispatch('emailTemplates/update', this.objectView.object)
      }
      if (response.status === 200) {
        this.closeView()
      }
    },

    async closeView() {
      this.$destroy()
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)
      await this.$router.push({ name: 'email-templates' })
    },

    addTemplateContent() {
      this.showContentEditionForm = true
    },

    editTemplateContent(currentIndex) {
      const currentLanguageVariant = _.cloneDeep(this.contentVariantsList[currentIndex])
      this.setObjectViewProperty({
        viewId: this.viewId,
        property: 'currentLanguageVariant',
        value: currentLanguageVariant,
      })

      this.showContentEditionForm = true
    },

    editTemplateContentEnd() {
      this.showContentEditionForm = false
    },
  },
}
</script>

<style></style>
