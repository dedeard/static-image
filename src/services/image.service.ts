import path from 'path'
import { Application, NextFunction, Request, Response } from 'express'
import sharp from 'sharp'
import isValidDomain from 'is-valid-domain'
import config from '../config'
import { getFormatFromBuffer, urlToBuffer } from '../libs'

/**
 * Types.
 *
 */
type RequestType = Request<
  { params: string; '0': string },
  {},
  {},
  { [key: string]: string }
>

type SupportMime = 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp'

type SupportExt = 'webp' | 'jpeg' | 'jpg' | 'png'

type Params = {
  url: string
  format?: SupportExt
  height?: number
  width?: number
  quality: number
}

/**
 * Validate and convert request parameters.
 *
 */
function parseParams(req: RequestType) {
  const paramsIsDomain = isValidDomain(req.params.params)
  const options: { [key: string]: string } = {}

  if (!paramsIsDomain) {
    for (let i of req.params.params.split(',')) {
      const ar = i.split('=')
      if (ar.length === 2) options[ar[0]] = ar[1]
    }
  }

  let url: string = paramsIsDomain
    ? path.join(req.params.params, req.params[0])
    : req.params[0]
  url += '?' + new URLSearchParams(req.query).toString()
  let quality = 100
  let width: number | undefined
  let height: number | undefined
  let format: string | undefined = options.format

  const qQuality = Number(options.quality)
  if (!isNaN(qQuality) && qQuality > 0 && qQuality <= 100) quality = qQuality
  const qWidth = Number(options.width)
  if (!isNaN(qWidth) && qWidth > 0) height = qWidth
  const qHeight = Number(options.height)
  if (!isNaN(qHeight) && qHeight > 0) height = qHeight
  if (format && !['webp', 'jpeg', 'jpg', 'png'].includes(format))
    format = undefined

  return { url, quality, width, height, format } as Params
}

/**
 * Handle http requests.
 *
 */
async function handler(req: RequestType, res: Response, next: NextFunction) {
  try {
    const params = parseParams(req)

    const url = new URL(`http://${params.url}`)

    let buffer = await urlToBuffer(url, {
      timeout: config.image.downloadTimeout,
      maxSize: config.image.maxInputSize,
    })

    let ext: SupportExt
    let mime: SupportMime
    let format = await getFormatFromBuffer(buffer)
    const supported: SupportMime[] = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
    ]
    // @ts-expect-error
    if (!supported.includes(format.mime))
      throw new Error('The given file is not supported.')

    if (params.format) {
      ext = params.format
      mime = `image/${params.format}`
    } else {
      ext = format.ext as SupportExt
      mime = format.mime as SupportMime
    }

    buffer = await sharp(buffer)
      .resize({ width: params.width, height: params.height })
      .toFormat(ext, { quality: params.quality })
      .toBuffer()

    res.header({
      'cache-control': `public, max-age=${config.cacheAge}, must-revalidate`,
      'content-type': mime == 'image/jpg' ? 'image/jpeg' : mime,
      'content-length': buffer.length,
    })
    res.end(buffer, 'binary')
  } catch (e: any) {
    next(e)
  }
}

/**
 * Routing.
 *
 */
export default function (app: Application) {
  app.get('/image/:params/*', handler)
}
