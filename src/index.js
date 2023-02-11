const http = require('http')
const app = require('./app')
const { autoRemoveExpired } = require('./imageManager')
const { port } = require('./config')

http.createServer(app).listen(port, () => {
  autoRemoveExpired()
  console.log('server is running on port:' + port)
})
