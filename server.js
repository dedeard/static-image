const { createServer } = require('http')
const handler = require('.')

createServer(handler).listen(process.env.PORT || 4000)
