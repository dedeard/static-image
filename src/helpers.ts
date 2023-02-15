export function normalizeHex(color: string) {
  if (color.substring(0, 1) === '#') color = color.substring(1)
  return color
}

export function isValidHex(color: string) {
  color = normalizeHex(color)
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
