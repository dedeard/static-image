import chai from 'chai'
import chaiHttp from 'chai-http'
import Application from '../app'
import ogService from './og.service'
import { getFormatFromBuffer } from '../libs'

chai.use(chaiHttp)

const { app } = new Application(ogService)
const { expect, request } = chai

describe('Testing OG Service', () => {
  describe('GET /og/Hello World', () => {
    it('Should be success generate og image.', async () => {
      const res = await request(app).get('/og/Hello World')
      expect(res.status).to.equal(200)
    })

    it('Should be success generating webp format.', async () => {
      const res = await request(app).get('/og/Hello World')
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.ext).to.equal('webp')
      expect(format.mime).to.equal('image/webp')
    })
  })

  describe('GET /og/Hello World.wrong', () => {
    it('Should be success generate og image.', async () => {
      const res = await request(app).get('/og/Hello World.wrong')
      expect(res.status).to.equal(200)
    })

    it('Should be success generating webp format.', async () => {
      const res = await request(app).get('/og/Hello World.wrong')
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.ext).to.equal('webp')
      expect(format.mime).to.equal('image/webp')
    })
  })

  describe('GET /og/Hello World.jpg', () => {
    it('Should be success generate og image.', async () => {
      const res = await request(app).get('/og/Hello World.jpg')
      expect(res.status).to.equal(200)
    })

    it('Should be success generating jpeg format.', async () => {
      const res = await request(app).get('/og/Hello World.jpg')
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.ext).to.be.oneOf(['jpg', 'jpeg'])
      expect(format.mime).to.equal('image/jpeg')
    })
  })

  describe('GET /og/Hello World.jpeg', () => {
    it('Should be success generate og image.', async () => {
      const res = await request(app).get('/og/Hello World.jpeg')
      expect(res.status).to.equal(200)
    })

    it('Should be success generating jpeg format.', async () => {
      const res = await request(app).get('/og/Hello World.jpeg')
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.ext).to.be.oneOf(['jpg', 'jpeg'])
      expect(format.mime).to.equal('image/jpeg')
    })
  })

  describe('GET /og/Hello World.png', () => {
    it('Should be success generate og image.', async () => {
      const res = await request(app).get('/og/Hello World.png')
      expect(res.status).to.equal(200)
    })

    it('Should be success generating png format.', async () => {
      const res = await request(app).get('/og/Hello World.png')
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.ext).to.equal('png')
      expect(format.mime).to.equal('image/png')
    })
  })
})
