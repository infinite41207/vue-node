const Model = require("./models/paymentOperation");

module.exports = {
  async setNumbers(documentData) {
    // if (!documentData.prefix) {
    //   documentData.prefix = "P";
    // }
    if (documentData.typeOfPayment === 'Bank' && documentData.typeOfMovement === 'Receipt') {
      documentData.prefix = "POK";
    } else if (documentData.typeOfPayment === 'Bank' && documentData.typeOfMovement === 'Expense') {
      documentData.prefix = "PDK";
    } else if (documentData.typeOfPayment === 'Cash' && documentData.typeOfMovement === 'Receipt') {
      documentData.prefix = "KP";
    } else if (documentData.typeOfPayment === 'Cash' && documentData.typeOfMovement === 'Expense') {
      documentData.prefix = "KW";
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
