require('dotenv').config({ path: `${__dirname}/../.env` })
const moduleAlias = require('module-alias')
const aliases = require('./aliases')

moduleAlias.addAliases({
  ...aliases,
})

require('@common/exchange/hes1CSync/controllers/index.js')()
