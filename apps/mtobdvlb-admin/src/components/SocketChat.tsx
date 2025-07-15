import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks.ts'
import { detailOrder } from '@/features/socket/socketSlice.ts'
import { type Id as ToastId, toast } from 'react-toastify'

let toastId: ToastId | null = null

const speak = (text: string) => {
  const synth = window.speechSynthesis
  if (!synth) return console.log('不支持语音提示')
  const utterance = new SpeechSynthesisUtterance(text)
  synth.speak(utterance)
}

const SocketChat = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { type, orderId } = useAppSelector(state => state.socket)

  const handleClick = useCallback(() => {
    if (toastId) toast.dismiss(toastId)
    navigate(`/order`)
    dispatch(detailOrder())
  }, [navigate, dispatch])

  useEffect(() => {
    dispatch({ type: 'socket/connect' })
    if (type === 1) {
      speak('有用户下单了')
      toastId = toast.success(
        <div className={''}>
          有新的订单，
          <span onClick={handleClick} className={'cursor-pointer text-blue-500'}>
            订单号:{orderId}请及时处理
          </span>
        </div>,
        {
          autoClose: 5000
        }
      )
    }
    if (type === 2) {
      speak('有用户催单了')
      toastId = toast.warning(
        <div className={''}>
          有用户催单，
          <span onClick={handleClick} className={'cursor-pointer text-blue-500'}>
            订单号:{orderId}请及时处理
          </span>
        </div>,
        {
          autoClose: false
        }
      )
    }
  }, [dispatch, type, orderId, handleClick])
  return <></>
}

export default SocketChat
