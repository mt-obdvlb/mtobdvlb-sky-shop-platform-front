import { useState } from 'react'
import {
  useCancelOrderMutation,
  useCompleteOrderMutation,
  useConfirmOrderMutation,
  useDeliveryOrderMutation,
  useGetOrderDetailByIdQuery,
  useRejectOrderMutation
} from '@/features/order/orderApi.ts'
import { skipToken } from '@reduxjs/toolkit/query'
import { OrderStatus } from '@/types/order.ts'
import { toast } from 'react-toastify'

const useOrderActions = () => {
  const [orderId, setOrderId] = useState<number>()
  const [reason, setReason] = useState<string>()
  const [dialogDetailOpen, setDialogDetailOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

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

  return {
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
  }
}

export default useOrderActions
