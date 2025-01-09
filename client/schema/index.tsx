import {
  CreateStreamingServiceSchema,
  CreateStreamingServiceDto,
} from './streaming-service.schema'
import {
  AddFilmDto,
  AddFilmSchema,
  RateFilmSchema,
  RateFilmDto,
} from './film.schema'
import {
  AddSeasonSchema,
  AddTvShowSchema,
  AddSeasonToTvShowSchema,
  AddSeasonDto,
  AddTvShowDto,
  AddSeasonToTvShowDto,
} from './tv-show.schema'

export type {
  CreateStreamingServiceDto,
  AddFilmDto,
  RateFilmDto,
  AddSeasonDto,
  AddTvShowDto,
  AddSeasonToTvShowDto,
}

export {
  CreateStreamingServiceSchema,
  AddFilmSchema,
  RateFilmSchema,
  AddSeasonSchema,
  AddTvShowSchema,
  AddSeasonToTvShowSchema,
}
