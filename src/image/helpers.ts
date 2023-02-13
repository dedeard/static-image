import https from 'https'
import fileType from 'file-type'
import config from '../config'
import type { Params, SupportMime } from './types'

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
    if (key === 'q' && !isNaN(valInt) && valInt > 0 && valInt <= 100) {
      params.quality = valInt
    }
    if (key === 'f' && val == 'webp') {
      params.format = 'webp'
    }
  }

  return params
}

export async function getFormatFromBuffer(buffer: Buffer) {
  const type = await fileType.fromBuffer(buffer)
  if (!type) throw new Error('Failed to get format')
  return type
}

export function isMimeSupported(mime: any) {
  const supported: SupportMime[] = ['image/png', 'image/jpeg', 'image/webp']
  if (supported.includes(mime)) return true
  return false
}

export function urlToBuffer(url: URL) {
  return new Promise<Buffer>(async (resolve, reject) => {
    const options = { timeout: config.image.downloadTimeout }
    const req = https.get(url, options, (res) => {
      const data: Uint8Array[] = []
      let size = 0
      res.on('data', (chunk) => {
        size += chunk.length
        data.push(chunk)
        if (size > config.image.maxInputSize) {
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
