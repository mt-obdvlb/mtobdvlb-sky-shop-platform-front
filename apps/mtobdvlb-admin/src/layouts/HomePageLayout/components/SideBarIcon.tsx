import { useAppSelector } from '@/store/hooks.ts'
import { Typography } from '@mui/material'
import Logo from '@/assets/logo2.svg?react'
import clsx from 'clsx'

const SideBarIcon = () => {
  const isCollapsed = useAppSelector(state => state.shop.isCollapsed)

  return (
    <div className={'h-17 bg-primary flex shrink-0 items-center justify-center ' + clsx({})}>
      <Logo className={'size-15 text-black'} />
      {!isCollapsed && (
        <Typography variant={'h5'} fontFamily={'serif'} className={'whitespace-nowrap'}>
          MTO 外卖
        </Typography>
      )}
    </div>
  )
}

export default SideBarIcon
