const requestDataHandler = require("@services/requestDataHandler");
const axios = require("axios");
const uuidlib = require("uuid");

const dispositionStatusModel = require("@catalogs/dispositionStatuses/models");
const dispositionModel = require("@documents/dispositions/models");

module.exports = async () => {
  console.log("Start filled statusId in dispositions...");
  const response = await dispositionModel.findAll().catch((err) => {
    console.error(err);
  });

  for (const objItem of response) {
    if (objItem.state === null) {
      continue;
    }
    if (objItem.statusId === null) {
      const dispositionStatus = await dispositionStatusModel.findOne({ where: { key: objItem.state } }).catch((err) => {
        console.error(err);
      });

      if (dispositionStatus) {
        console.log(objItem.state, dispositionStatus + " = " + dispositionStatus.dataValues.key);

        objItem.statusId = dispositionStatus.dataValues.id;
        await objItem.update({ statusId: dispositionStatus.dataValues.id }).catch((err) => {
          console.log(err);
        });
      }
    }
  }
  console.log("Finish filled statusId in dispositions...");
};
