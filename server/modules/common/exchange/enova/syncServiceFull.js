const config = require('config');

module.exports = () => {

  if (config.get('enova_exchange.allTabs')) {
    // require('./syncWalutyFull')();
    // require('./syncMagazynFull')();
    // require('./syncTowaryFull')();
    // require('./syncKontrahenciFull')();
    // require('./syncDefinicjeFull')();
    // require('./syncKursyWalutFull')();
    // require('./syncDokHandloweFull')();
    require('./syncPozycjeDokHandloweFull')();
  }

};
