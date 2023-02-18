import path from 'path'
import http from 'http'
import express, { Request, Response, Application } from 'express'
import cors from 'cors'
import config from './shared/config'
import imageService from './services/image.service'
import avatarService from './services/avatar.service'
import placeholderService from './services/placeholder.service'
import ogService from './services/og.service'

class App {
  app: Application
  server: http.Server

  constructor(service4test?: (app: Application) => void) {
    this.app = express()
    this.server = http.createServer(this.app)

    this.app.disable('x-powered-by')
    this.app.enable('trust proxy')

    this.app.use(cors())

    if (service4test) {
      // Test routing
      service4test(this.app)
    } else {
      // Main routing
      imageService(this.app)
      avatarService(this.app)
      placeholderService(this.app)
      ogService(this.app)
    }

    this.app.use(express.static(path.join(__dirname, '../public')))

    this.catchErrors()
  }

  catchErrors() {
    // Catch 404
    this.app.use((req, res) => {
      res.statusCode = 404
      res.end()
    })

    // Catch runtime error
    this.app.use((err: any, req: Request, res: Response, next: any) => {
      console.error({
        url: req.originalUrl,
        name: err.name,
        statusCode: err.statusCode,
        message: err.message,
        stack: err.stack,
      })
      res.statusCode = err.statusCode || 500
      res.send(err.message)
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
