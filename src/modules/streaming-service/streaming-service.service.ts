import { Injectable, ConflictException } from '@nestjs/common'
import { CreateStreamingServiceDto } from './streaming-service.dto'
import { PrismaService } from '../shared/prisma.service'
import { RequestUser } from '../../types'

@Injectable()
export class StreamingServiceService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStreamingServiceDto, user: RequestUser) {
    const streamingService = await this.prisma.streamingService.findUnique({
      where: { name: dto.name },
    })

    if (streamingService) {
      throw new ConflictException(
        `Streaming service with name ${dto.name} already exists`,
      )
    }

    await this.prisma.streamingService.create({
      data: {
        ...dto,
        userId: user.id,
      },
    })

    return { message: 'Streaming service added successfully' }
  }
}
