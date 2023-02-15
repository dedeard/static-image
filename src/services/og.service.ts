import path from 'path'
import { Application, NextFunction, Request, Response } from 'express'
import sharp from 'sharp'
import config from '../config'
import { explodeText, formatColor } from '../libs'

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
  sign: string
}

/**
 * Validate and convert request parameters.
 *
 */
function parseParams(req: RequestType) {
  let parsed = path.parse(req.params.name)
  let ext = (parsed.ext || '.webp').substring(1)
  let text = parsed.name
  let color = formatColor(req.query.color, '000')
  let bgColor = formatColor(req.query.bgcolor, 'fff')
  let sign = req.query.sign || ''

  if (!['webp', 'jpeg', 'jpg', 'png'].includes(ext)) ext = 'webp'

  return { ext, text, color, bgColor, sign } as Params
}

/**
 * Generate svg based on params.
 *
 */
function createSVG({ text, color, bgColor, sign }: Params) {
  const lines = explodeText(text, 45).split('\n')
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

    const buffer = await sharp(Buffer.from(createSVG(params)))
      .resize({ width: 1200, height: 630 })
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
  app.get('/og/:name', handler)
}
