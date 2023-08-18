<template>
  <main>
    <a href="javascript:void(0);" class="text-muted align-middle" v-b-modal.modal="input">
      <i class="ri-translate-2 ml-2"></i>
    </a>
    <b-modal :id="input" title="Wprowadź tłumaczenia">
      <b-container>
        <b-row>
          <b-col sm="12">
            <b-container>
              <b-row class="p-2" v-for="i in lang.length" :key="i">
                <b-col sm="4">
                  <p>{{ lang[i - 1].name }}</p>
                </b-col>
                <b-col sm="8">
                  <b-form-input v-model="lang[i - 1].value" size="sm"></b-form-input>
                </b-col>
              </b-row>
            </b-container>
          </b-col>
        </b-row>
      </b-container>

      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button
          size="sm"
          variant="success"
          @click="
            save()
            ok()
          "
        >
          {{ $t('commands.ok') }}
        </b-button>
        <b-button size="sm" variant="danger" @click="cancel"> {{ $t('commands.cancel') }} </b-button>
      </template>
    </b-modal>
  </main>
</template>
  
<script>
import Languages from '../../dto/Languages.json'

export default {
  name: 'FieldsTranslation',

  props: {
    value: {
      type: Object,
      default: null,
    },
    input: {
      type: String,
    },
  },

  data() {
    return {
      allLanguages: Languages,
      lang: [],
    }
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      if (this.value === null || !this.value[this.input]) {
        for (let i = 0; i < this.allLanguages.length; i++) {
          this.lang.push({ code: this.allLanguages[i].code, name: this.allLanguages[i].name, value: '' })
        }
      } else {
        for (let i = 0; i < this.allLanguages.length; i++) {
          this.lang.push({
            code: this.allLanguages[i].code,
            name: this.allLanguages[i].name,
            value: this.value[this.input][this.allLanguages[i].code] ? this.value[this.input][this.allLanguages[i].code] : '',
          })
        }
      }
    },

    async save() {
      const newLang = { [this.input]: {} }

      if (this.value !== null) {
        for (const key of Object.keys(this.value)) {
          if (key !== this.input) {
            newLang[key] = this.value[key]
          }
        }
      }

      for (const langItem of this.lang) {
        newLang[this.input][langItem.code] = langItem.value
      }

      this.$emit('input', newLang)
      this.lang = []
    },
  },
}
</script>