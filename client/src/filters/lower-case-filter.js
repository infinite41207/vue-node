export default function lowerCaseFilter(value) {
  if (value && typeof value === 'string') {
    return value.toLowerCase()
  } else {
    return value
  }
}
