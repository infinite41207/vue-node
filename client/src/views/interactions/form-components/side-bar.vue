<template>
  <div class="card">
    <div class="card-header">
      <b-media class="mb-3" no-body>
        <b-media-body class="d-flex align-items-start justify-content-between">
          <b-button variant="outline-secondary" class="ml-1" @click="setMode('edit')" @contextmenu.prevent="openMenuEditNumber($event)">
            <i class="ri-edit-box-line"></i> {{ object.numberStr }} wersja {{ object.version }}
          </b-button>
          <ul v-show="visibleMenu" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
            <li @click="editNumber"> Edytuj numer </li>
          </ul>
          <b-dropdown class="text-muted" variant="black" right toggle-class="arrow-none card-drop p-0">
            <template v-slot:button-content>
              <i class="ri-more-line"></i>
            </template>

            <a href="javascript:void(0);" class="dropdown-item" @click="addNewVersion"><i class="ri-add-box-line mr-1 text-success"></i>Dodaj nową wersję</a>
            <a href="javascript:void(0);" class="dropdown-item" @click="setMode('versionHistory')"><i class="ri-file-copy-2-line mr-1 text-primary"></i>Historia wersji</a>
            <a href="javascript:void(0);" class="dropdown-item" @click="setActive"
              ><i class="ri-toggle-line mr-1 text-secondary"></i>{{ object.state === 'Active' ? 'Anuluj' : 'Aktywuj' }}</a
            >
          </b-dropdown>
        </b-media-body>
      </b-media>
      <b-row no-gutters class="flex-column flex-sm-row flex-lg-column">
        <b-row class="mb-2 mr-1 mr-lg-0">
          <b-col>
            <p class="mb-0"> Aktualny status: </p>
            <b>{{ object.status ? object.status.name : '' }}</b>
          </b-col>
        </b-row>
        <b-row class="mb-2 mr-1 mr-lg-0">
          <b-col>
            <p class="mb-0">
              Klient: <br />
              <b>{{ object.customer ? object.customer.name : 'nie wskazany' }}</b>
            </p>
          </b-col>
        </b-row>
        <b-row class="mb-2 mr-1 mr-lg-0">
          <b-col>
            <p class="mb-0">
              {{ $t('table.manager') }}: <br />
              <b>{{ object.manager ? object.manager.name : '' }}</b>
            </p>
          </b-col>
        </b-row>
        <b-row class="mb-2 mr-1 mr-lg-0">
          <b-col>
            <p class="mb-0">
              Data przyjęcia: <br />
              <b>{{ object.createdAt }}</b>
            </p>
          </b-col>
        </b-row>
        <b-row class="mb-2 mr-1 mr-lg-0">
          <b-col>
            <p class="mb-0">
              Referencja: <br />
              <b>{{ object.reference }}</b>
            </p>
          </b-col>
        </b-row>
        <b-row class="mb-2 mr-1 mr-lg-0">
          <b-col>
            <p class="mb-0">
              Wykonawca: <br />
              <b>{{ object.executor ? object.executor.name : '' }}</b>
            </p>
          </b-col>
        </b-row>
        <b-row class="mb-2 mr-1 mr-lg-0">
          <b-col>
            <p class="mb-0">
              Termin wykonania: <br />
              <b>{{ formatDate(object.executionTerm) }}</b>
            </p>
          </b-col>
        </b-row>
        <b-row class="mb-2 mr-1 mr-lg-0">
          <b-col>
            <p class="mb-0">
              Autor: <br />
              <b>{{ object.author ? object.author.name : '' }}</b>
            </p>
          </b-col>
        </b-row>
      </b-row>
    </div>

    <b-modal v-model="editNumberMode" title="Edycja numeru interakcji!">
      <div>
        <label for="docNumber">Numer interakcji</label>
        <b-form-input id="docNumber" v-model="newNumber" type="number" placeholder="Wprowadż numer"></b-form-input>
      </div>

      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button-toolbar class="float-right">
            <b-button variant="success" size="sm" @click="confirmNumberModification"> OK </b-button>
          </b-button-toolbar>
        </div>
      </template>
    </b-modal>

    <EditItem v-if="viewMode === 'edit'" :view-id="viewId" @edit-end="setModeEnd" />

    <VersionsHistory v-if="viewMode === 'versionHistory'" :version-uuid="object.versionUuid" @version-history-end="setModeEnd" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
import EditItem from '@/views/interactions/form-components/edit-item'
import VersionsHistory from '@/views/interactions/form-components/versions-history'
import Interaction from '@/dto/Interaction.json'
import { uuid } from 'vue-uuid'
import _ from 'lodash'

const zeroPad = (num, places) => String(num).padStart(places, '0')

export default {
  name: 'InteractionSideBar',

  components: {
    VersionsHistory,
    EditItem,
  },

  data() {
    return {
      visibleMenu: false,
      viewMode: '',
      editNumberMode: false,
      newNumber: 0,
      top: 0,
      left: 0,
      viewId: this.$route.params.id,
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

  watch: {
    visibleMenu(newValue, oldValue) {
      if (newValue) {
        document.body.addEventListener('click', this.closeEditNumberMenu)
      } else {
        document.body.removeEventListener('click', this.closeEditNumberMenu)
      }
    },
  },

  methods: {
    ...mapMutations({
      addObjectView: 'interactions/addObjectView',
      setObjectViewProperty: 'interactions/setObjectViewProperty',
      setObjectViewProperties: 'interactions/setObjectViewProperties',
      setObjectProperty: 'interactions/setObjectProperty',
    }),

    openMenuEditNumber(e) {
      this.left = e.layerX + 10
      this.top = e.layerY
      this.visibleMenu = true
    },

    editNumber() {
      this.editNumberMode = true
      this.newNumber = this.object.number
    },

    async confirmNumberModification() {
      this.editNumberMode = false

      const oldNumber = zeroPad(this.object.number, 5)
      const newNumber = zeroPad(this.newNumber, 5)

      const numberStr = this.object.numberStr.replace(oldNumber, newNumber)

      const response = await this.$store.dispatch('interactions/update', {
        id: this.object.id,
        updateData: { number: this.newNumber, numberStr },
      })
      if (response.status === 200) {
        await this.$store.dispatch('interactions/findByPk', {
          params: {
            id: this.object.id,
          },
        })

        this.$emit('edit-result-end', undefined)
      }
    },

    closeEditNumberMenu() {
      this.visibleMenu = false
    },

    setMode(mode) {
      this.viewMode = mode
    },

    setModeEnd() {
      this.viewMode = ''
    },

    addNewVersion() {
      const newObject = _.cloneDeep(Interaction)

      newObject.versionUuid = this.object.versionUuid
      newObject.version = this.object.version
      newObject.version++
      newObject.number = this.object.number
      newObject.numberStr = this.object.numberStr
      newObject.customer = this.object.customer
      newObject.executorId = this.object.executorId
      newObject.reference = this.object.reference
      newObject.tags = this.object.tags
      newObject.managerId = this.object.managerId

      const viewId = uuid.v4()

      this.addObjectView({
        viewId,
        editMode: 'NEW',
        nevVersion: true,
        byEmail: false,
        emailData: {
          uid: null,
          iId: null,
          title: '',
          type: 'INCOMING',
          emailAccountId: null,
        },
        object: newObject,
      })

      this.$router.push({ name: 'interaction-detail', params: { id: viewId } })
    },

    async setActive() {
      const response = await this.$store.dispatch('interactions/update', {
        id: this.object.id,
        updateData: { state: this.object.state === 'Active' ? 'Deactive' : 'Active' },
      })

      if (response.status === 200) {
        await this.$store.dispatch('interactions/findByPk', {
          viewId: this.viewId,
          params: {
            id: this.object.id,
          },
        })
      }
    },

    formatDate(date) {
      return moment(date).format('DD.MM.YYYY')
    },
  },
}
</script>

<style lang="scss">
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;

    &:hover {
      background: #eee;
    }
  }
}
</style>
