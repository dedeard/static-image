const config = {
  port: Number(process.env.PORT || 4000),
  cacheAge: 60 * 60 * Number(process.env.CACHE_AGE || 24),
  image: {
    maxInputSize: 1024 * 1024 * Number(process.env.IMAGE_MAX_INPUT_SIZE || 5),
    downloadTimeout: 1000 * Number(process.env.IMAGE_DOWNLOAD_TIMEOUT || 10),
  },
  avatar: {
    maxSize: Number(process.env.AVATAR_MAX_SIZE || 600),
  },
  colors: {
    dark: process.env.DEFAULT_COLOR_DARK || '#111827',
    light: process.env.DEFAULT_COLOR_LIGHT || '#f3f4f6',
  },
}

export default config
