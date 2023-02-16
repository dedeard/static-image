import chai from 'chai'
import chaiHttp from 'chai-http'
import Application from '../app'
import avatarService from './avatar.service'
import { getFormatFromBuffer } from '../libs'

chai.use(chaiHttp)

const { app } = new Application(avatarService)
const { expect, request } = chai

describe('Testing Avatar Service', () => {
  describe('GET /avatar/nickname', () => {
    it('Should be success generate avatar.', async () => {
      const res = await request(app).get('/avatar/nickname')
      expect(res.status).to.equal(200)
    })

    it('Should be success generating webp format.', async () => {
      const res = await request(app).get('/avatar/nickname')
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.ext).to.equal('webp')
      expect(format.mime).to.equal('image/webp')
    })
  })

  describe('GET /avatar/nickname.wrong', () => {
    it('Should be success generate avatar.', async () => {
      const res = await request(app).get('/avatar/nickname.wrong')
      expect(res.status).to.equal(200)
    })

    it('Should be success generating webp format.', async () => {
      const res = await request(app).get('/avatar/nickname.wrong')
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.ext).to.equal('webp')
      expect(format.mime).to.equal('image/webp')
    })
  })

  describe('GET /avatar/john doe.jpg', () => {
    it('Should be success generate avatar.', async () => {
      const res = await request(app).get('/avatar/john doe.jpg')
      expect(res.status).to.equal(200)
    })

    it('Should be success generating jpeg format.', async () => {
      const res = await request(app).get('/avatar/john doe.jpg')
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.ext).to.be.oneOf(['jpg', 'jpeg'])
      expect(format.mime).to.equal('image/jpeg')
    })
  })

  describe('GET /avatar/jane doe.jpeg', () => {
    it('Should be success generate avatar.', async () => {
      const res = await request(app).get('/avatar/jane doe.jpeg')
      expect(res.status).to.equal(200)
    })

    it('Should be success generating jpeg format.', async () => {
      const res = await request(app).get('/avatar/jane doe.jpeg')
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.ext).to.be.oneOf(['jpg', 'jpeg'])
      expect(format.mime).to.equal('image/jpeg')
    })
  })

  describe('GET /avatar/jane doe.png', () => {
    it('Should be success generate avatar.', async () => {
      const res = await request(app).get('/avatar/jane doe.png')
      expect(res.status).to.equal(200)
    })

    it('Should be success generating png format.', async () => {
      const res = await request(app).get('/avatar/jane doe.png')
      expect(res.status).to.equal(200)
      const format = await getFormatFromBuffer(res.body)
      expect(format.ext).to.equal('png')
      expect(format.mime).to.equal('image/png')
    })
  })
})
