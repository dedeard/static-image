const https = require('https')
const { maxFileSize } = require('./config')

const downloader = async (url) => {
  return new Promise(async (resolve, reject) => {
    const req = https.get('https://' + url, (res) => {
      const data = []
      let size = 0

      res.on('data', (chunk) => {
        size += chunk.length
        data.push(chunk)
        if (size > maxFileSize) {
          res.destroy(
            new Error('Resource stream exceeded limit (' + size + ')'),
          )
        }
      })

      res.on('end', () => {
        const buffer = Buffer.concat(data)
        resolve(buffer)
      })

      res.on('error', reject)
    })

    req.end()

    req.on('error', reject)
  })
}

module.exports = downloader
