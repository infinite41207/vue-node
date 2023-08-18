const sequelize = require('@database/dbConnection')
const logger = require('@logging/logger')
const { Op } = require('sequelize')

const documentService = require('@services/documentsService')
const PozycjeDokHandlowy = require('../../externalData/enova/models/dokHandlowePozycje')
const DocHandlowe = require('../../externalData/enova/models/dokHandlowe')

const Magazyny = require('../../externalData/enova/models/magazyny')
const Towary = require('../../externalData/enova/models/towary')

const Kontrahenci = require('../../externalData/enova/models/kontrahenci')
const Definicje = require('../../externalData/enova/models/dokHandloweDefinicje')

module.exports = {
  async getDataReport(req, res, next) {
    const filterDefinitionArray = [3, 71]
    const docInclude = [
      {
        model: Magazyny,
        as: 'magazynid',
        attributes: ['id', 'name'],
      },
      {
        model: Kontrahenci,
        as: 'kontrahentId',
        attributes: ['id', 'name'],
      },
      {
        model: Kontrahenci,
        as: 'odbiorcaId',
        attributes: ['id', 'name'],
      },
    ]

    const includeArray = [
      {
        model: Towary,
        as: 'towarId',
        attributes: ['id', 'name'],
      },
      {
        model: DocHandlowe,
        as: 'dokumentId',
        attributes: ['id', 'numerPelny'],
        include: docInclude,
        where: {
          definicja: filterDefinitionArray,
        },
      },
    ]

    const filtersArray = req.body.filter

    let startDate
    let finishDate

    let filter = {}

    for (let rowFilter of filtersArray) {
      if (rowFilter.property === 'startDate') {
        startDate = rowFilter.value
      } else if (rowFilter.property === 'finishDate') {
        finishDate = rowFilter.value
      } else {
        let operator = ''
        if (rowFilter.operator === '=') {
          operator = 'eq'
        } else if (rowFilter.operator === '<=') {
          operator = 'lte'
        } else if (rowFilter.operator === '<') {
          operator = 'lt'
        } else if (rowFilter.operator === '>') {
          operator = 'gt'
        } else if (rowFilter.operator === '>=') {
          operator = 'gte'
        }
        filter[rowFilter.property] = { [Op[operator]]: rowFilter.value }
      }
    }

    const dateOperator = 'between'
    filter['data'] = { [Op[dateOperator]]: [startDate, finishDate] }

    // filter = {};

    let resposeDataSet = {}
    let response = {}
    let responseData = {}

    const groupsArray = req.body.groups

    let groups = []
    let attributesArray = []
    attributesArray.push([sequelize.fn('Sum', sequelize.col('enova_doc_handlowe_pozycja.sumaNetto')), 'sumaNetto'])
    attributesArray.push([sequelize.fn('Sum', sequelize.col('enova_doc_handlowe_pozycja.sumaVAT')), 'sumaVAT'])
    attributesArray.push([sequelize.fn('Sum', sequelize.col('enova_doc_handlowe_pozycja.sumaBurtto')), 'sumaBurtto'])

    groupsIncludeArray = []
    let groupIndex = 0

    // console.log('groupsArray', groupsArray);
    // console.log('includeArray', docInclude);

    for (let rowGroup of groupsArray) {
      let groupName = ''

      // if (rowGroup.property === '_kontrahent') {
      //     // console.log('1');
      //     groupName = 'documentId.kontrahentId';
      //     groups.push('documentId.kontrahentId');
      //     groups.push('documentId->kontrahentId');
      //     for (let objInclude of docInclude){
      //         if (objInclude.as === 'kontrahentId'){
      //             groupsIncludeArray.push(objInclude);
      //             break;
      //         };
      //     };

      // // if (rowGroup.property === 'deliveryNote') {
      //     // groupName = 'number';
      // // } else if (rowGroup.property === 'order_info') {
      //     // groupName = 'disposition.order.number';
      //     // groups.push('disposition.id');
      //     // groups.push('disposition->order.id');
      //     // for (let objInclude of includeArray){
      //     //     if (objInclude.as === 'disposition'){
      //     //         groupsIncludeArray.push(objInclude);
      //     //         break;
      //     //     };
      //     // };
      // // } else {
      //     groupName = rowGroup.property;
      // };

      // if (rowGroup.valueType === 'object'){
      //     attributesArray.push(groupName.substring(1)+'Id');
      //     groups.push('dokumentId.' + groupName.substring(1)+'Id');
      //     groups.push(groupName + '.id');
      //     for (let objInclude of docInclude){
      //         if (objInclude.as === rowGroup.property){
      //             groupsIncludeArray.push(objInclude);
      //             break;
      //         };
      //     };

      // } else {
      //     attributesArray.push(groupName);
      //     groups.push(groupName);
      // };

      attributesArray.push('dokumentId.kontrahentId')
      groups.push('kontrahentId.id')
      groups.push('documentId->kontrahentId.id')

      try {
        response = await PozycjeDokHandlowy.findAll({
          attributes: attributesArray,
          where: filter,
          include: includeArray,
          group: groups,
        })

        responseData = response
        resposeDataSet['group' + groupIndex] = responseData
        groupIndex += 1
      } catch (err) {
        logger.error('Error in getAllAdmins Service', { meta: err })
      }
    }

    response = await documentService.findAllItems(PozycjeDokHandlowy, filter, includeArray)
    responseData = response.responseData
    resposeDataSet['recordsDetail'] = responseData

    if (resposeDataSet) {
      res.status(200).send(resposeDataSet)
    } else {
      console.log(err)
      res.status(400).send({
        message: 'Bad request',
      })
    }
  },
}
