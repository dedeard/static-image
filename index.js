const { createServer } = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const sharp = require('sharp')
const fileType = require('file-type')
const { JsonDB, Config } = require('node-json-db')

const db = new JsonDB(new Config('db', true, false, '/'))

const pathExists = async (path) => {
  try {
    await fs.promises.access(path)
    return true
  } catch {
    return false
  }
}

const mkdirIfNotExists = async (path) => {
  const exists = await pathExists(path)
  if (!exists) await fs.promises.mkdir(path)
}

const isPositiveNumber = (str) => {
  const int = Number(str)
  return !isNaN(int) && int > 0
}

const parseOptions = (str) => {
  const arr = str.split(',')
  const options = {}

  for (let i of arr) {
    const [key, val] = i.split('=')
    if (['h', 'w', 'q'].includes(key) && isPositiveNumber(val)) {
      options[key] = Number(val)
    }
  }
  return options
}

const getFormat = async (buffer) => {
  const type = await fileType.fromBuffer(buffer)
  let ext
  switch (type?.mime || '') {
    case 'image/png':
      ext = 'png'
      break
    case 'image/jpeg':
      ext = 'jpeg'
      break
    case 'image/webp':
      ext = 'webp'
      break
    default:
      throw new Error('Image format not supported')
  }
  return { ext, mime: type.mime }
}

const downloadImage = async (url) => {
  const maxSize = 1024 * 1024 * 5 //5 MB
  return new Promise(async (resolve, reject) => {
    https.get('https://' + url, (res) => {
      const data = []
      let size = 0

      res.on('data', (chunk) => {
        size += chunk.length
        data.push(chunk)
        if (size > maxSize) {
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
  })
}

createServer(async (req, res) => {
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
    const options = parseOptions(routes[0])
    const fileUrl = routes.splice(1).join('/')

    const key = crypto.createHash('md5').update(req.url).digest('hex')
    const cacheName = path.join(__dirname, 'cache', key)
    const fileExists = await pathExists(cacheName)
    let buffer, mime
    if (!fileExists) {
      buffer = await downloadImage(fileUrl)
      const format = await getFormat(buffer)
      mime = format.mime
      buffer = await sharp(buffer)
        .resize({ width: options.w, height: options.h })
        .toFormat(format.ext, { quality: options.q })
        .toBuffer()

      await mkdirIfNotExists(path.join(__dirname, 'cache'))
      await fs.promises.writeFile(cacheName, buffer)
      await db.push('/' + key, Date.now())
    } else {
      buffer = await fs.promises.readFile(cacheName)
      const format = await getFormat(buffer)
      mime = format.mime
    }

    res.setHeader('Cache-control', 'public, max-age=86400')
    res.setHeader('content-type', mime)
    res.end(buffer, 'binary')
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.end(JSON.stringify(e))
  }
}).listen(process.env.PORT || 4000)

setInterval(async () => {
  try {
    await db.reload()
    const data = await db.getData('/')
    for (let key in data) {
      const createdAt = new Date(data[key])
      const expiredAt = new Date(createdAt.getTime() + 60 * 60 * 24 * 1000)
      const now = new Date()

      if (now > expiredAt) {
        const cacheName = path.join(__dirname, 'cache', key)
        const fileExists = await pathExists(cacheName)
        if (fileExists) await fs.promises.unlink(cacheName)
        await db.delete(key)
      }
    }
  } catch (e) {
    console.log(e)
  }
}, 1000 * 60)
