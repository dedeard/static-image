const path = require('path')

const port = Number(process.env.PORT || 4000)
const maxInputSize = 1024 * 1024 * Number(process.env.MAX_INPUT_IMAGE_SIZE || 5) //MB
const tmpDir = process.env.TMP_DIR || path.join(__dirname, '../tmp')
const fileAge = Number(process.env.FILE_AGE || 24) // Hours
const downloadTimeout = Number(process.env.DOWNLOAD_TIMEOUT || 10) // Seconds

module.exports = {
  port,
  maxInputSize,
  tmpDir,
  fileAge,
  downloadTimeout,
}
