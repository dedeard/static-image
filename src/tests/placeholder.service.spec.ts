import chai from 'chai'
import chaiHttp from 'chai-http'
import Application from '../app'
import placeholderService from '../services/placeholder.service'
import { getFormatFromBuffer } from '../shared/libs'

chai.use(chaiHttp)

const { app } = new Application(placeholderService)
const { expect, request } = chai

describe('Testing Placeholder Service', () => {
  describe('GET /placeholder/_.webp', () => {
    it('Should be success generate placeholder.', async () => {
      const res = await request(app).get('/placeholder/_.webp')
      expect(res.status).to.equal(200)
    })

    it('Should be success generating webp format.', async () => {
      const res = await request(app).get('/placeholder/_.webp')
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.ext).to.equal('webp')
      expect(format.mime).to.equal('image/webp')
    })
  })

  describe('GET /placeholder', () => {
    it('Should be failed generate placeholder.', async () => {
      const res = await request(app).get('/placeholder')
      expect(res.status).to.be.oneOf([404, 500])
    })
  })

  describe('GET /placeholder/_.jpg', () => {
    it('Should be success generate placeholder.', async () => {
      const res = await request(app).get('/placeholder/_.jpg')
      expect(res.status).to.equal(200)
    })

    it('Should be success generating jpeg format.', async () => {
      const res = await request(app).get('/placeholder/_.jpg')
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.ext).to.be.oneOf(['jpg', 'jpeg'])
      expect(format.mime).to.equal('image/jpeg')
    })
  })

  describe('GET /placeholder/_.jpeg', () => {
    it('Should be success generate placeholder.', async () => {
      const res = await request(app).get('/placeholder/_.jpeg')
      expect(res.status).to.equal(200)
    })

    it('Should be success generating jpeg format.', async () => {
      const res = await request(app).get('/placeholder/_.jpeg')
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.ext).to.be.oneOf(['jpg', 'jpeg'])
      expect(format.mime).to.equal('image/jpeg')
    })
  })

  describe('GET /placeholder/_.png', () => {
    it('Should be success generate placeholder.', async () => {
      const res = await request(app).get('/placeholder/_.png')
      expect(res.status).to.equal(200)
    })

    it('Should be success generating png format.', async () => {
      const res = await request(app).get('/placeholder/_.png')
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.ext).to.equal('png')
      expect(format.mime).to.equal('image/png')
    })
  })
})
