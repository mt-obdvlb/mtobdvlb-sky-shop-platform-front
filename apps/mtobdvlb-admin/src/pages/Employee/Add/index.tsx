import { Button, FormControlLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod/v4'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import {
  useAddEmployeeMutation,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation
} from '@/features/employee/employeeApi.ts'
import { skipToken } from '@reduxjs/toolkit/query'
import { useGetPathNumberId } from '@/hooks/useGetPathNumberId.ts'
import { useEffect } from 'react'

const FormSchema = z.object({
  name: z.string().min(1, '请输入姓名'),
  username: z.string().min(1, '请输入用户名'),
  sex: z.literal(['0', '1']),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入正确的手机号码'),
  idNumber: z
    .string()
    .regex(
      /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      '请输入正确的身份证号码'
    )
})

type FormData = z.infer<typeof FormSchema>

const EmployeeAdd = () => {
  const navigate = useNavigate()

  const id = useGetPathNumberId()

  const [addEmployee] = useAddEmployeeMutation()
  const [updateEmployee] = useUpdateEmployeeMutation()
  const { data: res } = useGetEmployeeByIdQuery(id ?? skipToken)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      username: '',
      sex: '1',
      phone: '',
      idNumber: ''
    },
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    reValidateMode: 'onBlur'
  })

  useEffect(() => {
    if (id && res) {
      reset({
        name: res.data.name,
        username: res.data.username,
        sex: res.data.sex,
        phone: res.data.phone,
        idNumber: res.data.idNumber
      })
    }
  }, [id, res, reset])

  const onSubmit = async (data: FormData) => {
    if (id) {
      try {
        await updateEmployee({
          ...data,
          id
        }).unwrap()
        toast.success('更新成功')
      } catch (e) {
        console.log(e)
        throw e
      }
      return
    }
    try {
      await addEmployee(data).unwrap()
      toast.success('添加成功')
      reset()
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  const onSave = async (data: FormData) => {
    try {
      await onSubmit(data)
      navigate('/employee')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <div className={'flex h-full flex-col bg-gray-400 p-4'}>
        <div className={'flex items-center'}>
          <Button
            startIcon={<ArrowLeft />}
            component={Link}
            to={'/employee'}
            variant={'text'}
            className={'border-r- rounded-none border-r pr-3 text-black'}
            size={'small'}
          >
            返回
          </Button>
          <Typography className={'ml-3'}>{id ? '修改员工信息' : '添加员工'}</Typography>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col rounded bg-white shadow'}>
          <div className={'px-30 flex flex-col gap-5 border-b py-10'}>
            <Controller
              name={'name'}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={'姓名'}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  className={'w-1/2'}
                  variant={'outlined'}
                />
              )}
            />

            <Controller
              name={'username'}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={'用户名'}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  className={'w-1/2'}
                  variant={'outlined'}
                />
              )}
            />
            <Controller
              name={'phone'}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={'手机号'}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  className={'w-1/2'}
                  variant={'outlined'}
                />
              )}
            />
            <Controller
              name={'sex'}
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  value={field.value}
                  onChange={event => field.onChange(event.target.value)}
                  className={'flex flex-row gap-3'}
                >
                  <FormControlLabel value={'1'} control={<Radio />} label={'男'} />
                  <FormControlLabel value={'0'} control={<Radio />} label={'女'} />
                </RadioGroup>
              )}
            />
            <Controller
              name={'idNumber'}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={'身份证号'}
                  error={!!errors.idNumber}
                  helperText={errors.idNumber?.message}
                  className={'w-1/2'}
                  variant={'outlined'}
                />
              )}
            />
          </div>
          <div className={'flex items-center justify-center gap-5 py-4'}>
            <Button size={'large'} component={Link} to={'/employee'} variant={'outlined'}>
              取消
            </Button>
            <Button size={'large'} onClick={handleSubmit(onSave)} variant={'contained'}>
              保存
            </Button>
            {!id && (
              <Button size={'large'} type={'submit'} variant={'contained'}>
                保存并继续
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  )
}

export default EmployeeAdd
