import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from '@/router'
import { Provider } from 'react-redux'
import { persistor, store } from '@/store'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { PersistGate } from 'redux-persist/integration/react'
import GlobalStyles from '@mui/material/GlobalStyles'
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import './global.css'
import * as React from 'react'
import { zhCN } from '@mui/material/locale'
import { zhCN as gridZhCN } from '@mui/x-data-grid/locales'
import 'dayjs/locale/zh-cn'
import * as dayjs from 'dayjs'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

dayjs.locale('zh-cn')

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' }
    },
    cssVariables: true
  },
  zhCN,
  gridZhCN
)

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <StyledEngineProvider enableCssLayer>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <PersistGate loading={null} persistor={persistor}>
              <RouterProvider router={router} />
              <ToastContainer autoClose={1000} />
            </PersistGate>
          </LocalizationProvider>
        </Provider>
      </StyledEngineProvider>
    </ThemeProvider>
  </React.StrictMode>
)
