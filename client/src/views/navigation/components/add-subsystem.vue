<template>
  <b-modal
    id="add-subsystem"
    size="lg"
    :title="`${$t('navigation.newSubsystem')}`"
    :cancel-title="$t('commands.cancel')"
    no-close-on-backdrop
    :ok-title="`${$t('commands.write')}`"
    @ok="handleOk"
    @cancel="handleCancel"
    @close="handelClose"
  >
    <b-card>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.isActive')" label-for="is-active">
            <b-form-checkbox v-model="newSubsystem.isActive" name="is-active" switch size="sm"> </b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.parent')" label-for="item-parent">
            <b-form-select id="item-parent" v-model="newSubsystem.parentId" :options="subsystems" value-field="id" text-field="title" size="sm">
              <template v-slot:first>
                <b-form-select-option :value="null">-- Brak podsystemu narzędnego --</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.name')" label-for="item-name">
            <b-form-input id="item-name" v-model="newSubsystem.name" type="text" name="item-name" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.path')" label-for="item-path">
            <b-form-input id="item-path" v-model="newSubsystem.path" type="text" name="item-path" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.title')" label-for="item-title">
            <b-input-group>
              <b-form-input id="item-title" v-model="newSubsystem.title" type="text" name="item-title" size="sm"></b-form-input>
              <b-input-group-append>
                <Translation v-model="newSubsystem.lang" input="title" />
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.accessRole')" label-for="item-access-role">
            <b-select v-model="newSubsystem.accessRoleId" :options="userRoles" value-field="id" text-field="name" size="sm"> </b-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="10">
          <b-form-group horizontal :label-cols="3" :label="$t('table.icon')" label-for="item-icon">
            <b-form-input id="item-icon" v-model="newSubsystem.icon" type="text" name="item-icon" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col cols="2">
          <b-form-group horizontal :label-cols="7" :label="$t('common.preview')" label-for="item-icon-preview">
            <i :class="newSubsystem.icon" class="p-1 prev-icon align-middle"></i>
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>
  </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { INavigationItem } from '@/store/types/NavigationType'
import Translation from '@/components/common/translation.vue'
import { uuid } from 'vue-uuid'

@Component<NMAddSubsystem>({
  components: { Translation },
})
export default class NMAddSubsystem extends Vue {
  @Prop({ required: true, default: [] }) readonly subsystems: Array<INavigationItem>
  newSubsystem = {} as INavigationItem
  mainSubsystems = []
  userRoles = []

  mounted() {
    this.$bvModal.show('add-subsystem')

    this.newSubsystem = {
      id: uuid.v4(),
      name: '',
      path: '',
      isMenu: true,
      title: '',
      description: '',
      isSubsystem: true,
      sequence: 0,
      icon: '',
      isReadOnly: false,
      authRequired: true,
      parentId: null,
      presentation: false,
      component: '',
      viewId: null,
      accessRoleId: null,
      viewType: '',
      isActive: false,
      lang: {},
      childs: [],
    }

    this.initUserRoles()
  }

  async initUserRoles() {
    const queryParams = {
      noCommit: true,
      params: {
        sort: { sortBy: 'name', sortDesc: true },
      },
    }

    await this.$store
      .dispatch('userRoles/findAll', queryParams)
      .then((response) => {
        if (response && response.status === 200) {
          this.userRoles = response.data
        } else {
          this.userRoles = []
        }
      })
      .catch((err) => {
        console.error(err)
        this.userRoles = []
      })
  }

  async handleOk(): Promise<void> {
    this.$emit('add-subsystem-end', this.newSubsystem)
  }

  handleCancel(): void {
    this.$emit('add-subsystem-end', undefined)
  }

  handelClose(): void {
    this.$emit('add-subsystem-end', undefined)
  }
}
</script>

<style>
.prev-icon {
  font-size: 18px;
  border: 1px rgb(160, 156, 156) dotted;
}
</style>