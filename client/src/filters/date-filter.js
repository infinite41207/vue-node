import moment from 'moment'

export default function dateFilter(value, format = 'date') {
  if (!value) {
    return ''
  } else {
    if (format === 'datetime') {
      return moment(value).format('DD.MM.YYYY HH:mm:ss')
    } else if (format === 'time') {
      return moment(value).format('HH:mm:ss')
    } else {
      return moment(value).format('DD.MM.YYYY')
    }
  }
}
