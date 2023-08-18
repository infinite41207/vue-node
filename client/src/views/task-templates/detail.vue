<template>
  <Layout>
    <PageHeader :title="title" />
    <div>
      <b-card>
        <b-card-header>
          <b-button-toolbar>
            <b-btn-group class="mt-2">
              <a href="javascript:void(0);" :disabled="readOnly" class="btn btn-info btn-sm" @click="closeTaskTemplate">
                <i class="ri-close-line"></i>
                {{ $t('commands.close') }}
              </a>
            </b-btn-group>
          </b-button-toolbar>
        </b-card-header>
        <b-card-body>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" content-cols="3" :label="$t('table.code')" label-for="template-code">
                <b-form-input id="template-code" :value="taskTemplate.code" name="template-code" size="sm" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.name')" label-for="template-name">
                <b-form-input id="template-name" :value="taskTemplate.name" name="template-name" size="sm" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.importance')" label-for="template-importance">
                <b-form-input id="template-importance" :value="taskTemplate.importance ? $t(`importance.${taskTemplate.importance}`) : ''" name="template-importance" size="sm" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.executorRole')" label-for="template-role">
                <b-form-input id="template-role" :value="getExecutorRoleName()" name="template-role" size="sm" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.executor')" label-for="template-executor">
                <b-form-input id="template-executor" :value="getExecutorName()" name="template-executor" size="sm" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="`${$t('table.executionPeriod')}:`" label-for="template-name">
                <b-row>
                  <b-col md="2">
                    <label for="template-days">{{ $t('common.days') }}</label>
                    <b-form-input id="template-days" type="number" :value="taskTemplate.executionDays" name="template-days" size="sm" />
                  </b-col>
                  <b-col md="2">
                    <label for="template-hours">{{ $t('common.hours') }}</label>
                    <b-form-input id="template-hours" type="number" :value="taskTemplate.executionHours" name="template-hours" size="sm" />
                  </b-col>
                  <b-col md="2">
                    <label for="template-minutes">{{ $t('common.minutes') }}</label>
                    <b-form-input id="template-minutes" type="number" :value="taskTemplate.executionMinutes" name="template-minutes" size="sm" />
                  </b-col>
                  <b-col class="mt-4">
                    <b-form-checkbox id="current-date" :value="taskTemplate.currentDateExecution" name="current-date">
                      {{ $t('common.executionToday') }}
                    </b-form-checkbox>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <b-form-group horizontal :label-cols="3" :label="$t('table.contents')" label-for="template-name">
                <b-form-textarea id="template-description" :value="taskTemplate.description" rows="5" max-rows="10"></b-form-textarea>
              </b-form-group>
            </b-col>
            <b-col md="6"> </b-col>
          </b-row>
          <b-row>
            <b-col md="2">
              <b-form-checkbox id="template-check-execution" :value="taskTemplate.сheckExecution" class="mt-2">
                {{ $t('table.сheckExecution') }}
              </b-form-checkbox>
            </b-col>
            <b-col md="4">
              <b-form-group horizontal :label-cols="3" :label="$t('table.checker')" label-for="template-checker">
                <b-form-input id="template-checker" :value="getCheckerName()" name="template-checker" size="sm" />
              </b-form-group>
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

/**
 * Task Template Details component
 */
export default {
  name: 'TaskTemplatesDetail',

  page() {
    return {
      title: this.$t('common.taskTemplatesData'),
      meta: [{ name: 'description', content: appConfig.description }],
    }
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: this.$t('common.taskTemplatesData'),
      readOnly: this.$route.meta.isReadOnly,
    }
  },

  computed: {
    ...mapGetters({
      taskTemplate: 'taskTemplates/openTaskTemplate',
    }),
  },

  methods: {
    ...mapMutations({
      setOpenTaskTemplate: 'taskTemplates/setOpenTaskTemplate',
    }),

    ...mapActions({
      delView: 'tagsViews/delView',
    }),

    async closeTaskTemplate() {
      await this.$router.push({ name: 'task-templates' })
      this.delView({ name: this.$route.name, path: this.$route.path })
      this.setOpenTaskTemplate({})
    },

    getExecutorRoleName() {
      return this.taskTemplate.executorRole ? this.taskTemplate.executorRole.name : ''
    },

    getExecutorName() {
      return this.taskTemplate.executor ? this.taskTemplate.executor.name : ''
    },

    getCheckerName() {
      return this.taskTemplate.checker ? this.taskTemplate.checker.name : ''
    },
  },
}
</script>
