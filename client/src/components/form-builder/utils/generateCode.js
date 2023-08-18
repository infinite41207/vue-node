export default function (data, type = 'vue') {
  const funcList = []

  const tokenFuncList = []

  const blankList = []

  let funcTemplate = ''

  let blankTemplate = ''

  for (let i = 0; i < funcList.length; i++) {
    funcTemplate += `
            ${funcList[i].func} (resolve) {
              // ${funcList[i].label} ${funcList[i].model}
              // Call callback function once get the data from remote server
              // resolve(data)
            },
    `
  }

  for (let i = 0; i < tokenFuncList.length; i++) {
    funcTemplate += `
            ${tokenFuncList[i].func} (resolve) {
              // ${tokenFuncList[i].label} ${tokenFuncList[i].model}
              // Call callback function once get the token
              // resolve(token)
            },
    `
  }

  for (let i = 0; i < blankList.length; i++) {
    blankTemplate += `
        <template slot="${blankList[i].name}" slot-scope="scope">
          <!-- ${blankList[i].label} -->
          <!-- use v-model="scope.model.${blankList[i].name}" to bind data -->
        </template>
    `
  }

  if (type === 'vue') {
    return `<template>
  <div>
    <fm-generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm">
      ${blankTemplate}
    </fm-generate-form>
    <b-button variant="primary" @click="handleSubmit">提交</b-button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        jsonData: ${data},
        editData: {},
        remoteFuncs: {
          ${funcTemplate}
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$refs.generateForm.getData().then(data => {
          // data check success
          // data - form data
        }).catch(e => {
          // data check failed
        })
      }
    }
  }
</script>`
  } else {
    return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
    <link rel="stylesheet" href="https://unpkg.com/form-making/dist/FormMaking.css">
  </head>
  <body>
    <div id="app">
      <fm-generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm">
        ${blankTemplate}
      </fm-generate-form>
      <b-button variant="primary" @click="handleSubmit">提交</b-button>
    </div>
    <script src="https://unpkg.com/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/element-ui/lib/index.js"></script>
    <script src="https://unpkg.com/form-making/dist/FormMaking.umd.js"></script>
    <script>
      new Vue({
        el: '#app',
        data: {
          jsonData: ${data},
          editData: {},
          remoteFuncs: {
            ${funcTemplate}
          }
        },
        methods: {
          handleSubmit () {
            this.$refs.generateForm.getData().then(data => {
              // data check success
              // data - form data
            }).catch(e => {
              // data check failed
            })
          }
        }
      })
    </script>
  </body>
  </html>`
  }
}
