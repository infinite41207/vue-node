<template>
  <b-modal
    id="edit-subsystem"
    size="lg"
    :title="`${$t('navigation.editSubsystem')}`"
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
            <b-form-checkbox v-model="value.isActive" name="is-active" switch> </b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.parent')" label-for="item-parent">
            <b-form-select id="item-parent" v-model="value.parentId" :options="subsystems" value-field="id" text-field="title" size="sm">
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
            <b-form-input id="item-name" v-model="value.name" type="text" name="item-name" size="sm" @change="onChangeName"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.path')" label-for="item-path">
            <b-form-input id="item-path" v-model="value.path" type="text" name="item-path" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.title')" label-for="item-title">
            <b-input-group>
              <b-form-input id="item-title" v-model="value.title" type="text" name="item-title" size="sm"></b-form-input>
              <b-input-group-append>
                <Translation v-model="value.lang" input="title" />
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group horizontal :label-cols="3" :label="$t('table.accessRole')" label-for="item-access-role">
            <b-select v-model="value.accessRoleId" :options="userRoles" value-field="id" text-field="name" size="sm"> </b-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="10">
          <b-form-group horizontal :label-cols="3" :label="$t('table.icon')" label-for="item-icon">
            <b-form-input id="item-icon" v-model="value.icon" type="text" name="item-icon" size="sm"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col cols="2">
          <b-form-group horizontal :label-cols="7" :label="$t('common.preview')" label-for="item-icon-preview">
            <i :class="value.icon" class="p-1 prev-icon align-middle"></i>
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

@Component<NMeditSubsystem>({
  components: { Translation },
})
export default class NMeditSubsystem extends Vue {
  @Prop({ required: true, default: null }) readonly value: INavigationItem
  @Prop({ required: true, default: [] }) readonly subsystems: Array<INavigationItem>

  prevParent: string | null | undefined

  userRoles = []

  mounted() {
    this.$bvModal.show('edit-subsystem')

    this.prevParent = this.value.parentId

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

  onChangeName(): void {
    if (this.value.title === '') this.value.title = this.value.name
  }

  async handleOk(): Promise<void> {
    this.$emit('input', this.value)
    //this.$emit('edit-item-end', {prevParent: this.prevParent, changedValue: this.value})
    if (this.value.parentId !== this.prevParent) {
      if (this.prevParent === null) {
        this.subsystems.findIndex((el) => {
          return el.id === this.value.id
        })
      } else {
        const prevParent = this.subsystems.find((el) => el.id === this.prevParent)

        if (prevParent) {
          const prevIndex = prevParent.childs.findIndex((el) => {
            return el.id === this.value.id
          })

          prevParent.childs.splice(prevIndex, 1)
        }
      }

      if (this.value.parentId === null) {
        this.subsystems.push(this.value)
      } else {
        const nevParent = this.subsystems.find((el) => el.id === this.value.parentId)

        if (nevParent) {
          nevParent.childs.push(this.value)
        }
      }
    }

    this.$emit('edit-item-end', undefined)
  }

  handleCancel(): void {
    this.$emit('edit-item-end', undefined)
  }

  handelClose(): void {
    this.$emit('edit-item-end', undefined)
  }
}
</script>

<style>
</style>