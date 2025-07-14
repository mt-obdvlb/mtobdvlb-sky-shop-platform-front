import { Button, TextField, Typography } from '@mui/material'
import { z } from 'zod/v4'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import CommonSelect from '@/components/CommonSelect.tsx'
import { useGetCategoryListByTypeQuery } from '@/features/category/categoryApi.ts'
import {
  useAddDishMutation,
  useGetDishByIdQuery,
  useUpdateDishMutation
} from '@/features/dish/dishApi.ts'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import UploadImage from '@/components/UploadImage.tsx'
import { PlusIcon } from 'lucide-react'
import type { DishFlavor } from '@/types/dish.ts'
import DishFlavorChip from '@/pages/Dish/Add/components/DishFlavorChip.tsx'
import { useEffect, useState } from 'react'
import { useGetPathNumberId } from '@/hooks/useGetPathNumberId.ts'
import { skipToken } from '@reduxjs/toolkit/query'
import { Helmet } from 'react-helmet-async'

const formSchema = z.object({
  name: z.string().min(1, '请输入菜品名称').max(20),
  categoryId: z
    .number({
      message: ''
    })
    .min(1, '请选择菜品分类'),
  flavors: z.custom<DishFlavor[]>().optional(),
  price: z.number({ message: '' }).min(1, '请输入菜品价格'),
  image: z.string(),
  description: z.string().optional()
})

type FormData = z.infer<typeof formSchema>

const DishAdd = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      price: undefined,
      flavors: [],
      image: '',
      description: '',
      categoryId: undefined
    },
    mode: 'onChange',
    reValidateMode: 'onBlur'
  })

  const id = useGetPathNumberId()
  const { data: res } = useGetDishByIdQuery(id ?? skipToken)

  useEffect(() => {
    if (!id) return
    reset({
      name: res?.data.name,
      price: res?.data.price,
      flavors: res?.data.flavors,
      image: res?.data.image,
      description: res?.data.description,
      categoryId: res?.data.categoryId
    })
    setFlavorList(res?.data.flavors ?? [])
  }, [id, res, reset])

  const { data: categoryList } = useGetCategoryListByTypeQuery(1)
  const [addDish] = useAddDishMutation()
  const [updateDish] = useUpdateDishMutation()

  const navigate = useNavigate()

  const categoryOptions = categoryList?.data.map(item => ({
    label: item.name!,
    value: item.id!
  }))

  const onSubmit = async (data: FormData) => {
    data.flavors =
      flavorList?.map(item => ({
        name: item.name,
        value: item.value
      })) ?? []
    if (id) {
      try {
        await updateDish({
          id,
          ...data
        }).unwrap()
        toast.success('更新成功')
      } catch (error) {
        console.log(error)
        throw error
      }
    }
    try {
      await addDish(data).unwrap()
      toast.success('添加成功')
      reset()
      setFlavorList([])
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const onSave = async (data: FormData) => {
    try {
      await onSubmit(data)
      navigate('/dish')
    } catch (e) {
      console.log(e)
    }
  }

  const [flavorList, setFlavorList] = useState<
    {
      name: string
      value: string
    }[]
  >([])

  const handleFlavorAdd = () => {
    setFlavorList([...flavorList, { name: '', value: '' }])
  }

  const flavorListData = [
    {
      name: '甜味',
      value: ['无糖', '少糖', '半糖', '多糖', '全糖']
    },
    {
      name: '温度',
      value: ['热饮', '常温', '去冰', '少冰', '多冰']
    },
    {
      name: '忌口',
      value: ['不要葱', '不要蒜', '不要香菜', '不要辣']
    },
    {
      name: '辣度',
      value: ['不辣', '微辣', '中辣', '重辣']
    }
  ]

  return (
    <>
      <Helmet>
        <title>{id ? '编辑菜品' : '添加菜品'}</title>
      </Helmet>
      <div className={'min-h-full w-full p-4'}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={'px-30 flex min-h-full flex-col gap-4 rounded bg-white py-10 shadow'}
        >
          <div className={'grid grid-cols-2 gap-10'}>
            <div className={'flex items-center gap-2'}>
              <Typography>菜品名称:</Typography>
              <Controller
                name={'name'}
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      size={'small'}
                      {...field}
                      placeholder={'请输入菜品名称'}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  </>
                )}
              />
            </div>
            <div className={'flex items-center gap-2'}>
              <Typography>菜品分类:</Typography>
              <Controller
                name={'categoryId'}
                control={control}
                render={({ field }) => (
                  <CommonSelect
                    {...field}
                    size={'small'}
                    placeholder={'请选择菜品分类'}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    options={categoryOptions ?? []}
                    error={!!errors.categoryId}
                    helperText={errors.categoryId?.message}
                  />
                )}
              />
            </div>
            <div className={'flex items-center gap-2'}>
              <Typography className={''}>菜品价格:</Typography>
              <Controller
                name={'price'}
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      size={'small'}
                      placeholder={'请选择菜品价格'}
                      error={!!errors.price}
                      helperText={errors.price?.message}
                      type={'number'}
                      onChange={e => {
                        field.onChange(e.target.value ? +e.target.value : '')
                      }}
                      value={field.value ?? ''}
                    />
                  </>
                )}
              />
            </div>
          </div>
          <div className={'flex items-center gap-2'}>
            <Typography>口味做法配置:</Typography>
            {flavorList.length > 0 ? (
              <div className={'flex w-full flex-col gap-3 bg-gray-300 p-3'}>
                {flavorList.map((item, index) => (
                  <DishFlavorChip
                    flavorListData={flavorListData}
                    item={item}
                    index={index}
                    setFlavorList={setFlavorList}
                    onDelete={() => {
                      setFlavorList(flavorList.filter((_, i) => i !== index))
                    }}
                    flavorList={flavorList}
                  />
                ))}
                {flavorList.length < 4 && (
                  <Button onClick={handleFlavorAdd} variant={'contained'} startIcon={<PlusIcon />}>
                    添加口味
                  </Button>
                )}
              </div>
            ) : (
              <Button onClick={handleFlavorAdd} variant={'contained'} startIcon={<PlusIcon />}>
                添加口味
              </Button>
            )}
          </div>
          <div className={'flex items-center gap-2'}>
            <Typography>菜品图片:</Typography>
            <UploadImage control={control} name={'image'} />
          </div>
          <div className={'flex items-center gap-2'}>
            <Typography className={''}>菜品描述:</Typography>
            <Controller
              name={'description'}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className={'flex-1'}
                  placeholder={'请输入菜品描述'}
                  multiline
                  rows={3}
                />
              )}
            />
          </div>
          <div className={'flex items-center justify-center gap-5 border-t border-t-gray-300 py-5'}>
            <Button className={'outline'} component={Link} to={'/dish'}>
              取消
            </Button>
            <Button variant={'contained'} onClick={handleSubmit(onSave)}>
              保存
            </Button>
            {!id && (
              <Button variant={'contained'} type={'submit'}>
                保存并继续
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  )
}

export default DishAdd
