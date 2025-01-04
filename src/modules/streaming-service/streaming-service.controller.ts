import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Param,
} from '@nestjs/common'
import { StreamingServiceService } from './streaming-service.service'
import {
  CreateStreamingServiceDto,
  GetStreamingServicesQueryDto,
  DeleteStreamingServiceParamsDto,
} from './streaming-service.dto'

@Controller('streaming-service')
export class StreamingServiceController {
  constructor(private streamingServiceService: StreamingServiceService) {}

  @Post()
  async createStreamingService(@Body() dto: CreateStreamingServiceDto) {
    return await this.streamingServiceService.createStreamingService(dto)
  }

  @Get()
  async getStreamingServices(@Query() query: GetStreamingServicesQueryDto) {
    return await this.streamingServiceService.getStreamingServices(query)
  }

  @Delete(':id')
  async deleteStreamingService(
    @Param() params: DeleteStreamingServiceParamsDto,
  ) {
    return await this.streamingServiceService.deleteStreamingService(params)
  }
}
