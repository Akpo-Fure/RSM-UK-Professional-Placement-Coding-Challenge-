import {
  Controller,
  Post,
  Get,
  Patch,
  Query,
  Body,
  Param,
  Delete,
} from '@nestjs/common'
import { TvShowService } from './tv-show.service'
import {
  AddTvShowDto,
  RateTvShowDto,
  TvShowIdParamDto,
  GetTvShowsOnStreamingServiceQueryDto,
  AddTvShowToStreamingServiceDto,
  AddSeasonToTvShowDto,
} from './tv-show.dto'

@Controller('tv-show')
export class TvShowController {
  constructor(private tvShowService: TvShowService) {}

  @Post()
  async addTvShow(@Body() body: AddTvShowDto) {
    return await this.tvShowService.addTvShow(body)
  }

  @Get()
  async getTvShowsOnStreamingService(
    @Query() query: GetTvShowsOnStreamingServiceQueryDto,
  ) {
    return await this.tvShowService.getTvShowsOnStreamingService(query)
  }

  @Patch(':id/rate')
  async rateTvShow(
    @Param() params: TvShowIdParamDto,
    @Body() body: RateTvShowDto,
  ) {
    return await this.tvShowService.rateTvShow(params, body)
  }

  @Post('add-to-streaming-service')
  async addTvShowToStreamingService(
    @Body() body: AddTvShowToStreamingServiceDto,
  ) {
    return await this.tvShowService.addTvShowToStreamingService(body)
  }

  @Post('add-season')
  async addSeasonToTvShow(@Body() body: AddSeasonToTvShowDto) {
    return await this.tvShowService.addSeasonToTvShow(body)
  }
}
