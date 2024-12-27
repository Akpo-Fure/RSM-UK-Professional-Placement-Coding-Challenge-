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
import { AddTvShowDto } from './tv-show.dto'

@Controller('tv-show')
export class TvShowController {
  constructor(private tvShowService: TvShowService) {}

  @Post()
  async addTvShow(@Body() body: AddTvShowDto) {
    return await this.tvShowService.addTvShow(body)
  }
}
