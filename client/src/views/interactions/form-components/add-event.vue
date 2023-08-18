<template>
  <b-modal
    id="interaction-add-event"
    size="xl"
    :title="`${$t('interaction.addEvent')}`"
    :cancel-title="$t('commands.cancel')"
    no-close-on-backdrop
    :ok-title="`${$t('commands.add')}`"
    @ok="handleOk"
    @cancel="handleCancel"
    @close="handelClose"
  >
    <b-card>
      <b-row>
        <b-col cols="4">
          <b-row class="mt-1">
            <b-col>
              <b-form-group>
                <f-select v-model="newEvent.eventTypeRef" select-btn open-btn value-type="eventTypes" detail-view="event-type" placeholder="Typ wydarzenia...">
                </f-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group>
                <b-form-textarea rows="8" id="salesReferenceId" v-model="newEvent.name" size="sm"></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="8">
          <b-row class="mt-1">
            <b-col>
              <b-form-group horizontal :label-cols="2" label="Status">
                <f-select
                  v-model="newEvent.eventStatusRef"
                  size="sm"
                  select-btn
                  open-btn
                  value-type="eventStatuses"
                  detail-view="event-status"
                  placeholder="Wyszukaj status..."
                >
                </f-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group horizontal :label-cols="4" label="Początek wydarzenia">
                <date-picker id="begin" v-model="newEvent.begin" name="date" value-type="date" type="datetime" size="sm"></date-picker>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group horizontal :label-cols="3" label="Koniec wydarzenia">
                <date-picker id="ending" v-model="newEvent.ending" name="date" value-type="date" type="datetime" size="sm"></date-picker>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group horizontal :label-cols="2" label="Projekt">
                <f-select v-model="newEvent.projectRef" size="sm" select-btn open-btn value-type="projects" detail-view="project-detail" placeholder="Wyszukaj projekt..."> </f-select>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>
  </b-modal>

</template>

<script>
import { mapGetters } from 'vuex'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'

export default {
  name: 'InteractionAddEvent',

  components: {
    DatePicker,
  },

  props: {
    viewId: {
      type: String,
      require: true,
      default: null,
    },
  },

  data() {
    return {
      newEvent: {
        eventTypeRef: null,
        name: '',
        eventStatusRef: null,
        begin: '',
        ending: '',
        projectRef: null,
      },
    }
  },

  computed: {
    ...mapGetters({
      getObjectView: 'interactions/objectView',
    }),

    objectView() {
      return this.getObjectView(this.viewId)
    },

    object() {
      return this.objectView ? this.objectView.object : {}
    },
  },

  async mounted() {
    this.$bvModal.show('interaction-add-event')
    console.log('this.object', this.object);
    if (this.object) {
      this.newEvent.parentType = 'interaction';
      this.newEvent.parentId = this.object.id;
      this.newEvent.counterpartyId = this.object.customerId;
    }
  },

  methods: {
    async handleOk() {
      if (this.newEvent.eventTypeRef) {
        this.newEvent.eventTypeId = this.newEvent.eventTypeRef.id
      }
      if (this.newEvent.eventStatusRef) {
        this.newEvent.eventStatusId = this.newEvent.eventStatusRef.id
      }
      if (this.newEvent.projectRef) {
        this.newEvent.projectId = this.newEvent.projectRef.id
      }
      const response = await this.$store.dispatch('events/create', this.newEvent)
      console.log('updating event list', response );

      if (response.status === 200) {
        await this.$store.dispatch('interactions/findByPk', {
          viewId: this.viewId,
          params: {
            id: this.object.id,
          },
        })
        this.$emit('add-comment-end', undefined)
      }

    },

    handleCancel() {
      this.$emit('add-comment-end', undefined)
    },

    handelClose() {
      this.$emit('add-comment-end', undefined)
    },
  },
}
</script>

<style></style>
