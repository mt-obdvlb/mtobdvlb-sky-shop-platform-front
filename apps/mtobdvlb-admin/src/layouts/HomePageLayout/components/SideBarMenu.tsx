import { List, ListItemButton, ListItemIcon, Typography } from '@mui/material'
import { NavLink, useLocation } from 'react-router-dom'
import {
  ChartLineIcon,
  LayoutDashboardIcon,
  ListOrderedIcon,
  MenuIcon,
  PresentationIcon,
  SatelliteDishIcon,
  UserIcon
} from 'lucide-react'
import { useAppSelector } from '@/store/hooks.ts'

const SideBarMenu = () => {
  const menuList = [
    {
      name: '工作台',
      icon: <LayoutDashboardIcon />,
      path: '/dashboard'
    },
    {
      name: '数据统计',
      icon: <ChartLineIcon />,
      path: '/statistics'
    },
    {
      name: '订单管理',
      icon: <ListOrderedIcon />,
      path: '/order'
    },

    {
      name: '套餐管理',
      icon: <PresentationIcon />,
      path: '/setmeal'
    },

    {
      name: '菜品管理',
      icon: <SatelliteDishIcon />,
      path: '/dish'
    },
    {
      name: '分类管理',
      icon: <MenuIcon />,
      path: '/category'
    },
    {
      name: '员工管理',
      icon: <UserIcon />,
      path: '/employee'
    }
  ]

  const location = useLocation()
  const isCollapsed = useAppSelector(item => item.shop.isCollapsed)

  return (
    <List
      color={'black'}
      className={'relative flex flex-col gap-5 overflow-hidden bg-orange-500 px-2 pt-10'}
    >
      {menuList.map(item => (
        <ListItemButton
          selected={location.pathname === item.path}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              color: 'purple'
            },
            color: 'inherit'
          }}
          to={item.path}
          component={NavLink}
          key={item.name}
          className={'flex w-full items-center gap-2 rounded py-3'}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          {!isCollapsed && <Typography className={'whitespace-nowrap'}>{item.name}</Typography>}
        </ListItemButton>
      ))}
    </List>
  )
}

export default SideBarMenu
