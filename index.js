function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method !== 'GET') {
    res.statusCode = 405
    return res.end()
  }

  res.end(JSON.stringify({ status: 'ok' }))
}

module.exports = handler
