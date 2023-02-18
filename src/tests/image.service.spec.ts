import chai from 'chai'
import chaiHttp from 'chai-http'
import Application from '../app'
import imageService from '../services/image.service'
import { getFormatFromBuffer } from '../shared/libs'

chai.use(chaiHttp)

const imgUrl = 'cdn.dedeard.my.id/placeholder.jpg'

const { app } = new Application(imageService)
const { expect, request } = chai

describe('Testing Image Service', () => {
  describe(`GET /image/${imgUrl}`, () => {
    it('Should be success generate image.', async () => {
      const res = await request(app).get(`/image/${imgUrl}`)
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.mime).to.equal(res.header['content-type'])
    })
  })

  describe(`GET /image/format=webp/${imgUrl}`, () => {
    it('Should be success generate image.', async () => {
      const res = await request(app).get(`/image/format=webp/${imgUrl}`)
      expect(res.status).to.equal(200)
    })

    it('Should be success generating webp format.', async () => {
      const res = await request(app).get(`/image/format=webp/${imgUrl}`)
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.mime).to.equal(res.header['content-type'])
      expect(format.mime).to.equal('image/webp')
    })
  })

  describe(`GET /image/format=jpg/${imgUrl}`, () => {
    it('Should be success generate image.', async () => {
      const res = await request(app).get(`/image/format=jpg/${imgUrl}`)
      expect(res.status).to.equal(200)
    })

    it('Should be success generating jpg format.', async () => {
      const res = await request(app).get(`/image/format=jpg/${imgUrl}`)
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.mime).to.equal(res.header['content-type'])
      expect(format.mime).to.equal('image/jpeg')
    })
  })

  describe(`GET /image/format=jpeg/${imgUrl}`, () => {
    it('Should be success generate image.', async () => {
      const res = await request(app).get(`/image/format=jpeg/${imgUrl}`)
      expect(res.status).to.equal(200)
    })

    it('Should be success generating jpeg format.', async () => {
      const res = await request(app).get(`/image/format=jpeg/${imgUrl}`)
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.mime).to.equal(res.header['content-type'])
      expect(format.mime).to.equal('image/jpeg')
    })
  })

  describe(`GET /image/format=png/${imgUrl}`, () => {
    it('Should be success generate image.', async () => {
      const res = await request(app).get(`/image/format=png/${imgUrl}`)
      expect(res.status).to.equal(200)
    })

    it('Should be success generating png format.', async () => {
      const res = await request(app).get(`/image/format=png/${imgUrl}`)
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.mime).to.equal(res.header['content-type'])
      expect(format.mime).to.equal('image/png')
    })
  })
})
