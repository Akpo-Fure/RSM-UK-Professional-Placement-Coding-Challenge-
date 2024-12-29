import { Prisma } from '@prisma/client'
import { Injectable, ConflictException } from '@nestjs/common'
import { AddStreamingServiceDto } from './streaming-service.dto'
import { PrismaService } from '../shared/prisma.service'

@Injectable()
export class StreamingServiceService {
  constructor(private prisma: PrismaService) {}

  async add(dto: AddStreamingServiceDto) {
    const streamingService = await this.findOne({ name: dto.name })

    if (streamingService) {
      throw new ConflictException(
        `Streaming service ${dto.name} already exists`,
      )
    }

    await this.create(dto)

    return { message: 'Streaming service added successfully' }
  }

  async create(dto: Prisma.StreamingServiceCreateInput) {
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
}
