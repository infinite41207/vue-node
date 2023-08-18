export default {
  methods: {
    getFileSizeDescription(fileSize) {
      let sizeDescription = '0.00 MB'

      if (String(fileSize).length < 7) {
        sizeDescription = `${Math.round(+fileSize / 1024).toFixed(2)} KB`
      } else {
        sizeDescription = `${(Math.round(+fileSize / 1024) / 1000).toFixed(2)} MB`
      }

      return sizeDescription
    },

    canOpenFileAtTab(contentType) {
      return (
        contentType === 'application/pdf' ||
        contentType === 'image/jpeg' ||
        contentType === 'image/png' ||
        contentType === 'application/xls' ||
        contentType === 'application/xlsx'
      )
    },

    getFileExtension(filename) {
      const re = /(?:\.([^.]+))?$/
      const ext = re.exec(filename)[1]

      return ext === undefined ? '' : ext
    },
  },
}
