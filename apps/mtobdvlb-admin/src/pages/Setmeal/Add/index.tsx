import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography
} from '@mui/material'
import { z } from 'zod/v4'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import CommonSelect from '@/components/CommonSelect.tsx'
import { CircleXIcon, MinusIcon, PlusIcon } from 'lucide-react'
import UploadImage from '@/components/UploadImage.tsx'
import { Link, useNavigate } from 'react-router-dom'
import { useGetCategoryListByTypeQuery } from '@/features/category/categoryApi.ts'
import { useEffect, useState } from 'react'
import { useGetDishListByCategoryIdQuery } from '@/features/dish/dishApi.ts'
import { skipToken } from '@reduxjs/toolkit/query'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import type { SetmealAddRequest, SetmealDish } from '@/types/setmeal.ts'
import {
  useAddSetmealMutation,
  useGetSetmealByIdQuery,
  useUpdateSetmealMutation
} from '@/features/setmeal/setmealApi.ts'
import { toast } from 'react-toastify'
import { useGetPathNumberId } from '@/hooks/useGetPathNumberId.ts'

const formSchema = z.object({
  name: z.string().min(1, '请输入套餐名称').max(20),
  categoryId: z.number({ message: '' }).min(1, '请选择分类'),
  price: z.number({ message: '' }).min(1, '请输入套餐价格'),
  image: z.string().min(1, '请上传套餐图片'),
  description: z.string().optional(),
  id: z.number().optional(),
  setmealDishes: z.custom<SetmealAddRequest>()
})

type FormData = z.infer<typeof formSchema>

type DishSelectedParams = {
  id: number
  price: number
  name: string
}

const SetmealAdd = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      categoryId: undefined,
      price: undefined,
      image: '',
      description: ''
    },
    mode: 'onChange',
    reValidateMode: 'onBlur'
  })

  const [dialogOpen, setDialogOpen] = useState(false)
  const [categoryId, setCategoryId] = useState<number>()
  const [selectedDish, setSelectedDish] = useState<DishSelectedParams[]>([])
  const [setmealDishes, setSetmealDishes] = useState<SetmealDish[]>([])

  const { data: setmealCategoryData } = useGetCategoryListByTypeQuery(2)
  const { data: categoryData } = useGetCategoryListByTypeQuery(1)
  const { data } = useGetDishListByCategoryIdQuery(categoryId ?? skipToken)
  const dishData: DishSelectedParams[] =
    data?.data.map(item => ({
      id: item.id!,
      name: item.name!,
      price: item.price!
    })) ?? []
  const [addSetmeal] = useAddSetmealMutation()
  const [updateSetmeal] = useUpdateSetmealMutation()

  const navigate = useNavigate()
  const id = useGetPathNumberId()

  const { data: setmealData } = useGetSetmealByIdQuery(id ?? skipToken)

  useEffect(() => {
    if (!id || !setmealData) return
    reset({
      name: setmealData.data.name,
      price: setmealData.data.price,
      categoryId: setmealData.data.categoryId,
      image: setmealData.data.image,
      description: setmealData.data.description
    })
    setSetmealDishes(setmealData.data.setmealDishes)
    setSelectedDish(
      setmealData.data.setmealDishes.map(item => ({
        id: item.dishId,
        name: item.name,
        price: item.price
      }))
    )
  }, [id, reset, setmealData])

  const onSubmit = async (data: FormData) => {
    if (id) {
      try {
        await updateSetmeal({
          id,
          ...data,
          setmealDishes
        }).unwrap()
        toast.success('修改成功')
      } catch (e) {
        console.log(e)
        throw e
      }
      return
    }
    try {
      await addSetmeal({
        ...data,
        setmealDishes
      }).unwrap()
      toast.success('添加成功')
    } catch (error) {
      console.log(error)
      throw error
    }
    reset({
      name: '',
      categoryId: undefined,
      price: undefined,
      image: '',
      description: ''
    })
    setSetmealDishes([])
    setSelectedDish([])
  }

  const onSave = async (data: FormData) => {
    try {
      await onSubmit(data)
      navigate('/setmeal')
    } catch (e) {
      console.log(e)
    }
  }

  const columns: GridColDef[] = (
    [
      {
        field: 'name',
        headerName: '名称'
      },
      {
        field: 'price',
        headerName: '原价'
      },
      {
        field: 'copies',
        headerName: '份数',
        renderCell: params => (
          <div className="flex h-full w-full rounded border">
            <IconButton
              className={'rounded'}
              disabled={params.row.copies <= 1}
              onClick={() =>
                setSetmealDishes(prev => {
                  return prev.map(item =>
                    item.dishId === params.row.id
                      ? {
                          ...item,
                          copies: item.copies - 1
                        }
                      : item
                  )
                })
              }
            >
              <MinusIcon />
            </IconButton>
            <TextField
              value={params.row.copies}
              variant={'outlined'}
              onChange={e =>
                setSetmealDishes(prev =>
                  prev.map(item =>
                    item.dishId === params.row.id
                      ? {
                          ...item,
                          copies: Number(e.target.value)
                        }
                      : item
                  )
                )
              }
            />
            <IconButton
              className={'rounded'}
              onClick={() =>
                setSetmealDishes(prev =>
                  prev.map(item =>
                    item.dishId === params.row.id
                      ? {
                          ...item,
                          copies: item.copies + 1
                        }
                      : item
                  )
                )
              }
            >
              <PlusIcon />
            </IconButton>
          </div>
        )
      },
      {
        field: 'action',
        headerName: '操作',
        renderCell: params => (
          <div className={'flex items-center justify-center'}>
            <Button
              variant={'text'}
              onClick={() => {
                setSetmealDishes(prev => prev.filter(dish => dish.dishId !== params.row.id))
                setSelectedDish(prev => prev.filter(dish => dish.id !== params.row.id))
              }}
            >
              删除
            </Button>
          </div>
        )
      }
    ] as GridColDef[]
  ).map(item => ({
    sortable: false,
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    ...item
  }))

  return (
    <>
      <div className={'min-h-full p-5'}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={'flex h-full flex-col gap-5 rounded bg-white px-20 py-10 shadow'}
        >
          <div className={'grid grid-cols-2 gap-5'}>
            <div className={'flex items-center gap-3'}>
              <Typography>套餐名称:</Typography>
              <Controller
                name={'name'}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size={'small'}
                    placeholder={'请输入套餐名称'}
                    className={'flex-1'}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </div>
            <div className={'flex items-center gap-3'}>
              <Typography className={'min-w-20'}>套餐分类:</Typography>
              <Controller
                name={'categoryId'}
                control={control}
                render={({ field }) => (
                  <CommonSelect
                    {...field}
                    fullWidth
                    placeholder={'请选择套餐分类'}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    options={
                      setmealCategoryData?.data.map(item => {
                        return {
                          label: item.name!,
                          value: item.id!
                        }
                      }) ?? []
                    }
                    error={!!errors.categoryId}
                    helperText={errors.categoryId?.message}
                    className={'flex-1'}
                  />
                )}
              />
            </div>
            <div className={'flex items-center gap-3'}>
              <Typography>套餐价格:</Typography>
              <Controller
                name={'price'}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size={'small'}
                    placeholder={'请输入套餐价格'}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    type={'number'}
                    onChange={e => {
                      field.onChange(e.target.value ? +e.target.value : '')
                    }}
                    value={field.value ?? ''}
                    className={'flex-1'}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Typography>套餐菜品:</Typography>
            {setmealDishes?.length ? (
              <div
                className={
                  'min-h-50 w-200 flex flex-col rounded border border-gray-400 bg-gray-200 px-20 py-10 shadow'
                }
              >
                <Button
                  onClick={() => setDialogOpen(true)}
                  startIcon={<PlusIcon />}
                  variant={'contained'}
                >
                  添加菜品
                </Button>
                <DataGrid
                  disableAutosize
                  disableColumnMenu
                  disableRowSelectionOnClick
                  disableColumnResize
                  disableMultipleRowSelection
                  className={'mt-20'}
                  columns={columns}
                  rows={setmealDishes.map(item => ({
                    id: item.dishId,
                    name: item.name,
                    price: item.price,
                    copies: item.copies
                  }))}
                />
              </div>
            ) : (
              <Button
                onClick={() => setDialogOpen(true)}
                startIcon={<PlusIcon />}
                variant={'contained'}
              >
                添加菜品
              </Button>
            )}
          </div>
          <div className={'flex items-center gap-3'}>
            <Typography>套餐图片:</Typography>
            <UploadImage control={control} name={'image'} />
            <Typography variant={'caption'} className={'max-w-40 text-gray-400'}>
              图片大小不超过2M 仅能上传 PNG JPEG JPG类型图片
            </Typography>
          </div>
          <div className={'flex items-center gap-3'}>
            <Typography>套餐描述:</Typography>
            <Controller
              name={'description'}
              control={control}
              render={({ field }) => (
                <TextField {...field} multiline rows={3} className={'flex-1'} />
              )}
            />
          </div>
          <div className={'flex items-center justify-center gap-5'}>
            <Button variant={'outlined'} component={Link} to={'/setmeal'}>
              取消
            </Button>
            <Button onClick={handleSubmit(onSave)} variant={'contained'}>
              保存
            </Button>
            {!id && (
              <Button type={'submit'} variant={'contained'}>
                保存并继续
              </Button>
            )}
          </div>
        </form>
      </div>
      <Dialog
        scroll={'paper'}
        slotProps={{
          paper: {
            sx: {
              m: 0,
              p: 0,
              maxWidth: 'none'
            }
          }
        }}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>添加菜品</DialogTitle>
        <DialogContent className={'w-200 h-100 overflow-y-hidden'}>
          <div className={'flex h-full gap-4'}>
            <List className={'min-w-30 h-full overflow-y-auto border-r border-r-gray-200'}>
              {categoryData?.data.map(item => (
                <ListItemButton
                  defaultChecked={item.id === categoryData.data[0].id}
                  className={'w-full'}
                  sx={{
                    '&.Mui-selected': {
                      color: 'yellowgreen',
                      borderRightColor: 'yellowgreen',
                      borderRight: '1px solid'
                    }
                  }}
                  selected={item.id === categoryId}
                  onClick={() => setCategoryId(item.id)}
                >
                  {item.name}
                </ListItemButton>
              ))}
            </List>
            <List
              className={
                'flex h-full flex-1 flex-col items-center gap-2 overflow-y-scroll pr-2 text-xs'
              }
            >
              {dishData.map(item => (
                <ListItem key={item.id} className={'h-20 w-full p-0'}>
                  <ListItemButton
                    className={'flex border border-gray-400'}
                    onClick={() =>
                      setSelectedDish(prev => {
                        if (prev.find(dish => dish.id === item.id))
                          return prev.filter(dish => dish.id !== item.id)
                        return [...prev, item]
                      })
                    }
                  >
                    <ListItemIcon className={''}>
                      <Checkbox
                        value={item.id}
                        checked={!!selectedDish.find(dish => dish.id === item.id)}
                      />
                    </ListItemIcon>
                    <div className={'flex flex-1 justify-between text-xs'}>
                      <Typography className={'text-xs'}>{item.name}</Typography>
                      <Typography className={'text-xs'}>{'在售  ' + item.price}</Typography>
                    </div>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <div className={'flex h-full flex-1 flex-col p-3'}>
              <Typography>已选菜品({selectedDish.length})</Typography>
              <List className={'flex flex-col gap-3 overflow-y-scroll px-2 py-1'}>
                {selectedDish.map(item => (
                  <ListItem
                    className={'w-full rounded shadow-xl'}
                    secondaryAction={
                      <IconButton
                        onClick={() => setSelectedDish(selectedDish.filter(dish => dish !== item))}
                        edge={'end'}
                      >
                        <CircleXIcon />
                      </IconButton>
                    }
                    key={item.id}
                  >
                    <ListItemText className={'flex justify-between'}>
                      <Typography>{item.name}</Typography>
                      <Typography>{'￥ ' + item.price}</Typography>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant={'outlined'}
            onClick={() => {
              setDialogOpen(false)
              setSelectedDish(
                setmealDishes.map(item => ({
                  id: item.dishId,
                  name: item.name,
                  price: item.price
                }))
              )
            }}
          >
            取消
          </Button>
          <Button
            variant={'contained'}
            onClick={() => {
              setSetmealDishes(
                selectedDish.map(item => ({
                  dishId: item.id!,
                  name: item.name!,
                  price: item.price!,
                  copies: 1
                }))
              )
              setDialogOpen(false)
            }}
          >
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SetmealAdd
