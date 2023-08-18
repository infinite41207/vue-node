<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col>
        <b-card no-body>
          <b-card-header class="pb-0">
            <b-row>
              <b-col>
                <b-input-group>
                  <b-form-select
                    id="inbox-ea"
                    :value="emailAccount"
                    :options="emailAccounts"
                    text-field="name"
                    value-field="id"
                    name="inbox-ea"
                    size="sm"
                    @change="onChangeEmailAccount"
                  >
                    <template #first>
                      <b-form-select-option :value="null" disabled>{{ $t('email.selectEmailAccount') }}</b-form-select-option>
                    </template>
                  </b-form-select>
                  <b-input-group-append>
                    <b-button variant="outline-secondary" size="sm" :disabled="!emailAccount" @click="clearEmailAccount">
                      <i class="ri-close-line"></i>
                    </b-button>
                    <b-button variant="outline-secondary" size="sm" :disabled="!emailAccount" @click="refreshList">
                      <i class="ri-refresh-line"></i>
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-col>
              <b-col>
                <f-select
                  v-model="filterCounterparty"
                  select-btn
                  open-btn
                  value-type="counterparties"
                  detail-view="counterparties-detail"
                  placeholder="Wyszukaj kontrahenta..."
                ></f-select>
              </b-col>
              <b-col>
                <b-input-group>
                  <b-input-group-prepend>
                    <b-dropdown ref="searchSettings" size="sm" no-caret :disabled="onlineMode" variant="outline-secondary">
                      <template v-slot:button-content>
                        <i class="ri-equalizer-fill"></i>
                      </template>
                      <b-dropdown-form class="search-settings-form">
                        <b-form-group :label="$t('email.from')" horizontal :label-cols="2" label-for="filter-email-from">
                          <b-form-input id="filter-email-from" v-model="filterFrom" size="sm" placeholder="email@example.com" @keydown.enter.prevent="onSearch"></b-form-input>
                        </b-form-group>
                        <b-form-group :label="$t('email.to')" horizontal :label-cols="2" label-for="filter-email-to">
                          <b-form-input id="filter-email-to" v-model="filterTo" size="sm" placeholder="email@example.com" @keydown.enter.prevent="onSearch"></b-form-input>
                        </b-form-group>
                        <b-form-group :label="$t('email.subject')" horizontal :label-cols="2" label-for="filter-email-subject">
                          <b-form-input id="filter-email-search" v-model="filterSubject" size="sm" @keydown.enter.prevent="onSearch"></b-form-input>
                        </b-form-group>
                        <b-form-group :label="$t('table.contents')" horizontal :label-cols="2" label-for="filter-email-body">
                          <b-form-input id="filter-email-body" v-model="filterBody" size="sm" @keydown.enter.prevent="onSearch"></b-form-input>
                        </b-form-group>
                        <b-form-group :label="$t('common.containsWords')" horizontal :label-cols="2" label-for="filter-email-search">
                          <b-form-input id="filter-email-search" v-model="filterSearchStr" size="sm" @keydown.enter.prevent="onSearch"></b-form-input>
                        </b-form-group>
                        <b-form-group :label="$t('table.period')" horizontal :label-cols="2" label-for="filter-email-period" @submit.stop.prevent>
                          <date-picker v-model="filterPeriod" range type="date" range-separator="-" format="DD.MM.YYYY" :lang="dateLang" show-week-number size="sm"></date-picker>
                        </b-form-group>
                        <b-form-group :label="$t('table.links')" horizontal :label-cols="3" label-for="filter-has-links">
                          <b-form-radio-group
                            id="filter-has-links"
                            v-model="filterHasLinks"
                            :options="hasLinksVariants"
                            name="filter-has-links"
                            button-variant="outline-secondary"
                            size="sm"
                            buttons
                          ></b-form-radio-group>
                        </b-form-group>
                        <b-form-group :label="$t('table.processed')" horizontal :label-cols="3" label-for="filter-processed">
                          <b-form-radio-group
                            id="filter-processed"
                            v-model="filterProcessed"
                            :options="hasProcessedVariants"
                            name="filter-processed"
                            button-variant="outline-secondary"
                            size="sm"
                            buttons
                          ></b-form-radio-group>
                        </b-form-group>
                        <b-button variant="primary" class="float-md-right" size="sm" @click="onSearch">{{ $t('commands.search') }}</b-button>
                      </b-dropdown-form>
                    </b-dropdown>
                  </b-input-group-prepend>

                  <b-form-input
                    id="filter-input"
                    v-model="searchCommon"
                    type="search"
                    autofocus
                    size="sm"
                    :disabled="onlineMode"
                    :placeholder="`${$t('commands.search')}...`"
                    @keydown.enter.prevent="refreshList"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button size="sm" :disabled="onlineMode" variant="outline-secondary" @click="refreshList">
                      <i class="ri-search-line"></i>
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-col>
            </b-row>
          </b-card-header>
          <b-card-body>
            <!-- Left sidebar -->
            <div class="page-aside-left">
              <b-button class="btn btn-success" size="sm" @click="newEmail">
                <i class="ri-add-line"></i>
                {{ $t('email.newMessage') }}
              </b-button>

              <div class="email-menu-list mt-3">
                <a
                  v-for="(box, index) of boxes"
                  :key="index"
                  href="javascript: void(0);"
                  class="font-weight-bold"
                  :class="{ 'selected-box': currentBox?.path === box.path }"
                  @click="setCurrentBox({ name: box.name, path: box.path, id: box.id })"
                >
                  <i class="mr-2" :class="box.icon"></i>{{ box.title ? $t(`email.${box.title}`) : box.name }}
                </a>
              </div>
              <h5>{{ $t('email.labels') }}</h5>
              <div v-if="emailAccount" class="email-menu-list mt-1">
                <a
                  v-for="(label, index) of labels"
                  :key="index"
                  href="javascript: void(0);"
                  class="font-weight-bold"
                  :class="{ 'selected-box': currentLabel === label.name }"
                  @click="setCurrentLabel(label)"
                >
                  <i class="ri-price-tag-3-line mr-2"></i>{{ label.name }}
                </a>
              </div>
            </div>
            <!-- end Left sidebar -->

            <div class="page-aside-right">
              <Toolbar :selected-emails="selectedEmails" :labels="labels" @refresh-list="refreshList" @check-emails="checkEmails" />

              <div class="mt-1">
                <ul v-if="!loading" class="email-list">
                  <li v-for="(email, index) in list" :key="index" :class="{ unread: `${email.unseen}` === 'true' }">
                    <div class="email-sender-info">
                      <div class="checkbox-wrapper-mail">
                        <div class="custom-control custom-checkbox">
                          <input :id="`mail${index}`" v-model="selectedEmails" :value="email" type="checkbox" class="custom-control-input" />
                          <label class="custom-control-label" :for="`mail${index}`"></label>
                        </div>
                      </div>
                      <span class="star-toggle ri-star-line mt-2"></span>
                      <a v-if="email.links.length > 0" class="ml-2 email-connection" :class="getLinkStyle(email.linkType)" @click="openEmailLinks(email)">
                        <b-badge variant="success">{{ email.links.length }}</b-badge>
                        <!-- <i class="ri-file-list-2-line-edit"></i> -->
                      </a>
                      <a href="javascript: void(0);" class="email-title" @click="openEmail(email)">{{ emailType === 'OUTGOING' ? email.to : email.from.text }}</a>
                    </div>
                    <div class="email-content">
                      <a href="javascript: void(0);" class="email-subject" @click="openEmail(email)">{{ email.subject }}</a>
                      <a href="javascript: void(0);" class="email-date" @click="openEmail(email)">{{ getFormatedDate(email.date) }}</a>
                    </div>
                    <div class="email-action-icons">
                      <ul class="list-inline">
                        <li class="list-inline-item">
                          <a href="javascript: void(0);">
                            <i class="ri-mail-open-line email-action-icons-item" @click="openEmail(email)"></i>
                          </a>
                        </li>
                        <li class="list-inline-item">
                          <a href="javascript: void(0);" @click="moveTo('Junk')">
                            <i class="ri-spam-line email-action-icons-item"></i>
                          </a>
                        </li>
                        <li class="list-inline-item" @click="moveTo('Trash')">
                          <a href="javascript: void(0);">
                            <i class="ri-delete-bin-line email-action-icons-item"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <div v-if="list.length === 0" class="text-center py-2"> {{ $t('email.noEmails') }} </div>
                </ul>
                <b-card-body v-if="loading">
                  <b-row class="b-spin">
                    <b-col>
                      <b-spinner variant="info" />
                    </b-col>
                  </b-row>
                </b-card-body>
                <div class="row justify-content-md-between align-items-md-center">
                  <div class="col-xl-7">{{ $t('email.shown') }} {{ startIndex }} - {{ endIndex }} z {{ mailboxView.total }}</div>
                  <!-- end col-->
                  <div class="col-xl-5">
                    <!-- pagination -->
                    <div class="text-md-right float-md-right mt-2">
                      <b-pagination v-model="currentPage" :total-rows="mailboxView.total" :per-page="mailboxView.limit"></b-pagination>
                    </div>
                    <!-- end pagination -->
                  </div>
                  <!-- end col-->
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <Loading v-if="loadingEmail" @closed-loading="closedLoading" />
    <NewEmail v-if="sendEmailMode" @send-email-end="sendEmailEnd" />
    <LinkedDocs v-if="showEmailLinks" :email="currentEmail" :email-account-id="emailAccount" :email-type="emailType" @linked-docs-closed="openEmailLinksEnd" />
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapMutations } from 'vuex'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/pl'
import Toolbar from './toolbar'
import moment from 'moment'
import Loading from '@/components/common/loading'
import NewEmail from '@/views/mailbox/outgoing-email/new-email'
import LinkedDocs from '../components/linkedDocs.vue'

export default {
  name: 'MailboxInbox',
  page: {
    title: 'Inbox',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    // VueSimplemde,
    Layout,
    PageHeader,
    Toolbar,
    DatePicker,
    NewEmail,
    Loading,
    LinkedDocs,
  },
  data() {
    return {
      dateLang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: false,
      },
      emailAccounts: [],
      selectedEmails: [],
      hasLinksVariants: [
        { text: this.$t('email.all'), value: null },
        { text: this.$t('email.withLinks'), value: true },
        { text: this.$t('email.withoutLinks'), value: false },
      ],
      hasProcessedVariants: [
        { text: this.$t('email.all'), value: null },
        { text: this.$t('email.processed'), value: true },
        { text: this.$t('email.notProcessed'), value: false },
      ],
      showModal: false,
      content: '',
      sendEmailMode: false,
      showEmailLinks: false,
      currentEmail: { id: null, uid: null },
      loading: false,
      loadingEmail: false,
      startIndex: 1,
      endIndex: 1,
      labels: [],
    }
  },
  computed: {
    ...mapGetters({
      emailAccount: 'mailbox/emailAccount',
      list: 'mailbox/mailboxViewList',
      boxes: 'mailbox/mailboxViewBoxes',
      mailboxView: 'mailbox/mailboxView',
      currentBox: 'mailbox/mailboxViewCurrentBox',
      currentLabel: 'mailbox/mailboxViewCurrentLabel',
      filters: 'mailbox/mailboxViewFilters',
    }),

    currentPage: {
      get() {
        return this.mailboxView.page
      },
      set(value) {
        this.onPageChange(value)
      },
    },

    onlineMode() {
      return this.mailboxView.onlineMode
    },

    title() {
      return `${this.$t('route.mailbox')} ${this.onlineMode ? `(${this.$t('email.onLineMode')})` : ''}`
    },

    emailType() {
      return this.currentBox.name === 'Sent' && this.currentBox?.name === 'Drafts' ? 'OUTGOING' : 'INCOMING'
    },

    filterSearchStr: {
      get() {
        return this.filters.searchStr
      },
      set(value) {
        this.setFilter({ searchStr: value })
      },
    },

    filterCounterparty: {
      get() {
        return this.filters.counterparty
      },
      set(value) {
        this.setFilter({ counterparty: value })
        this.refreshList()
      },
    },

    filterPeriod: {
      get() {
        return this.filters.period
      },
      set(value) {
        this.setFilter({ period: value })
      },
    },

    filterFrom: {
      get() {
        return this.filters.from
      },
      set(value) {
        this.setFilter({ from: value })
      },
    },

    filterTo: {
      get() {
        return this.filters.to
      },
      set(value) {
        this.setFilter({ to: value })
      },
    },

    filterSubject: {
      get() {
        return this.filters.subject
      },
      set(value) {
        this.setFilter({ subject: value })
      },
    },
    filterBody: {
      get() {
        return this.filters.body
      },
      set(value) {
        this.setFilter({ body: value })
      },
    },

    filterHasLinks: {
      get() {
        return this.filters.hasLinks
      },
      set(value) {
        this.updateFilter({ hasLinks: value })
      },
    },

    filterProcessed: {
      get() {
        return this.filters.processed
      },
      set(value) {
        this.updateFilter({ processed: value })
      },
    },

    searchCommon: {
      get() {
        let filter = ''

        if (this.filterFrom) {
          if (this.filterFrom.indexOf(' ') > -1) {
            filter += `from:(${this.filterFrom})`
          } else {
            filter += `from:${this.filterFrom}`
          }
        }

        if (this.filterTo) {
          if (this.filterTo.indexOf(' ') > -1) {
            filter += ` to:(${this.filterTo})`
          } else {
            filter += ` to:${this.filterTo}`
          }
        }

        if (this.filterSubject) {
          if (this.filterSubject.indexOf(' ') > -1) {
            filter += ` subject:(${this.filterSubject})`
          } else {
            filter += ` subject:${this.filterSubject}`
          }
        }

        if (this.filterBody) {
          if (this.filterBody.indexOf(' ') > -1) {
            filter += ` body:(${this.filterBody})`
          } else {
            filter += ` body:${this.filterBody}`
          }
        }

        if (this.filterSearchStr) {
          filter += ` ${this.filterSearchStr}`
        }

        if (this.filterPeriod[0]) {
          filter += ` after:${moment(this.filterPeriod[0]).format('DD.MM.YYYY')}`
        }

        if (this.filterPeriod[1]) {
          filter += ` before:${moment(this.filterPeriod[1]).format('DD.MM.YYYY')}`
        }

        return filter.trim()
      },
      set(value) {
        this.parseFilters(value)
      },
    },
  },

  async created() {
    this.startIndex = 0
    this.endIndex = this.mailboxView.limit

    await this.initialize()
  },

  methods: {
    ...mapMutations({
      setEmailAccount: 'mailbox/setEmailAccount',
      setMailboxProperty: 'mailbox/setMailboxProperty',
      setFilter: 'mailbox/setFilters',
      resetMailmox: 'mailbox/resetState',
    }),
    getFormatedDate(curDate) {
      return moment(curDate).format('DD.MM.YYYY HH:mm')
    },

    async initialize() {
      const payload = {
        noCommit: true,
        params: {
          filter: {
            isActive: true,
          },
        },
      }

      const response = await this.$store.dispatch('emailAccounts/findAll', payload)

      if (response.status === 200) {
        this.emailAccounts = response.data
      }

      this.updateEmailList()
      this.initLabels()
    },

    async onChangeEmailAccount(value) {
      this.setEmailAccount(value)

      const emailAccount = this.emailAccounts.find((el) => el.id === value)

      if (emailAccount) {
        this.setMailboxProperty({ onlineMode: emailAccount.storeReceived !== true })
      }

      await this.getEmailAccountBoxes()
      this.updateEmailList()
    },

    clearEmailAccount() {
      this.resetMailmox()
      this.selectedEmails = []
      this.startIndex = 1
      this.endIndex = 1
    },

    setCurrentBox(box) {
      if (this.loading === true) {
        return
      }

      this.setMailboxProperty({ currentBox: box })
      this.refreshList()
    },

    setCurrentLabel(label) {
      this.setMailboxProperty({ currentLabel: this.currentLabel === label.name ? null : label.name })
      this.refreshList()
    },

    initLabels() {
      this.$store
        .dispatch('emailLabels/findAll', { noCommit: true })
        .then((response) => {
          this.labels = response.data
        })
        .catch((error) => {
          console.error(error)
        })
    },

    async moveTo(boxName) {
      const boxTo = this.boxes.find((el) => {
        return el.name === boxName
      })

      if (!boxTo) {
        return
      }

      await this.$store
        .dispatch('mailbox/moveEmail', {
          emailAccountId: this.emailAccount,
          emailUid: this.selectedEmails.map((el) => {
            return el.uid
          }),
          boxFrom: { name: this.currentBox?.name, path: this.currentBox?.path, id: this.currentBox?.id },
          boxTo: { name: boxTo.name, path: boxTo.path, id: boxTo.id },
        })
        .then((response) => {
          this.$bvToast.toast(this.$t('email.emailMoved'), {
            title: this.$t('common.msg'),
            variant: 'success',
            solid: true,
            autoHideDelay: 2000,
          })
        })
        .catch((error) => {
          console.error(error)
          this.$bvToast.toast(this.$t('common.processingError'), {
            title: this.$t('common.msg'),
            variant: 'danger',
            solid: true,
            autoHideDelay: 2000,
          })
        })

      this.refreshList()
    },

    onSearch() {
      this.$refs.searchSettings.hide(true)
      this.refreshList()
    },

    updateFilter(filter) {
      this.setFilter(filter)
      this.refreshList()
    },

    parseFilters(value) {
      if (value === '') {
        this.clearFilters()
        return
      }

      const filters = value.split(' ')

      const newFilters = {
        from: '',
        to: '',
        subject: '',
        body: '',
        searchStr: '',
        period: [null, null],
      }

      const dateReg = new RegExp('^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)[0-9]{2}$')

      let emptyPeriod = false

      for (const filterPart of filters) {
        const filter = filterPart.split(':')
        if (filter.length === 2) {
          if (filter[0] === 'from') {
            newFilters.from = filter[1]
          } else if (filter[0] === 'to') {
            newFilters.to = filter[1]
          } else if (filter[0] === 'subject') {
            newFilters.subject = filter[1]
          } else if (filter[0] === 'body') {
            newFilters.body = filter[1]
          } else if (filter[0] === 'after') {
            if (filter[1] !== '' && filter[1].match(dateReg)) {
              newFilters.period[0] = this.filterPeriod[0]
            } else {
              emptyPeriod = true
            }
          } else if (filter[0] === 'before') {
            if (filter[1] !== '' && filter[1].match(dateReg)) {
              newFilters.period[1] = this.filterPeriod[1]
            } else {
              emptyPeriod = true
            }
          } else {
            newFilters.searchStr += ` ${filterPart}`
          }
        } else {
          newFilters.searchStr += ` ${filterPart}`
        }
      }

      newFilters.searchStr = newFilters.searchStr.trim()

      if (emptyPeriod === true) {
        newFilters.period = [null, null]
      }

      this.setFilter(newFilters)
    },

    clearFilters() {
      this.setFilter({ searchStr: '', from: '', to: '', subject: '', body: '', period: [null, null] })
      this.refreshList()
    },

    checkEmails(param) {
      this.selectedEmails = []

      if (param === 'all') {
        for (const email of this.list) {
          const exist = this.selectedEmails.find((el) => {
            return el.id === email.id
          })

          if (!exist) {
            this.selectedEmails.push({ ...email })
          }
        }
      } else if (param === 'seen') {
        const seenList = this.list.filter((el) => el.unseen === false)

        for (const email of seenList) {
          const exist = this.selectedEmails.find((el) => {
            return el.id === email.id
          })

          if (!exist) {
            this.selectedEmails.push({ ...email })
          }
        }
      } else if (param === 'unseen') {
        const unseenList = this.list.filter((el) => el.unseen === true)

        for (const email of unseenList) {
          const exist = this.selectedEmails.find((el) => {
            return el.id === email.id
          })

          if (!exist) {
            this.selectedEmails.push({ ...email })
          }
        }
      }
    },

    async openEmail(email) {
      let response
      this.loadingEmail = true

      if (this.currentBox.name === 'Sent' || this.currentBox.name === 'Drafts') {
        response = await this.$store.dispatch('outgoingEmails/findByPk', {
          params: {
            id: email.id,
            emailAccountId: this.emailAccount,
          },
        })

        if (response) {
          this.$router.push({ name: 'outgoing-email-details', params: { id: email.id } })
        }
      } else {
        if (email.seqno) {
          response = await this.$store.dispatch('mailbox/findBySeq', {
            params: {
              id: Number(email.seqno),
              emailAccountId: this.emailAccount,
            },
          })
        } else {
          response = await this.$store.dispatch('mailbox/findByPk', {
            params: {
              id: email.id,
              emailAccountId: this.emailAccount,
            },
          })
        }

        if (response) {
          this.$router.push({ name: 'incoming-email-details' })
        }
      }

      this.loadingEmail = false
    },

    closedLoading() {
      this.loadingEmail = false
    },

    openEmailLinks(email) {
      if (this.emailType === 'OUTGOING') {
        this.currentEmail = { id: email.id, uid: null }
      } else {
        this.currentEmail = { id: email.id, uid: email.uid }
      }

      this.showEmailLinks = true
    },

    openEmailLinksEnd() {
      this.currentEmail = { id: null, uid: null }
      this.showEmailLinks = false
    },

    newEmail() {
      this.sendEmailMode = true
    },

    async onPageChange(page) {
      this.setMailboxProperty({ page })
      this.updateEmailList()
    },

    async getEmailAccountBoxes() {
      if (this.emailAccount !== null) {
        this.loading = true
        await this.$store
          .dispatch('mailbox/getMailboxes', {
            params: {
              emailAccountId: this.emailAccount,
            },
          })
          .then(() => {
            if (this.boxes && !this.currentBox) {
              const currentBox = this.boxes.find((el) => {
                return el.path == 'INBOX'
              })

              if (currentBox) {
                this.setMailboxProperty({ currentBox: { name: currentBox.name, path: currentBox.path, id: currentBox.id } })
              }
            }
          })

        this.loading = false
      }
    },

    async updateEmailList() {
      if (this.emailAccount !== null && this.currentBox !== null) {
        this.loading = true
        const filter = {}

        if (this.currentBox.name === 'Drafts') {
          filter.sended = false
        } else if (this.currentBox.name === 'Sent') {
          filter.sended = true
        }

        if (this.filters) {
          if (this.filters.searchStr !== '') {
            filter.searchStr = this.filters.searchStr
          }

          if (this.filters.from !== '') {
            filter.from = this.filters.from
          }

          if (this.filters.to !== '') {
            filter.to = this.filters.to
          }

          if (this.filters.subject !== '') {
            filter.subject = this.filters.subject
          }

          if (this.filters.body !== '') {
            filter.body = this.filters.body
          }

          if (this.filters.hasLinks !== null) {
            filter.hasLinks = this.filters.hasLinks
          }

          if (this.filters.processed !== null) {
            filter.processed = this.filters.processed
          }

          if (this.filters.period[0] !== null && this.filters.period[1]) {
            filter.period = this.filters.period
          }

          if (this.filters.counterparty !== null) {
            filter.counterpartyId = this.filters.counterparty.id
          }

          if (this.currentLabel) {
            filter.labels = this.currentLabel
          }
        }

        const mailbox = this.boxes.find((el) => {
          return el.name == this.currentBox.name
        })

        if (!mailbox) {
          this.loading = false
          return
        }

        await this.$store
          .dispatch('mailbox/findAll', {
            params: {
              emailAccountId: this.emailAccount,
              box: { name: mailbox.name, path: mailbox.path, id: mailbox.id },
              page: Number(this.currentPage),
              limit: Number(this.mailboxView.limit),
              filter,
            },
          })
          .catch((error) => {
            console.error(error)
            this.loading = false
          })

        this.setStartEndIndexes()

        this.loading = false
      }
    },

    refreshList() {
      this.selectedEmails = []
      this.getEmailAccountBoxes()
      this.updateEmailList()
    },

    setStartEndIndexes() {
      this.startIndex = (this.currentPage - 1) * this.mailboxView.limit + 1
      this.endIndex = (this.currentPage - 1) * this.mailboxView.limit + this.mailboxView.limit

      if (this.endIndex > this.mailboxView.total) {
        this.endIndex = this.mailboxView.total
      }
    },

    async sendEmailEnd(emailData) {
      this.sendEmailMode = false
    },

    getLinkStyle(linkType) {
      if (linkType === 'customerRequest') {
        return 'text-success'
      }

      if (linkType === 'reclamation') {
        return 'text-danger'
      }

      return 'text-warning'
    },
  },
}
</script>

<style>
.email-connection {
  display: block;
  float: left;
}

.b-spin {
  text-align: center;
}

.selected-box {
  background-color: cornsilk;
}

.search-settings-form {
  width: 600px;
}
</style>
