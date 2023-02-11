const crypto = require('crypto')
const shared = require('./shared')
const downloader = require('./downloader')
const imgManager = require('./imageManager')
const { fileAge } = require('./config')

const app = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method !== 'GET') {
    res.statusCode = 405
    return res.end()
  }

  const routes = (req.url || '').split('/').filter((el) => el)
  if (routes.length < 2) {
    res.statusCode = 404
    return res.end()
  }

  try {
    const options = shared.parseOptions(routes[0])
    const fileUrl = routes.splice(1).join('/')

    const key = crypto.createHash('md5').update(req.url).digest('hex')
    const fileExists = await imgManager.exists(key)
    let data
    if (!fileExists) {
      const buffer = await downloader(fileUrl)
      data = await imgManager.create(key, buffer, options)
    } else {
      data = await imgManager.get(key)
    }

    res.setHeader('Cache-control', 'public, max-age=' + 60 * 60 * fileAge)
    res.setHeader('content-type', data.mime)
    res.end(data.buffer, 'binary')
  } catch (e) {
    res.statusCode = 500
    res.end(JSON.stringify({ message: e.message }))
  }
}

module.exports = app
