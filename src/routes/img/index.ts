import express from 'express'
import cors from 'cors'
import sharp from 'sharp'
import { getFormat, parseParams, imageDownloader } from './functions'
import { IMG_CONFIG } from '../../config'
const { cacheAge } = IMG_CONFIG

const app = express.Router()

app.use<{ '0': string }>('*', cors(), async (req, res) => {
  res.removeHeader('Connection')
  res.removeHeader('Keep-Alive')

  if (req.method !== 'GET') return res.sendStatus(405)

  const routes = req.params[0].substring(1).split('/')
  if (routes.length < 2) return res.sendStatus(404)

  try {
    const options = parseParams(routes[0])
    const fileUrl = routes.splice(1).join('/')
    let buffer = await imageDownloader(fileUrl)
    const format = await getFormat(buffer, options.format)
    buffer = await sharp(buffer)
      .resize({ width: options.width, height: options.height })
      .toFormat(format.ext, { quality: options.quality })
      .toBuffer()

    res.setHeader(
      'cache-control',
      `public, max-age=${cacheAge}, must-revalidate`,
    )
    res.setHeader('content-type', format.mime)
    res.setHeader('content-length', buffer.length)
    res.end(buffer, 'binary')
  } catch (e: any) {
    res.statusCode = 500
    res.json({ message: e.message })
  }
})

export default app
