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
  async addFilmToService(@Body() dto: AddFilmDto) {
    return await this.filmService.addFilmToService(dto)
  }

  @Get()
  async getFilmsByService(@Query() query: GetFilmsQueryDto) {
    return await this.filmService.getFilmsByService(query)
  }

  @Patch(':id/rate')
  async rateFilm(@Param() params: FilmIdParamDto, @Body() dto: RateFilmDto) {
    return await this.filmService.rateFilm(params, dto)
  }

  @Delete(':id')
  async removeFilm(@Param() params: FilmIdParamDto) {
    return await this.filmService.removeFilm(params)
  }
}
