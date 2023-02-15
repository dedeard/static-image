import path from 'path'
import { Application, NextFunction, Request, Response } from 'express'
import sharp from 'sharp'
import config from '../config'
import { createInitials, formatColor } from '../libs'

/**
 * Types.
 *
 */
type RequestType = Request<{ name: string }, {}, {}, { [key: string]: string }>

type Params = {
  ext: 'webp' | 'jpeg' | 'jpg' | 'png'
  text: string
  color: string
  bgColor: string
  size: number
  weight: '300' | '400' | '500' | '700'
}

/**
 * Validate and convert request parameters.
 *
 */
function parseParams(req: RequestType) {
  let parsed = path.parse(req.params.name)
  let ext = (parsed.ext || '.webp').substring(1)
  let text = parsed.name
  let color = formatColor(req.query.color, config.colors.dark)
  let bgColor = formatColor(req.query.bgcolor, config.colors.light)
  let weight = req.query.weight || '400'

  if (!['webp', 'jpeg', 'jpg', 'png'].includes(ext)) ext = 'webp'
  if (!['300', '400', '500', '700'].includes(ext)) weight = '400'

  return { ext, text, color, bgColor, weight } as Params
}

/**
 * Generate svg based on params.
 *
 */
function createSVG({ text, color, bgColor, weight }: Params) {
  const initials = createInitials(text)
  let fontsize = 37
  if (initials.length === 2) fontsize = 27
  if (initials.length === 3) fontsize = 17
  const translateY = fontsize / 3

  return `
  <svg  width="60" height="60" viewBox="0 0 60 60">
    <rect fill="#${bgColor}" x="0" y="0" width="60" height="60"/>
    <text fill="#${color}" x="50%" y="50%" transform="translate(0 ${translateY})" text-anchor="middle"
    font-family="Ubuntu, sans-serif" font-weight="${weight}" font-size="${fontsize}">${initials}</text>
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
      .resize({ width: params.size, height: params.size })
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
  app.get('/avatar/:name', handler)
}
