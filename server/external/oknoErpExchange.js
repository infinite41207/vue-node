require('dotenv').config({ path: `${__dirname}/.env` })
const moduleAlias = require('module-alias')
const aliases = require('./aliases')

moduleAlias.addAliases({
  ...aliases,
})

//require('@common/exchange/oknoERPSync/syncServiceFull')();
require('@common/exchange/oknoERPSync/syncServiceChanges')()
