import { Badge, Button, ListItemButton, Typography } from '@mui/material'
import dayjs from 'dayjs'
import {
  ArrowRightIcon,
  ClipboardCopyIcon,
  FileCheck2Icon,
  FileTextIcon,
  FileX2Icon,
  PenIcon,
  PenOffIcon,
  PlusIcon,
  TruckElectricIcon
} from 'lucide-react'
import {
  useGetWorkSpaceBusinessDataQuery,
  useGetWorkSpaceOverviewDishesQuery,
  useGetWorkSpaceOverviewOrdersQuery,
  useGetWorkSpaceOverviewSetmealsQuery
} from '@/features/work-space/workSpaceApi.ts'
import DataItem from '@/pages/DashBoard/component/DataItem.tsx'
import { Link } from 'react-router-dom'
import DataItemWithIcon from '@/pages/DashBoard/component/DataItemWithIcon.tsx'
import { useState } from 'react'
import { OrderStatus } from '@/types/order.ts'
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid'
import { useGetOrderPageListQuery } from '@/features/order/orderApi.ts'
import OrderReasonDialog from '@/components/OrderReasonDialog.tsx'
import OrderDetailDialog from '@/components/OrderDetailDialog.tsx'
import useOrderActions from '@/hooks/useOrderActions.ts'
import { Helmet } from 'react-helmet-async'

const DashBoard = () => {
  const { data: businessData } = useGetWorkSpaceBusinessDataQuery()
  const { data: orderData } = useGetWorkSpaceOverviewOrdersQuery()
  const { data: dishData } = useGetWorkSpaceOverviewDishesQuery()
  const { data: setmealData } = useGetWorkSpaceOverviewSetmealsQuery()

  const todayDataList = [
    {
      title: '营业额',
      value: '¥' + (businessData?.data.turnover ?? 0)
    },
    {
      title: '有效订单',
      value: businessData?.data.validOrderCount ?? 0
    },
    {
      title: '订单完成率',
      value: ((businessData?.data.orderCompletionRate ?? 0) * 100).toFixed(0) + '%'
    },
    {
      title: '平均客单价',
      value: '¥' + (businessData?.data.unitPrice ?? '0')
    },
    {
      title: '新用户数',
      value: businessData?.data.newUsers ?? 0
    }
  ]

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

  const orderManagementList = [
    {
      icon: ClipboardCopyIcon,
      title: '待接单',
      number: orderData?.data.waitingOrders ?? 0,
      color: 'error'
    },
    {
      icon: TruckElectricIcon,
      title: '待派送',
      number: orderData?.data.deliveredOrders ?? 0,
      color: 'error'
    },
    {
      icon: FileCheck2Icon,
      title: '已完成',
      number: orderData?.data.completedOrders ?? 0
    },
    {
      icon: FileX2Icon,
      title: '已取消',
      number: orderData?.data.cancelledOrders ?? 0
    },
    {
      icon: FileTextIcon,
      title: '全部订单',
      number: orderData?.data.allOrders ?? 0
    }
  ]

  const dishAndSetmealList = [
    {
      title: '菜品总览',
      go: '菜品管理',
      to: '/dish',
      add: '/dish/add',
      number: [dishData?.data.sold ?? 0, dishData?.data.discontinued ?? 0],
      addTitle: '新增菜品'
    },
    {
      title: '套餐总览',
      go: '套餐管理',
      to: '/setmeal',
      add: '/setmeal/add',
      number: [setmealData?.data.sold ?? 0, setmealData?.data.discontinued ?? 0],
      addTitle: '新增套餐'
    }
  ]

  const [selectStatus, setSelectStatus] = useState<OrderStatus>(OrderStatus.TO_BE_CONFIRMED)

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const { data: orderPageData, isLoading } = useGetOrderPageListQuery({
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    status: selectStatus
  })

  const columns: GridColDef[] = (
    [
      {
        field: 'number',
        headerName: '订单号'
      },
      {
        field: 'dish',
        headerName: '订单菜品'
      },
      {
        field: 'address',
        headerName: '地址'
      },
      {
        field: 'deliveryTime',
        headerName: '预计送达时间'
      },
      {
        field: 'amount',
        headerName: '实收金额'
      },
      {
        field: 'remark',
        headerName: '备注'
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
    sortable: item.sortable ?? false,
    ...item
  }))

  const total = orderPageData?.data.total ?? 0
  const rows: GridRowsProp =
    orderPageData?.data.records.map(item => ({
      id: item.id,
      number: item.number,
      phone: item.phone,
      address: item.address,
      deliveryTime: item.estimatedDeliveryTime,
      amount: item.amount,
      dish: item.orderDishes,
      remark: item.remark,
      status: item.status
    })) ?? []

  return (
    <>
      <Helmet>
        <title>仪表盘</title>
      </Helmet>
      <div className={'flex min-h-full flex-col gap-5 p-5'}>
        <div className={'min-h-50 flex flex-col gap-5 rounded bg-white p-5 shadow'}>
          <div className={'flex items-center justify-between'}>
            <div className={'flex items-center gap-3'}>
              <Typography>今日数据</Typography>
              <Typography variant={'body2'}>{dayjs().format('YYYY.MM.DD')}</Typography>
            </div>
            <Button
              component={Link}
              to={'/statistics'}
              endIcon={<ArrowRightIcon className={'text-gray-400'} />}
              className={'text-gray-400'}
            >
              详细情况
            </Button>
          </div>
          <div className={'grid flex-1 grid-cols-5 gap-5'}>
            {todayDataList.map(item => (
              <DataItem key={item.title} title={item.title} value={item.value} />
            ))}
          </div>
        </div>
        <div className={'min-h-50 flex flex-col gap-5 rounded bg-white p-5 shadow'}>
          <div className={'flex items-center justify-between'}>
            <div className={'flex items-center gap-3'}>
              <Typography>订单管理</Typography>
              <Typography variant={'body2'}>{dayjs().format('YYYY.MM.DD')}</Typography>
            </div>
            <Button
              className={'text-gray-400'}
              variant={'text'}
              component={Link}
              to={'/order'}
              endIcon={<ArrowRightIcon className={'text-gray-400'} />}
            >
              订单明细
            </Button>
          </div>
          <div className={'grid flex-1 grid-cols-5 gap-5'}>
            {orderManagementList.map(item => (
              <DataItemWithIcon
                key={item.title}
                title={item.title}
                Icon={item.icon}
                number={item.number}
                color={item.color}
              />
            ))}
          </div>
        </div>
        <div className={'grid grid-cols-2 gap-5'}>
          {dishAndSetmealList.map(item => (
            <div
              className={'flex min-h-40 flex-col gap-5 rounded bg-white p-5 shadow'}
              key={item.title}
            >
              <div className={'flex items-center justify-between'}>
                <Typography>{item.title}</Typography>
                <Button
                  component={Link}
                  to={item.to}
                  className={'text-gray-400'}
                  endIcon={<ArrowRightIcon className={'text-gray-400'} />}
                >
                  {item.go}
                </Button>
              </div>
              <div className={'flex flex-1 gap-5'}>
                <div className={'grid flex-1 grid-cols-2 gap-5'}>
                  <DataItemWithIcon title={'已启售'} number={item.number[0]} Icon={PenIcon} />
                  <DataItemWithIcon title={'已停售'} number={item.number[1]} Icon={PenOffIcon} />
                </div>
                <Button
                  component={Link}
                  to={item.add}
                  color={'inherit'}
                  className={
                    'flex aspect-square h-full flex-col items-center gap-2 rounded bg-[#EEC55C] py-2 shadow'
                  }
                >
                  <PlusIcon className={'rounded-full border'} />
                  <Typography variant={'body2'}>{item.addTitle}</Typography>
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className={'min-h-70 flex flex-col gap-5 rounded bg-white p-5 shadow'}>
          <div className={'flex items-center justify-between'}>
            <Typography>订单信息</Typography>
            <div className={'flex'}>
              <ListItemButton
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#F6C343'
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: '#F6C343'
                  }
                }}
                disableGutters
                onClick={() => setSelectStatus(OrderStatus.TO_BE_CONFIRMED)}
                className={'flex items-center border border-gray-400 px-10 py-2'}
                selected={selectStatus === OrderStatus.TO_BE_CONFIRMED}
              >
                <Badge color={'error'} badgeContent={orderData?.data.waitingOrders}>
                  <Typography>待接单</Typography>
                </Badge>
              </ListItemButton>
              <ListItemButton
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#F6C343'
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: '#F6C343'
                  }
                }}
                disableGutters
                onClick={() => setSelectStatus(OrderStatus.CONFIRMED)}
                className={'flex items-center border border-gray-400 px-10 py-2'}
                selected={selectStatus === OrderStatus.CONFIRMED}
              >
                <Badge color={'error'} badgeContent={orderData?.data.deliveredOrders}>
                  <Typography>待派送</Typography>
                </Badge>
              </ListItemButton>
            </div>
          </div>
          <DataGrid
            columns={columns}
            rows={rows}
            loading={isLoading}
            disableColumnMenu
            disableColumnResize
            disableRowSelectionOnClick
            paginationMode={'server'}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={total}
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
        orderId={orderId}
        open={dialogDetailOpen}
        onClose={() => setDialogDetailOpen(false)}
        handleConfirm={handleConfirm}
        handleRejection={handleRejection}
        handleComplete={handleComplete}
        handleDelivery={handleDelivery}
        orderDetailData={orderDetailData}
      />
    </>
  )
}

export default DashBoard
