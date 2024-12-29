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
  async createTvShow(@Body() body: AddTvShowDto) {
    return await this.tvShowService.createTvShow(body)
  }

  @Get()
  async fetchTvShowsOnStreamingService(
    @Query() query: GetTvShowsOnStreamingServiceQueryDto,
  ) {
    return await this.tvShowService.fetchTvShowsOnStreamingService(query)
  }

  @Patch(':id/rate')
  async updateTvShowRating(
    @Param() params: TvShowIdParamDto,
    @Body() body: RateTvShowDto,
  ) {
    return await this.tvShowService.updateTvShowRating(params, body)
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
