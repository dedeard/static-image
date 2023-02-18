import got from 'got'
import fileType from 'file-type'

export function normalizeHex(color: string) {
  if (color.substring(0, 1) === '#') color = color.substring(1)
  return color
}

export function isValidHex(color: string) {
  switch (color.length) {
    case 3:
      return /^[0-9A-F]{3}$/i.test(color)
    case 6:
      return /^[0-9A-F]{6}$/i.test(color)
    case 8:
      return /^[0-9A-F]{8}$/i.test(color)
    default:
      return false
  }
}

export function formatColor(color?: string, defaultColor?: string) {
  color = normalizeHex(color || '')
  if (isValidHex(color)) return color
  return normalizeHex(defaultColor || '')
}

export function explodeText(text: string, max: number): string {
  if (text == null) return ''
  if (text.length <= max) return text
  const nextNewLine = /\n/.exec(text)

  const lineLength = nextNewLine ? nextNewLine.index : text.length
  if (lineLength <= max) {
    const line = text.substring(0, lineLength)
    const rest = text.substring(lineLength + 1)
    return line + '\n' + explodeText(rest, max)
  } else {
    let line = text.substring(0, max)
    let rest = text.substring(max)

    const res = /([\s])[^\s]*$/.exec(line)
    if (res) {
      line = text.substring(0, res.index)
      rest = text.substring(res.index + 1)
    } else {
      line = line + '-'
    }
    return line + '\n' + explodeText(rest, max)
  }
}

export function createInitials(nickname: string, maxLength: number) {
  let parts = nickname.split(/[ -]/)
  let initials = ''
  for (let i = 0; i < parts.length; i++) {
    initials += parts[i].charAt(0)
  }
  if (initials.length > 3 && initials.search(/[A-Z]/) !== -1) {
    initials = initials.replace(/[a-z]+/g, '')
  }
  initials = initials.substring(0, maxLength).toUpperCase()
  return initials
}

export async function urlToBuffer(url: URL, { timeout, maxSize }: { timeout: number; maxSize: number }) {
  return new Promise<Buffer>(async (resolve, reject) => {
    let size = 0
    const data: Uint8Array[] = []
    const req = got.stream(url, { timeout })
    req.on('data', (chunk) => {
      size += chunk.length
      data.push(chunk)
      if (size > maxSize) {
        req.destroy(new Error('Content Too Large'))
      }
    })
    req.on('end', () => resolve(Buffer.concat(data)))
    req.on('error', (err) => {
      if (err.name === 'TimeoutError') {
        reject(new Error('Request timeout'))
      } else {
        reject(err)
      }
    })
  })
}

export async function getFormatFromBuffer(buffer: Buffer) {
  const type = await fileType.fromBuffer(buffer)
  if (!type) throw new Error('Failed to get format')
  return type
}
