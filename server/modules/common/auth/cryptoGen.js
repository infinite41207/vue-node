const crypto = require('crypto')
const bCrypt = require('bcrypt')

const algorithm = 'aes-256-ctr'
const secretKey = process.env.CRYPTO_SECRET_KEY

module.exports = {
  generateRandomToken() {
    return new Promise((resolve, reject) => {
      // generate reset token
      crypto.randomBytes(20, (err, buf) => {
        if (err) {
          return reject(err)
        }
        const token = buf.toString('hex')
        resolve(token)
      })
    })
  },

  createPasswordHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
  },

  encrypt(value) {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv)

    const encrypted = Buffer.concat([cipher.update(value), cipher.final()])

    return {
      iv: iv.toString('hex'),
      content: encrypted.toString('hex'),
    }
  },

  decrypt(hash) {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

    return decrpyted.toString()
  },
}
