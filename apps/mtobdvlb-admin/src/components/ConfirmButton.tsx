import { Button, type ButtonProps, type DialogProps } from '@mui/material'
import * as React from 'react'
import { useConfirm } from 'material-ui-confirm'

type ConfirmButtonProps = {
  children: React.ReactNode
  title?: string
  dialogProps?: Partial<DialogProps>
  confirmationButtonProps?: ButtonProps
  cancellationButtonProps?: ButtonProps
  onConfirm?: () => void | Promise<void>
  noShow?: () => boolean
} & ButtonProps

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  children,
  title = '删除',
  dialogProps = {
    maxWidth: 'xs',
    sx: {
      '& .MuiDialog-paper': {
        minHeight: '200px'
      }
    }
  },
  confirmationButtonProps = {
    variant: 'contained',
    sx: {
      backgroundColor: '#F6C443'
    }
  },
  cancellationButtonProps = {
    variant: 'contained',
    color: 'inherit'
  },
  onConfirm,
  noShow,
  ...rest
}) => {
  const confirm = useConfirm()

  const handleClick = async () => {
    if (noShow) {
      if (noShow()) return
    }
    const { confirmed } = await confirm({
      title: title,
      description: `确定要${title}吗？`,
      confirmationText: title,
      cancellationText: '取消',
      dialogProps,
      confirmationButtonProps,
      cancellationButtonProps
    })
    if (confirmed && onConfirm) {
      await onConfirm()
    }
  }

  return (
    <Button {...rest} onClick={handleClick}>
      {children}
    </Button>
  )
}

export default ConfirmButton
