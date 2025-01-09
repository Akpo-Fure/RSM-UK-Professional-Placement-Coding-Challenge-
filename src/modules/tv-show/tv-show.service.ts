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
  GetTvShowsOnServiceQueryDto,
  AddSeasonToTvShowDto,
  AddTvShowToServiceParamDto,
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

    await this.createOne({
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

    return new ResponseDto('TV Show added successfully')
  }

  async getTvShowsByService(query: GetTvShowsOnServiceQueryDto) {
    const { streamingServiceId, page = 1, limit = 20 } = query

    const skip: number = page > 1 ? (page - 1) * limit : 0

    const where: Prisma.TvShowStreamingServiceWhereInput = {
      deleted: false,
      streamingServiceId: streamingServiceId,
      tvShow: {
        name: { contains: query.search, mode: 'insensitive' },
        deleted: false,
      },
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

  async getTvShowsOnOtherServices(id: string) {
    const tvShows = await this.prisma.tVShow.findMany({
      where: {
        tvShowStreamingService: {
          some: {
            streamingServiceId: { not: id },
          },
        },
        deleted: false,
      },
    })

    return new ResponseDto('TV Shows retrieved successfully', tvShows)
  }

  async rateTvShow(params: TvShowIdParamDto, body: RateTvShowDto) {
    await this.validateTvShowExists(params.id)

    await this.updateOne({ id: params.id }, { rating: body.rating })

    return new ResponseDto('TV Show rated successfully')
  }

  async addTvShowToService(params: AddTvShowToServiceParamDto) {
    await this.streamingService.validateStreamingServiceExists(
      params.streamingServiceId,
    )

    await this.validateTvShowExists(params.tvShowId)

    const tvShowStreamingService =
      await this.prisma.tvShowStreamingService.upsert({
        where: {
          tvShowId_streamingServiceId: {
            tvShowId: params.tvShowId,
            streamingServiceId: params.streamingServiceId,
          },
        },
        update: {
          deleted: false,
        },
        create: {
          tvShowId: params.tvShowId,
          streamingServiceId: params.streamingServiceId,
        },
      })

    return new ResponseDto('TV Show added to streaming service successfully')
  }

  async addSeasonToTvShow(body: AddSeasonToTvShowDto) {
    await this.streamingService.validateStreamingServiceExists(
      body.streamingServiceId,
    )

    await this.validateTvShowExists(body.tvShowId)

    const tvShow = await this.prisma.tvShowStreamingService.findFirst({
      where: {
        tvShowId: body.tvShowId,
        streamingServiceId: body.streamingServiceId,
        deleted: false,
      },
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
          tvShowStreamingServiceId: tvShow.id,
        },
      })
    })

    return new ResponseDto('Season added successfully')
  }

  async validateTvShowExists(tvShowId: string) {
    const tvShow = await this.prisma.tVShow.findFirst({
      where: { id: tvShowId, deleted: false },
    })

    if (!tvShow) {
      throw new NotFoundException('TV Show not found')
    }

    return tvShow
  }

  async createOne(data: Prisma.TVShowCreateInput) {
    return await this.prisma.tVShow.create({ data })
  }

  async findOne(where: Prisma.TVShowWhereUniqueInput) {
    return await this.prisma.tVShow.findFirst({
      where: { ...where, deleted: false },
    })
  }

  async updateOne(
    where: Prisma.TVShowWhereUniqueInput,
    data: Prisma.TVShowUpdateInput,
  ) {
    return await this.prisma.tVShow.update({ where, data })
  }
}
