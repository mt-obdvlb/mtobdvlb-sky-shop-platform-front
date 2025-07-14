import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material'
import { DotIcon, PlusIcon } from 'lucide-react'
import CommonSelect from '@/components/CommonSelect.tsx'
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryByIdQuery,
  useGetCategoryPageListQuery,
  useUpdateCategoryMutation,
  useUpdateCategoryStatusMutation
} from '@/features/category/categoryApi.ts'
import type { GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import type { CategoryStatus, CategoryType } from '@/types/category.ts'
import clsx from 'clsx'
import ConfirmButton from '@/components/ConfirmButton'
import { toast } from 'react-toastify'
import { z } from 'zod/v4'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { skipToken } from '@reduxjs/toolkit/query'
import { Helmet } from 'react-helmet-async'

type Props = {
  name: string
  type: CategoryType | undefined
}

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, '请输入分类名称'),
  sort: z
    .number({
      message: ''
    })
    .min(1, '请输入排序号'),
  type: z.custom<CategoryType>()
})

type FormData = z.infer<typeof formSchema>

const Category = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      id: undefined,
      name: '',
      sort: undefined,
      type: undefined
    },
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onBlur'
  })

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const [currentProps, setCurrentProps] = useState<Props>({
    name: '',
    type: undefined
  })

  const [props, setProps] = useState<Props>()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState<number>()

  const { data: res, isLoading } = useGetCategoryPageListQuery({
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    ...props
  })
  const [deleteCategory] = useDeleteCategoryMutation()
  const [updateCategoryStatus] = useUpdateCategoryStatusMutation()
  const [addCategory] = useAddCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const { data: resById } = useGetCategoryByIdQuery(categoryId ?? skipToken)

  useEffect(() => {
    if (categoryId && resById) {
      reset({
        name: resById.data.name,
        type: resById.data.type,
        sort: resById.data.sort,
        id: categoryId
      })
    }
  }, [resById, reset, categoryId])

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id).unwrap()
      toast.success('删除成功')
    } catch (e) {
      console.log(e)
    }
  }

  const handleUpdateStatus = async (id: number, status: CategoryStatus) => {
    try {
      await updateCategoryStatus({ id, status }).unwrap()
      if (status === 1) {
        toast.success('启用成功')
      } else {
        toast.error('禁用成功')
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleUpdateOrAdd = async (id?: number, type?: CategoryType) => {
    if (id) {
      setTitle('修改分类')
      setCategoryId(id)
    } else {
      setCategoryId(undefined)
      reset({
        name: '',
        sort: undefined,
        type: type,
        id: undefined
      })
      if (type === 1) {
        setTitle('新增菜品分类')
      } else {
        setTitle('新增套餐分类')
      }
    }
    setDialogOpen(true)
  }

  const columns: GridColDef[] = (
    [
      {
        field: 'name',
        headerName: '分类名称'
      },
      {
        field: 'type',
        headerName: '分类类型',
        renderCell: params => (
          <div className="flex h-full w-full items-center justify-center">
            <Typography>{params.row.type === 1 ? '菜品分类' : '套餐分类'}</Typography>
          </div>
        )
      },
      {
        field: 'sort',
        headerName: '排序',
        maxWidth: 80,
        sortable: true
      },
      {
        field: 'status',
        headerName: '状态',
        renderCell: params => (
          <div
            className={
              'flex h-full w-full items-center justify-center ' +
              clsx({
                'text-green-500': params.row.status === 1,
                'text-red-500': params.row.status === 0
              })
            }
          >
            <DotIcon />
            <Typography>{params.row.status === 1 ? '启用' : '禁用'}</Typography>
          </div>
        )
      },
      {
        field: 'updateTime',
        headerName: '最后操作时间'
      },
      {
        field: 'action',
        headerName: '操作',
        minWidth: 250,
        renderCell: params => (
          <div className="flex h-full items-center justify-center gap-2">
            <Button variant="text" size="small" onClick={() => handleUpdateOrAdd(params.row.id)}>
              修改
            </Button>
            <ConfirmButton
              className={'rounded-none border-x border-x-gray-200 px-2'}
              size={'small'}
              title="删除"
              variant={'text'}
              onConfirm={() => handleDelete(params.row.id)}
            >
              删除
            </ConfirmButton>
            <ConfirmButton
              variant={'text'}
              size={'small'}
              title={params.row.status === 0 ? '启用' : '禁用'}
              onConfirm={() => handleUpdateStatus(params.row.id, params.row.status === 0 ? 1 : 0)}
            >
              {params.row.status === 0 ? '启用' : '禁用'}
            </ConfirmButton>
          </div>
        )
      }
    ] as GridColDef[]
  ).map(item => ({
    flex: item.flex ?? 1,
    headerAlign: 'center',
    align: 'center',
    sortable: item.sortable ?? false,
    ...item
  }))

  const rows: GridRowsProp =
    res?.data.records.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      sort: item.sort,
      status: item.status,
      updateTime: item.updateTime
    })) ?? []

  const total = res?.data.total ?? 0

  const handleSearch = () => {
    setProps({
      name: currentProps.name,
      type: currentProps.type
    })
  }

  const onSubmit = async (data: FormData) => {
    console.log(data)
    if (categoryId) {
      try {
        await updateCategory({
          id: categoryId,
          name: data.name,
          sort: data.sort,
          type: data.type
        }).unwrap()

        toast.success('修改成功')
      } catch (e) {
        console.log(e)
        throw e
      }
    } else {
      try {
        await addCategory(data).unwrap()
        toast.success('添加成功')
        reset({
          name: '',
          sort: undefined,
          type: undefined,
          id: undefined
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }
  }

  const onSave = async (data: FormData) => {
    try {
      await onSubmit(data)
      setDialogOpen(false)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Helmet>
        <title>分类管理</title>
      </Helmet>
      <div className={'min-h-full w-full scroll-auto p-5'}>
        <div className={'flex h-full flex-col rounded bg-white p-4 shadow'}>
          <div className={'flex items-center justify-between'}>
            <div className={'flex items-center gap-4'}>
              <Typography>分类名称:</Typography>
              <TextField placeholder={'请输入分类名称'} />
              <Typography>分类类型:</Typography>
              <CommonSelect
                placeholder={'请选择'}
                options={[
                  {
                    label: '菜品分类',
                    value: 1
                  },
                  { label: '套餐分类', value: 2 }
                ]}
                value={currentProps.type ?? ''}
                onChange={e => {
                  setCurrentProps(prev => ({
                    ...prev,
                    type: e.target.value as CategoryType
                  }))
                }}
              />

              <Button className={''} onClick={handleSearch}>
                查询
              </Button>
            </div>
            <div className={'flex gap-3'}>
              <Button
                startIcon={<PlusIcon className={'size-4'} />}
                onClick={() => handleUpdateOrAdd(undefined, 1)}
                variant={'contained'}
              >
                添加菜品分类
              </Button>
              <Button
                startIcon={<PlusIcon className={'size-4'} />}
                variant={'contained'}
                onClick={() => handleUpdateOrAdd(undefined, 2)}
              >
                添加套餐分类
              </Button>
            </div>
          </div>
          <DataGrid
            className={'mt-5'}
            loading={isLoading}
            columns={columns}
            rows={rows}
            disableColumnMenu
            disableColumnResize
            paginationModel={paginationModel}
            paginationMode={'server'}
            onPaginationModelChange={setPaginationModel}
            rowCount={total}
            pageSizeOptions={[3, 10, 20, 100]}
            disableMultipleRowSelection
            disableAutosize
            disableRowSelectionOnClick
          />
        </div>
      </div>
      <Dialog
        scroll={'body'}
        open={dialogOpen}
        onClose={() => {
          return setDialogOpen(false)
        }}
      >
        <form onSubmit={handleSubmit(onSave)} className={'h-75'}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent className={'flex flex-col gap-3'}>
            <div className={'flex items-center gap-3'}>
              <Typography>分类名称:</Typography>
              <Controller
                name={'name'}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className={'w-100'}
                    placeholder={'请输入分类名称'}
                    value={field.value}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </div>

            <div className={'flex items-center justify-between gap-3'}>
              <Typography>排序:</Typography>
              <Controller
                name={'sort'}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ''}
                    type={'number'}
                    className={'w-100'}
                    placeholder={'请输入排序'}
                    onChange={e => {
                      field.onChange(e.target.value ? +e.target.value : undefined)
                    }}
                    error={!!errors.sort}
                    helperText={errors.sort?.message}
                  />
                )}
              />
            </div>
          </DialogContent>
          <DialogActions className={'px-6'}>
            <Button onClick={() => setDialogOpen(false)} variant={'outlined'}>
              取消
            </Button>
            <Button type={'submit'} variant={'contained'}>
              保存
            </Button>
            {!categoryId && (
              <Button onClick={handleSubmit(onSubmit)} variant={'contained'}>
                保存并继续
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default Category
