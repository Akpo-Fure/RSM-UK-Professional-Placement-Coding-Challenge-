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
import { FilmService } from './film.service'
import {
  AddFilmDto,
  FilmIdParamDto,
  RateFilmDto,
  GetFilmsQueryDto,
} from './film.dto'

@Controller('film')
export class FilmController {
  constructor(private filmService: FilmService) {}

  @Post()
  async createFilm(@Body() body: AddFilmDto) {
    return await this.filmService.createFilm(body)
  }

  @Get()
  async fetchFilms(@Query() query: GetFilmsQueryDto) {
    return await this.filmService.fetchFilms(query)
  }

  @Patch(':id/rate')
  async updateFilmRating(
    @Param() params: FilmIdParamDto,
    @Body() body: RateFilmDto,
  ) {
    return await this.filmService.updateFilmRating(params, body)
  }

  @Delete(':id')
  async removeFilm(@Param() params: FilmIdParamDto) {
    return await this.filmService.removeFilm(params)
  }
}
