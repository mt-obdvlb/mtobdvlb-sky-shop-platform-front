import { Outlet } from 'react-router-dom'
import { useProgress } from '@/hooks/useProgress.ts'
import { ConfirmProvider } from 'material-ui-confirm'

const App = () => {
  useProgress()
  return (
    <>
      <ConfirmProvider>
        <Outlet />
      </ConfirmProvider>
    </>
  )
}

export default App
