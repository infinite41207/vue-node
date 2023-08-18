import moment from 'moment'
import { uuid } from 'vue-uuid'

export const newUuid = () => {
  return uuid.v4()
}

export const catalogPresentation = (objCatalog) => {
  if (objCatalog) {
    return objCatalog.name
  }
}

export const documentPresentation = (objDocument, strAttr = '') => {
  if (objDocument) {
    if (strAttr === '') {
      return 'Nr ' + objDocument.numberStr + ' od ' + moment(objDocument.date).format('DD.MM.YYYY')
    } else {
      const objDocumentAttr = objDocument[strAttr]
      if (objDocumentAttr) {
        return 'Nr ' + objDocumentAttr.number + ' od ' + moment(objDocumentAttr.date).format('DD.MM.YYYY')
      }
    }
  }
}

export const documentsAttrByName = (doc, attrName) => {
  if (doc) {
    const attr = doc[attrName]
    if (Array.isArray(attr)) {
      return attr[0]
    } else {
      return attr
    }
  }
}

export const dateTimePresentation = (valueDateTime) => {
  if (valueDateTime) {
    return moment(valueDateTime).format('DD.MM.YYYY HH:mm:ss')
  }
}

export const dateTimeShortPresentation = (valueDateTime) => {
  if (valueDateTime) {
    return moment(valueDateTime).format('DD.MM.YYYY HH:mm')
  }
}

export const weightPresentation = (value) => {
  if (value) {
    return Number(value).toFixed(2) + ' T'
  } else {
    return '0.00 T'
  }
}

export const showMessageBox = (view, textMessage, fontSize = 22, isRedText = false, windowSize = '') => {
  let bodyTextColor = 'text-black'
  if (isRedText) {
    bodyTextColor = 'text-danger'
  }

  let result = ''
  view.$bvModal
    .msgBoxOk(textMessage, {
      size: windowSize,
      title: 'UWAGA.',
      centered: true,
      bodyClass: bodyTextColor + ' font-' + fontSize + ' font-weight-bold',
    })
    .then((value) => {
      result = value
    })
    .catch((err) => {
      console.error(err)
    })
  return result
}

export const showQuestion = (view, textMessage, questionActionOk, questionActionCancel = undefined, objParameters = undefined, windowSize = '') => {
  let result = ''
  view.$bvModal
    .msgBoxConfirm(textMessage, {
      size: windowSize,
      centered: true,
      bodyClass: 'text-black font-20 font-weight-bold',
    })
    .then((value) => {
      result = value
      if (result) {
        questionActionOk(objParameters)
      } else {
        if (questionActionCancel !== undefined) {
          questionActionCancel(objParameters)
        }
      }
    })
    .catch((err) => {
      console.error(err)
    })
  return result
}

export const fillObject = (objReceiver, objSource, includeArray = [], excludeArray = []) => {
  for (const propName in objSource) {
    let isInclude = true
    if (includeArray.length > 0) {
      const findValue = includeArray.find((e) => e === propName)
      if (!findValue) {
        isInclude = false
      }
    }
    let isExclude = false
    if (excludeArray.length > 0) {
      const findValue = excludeArray.find((e) => e === propName)
      if (findValue) {
        isExclude = true
      }
    }
    if (isInclude === false || isExclude === true) {
      continue
    }

    if (Object.prototype.hasOwnProperty.call(objReceiver, propName)) {
      objReceiver[propName] = objSource[propName]
    }
  }
}
