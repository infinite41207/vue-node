<template>
  <b-modal
    v-model="value"
    title="Dodanie wagonu"
    header-class="pr-4 pl-4 border-bottom-0"
    title-class="text-black font-18"
    body-class="pt-3 pr-4 pl-4"
    centered
    @ok="onInputOK"
    @cancel="onCancel"
    @close="onClose"
  >
    <b-form-group horizontal :label-cols="3" :label="$t('table.vehicleWagon')" label-for="currentWagonRef">
      <f-select
        ref="currentWagonRef"
        v-model="currentWagon"
        select-btn
        open-btn
        add-btn
        value-type="vehicles"
        detail-view="vehicle-detail"
        placeholder="Wyszukaj wagon..."
        label="presentation"
        :filter="wagonFilter"
        autofocus
      >
      </f-select>
    </b-form-group>

    <b-form-group horizontal :label-cols="3" :label="$t('table.tare')" label-for="currentWagonTare">
      <b-form-input id="currentWagonTare" v-model="currentWagonTare" size="sm" type="number" step="0.001" min="0.000" max="50.000" class="form-control" />
    </b-form-group>
    <b-form-group horizontal :label-cols="3" :label="$t('table.loadCapacity')" label-for="currentWagonLoadCapacity">
      <b-form-input id="currentWagonLoadCapacity" v-model="currentWagonTare" size="sm" type="number" step="0.001" min="0.000" max="50.000" class="form-control" />
    </b-form-group>
  </b-modal>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      wagonFilter: { type: 'Carriage', markedToDelete: false },
      currentWagon: null,
      currentWagonTare: 0,
      currentLoadCapacity: 0,
    }
  },

  computed: {
    ...mapGetters({
      currentView: 'weightingScalesRailway/currentView',
    }),
  },

  watch: {
    currentWagon(newVal, oldVal) {
      this.currentWagonTare = newVal.tare
      this.currentLoadCapacity = newVal.loadCapacity
    },
  },

  mounted() {},

  async created() {},

  methods: {
    ...mapMutations({
      setListViewProperty: `weightingScalesRailway/setListViewProperty`,
    }),
    onInputOK(event) {
      if (this.currentWagon) {
        this.$emit('on-input-wagon', { wagonId: this.currentWagon.id, wagonTare: this.currentWagonTare })
      }

      this.$emit('input', false)
    },
    onClose() {
      console.log('onClose')
      this.value = false
      this.$emit('input', false)
    },
    onCancel() {
      console.log('onCancel')
      this.value = false
      this.$emit('input', false)
    },
  },
}
</script>

<style>
</style>