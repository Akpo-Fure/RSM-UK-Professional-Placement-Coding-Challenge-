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
  async addFilm(@Body() body: AddFilmDto) {
    return await this.filmService.addFilm(body)
  }

  @Get()
  async getFilms(@Query() query: GetFilmsQueryDto) {
    return await this.filmService.getFilms(query)
  }

  @Patch(':id/rate')
  async rateFilm(@Param() params: FilmIdParamDto, @Body() body: RateFilmDto) {
    return await this.filmService.rateFilm(params, body)
  }

  @Delete(':id')
  async deleteFilm(@Param() params: FilmIdParamDto) {
    return await this.filmService.deleteFilm(params)
  }
}
