import { Button, List, ListItemButton, TextField, Typography } from '@mui/material'
import { OrderStatus } from '@/types/order.ts'
import { useEffect, useState } from 'react'
import { useGetOrderPageListQuery } from '@/features/order/orderApi.ts'
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import OrderReasonDialog from '@/components/OrderReasonDialog.tsx'
import OrderDetailDialog from '@/components/OrderDetailDialog.tsx'
import useOrderActions from '@/hooks/useOrderActions.ts'
import { Helmet } from 'react-helmet-async'
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts'
import { clearSocket } from '@/features/socket/socketSlice.ts'

type OrderParams = {
  number?: string
  phone?: string
  beginTime?: string
  endTime?: string
  status?: OrderStatus
}

const Order = () => {
  const orderIdFromSocket = useAppSelector(state => state.socket.orderIdFromSocket)
  const dispatch = useAppDispatch()

  const orderList = [
    {
      label: '全部订单'
    },
    {
      label: '待接单',
      status: OrderStatus.TO_BE_CONFIRMED
    },
    {
      label: '待派送',
      status: OrderStatus.CONFIRMED
    },
    {
      label: '已完成',
      status: OrderStatus.COMPLETED
    },
    {
      label: '已取消',
      status: OrderStatus.CANCELLED
    }
  ]

  const orderStatusMap = [
    {
      label: '待付款',
      status: OrderStatus.PENDING_PAYMENT
    },
    {
      label: '待接单',
      status: OrderStatus.TO_BE_CONFIRMED
    },
    {
      label: '派送中',
      status: OrderStatus.DELIVERY_IN_PROGRESS
    },
    {
      label: '待派送',
      status: OrderStatus.CONFIRMED
    },
    {
      label: '已完成',
      status: OrderStatus.COMPLETED
    },
    {
      label: '已取消',
      status: OrderStatus.CANCELLED
    }
  ]

  const [searchParams, setSearchParams] = useState<OrderParams>()

  const [currentSearchParams, setCurrentSearchParams] = useState<OrderParams>({
    number: '',
    phone: '',
    beginTime: '',
    endTime: '',
    status: undefined
  })

  const {
    handleCancel,
    handleDetail,
    handleConfirm,
    handleRejection,
    handleComplete,
    handleDelivery,
    handleReason,
    orderDetailData,
    dialogOpen,
    setDialogOpen,
    dialogDetailOpen,
    setDialogDetailOpen,
    reason,
    setReason,
    title,
    inputReason,
    setInputReason,
    orderId
  } = useOrderActions()

  useEffect(() => {
    if (orderIdFromSocket) {
      handleDetail(orderIdFromSocket)
      dispatch(clearSocket())
    }
  }, [orderIdFromSocket, dispatch, handleDetail])

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const { data: orderPageData, isLoading } = useGetOrderPageListQuery({
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    ...searchParams
  })

  const total = orderPageData?.data.total ?? 0
  const columns: GridColDef[] = (
    [
      {
        field: 'number',
        headerName: '订单号'
      },
      {
        field: 'status',
        headerName: '订单状态',
        renderCell: params => (
          <div className={'flex h-full w-full items-center justify-center'}>
            {orderStatusMap.find(item => item.status === params.row.status)?.label}
          </div>
        )
      },
      {
        field: 'consignee',
        headerName: '用户名'
      },
      {
        field: 'phone',
        headerName: '手机号'
      },
      {
        field: 'address',
        headerName: '地址'
      },
      {
        field: 'orderTime',
        headerName: '下单时间'
      },
      {
        field: 'amount',
        headerName: '实收金额',
        renderCell: params => (
          <Typography className={'flex h-full w-full items-center justify-center'}>
            ￥{params.row.amount}
          </Typography>
        )
      },
      {
        field: 'action',
        headerName: '操作',
        minWidth: 230,
        renderCell: params => (
          <div className={'flex h-full w-full items-center justify-center'}>
            {params.row.status === OrderStatus.TO_BE_CONFIRMED && (
              <Button
                variant={'text'}
                size={'small'}
                onClick={() => handleConfirm(params.row.id, params.row.status)}
                className={'rounded-none border-r border-r-gray-300'}
              >
                接单
              </Button>
            )}
            {params.row.status === OrderStatus.CONFIRMED && (
              <Button
                variant={'text'}
                size={'small'}
                onClick={() => handleDelivery(params.row.id)}
                className={'rounded-none border-r border-r-gray-300'}
              >
                派送
              </Button>
            )}
            {params.row.status === OrderStatus.TO_BE_CONFIRMED && (
              <Button
                variant={'text'}
                size={'small'}
                onClick={() => handleRejection(params.row.id)}
                className={'rounded-none border-r border-r-gray-300 text-red-500'}
              >
                拒单
              </Button>
            )}
            {params.row.status === OrderStatus.DELIVERY_IN_PROGRESS && (
              <Button
                variant={'text'}
                size={'small'}
                onClick={() => handleComplete(params.row.id)}
                className={'rounded-none border-r border-r-gray-300'}
              >
                完成
              </Button>
            )}
            {[
              OrderStatus.PENDING_PAYMENT,
              OrderStatus.DELIVERY_IN_PROGRESS,
              OrderStatus.CONFIRMED,
              OrderStatus.COMPLETED
            ].includes(params.row.status) && (
              <Button
                variant={'text'}
                size={'small'}
                onClick={() => handleCancel(params.row.id)}
                className={'rounded-none border-r border-r-gray-300 text-red-500'}
              >
                取消
              </Button>
            )}

            <Button variant={'text'} size={'small'} onClick={() => handleDetail(params.row.id)}>
              详情
            </Button>
          </div>
        )
      }
    ] as GridColDef[]
  ).map(item => ({
    flex: item.flex ?? 1,
    headerAlign: 'center',
    align: 'center',
    ...item
  }))

  const rows: GridRowsProp =
    orderPageData?.data.records.map(item => ({
      id: item.id,
      number: item.number,
      phone: item.phone,
      address: item.address,
      orderTime: item.orderTime,
      amount: item.amount,
      status: item.status,
      consignee: item.consignee
    })) ?? []

  return (
    <>
      <Helmet>
        <title>订单管理</title>
      </Helmet>
      <div className={'flex min-h-full flex-col p-5'}>
        <List className={'w-200 flex'} disablePadding>
          {orderList.map(item => (
            <ListItemButton
              className={'flex items-center justify-center rounded-none border border-gray-400'}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#F6C343'
                },
                '&.Mui-selected:hover': {
                  backgroundColor: '#F6C343'
                }
              }}
              onClick={() =>
                setSearchParams(prev => ({
                  ...prev,
                  status: item.status
                }))
              }
              selected={item.status === searchParams?.status}
            >
              {item.label}
            </ListItemButton>
          ))}
        </List>
        <div className={'mt-10 flex flex-1 flex-col items-center bg-white p-5'}>
          <div className={'flex items-center gap-2'}>
            <Typography className={'min-w-17'}>订单号：</Typography>

            <TextField
              placeholder={'订单号'}
              size={'small'}
              value={currentSearchParams?.number}
              onChange={e =>
                setCurrentSearchParams(prev => ({
                  ...prev,
                  number: e.target.value
                }))
              }
            />
            <Typography className={'min-w-17'}>手机号：</Typography>
            <TextField
              placeholder={'手机号'}
              size={'small'}
              value={currentSearchParams?.phone}
              onChange={e =>
                setCurrentSearchParams(prev => ({
                  ...prev,
                  phone: e.target.value
                }))
              }
            />
            <Typography className={'min-w-20'}>下单时间:</Typography>
            <DatePicker
              slotProps={{
                textField: {
                  size: 'small'
                }
              }}
              disableFuture
              label={'开始日期'}
              value={currentSearchParams.beginTime ? dayjs(currentSearchParams.beginTime) : null}
              onChange={e =>
                setCurrentSearchParams(prev => ({
                  ...prev,
                  beginTime: e?.format('YYYY-MM-DD HH:mm:ss')
                }))
              }
            />
            <Typography>-</Typography>
            <DatePicker
              slotProps={{
                textField: {
                  size: 'small'
                }
              }}
              className={''}
              disableFuture
              label={'结束日期'}
              value={currentSearchParams.endTime ? dayjs(currentSearchParams.endTime) : null}
              onChange={e =>
                setCurrentSearchParams(prev => ({
                  ...prev,
                  endTime: e?.format('YYYY-MM-DD HH:mm:ss')
                }))
              }
            />
            <Button
              className={'bg-[#333] text-white'}
              onClick={() =>
                setSearchParams({
                  ...currentSearchParams,
                  status: currentSearchParams.status
                })
              }
              size={'medium'}
            >
              查询
            </Button>
          </div>
          <DataGrid
            className={'mt-10 w-full'}
            columns={columns}
            rows={rows}
            disableAutosize
            disableColumnMenu
            disableRowSelectionOnClick
            disableColumnResize
            paginationMode={'server'}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={total}
            loading={isLoading}
            pageSizeOptions={[3, 10, 20, 100]}
          />
        </div>
      </div>
      <OrderReasonDialog
        open={dialogOpen}
        title={title}
        reason={reason ?? ''}
        inputReason={inputReason ?? ''}
        setReason={setReason}
        setInputReason={setInputReason}
        onClose={() => setDialogOpen(false)}
        handleReason={handleReason}
      />
      <OrderDetailDialog
        open={dialogDetailOpen}
        onClose={() => setDialogDetailOpen(false)}
        handleConfirm={handleConfirm}
        handleRejection={handleRejection}
        handleComplete={handleComplete}
        handleDelivery={handleDelivery}
        orderDetailData={orderDetailData}
        orderId={orderId}
      />
    </>
  )
}

export default Order
