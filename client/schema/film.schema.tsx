import * as Yup from 'yup'
import { Genre, Film } from '@/types'

const AddFilmSchema = Yup.object().shape({
  streamingServiceId: Yup.string().required().uuid(),
  name: Yup.string().required().min(1).trim(),
  year: Yup.number().required().min(1888).max(new Date().getFullYear()),
  genre: Yup.string().oneOf(Object.values(Genre)).required(),
  rating: Yup.number().required().min(1).max(5),
  runtime: Yup.number().required().min(1),
})

const RateFilmSchema = Yup.object().shape({
  rating: Yup.number().required().min(1).max(5),
})

export type AddFilmDto = Yup.InferType<typeof AddFilmSchema>

export type RateFilmDto = Yup.InferType<typeof RateFilmSchema>

export type GetFilmsResponse = {
  message: string
  data: Film[]
  currentPage: number
  count: number
  totalPages: number
}

export { AddFilmSchema, RateFilmSchema }
