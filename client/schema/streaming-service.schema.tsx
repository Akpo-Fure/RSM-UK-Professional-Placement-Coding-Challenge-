import { Currency, StreamingServiceGetResponse } from '@/types'
import * as Yup from 'yup'

const CreateStreamingServiceSchema = Yup.object().shape({
  name: Yup.string().required().min(1).trim(),
  price: Yup.number().required().positive(),
  currency: Yup.string().oneOf(Object.values(Currency)).default(Currency.GBP),
})

export type CreateStreamingServiceDto = Yup.InferType<
  typeof CreateStreamingServiceSchema
>

export type GetStreamingServicesResponse = {
  message: string
  data: StreamingServiceGetResponse[]
  currentPage: number
  count: number
  totalPages: number
}

export { CreateStreamingServiceSchema }
