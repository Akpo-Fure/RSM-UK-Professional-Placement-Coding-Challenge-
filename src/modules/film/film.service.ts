import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { RequestUser } from '../../types'
import { PrismaService } from '../shared/prisma.service'
import {
  AddFilmDto,
  FilmIdParamDto,
  RateFilmDto,
  GetFilmsQueryDto,
} from './film.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class FilmService {
  constructor(private prisma: PrismaService) {}

  async addFilm(user: RequestUser, body: AddFilmDto) {
    const streamingService = await this.prisma.streamingService.findFirst({
      where: { id: body.streamingServiceId, userId: user.id },
    })

    if (!streamingService) {
      throw new NotFoundException('Streaming service not found')
    }

    const film = await this.prisma.film.findUnique({
      where: {
        userId_name_year: {
          userId: user.id,
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

    await this.prisma.film.create({
      data: {
        ...body,
        userId: user.id,
        streamingServiceId: body.streamingServiceId,
      },
    })

    return { message: 'Film added successfully' }
  }

  async getFilms(user: RequestUser, query: GetFilmsQueryDto) {
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
      userId: user.id,
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

  async deleteFilm(user: RequestUser, params: FilmIdParamDto) {
    const film = await this.prisma.film.findFirst({
      where: { id: params.id, userId: user.id },
    })

    if (!film) {
      throw new NotFoundException('Film not found')
    }

    await this.prisma.film.delete({
      where: { id: params.id },
    })

    return { message: 'Film deleted successfully' }
  }

  async rateFilm(user: RequestUser, params: FilmIdParamDto, body: RateFilmDto) {
    const film = await this.prisma.film.findFirst({
      where: { id: params.id, userId: user.id },
    })

    if (!film) {
      throw new NotFoundException('Film not found')
    }

    await this.prisma.film.update({
      where: { id: params.id },
      data: { rating: body.rating },
    })

    return { message: 'Film rated successfully' }
  }
}
