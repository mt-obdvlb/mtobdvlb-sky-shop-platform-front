import LoginForm from '@/pages/Login/components/LoginForm.tsx'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/types'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const token = useSelector((state: RootState) => state.user.token)
  const navigate = useNavigate()
  useEffect(() => {
    if (token) navigate('/')
  }, [token, navigate])

  return (
    <>
      <div className={'flex h-screen w-screen items-center justify-center bg-slate-100'}>
        <LoginForm />
      </div>
    </>
  )
}

export default Login
