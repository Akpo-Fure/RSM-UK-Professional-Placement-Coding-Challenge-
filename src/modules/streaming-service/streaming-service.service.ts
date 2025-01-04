import { Prisma } from '@prisma/client'
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import {
  CreateStreamingServiceDto,
  GetStreamingServicesQueryDto,
  DeleteStreamingServiceParamsDto,
} from './streaming-service.dto'
import { PrismaService } from '../shared/prisma.service'
import { ResponseDto } from '../utils'

@Injectable()
export class StreamingServiceService {
  constructor(private prisma: PrismaService) {}

  async createStreamingService(dto: CreateStreamingServiceDto) {
    const streamingService = await this.findOne({
      name: {
        contains: dto.name,
        mode: 'insensitive',
      },
    })

    if (streamingService) {
      throw new ConflictException(
        `Streaming service ${dto.name} already exists`,
      )
    }

    await this.createOne(dto)

    return new ResponseDto('Streaming service added successfully')
  }

  async getStreamingServices(query: GetStreamingServicesQueryDto) {
    const { page = 1, limit = 20, search, sort, sortBy } = query

    const skip: number = page > 1 ? (page - 1) * limit : 0

    let where: Prisma.StreamingServiceWhereInput = {}

    if (search) {
      where = {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }
    }

    const [total, streamingServices] = await this.prisma.$transaction([
      this.prisma.streamingService.count({ where }),
      this.prisma.streamingService.findMany({
        where,
        orderBy: {
          [sortBy]: sort,
        },
        skip: Number(skip),
        take: Number(limit),
      }),
    ])

    return new ResponseDto(
      'Streaming services fetched successfully',
      streamingServices,
      page,
      total,
      Math.ceil(total / limit),
    )
  }

  async deleteStreamingService(params: DeleteStreamingServiceParamsDto) {
    await this.validateStreamingServiceExists(params.id)

    await this.deleteOne({ id: params.id })

    return new ResponseDto('Streaming service deleted successfully')
  }

  async validateStreamingServiceExists(id: string) {
    const streamingService = await this.findOne({ id, deleted: false })

    if (!streamingService) {
      throw new NotFoundException('Streaming service not found')
    }

    return streamingService
  }

  async createOne(dto: Prisma.StreamingServiceCreateInput) {
    return await this.prisma.streamingService.create({
      data: { ...dto },
    })
  }

  async findOne(where: Prisma.StreamingServiceWhereInput) {
    return await this.prisma.streamingService.findFirst({
      where: {
        ...where,
        deleted: false,
      },
    })
  }

  async deleteOne(where: Prisma.StreamingServiceWhereUniqueInput) {
    return await this.prisma.streamingService.update({
      where,
      data: { deleted: true },
    })
  }
}
