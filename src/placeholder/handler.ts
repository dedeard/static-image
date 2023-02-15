import sharp from 'sharp'
import catchAsync from '../catchAsync'
import config from '../config'
import * as helpers from './helpers'

const handler = catchAsync(async (req, res) => {
  if (req.method !== 'GET') {
    res.statusCode = 405
    return res.end()
  }

  const routes = req.params[0].split('/')
  if (routes.length !== 1) return res.sendStatus(404)

  const options = helpers.parseParams(routes[0])

  let buffer = helpers.getSvgImage(options)

  buffer = await sharp(buffer)
    .resize({ width: options.width, height: options.height })
    .toFormat(options.format || 'webp')
    .toBuffer()

  res.setHeader(
    'cache-control',
    `public, max-age=${config.cacheAge}, must-revalidate`,
  )
  res.setHeader('content-type', `image/${options.format || 'webp'}`)
  res.setHeader('content-length', buffer.length)
  res.end(buffer, 'binary')
})

export default handler
