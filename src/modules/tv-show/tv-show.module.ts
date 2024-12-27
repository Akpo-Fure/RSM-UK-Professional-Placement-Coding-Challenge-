import { Module } from '@nestjs/common'
import { TvShowController } from './tv-show.controller'
import { TvShowService } from './tv-show.service'

@Module({
  controllers: [TvShowController],
  providers: [TvShowService],
})
export class TvShowModule {}
