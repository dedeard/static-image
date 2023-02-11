const fs = require('fs')
const fileType = require('file-type')

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
  if (!exists) await fs.promises.mkdir(path, { recursive: true })
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
    const allowed = ['h', 'w', 'q']
    if (allowed.includes(key) && isPositiveNumber(val)) {
      options[key] = Number(val)
    }
  }

  return options
}

const getFormat = async (buffer) => {
  const type = await fileType.fromBuffer(buffer)
  const supported = ['image/png', 'image/jpeg', 'image/webp']
  if (!supported.includes(type?.mime || '')) {
    throw new Error('Image format not supported')
  }
  const [_, ext] = type.mime.split('/')
  return { ext, mime: type.mime }
}

module.exports = {
  pathExists,
  mkdirIfNotExists,
  isPositiveNumber,
  parseOptions,
  getFormat,
}
