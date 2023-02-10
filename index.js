const { createServer } = require('http')

createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method !== 'GET') {
    res.statusCode = 405
    return res.end()
  }

  res.end(JSON.stringify({ status: 'ok' }))
}).listen(process.env.PORT || 4000)
