import path from 'path'
import { Application, NextFunction, Request, Response } from 'express'
import sharp from 'sharp'
import config from '../config'
import { formatColor } from '../libs'

/**
 * Types.
 *
 */
type RequestType = Request<{ ext?: string }, {}, {}, { [key: string]: string }>

type Params = {
  ext: 'webp' | 'jpeg' | 'jpg' | 'png'
  color: string
  bgColor: string
  height: number
  width: number
}

/**
 * Validate and convert request parameters.
 *
 */
function parseParams(req: RequestType) {
  let ext = (path.parse(req.path).ext || '.webp').substring(1)
  let color = formatColor(req.query.color, '000')
  let bgColor = formatColor(req.query.bgcolor, 'fff')
  let width = 640
  let height = 480

  if (!['webp', 'jpeg', 'jpg', 'png'].includes(ext)) ext = 'webp'
  const qHeight = Number(req.query.height)
  if (!isNaN(qHeight) && qHeight > 0) height = qHeight
  const qWidth = Number(req.query.width)
  if (!isNaN(qWidth) && qWidth > 0) width = qWidth

  return { ext, color, bgColor, width, height } as Params
}

/**
 * Generate svg based on params.
 *
 */
function createSVG({ color, bgColor }: Params) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
    <rect fill="#${bgColor}" width="1000" height="1000" />
    <path fill="#${color}" d="M587,555.09a14.54,14.54,0,0,1-14.5,14.49h-145A14.54,
    14.54,0,0,1,413,555.09V444.91a14.54,14.54,0,0,1,14.5-14.49h145A14.54,14.54,0,0,
    1,587,444.91ZM427.52,442a3,3,0,0,0-2.9,2.9V555.08a3,3,0,0,0,2.9,2.9h145a3,3,0,0,
    0,2.9-2.9V444.91a3,3,0,0,0-2.9-2.9Zm26.1,46.39A17.4,17.4,0,1,1,471,471,17.41,
    17.41,0,0,1,453.62,488.4Zm110.16,58H436.21V529l29-29,14.49,14.49,46.39-46.38,
    37.69,37.69Z" />
  </svg>
  `
}

/**
 * Handle http requests.
 *
 */
async function handler(req: RequestType, res: Response, next: NextFunction) {
  try {
    const params = parseParams(req)

    const buffer = await sharp(Buffer.from(createSVG(params)))
      .resize({ width: params.width, height: params.height })
      .toFormat(params.ext)
      .toBuffer()

    res.header({
      'cache-control': `public, max-age=${config.cacheAge}, must-revalidate`,
      'content-type': `image/${params.ext}`,
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
  const exts = ['', '.webp', '.jpeg', '.jpg', '.png']
  for (let ext of exts) {
    app.get(`/placeholder${ext}`, handler)
  }
}
