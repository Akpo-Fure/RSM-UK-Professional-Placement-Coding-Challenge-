import { API } from '@/api'
import { useQuery } from '@tanstack/react-query'

export const useGetAPI = () => {
  const getAPI = async () => {
    const response = await API.get('')
    return response
  }

  const query = useQuery({
    queryFn: getAPI,
    queryKey: ['GetAPI'],
    refetchOnWindowFocus: 'always',
  })

  return query
}
