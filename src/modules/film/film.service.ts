import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../shared/prisma.service'
import { StreamingServiceService } from '../streaming-service/streaming-service.service'
import {
  AddFilmDto,
  FilmIdParamDto,
  RateFilmDto,
  GetFilmsQueryDto,
} from './film.dto'

@Injectable()
export class FilmService {
  constructor(
    private prisma: PrismaService,
    private streamingService: StreamingServiceService,
  ) {}

  async createFilm(body: AddFilmDto) {
    const streamingService = await this.streamingService.findOne({
      id: body.streamingServiceId,
    })

    if (!streamingService) {
      throw new NotFoundException('Streaming service not found')
    }

    const film = await this.prisma.film.findUnique({
      where: {
        name_year: {
          name: body.name,
          year: body.year,
        },
      },
      select: {
        streamingService: {
          select: {
            name: true,
          },
        },
      },
    })

    if (film) {
      throw new ConflictException(
        `Film with name "${body.name} (${body.year})" already exists on ${film.streamingService.name}, please remove it before adding it to another service`,
      )
    }

    await this.createOne({
      ...body,
      streamingServiceId: body.streamingServiceId,
    })

    return { message: 'Film added successfully' }
  }

  async fetchFilms(query: GetFilmsQueryDto) {
    const {
      streamingServiceId,
      page = 1,
      limit = 20,
      sortBy,
      sort,
      search,
    } = query

    const skip: number = page > 1 ? (page - 1) * limit : 0

    let where: Prisma.FilmWhereInput = {
      streamingServiceId,
    }

    if (search) {
      where = {
        ...where,
        OR: [{ name: { contains: search } }],
      }
    }

    const [total, films] = await this.prisma.$transaction([
      this.prisma.film.count({ where }),
      this.prisma.film.findMany({
        where,
        take: Number(limit),
        skip: Number(skip),
        orderBy: { [sortBy]: sort },
      }),
    ])

    const response = {
      data: films,
      message: 'Films fetched successfully',
      currentPage: page,
      count: Number(total),
      totalPages: Math.ceil(total / limit),
    }

    return response
  }

  async updateFilmRating(params: FilmIdParamDto, body: RateFilmDto) {
    const film = await this.findOne({ id: params.id })

    if (!film) {
      throw new NotFoundException('Film not found')
    }

    await this.updateOne({ id: params.id }, { rating: body.rating })

    return { message: 'Film rated successfully' }
  }

  async removeFilm(params: FilmIdParamDto) {
    const film = await this.findOne({ id: params.id })

    if (!film) {
      throw new NotFoundException('Film not found')
    }

    await this.deleteOne({ id: params.id })

    return { message: 'Film deleted successfully' }
  }

  async createOne(data: Prisma.FilmUncheckedCreateInput) {
    return await this.prisma.film.create({
      data,
    })
  }

  async findOne(where: Prisma.FilmWhereInput) {
    return await this.prisma.film.findFirst({
      where,
    })
  }

  async findUnique(
    where: Prisma.FilmWhereUniqueInput,
    select: Prisma.FilmSelect = {},
  ) {
    return await this.prisma.film.findUnique({
      where,
      select,
    })
  }

  async updateOne(
    where: Prisma.FilmWhereUniqueInput,
    data: Prisma.FilmUpdateInput,
  ) {
    return await this.prisma.film.update({
      where,
      data,
    })
  }

  async deleteOne(where: Prisma.FilmWhereUniqueInput) {
    return await this.prisma.film.delete({
      where,
    })
  }
}
