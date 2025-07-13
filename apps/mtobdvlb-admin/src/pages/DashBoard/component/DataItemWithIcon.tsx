import * as React from 'react'
import { Typography } from '@mui/material'

type DataItemWithIconProps = {
  title: string
  number: number
  Icon: React.ElementType
  color?: string
}

const DataItemWithIcon: React.FC<DataItemWithIconProps> = ({ title, number, Icon, color }) => {
  return (
    <div className={'flex items-center justify-between rounded bg-[#FEFBF1] px-5'}>
      <div className={'flex h-full items-center gap-3'}>
        <Icon />
        <Typography variant={'body2'}>{title}</Typography>
      </div>
      <Typography variant={'h5'} color={color}>
        {number}
      </Typography>
    </div>
  )
}

export default DataItemWithIcon
