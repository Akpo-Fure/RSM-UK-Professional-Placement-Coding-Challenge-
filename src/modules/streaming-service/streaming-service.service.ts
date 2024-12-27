import { Injectable, ConflictException } from '@nestjs/common'
import { CreateStreamingServiceDto } from './streaming-service.dto'
import { PrismaService } from '../shared/prisma.service'

@Injectable()
export class StreamingServiceService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStreamingServiceDto) {
    // const streamingService = await this.prisma.streamingService.findUnique({
    //   where: { name: dto.name },
    // })

    // if (streamingService) {
    //   throw new ConflictException(
    //     `Streaming service with name ${dto.name} already exists`,
    //   )
    // }

    await this.prisma.streamingService.create({
      data: dto,
    })

    return { message: 'Streaming service added successfully' }
  }
}
