import path from 'path'
import { Application, NextFunction, Request, Response } from 'express'
import got from 'got'
import sharp from 'sharp'
import isValidDomain from 'is-valid-domain'
import config from '../config'
import ApiError from '../shared/ApiError'
import fileType from 'file-type'

/**
 * Types.
 *
 */
type RequestType = Request<{ params: string; '0': string }, {}, {}, { [key: string]: string }>

type Params = {
  url: string
  format?: string
  height?: number
  width?: number
  quality: number
}

/**
 * Validate and convert request parameters.
 *
 */
function parseParams(req: RequestType) {
  const paramsIsDomain = isValidDomain(req.params.params, {
    allowUnicode: true,
  })
  const options: { [key: string]: string } = {}

  if (!paramsIsDomain) {
    for (let i of req.params.params.split(',')) {
      const ar = i.split('=')
      if (ar.length === 2) options[ar[0]] = ar[1]
    }
  }

  let url: string = paramsIsDomain ? path.join(req.params.params, req.params[0]) : req.params[0]
  url += '?' + new URLSearchParams(req.query).toString()
  let quality = 80
  let width: number | undefined
  let height: number | undefined
  let format: string | undefined = options.format || options.f

  const qQuality = Number(options.quality || options.q)
  if (!isNaN(qQuality) && qQuality > 0 && qQuality <= 100) quality = qQuality
  const qWidth = Number(options.width || options.w)
  if (!isNaN(qWidth) && qWidth > 0) width = qWidth
  const qHeight = Number(options.height || options.h)
  if (!isNaN(qHeight) && qHeight > 0) height = qHeight
  if (format && !['webp', 'jpeg', 'jpg', 'png'].includes(format)) format = undefined

  return { url, quality, width, height, format } as Params
}

/**
 * Dowload input file url.
 *
 */
async function download(url: URL, { timeout, maxSize }: { timeout: number; maxSize: number }) {
  return new Promise<Buffer>(async (resolve, reject) => {
    let size = 0
    const data: Uint8Array[] = []
    const req = got.stream(url, { timeout })
    req.on('data', (chunk) => {
      size += chunk.length
      data.push(chunk)
      if (size > maxSize) {
        req.destroy(new ApiError(400, 'Content Too Large'))
      }
    })
    req.on('end', () => resolve(Buffer.concat(data)))
    req.on('error', (e) => {
      if (e.name === 'TimeoutError') {
        reject(new ApiError(400, 'Request timeout', e.message))
      } else {
        reject(e)
      }
    })
  })
}

/**
 * Handle http requests.
 *
 */
async function handler(req: RequestType, res: Response, next: NextFunction) {
  const params = parseParams(req)
  let url: URL
  let buffer: Buffer
  let format: fileType.FileTypeResult | undefined
  try {
    url = new URL(`http://${params.url}`)
  } catch (e: any) {
    return next(new ApiError(400, 'The given url is invalid.', e.stack))
  }

  try {
    buffer = await download(url, {
      timeout: config.image.downloadTimeout,
      maxSize: config.image.maxInputSize,
    })
  } catch (e: any) {
    if (e.response) return next(new ApiError(e.response.statusCode, e.message, e.stack))
    return next(new ApiError(400, e.message, e.stack))
  }

  try {
    format = await fileType.fromBuffer(buffer)
  } catch (e: any) {
    return next(e)
  }

  try {
    await sharp(buffer)
      .resize({ width: params.width, height: params.height })
      // @ts-expect-error
      .toFormat(params.format || format?.ext || 'webp', { quality: params.quality })
      .toBuffer((err, buffer, info) => {
        if (err) return next(err)
        res.header({
          'cache-control': `public, max-age=${config.cacheAge}, must-revalidate`,
          'content-type': 'image/' + info.format,
          'content-length': info.size,
        })
        res.end(buffer, 'binary')
      })
  } catch (e: any) {
    next(new ApiError(400, e.message, e.stack))
  }
}

/**
 * Routing.
 *
 */
export default function (app: Application) {
  app.get('/image/:params/*', handler)
}
