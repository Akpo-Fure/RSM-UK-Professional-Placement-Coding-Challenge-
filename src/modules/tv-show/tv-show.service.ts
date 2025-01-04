import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../shared/prisma.service'
import { StreamingServiceService } from '../streaming-service/streaming-service.service'
import {
  AddTvShowDto,
  TvShowIdParamDto,
  RateTvShowDto,
  AddTvShowToServiceDto,
  GetTvShowsOnServiceQueryDto,
  AddSeasonToTvShowDto,
} from './tv-show.dto'
import { ResponseDto } from '../utils'

@Injectable()
export class TvShowService {
  constructor(
    private prisma: PrismaService,
    private streamingService: StreamingServiceService,
  ) {}

  async createTvShow(body: AddTvShowDto) {
    await this.streamingService.validateStreamingServiceExists(
      body.streamingServiceId,
    )

    const tvShow = await this.createOne({
      name: body.name,
      genre: body.genre,
      rating: body.rating,
      tvShowStreamingService: {
        create: {
          streamingServiceId: body.streamingServiceId,
          season: {
            createMany: { data: body.seasons },
          },
        },
      },
    })

    return new ResponseDto('TV Show added successfully', tvShow)
  }

  async getTvShowsByService(query: GetTvShowsOnServiceQueryDto) {
    const { streamingServiceId, page = 1, limit = 20 } = query

    const skip: number = page > 1 ? (page - 1) * limit : 0

    const where: Prisma.TvShowStreamingServiceWhereInput = {
      streamingServiceId: streamingServiceId,
    }

    await this.streamingService.validateStreamingServiceExists(
      streamingServiceId,
    )

    const [total, tvShows] = await this.prisma.$transaction([
      this.prisma.tvShowStreamingService.count({ where }),
      this.prisma.tvShowStreamingService.findMany({
        where,
        include: { tvShow: true, season: true },
        skip: Number(skip),
        take: Number(limit),
      }),
    ])

    return new ResponseDto(
      'TV Shows retrieved successfully',
      tvShows,
      page,
      total,
      limit,
    )
  }

  async updateTvShowRating(params: TvShowIdParamDto, body: RateTvShowDto) {
    const tvShow = await this.prisma.tVShow.findFirst({
      where: { id: params.id },
    })

    if (!tvShow) {
      throw new NotFoundException('TV Show not found')
    }

    await this.updateOne({ id: params.id }, { rating: body.rating })

    return new ResponseDto('TV Show rated successfully')
  }

  async addTvShowToService(body: AddTvShowToServiceDto) {
    await this.streamingService.validateStreamingServiceExists(
      body.streamingServiceId,
    )

    const tvShow = await this.prisma.tVShow.findFirst({
      where: { id: body.tvShowId },
    })

    if (!tvShow) {
      throw new NotFoundException('TV Show not found')
    }

    const tvShowStreamingService =
      await this.prisma.tvShowStreamingService.upsert({
        where: {
          tvShowId_streamingServiceId: {
            tvShowId: body.tvShowId,
            streamingServiceId: body.streamingServiceId,
          },
        },
        update: {},
        create: {
          tvShowId: body.tvShowId,
          streamingServiceId: body.streamingServiceId,
        },
      })

    return new ResponseDto(
      'TV Show added to streaming service successfully',
      tvShowStreamingService,
    )
  }

  async addSeasonToTvShow(body: AddSeasonToTvShowDto) {
    // Use tvShowId and streamingServiceId to find the tvShowStreamingService instead of tvShowStreamingServiceId
    const tvShow = await this.prisma.tvShowStreamingService.findFirst({
      where: { id: body.tvShowStreamingServiceId, deleted: false },
    })

    if (!tvShow) {
      throw new NotFoundException('TV Show not found on streaming service')
    }

    await this.prisma.$transaction(async (prisma) => {
      const season = await prisma.season.findFirst({
        where: {
          tvShowStreamingService: {
            tvShowId: tvShow.tvShowId,
            streamingService: { deleted: false },
          },
          number: body.season.number,
        },
        include: {
          tvShowStreamingService: {
            include: { tvShow: true, streamingService: true },
          },
        },
      })

      if (season) {
        throw new ConflictException(
          `Season ${body.season.number} already exists for ${season.tvShowStreamingService.tvShow.name} on ${season.tvShowStreamingService.streamingService.name}`,
        )
      }

      return await this.prisma.season.create({
        data: {
          ...body.season,
          tvShowStreamingServiceId: body.tvShowStreamingServiceId,
        },
      })
    })

    // return { message: 'Season added successfully', data: newSeason }

    return new ResponseDto('Season added successfully')
  }

  async createOne(data: Prisma.TVShowCreateInput) {
    return await this.prisma.tVShow.create({ data })
  }

  async findOne(where: Prisma.TVShowWhereUniqueInput) {
    return await this.prisma.tVShow.findFirst({ where })
  }

  async updateOne(
    where: Prisma.TVShowWhereUniqueInput,
    data: Prisma.TVShowUpdateInput,
  ) {
    return await this.prisma.tVShow.update({ where, data })
  }
}
