import * as Yup from 'yup'
import { Genre, TvShowGetResponse } from '@/types'

const AddSeasonSchema = Yup.object().shape({
  number: Yup.number().positive().required(),
  year: Yup.number().min(1888).max(new Date().getFullYear()).required(),
  noOfEpisodes: Yup.number().positive().required(),
})

const AddTvShowSchema = Yup.object().shape({
  streamingServiceId: Yup.string().required().uuid(),
  name: Yup.string().required().min(1).trim(),
  genre: Yup.string().oneOf(Object.values(Genre)).required(),
  rating: Yup.number().required().positive().min(1).max(5),
  seasons: Yup.array().of(AddSeasonSchema).required(),
})

const AddSeasonToTvShowSchema = Yup.object().shape({
  tvShowId: Yup.string().required().uuid(),
  streamingServiceId: Yup.string().required().uuid(),
  season: AddSeasonSchema.required(),
})

export type AddSeasonDto = Yup.InferType<typeof AddSeasonSchema>
export type AddTvShowDto = Yup.InferType<typeof AddTvShowSchema>
export type AddSeasonToTvShowDto = Yup.InferType<typeof AddSeasonToTvShowSchema>

export type GetTvShowsResponse = {
  message: string
  data: TvShowGetResponse[]
  currentPage: number
  count: number
  totalPages: number
}

export { AddSeasonSchema, AddTvShowSchema, AddSeasonToTvShowSchema }
