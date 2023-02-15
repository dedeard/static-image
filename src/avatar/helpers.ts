import config from '../config'
import { isValidHex, normalizeHex } from '../helpers'

type Params = {
  size: number
  bgColor: string
  textColor: string
  fontWeight: string
}

export function parseParams(str: string) {
  const arr = str.split(',')
  const params: Params = {
    bgColor: 'd2dae2',
    textColor: '1e272e',
    fontWeight: 'normal',
    size: 60,
  }

  for (let i of arr) {
    const ar = i.split('=')
    const key = ar[0] || ''
    const val = ar[1] || ''

    if (key === 's') {
      const int = Number(val)
      if (!isNaN(int) && int > 10 && int <= config.avatar.maxSize) {
        params.size = int
      }
    }
    if (key === 'b' && isValidHex(val)) {
      params.bgColor = normalizeHex(val)
    }
    if (key === 'c' && isValidHex(val)) {
      params.textColor = normalizeHex(val)
    }
    if (key === 'w' && val === 'bold') {
      params.fontWeight = 'bold'
    }
  }

  return params
}

export function getInitials(username: string) {
  let parts = username.split(/[ -]/)
  let initials = ''
  for (let i = 0; i < parts.length; i++) {
    initials += parts[i].charAt(0)
  }
  if (initials.length > 3 && initials.search(/[A-Z]/) !== -1) {
    initials = initials.replace(/[a-z]+/g, '')
  }
  initials = initials.substring(0, 3).toUpperCase()
  return initials
}

export function getSvgAvatar(username: string, options: Params) {
  const text = getInitials(username)
  let fontsize = 37
  if (text.length === 2) fontsize = 27
  if (text.length === 3) fontsize = 17

  return Buffer.from(`
  <svg  width="60" height="60" viewBox="0 0 60 60">
    <rect fill="#${options.bgColor}" x="0" y="0" width="60" height="60"/>
    <text x="50%" y="50%" dy=".35em" text-anchor="middle" fill="#${options.textColor}" font-family="sans-serif" font-weight="${options.fontWeight}" font-size="${fontsize}">${text}</text>
  </svg>
`)
}
