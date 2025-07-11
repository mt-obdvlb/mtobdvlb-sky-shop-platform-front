import { useSearchParams } from 'react-router-dom'

export const useGetPathNumberId = () => {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  return id ? Number(id) : undefined
}
