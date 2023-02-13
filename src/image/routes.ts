import express from 'express'
import handler from './handler'

const app = express.Router()

app.use('*', handler)

export default app
