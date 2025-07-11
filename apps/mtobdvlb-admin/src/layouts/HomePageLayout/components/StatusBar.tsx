import { MenuOpen } from '@mui/icons-material'
import clsx from 'clsx'
import { Typography } from '@mui/material'
import { useGetShopStatusQuery } from '@/features/shop/shopApi.ts'
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts'
import { toggleMenu } from '@/features/shop/shopSlice.ts'

const StatusBar = () => {
  const { data: res } = useGetShopStatusQuery()
  const dispatch = useAppDispatch()
  const isCollapsed = useAppSelector(state => state.shop.isCollapsed)

  const handleClick = () => {
    dispatch(toggleMenu())
  }

  return (
    <div className={'flex items-center justify-center gap-3'}>
      <MenuOpen
        className={
          'transform cursor-pointer transition duration-300 ' +
          clsx({
            'rotate-180': isCollapsed
          })
        }
        onClick={handleClick}
      />
      <Typography color={'white'} className={'rounded border border-white bg-red-500 px-2 py-1'}>
        {res?.data ? <span>营业中</span> : <span>打烊中</span>}
      </Typography>
    </div>
  )
}

export default StatusBar
