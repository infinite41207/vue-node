const Model = require("./models");

module.exports = {
  async setNumbers(documentData) {
    if (!documentData.prefix) {
      documentData.prefix = "ZLC";
    }

    await Model.findOne({ where: { prefix: documentData.prefix }, attributes: ["number"], order: [["number", "DESC"]] })
      .then((documentNumber) => {
        if (documentNumber) {
          documentNumber = JSON.stringify(documentNumber);
          documentNumber = JSON.parse(documentNumber);
          documentData.number = ++documentNumber.number;
        } else {
          documentData.number = 1;
        }
        documentData.numberStr = documentData.prefix + "-" + documentData.number.toString().padStart(6, "0");
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
