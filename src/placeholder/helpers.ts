import { isValidHex, normalizeHex } from '../helpers'

type Params = {
  height?: number
  width?: number
  bgColor?: string
  color?: string
  format?: 'webp' | 'jpeg' | 'png'
}

export function parseParams(str: string) {
  const arr = str.split(',')
  const params: Params = {}

  for (let i of arr) {
    const ar = i.split('=')
    const key = ar[0]?.toLowerCase()
    const val = ar[1]?.toLowerCase()
    const valInt = Number(val)

    if (key === 'h' && !isNaN(valInt) && valInt > 0) {
      params.height = valInt
    }
    if (key === 'w' && !isNaN(valInt) && valInt > 0) {
      params.width = valInt
    }
    if ((key === 'f' && val == 'webp') || val == 'jpeg' || val == 'png') {
      params.format = val
    }
    if (key === 'b' && isValidHex(val)) {
      params.bgColor = normalizeHex(val)
    }
    if (key === 'c' && isValidHex(val)) {
      params.color = normalizeHex(val)
    }
  }

  return params
}

export function getSvgImage(options: Params) {
  return Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
    <rect fill="#${options.bgColor || 'd2dae2'}" width="1000" height="1000" />
    <path fill="#${
      options.color || '1e272e'
    }" d="M587,555.09a14.54,14.54,0,0,1-14.5,14.49h-145A14.54,14.54,0,0,1,413,555.09V444.91a14.54,14.54,0,0,1,14.5-14.49h145A14.54,14.54,0,0,1,587,444.91ZM427.52,442a3,3,0,0,0-2.9,2.9V555.08a3,3,0,0,0,2.9,2.9h145a3,3,0,0,0,2.9-2.9V444.91a3,3,0,0,0-2.9-2.9Zm26.1,46.39A17.4,17.4,0,1,1,471,471,17.41,17.41,0,0,1,453.62,488.4Zm110.16,58H436.21V529l29-29,14.49,14.49,46.39-46.38,37.69,37.69Z" />
  </svg>
`)
}
