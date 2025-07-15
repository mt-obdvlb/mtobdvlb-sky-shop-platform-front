import {
  useGetPageEmployeeQuery,
  useUpdateEmployeeStatusMutation
} from '@/features/employee/employeeApi.ts'
import { useEffect, useState } from 'react'
import { Button, TextField, Typography } from '@mui/material'
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import { useAppSelector } from '@/store/hooks.ts'
import { DotIcon, PlusIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { EmployeeStatus } from '@/types/employee.ts'
import { toast } from 'react-toastify'
import clsx from 'clsx'
import ConfirmButton from '@/components/ConfirmButton.tsx'
import { Helmet } from 'react-helmet-async'

const Employee = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [name, setName] = useState<string>()
  const [inputName, setInputName] = useState<string>('')

  const isCollapsed = useAppSelector(state => state.shop.isCollapsed)

  const [updateEmployeeStatus] = useUpdateEmployeeStatusMutation()

  const { data: res, isLoading } = useGetPageEmployeeQuery(
    {
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      name
    },
    {}
  )

  const list = res?.data.records
  const total = res?.data.total

  const navigate = useNavigate()

  const handleUpdate = (id: number) => {
    navigate(`/employee/add?id=${id}`)
  }

  const handleStatus = ({ id, status }: { id: number; status: EmployeeStatus }) => {
    try {
      status = status === 1 ? 0 : 1
      updateEmployeeStatus({ id, status }).unwrap()
      if (status === 1) {
        toast.success('启用成功')
      } else {
        toast.error('禁用成功')
      }
    } catch (e) {
      console.log(e)
    }
  }

  const columns: GridColDef[] = (
    [
      {
        field: 'name',
        headerName: '员工姓名',
        flex: 1
      },
      {
        field: 'username',
        headerName: '用户名',
        flex: 1
      },
      {
        field: 'phone',
        headerName: '手机号',
        flex: 1
      },
      {
        field: 'status',
        headerName: '账号状态',
        flex: 1,
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
        ),
        sortable: false
      },
      {
        field: 'updateTime',
        headerName: '最后操作时间',
        flex: 1,
        sortable: true
      },
      {
        field: 'action',
        headerName: '操作',
        flex: 1,
        display: 'flex',
        sortable: false,
        renderCell: params => (
          <div className={'flex items-center justify-center gap-2'}>
            <Button
              variant={'text'}
              size={'small'}
              color={'primary'}
              onClick={() => handleUpdate(params.row.id)}
            >
              编辑
            </Button>
            <ConfirmButton
              title={params.row.status === 0 ? '启用' : '禁用'}
              variant={'text'}
              size={'small'}
              color={params.row.status === 0 ? 'success' : 'error'}
              onConfirm={() =>
                handleStatus({
                  id: params.row.id,
                  status: params.row.status
                })
              }
            >
              {params.row.status === 0 ? '启用' : '禁用'}
            </ConfirmButton>
          </div>
        )
      }
    ] as GridColDef[]
  ).map(column => ({
    align: 'center',
    headerAlign: 'center',
    filterable: false,
    sortable: column.sortable ?? false,
    ...column
  }))

  const rows: GridRowsProp = list
    ? list?.map(item => ({
        id: item.id,
        name: item.name,
        username: item.username,
        phone: item.phone,
        status: item.status,
        updateTime: item.updateTime
      }))
    : []

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 500) // 延迟一点，等菜单展开动画完成

    return () => clearTimeout(timeout)
  }, [isCollapsed])

  const localeText = zhCN.components.MuiDataGrid.defaultProps.localeText

  return (
    <>
      <Helmet>
        <title>员工管理</title>
      </Helmet>
      <div className={'h-full px-5 pt-5'}>
        <div className={'h-min-100 flex flex-col rounded bg-white p-7 shadow'}>
          <div className={'flex items-center justify-between'}>
            <div className={'flex items-center gap-4'}>
              <Typography>员工姓名:</Typography>
              <TextField
                size={'small'}
                onChange={e => setInputName(e.target.value)}
                placeholder={'请输入员工姓名'}
              />
              <Button
                variant={'contained'}
                className={'bg-[#333]'}
                onClick={() => setName(inputName)}
              >
                查询
              </Button>
            </div>
            <Button
              to={'add'}
              component={Link}
              className={'bg-primary text-black'}
              variant={'contained'}
              startIcon={<PlusIcon />}
            >
              添加员工
            </Button>
          </div>

          <DataGrid
            paginationMode="server"
            loading={isLoading}
            rows={rows}
            columns={columns}
            localeText={localeText}
            disableColumnMenu
            disableColumnResize
            disableRowSelectionOnClick
            disableMultipleRowSelection
            className={'mt-10'}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[3, 10, 20, 100]}
            rowCount={total}
          />
        </div>
      </div>
    </>
  )
}

export default Employee
