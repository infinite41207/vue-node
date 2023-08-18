
const dokHandlowe = require('../../../externalData/enova/models/dokHandlowe');
const initData = require('../../../../database/enova/dokHandlowe.json');

module.exports = async () => {
  console.log('Begin sync of dok handlowe...');
    
    for (let item of initData) {
      let curKontrahent = null;
      if (parseInt(item.Kontrahent) > 0) {
        curKontrahent = item.Kontrahent;
      }
      let curOdbiorca = null;
      if (parseInt(item.Odbiorca) > 0) {
        curOdbiorca = item.Odbiorca;
      }
      
      let kursDoc = 0;
      if (item.KursWaluty) {
        kursDoc = parseFloat(String(item.KursWaluty).replace(/,/g, "."));
      }

      let summaNetto = 0;
      if (item.SummaNetto) {
        summaNetto = parseFloat(String(item.SummaNetto).replace(/,/g, "."));
      }
      
      let sumVat = 0;
      if (item.SumaVAT) {
        sumVat = parseFloat(String(item.SumaVAT).replace(/,/g, "."));
      }

      let sumaBrutto = 0;
      if (item.SumaBrutto) {
        sumaBrutto = parseFloat(String(item.SumaBrutto).replace(/,/g, "."));
      }
      
      let bruttoWal = 0;
      if (item.BruttoCyValue) {
        bruttoWal = parseFloat(String(item.BruttoCyValue).replace(/,/g, "."));
      }
      
      let foundItem = await dokHandlowe.findByPk(item.ID);
      if (foundItem===null) {
        const newItemData = {
          id: item.ID,
          definicja: item.Definicja,
          magazyn: item.Magazyn,
          kontrahent: curKontrahent,
          odbiorca: curOdbiorca,
          stan: item.Stan,
          potwierdzenie: item.Potwierdzenie,
          kierunekMagazynu: item.KierunekMagazynu,
          numerPelny: item.NumerPelny,
          data: item.Data,
          dataOperacji: item.DataOperacji,
          sumaNetto: summaNetto,
          sumaVAT: sumVat,
          sumaBrutto: sumaBrutto,
          dataKursu: item.dataKursu,
          kursWaluty: kursDoc,      
          bruttoCyValue: bruttoWal,
          bruttoCySymbol: item.BruttoCySymbol
        };
        await dokHandlowe.create(newItemData).catch((err) => {
          console.log(err);
        });        
      }
    }

  console.log('End sync dok handlowe');
};
