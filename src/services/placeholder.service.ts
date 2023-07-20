import path from 'path'
import { Application, NextFunction, Request, Response } from 'express'
import sharp from 'sharp'
import config from '../shared/config'
import { formatColor } from '../shared/libs'

/**
 * Types.
 *
 */
type RequestType = Request<{ params: string }, {}, {}, { [key: string]: string }>

type Params = {
  ext: 'webp' | 'jpeg' | 'jpg' | 'png' | 'svg'
  color: string
  bgColor: string
  height: number
  width: number
}

/**
 * Config
 *
 */
const supportedExt = ['webp', 'jpeg', 'jpg', 'png', 'svg']

/**
 * Validate and convert request parameters.
 *
 */
function parseParams(req: RequestType): Params {
  // Extract the file extension from the request path
  let ext = (path.parse(req.path).ext || '.svg').substring(1) as any;

  // Set default colors
  let color = formatColor(config.colors.dark);
  let bgColor = formatColor(config.colors.light);

  // Set default width and height
  let width = 640;
  let height = 480;

  // Check if the file extension is supported, otherwise use the default ('svg')
  if (!supportedExt.includes(ext)) {
    ext = 'svg';
  }

  // Extract parameters from the request
  const params = req.params.params.replace(/\.[^/.]+$/, "");
  const options: { [key: string]: string } = {};

  // Parse parameters and create options object
  for (let item of params.split(',')) {
    const [key, value] = item.split('=');
    if (key && value) {
      options[key] = value;
    }
  }

  // Update width and height if valid values are provided in the options
  const qWidth = Number(options.width || options.w);
  if (!isNaN(qWidth) && qWidth > 0) {
    width = qWidth;
  }

  const qHeight = Number(options.height || options.h);
  if (!isNaN(qHeight) && qHeight > 0) {
    height = qHeight;
  }

  // Update color and bgColor if valid values are provided in the options
  color = formatColor(options.color || options.c, config.colors.dark);
  bgColor = formatColor(options.bgcolor || options.b, config.colors.light);

  return { ext, color, bgColor, width, height }
}

/**
 * Generate svg based on params.
 *
 */
function createSVG({ color, bgColor, width, height, ext }: Params) {
  if (ext !== 'svg') {
    width === 1000
    height === 1000
  }
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
    <title>Placeholder</title>
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

    let buffer = Buffer.from(createSVG(params))
    if (params.ext !== 'svg') {
      buffer = await sharp(Buffer.from(createSVG(params)))
        .resize({ width: params.width, height: params.height })
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
  app.get(`/placeholder/:params`, handler)
}
