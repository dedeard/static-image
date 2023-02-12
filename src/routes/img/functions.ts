import https from 'https'
import fileType from 'file-type'
import { IMG_CONFIG } from '../../config'

const { maxInputSize, downloadTimeout } = IMG_CONFIG

export function parseParams(str: string) {
  const arr = str.split(',')
  const params: {
    height?: number
    width?: number
    quality?: number
    format?: 'webp'
  } = {}

  for (let i of arr) {
    const ar = i.split('=')
    const key = ar[0]?.toLowerCase()
    const val = ar[1]?.toLowerCase()
    const valInt = Number(val)

    switch (key) {
      case 'h':
        if (!isNaN(valInt) && valInt > 0) params.height = valInt
        break
      case 'w':
        if (!isNaN(valInt) && valInt > 0) params.width = valInt
        break
      case 'q':
        if (!isNaN(valInt) && valInt > 0 && valInt <= 100)
          params.quality = valInt
        break
      case 'f':
        if (val == 'webp') params.format = 'webp'
        break
    }
  }

  return params
}

export async function getFormat(buffer: Buffer, forceFormat?: 'webp') {
  if (forceFormat === 'webp') {
    return {
      ext: 'webp' as 'webp',
      mime: 'image/webp' as 'image/webp',
    }
  }
  const type = await fileType.fromBuffer(buffer)
  const mime = type?.mime || ''
  const supported = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
  if (!supported.includes(mime)) throw new Error('Image format not supported')
  const [_, ext] = mime.split('/') as [string, string]
  return {
    ext: ext as 'png' | 'jpeg' | 'webp' | 'gif',
    mime: mime as 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif',
  }
}

export function imageDownloader(url: string) {
  return new Promise<Buffer>(async (resolve, reject) => {
    const options = { timeout: downloadTimeout }
    const req = https.get('https://' + url, options, (res) => {
      const data: Uint8Array[] = []
      let size = 0
      res.on('data', (chunk) => {
        size += chunk.length
        data.push(chunk)
        if (size > maxInputSize) {
          res.destroy(new Error('Content Too Large'))
        }
      })
      res.on('end', () => resolve(Buffer.concat(data)))
      res.on('error', reject)
    })
    req.on('timeout', () => req.destroy(new Error('Request timeout')))
    req.on('error', reject)
    req.end()
  })
}
