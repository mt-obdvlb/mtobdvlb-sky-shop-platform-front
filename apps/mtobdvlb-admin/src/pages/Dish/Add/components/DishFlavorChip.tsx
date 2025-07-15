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
    <div className={'h-13 flex items-center gap-3'}>
      <CommonSelect
        className={'h-12.5 rounded border-gray-400 bg-white'}
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
      <div
        className={'flex h-full flex-1 gap-3 rounded border border-[#D9DDE2] bg-white px-4 py-2'}
      >
        {item.value &&
          item.value.split(',').map(item => (
            <Chip
              className={'rounded border border-[#F7CA56] bg-[#FEFBF1] text-[#F7CA56]'}
              label={item}
              deleteIcon={<XIcon className={'size-3 text-[#F7CA56]'} />}
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
