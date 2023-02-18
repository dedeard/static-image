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
  maxLength: number
}

/**
 * Validate and convert request parameters.
 *
 */
function parseParams(req: RequestType) {
  let parsed = path.parse(req.params.name)
  let ext = (parsed.ext || '.webp').substring(1)
  let text = parsed.name
  let color = formatColor(req.query.color || req.query.c, config.colors.dark)
  let bgColor = formatColor(req.query.bgcolor || req.query.b, config.colors.light)
  let size = 80
  let maxLength: number = 2

  if (!['webp', 'jpeg', 'jpg', 'png'].includes(ext)) ext = 'webp'
  const qSize = Number(req.query.size || req.query.s)
  if (!isNaN(qSize) && qSize > 0) size = qSize
  const qMaxLength = Number(req.query.maxLength || req.query.m)
  if (!isNaN(qMaxLength) && qMaxLength > 0 && qMaxLength <= 3) maxLength = qMaxLength

  return { ext, text, color, bgColor, size, maxLength } as Params
}

/**
 * Generate svg based on params.
 *
 */
function createSVG({ text, color, bgColor, maxLength }: Params) {
  const initials = createInitials(text, maxLength)
  let fontsize = 37
  if (initials.length === 2) fontsize = 27
  if (initials.length === 3) fontsize = 17
  const translateY = fontsize / 3

  return `
  <svg  width="60" height="60" viewBox="0 0 60 60">
    <rect fill="#${bgColor}" x="0" y="0" width="60" height="60"/>
    <text fill="#${color}" x="50%" y="50%" transform="translate(0 ${translateY})" text-anchor="middle"
    font-family="Ubuntu, sans-serif" font-weight="semiBold" font-size="${fontsize}">${initials}</text>
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
      'content-type': `image/${params.ext == 'jpg' ? 'jpeg' : params.ext}`,
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
