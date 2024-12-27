import {
  Controller,
  Post,
  Get,
  Patch,
  Query,
  UseGuards,
  Body,
  Param,
  Delete,
} from '@nestjs/common'
import { GetUser } from '../../decorators'
import { AuthGuard } from '../../guards'
import { RequestUser } from '../../types'
import { FilmService } from './film.service'
import {
  AddFilmDto,
  FilmIdParamDto,
  RateFilmDto,
  GetFilmsQueryDto,
} from './film.dto'

@UseGuards(AuthGuard)
@Controller('film')
export class FilmController {
  constructor(private filmService: FilmService) {}

  @Post()
  async addFilm(@GetUser() user: RequestUser, @Body() body: AddFilmDto) {
    return await this.filmService.addFilm(user, body)
  }

  @Get()
  async getFilms(
    @GetUser() user: RequestUser,
    @Query() query: GetFilmsQueryDto,
  ) {
    return await this.filmService.getFilms(user, query)
  }

  @Patch(':id/rate')
  async rateFilm(
    @GetUser() user: RequestUser,
    @Param() params: FilmIdParamDto,
    @Body() body: RateFilmDto,
  ) {
    return await this.filmService.rateFilm(user, params, body)
  }

  @Delete(':id')
  async deleteFilm(
    @GetUser() user: RequestUser,
    @Param() params: FilmIdParamDto,
  ) {
    return await this.filmService.deleteFilm(user, params)
  }
}
