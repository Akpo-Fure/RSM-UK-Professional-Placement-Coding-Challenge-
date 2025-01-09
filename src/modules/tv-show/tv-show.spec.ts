import TestAgent from 'supertest/lib/agent'
import { Test } from 'supertest'
import { Genre, PrismaClient } from '@prisma/client'
import { setupTestModule, teardownTestModule } from '../../../test'
import {
  AddTvShowDto,
  AddSeasonToTvShowDto,
  RateTvShowDto,
  AddTvShowToServiceParamDto,
} from './tv-show.dto'

let prisma: PrismaClient
let app: TestAgent<Test>
let streamingServiceId1: string
let streamingServiceId2: string
let streamingServiceId3: string
let tvShowId: string

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

  streamingServiceId3 = await prisma.streamingService
    .create({
      data: {
        name: 'Amazon Prime',
        price: 9.99,
      },
    })
    .then((streamingService) => streamingService.id)
})

afterAll(async () => {
  await teardownTestModule(prisma)
})

describe('Tv Show Controller', () => {
  describe('POST /tv-show', () => {
    it('Should throw an error if the streaming service id is not provided', async () => {
      const response = await app.post('/tv-show').send({
        name: 'Breaking Bad',
        genre: Genre.DRAMA,
        rating: 5,
        seasons: [
          {
            number: 1,
            year: 2008,
            noOfEpisodes: 7,
          },
        ],
      } as AddTvShowDto)
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('streamingServiceId must be a UUID')
    })

    it('Should throw an error if the name is not provided', async () => {
      const response = await app.post('/tv-show').send({
        streamingServiceId: streamingServiceId1,
        genre: Genre.DRAMA,
        rating: 5,
        seasons: [
          {
            number: 1,
            year: 2008,
            noOfEpisodes: 7,
          },
        ],
      } as AddTvShowDto)
      expect(response.status).toBe(400)
      expect(response.body.message).toBe(
        'name must be longer than or equal to 1 characters',
      )
    })

    it('Should throw an error if the genre is not provided', async () => {
      const response = await app.post('/tv-show').send({
        name: 'Breaking Bad',
        streamingServiceId: streamingServiceId1,
        rating: 5,
        seasons: [
          {
            number: 1,
            year: 2008,
            noOfEpisodes: 7,
          },
        ],
      } as AddTvShowDto)
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('genre should not be empty')
    })

    it('Should throw an error if the two seasons with same number', async () => {
      const response = await app.post('/tv-show').send({
        name: 'Breaking Bad',
        genre: Genre.DRAMA,
        streamingServiceId: streamingServiceId1,
        rating: 5,
        seasons: [
          {
            number: 1,
            year: 2008,
            noOfEpisodes: 7,
          },
          {
            number: 1,
            year: 2009,
            noOfEpisodes: 7,
          },
        ],
      } as AddTvShowDto)
      expect(response.status).toBe(400)
      expect(response.body.message).toBe(
        'Season numbers in the seasons array must be unique',
      )
    })

    it("Should throw an error if streaming service doesn't exist", async () => {
      const response = await app.post('/tv-show').send({
        name: 'Breaking Bad',
        genre: Genre.DRAMA,
        rating: 5,
        seasons: [
          {
            number: 1,
            year: 2008,
            noOfEpisodes: 7,
          },
        ],
        streamingServiceId: 'c0c4c1e6-7e8c-4d1d-8d3d-9f3d8c7c8c8e',
      } as AddTvShowDto)
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Streaming service not found')
    })

    it('Should create a tv show', async () => {
      const response = await app.post('/tv-show').send({
        name: 'Breaking Bad',
        genre: Genre.DRAMA,
        rating: 5,
        seasons: [
          {
            number: 1,
            year: 2008,
            noOfEpisodes: 7,
          },
          {
            number: 2,
            year: 2009,
            noOfEpisodes: 13,
          },
        ],
        streamingServiceId: streamingServiceId1,
      } as AddTvShowDto)
      const tvShow = await prisma.tVShow.findFirst()
      const seasons = await prisma.season.findMany()
      expect(response.status).toBe(201)
      expect(response.body.message).toBe('TV Show added successfully')
      expect(tvShow.name).toBe('Breaking Bad')
      expect(seasons).toHaveLength(2)
      tvShowId = tvShow.id
    })
  })
  describe("GET /tv-show?streamingServiceId=''", () => {
    it('Should throw an error if the streaming service id is not provided', async () => {
      const response = await app.get('/tv-show')
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('streamingServiceId must be a UUID')
    })

    it("Should throw an error if streaming service doesn't exist", async () => {
      const response = await app.get('/tv-show').query({
        streamingServiceId: 'c0c4c1e6-7e8c-4d1d-8d3d-9f3d8c7c8c8e',
      })
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Streaming service not found')
    })

    it('Should return an empty array if there are no tv shows on the streaming service', async () => {
      const response = await app.get('/tv-show').query({
        streamingServiceId: streamingServiceId2,
      })
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(0)
    })
    it('Should get tv shows by streaming service', async () => {
      const response = await app.get('/tv-show').query({
        streamingServiceId: streamingServiceId1,
      })
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].tvShow.name).toBe('Breaking Bad')
      expect(response.body.data[0].season).toHaveLength(2)
    })
    it('Should get tv shows by streaming service with pagination', async () => {
      const response = await app.get('/tv-show').query({
        streamingServiceId: streamingServiceId1,
        page: 1,
        limit: 1,
      })
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].tvShow.name).toBe('Breaking Bad')
      expect(response.body.data[0].season).toHaveLength(2)
    })
    it('Should get tv shows by streaming service with search', async () => {
      const response = await app.get('/tv-show').query({
        streamingServiceId: streamingServiceId1,
        search: 'Breaking Bad',
      })
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].tvShow.name).toBe('Breaking Bad')
      expect(response.body.data[0].season).toHaveLength(2)
    })

    it("Should return an empty list if the page doesn't exist", async () => {
      const response = await app.get('/tv-show').query({
        streamingServiceId: streamingServiceId1,
        page: 2,
        limit: 1,
      })
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(0)
    })
  })
  describe('PATCH /tv-show/:id/rate', () => {
    it('Should throw an error if the rating is not provided', async () => {
      const response = await app.patch(`/tv-show/${tvShowId}/rate`).send({})
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('rating must not be greater than 5')
    })

    it('Should throw an error if the rating is less than 1', async () => {
      const response = await app.patch(`/tv-show/${tvShowId}/rate`).send({
        rating: 0,
      })
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('rating must not be less than 1')
    })

    it('Should throw an error if the rating is greater than 5', async () => {
      const response = await app.patch(`/tv-show/${tvShowId}/rate`).send({
        rating: 6,
      })
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('rating must not be greater than 5')
    })

    it('Should throw an error if the tv show does not exist', async () => {
      const response = await app
        .patch(`/tv-show/c0c4c1e6-7e8c-4d1d-8d3d-9f3d8c7c8c8e/rate`)
        .send({
          rating: 2,
        })
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('TV Show not found')
    })

    it('Should rate a tv show', async () => {
      const response = await app.patch(`/tv-show/${tvShowId}/rate`).send({
        rating: 2,
      } as RateTvShowDto)
      const tvShow = await prisma.tVShow.findFirst({
        where: { id: tvShowId },
      })
      expect(response.status).toBe(200)
      expect(response.body.message).toBe('TV Show rated successfully')
      expect(tvShow.rating).toBe(2)
    })
  })
  describe('POST /tv-show/add-to-streaming-service', () => {
    it('Should throw an error if the streaming service id is not provided', async () => {
      const response = await app.post(
        `/tv-show/add-to-streaming-service/${tvShowId}/dasd`,
      )

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('streamingServiceId must be a UUID')
    })

    it('Should throw an error if the tv show id is not provided', async () => {
      const response = await app.post(
        `/tv-show/add-to-streaming-service/tvShowId/${streamingServiceId2}`,
      )

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('tvShowId must be a UUID')
    })

    it("Should throw an error if streaming service doesn't exist", async () => {
      const response = await app.post(
        `/tv-show/add-to-streaming-service/${tvShowId}/c0c4c1e6-7e8c-4d1d-8d3d-9f3d8c7c8c8e`,
      )

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Streaming service not found')
    })

    it("Should throw an error if tv show doesn't exist", async () => {
      const response = await app.post(
        `/tv-show/add-to-streaming-service/c0c4c1e6-7e8c-4d1d-8d3d-9f3d8c7c8c8e/${streamingServiceId2}`,
      )

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('TV Show not found')
    })

    it('Should add a tv show to a streaming service', async () => {
      const response = await app.post(
        `/tv-show/add-to-streaming-service/${tvShowId}/${streamingServiceId2}`,
      )
      const tvShowStreamingService =
        await prisma.tvShowStreamingService.findFirst({
          where: {
            tvShowId,
            streamingServiceId: streamingServiceId2,
          },
        })
      const tvShow = await prisma.streamingService.findFirst({
        where: { id: streamingServiceId2 },
        include: {
          tvShowStreamingService: {
            select: { tvShow: { select: { name: true } }, season: true },
          },
        },
      })
      expect(response.status).toBe(201)
      expect(response.body.message).toBe(
        'TV Show added to streaming service successfully',
      )
      expect(tvShowStreamingService).toBeTruthy()
      expect(tvShow.tvShowStreamingService).toHaveLength(1)
      expect(tvShow.tvShowStreamingService[0].tvShow.name).toBe('Breaking Bad')
      expect(tvShow.tvShowStreamingService[0].season).toHaveLength(0)
    })
  })
  describe('POST /tv-show/add-season', () => {
    it('Should throw an error if the tv show id is not provided', async () => {
      const response = await app.post('/tv-show/add-season').send({
        streamingServiceId: streamingServiceId2,
        season: {
          number: 3,
          year: 2010,
          noOfEpisodes: 13,
        },
      } as AddSeasonToTvShowDto)
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('tvShowId must be a UUID')
    })

    it('Should throw an error if the streaming service id is not provided', async () => {
      const response = await app.post('/tv-show/add-season').send({
        tvShowId,
        season: {
          number: 3,
          year: 2010,
          noOfEpisodes: 13,
        },
      } as AddSeasonToTvShowDto)
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('streamingServiceId must be a UUID')
    })

    it('Should throw an error if the season number is not provided', async () => {
      const response = await app.post('/tv-show/add-season').send({
        streamingServiceId: streamingServiceId2,
        tvShowId,
        season: {
          year: 2010,
          noOfEpisodes: 13,
        },
      } as AddSeasonToTvShowDto)
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Unknown validation error on season')
    })

    it('Should throw an error if the season year is not provided', async () => {
      const response = await app.post('/tv-show/add-season').send({
        streamingServiceId: streamingServiceId2,
        tvShowId,
        season: {
          number: 3,
          noOfEpisodes: 13,
        },
      } as AddSeasonToTvShowDto)
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Unknown validation error on season')
    })

    it('Should throw an error if the season no of episodes is not provided', async () => {
      const response = await app.post('/tv-show/add-season').send({
        streamingServiceId: streamingServiceId2,
        tvShowId,
        season: {
          number: 3,
          year: 2010,
        },
      } as AddSeasonToTvShowDto)
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Unknown validation error on season')
    })
    it("should throw an error if tv tv show doesn't exist", async () => {
      const response = await app.post('/tv-show/add-season').send({
        streamingServiceId: streamingServiceId2,
        tvShowId: 'c0c4c1e6-7e8c-4d1d-8d3d-9f3d8c7c8c8e',
        season: {
          number: 3,
          year: 2010,
          noOfEpisodes: 13,
        },
      } as AddSeasonToTvShowDto)
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('TV Show not found')
    })
    it("Should throw an error if streaming service doesn't exist", async () => {
      const response = await app.post('/tv-show/add-season').send({
        streamingServiceId: 'c0c4c1e6-7e8c-4d1d-8d3d-9f3d8c7c8c8e',
        tvShowId,
        season: {
          number: 3,
          year: 2010,
          noOfEpisodes: 13,
        },
      } as AddSeasonToTvShowDto)
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Streaming service not found')
    })
    it("Should throw an error if tv show doesn't exist on streaming service", async () => {
      const response = await app.post('/tv-show/add-season').send({
        streamingServiceId: streamingServiceId3,
        tvShowId,
        season: {
          number: 3,
          year: 2010,
          noOfEpisodes: 13,
        },
      } as AddSeasonToTvShowDto)
      expect(response.status).toBe(404)
      expect(response.body.message).toBe(
        'TV Show not found on streaming service',
      )
    })
    it('Should add a season to a tv show', async () => {
      const response = await app.post('/tv-show/add-season').send({
        streamingServiceId: streamingServiceId2,
        tvShowId,
        season: {
          number: 3,
          year: 2010,
          noOfEpisodes: 13,
        },
      } as AddSeasonToTvShowDto)
      const season = await prisma.season.findFirst({
        where: {
          tvShowStreamingService: {
            tvShowId,
            streamingServiceId: streamingServiceId2,
            streamingService: { deleted: false },
          },
          number: 3,
        },
      })

      expect(response.status).toBe(201)
      expect(response.body.message).toBe('Season added successfully')
      expect(season).toBeTruthy()
    })
    it("Should throw an error if the season already exists on the tv show's streaming service", async () => {
      const response = await app.post('/tv-show/add-season').send({
        streamingServiceId: streamingServiceId2,
        tvShowId,
        season: {
          number: 1,
          year: 2010,
          noOfEpisodes: 13,
        },
      } as AddSeasonToTvShowDto)
      expect(response.status).toBe(409)
      expect(response.body.message).toBe(
        'Season 1 already exists for Breaking Bad on Netflix',
      )
    })
    it('Should throw an error if the season already exists on another streaming service', async () => {
      const response = await app.post('/tv-show/add-season').send({
        streamingServiceId: streamingServiceId1,
        tvShowId,
        season: {
          number: 3,
          year: 2010,
          noOfEpisodes: 13,
        },
      } as AddSeasonToTvShowDto)
      expect(response.status).toBe(409)
      expect(response.body.message).toBe(
        'Season 3 already exists for Breaking Bad on Hulu',
      )
    })
  })

  describe('GET /tv-show/:id/other-services', () => {
    it('Should get tv shows on other services', async () => {
      const response = await app.get(
        `/tv-show/${streamingServiceId2}/other-services`,
      )

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].name).toBe('Breaking Bad')
    })
  })
})
