const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { JsonDB, Config } = require('node-json-db')
const shared = require('./shared')
const { tmpDir, fileAge } = require('./config')

const db = new JsonDB(new Config(tmpDir + '/db', true, false, '/'))

const create = async (key, buffer, options) => {
  const { ext, mime } = await shared.getFormat(buffer)
  const cacheName = path.join(tmpDir, key)
  buffer = await sharp(buffer)
    .resize({ width: options.w, height: options.h })
    .toFormat(ext, { quality: options.q })
    .toBuffer()
  await shared.mkdirIfNotExists(tmpDir)
  await fs.promises.writeFile(cacheName, buffer)
  await db.push('/' + key, Date.now())
  return { ext, mime, buffer }
}

const get = async (key) => {
  const cacheName = path.join(tmpDir, key)
  const buffer = await fs.promises.readFile(cacheName)
  const { ext, mime } = await shared.getFormat(buffer)
  return { ext, mime, buffer }
}

const exists = (key) => {
  const cacheName = path.join(tmpDir, key)
  return shared.pathExists(cacheName)
}

const removeIfExpired = async (key, createUnix) => {
  const createdAt = new Date(createUnix)
  const expiredAt = new Date(createdAt.getTime() + 60 * 60 * fileAge * 1000)
  const now = new Date()

  if (now > expiredAt) {
    const cacheName = path.join(tmpDir, key)
    const fileExists = await exists(key)
    if (fileExists) await fs.promises.unlink(cacheName)
    await db.delete(key)
  }
}

const autoRemoveExpired = (timeoutInSeconds = 60) => {
  let interval = setInterval(async () => {
    try {
      await db.reload()
      const data = await db.getData('/')
      for (let key in data) await removeIfExpired(key, data[key])
    } catch (e) {
      console.log(e)
    }
  }, 1000 * timeoutInSeconds)

  return () => {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }
}

module.exports = {
  db,
  create,
  get,
  exists,
  removeIfExpired,
  autoRemoveExpired,
}
