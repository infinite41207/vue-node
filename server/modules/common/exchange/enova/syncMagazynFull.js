
const Magazyny = require('../../../externalData/enova/models/magazyny');
const initData = require('../../../../database/enova/magazyny.json');

module.exports = async () => {
  console.log('Begin sync of waluty...');
    
    for (let item of initData) {
      
      let foundItem = await Magazyny.findByPk(item.ID);
      if (foundItem===null) {
        const newItemData = {
            id: item.ID,
            name: item.Nazwa,
            symbol: item.Symbol,          
          };
        await Magazyny.create(newItemData).catch((err) => {
          console.log(err);
        });        
      }
    }

  console.log('End sync waluty.');
};
