import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemButton,
  TextField,
  Typography
} from '@mui/material'
import { OrderStatus } from '@/types/order.ts'
import { useMemo, useState } from 'react'
import {
  useCancelOrderMutation,
  useCompleteOrderMutation,
  useConfirmOrderMutation,
  useDeliveryOrderMutation,
  useGetOrderDetailByIdQuery,
  useGetOrderPageListQuery,
  useRejectOrderMutation
} from '@/features/order/orderApi.ts'
import { skipToken } from '@reduxjs/toolkit/query'
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import CommonSelect from '@/components/CommonSelect.tsx'
import { toast } from 'react-toastify'
import clsx from 'clsx'

type OrderParams = {
  number?: string
  phone?: string
  beginTime?: string
  endTime?: string
  status?: OrderStatus
}

const Order = () => {
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

  const reasonList = [
    {
      label: '订单量较多，暂时无法接单',
      value: '订单量较多，暂时无法接单'
    },
    {
      label: '菜品已销售完，暂时无法接单',
      value: '菜品已销售完，暂时无法接单'
    },
    {
      label: '客户电话取消',
      value: '客户电话取消'
    },
    {
      label: '自定义原因',
      value: '自定义原因'
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

  const [orderId, setOrderId] = useState<number>()

  const [reason, setReason] = useState<string>()

  const [dialogDetailOpen, setDialogDetailOpen] = useState(false)

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const { data: orderPageData, isLoading } = useGetOrderPageListQuery({
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    ...searchParams
  })

  const [title, setTitle] = useState<string>('')
  const [inputReason, setInputReason] = useState<string>()

  const { data: orderDetailData } = useGetOrderDetailByIdQuery(orderId ?? skipToken)

  const [cancelOrder] = useCancelOrderMutation()
  const [confirmOrder] = useConfirmOrderMutation()
  const [rejectOrder] = useRejectOrderMutation()
  const [completeOrder] = useCompleteOrderMutation()
  const [deliveryOrder] = useDeliveryOrderMutation()

  const handleCancel = (id: number) => {
    setOrderId(id)
    setTitle('取消')
    setDialogOpen(true)
  }

  const handleDetail = (id: number) => {
    setOrderId(id)
    setDialogDetailOpen(true)
  }

  const handleConfirm = async (id: number, status: OrderStatus) => {
    try {
      await confirmOrder({
        id,
        status
      }).unwrap()
    } catch (e) {
      console.log(e)
    }
  }

  const handleRejection = (id: number) => {
    setOrderId(id)
    setTitle('拒单')
    setDialogOpen(true)
  }

  const handleComplete = async (id: number) => {
    try {
      await completeOrder(id).unwrap()
    } catch (e) {
      console.log(e)
    }
  }

  const handleDelivery = async (id: number) => {
    try {
      await deliveryOrder(id).unwrap()
    } catch (e) {
      console.log(e)
    }
  }

  const handleReason = async () => {
    if (reason === '自定义原因') {
      setReason(inputReason)
    }
    console.log(reason, orderId)
    try {
      if (title === '拒单') {
        await rejectOrder({
          id: orderId!,
          rejectionReason: reason!
        }).unwrap()
        toast.success('拒单成功')
      }

      if (title === '取消') {
        await cancelOrder({
          id: orderId!,
          cancelReason: reason!
        }).unwrap()
        toast.success('取消成功')
      }
      setDialogOpen(false)
      setOrderId(undefined)
      setReason('')
      setTitle('')
      setInputReason('')
    } catch (e) {
      console.log(e)
    }
  }

  const [dialogOpen, setDialogOpen] = useState(false)

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

  const dishAmount = useMemo(
    () => orderDetailData?.data.orderDetailList.reduce((acc, cur) => acc + cur.amount, 0),
    [orderDetailData]
  )

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
      <Dialog maxWidth={'lg'} open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{title}原因</DialogTitle>
        <DialogContent className={'w-150 flex flex-col gap-10 px-20 py-10'}>
          <div className={'flex items-center gap-5'}>
            <Typography className={'min-w-20'}>{title}原因:</Typography>
            <CommonSelect
              fullWidth
              placeholder={`请选择${title}原因`}
              options={reasonList}
              value={reason ?? ''}
              onChange={e => setReason(e.target.value as string)}
            />
          </div>
          {reason === '自定义原因' && (
            <div className={'flex items-center gap-5'}>
              <Typography className={'min-w-20'}>原因:</Typography>
              <TextField
                fullWidth
                placeholder={'请填写取消的原因'}
                value={inputReason}
                onChange={e => setInputReason(e.target.value)}
                multiline
                rows={3}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions className={'pb-5 pr-5'}>
          <Button
            variant={'outlined'}
            className={'border-gray-400 text-gray-400'}
            onClick={() => setDialogOpen(false)}
          >
            取消
          </Button>
          <Button variant={'contained'} className={'bg-primary text-[#333]'} onClick={handleReason}>
            确定
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        scroll={'paper'}
        maxWidth={'lg'}
        open={dialogDetailOpen}
        onClose={setDialogDetailOpen}
      >
        <DialogTitle>订单详情</DialogTitle>
        <DialogContent className={'h-120 w-200 px-15 mt-5 flex flex-col gap-5'}>
          <div className={'min-h-15 flex items-center justify-between'}>
            <div className={'flex h-full items-center gap-3'}>
              <Typography className={'text-gray-400'}>订单号：</Typography>
              <Typography>{orderDetailData?.data.number}</Typography>
              <div
                className={
                  'rounded-2xl p-1 text-white ' +
                  clsx({
                    'bg-[#333]':
                      orderDetailData &&
                      ([OrderStatus.CANCELLED, OrderStatus.COMPLETED] as OrderStatus[]).includes(
                        orderDetailData.data.status
                      ),
                    'bg-red-500':
                      orderDetailData &&
                      !([OrderStatus.CANCELLED, OrderStatus.COMPLETED] as OrderStatus[]).includes(
                        orderDetailData.data.status
                      )
                  })
                }
              >
                {orderStatusMap.find(item => item.status === orderDetailData?.data.status)?.label}
              </div>
            </div>
            <div className={'flex h-full items-center gap-3'}>
              <Typography className={'text-gray-400'}>下单时间:</Typography>
              <Typography>{orderDetailData?.data.orderTime}</Typography>
            </div>
          </div>
          <Divider />
          <div className={'flex flex-col gap-3 rounded bg-gray-50 px-10 py-5'}>
            <div className={'flex items-center justify-between'}>
              <div className={'flex items-center gap-10'}>
                <Typography className={'text-gray-400'}>用户名:</Typography>
                <Typography>{orderDetailData?.data.consignee}</Typography>
              </div>
              <div className={'flex items-center gap-10'}>
                <Typography className={'text-gray-400'}>手机号:</Typography>
                <Typography>{orderDetailData?.data.phone}</Typography>
              </div>
            </div>
            <div className={'flex items-center justify-start'}>
              <div className={'flex items-center gap-10'}>
                <Typography className={'text-gray-400'}>地址:</Typography>
                <Typography>{orderDetailData?.data.address}</Typography>
              </div>
            </div>
            <div
              className={
                'flex min-h-10 items-center gap-3 rounded border p-2 ' +
                clsx({
                  'border-gray-400 bg-white':
                    orderDetailData?.data.status === OrderStatus.CANCELLED,
                  'bg-[#FEFBF1 border-[#F7E4A0]':
                    orderDetailData?.data.status !== OrderStatus.CANCELLED
                })
              }
            >
              <div
                className={
                  'flex items-center justify-center rounded p-2 ' +
                  clsx({
                    'bg-[#F7E4A0]': orderDetailData?.data.status !== OrderStatus.CANCELLED,
                    'bg-gray-200': orderDetailData?.data.status === OrderStatus.CANCELLED
                  })
                }
              >
                {orderDetailData?.data.status === OrderStatus.CANCELLED ? '取消原因' : '备注'}
              </div>
              <Typography className={'font-thin text-red-500'}>
                {orderDetailData?.data.status === OrderStatus.CANCELLED
                  ? orderDetailData?.data.cancelReason || orderDetailData?.data.rejectionReason
                  : orderDetailData?.data.remark}
              </Typography>
            </div>
          </div>
          <div className={'flex gap-10 px-5'}>
            <Typography className={'text-gray-400'}>菜品</Typography>
            <div className={'flex flex-1 flex-col justify-start gap-5'}>
              <List disablePadding className={'flex flex-col gap-3'}>
                {orderDetailData?.data.orderDetailList.map(item => (
                  <ListItem disablePadding key={item.id} className={'flex items-center gap-20'}>
                    <Typography className={'font-thin'}>
                      {item.name}x{item.number}
                    </Typography>
                    <Typography className={'font-thin'}>¥{item.amount.toFixed(2)}</Typography>
                  </ListItem>
                ))}
              </List>
              <div className={'flex items-center gap-3'}>
                <Typography>菜品小结</Typography>
                <Typography className={'text-red-500'}>¥{dishAmount?.toFixed(2)}</Typography>
              </div>
            </div>
          </div>
          <Divider flexItem />
          <div className={'flex gap-10 px-5'}>
            <Typography className={'text-gray-400'}>费用</Typography>
            <div className={'grid flex-1 grid-cols-2'}>
              <div className={'flex items-center gap-5'}>
                <Typography>菜品小结:</Typography>
                <Typography>¥{dishAmount}</Typography>
              </div>
              <div className={'flex items-center gap-5'}>
                <Typography>派送费:</Typography>
                <Typography>
                  ¥
                  {dishAmount && orderDetailData ? dishAmount - orderDetailData.data.packAmount : 0}
                </Typography>
              </div>
              <div className={'flex items-center gap-5'}>
                <Typography>打包费:</Typography>
                <Typography>¥{orderDetailData?.data.packAmount}</Typography>
              </div>
              <div className={'flex items-center gap-5'}>
                <Typography>合计：</Typography>
                <Typography className={'text-red-500'}>¥{orderDetailData?.data.amount}</Typography>
              </div>
              <div className={'flex items-center gap-5'}>
                <Typography>支付渠道:</Typography>
                <Typography>
                  {orderDetailData?.data.payMethod ? '微信支付' : '支付宝支付'}
                </Typography>
              </div>
              <div className={'flex items-center gap-5'}>
                <Typography>支付时间:</Typography>
                <Typography>{orderDetailData?.data.checkoutTime}</Typography>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant={'outlined'}
            className={'border-gray-400 text-gray-400'}
            onClick={() => setDialogDetailOpen(false)}
          >
            返回
          </Button>
          {orderDetailData?.data.status === OrderStatus.TO_BE_CONFIRMED && (
            <>
              <Button
                variant={'outlined'}
                className={'border-gray-400 text-gray-400'}
                onClick={() => {
                  setDialogDetailOpen(false)
                  handleRejection(orderId!)
                }}
              >
                拒单
              </Button>
              <Button
                variant={'contained'}
                className={'bg-primary text-black'}
                onClick={() => handleConfirm(orderId!, orderDetailData.data.status)}
              >
                接单
              </Button>
            </>
          )}
          {orderDetailData?.data.status === OrderStatus.CONFIRMED && (
            <Button
              variant={'contained'}
              className={'bg-primary text-black'}
              onClick={() => handleDelivery(orderId!)}
            >
              派送
            </Button>
          )}

          {orderDetailData?.data.status === OrderStatus.DELIVERY_IN_PROGRESS && (
            <Button
              variant={'contained'}
              className={'bg-primary text-black'}
              onClick={() => handleComplete(orderId!)}
            >
              完成
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Order
