import { Button, TextField, Typography } from '@mui/material'
import { DotIcon, PlusIcon } from 'lucide-react'
import {
  useDeleteDishesMutation,
  useGetDishPageListQuery,
  useUpdateDishStatusMutation
} from '@/features/dish/dishApi.ts'
import {
  DataGrid,
  type GridColDef,
  type GridRowSelectionModel,
  type GridRowsProp
} from '@mui/x-data-grid'
import { useState } from 'react'
import type { DishStatus } from '@/types/dish.ts'
import clsx from 'clsx'
import { useGetCategoryListByTypeQuery } from '@/features/category/categoryApi.ts'
import CommonSelect from '@/components/CommonSelect.tsx'
import ConfirmButton from '@/components/ConfirmButton.tsx'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

type SearchParams = {
  name?: string
  categoryName?: string
  status?: DishStatus
}
const Dish = () => {
  const [deleteDishes] = useDeleteDishesMutation()
  const [updateDishStatus] = useUpdateDishStatusMutation()

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set()
  })
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [searchParams, setSearchParams] = useState<SearchParams>()
  const [currentSearchParams, setCurrentSearchParams] = useState<SearchParams>({
    name: '',
    categoryName: '',
    status: undefined
  })
  const { data: res, isLoading } = useGetDishPageListQuery({
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    ...searchParams
  })
  const total = res?.data.total
  const list = res?.data.records
  const columns: GridColDef[] = (
    [
      {
        field: 'name',
        headerName: '菜品名称'
      },
      {
        field: 'image',
        headerName: '图片',
        renderCell: params => (
          <div className={'flex h-full w-full items-center justify-center'}>
            <img
              src={params.row.image}
              onError={e => {
                e.currentTarget.src =
                  'http://mtobdvlb-web.oss-cn-beijing.aliyuncs.com/private/mako.jpg'
              }}
              alt={params.row.name}
              className="size-10 rounded object-cover"
            />
          </div>
        )
      },
      {
        field: 'categoryName',
        headerName: '菜品分类'
      },
      {
        field: 'price',
        headerName: '价格',
        flex: 0.6
      },
      {
        field: 'status',
        headerName: '售卖状态',
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
        headerName: '创建时间',
        sortable: true
      },
      {
        field: 'action',
        headerName: '操作',
        minWidth: 230,
        renderCell: params => (
          <>
            <div className={'flex h-full items-center'}>
              <Button
                component={Link}
                to={`/dish/add?id=${params.row.id}`}
                variant={'text'}
                size={'small'}
              >
                修改
              </Button>
              <ConfirmButton
                variant={'text'}
                size={'small'}
                className={'h- rounded-none border-x border-x-gray-200'}
                onConfirm={() => handleDelete(params.row.id)}
                title={'删除'}
              >
                删除
              </ConfirmButton>
              <ConfirmButton
                title={params.row.status === 0 ? '启用' : '禁用'}
                onConfirm={() => handleStatus(params.row.id, params.row.status === 0 ? 1 : 0)}
                variant={'text'}
                size={'small'}
                className={clsx({
                  'text-green-500': params.row.status === 0,
                  'text-red-500': params.row.status === 1
                })}
              >
                {params.row.status === 0 ? '启用' : '禁用'}
              </ConfirmButton>
            </div>
          </>
        )
      }
    ] as GridColDef[]
  ).map(column => ({
    headerAlign: 'center',
    align: 'center',
    flex: column.flex ?? 1,
    sortable: column.sortable ?? false,
    ...column
  }))
  const rows: GridRowsProp =
    list?.map(item => ({
      id: item.id,
      name: item.name,
      image: item.image,
      categoryName: item.categoryName,
      price: item.price,
      status: item.status,
      updateTime: item.updateTime
    })) || []
  const { data: categoryList } = useGetCategoryListByTypeQuery(1)

  const handleDelete = async (id?: number) => {
    if (id) {
      try {
        await deleteDishes([id]).unwrap()
        toast.success('删除成功')
      } catch (e) {
        console.log(e)
      }
      return
    }
    const ids = [...selectionModel.ids]
    try {
      await deleteDishes(ids as number[]).unwrap()
      toast.success('删除成功')
    } catch (e) {
      console.log(e)
    }
  }
  const handleStatus = async (id: number, status: DishStatus) => {
    try {
      await updateDishStatus({ id, status }).unwrap()
      if (status === 1) {
        toast.success('启用成功')
      } else {
        toast.success('禁用成功')
      }
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <>
      <div className={'min-h-full scroll-auto p-5'}>
        <div className={'flex flex-col rounded bg-white px-3 py-5 shadow'}>
          <div className={'flex items-center justify-between'}>
            <div className={'flex items-center gap-4'}>
              <Typography>菜品名称:</Typography>
              <TextField
                size={'small'}
                placeholder={'请输入菜品名称'}
                value={currentSearchParams?.name}
                onChange={e =>
                  setCurrentSearchParams(prev => ({
                    ...prev,
                    name: e.target.value
                  }))
                }
              />
              <Typography>菜品分类:</Typography>
              <CommonSelect
                placeholder={'请选择'}
                value={currentSearchParams?.categoryName ?? ''}
                onChange={e =>
                  setCurrentSearchParams(prev => ({
                    ...prev,
                    categoryName: e.target.value as string
                  }))
                }
                options={
                  categoryList?.data.map(item => ({
                    label: item.name!,
                    value: item.name!
                  })) || []
                }
              />

              <Typography>售卖状态:</Typography>
              <CommonSelect
                placeholder={'请选择'}
                onChange={e =>
                  setCurrentSearchParams(prev => ({
                    ...prev,
                    status:
                      e.target.value !== '' ? (Number(e.target.value) as DishStatus) : undefined
                  }))
                }
                value={currentSearchParams?.status ?? ''}
                options={[
                  {
                    label: '启售',
                    value: 1
                  },
                  {
                    label: '停售',
                    value: 0
                  }
                ]}
              />
              <Button variant={'contained'} onClick={() => setSearchParams(currentSearchParams)}>
                查询
              </Button>
            </div>
            <div className={'flex items-center gap-3'}>
              <ConfirmButton
                title={'删除'}
                variant={'text'}
                onConfirm={handleDelete}
                noShow={() => {
                  // if (apiRef.current && (apiRef.current ? selectedCount : 0) > 0) {
                  //   return false
                  // }
                  if (selectionModel && selectionModel.ids.size > 0) {
                    return false
                  }
                  toast.error('请选择要删除的行', {
                    position: 'top-center'
                  })
                  return true
                }}
              >
                批量删除
              </ConfirmButton>
              <Button
                component={Link}
                to={'/dish/add'}
                variant={'contained'}
                startIcon={<PlusIcon className={'size-4'} />}
              >
                新增菜品
              </Button>
            </div>
          </div>
          <DataGrid
            className={'mt-5'}
            paginationMode={'server'}
            columns={columns}
            rows={rows}
            checkboxSelection
            disableColumnResize
            disableColumnMenu
            rowCount={total}
            pageSizeOptions={[3, 10, 20, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            loading={isLoading}
            disableRowSelectionOnClick
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={setSelectionModel}
          />
        </div>
      </div>
    </>
  )
}

export default Dish
