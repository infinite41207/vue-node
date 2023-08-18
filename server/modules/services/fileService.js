const fs = require('fs');
const moment = require('moment');

module.exports = {
  async removeFile(path) {
    fs.stat(path, function (err) {
      if (err) {
        return console.error(err);
      }

      fs.unlink(path, function (err) {
        if (err) return console.log(err);
      });
    });
  },

  getFileName(originalName) {
    let fileName = originalName;
    let fileExt = '';

    const re = /(?:\.([^.]+))?$/;
    fileExt = re.exec(originalName)[0];
    fileName = String(originalName).replace(fileExt, '');

    const reg = /[^a-zA-Z0-9-_]/g
    fileName = String(fileName).replace(reg, '_');

    fileName = fileName.toLowerCase();

    return `${fileName}_${Date.now()}${fileExt}`;
  },

  getFolder() {
    const dateFolder = moment().format('DD_MM_YYYY');
    const fullFolder = `${process.env.DESTINATION}/common/${dateFolder}`;

    if (!fs.existsSync(fullFolder)) {
      fs.mkdirSync(fullFolder, { recursive: true });
    }

    return fullFolder;
  },
};
