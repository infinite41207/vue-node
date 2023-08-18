<template>
  <Layout>
    <PageHeader :title="title" />
    <div>
      <b-card>
        <b-card-header>
          <b-button-toolbar>
            <b-btn-group class="mt-2">
              <b-button variant="success" :disabled="readOnly" class="btn-sm" @click="writeObject">
                <i class="ri-close-line"></i>
                {{ $t('commands.writeAndClose') }}
              </b-button>
              <b-button variant="outline-secondary" class="btn-sm ml-1" @click="closeView">
                <i class="ri-close-line"></i>
                {{ $t('commands.close') }}
              </b-button>
            </b-btn-group>
          </b-button-toolbar>
        </b-card-header>
        <b-card-body>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.name')" label-for="email-account-name">
                <b-form-input id="email-account-name" v-model="name" name="email-account-name" size="sm" />
              </b-form-group>
            </b-col>
            <b-col md="2">
              <b-form-checkbox v-model="isActive" name="is-active-button" switch>
                {{ $t('table.isActive') }}
              </b-form-checkbox>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.user')" label-for="email-account-user">
                <b-form-input id="email-account-user" v-model="user" name="email-account-user" size="sm" autocomplete="off" />
              </b-form-group>
            </b-col>
            <b-col md="2">
              <b-form-checkbox v-model="isService" name="is-service-button" switch>
                {{ $t('table.isService') }}
              </b-form-checkbox>
            </b-col>

            <b-col md="2">
              <b-form-checkbox v-model="isGeneral" name="is-general-button" switch>
                {{ $t('table.isGeneral') }}
              </b-form-checkbox>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.password')" label-for="email-account-password">
                <b-form-input
                  id="email-account-password"
                  v-model="password"
                  type="password"
                  name="email-account-password"
                  :placeholder="$t('login.passwordPh')"
                  size="sm"
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="2">
              <b-form-checkbox v-model="forReceive" name="for-receive" switch>
                {{ $t('email.forReceive') }}
              </b-form-checkbox>
            </b-col>
            <b-col md="2">
              <b-form-checkbox v-model="forSend" name="for-send" switch>
                {{ $t('email.forSend') }}
              </b-form-checkbox>
            </b-col>
            <b-col md="2">
              <b-form-checkbox v-model="storeFilesToHardDrive" name="store-to-hard-drive" switch>
                {{ $t('table.storeFilesToHardDrive') }}
              </b-form-checkbox>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('email.imapHost')" label-for="ea-imap-host">
                <b-form-input id="ea-imap-host" v-model="imapHost" :disabled="!forReceive" name="ea-imap-host" size="sm" />
              </b-form-group>
            </b-col>
            <b-col md="2">
              <b-form-group horizontal :label-cols="5" :label="$t('email.imapPort')" label-for="ea-imap-port">
                <b-form-input id="ea-imap-port" v-model="imapPort" :disabled="!forReceive" type="number" name="ea-imap-port" size="sm" />
              </b-form-group>
            </b-col>
            <b-col md="2">
              <b-form-checkbox v-model="imapTls" :disabled="!forReceive" name="ea-imap-tls" switch>
                {{ $t('email.imapTls') }}
              </b-form-checkbox>
            </b-col>
            <b-col md="2">
              <b-form-checkbox v-model="storeReceived" :disabled="!forReceive" name="ea-store-received" switch>
                {{ $t('email.storeReceived') }}
              </b-form-checkbox>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('email.smtpHost')" label-for="ea-smtp-host">
                <b-form-input id="ea-smtp-host" v-model="smtpHost" :disabled="!forSend" name="ea-smtp-host" size="sm" />
              </b-form-group>
            </b-col>
            <b-col md="2">
              <b-form-group horizontal :label-cols="5" :label="$t('email.smtpPort')" label-for="ea-smtp-port">
                <b-form-input id="ea-smtp-port" v-model="smtpPort" :disabled="!forSend" type="number" name="ea-smtp-port" size="sm" />
              </b-form-group>
            </b-col>
            <b-col md="2">
              <b-form-checkbox v-model="smtpTls" :disabled="!forSend" name="ea-smtp-tls" switch>
                {{ $t('email.smtpTls') }}
              </b-form-checkbox>
            </b-col>
            <b-col md="2">
              <b-form-checkbox v-model="storeSended" :disabled="!forSend" name="ea-store-sended" switch>
                {{ $t('email.storeSended') }}
              </b-form-checkbox>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12">
              <b-tabs content-class="mt-2">
                <b-tab :title="$t('route.users')">
                  <b-row class="mt-2">
                    <b-col md="12">
                      <b-table striped hover show-empty :items="users" :fields="usersFields" small :empty-text="$t('common.emptyUserList')">
                        <template v-slot:cell(isActive)="data">
                          <b-form-checkbox
                            v-if="data.item.isActive !== null"
                            v-model="data.item.isActive"
                            name="check-button"
                            :disabled="isGeneral === true"
                            switch
                            @change="changeUserSetting(data.item)"
                          ></b-form-checkbox>
                        </template>
                      </b-table>
                    </b-col>
                  </b-row>
                </b-tab>
                <b-tab v-if="forSend" :title="$t('email.signatures')">
                  <quill-editor ref="myQuillEditor" v-model="signatures" :options="editorOption" />
                </b-tab>
              </b-tabs>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </div>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations, mapActions } from 'vuex'
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

/**
 * Products Details component
 */
export default {
  name: 'EmailAccountDetail',
  page() {
    return { title: this.$t('route.emailAccount'), meta: [{ name: 'description', content: appConfig.description }] }
  },
  components: { Layout, PageHeader, quillEditor },
  data() {
    return {
      title: this.$t('route.emailAccount'),
      usersFields: [
        { key: 'name', label: 'Nazwa', sortable: false },
        { key: 'email', label: 'Email', sortable: false },
        { key: 'isActive', label: 'Dołączony', sortable: false },
      ],
      users: [],
      viewId: this.$route.params.id,
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
            [{ size: [false, '10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '32px', '36px'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: editorColors }, { background: editorColors }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image', 'video'],
          ],
        },
      },
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'emailAccounts/objectView',
      userList: 'users/getUsers',
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

    user: {
      get() {
        return this.objectView ? this.objectView.object.user : ''
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'user',
          value,
        })
      },
    },

    password: {
      get() {
        return this.objectView ? this.objectView.object.password : ''
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'password',
          value,
        })
      },
    },

    forReceive: {
      get() {
        return this.objectView ? this.objectView.object.forReceive : false
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'forReceive',
          value,
        })
      },
    },

    storeReceived: {
      get() {
        return this.objectView ? this.objectView.object.storeReceived : false
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'storeReceived',
          value,
        })
      },
    },

    forSend: {
      get() {
        return this.objectView ? this.objectView.object.forSend : false
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'forSend',
          value,
        })
      },
    },

    storeSended: {
      get() {
        return this.objectView ? this.objectView.object.storeSended : false
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'storeSended',
          value,
        })
      },
    },

    isActive: {
      get() {
        return this.objectView ? this.objectView.object.isActive : false
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'isActive',
          value,
        })
      },
    },

    isService: {
      get() {
        return this.objectView ? this.objectView.object.isService : false
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'isService',
          value,
        })
      },
    },

    storeFilesToHardDrive: {
      get() {
        return this.objectView ? this.objectView.object.storeFilesToHardDrive : false
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'storeFilesToHardDrive',
          value,
        })
      },
    },

    imapHost: {
      get() {
        return this.objectView ? this.objectView.object.imapHost : ''
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'imapHost',
          value,
        })
      },
    },

    imapPort: {
      get() {
        return this.objectView ? this.objectView.object.imapPort : ''
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'imapPort',
          value,
        })
      },
    },

    imapTls: {
      get() {
        return this.objectView ? this.objectView.object.imapTls : false
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'imapTls',
          value,
        })
      },
    },

    smtpHost: {
      get() {
        return this.objectView ? this.objectView.object.smtpHost : ''
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'smtpHost',
          value,
        })
      },
    },

    smtpPort: {
      get() {
        return this.objectView ? this.objectView.object.smtpPort : ''
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'smtpPort',
          value,
        })
      },
    },

    smtpTls: {
      get() {
        return this.objectView ? this.objectView.object.smtpTls : false
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'smtpTls',
          value,
        })
      },
    },

    isGeneral: {
      get() {
        return this.objectView ? this.objectView.object.isGeneral : ''
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'isGeneral',
          value,
        })
      },
    },

    signatures: {
      get() {
        return this.objectView ? this.objectView.object.signatures : ''
      },
      set(value) {
        this.setObjectProperty({
          viewId: this.viewId,
          property: 'signatures',
          value,
        })
      },
    },
  },

  async mounted() {
    this.fillUsers()
  },

  methods: {
    ...mapMutations({
      setObjectViewProperty: 'emailAccounts/setObjectViewProperty',
      setObjectProperty: 'emailAccounts/setObjectProperty',
      delObjectView: 'emailAccounts/delObjectView',
      addUser: 'emailAccounts/addObjectUser',
      removeUser: 'emailAccounts/removeObjectUser',
    }),

    ...mapActions({
      delTagView: 'tagsViews/delView',
    }),

    async fillUsers() {
      if (this.userList.length === 0) {
        await this.$store.dispatch('users/findAll', {})
      }

      this.users = []

      this.userList.forEach((user) => {
        this.users.push({
          userId: user.id,
          name: user.name,
          email: user.email,
          isActive: false,
        })
      })

      const users = this.objectView.object.users

      users.forEach((user) => {
        const foundUser = this.users.find((element) => element.userId === user.userId)
        if (foundUser) {
          foundUser.isActive = true
        }
      })
    },

    changeUserSetting(userData) {
      if (userData.isActive) {
        this.addUser({ viewId: this.viewId, userId: userData.userId })
      } else {
        this.removeUser({ viewId: this.viewId, userId: userData.userId })
      }
    },

    async writeObject() {
      let response
      if (this.objectView.object.isNew) {
        response = await this.$store.dispatch('emailAccounts/create', this.objectView.object)
      } else {
        response = await this.$store.dispatch('emailAccounts/update', this.objectView.object)
      }
      if (response.status === 200) {
        this.closeView()
      }
    },

    async closeView() {
      this.delTagView({ name: this.$route.name, path: this.$route.path })
      this.delObjectView(this.viewId)
      await this.$router.push({ name: 'email-accounts' })
    },
  },
}
</script>

<style>
.ql-picker-item[data-value='10px']::before,
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
</style>
