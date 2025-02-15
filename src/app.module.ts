import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { SharedModule } from './modules/shared/shared.module'
import { StreamingServiceModule } from './modules/streaming-service/streaming-service.module'
import { FilmModule } from './modules/film/film.module'
import { TvShowModule } from './modules/tv-show/tv-show.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'secret',
      signOptions: { expiresIn: '30d' },
    }),
    SharedModule,
    StreamingServiceModule,
    FilmModule,
    TvShowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
