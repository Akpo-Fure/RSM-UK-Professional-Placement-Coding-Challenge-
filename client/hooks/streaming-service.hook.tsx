/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from '@/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { CreateStreamingServiceDto } from '@/schema'

const URL = '/streaming-service'

export const useCreateStreamingService = () => {
  const queryClient = useQueryClient()

  const createStreamingService = async (dto: CreateStreamingServiceDto) => {
    const response = await API.post(URL, dto)
    return response
  }

  const mutation = useMutation({
    mutationFn: createStreamingService,
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: ['GetStreamingServices'],
      })

      toast.success(res.data.message ?? 'Streaming service created')
    },
    onError: (error: any) => {
      toast.error(
        error.response.data.message ?? 'Failed to create streaming service',
      )
    },
  })

  return mutation
}

export const useGetStreamingServices = () => {
  const getStreamingServices = async () => {
    const response = await API.get(URL)
    return response
  }

  const query = useQuery({
    queryFn: getStreamingServices,
    queryKey: ['GetStreamingServices'],
    refetchOnWindowFocus: 'always',
  })

  return query
}

export const useDeleteStreamingService = () => {
  const queryClient = useQueryClient()

  const deleteStreamingService = async (id: string) => {
    const response = await API.delete(`${URL}/${id}`)
    return response
  }

  const mutation = useMutation({
    mutationFn: deleteStreamingService,
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: ['GetStreamingServices'],
      })

      toast.success(res.data.message ?? 'Streaming service deleted')
    },
    onError: (error: any) => {
      toast.error(
        error.response.data.message ?? 'Failed to delete streaming service',
      )
    },
  })

  return mutation
}
