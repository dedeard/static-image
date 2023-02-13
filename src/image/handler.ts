import sharp from 'sharp'
import catchAsync from '../catchAsync'
import config from '../config'
import * as helpers from './helpers'
import { SupportExt } from './types'

const handler = catchAsync(async (req, res) => {
  if (req.method !== 'GET') {
    res.statusCode = 405
    return res.end()
  }

  const routes = req.params[0].split('/')
  if (routes.length < 2) return res.sendStatus(404)

  const options = helpers.parseParams(routes[0])
  const fileUrl = new URL('https://' + routes.splice(1).join('/'))
  let buffer = await helpers.urlToBuffer(fileUrl)
  let format = await helpers.getFormatFromBuffer(buffer)

  if (options.format === 'webp') {
    format = {
      mime: 'image/webp',
      ext: 'webp',
    }
  } else if (!helpers.isMimeSupported(format.mime)) {
    throw new Error('File format not supported')
  }

  buffer = await sharp(buffer)
    .resize({ width: options.width, height: options.height })
    .toFormat(format.ext as SupportExt, { quality: options.quality })
    .toBuffer()

  res.setHeader(
    'cache-control',
    `public, max-age=${config.cacheAge}, must-revalidate`,
  )
  res.setHeader('content-type', format.mime)
  res.setHeader('content-length', buffer.length)
  res.end(buffer, 'binary')
})

export default handler
