import TestAgent from 'supertest/lib/agent'
import { Test } from 'supertest'
import { Genre, PrismaClient } from '@prisma/client'
import { setupTestModule, teardownTestModule } from '../../../test'
import { AddFilmDto } from './film.dto'

let prisma: PrismaClient
let app: TestAgent<Test>
let streamingServiceId1: string
let streamingServiceId2: string
let filmId: string

beforeAll(async () => {
  ;({ prisma, app } = await setupTestModule())
  streamingServiceId1 = await prisma.streamingService
    .create({
      data: {
        name: 'Netflix',
        price: 9.99,
      },
    })
    .then((streamingService) => streamingService.id)

  streamingServiceId2 = await prisma.streamingService
    .create({
      data: {
        name: 'Hulu',
        price: 9.99,
      },
    })
    .then((streamingService) => streamingService.id)
})

afterAll(async () => {
  await teardownTestModule(prisma)
})

describe('Film Controller', () => {
  describe('POST /film', () => {
    it('Should throw an error if the streaming service id is not provided', async () => {
      const response = await app.post('/film').send({
        name: 'The Matrix',
        year: 1999,
        genre: Genre.ACTION,
        rating: 5,
        runtime: 136,
      } as AddFilmDto)
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('streamingServiceId must be a UUID')
    })

    it('Should throw an error if the name is not provided', async () => {
      const response = await app.post('/film').send({
        streamingServiceId: streamingServiceId1,
        year: 1999,
        genre: Genre.ACTION,
        rating: 5,
        runtime: 136,
      } as AddFilmDto)
      expect(response.status).toBe(400)
      expect(response.body.message).toBe(
        'name must be longer than or equal to 1 characters',
      )
    })

    it("Should throw an error if streaming service doesn't exist", async () => {
      const response = await app.post('/film').send({
        name: 'The Matrix',
        year: 1999,
        genre: 'ACTION',
        rating: 5,
        runtime: 136,
        streamingServiceId: 'c0c4c1e6-7e8c-4d1d-8d3d-9f3d8c7c8c8e',
      } as AddFilmDto)
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Streaming service not found')
    })

    it('Should create a film', async () => {
      const response = await app.post('/film').send({
        name: 'The Matrix',
        year: 1999,
        genre: Genre.ACTION,
        rating: 5,
        runtime: 136,
        streamingServiceId: streamingServiceId1,
      } as AddFilmDto)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe('Film added successfully')
    })

    it('Should throw an error if the film already exists on same service', async () => {
      const response = await app.post('/film').send({
        name: 'The Matrix',
        year: 1999,
        genre: Genre.ACTION,
        rating: 5,
        runtime: 136,
        streamingServiceId: streamingServiceId1,
      } as AddFilmDto)
      expect(response.status).toBe(409)
      expect(response.body.message).toBe(
        'Film with name "The Matrix (1999)" already exists on Netflix, please remove it before adding it to another service',
      )
    })

    it('should throw an error if the film already exists on another service', async () => {
      const response = await app.post('/film').send({
        name: 'The Matrix',
        year: 1999,
        genre: Genre.ACTION,
        rating: 5,
        runtime: 136,
        streamingServiceId: streamingServiceId2,
      } as AddFilmDto)
      expect(response.status).toBe(409)
      expect(response.body.message).toBe(
        'Film with name "The Matrix (1999)" already exists on Netflix, please remove it before adding it to another service',
      )
    })
  })
  describe('GET /film', () => {
    it('Should return a list of films on a service', async () => {
      const response = await app.get(
        `/film?streamingServiceId=${streamingServiceId1}`,
      )
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      filmId = response.body.data[0].id
    })

    it("Should return an empty list if the service doesn't have any films", async () => {
      const response = await app.get(
        `/film?streamingServiceId=${streamingServiceId2}`,
      )
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(0)
    })

    it('Should return a list of films with pagination', async () => {
      const response = await app.get(
        `/film?streamingServiceId=${streamingServiceId1}&page=1&limit=1`,
      )
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
    })

    it("should return an empty list if the page doesn't exist", async () => {
      const response = await app.get(
        `/film?streamingServiceId=${streamingServiceId1}&page=2&limit=1`,
      )
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(0)
    })

    it('Should return a list of films with search', async () => {
      const response = await app.get(
        `/film?streamingServiceId=${streamingServiceId1}&search=The Matrix`,
      )
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
    })

    it('Should return a list of films with sort', async () => {
      const response = await app.get(
        `/film?streamingServiceId=${streamingServiceId1}&sortBy=name&sort=desc`,
      )
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
    })
  })
  describe('PATCH /film/:id/rate', () => {
    it('Should throw an error if the rating is not provided', async () => {
      const response = await app.patch(`/film/${filmId}/rate`).send({})
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('rating must not be greater than 5')
    })

    it('Should throw an error if the rating is less than 1', async () => {
      const response = await app.patch(`/film/${filmId}/rate`).send({
        rating: 0,
      })
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('rating must not be less than 1')
    })

    it('Should throw an error if the rating is greater than 5', async () => {
      const response = await app.patch(`/film/${filmId}/rate`).send({
        rating: 6,
      })
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('rating must not be greater than 5')
    })

    it('Should throw an error if the film does not exist', async () => {
      const response = await app
        .patch(`/film/c0c4c1e6-7e8c-4d1d-8d3d-9f3d8c7c8c8e/rate`)
        .send({
          rating: 2,
        })
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Film not found')
    })

    it('Should rate a film', async () => {
      const response = await app.patch(`/film/${filmId}/rate`).send({
        rating: 4,
      })
      expect(response.status).toBe(200)
      expect(response.body.message).toBe('Film rating updated successfully')
      const film = await prisma.film.findUnique({
        where: { id: filmId },
      })

      expect(film.rating).toBe(4)
    })
  })
  describe('DELETE /film/:id', () => {
    it('Should throw an error if the id is not a valid UUID', async () => {
      const response = await app.delete('/film/1')
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('id must be a UUID')
    })

    it('Should throw an error if the film does not exist', async () => {
      const response = await app.delete(
        `/film/c0c4c1e6-7e8c-4d1d-8d3d-9f3d8c7c8c8e`,
      )
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Film not found')
    })

    it('Should delete a film', async () => {
      const response = await app.delete(`/film/${filmId}`)
      expect(response.status).toBe(200)
      expect(response.body.message).toBe('Film deleted successfully')

      const film = await prisma.film.findUnique({
        where: { id: filmId },
      })

      expect(film).toBeNull()
    })
  })
})
