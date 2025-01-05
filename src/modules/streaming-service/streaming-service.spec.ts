import TestAgent from 'supertest/lib/agent'
import { Test } from 'supertest'
import { PrismaClient } from '@prisma/client'
import { CreateStreamingServiceDto } from './streaming-service.dto'
import { setupTestModule, teardownTestModule } from '../../../test'

let prisma: PrismaClient
let app: TestAgent<Test>
let streamingServiceId: string

beforeAll(async () => {
  ;({ prisma, app } = await setupTestModule())
})

afterAll(async () => {
  await teardownTestModule(prisma)
})

describe('Streaming Service Controller', () => {
  describe('POST /streaming-service', () => {
    it('Should throw an error if the name is not provided', async () => {
      const response = await app.post('/streaming-service').send({
        price: 9.99,
      } as CreateStreamingServiceDto)
      expect(response.status).toBe(400)
      expect(response.body.message).toBe(
        'name must be longer than or equal to 1 characters',
      )
    })

    it('Should throw an error if the price is not provided', async () => {
      const response = await app.post('/streaming-service').send({
        name: 'Netflix2',
      } as CreateStreamingServiceDto)
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('price should not be empty')
    })

    it('should create a streaming service', async () => {
      const response = await app.post('/streaming-service').send({
        name: 'Netflix',
        price: 9.99,
      } as CreateStreamingServiceDto)
      expect(response.status).toBe(201)
      expect(response.body.message).toBe('Streaming service added successfully')
    })

    it('Should throw an error if the streaming service already exists', async () => {
      const response = await app.post('/streaming-service').send({
        name: 'Netflix',
        price: 9.99,
      } as CreateStreamingServiceDto)
      expect(response.status).toBe(409)
      expect(response.body.message).toBe(
        'Streaming service Netflix already exists',
      )
    })
  })

  describe('GET /streaming-service', () => {
    it('Should return a list of streaming services', async () => {
      const response = await app.get('/streaming-service')
      streamingServiceId = response.body.data[0].id
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
    })

    it('Should return a list of streaming services with pagination', async () => {
      const response = await app.get('/streaming-service?page=1&limit=1')
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
    })

    it("should return an empty list if the page doesn't exist", async () => {
      const response = await app.get('/streaming-service?page=2&limit=1')
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(0)
    })

    it('Should return a list of streaming services with search', async () => {
      const response = await app.get('/streaming-service?search=Netflix')
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
    })

    it('Should return a list of streaming services with sort', async () => {
      const response = await app.get('/streaming-service?sortBy=name&sort=desc')
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
    })
  })

  describe('DELETE /streaming-service/:id', () => {
    it('Should throw an error if the id is not a valid UUID', async () => {
      const response = await app.delete('/streaming-service/1')
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('id must be a UUID')
    })

    it('Should delete a streaming service', async () => {
      const response = await app.delete(
        `/streaming-service/${streamingServiceId}`,
      )
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(
        'Streaming service deleted successfully',
      )
    })

    it('Should throw an error if the streaming service does not exist', async () => {
      const response = await app.delete(
        `/streaming-service/${streamingServiceId}`,
      )
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Streaming service not found')
    })
  })
})
