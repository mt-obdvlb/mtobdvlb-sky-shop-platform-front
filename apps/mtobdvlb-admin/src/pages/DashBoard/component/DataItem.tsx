import * as React from 'react'
import { Typography } from '@mui/material'

type DataItemProps = {
  title: string
  value: string | number
}

const DataItem: React.FC<DataItemProps> = ({ title, value }) => {
  return (
    <div className={'flex flex-col gap-3 rounded bg-[#FEFBF1] p-5'}>
      <Typography variant={'body2'}>{title}</Typography>
      <Typography variant={'h4'}>{value}</Typography>
    </div>
  )
}

export default DataItem
