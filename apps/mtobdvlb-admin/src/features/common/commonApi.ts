import { baseApi } from '@/api/baseApi.ts'
import type { ApiResponse } from '@/types/global.ts'

const baseUrl = '/common'

const API = {
  upload: '/upload'
} as const

const commonApi = baseApi.injectEndpoints({
  endpoints: build => ({
    upload: build.mutation<ApiResponse<string>, File>({
      query: file => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          url: baseUrl + API.upload,
          method: 'POST',
          body: formData
        }
      }
    })
  })
})

export const { useUploadMutation } = commonApi
