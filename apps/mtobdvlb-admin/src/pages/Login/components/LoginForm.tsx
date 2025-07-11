import { z } from 'zod/v4'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, InputAdornment, TextField } from '@mui/material'
import { LockIcon, LogInIcon, User } from 'lucide-react'
import { useLoginUserMutation } from '@/features/user/userApi.ts'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const loginFormSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空')
})

type FormData = z.infer<typeof loginFormSchema>

const LoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: 'admin',
      password: '123456'
    },
    mode: 'onChange',
    reValidateMode: 'onBlur'
  })

  const [loginUser, { isLoading }] = useLoginUserMutation()

  const navigate = useNavigate()
  const location = useLocation()

  const onSubmit = async (data: FormData) => {
    try {
      await loginUser(data).unwrap()
      const redirect = new URLSearchParams(location.search)
      navigate(redirect.get('redirect') || '/')
      toast.success('登录成功')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={'w-100 flex flex-col gap-3'}>
      <Controller
        control={control}
        name={'username'}
        render={({ field }) => (
          <TextField
            {...field}
            label={'用户名'}
            error={!!errors.username}
            helperText={errors.username?.message}
            variant={'standard'}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position={'start'}>
                    <User />
                  </InputAdornment>
                )
              }
            }}
          />
        )}
      />
      <Controller
        control={control}
        name={'password'}
        render={({ field }) => (
          <TextField
            type={'password'}
            {...field}
            label={'密码'}
            error={!!errors.password}
            helperText={errors.password?.message}
            variant={'standard'}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position={'start'}>
                    <LockIcon />
                  </InputAdornment>
                )
              }
            }}
          />
        )}
      />
      <Button
        type={'submit'}
        variant={'outlined'}
        size={'medium'}
        startIcon={<LogInIcon />}
        loading={isLoading}
      >
        登录
      </Button>
    </form>
  )
}

export default LoginForm
