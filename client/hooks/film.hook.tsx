/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from '@/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { AddFilmDto, RateFilmDto } from '@/schema'

const URL = '/film'

export const useAddFilm = (id: string) => {
  const queryClient = useQueryClient()

  const addFilm = async (dto: AddFilmDto) => {
    const response = await API.post(URL, dto)
    return response
  }

  const mutation = useMutation({
    mutationFn: addFilm,
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: ['GetStreamingServices'],
      })

      await queryClient.invalidateQueries({
        queryKey: [`GetFilmsByService-${id}`],
      })

      toast.success(res.data.message ?? 'Film added')
    },
    onError: (error: any) => {
      toast.error(error.response.data.message ?? 'Failed to add film')
    },
  })

  return mutation
}

export const useGetFilmsByService = (id: string) => {
  const getFilms = async () => {
    const response = await API.get(`${URL}?streamingServiceId=${id}`)
    return response
  }

  const query = useQuery({
    queryFn: getFilms,
    queryKey: [`GetFilmsByService-${id}`],
    refetchOnWindowFocus: 'always',
  })

  return query
}

export const useRateFilm = (id: string) => {
  const queryClient = useQueryClient()

  const rateFilm = async (dto: RateFilmDto) => {
    const response = await API.patch(`${URL}/${id}/rate`, dto)
    return response
  }

  const mutation = useMutation({
    mutationFn: rateFilm,
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: [`GetFilmsByService-${id}`],
      })

      toast.success(res.data.message ?? 'Film rated')
    },
    onError: (error: any) => {
      toast.error(error.response.data.message ?? 'Failed to rate film')
    },
  })

  return mutation
}

export const useDeleteFilm = (id: string, streamingServiceId: string) => {
  const queryClient = useQueryClient()

  const removeFilm = async () => {
    const response = await API.delete(`${URL}/${id}`)
    return response
  }

  const mutation = useMutation({
    mutationFn: removeFilm,
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: ['GetStreamingServices'],
      })

      await queryClient.invalidateQueries({
        queryKey: [`GetFilmsByService-${streamingServiceId}`],
      })

      toast.success(res.data.message ?? 'Film removed')
    },
    onError: (error: any) => {
      toast.error(error.response.data.message ?? 'Failed to remove film')
    },
  })

  return mutation
}
