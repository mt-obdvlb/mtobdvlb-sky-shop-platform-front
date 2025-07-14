import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  Typography
} from '@mui/material'
import { type OrderGetByIdResponse, OrderStatus } from '@/types/order.ts'
import clsx from 'clsx'
import { type ApiResponse } from '@/types/global.ts'
import * as React from 'react'

type Props = {
  open: boolean
  onClose: () => void
  handleConfirm: (id: number, status: OrderStatus) => void
  handleRejection: (id: number) => void
  handleComplete: (id: number) => void
  handleDelivery: (id: number) => void
  orderDetailData: ApiResponse<OrderGetByIdResponse> | undefined
  orderId?: number
}

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

const OrderDetailDialog = ({
  open,
  onClose,
  orderDetailData,
  handleConfirm,
  handleRejection,
  handleComplete,
  handleDelivery,
  orderId
}: Props) => {
  const data = orderDetailData?.data
  const dishAmount = React.useMemo(
    () => data?.orderDetailList.reduce((acc, cur) => acc + cur.amount, 0) ?? 0,
    [data]
  )

  return (
    <Dialog scroll={'paper'} maxWidth={'lg'} open={open} onClose={onClose}>
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
                'border-gray-400 bg-white': orderDetailData?.data.status === OrderStatus.CANCELLED,
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
                ¥{dishAmount && orderDetailData ? dishAmount - orderDetailData.data.packAmount : 0}
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
              <Typography>{orderDetailData?.data.payMethod ? '微信支付' : '支付宝支付'}</Typography>
            </div>
            <div className={'flex items-center gap-5'}>
              <Typography>支付时间:</Typography>
              <Typography>{orderDetailData?.data.checkoutTime}</Typography>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant={'outlined'} className={'border-gray-400 text-gray-400'} onClick={onClose}>
          返回
        </Button>
        {orderDetailData?.data.status === OrderStatus.TO_BE_CONFIRMED && (
          <>
            <Button
              variant={'outlined'}
              className={'border-gray-400 text-gray-400'}
              onClick={() => {
                onClose()
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
  )
}

export default OrderDetailDialog
