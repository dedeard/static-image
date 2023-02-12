import http from 'http'
import express, { Request, Response, Router } from 'express'
import { PORT } from './config'
import imgRouter from './routes/img'

class App {
  app: express.Application
  server: http.Server

  constructor(router?: Router) {
    this.app = express()
    this.server = http.createServer(this.app)

    this.config()
    this.router(router)
  }

  config() {
    this.app.disable('x-powered-by')
    this.app.enable('trust proxy')
  }

  router(router?: Router) {
    if (router) {
      // for unit testing.
      return this.app.use(router)
    }
    this.app.use('/img', imgRouter)
    this.app.use(this.catch404)
    this.app.use(this.catchRuntimeError)
  }

  catch404(req: Request, res: Response) {
    res.statusCode = 404
    res.end()
  }

  catchRuntimeError(err: any, req: Request, res: Response, _: any) {
    console.error(err)
    res.statusCode = 500
    res.end()
  }

  onError(error: any) {
    if (error.syscall !== 'listen') throw error
    switch (error.code) {
      case 'EACCES':
        console.error(`Port ${PORT} requires elevated privileges`)
        process.exit(1)
      case 'EADDRINUSE':
        console.error(`Port ${PORT} is already in use`)
        process.exit(1)
      default:
        throw error
    }
  }

  listen(): http.Server {
    this.server.listen(PORT, () => {
      console.info(`Listening on port:${PORT}`)
    })
    this.server.on('error', this.onError)
    return this.server
  }
}

export default App
