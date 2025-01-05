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
import { ResponseDto } from '../utils'

@Injectable()
export class FilmService {
  constructor(
    private prisma: PrismaService,
    private streamingService: StreamingServiceService,
  ) {}

  async addFilmToService(dto: AddFilmDto) {
    await this.streamingService.validateStreamingServiceExists(
      dto.streamingServiceId,
    )

    const film = await this.prisma.film.findUnique({
      where: {
        name_year: {
          name: dto.name,
          year: dto.year,
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
        `Film with name "${dto.name} (${dto.year})" already exists on ${film.streamingService.name}, please remove it before adding it to another service`,
      )
    }

    await this.createOne(dto)

    return new ResponseDto('Film added successfully')
  }

  async getFilmsByService(query: GetFilmsQueryDto) {
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
        OR: [{ name: { contains: search, mode: 'insensitive' } }],
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

    return new ResponseDto(
      'Films fetched successfully',
      films,
      page,
      total,
      Math.ceil(total / limit),
    )
  }

  async rateFilm(params: FilmIdParamDto, dto: RateFilmDto) {
    await this.validateFilmExists(params.id)

    await this.updateOne({ id: params.id }, { rating: dto.rating })

    return new ResponseDto('Film rating updated successfully')
  }

  async removeFilm(params: FilmIdParamDto) {
    await this.validateFilmExists(params.id)

    await this.deleteOne({ id: params.id })

    return new ResponseDto('Film deleted successfully')
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
    select?: Prisma.FilmSelect,
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

  async validateFilmExists(id: string) {
    const film = await this.findUnique({ id })

    if (!film) {
      throw new NotFoundException('Film not found')
    }

    return film
  }
}
