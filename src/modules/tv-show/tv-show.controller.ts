import {
  Controller,
  Post,
  Get,
  Patch,
  Query,
  Body,
  Param,
} from '@nestjs/common'
import { TvShowService } from './tv-show.service'
import {
  AddTvShowDto,
  RateTvShowDto,
  TvShowIdParamDto,
  GetTvShowsOnServiceQueryDto,
  AddTvShowToServiceDto,
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
  async getTvShowsByService(@Query() query: GetTvShowsOnServiceQueryDto) {
    return await this.tvShowService.getTvShowsByService(query)
  }

  @Patch(':id/rate')
  async rateTvShow(
    @Param() params: TvShowIdParamDto,
    @Body() body: RateTvShowDto,
  ) {
    return await this.tvShowService.rateTvShow(params, body)
  }

  @Post('add-to-streaming-service')
  async addTvShowToService(@Body() body: AddTvShowToServiceDto) {
    return await this.tvShowService.addTvShowToService(body)
  }

  @Post('add-season')
  async addSeasonToTvShow(@Body() body: AddSeasonToTvShowDto) {
    return await this.tvShowService.addSeasonToTvShow(body)
  }
}
