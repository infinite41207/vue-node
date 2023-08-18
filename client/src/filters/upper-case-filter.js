export default function upperCaseFilter(value) {
  if (value && typeof value === 'string') {
    return value.toUpperCase()
  } else {
    return value
  }
}
