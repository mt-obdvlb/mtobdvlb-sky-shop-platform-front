import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material'
import { usePopupState } from 'material-ui-popup-state/hooks'
import { KeyboardArrowDown, KeyboardArrowUp, LockOutlined, Person } from '@mui/icons-material'
import { useEditUserPasswordMutation, useLogoutUserMutation } from '@/features/user/userApi.ts'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/features/user/userSlice.ts'
import { useState } from 'react'
import { z } from 'zod/v4'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'

const UserMenu = () => {
  const list = [
    {
      name: 'oldPassword' as const,
      label: '原始密码:',
      placeholder: '请输入原始密码',
      type: 'text'
    },
    {
      name: 'newPassword' as const,
      label: '新密码:',
      placeholder: '6 - 20位密码，数字或字母，区分大小写',
      type: 'password'
    },
    {
      name: 'confirmPassword' as const,
      label: '确认密码:',
      placeholder: '请输入确认密码',
      type: 'password'
    }
  ]

  const FormSchema = z
    .object({
      oldPassword: z.string().min(1, '请输入原始密码'),
      newPassword: z
        .string()
        .min(6, '6 - 20位密码，数字或字母，区分大小写')
        .max(20, '6 - 20位密码，数字或字母，区分大小写'),
      confirmPassword: z.string().min(1, '请输入确认密码')
    })
    .refine(data => data.newPassword === data.confirmPassword, {
      message: '密码不一致',
      path: ['confirmPassword']
    })

  type FormData = z.infer<typeof FormSchema>

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    mode: 'onChange',
    reValidateMode: 'onBlur'
  })

  const user = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [logoutUser] = useLogoutUserMutation()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editUserPassword] = useEditUserPasswordMutation()

  const menuList = [
    {
      name: user.name,
      icon: <KeyboardArrowUp />,
      onClick: () => {}
    },
    {
      name: '修改密码',
      icon: <LockOutlined />,
      onClick: () => {
        setDialogOpen(true)
      }
    },
    {
      name: '退出登录',
      icon: <Person />,
      onClick: async () => {
        try {
          await logoutUser().unwrap()
          dispatch(logout())
          navigate('/login')
        } catch (e) {
          console.log(e)
        }
      }
    }
  ]

  const popupState = usePopupState({
    variant: 'popover'
  })

  const handleMouseEnter = () => {
    popupState.open()
  }

  const handleMouseLeave = () => {
    setTimeout(() => {
      popupState.close()
    }, 200)
  }

  const onSubmit = async (data: FormData) => {
    try {
      await editUserPassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        empId: user.id
      }).unwrap()
      toast.success('修改密码成功')
      dispatch(logout())
      navigate('/login')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <div className={'flex items-center justify-center'}>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={'w-30 relative h-10 rounded bg-[#FBE2A5]' + clsx({})}
        >
          <Button
            variant={'text'}
            type={'button'}
            color={'inherit'}
            disableRipple
            className={clsx({
              'absolute flex h-full w-full cursor-pointer items-center justify-between overflow-visible px-2':
                true
            })}
          >
            <Typography variant={'body2'}>{user.name}</Typography>
            <Typography variant={'body2'} className={''}>
              <KeyboardArrowDown />
            </Typography>
          </Button>
          <Box
            bgcolor={'white'}
            className={
              'z-100 absolute left-0 top-0 flex w-full flex-col rounded ' +
              clsx({
                hidden: !popupState.isOpen
              })
            }
          >
            {menuList.map(item => (
              <Button
                variant={'text'}
                disableTouchRipple
                key={item.name}
                color={'inherit'}
                className={'w-30 flex h-10 justify-between rounded px-2'}
                onClick={item.onClick}
              >
                <Typography variant={'body2'}>{item.name}</Typography>
                <Typography variant={'body2'} className={''}>
                  {item.icon}
                </Typography>
              </Button>
            ))}
          </Box>
        </div>
      </div>
      <Dialog
        scroll={'body'}
        maxWidth={false}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>修改密码</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className={'px-30 w-170 h-70 py-10'}>
            <div className={'flex h-full w-full flex-col justify-center gap-5'}>
              {list.map(item => (
                <Box className={'pd-2 flex items-center justify-between'} key={item.name}>
                  <Typography variant={'body2'} className={'w-30'}>
                    {item.label}
                  </Typography>
                  <Controller
                    name={item.name}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        size={'small'}
                        {...field}
                        placeholder={item.placeholder}
                        error={!!errors[item.name]}
                        helperText={errors[item.name]?.message}
                        type={item.type}
                      />
                    )}
                  />
                </Box>
              ))}
            </div>
          </DialogContent>
          <DialogActions className={'px-20 pb-10'}>
            <Button size={'large'} variant={'outlined'} onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button size={'large'} variant={'contained'} type={'submit'} className={'bg-primary'}>
              保存
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default UserMenu
