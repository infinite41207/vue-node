<template>
  <div>
    <!-- Right Sidebar -->
    <div v-click-outside="config" class="right-bar">
      <!-- <div class="rightbar-title">
        <h5 class="m-0">{{ $t('timeTracking.title') }}</h5>
        <a href="javascript:void(0);" @click="hide">
          <i class="ri-close-line noti-icon"></i>
        </a>
      </div> -->

      <simplebar class="h-100 rightbar-content">
        <div class="p-3">
          <b-card v-for="item in listView.list" :key="item.id" :style="{ 'background-color': 'papayawhip' }">
            <a href="javascript:void(0);" @click="editTimeTrackingItem(item)"> {{ getObjectPresentation(item) }}</a>
            <b-card-text>
              <b-row>
                <b-col cols="7">
                  <b-row>
                    <b> {{ getObjectReference(item) }}</b>
                  </b-row>
                  <b-row> Początek: {{ getDatePresentation(item.startDate) }} </b-row>
                  <b-row>
                    {{ item.comment }}
                  </b-row>
                </b-col>
                <b-col>
                  <b-row :style="{ 'text-align': 'center' }">                     
                    <h1> {{ item.timeDiff }} </h1>
                  </b-row>
                  <b-row>
                    <!-- <b-button variant="secondary" class="ml-2" @click="stopTimer(item)">Zatrzymaj</b-button> -->
                    <b-button variant="success" class="ml-2" @click="stopTimer(item)">Zamknij</b-button>                  
                  </b-row>
                </b-col>
              </b-row>
            </b-card-text>
          </b-card>
        </div>
        <!-- end padding-->
      </simplebar>
    </div>

    <div class="rightbar-overlay"> </div>
    <!-- /Right-bar -->
  </div>
</template>

<script>
import simplebar from 'simplebar-vue'
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
import _ from 'lodash'

export default {
  components: { simplebar },

  data() {
    return {
      config: {
        handler: this.handleRightBarClick,
        middleware: this.middleware,
        events: ['click'],
      },
    }
  },

  async mounted() {
    setInterval(await this.updateTimeDiffs, 1000)
    await this.updateTimeTrackingObjects()
  },

  computed: {
    ...mapGetters({
      listView: 'objectsTimeTracking/listView',
    }),
  },
  methods: {
    hide() {
      document.body.classList.toggle('right-bar-enabled')
    },
    handleRightBarClick(e, el) {
      document.body.classList.remove('right-bar-enabled')
    },
    middleware(event, el) {
      return !event.target.classList.contains('toggle-right')
    },

    async updateTimeTrackingObjects() {
      await this.$store.dispatch('objectsTimeTracking/getCurrentObjects')
    },

    getDatePresentation(currentDate) {
      return moment(currentDate).format('DD.MM.YYYY HH:mm:ss')
    },

    async editTimeTrackingItem(trackingObject) {
      if (trackingObject.objectType === 'interaction') {
        await this.editInteraction(trackingObject.objectId)
      }
    },

    getObjectPresentation(trackingObject) {
      if (trackingObject.objectType === 'interaction') {
        return 'Interakcja ' + trackingObject.objectData.numberStr
      } else {
        return 'undefined'
      }
    },

    getObjectReference(trackingObject) {
      if (trackingObject.objectType === 'interaction') {
        return trackingObject.objectData.reference
      } else {
        return 'undefined'
      }
    },

    calculateTimeDiff(startDateParam) {
      let start = moment(startDateParam).format('HH:mm:ss')
      let end = moment(new Date()).format('HH:mm:ss')
      start = start.split(':')
      end = end.split(':')
      const startDate = new Date(0, 0, 0, start[0], start[1], 0)
      const endDate = new Date(0, 0, 0, end[0], end[1], 0)
      let diff = endDate.getTime() - startDate.getTime()
      let hours = Math.floor(diff / 1000 / 60 / 60)

      diff -= hours * 1000 * 60 * 60
      const minutes = Math.floor(diff / 1000 / 60)
      const seconds = Math.floor(diff / 1000 / 60 / 60)

      if (hours < 0) hours = hours + 24

      return (hours <= 9 ? '0' : '') + hours + ':' + (minutes <= 9 ? '0' : '') + minutes
    },

    async updateTimeDiffs() {
      const currentList = _.cloneDeep(this.listView.list)
      for (const row of currentList) {
        row.timeDiff = this.calculateTimeDiff(row.startDate)
      }
      await this.$store.dispatch('objectsTimeTracking/updateObjectList', { params: { list: currentList } })
    },

    async stopTimer(trackingObject) {
      const params = {
        id: trackingObject.id,
        updatedAt: trackingObject.updatedAt,
        endDate: new Date(),
      }
      await this.$store.dispatch('objectsTimeTracking/update', params)
      await this.updateTimeTrackingObjects()
    },

    async editInteraction(objectId) {
      const response = await this.$store.dispatch('interactions/findByPk', {
        params: {
          id: objectId,
        },
      })
      if (response.status === 200) {
        this.$router.push({ name: 'interaction-detail', params: { id: objectId } })
      }
    },
  },
}
</script>

<style lang="scss">
.my-custom-class {
  background-color: red;
}
</style>
