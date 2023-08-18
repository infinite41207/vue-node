const fs = require('fs')

module.exports = {
  async updateInitialData(model, filename) {
    await model
      .findAll({ order: ['id'] })
      .then((result) => {
        result = JSON.stringify(result, null, 4)

        const filePath = `database/initialdata/${filename}.json`

        fs.writeFile(filePath, result, function (error) {
          if (error) console.error(error)
        })
      })
      .catch((error) => {
        console.error(error)
      })
  },
}
