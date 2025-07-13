import { Button, TextField, Typography } from '@mui/material'
import CommonSelect from '@/components/CommonSelect.tsx'
import { DotIcon, PlusIcon } from 'lucide-react'
import {
  DataGrid,
  type GridColDef,
  type GridRowId,
  type GridRowSelectionModel,
  type GridRowsProp
} from '@mui/x-data-grid'
import { useGetCategoryListByTypeQuery } from '@/features/category/categoryApi.ts'
import { useState } from 'react'
import {
  useDeleteSetmealMutation,
  useGetSetmealPageQuery,
  useUpdateSetmealStatusMutation
} from '@/features/setmeal/setmealApi.ts'
import type { SetmealStatus } from '@/types/setmeal.ts'
import clsx from 'clsx'
import ConfirmButton from '@/components/ConfirmButton.tsx'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

type SearchParams = {
  name?: string
  categoryId?: number
  status?: SetmealStatus
}

const Setmeal = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const [currentSearchParams, setCurrentSearchParams] = useState<SearchParams>({
    name: '',
    categoryId: undefined,
    status: undefined
  })
  const [searchParams, setSearchParams] = useState<SearchParams>()

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set<GridRowId>()
  })

  const { data: setmealPageData, isLoading } = useGetSetmealPageQuery({
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    ...searchParams
  })

  const { data: categoryData } = useGetCategoryListByTypeQuery(2)

  const [updateSetmealStatus] = useUpdateSetmealStatusMutation()
  const [deleteSetmeal] = useDeleteSetmealMutation()

  const handleSearch = () => {
    setSearchParams(currentSearchParams)
  }

  const handleStatus = async (id: number, status: SetmealStatus) => {
    try {
      await updateSetmealStatus({ id, status }).unwrap()
      if (status === 1) {
        toast.success('启用成功')
      } else {
        toast.error('禁用成功')
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleDeleteSetmeal = async (id?: number) => {
    console.log(id)
    if (!id) {
      try {
        const ids = [...selectionModel.ids]
        await deleteSetmeal(ids as number[]).unwrap()
        toast.success('删除成功')
      } catch (e) {
        console.log(e)
      }

      return
    }
    try {
      await deleteSetmeal([id]).unwrap()
      toast.success('删除成功')
    } catch (e) {
      console.log(e)
    }
  }

  const columns: GridColDef[] = (
    [
      {
        headerName: '套餐名称',
        field: 'name'
      },
      {
        headerName: '图片',
        field: 'image',
        renderCell: params => (
          <img src={params.row.image} alt={params.row.name} className="size-14 object-cover" />
        )
      },
      {
        headerName: '套餐分类',
        field: 'categoryName'
      },
      {
        headerName: '套餐价',
        field: 'price'
      },
      {
        headerName: '售卖状态',
        field: 'status',
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
        headerName: '最后操作时间',
        field: 'updateTime'
      },
      {
        headerName: '操作',
        field: 'action',
        minWidth: 230,
        renderCell: params => (
          <div className="flex items-center gap-3">
            <Button variant={'text'} component={Link} to={`/setmeal/add?id=${params.row.id}`}>
              修改
            </Button>
            <ConfirmButton
              variant={'text'}
              title={'删除'}
              onConfirm={() => handleDeleteSetmeal(params.row.id)}
            >
              删除
            </ConfirmButton>
            <ConfirmButton
              variant={'text'}
              title={params.row.status === 0 ? '启售' : '停售'}
              onConfirm={() => handleStatus(params.row.id, params.row.status === 0 ? 1 : 0)}
              className={clsx({
                'text-green-500': params.row.status === 0,
                'text-red-500': params.row.status === 1
              })}
            >
              {params.row.status === 0 ? '启售' : '停售'}
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
    setmealPageData?.data.records.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      status: item.status,
      updateTime: item.updateTime,
      image: item.image,
      categoryName: item.categoryName
    })) ?? []

  const total = setmealPageData?.data.total ?? 0

  return (
    <>
      <div className={'min-h-full scroll-auto p-5'}>
        <div className={'flex h-full flex-col bg-white p-5'}>
          <div className={'flex items-center justify-between'}>
            <div className={'flex items-center gap-3'}>
              <Typography>套餐名称：</Typography>
              <TextField size={'small'} placeholder={'请输入套餐名称'} />
              <Typography>套餐分类:</Typography>
              <CommonSelect
                placeholder={'请选中套餐分类'}
                options={
                  categoryData
                    ? categoryData.data.map(item => ({
                        label: item.name!,
                        value: item.id!
                      }))
                    : []
                }
                value={currentSearchParams?.categoryId ?? ''}
                onChange={e =>
                  setCurrentSearchParams(prev => ({
                    ...prev,
                    categoryId: e.target.value as number
                  }))
                }
              />
              <Typography>套餐状态:</Typography>
              <CommonSelect
                placeholder={'请选择套餐状态'}
                value={currentSearchParams?.status ?? ''}
                onChange={e =>
                  setCurrentSearchParams(prev => ({
                    ...prev,
                    status: e.target.value as SetmealStatus
                  }))
                }
                options={[
                  {
                    label: '启售',
                    value: 1
                  },
                  { label: '停售', value: 0 }
                ]}
              />
              <Button onClick={handleSearch} variant={'contained'}>
                查询
              </Button>
            </div>
            <div className={'flex items-center gap-3'}>
              <ConfirmButton
                variant={'text'}
                size={'small'}
                onConfirm={() => handleDeleteSetmeal()}
              >
                批量删除
              </ConfirmButton>
              <Button
                variant={'contained'}
                size={'small'}
                component={Link}
                to={'/setmeal/add'}
                startIcon={<PlusIcon />}
              >
                新增套餐
              </Button>
            </div>
          </div>
          <DataGrid
            columns={columns}
            className={'mt-5'}
            paginationMode={'server'}
            disableAutosize
            disableColumnMenu
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rows={rows}
            rowCount={total}
            disableColumnResize
            loading={isLoading}
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={setSelectionModel}
            checkboxSelection
            pageSizeOptions={[3, 10, 20, 100]}
          />
        </div>
      </div>
    </>
  )
}

export default Setmeal
