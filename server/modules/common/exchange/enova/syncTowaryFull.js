
const Towary = require('../../../externalData/enova/models/towary');
const initData = require('../../../../database/enova/towary.json');

module.exports = async () => {
  console.log('Begin sync of waluty...');
    
    for (let item of initData) {
      
      let foundItem = await Towary.findByPk(item.ID);
      if (foundItem===null) {
        const newItemData = {
            id: item.ID,
            name: item.Nazwa,
            code: item.Kod,          
          };
        await Towary.create(newItemData).catch((err) => {
          console.log(err);
        });        
      }
    }

  console.log('End sync waluty.');
};
