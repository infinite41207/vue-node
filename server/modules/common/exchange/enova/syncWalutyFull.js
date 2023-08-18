
const Waluty = require('../../../externalData/enova/models/waluty');

const walutyInitData = require('../../../../database/enova/waluty.json');


module.exports = async () => {
  console.log('Begin sync of waluty...');
    
    for (let waluta of walutyInitData) {
      
      let foundItem = await Waluty.findByPk(waluta.ID);
      if (foundItem===null) {
        const newItemData = {
            id: waluta.ID,
            name: waluta.Nazwa,
            symbol: waluta.Symbol,          
          };
          await Waluty.create(newItemData).catch((err) => {
            console.log(err);
          });        
      }
    }

  console.log('End sync waluty.');
};
