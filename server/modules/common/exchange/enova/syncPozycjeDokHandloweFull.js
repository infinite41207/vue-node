
const pozycjeDokHandlowe = require('../../../externalData/enova/models/dokHandlowePozycje');
const initData = require('../../../../database/enova/pozycjeDokHandlowe.json');

module.exports = async () => {
  console.log('Begin sync of pozycje dok handlowe...');
    
    for (let item of initData) {
      
      let cenaValue = 0;
      if (item.CenaValue) {
        cenaValue = parseFloat(String(item.CenaValue).replace(/,/g, "."));
      }

      let iloscValue = 0;
      if (item.IloscValue) {
        iloscValue = parseFloat(String(item.IloscValue).replace(/,/g, "."));
      }

      let wartoscCyValue = 0;
      if (item.WartoscCyValue) {
        wartoscCyValue = parseFloat(String(item.WartoscCyValue).replace(/,/g, "."));
      }      

      let sumaNetto = 0;
      if (item.SumaNetto) {
        sumaNetto = parseFloat(String(item.SumaNetto).replace(/,/g, "."));
      }
      
      let sumaVat = 0;
      if (item.SumaVAT) {
        sumaVat = parseFloat(String(item.SumaVAT).replace(/,/g, "."));
      }

      let sumaBrutto = 0;
      if (item.SumaBrutto) {
        sumaBrutto = parseFloat(String(item.SumaBrutto).replace(/,/g, "."));
      }
            
      let foundItem = await pozycjeDokHandlowe.findByPk(item.ID);
      if (foundItem===null) {
        const newItemData = {
          id: item.ID,
          kierunekMagazynu: item.KierunekMagazynu,
          lp: item.Lp,
          data: item.Data,
          dokument: item.Dokument,
          towar: item.Towar,          
          nazwa: item.Nazwa,
          cenaValue: cenaValue,
          cenaSymbol: item.CenaSymbol,
          iloscValue: iloscValue,
          iloscSymbol: item.IloscSymbol,
          wartoscCyValue: wartoscCyValue,
          wartoscCySymbol: item.WartoscCySymbol,
          sumaNetto: sumaNetto,
          sumaVAT: sumaVat,
          sumaBurtto: sumaBrutto
        };

        await pozycjeDokHandlowe.create(newItemData).catch((err) => {
          console.log(err);
        });        
      }
    }

  console.log('End sync dok handlowe');
};
