import type { SxProps, Theme } from '@mui/material'

declare module '@mui/x-data-grid' {
  interface BaseCheckboxPropsOverrides {
    sx?: SxProps<Theme> // 这样告诉 TS baseCheckbox 支持 sx
  }
}

declare module '@mui/material/styles' {
  interface Components {
    unstable_DataGrid?: Components['MuiButton'] // 可以继承任意已有组件结构
  }
}
