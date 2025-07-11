import { Controller, type FieldValues, type UseControllerProps } from 'react-hook-form'
import { useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useUploadMutation } from '@/features/common/commonApi.ts'
import { toast } from 'react-toastify'

type UploadImageProps<T extends FieldValues> = {
  control: UseControllerProps<T>['control']
  name: UseControllerProps<T>['name']
}

const UploadImage = <T extends FieldValues>({ control, name }: UploadImageProps<T>) => {
  const [upload, { isLoading }] = useUploadMutation()
  const onChangeRef = useRef<((url: string) => void) | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file || !onChangeRef.current) return
      try {
        const res = await upload(file).unwrap()
        onChangeRef.current(res.data)
      } catch (e) {
        console.log(e)
      }
    },
    [onChangeRef, upload]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 1024 * 1024 * 2,
    accept: { 'image/*': [] },
    onDropRejected: () => {
      toast.error('文件格式错误')
    }
  })
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          onChangeRef.current = field.onChange
          return (
            <>
              <Box
                {...getRootProps()}
                className={
                  'size-42 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 object-cover'
                }
              >
                <input {...getInputProps()} />
                {isLoading ? (
                  <CircularProgress />
                ) : field.value ? (
                  <Box className="flex h-full w-full items-center justify-center">
                    <img src={field.value} alt="Uploaded" className="h-full w-full object-cover" />
                  </Box>
                ) : (
                  <Box className="flex h-full w-full items-center justify-center">
                    <Typography className="text-gray-500">拖拽或点击来上传文件</Typography>
                  </Box>
                )}
              </Box>
            </>
          )
        }}
      />
    </>
  )
}

export default UploadImage
