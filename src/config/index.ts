export const PORT = Number(process.env.PORT || 4000)
export const IMG_CONFIG = {
  maxInputSize: 1024 * 1024 * Number(process.env.MAX_INPUT_IMAGE_SIZE || 5), //MB
  downloadTimeout: 1000 * Number(process.env.DOWNLOAD_TIMEOUT || 5), // Seconds
  cacheAge: 60 * 60 * Number(process.env.FILE_AGE || 24), // Hours
}
