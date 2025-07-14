import { Outlet } from 'react-router-dom'
import { useProgress } from '@/hooks/useProgress.ts'
import { ConfirmProvider } from 'material-ui-confirm'
import { HelmetProvider } from 'react-helmet-async'

const App = () => {
  useProgress()
  return (
    <>
      <HelmetProvider>
        <ConfirmProvider>
          <Outlet />
        </ConfirmProvider>
      </HelmetProvider>
    </>
  )
}

export default App
