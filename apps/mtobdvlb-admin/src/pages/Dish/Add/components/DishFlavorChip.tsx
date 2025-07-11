import CommonSelect from '@/components/CommonSelect.tsx'
import { Button, Chip } from '@mui/material'
import * as React from 'react'
import { XIcon } from 'lucide-react'

type DishFlavorChipProps = {
  onDelete: () => void
  item: { name: string; value: string }
  index: number
  setFlavorList: React.Dispatch<
    React.SetStateAction<
      {
        name: string
        value: string
      }[]
    >
  >
  flavorListData: {
    name: string
    value: string[]
  }[]
  flavorList: {
    name: string
    value: string
  }[]
}

const DishFlavorChip: React.FC<DishFlavorChipProps> = ({
  onDelete,
  item,
  index,
  setFlavorList,
  flavorListData,
  flavorList
}) => {
  return (
    <div className={'flex h-11 items-center gap-3'}>
      <CommonSelect
        className={'h-full rounded border-gray-400 bg-white'}
        placeholder={'请选择口味'}
        options={flavorListData
          .filter(data => data.name === item.name || !flavorList.find(f => f.name === data.name))
          .map(item => ({
            label: item.name,
            value: item.name
          }))}
        value={item.name}
        onChange={e => {
          setFlavorList(prev => {
            prev[index].name = e.target.value as string
            prev[index].value =
              flavorListData.find(item => item.name === e.target.value)?.value.join(',') ?? ''
            return [...prev]
          })
        }}
      />
      <div className={'flex h-full flex-1 gap-3 rounded border border-gray-400 bg-white p-1'}>
        {item.value &&
          item.value.split(',').map(item => (
            <Chip
              className={'rounded bg-yellow-400'}
              label={item}
              deleteIcon={<XIcon />}
              onDelete={() => {
                setFlavorList(prev => {
                  prev[index].value = prev[index].value
                    .split(',')
                    .filter(i => i !== item)
                    .join(',')
                  console.log(prev[index])
                  if (prev[index].value.trim() === '') prev = prev.filter((_, i) => i !== index)
                  return [...prev]
                })
              }}
            />
          ))}
      </div>
      <Button
        variant={'text'}
        color={'error'}
        onClick={() => {
          onDelete()
          const index = flavorListData.findIndex(data => data.name === item.name)
          if (index === -1) return
        }}
      >
        {<>删除</>}
      </Button>
    </div>
  )
}

export default DishFlavorChip
