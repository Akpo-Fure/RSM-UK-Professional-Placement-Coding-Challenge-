import { Controller, Body, Post } from '@nestjs/common'
import { StreamingServiceService } from './streaming-service.service'
import { CreateStreamingServiceDto } from './streaming-service.dto'

@Controller('streaming-service')
export class StreamingServiceController {
  constructor(private streamingServiceService: StreamingServiceService) {}

  @Post()
  async create(@Body() dto: CreateStreamingServiceDto) {
    return await this.streamingServiceService.create(dto)
  }
}
