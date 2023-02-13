import path from 'path'
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
  if (routes.length !== 2) return res.sendStatus(404)

  const options = helpers.parseParams(routes[0])
  const avatarText = path.parse(routes[1]).name

  let buffer = helpers.getSvgAvatar(avatarText, options)

  buffer = await sharp(buffer)
    .resize({ width: options.size, height: options.size })
    .toFormat('jpeg')
    .toBuffer()

  res.setHeader(
    'cache-control',
    `public, max-age=${config.cacheAge}, must-revalidate`,
  )
  res.setHeader('content-type', 'image/jpeg')
  res.setHeader('content-length', buffer.length)
  res.end(buffer, 'binary')
})

export default handler
