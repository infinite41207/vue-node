const Translations = require('@registers/translations/models');

module.exports = {
  async deleteTranslations(catalogType, catalogUuid) {
    await Translations.destroy({ where: { catalogType: catalogType, uuid: catalogUuid } });
  },

  async createTranslations(catalogInfo, translations) {
    for (let translation of translations) {
      await Translations.create({
        catalogType: catalogInfo.type,
        catalogId: catalogInfo.id,
        uuid: catalogInfo.uuid,
        lang: translation.lang,
        description: translation.description,
      });
    }
  },
};
