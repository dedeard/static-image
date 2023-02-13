const config = {
  port: Number(process.env.PORT || 4000),
  cacheAge: 60 * 60 * Number(process.env.CACHE_AGE || 24),
  image: {
    maxInputSize: 1024 * 1024 * Number(process.env.IMAGE_MAX_INPUT_SIZE || 5),
    downloadTimeout: 1000 * Number(process.env.IMAGE_DOWNLOAD_TIMEOUT || 5),
  },
  avatar: {
    maxSize: Number(process.env.AVATAR_MAX_SIZE || 600),
  },
}

export default config
