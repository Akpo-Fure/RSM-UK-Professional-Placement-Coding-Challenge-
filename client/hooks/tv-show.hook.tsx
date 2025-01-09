/* eslint-disable @typescript-eslint/no-explicit-any */

import { API } from '@/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { AddTvShowDto, AddSeasonToTvShowDto, RateFilmDto } from '@/schema'

const URL = '/tv-show'

export const useAddTvShow = (id: string) => {
  const queryClient = useQueryClient()

  const addTvShow = async (dto: AddTvShowDto) => {
    const response = await API.post(URL, dto)
    return response
  }

  const mutation = useMutation({
    mutationFn: addTvShow,
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: [`GetTvShowsByService-${id}`],
      })

      await queryClient.invalidateQueries({
        queryKey: ['GetStreamingServices'],
      })

      await queryClient.invalidateQueries({
        queryKey: [`GetTvShowsOnOtherServices-${id}`],
      })

      toast.success(res.data.message ?? 'Tv show added')
    },
    onError: (error: any) => {
      toast.error(error.response.data.message ?? 'Failed to add tv show')
    },
  })

  return mutation
}

export const useGetTvShowsByService = (id: string) => {
  const getTvShows = async () => {
    const response = await API.get(`${URL}?streamingServiceId=${id}`)
    return response
  }

  const query = useQuery({
    queryFn: getTvShows,
    queryKey: [`GetTvShowsByService-${id}`],
    refetchOnWindowFocus: 'always',
  })

  return query
}

export const useGetTvShowsOnOtherServices = (id: string) => {
  const getTvShows = async () => {
    const response = await API.get(`${URL}/${id}/other-services`)
    return response
  }

  const query = useQuery({
    queryFn: getTvShows,
    queryKey: [`GetTvShowsOnOtherServices-${id}`],
    refetchOnWindowFocus: 'always',
  })

  return query
}

export const useRateTvShow = (id: string) => {
  const queryClient = useQueryClient()

  const rateTvShow = async (dto: RateFilmDto) => {
    const response = await API.patch(`${URL}/${id}/rate`, dto)
    return response
  }

  const mutation = useMutation({
    mutationFn: rateTvShow,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [`GetTvShowsByService-${id}`],
      })
    },
    onError: (error: any) => {
      toast.error(error.response.data.message ?? 'Failed to rate tv show')
    },
  })

  return mutation
}

export const useAddTvShowToService = (
  tvShowId: string,
  streamingServiceId: string,
) => {
  const queryClient = useQueryClient()

  const addTvShowToService = async () => {
    const response = await API.post(
      `${URL}/add-to-streaming-service/${tvShowId}/${streamingServiceId}`,
    )
    return response
  }

  const mutation = useMutation({
    mutationFn: addTvShowToService,
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: [`GetTvShowsByService-${streamingServiceId}`],
      })

      await queryClient.invalidateQueries({
        queryKey: ['GetStreamingServices'],
      })

      toast.success(res.data.message ?? 'Tv show added to service')
    },
    onError: (error: any) => {
      toast.error(
        error.response.data.message ?? 'Failed to add tv show to service',
      )
    },
  })

  return mutation
}

export const useAddSeasonToTvShow = (id: string) => {
  const queryClient = useQueryClient()

  const addSeason = async (dto: AddSeasonToTvShowDto) => {
    const response = await API.post(`${URL}/add-season`, dto)
    return response
  }

  const mutation = useMutation({
    mutationFn: addSeason,
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: [`GetTvShowsByService-${id}`],
      })

      toast.success(res.data.message ?? 'Season added')
    },
    onError: (error: any) => {
      toast.error(error.response.data.message ?? 'Failed to add season')
    },
  })

  return mutation
}
