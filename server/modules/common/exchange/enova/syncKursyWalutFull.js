
const KursyWalut = require('../../../externalData/enova/models/kursy_walut');

const initData = require('../../../../database/enova/kursy_walut.json');

module.exports = async () => {
  console.log('Begin sync of kursy walut...');
    
    for (let item of initData) {
      let kursString = item.Kurs.replace(/,/g, ".");
      let kursZakupuString = item.KursZakupu.replace(/,/g, ".");
      
      let foundItem = await KursyWalut.findByPk(item.ID);
      if (foundItem===null) {
        const newItemData = {        
          id: item.ID,
          data: item.Data,
          waluta: item.Waluta,
          krotnosc: item.Krotnosc,
          kurs: parseFloat(kursString),
          kurs_zakupu: parseFloat(kursZakupuString),          
          numer_tabeli: item.NumerTabeli,
        };
          await KursyWalut.create(newItemData).catch((err) => {
            console.log(err);
          });        
      }
    }

  console.log('End sync kursy walut');
};
