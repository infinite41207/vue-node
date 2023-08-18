<template>
  <Layout>
    <PageHeader :title="title" />
    <b-row>
      <b-col sm="6">
        <b-container>
          <b-col md="10" :style="colus">
            <b-tabs justified>
              <b-tab title="próba">
                <b-card-header class="text-center mb-0" header-bg-variant="light" header-border-variant="dark">
                  <h5 class="mb-0"> Spis treści </h5>
                </b-card-header>
                <b-card-body id="nav-scroller-proba" style="position: relative; height: 200px; overflow-y: scroll">
                  <div v-for="inn in inne" :key="inn.id">
                    <div v-if="inn.isChildren === false">
                      <b-card-body class="mb-n4 mt-n2">
                        <b-button v-b-toggle="'f' + inn.id" v-if="inn.hasChildren === true" size="sm" variant="outline-secondary">
                          <b-icon icon="arrow-right"></b-icon>
                        </b-button>
                        <a href="javascript:void(0);" class="btn btn-white btn-sm ml-2" @click="showArticle(inn)">
                          {{ inn.name }}
                        </a>
                      </b-card-body>
                      <b-collapse :id="'f' + inn.id" class="mt-2 ml-4">
                        <div v-for="i in inne" :key="i.id">
                          <div v-if="i.isChildren === true && i.parentId === inn.id">
                            <b-card-body class="mb-n4 mt-n2">
                              <b-button v-b-toggle="'z' + i.id" v-if="i.hasChildren === true" size="sm" variant="outline-secondary" class="ml-n3">
                                <b-icon icon="arrow-right"></b-icon>
                              </b-button>
                              <a href="javascript:void(0);" class="btn btn-white btn-sm" @click="showArticle(i)">
                                {{ i.name }}
                              </a>
                            </b-card-body>
                            <b-collapse :id="'z' + i.id" class="mt-2 ml-4">
                              <div v-for="a in inne" :key="a.id">
                                <div v-if="a.isChildren === true && a.parentId === i.id">
                                  <a href="javascript:void(0);" class="btn btn-white btn-sm" @click="showArticle(a)">
                                    {{ a.name }}
                                  </a>
                                </div>
                              </div>
                            </b-collapse>
                          </div>
                        </div>
                      </b-collapse>
                    </div>
                  </div>
                </b-card-body>
              </b-tab>
              <b-tab title="szukaj">
                <b-card-header class="bg-primary">
                  <div>
                    <b-input-group>
                      <b-input v-model="filterValue" placeholder="Wpisz wyrażenie, które chcesz wyszukać"> </b-input>
                      <b-input-group-append>
                        <b-button id="cleaner" @click="clearInput">
                          <b-icon icon="x-lg"></b-icon>
                        </b-button>
                        <b-tooltip target="cleaner" triggers="hover" placement="bottomright"> Wyczyść </b-tooltip>
                      </b-input-group-append>
                    </b-input-group>
                  </div>
                </b-card-header>
                <h2>Opcje:</h2>
                <b-row>
                  <b-col> Kategorie: </b-col>
                  <b-col>
                    <b-form-select size="sm" v-model="selected" :options="options"> </b-form-select>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <div>
                      <b-form-checkbox id="checkbox1" name="checkbox1" v-model="targetable" :value="true" :unchecked-value="false" switch @change="onTargetable">
                        trafności
                      </b-form-checkbox>
                    </div>
                    <div>
                      <b-form-checkbox id="checkbox2" name="checkbox2" v-model="datable" :value="true" :unchecked-value="false" switch @change="onDatable"> daty </b-form-checkbox>
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-button block id="searcher" @click="startSearch"> Wyszukaj </b-button>
                  <b-tooltip target="searcher" triggers="hover" placement="bottomright"> Szukaj </b-tooltip>
                </b-row>
              </b-tab>
              <b-tab title="tabela">
                <b-card-header class="text-center mb-0" header-bg-variant="light" header-border-variant="dark">
                  <h5 class="mb-0"> tabela </h5>
                </b-card-header>
                <b-card-body id="nav-scroller-tabela" style="position: relative; height: 300px; overflow-y: scroll">
                  <b-table :items="inne" :fields="fields" striped hover></b-table>
                </b-card-body>
              </b-tab>
            </b-tabs>
          </b-col>
        </b-container>
      </b-col>

      <b-col>
        <b-card-header style="height: 5rem">
          <p class="text-right"> Tu będzie ścieżka </p>
          <p class="text-left">
            <b-button size="sm" class="mt-2" @click="printReport"
              >>
              <b-icon icon="printer-fill"></b-icon>
            </b-button>
            może się przyda
          </p>
        </b-card-header>
        <b-card-body id="nav-scroller2" style="position: relative; height: 200px; overflow-y: scroll">
          <div v-if="isSearching === false">
            <h1>
              {{ titler }}
            </h1>
            {{ texter }}
          </div>
          <div v-else>
            <div v-if="article.parentId !== null">
              <p class="mb-n2 mt-n2">
                <a href="javascript:void(0);" class="btn btn-white btn-sm text-center" @click="showArticle(articles[article.parentId - 1])">
                  {{ articles[article.parentId - 1].name }}
                </a>
              </p>
            </div>
          </div>
        </b-card-body>
      </b-col>
    </b-row>
  </Layout>
</template>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'PageDocumentation',

  page() {},

  components: {
    Layout,
    PageHeader,
  },

  data() {
    return {
      title: this.$t(''),
      selected: '',
      options: [
        { value: '', text: 'pick something' },
        { value: 'temat1', text: 'temat1' },
        { value: 'temat2', text: 'temat2' },
        { value: 'temat3', text: 'temat3' },
        { value: 'temat4', text: 'temat4' },
        { value: 'temat5', text: 'temat5' },
      ],
      filterValue: '',

      fields: [
        { key: 'id', sortable: true },
        { key: 'parentId', sortable: false },
        { key: 'isParent', sortable: true },
        { key: 'isChildren', sortable: true },
        { key: 'hasChildren', sortable: true },
      ],

      inne: [
        { id: 1, name: 'Lazarus 1', parentId: null, isParent: true, isChildren: false, hasChildren: true, childrenID: [2, 5, 11], thema: 'temat1' },
        { id: 2, name: 'Adynozyno 2', parentId: 1, isParent: true, isChildren: true, hasChildren: true, childrenID: null, thema: 'temat1' },
        { id: 3, name: 'Ala ma kota 3', parentId: null, isParent: true, isChildren: false, hasChildren: true, childrenID: [4, 9, 10], thema: 'temat2' },
        { id: 4, name: 'Bagienne ziele 4', parentId: 3, isParent: false, isChildren: true, hasChildren: false, childrenID: null, thema: 'temat2' },
        { id: 5, name: 'Ratatuj 5', parentId: 1, isParent: false, isChildren: true, hasChildren: false, childrenID: null, thema: 'temat1' },
        { id: 6, name: 'Nazwa 6', parentId: 7, isParent: false, isChildren: true, hasChildren: false, childrenID: null, thema: 'temat3' },
        { id: 7, name: 'Czarna róża 7', parentId: null, isParent: true, isChildren: false, hasChildren: true, childrenID: [6, 8], thema: 'temat3' },
        { id: 8, name: 'Eden zero 8', parentId: 7, isParent: false, isChildren: true, hasChildren: false, childrenID: null, thema: 'temat3' },
        { id: 9, name: 'Classroom of the elite 9', parentId: 3, isParent: false, isChildren: true, hasChildren: false, childrenID: null, thema: 'temat2' },
        { id: 10, name: 'Czy to już to10', parentId: 3, isParent: false, isChildren: true, hasChildren: false, childrenID: null, thema: 'temat2' },
        { id: 11, name: 'Ale powiedz czemu 11', parentId: 1, isParent: false, isChildren: true, hasChildren: false, childrenID: null, thema: 'temat1' },
        { id: 12, name: 'Nigdy nie mów nigdy 12', parentId: null, isParent: true, isChildren: false, hasChildren: true, childrenID: [14], thema: 'temat4' },
        { id: 13, name: 'Listy do M 13', parentId: null, isParent: true, isChildren: false, hasChildren: false, childrenID: null, thema: 'temat5' },
        { id: 14, name: 'Jak wytresować smoka 14', parentId: 12, isParent: true, isChildren: true, hasChildren: true, childrenID: [15], thema: 'temat4' },
        { id: 15, name: 'Czy niemiecki boli 15', parentId: 14, isParent: false, isChildren: true, hasChildren: false, childrenID: null, thema: 'temat4' },
        { id: 16, name: 'POtrzeba mi pomysłu 16', parentId: 14, isParent: false, isChildren: true, hasChildren: false, childrenID: null, thema: 'temat4' },
        { id: 17, name: 'Jak filtrować lub flirtować 17', parentId: 1, isParent: false, isChildren: true, hasChildren: false, childrenID: null, thema: 'temat1' },
        { id: 18, name: 'JavaScriptus 18', parentId: 2, isParent: false, isChildren: true, hasChildren: false, childrenID: null, thema: 'temat1' },
        { id: 19, name: 'Kartagina i Rzym 19', parentId: 2, isParent: false, isChildren: true, hasChildren: false, childrenID: null, thema: 'temat1' },
        { id: 20, name: 'Wenn wir uns wiedersehen 20', parentId: 1, isParent: true, isChildren: true, hasChildren: true, childrenID: null, thema: 'temat1' },
        { id: 21, name: 'Co to będzie 21', parentId: 20, isParent: false, isChildren: true, hasChildren: false, childrenID: null, thema: 'temat1' },
      ],
      articles: [],
      articleTable: [],
      targetable: false,
      datable: false,
      text: '',
      titler: '',
      texter: '',
      isSearching: false,
    }
  },
  computed: {
    ...mapGetters({
      currentLanguage: 'auth/currentLanguage',
    }),

    id: {
      get() {
        return this.inne.id
      },
    },
    name: {
      get() {
        return this.inne.name
      },
    },
    parentId: {
      get() {
        return this.inne.parentId
      },
    },
    isParent: {
      get() {
        return this.inne.isParent
      },
    },
    isChildren: {
      get() {
        return this.inne.isChildren
      },
    },
    hasChildren: {
      get() {
        return this.inne.hasChildren
      },
    },
    childrenID: {
      get() {
        return this.inne.childrenID
      },
    },
    thema: {
      get() {
        return this.inne.thema
      },
    },
  },

  mounted() {
    this.initialize()
    this.isSearching = false
  },

  methods: {
    async initialize() {
      const filtrStr = {
        params: {
          filter: {
            id: this.inne.id,
          },
        },
      }
      this.articles = this.inne
      //console.log(this.articles)
      if (this.filterValue !== '' || this.selected !== '') {
        this.articleTable = []
        for (const article of this.articles) {
          const articleTableItem = {
            id: article.id,
            name: article.name,
            parentId: article.parentId,
            isParent: article.isParent,
            isChildren: article.isChildren,
            hasChildren: article.hasChildren,
            childrenID: article.childrenID,
            thema: article.thema,
          }
          if (this.filterValue !== '' && this.selected === '') {
            if (article.name.includes(this.filterValue) === true) {
              this.articleTable.push(articleTableItem)
            }
          } else if (this.filterValue === '' && this.selected !== '') {
            if (article.thema === this.selected) {
              this.articleTable.push(articleTableItem)
            }
          } else {
            if (article.thema === this.selected && article.name.includes(this.filterValue) === true) {
              this.articleTable.push(articleTableItem)
            }
          }
        }
        console.log(this.articleTable)
      } else {
        this.articleTable = this.articles
      }
    },
    async clearInput() {
      this.filterValue = ''
      this.selected = ''
    },

    startSearch() {
      this.isSearching = true
      this.initialize()
    },

    showArticle(zmienna) {
      //console.log("Pokazuję artykuł:", text)
      this.isSearching = false
      if (zmienna.parentId !== null) {
        this.texter = zmienna.name + ' ma rodzica: ' + zmienna.parentId
      } else {
        this.texter = zmienna.name
      }

      this.titler = 'Text o numerze id: ' + zmienna.id
    },

    async onTargetable() {
      if (this.targetable === true) console.log('targetable = true')
      else console.log('targetable = false')
    },

    async onDatable() {
      if (this.datable === true) console.log('datable = true')
      else console.log('datable = false')
    },

    async updateList() {
      const filterStr = {
        params: {
          filter: null,
        },
      }
    },

    async printReport() {
      await this.$htmlToPaper()
    },
  },
}
</script>

<style>
.colus {
  border-left: solid 2px red;
}
</style>