
const Kontrahenci = require('../../../externalData/enova/models/kontrahenci');
const initData = require('../../../../database/enova/kontrahenci.json');

module.exports = async () => {
  console.log('Begin sync of kontrahenci...');
    
    for (let item of initData) {
      
      let foundItem = await Kontrahenci.findByPk(item.ID);
      if (foundItem===null) {
        
        const newItemData = {
            id: item.ID,
            name: item.Nazwa,
            NIP: item.NIP,
            PodatnikVAT: item.PodatnikVAT,
            EuVAT: item.EuVAT
          }

        await Kontrahenci.create(newItemData).catch((err) => {
          console.log(err);
        });

      }
    }

  console.log('End sync kontrahenci');
};
