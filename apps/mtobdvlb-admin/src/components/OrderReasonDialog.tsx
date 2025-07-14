import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material'
import CommonSelect from '@/components/CommonSelect.tsx'

type Props = {
  open: boolean
  title: string
  reason: string
  inputReason: string
  setReason: (r: string) => void
  setInputReason: (r: string) => void
  onClose: () => void
  handleReason: () => void
}

const reasonList = [
  {
    label: '订单量较多，暂时无法接单',
    value: '订单量较多，暂时无法接单'
  },
  {
    label: '菜品已销售完，暂时无法接单',
    value: '菜品已销售完，暂时无法接单'
  },
  { label: '客户电话取消', value: '客户电话取消' },
  { label: '自定义原因', value: '自定义原因' }
]

const OrderReasonDialog = ({
  open,
  title,
  reason,
  inputReason,
  setReason,
  setInputReason,
  onClose,
  handleReason
}: Props) => (
  <Dialog maxWidth={'lg'} open={open} onClose={onClose}>
    <DialogTitle>{title}原因</DialogTitle>
    <DialogContent className={'w-150 flex flex-col gap-10 px-20 py-10'}>
      <div className={'flex items-center gap-5'}>
        <Typography className={'min-w-20'}>{title}原因:</Typography>
        <CommonSelect
          fullWidth
          placeholder={`请选择${title}原因`}
          options={reasonList}
          value={reason ?? ''}
          onChange={e => setReason(e.target.value as string)}
        />
      </div>
      {reason === '自定义原因' && (
        <div className={'flex items-center gap-5'}>
          <Typography className={'min-w-20'}>原因:</Typography>
          <TextField
            fullWidth
            placeholder={'请填写取消的原因'}
            value={inputReason}
            onChange={e => setInputReason(e.target.value)}
            multiline
            rows={3}
          />
        </div>
      )}
    </DialogContent>
    <DialogActions className={'pb-5 pr-5'}>
      <Button variant={'outlined'} className={'border-gray-400 text-gray-400'} onClick={onClose}>
        取消
      </Button>
      <Button variant={'contained'} className={'bg-primary text-[#333]'} onClick={handleReason}>
        确定
      </Button>
    </DialogActions>
  </Dialog>
)

export default OrderReasonDialog
