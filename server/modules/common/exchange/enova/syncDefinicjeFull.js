
const Definicje = require('../../../externalData/enova/models/dokHandloweDefinicje');
const initData = require('../../../../database/enova/Definicje.json');

module.exports = async () => {
  console.log('Begin sync of waluty...');
    
    for (let item of initData) {
      
      let foundItem = await Definicje.findByPk(item.ID);
      if (foundItem===null) {
        const newItemData = {
            id: item.ID,
            name: item.Nazwa,
            symbol: item.Symbol,          
          };
        await Definicje.create(newItemData).catch((err) => {
          console.log(err);
        });        
      }
    }

  console.log('End sync waluty.');
};
