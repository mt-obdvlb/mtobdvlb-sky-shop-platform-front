import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material'
import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useGetShopStatusQuery, useSetShopStatusMutation } from '@/features/shop/shopApi.ts'
import type { ShopStatus } from '@/types/shop.ts'
import clsx from 'clsx'

const ShopStatusConfig = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: res } = useGetShopStatusQuery()
  const [setShopStatusAPI] = useSetShopStatusMutation()
  const list = [
    {
      label: '营业中',
      description: '当前餐厅处于营业状态，自动接收任何订单，可点击打烊进入店铺打烊状态。',
      value: 1 as ShopStatus
    },
    {
      label: '打烊中',
      description:
        '当前餐厅处于打烊状态，仅接受营业时间内的预定订单，可点击营业中手动恢复营业状态。',
      value: 0 as ShopStatus
    }
  ]
  const [shopStatus, setShopStatus] = useState<ShopStatus>()

  useEffect(() => {
    setShopStatus(res?.data)
  }, [res?.data])

  const handleSubmit = async () => {
    try {
      await setShopStatusAPI(shopStatus!).unwrap()

      setDialogOpen(false)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        color={'inherit'}
        className={'w-35 mr-5 flex h-full items-center justify-center rounded-none'}
      >
        <Typography
          className={'flex items-center justify-center'}
          variant={'body2'}
          color={'inherit'}
        >
          <Clock fontSize={'inherit'} className={'mr-1'} />
          营业状态管理
        </Typography>
      </Button>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>营业状态设置</DialogTitle>
        <form>
          <DialogContent>
            <RadioGroup>
              {list.map(item => (
                <div
                  onClick={() => setShopStatus(item.value)}
                  className={
                    'max-w-75 mb-1 mt-3 cursor-pointer rounded border px-5 py-2 ' +
                    clsx({
                      'border-[#F6C343]': item.value === shopStatus,
                      'border-gray-400': item.value !== shopStatus
                    })
                  }
                  key={item.label}
                >
                  <FormControlLabel
                    className={'border-none'}
                    control={
                      <Radio
                        sx={{
                          color: 'gray',
                          '&.Mui-checked': {
                            color: '#F6C343'
                          }
                        }}
                        color={'default'}
                        size={'small'}
                        onChange={() => setShopStatus(item.value)}
                        value={item.value}
                        checked={item.value === shopStatus}
                      />
                    }
                    label={item.label}
                  />
                  <Typography color={'text.secondary'}>{item.description}</Typography>
                </div>
              ))}
            </RadioGroup>
          </DialogContent>
          <DialogActions className={'px-5 pb-5'}>
            <Button
              onClick={() => setDialogOpen(false)}
              className={'border-gray-400 text-gray-400'}
              variant={'outlined'}
            >
              取消
            </Button>
            <Button
              type={'submit'}
              onClick={handleSubmit}
              className={'bg-primary text-black'}
              variant={'contained'}
            >
              确认
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default ShopStatusConfig
