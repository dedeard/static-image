import path from 'path'
import { Application, NextFunction, Request, Response } from 'express'
import sharp from 'sharp'
import config from '../shared/config'
import { explodeText, formatColor } from '../shared/libs'

/**
 * Types.
 *
 */
type RequestType = Request<{ '0': string }, {}, {}, { [key: string]: string }>

type Params = {
  ext: 'webp' | 'jpeg' | 'jpg' | 'png' | 'svg'
  text: string
  color: string
  bgColor: string
  sign: string
}

/**
 * Validate and convert request parameters.
 *
 */
function parseParams(req: RequestType) {
  let parsed = path.parse(req.params['0'])
  let ext = (parsed.ext || '.webp').substring(1)
  let text = parsed.name && parsed.dir ? parsed.dir + '/' + parsed.name : parsed.name
  let color = formatColor(req.query.color || req.query.c, config.colors.dark)
  let bgColor = formatColor(req.query.bgcolor || req.query.b, config.colors.light)
  let sign = req.query.sign || req.query.s || ''

  if (!['webp', 'jpeg', 'jpg', 'png', 'svg'].includes(ext)) {
    ext = 'webp'
    text += parsed.ext
  }

  return { ext, text, color, bgColor, sign } as Params
}

/**
 * Generate svg based on params.
 *
 */
function createSVG({ text, color, bgColor, sign }: Params) {
  const lines = explodeText(text.replaceAll('/n', '\n'), 45).split('\n')
  const space = 55
  let translateY = space * -(lines.length / 2) - 15

  text = ''
  for (let line of lines) {
    translateY += space
    text += `<text transform="translate(0 ${translateY})" fill="#${color}" x="50%" y="50%" 
    text-anchor="middle" font-size="45" font-family="Ubuntu, sans-serif" font-weight="500">${line}</text>`
  }
  if (sign) {
    text += `<text fill="#${color}" x="50%" y="90%"
    text-anchor="middle" font-size="25" font-family="Ubuntu, sans-serif" font-weight="300">${sign}</text>`
  }
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
      <title>OG Image</title>
      <rect fill="#${bgColor}" width="1200" height="630" />
      ${text}
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

    let buffer = Buffer.from(createSVG(params))
    if (params.ext !== 'svg') {
      buffer = await sharp(buffer)
        .resize({ width: 1200, height: 630 })
        .toFormat(params.ext)
        .toBuffer()
    }

    let mime = `image/${params.ext}`
    if (params.ext === 'jpg') mime = `image/jpeg`
    if (params.ext === 'svg') mime = `image/svg+xml`

    res.header({
      'cache-control': `public, max-age=${config.cacheAge}, must-revalidate`,
      'content-type': mime,
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
  app.get('/og/*', handler)
}
