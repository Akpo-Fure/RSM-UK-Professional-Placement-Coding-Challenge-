import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../shared/prisma.service'
import { CreateTvShowDto, TvShowIdParamDto, RateTvShowDto } from './tv-show.dto'

@Injectable()
export class TvShowService {
  constructor(private prisma: PrismaService) {}

  async createTvShow(body: CreateTvShowDto) {
    const streamingService = await this.prisma.streamingService.findFirst({
      where: { id: body.streamingServiceId, deleted: false },
    })

    if (!streamingService) {
      throw new NotFoundException('Streaming service not found')
    }

    const tvShow = await this.prisma.tVShow.create({
      data: {
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
      },
    })

    return { message: 'TV Show added successfully', data: tvShow }
  }

  async getTvShowsOnStreamingService(streamingServiceId: string) {
    const streamingService = await this.prisma.streamingService.findFirst({
      where: { id: streamingServiceId, deleted: false },
    })

    if (!streamingService) {
      throw new NotFoundException('Streaming service not found')
    }

    const tvShows = await this.prisma.tvShowStreamingService.findMany({
      where: { streamingServiceId: streamingServiceId },
      include: { tvShow: true, season: true },
    })

    return tvShows
  }

  async rateTvShow(tvShowId: string, body: RateTvShowDto) {
    const tvShow = await this.prisma.tVShow.findFirst({
      where: { id: tvShowId },
    })

    if (!tvShow) {
      throw new NotFoundException('TV Show not found')
    }

    await this.prisma.tVShow.update({
      where: { id: tvShowId },
      data: { rating: body.rating },
    })

    return { message: 'TV Show rated successfully' }
  }
}
