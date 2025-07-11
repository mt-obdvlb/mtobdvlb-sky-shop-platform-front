import 'nprogress/nprogress.css'
import nprogress from 'nprogress'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

nprogress.configure({
  showSpinner: false,
  trickleSpeed: 100
})

export const useProgress = () => {
  const location = useLocation()

  useEffect(() => {
    nprogress.start()

    // 在微任务或 setTimeout 中关闭，确保 DOM 已完成更新
    const timeout = setTimeout(() => {
      nprogress.done()
    }, 300) // 可根据页面加载速度调整

    return () => {
      clearTimeout(timeout)
    }
  }, [location.pathname])
}
