import { Controller, Body, Post, UseGuards } from '@nestjs/common'
import { StreamingServiceService } from './streaming-service.service'
import { CreateStreamingServiceDto } from './streaming-service.dto'
import { AuthGuard } from '../../guards/auth.guard'
import { RequestUser } from '../../types'
import { GetUser } from '../../decorators'

@UseGuards(AuthGuard)
@Controller('streaming-service')
export class StreamingServiceController {
  constructor(private streamingServiceService: StreamingServiceService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() dto: CreateStreamingServiceDto,
    @GetUser() user: RequestUser,
  ) {
    return await this.streamingServiceService.create(dto, user)
  }
}
