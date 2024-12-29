import { Controller, Body, Post } from '@nestjs/common'
import { StreamingServiceService } from './streaming-service.service'
import { AddStreamingServiceDto } from './streaming-service.dto'

@Controller('streaming-service')
export class StreamingServiceController {
  constructor(private streamingServiceService: StreamingServiceService) {}

  @Post()
  async add(@Body() dto: AddStreamingServiceDto) {
    return await this.streamingServiceService.add(dto)
  }
}
