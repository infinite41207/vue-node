const DependedPropertyValue = require('@catalogs/constructor/models/dependedPropertyValue');
const DependedPropertyDimension = require('@catalogs/constructor/models/dependedPropertyDimension');
const ExpensionVariable = require('@catalogs/constructor/models/expressionVariable');
const Sequalize = require('sequelize');

async function getCollectParameters(choosenParameters, customer, compact = true) {
  let collectParameters = {};

  choosenParameters.forEach((el) => {
    if (el.paramValue?.uuid) {
      collectParameters[el.param.uuid] = el.paramValue.uuid;
      collectParameters[el.param.uuid + '.name'] = el.paramValue.name;
    } else {
      collectParameters[el.param.uuid] = el.paramValue;
    }

    if (el.paramValue?.properties) {
      el.paramValue.properties.forEach((elValue) => {
        if (compact) {
          if (elValue.propDataType === 'dictionary') {
            collectParameters[elValue.propUuid] = elValue.valueUuid;
            collectParameters[elValue.propUuid + '.name'] = elValue.value;
          } else {
            collectParameters[elValue.propUuid] = elValue.value;
          }
        } else {
          if (elValue.property.dataType === 'dictionary') {
            collectParameters[elValue.property.uuid] = elValue.propValueUuid;
            collectParameters[elValue.property.uuid + '.name'] = elValue.propValue;
          } else {
            collectParameters[elValue.property.uuid] = elValue.propValue;
          }
        }
      });
    }
  });

  collectParameters['client'] = customer.uuid;
  collectParameters['client.country'] = customer.country ? customer.country.id : '';
  collectParameters['client.packingMaterialType'] = customer.packageMaterial;

  return collectParameters;
}

async function calculateDependedValues(parameterValueList, collectParameters) {
  cashedValues = [];
  for (let curValue of parameterValueList) {
    let baseParameters = AddValueParameters(collectParameters, curValue);

    for (let curProp of curValue.properties) {
      if (curProp.property.depended) {
        let propValue = await calculateDependPropValue(curProp, baseParameters, cashedValues, curValue);

        if (propValue) {
          curProp.propValue = propValue;
        }
      }
    }
  }
}

function AddValueParameters(collectParameters, currentValue) {
  let baseParams;
  baseParams = { ...collectParameters };

  baseParams[currentValue.paramUuid] = currentValue.uuid;
  baseParams[currentValue.paramUuid + '.name'] = currentValue.name;

  if (currentValue.properties) {
    currentValue.properties.forEach((elValue) => {
      if (elValue.property.dataType === 'dictionary') {
        baseParams[elValue.property.uuid] = elValue.propValueUuid;
        baseParams[elValue.property.uuid + '.name'] = elValue.propValue;
      } else {
        baseParams[elValue.property.uuid] = elValue.propValue;
      }
    });
  }

  if (!baseParams) {
    console.log('Undefined base params for value:', sValue);
    return collectParameters;
  } else {
    return baseParams;
  }
}

async function calculateDependPropValue(dependProp, baseParameters, cashedValues, curValue) {
  const propDimensions = await DependedPropertyDimension.findAll({
    where: { propId: dependProp.propId },
    attributes: ['dimension', 'dimensionType', 'sortNumber'],
    order: [['sortNumber', 'ASC']],
  });

  if (propDimensions) {
    if (propDimensions.length < 2) {
      return 0;
    }

    const coordinateX = propDimensions[0].dimension;
    const coordinateXType = propDimensions[0].dimensionType;
    const valueX = getDimensionValue(coordinateX, baseParameters);
    if (!valueX) {
      console.log('Nie znaleziono cord X', coordinateX);
      return 0;
    }

    const coordinateY = propDimensions[1].dimension;
    const coordinateYType = propDimensions[1].dimensionType;
    const valueY = getDimensionValue(coordinateY, baseParameters);

    if (!valueY) {
      console.log('Nie znaleziono cord Y', coordinateY);
      return 0;
    }

    let coordinateZ;
    let coordinateZType;
    let valueZ;

    if (propDimensions.length === 3) {
      coordinateZ = propDimensions[2].dimension;
      coordinateZType = propDimensions[2].dimensionType;
      valueZ = getDimensionValue(coordinateZ, baseParameters);
      if (!valueZ) {
        console.log('Nie znaleziono cord Z', coordinateZ);
        return 0;
      }
    }
    let cashedValue = cashedValues.find((elF) => {
      return elF.propId === dependProp.propId && elF.coordX === valueX && elF.coordY === valueY && elF.coordZ === valueZ;
    });

    if (cashedValue) {
      return cashedValue.value;
    }

    let qFilter = { propId: dependProp.propId };

    if (coordinateXType === 'number') {
      qFilter.minX = { [Sequalize.Op.lt]: valueX };
      qFilter.maxX = { [Sequalize.Op.gte]: valueX };
    } else {
      qFilter.coordinateX = valueX;
    }

    if (coordinateYType === 'number') {
      qFilter.minY = { [Sequalize.Op.lt]: valueY };
      qFilter.maxY = { [Sequalize.Op.gte]: valueY };
    } else {
      qFilter.coordinateY = valueY;
    }

    if (coordinateZ) {
      if (coordinateZType === 'number') {
        qFilter.minZ = { [Sequalize.Op.lt]: valueZ };
        qFilter.maxZ = { [Sequalize.Op.gte]: valueZ };
      } else {
        qFilter.coordinateZ = valueZ;
      }
    }

    let valueResult = await DependedPropertyValue.findOne({
      where: qFilter,
      attributes: ['propValue'],
    });

    if (!valueResult) {
      return 0;
    } else {
      valueResult = JSON.stringify(valueResult);
      valueResult = JSON.parse(valueResult);

      cashedValues.push({
        propId: dependProp.propId,
        coordX: valueX,
        coordY: valueY,
        coordZ: valueZ,
        value: Number(valueResult.propValue),
      });

      return Number(valueResult.propValue);
    }
  }
}

function getDimensionValue(coordinate, baseParameters) {
  return baseParameters[coordinate];
}

async function calculateExpressionVariables(productId, paramValues, collectParameters) {
  let expressionVariables = await ExpensionVariable.findAll({
    where: { productId: productId },
  });

  expressionVariables = JSON.stringify(expressionVariables);
  expressionVariables = JSON.parse(expressionVariables);

  for (let curValue of paramValues) {
    let baseParameters = AddValueParameters(collectParameters, curValue);

    for (let curProp of curValue.properties) {
      if (curProp.property.expression !== '') {
        let expressionResult = await calculateExpressionPropValue(curProp.property.expression, baseParameters, expressionVariables);

        if (expressionResult) {
          curProp.propValue = expressionResult.propValue;
          curProp.calculated = expressionResult.calculated;
        }
      }
    }
  }
}

async function calculateExpressionVariable(productId, expression, collectParameters) {
  let expressionVariables = await ExpensionVariable.findAll({
    where: { productId: productId },
  });

  expressionVariables = JSON.stringify(expressionVariables);
  expressionVariables = JSON.parse(expressionVariables);

  let expressionResult = await calculateExpressionPropValue(expression, collectParameters, expressionVariables);

  if (expressionResult.calculated) {
    return expressionResult.propValue;
  } else {
    return undefined;
  }
}

async function calculateExpressionPropValue(expression, baseParameters, expressionVariables) {
  let curExpression = expression;
  let calculated = false;
  let propValue = 0;

  for (let key in baseParameters) {
    let parValue = baseParameters[key];

    let regExp = new RegExp('#' + key + '#', 'g');

    if (parValue !== null) {
      if (parValue.length === 36) {
        curExpression = curExpression.replace(regExp, '"' + parValue + '"');
      } else {
        curExpression = curExpression.replace(regExp, parValue);
      }
    }
  }

  for (let variable of expressionVariables) {
    if (curExpression.includes('$' + variable.name + '$')) {
      let variableValue = variable.value;

      if (Array.isArray(variableValue)) {
        console.log('isArray', variableValue, ' for param ', variable.name);
      } else {
        // curExpression = curExpression.replace('= $' + variable.name + '$', '=== ' + variable.value);
        curExpression = curExpression.replace('$' + variable.name + '$', variable.value);
      }
    }
  }

  const regExpToFixed = new RegExp('\\)\\.toFixed\\(\\)');
  if (curExpression.search(regExpToFixed) !== -1) {
    const stringExtractor = extract(['Number(', ').toFixed()']);
    const expressionParts = stringExtractor(curExpression);

    for (let expressionPart of expressionParts) {
      if (expressionPart !== '') {
        const partValue = 0;
        try {
          const partValue = eval(expressionPart);
        } catch (error) {
          return { propValue: 0, calculated: false };
        }

        curExpression = curExpression.replace(expressionPart, String(partValue));
      }
    }
  }

  try {
    propValue = eval(curExpression);
    calculated = true;
    return { propValue, calculated };
  } catch (error) {
    const regExp = /#[0-9a-f-]{36}#/g;

    if (regExp.test(curExpression)) {
      curExpression = curExpression.replace(regExp, 0);

      try {
        propValue = eval(curExpression);
        return { propValue: propValue, calculated: false };
      } catch {
        console.log('Error after replace: ', curExpression);
        return { propValue: 0, calculated: false };
      }
    } else {
      console.log('Not expression: ', curExpression);
      return { propValue: 0, calculated: false };
    }
  }
}

function extract([beg, end]) {
  const matcher = new RegExp(`${beg}(.*?)${end}`, 'gm');
  const normalise = (str) => str.slice(beg.length, (end.length - 2) * -1);
  return function (str) {
    return str.match(matcher).map(normalise);
  };
}

async function filterParamValues(nextParameter, paramValues, collectParameters) {
  //add default and selected fields
  let selectedValues = [];

  paramValues.map((elParamValues) => {
    selectedValues.push({ ...elParamValues, default: false, selected: true });
  });

  //check main filters
  const paramFilter = JSON.parse(nextParameter.filter);

  if (paramFilter && paramFilter.length > 0) {
    checkMainFilter(paramFilter, collectParameters, selectedValues, false);
  }

  const paramFilterDefault = JSON.parse(nextParameter.filterDefault);

  if (paramFilterDefault && paramFilterDefault.length > 0) {
    checkMainFilter(paramFilterDefault, collectParameters, selectedValues, true);
  }

  //check values filters
  selectedValues.forEach((elSelValue) => {
    let baseParameters = AddValueParameters(collectParameters, elSelValue);

    let elFilter = JSON.parse(elSelValue.filter);

    if (elFilter && elFilter.length > 0 && !checkFilter(elFilter, baseParameters, '&&')) {
      elSelValue.selected = false;
    }

    if (elSelValue.selected) {
      let elFilterDefault = JSON.parse(elSelValue.filterDefault);

      if (elFilterDefault && elFilterDefault.length > 0 && checkFilter(elFilterDefault, baseParameters, '&&')) {
        elSelValue.default = true;
      }
    }
  });

  return selectedValues.filter((fEl) => fEl.selected);
}

async function checkMainFilter(filter, collectParameters, selectedValues, defaultValue) {
  for (let sValue of selectedValues) {
    let baseParams = AddValueParameters(collectParameters, sValue);

    if (checkFilter(filter, baseParams, '&&', false)) {
      if (defaultValue) {
        sValue.default = true;
      }
    } else {
      if (!defaultValue) {
        sValue.selected = false;
      }
    }
  }

  selectedValues = selectedValues.filter((fEl) => fEl.selected);
}

function checkFilter(elFilter, collectParameters, logicalChar, log = false) {
  let filterResult;

  elFilter.forEach((el) => {
    if (el.groupType) {
      if (el.groupType === 'NotGroup') {
        filterResult = AddFilter(filterResult, logicalChar, !checkFilter(el.groupItems, collectParameters, '&&', log));
        if (log) {
          console.log('AndGroup', filterResult);
        }
      } else if (el.groupType === 'OrGroup') {
        filterResult = AddFilter(filterResult, logicalChar, checkFilter(el.groupItems, collectParameters, '||', log));
        if (log) {
          console.log('OrGroup', filterResult);
        }
      } else if (el.groupType === 'AndGroup') {
        filterResult = AddFilter(filterResult, logicalChar, checkFilter(el.groupItems, collectParameters, '&&', log));
        if (log) {
          console.log('AndGroup', filterResult);
        }
      }
    } else {
      let leftValue;
      let rightValue;

      if (log) {
        console.log('el data', el);
      }

      if (el.attr) {
        leftValue = collectParameters[el.param.replace('.', '') + '.' + el.attr];
      } else {
        leftValue = collectParameters[el.param];
      }

      if (leftValue === undefined) {
        return false;
      }

      if (el.value !== undefined) {
        if (el.valueType === 'param') {
          if (el.attr === 'name') {
            rightValue = collectParameters[el.value + '.' + el.attr];
          } else {
            rightValue = collectParameters[el.value];
          }
        } else {
          rightValue = el.value;
        }

        if (rightValue === undefined) {
          console.log('Bad value:' + JSON.stringify(el));
          return false;
        }
      }

      if (log) {
        console.log('left value', leftValue);
        console.log('right value', rightValue);
      }

      switch (el.comparisonType) {
        case 'Filled':
          filterResult = AddFilter(filterResult, logicalChar, !!leftValue);
          break;
        case 'NotFilled':
          filterResult = AddFilter(filterResult, logicalChar, !leftValue);
          break;
        case 'Equal':
          filterResult = AddFilter(filterResult, logicalChar, leftValue === rightValue);
          break;
        case 'NotEqual':
          filterResult = AddFilter(filterResult, logicalChar, leftValue !== rightValue);
          break;
        case 'Contains':
          filterResult = AddFilter(filterResult, logicalChar, leftValue.includes(rightValue));
          break;
        case 'NotContains':
          filterResult = AddFilter(filterResult, logicalChar, !leftValue.includes(rightValue));
          break;
        case 'BeginWith':
          filterResult = AddFilter(filterResult, logicalChar, leftValue.StartsWith(rightValue));
          break;
        case 'NotBeginWith':
          filterResult = AddFilter(filterResult, logicalChar, !leftValue.StartsWith(rightValue));
          break;
        case 'Like':
          filterResult = AddFilter(filterResult, logicalChar, leftValue.Match(rightValue));
          break;
        case 'NotLike':
          filterResult = AddFilter(filterResult, logicalChar, !leftValue.Match(rightValue));
          break;
        case 'Greater':
          filterResult = AddFilter(filterResult, logicalChar, leftValue > rightValue);
          break;
        case 'GreaterOrEqual':
          filterResult = AddFilter(filterResult, logicalChar, leftValue >= rightValue);
          if (log) {
            console.log('GreaterOrEqual result', filterResult);
          }
          break;
        case 'Less':
          filterResult = AddFilter(filterResult, logicalChar, leftValue < rightValue);
          if (log) {
            console.log('less result', filterResult);
          }
          break;
        case 'LessOrEqual':
          filterResult = AddFilter(filterResult, logicalChar, leftValue <= rightValue);
          if (log) {
            console.log('LessOrEqual result', filterResult);
          }
          break;
        case 'InList':
          filterResult = AddFilter(filterResult, logicalChar, !!rightValue.find((arEl) => arEl === leftValue));
          break;
        case 'NotInList':
          filterResult = AddFilter(filterResult, logicalChar, !rightValue.find((arEl) => arEl == leftValue));
          break;
        case 'InHierarchy':
          console.log('Filter InHierarchy');
          break;
        case 'NotInHierarchy':
          console.log('Filter InHierarchy');
          break;
        case 'InListByHierarchy':
          console.log('Filter InHierarchy');
          break;
        case 'NotInListByHierarchy':
          console.log('Filter InHierarchy');
          break;
        default:
          console.log('Undefined Filter');
          break;
      }
    }
  });

  return filterResult;
}

function AddFilter(filterResult, logicalChar, comparision) {
  if (filterResult === undefined) {
    return comparision;
  }

  if (logicalChar === '||') {
    return filterResult || comparision;
  } else {
    return filterResult && comparision;
  }
}

async function convertDataTypes(paramValues) {
  for (let paramValue of paramValues) {
    if (paramValue.properties) {
      for (let propertyValue of paramValue.properties) {
        if (propertyValue.property.dataType === 'number') {
          propertyValue.propValue = Number(propertyValue.propValue);
        } else if (propertyValue.property.dataType === 'boolean') {
          try {
            propertyValue.propValue = JSON.parse(propertyValue.propValue);
          } catch (error) {
            propertyValue.propValue = false;
          }
        }
      }
    }
  }
}

async function localizeParamValues(paramValues, lang) {
  for (let paramValue of paramValues) {
    if (paramValue.lang) {
      const translates = JSON.parse(paramValue.lang);
      paramValue.name = translates[lang] ? translates[lang] : paramValue.name;
      delete paramValue.lang;
      for (let valueProp of paramValue.properties) {
        if (valueProp.property.lang) {
          const translatesProp = JSON.parse(valueProp.property.lang);
          valueProp.property.name = translatesProp[lang] ? translatesProp[lang] : valueProp.property.name;
          delete valueProp.property.lang;
        }

        for (let propValue of valueProp.property.values) {
          if (propValue.lang) {
            const translatesPValue = JSON.parse(propValue.lang);
            propValue.name = translatesPValue[lang] ? translatesPValue[lang] : propValue.name;
            delete propValue.lang;
          }
        }
      }
    }
  }
}

module.exports = {
  getCollectParameters,
  calculateDependedValues,
  calculateExpressionVariables,
  calculateExpressionVariable,
  filterParamValues,
  checkFilter,
  convertDataTypes,
  localizeParamValues,
};
