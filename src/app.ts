import http from 'http'
import express, { Request, Response } from 'express'
import cors from 'cors'
import config from './config'
import imageRoutes from './image/routes'

class App {
  app: express.Application
  server: http.Server

  constructor() {
    this.app = express()
    this.server = http.createServer(this.app)

    this.app.disable('x-powered-by')
    this.app.enable('trust proxy')

    this.app.use(cors())

    this.router()
  }

  router() {
    this.app.use('/image', imageRoutes)

    // Catch 404
    this.app.use((req, res) => {
      res.statusCode = 404
      res.end()
    })

    // Catch runtime error
    this.app.use((err: any, req: Request, res: Response, next: any) => {
      console.error(err)
      res.statusCode = 500
      res.end()
    })
  }

  onError(error: any) {
    if (error.syscall !== 'listen') throw error
    switch (error.code) {
      case 'EACCES':
        console.error(`Port ${config.port} requires elevated privileges`)
        process.exit(1)
      case 'EADDRINUSE':
        console.error(`Port ${config.port} is already in use`)
        process.exit(1)
      default:
        throw error
    }
  }

  listen(): http.Server {
    this.server.listen(config.port, () => {
      console.info(`Listening on port:${config.port}`)
    })
    this.server.on('error', this.onError)
    return this.server
  }
}

export default App
