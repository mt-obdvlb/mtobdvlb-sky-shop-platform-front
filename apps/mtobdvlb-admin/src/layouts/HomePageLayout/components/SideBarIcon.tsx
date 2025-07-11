import { useAppSelector } from '@/store/hooks.ts'
import { Typography } from '@mui/material'
import Logo from '@/assets/logo2.svg?react'
import clsx from 'clsx'

const SideBarIcon = () => {
  const isCollapsed = useAppSelector(state => state.shop.isCollapsed)

  return (
    <div className={'h-17 flex shrink-0 items-center justify-center bg-amber-500 ' + clsx({})}>
      <Logo className={'size-15 text-blue-400'} />
      {!isCollapsed && (
        <Typography variant={'h5'} fontFamily={'serif'} className={'whitespace-nowrap'}>
          MTO 外卖
        </Typography>
      )}
    </div>
  )
}

export default SideBarIcon
